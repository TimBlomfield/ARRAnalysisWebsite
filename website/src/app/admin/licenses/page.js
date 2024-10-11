import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid } from '@/utils/server/common';
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
    if (customerData.count !== 1) throw new Error('Multiple customers with the same Stripe CustomerID encountered!');
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

    // Collect the emails sent to users for each license, and put them in the license object
    for (const license of licenseData.results) {
      const regLinks = await db.registrationLink.findMany({
        where: { licenseId: license.id },
      });
      if (regLinks != null) {
        license.mailsSent = regLinks.reduce((acc, cur) => [...acc, { email: cur.email, id: cur.id } ], []);
      }
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
    <div className={styles.licenseList}>
      <div className={styles.title}>Licenses for {token.userData.email}</div>
      {licenseData.results.map(license => <LicenseItem key={license.id} license={license} />)}
    </div>
  );
};


export default LicensesPage;
