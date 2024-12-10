import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid } from '@/utils/server/common';
import { encodeLicenseId } from '@/utils/server/licenses';
import db from '@/utils/server/db';
// Components
import LicenseItem from '@/components/LicenseItem';
// Styles
import styles from './styles.module.scss';


const LicensesPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  if (token.userData.customerId == null)
    notFound();

  let licenseData;

  try {
    const customer = await db.customer.findUnique({
      where: { id: token.userData.customerId },
      include: { users: true },
    });

    if (customer == null) throw new Error('Customer not found!');
    if (typeof customer.id_stripeCustomer !== 'string' || customer.id_stripeCustomer.length < 2) throw new Error('Invalid Stripe CustomerID encountered!');

    const { data: customerData } = await axios.get('https://saas.licensespring.com/api/v1/customers/', {
      headers: {
        Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
      },
      params: {
        reference: customer.id_stripeCustomer,
      },
    });

    if (customerData == null) throw new Error('Null fetch for customer');
    if (customerData.count !== 1) {
      if (customerData.count === 0) throw new Error('No customers found for the specified Stripe CustomerID');
      else if (customerData.count > 1) throw new Error('Multiple customers with the same Stripe CustomerID encountered!');
    }
    const licenseSpringCustomer = customerData.results[0];

    const { data } = await axios.get('https://saas.licensespring.com/api/v1/licenses/', {
      headers: {
        Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
      },
      params: {
        customer_id: licenseSpringCustomer.id,
      },
    });

    licenseData = data;
    if (licenseData == null) throw new Error('Null fetch for licenses');

    // Delete expired registration links
    const now = new Date();
    await db.registrationLink.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    // Collect the emails sent to users for each license, and put them in the license object
    for (const license of licenseData.results) {
      const regLinks = await db.registrationLink.findMany({
        where: { licenseId: license.id },
      });
      if (regLinks != null) {
        license.mailsSent = regLinks.reduce((acc, cur) => [...acc, { email: cur.email, id: cur.id, token: cur.token, f: cur.firstName, l: cur.lastName } ], []);
      }
      if (Array.isArray(customer.users)) {
        // Which customers have this license
        const usersForThisLicense = customer.users.reduce((acc, cur) => {
          if (cur.licenseIds.includes(BigInt(license.id)))
            acc.push(cur.id_UserData);
          return acc;
        }, []);

        license.portalUsers = []; // This will contain all users that are assigned in LicenseSpring
        for (const udId of usersForThisLicense) {
          const usrData = await db.userData.findUnique({ where: { id: udId }});
          const bIsAssigned = license.license_users.some(elem => elem.true_email === usrData.email);  // Assigned in license spring
          if (!bIsAssigned)
            license.portalUsers.push({
              firstName: usrData.firstName,
              lastName: usrData.lastName,
              email: usrData.email,
            });
        }
      }
      license.portalCustomerId = customer.id;
      license.encodedId = encodeLicenseId(license.id);
    }
  } catch (err) {
    console.error(err);
    notFound();
  }

  if (licenseData.count === 0)
    return (
      <div className={styles.fullScreenCentrer}>
        <div className={styles.ct}>No licenses found</div>
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.title}>Purchased Licenses [{licenseData.results.length}]</div>
      <div className={styles.licenseList}>
        {licenseData.results.map(license => <LicenseItem key={license.id} license={license} />)}
      </div>
    </div>
  );
};


export default LicensesPage;
