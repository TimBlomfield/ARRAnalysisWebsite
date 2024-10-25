import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import axios from 'axios';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid } from '@/utils/server/common';
import { decodeLicenseId } from '@/utils/server/licenses';
import db from '@/utils/server/db';
import ManageLicenseUsersPage from '@/components/forms/ManageLicenseUsersPage';


const ManageUsersPage = async ({ params: { licenseId } }) => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  if (token.userData.customerId == null)
    notFound();

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
      where: { id: token.userData.customerId },
      include: {
        users: {
          include: { data: true },
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

  } catch (err) {
    console.error(err);
    notFound();
  }

  return <ManageLicenseUsersPage license={license} customer={customer} />;
};


export default ManageUsersPage;
