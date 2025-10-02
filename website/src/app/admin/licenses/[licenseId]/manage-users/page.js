import { notFound } from 'next/navigation';
import axios from 'axios';
import loggedInCheck from '@/utils/server/logged-in-check';
import { decodeLicenseId } from '@/utils/server/licenses';
import db from '@/utils/server/db';
// Components
import ManageLicenseUsersPage from '@/components/forms/ManageLicenseUsersPage';


const ManageUsersPage = async ({ params: { licenseId } }) => {
  const { acuIds } = await loggedInCheck(false, false, true);

  let license = null, customer = null;
  try {
    const licenseSpringLicenseId = decodeLicenseId(licenseId);

    const { data } = await axios.get(`https://saas.licensespring.com/api/v1/licenses/${licenseSpringLicenseId}/`, {
      headers: {
        Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
      },
    });
    license = { ...data };

    customer = await db.customer.findUnique({
      where: { id: acuIds.customerId },
      include: {
        userCustomer: {
          include: {
            user: {
              include: { data: true },
            },
          },
        },
        data: true,
      },
    });

    if (customer == null) throw new Error('Customer not found!');
    if (typeof customer.id_stripeCustomer !== 'string' || customer.id_stripeCustomer.length < 2) throw new Error('Invalid Stripe CustomerID encountered!');

    // Delete expired registration links
    const now = new Date();
    await db.registrationLink.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    const regLinks = await db.registrationLink.findMany({
      where: { licenseId: license.id },
    });
    if (regLinks != null) {
      license.mailsSent = regLinks.reduce((acc, cur) => [...acc, { email: cur.email, id: cur.id, token: cur.token, f: cur.firstName, l: cur.lastName } ], []);
    }

    // Reduce customer users to only users of this license
    customer.users = customer.userCustomer.reduce((acc, cur) => {
      const { user } = cur;
      if (user.licenseIds.includes(BigInt(license.id))) {
        user.using = Array.isArray(license.license_users) && license.license_users.some(elem => elem.true_email === user.data.email);
        acc.push(user);
      }
      return acc;
    }, []);
  } catch (err) {
    console.error(err);
    notFound();
  }

  return <ManageLicenseUsersPage license={license} customer={customer} />;
};


export default ManageUsersPage;
