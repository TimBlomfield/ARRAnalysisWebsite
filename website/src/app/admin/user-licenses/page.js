import { notFound } from 'next/navigation';
import axios from 'axios';
import db from '@/utils/server/db';
import loggedInCheck from '@/utils/server/logged-in-check';
// Components
import Footer from '@/components/admin/Footer';
import UserLicenseItem from '@/components/UserLicenseItem';
// Styles
import styles from './styles.module.scss';


const UserLicensesPage = async () => {
  const { token } = await loggedInCheck(false, true, false);

  const userData = await db.userData.findUnique({
    where: { email: token.email },
    include: { user: true },
  });
  if (userData?.user == null)
    notFound();

  if (userData.user.licenseIds.length === 0)
    return (
      <div className={styles.fullScreenCentrer}>
        <div className={styles.ct}>No licenses found</div>
      </div>
    );

  const licenses = [];

  try {
    for (const lid of userData.user.licenseIds) {
      const { data: licenseData } = await axios.get(`https://saas.licensespring.com/api/v1/licenses/${lid}`, {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      });
      licenses.push(licenseData);
    }
  } catch (err) {
    console.error(err);
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.title}>Licenses</div>
      <div className={styles.listAndFooter}>
        <div className={styles.licenseList}>
          {licenses.map(license => <UserLicenseItem key={license.id} license={license} email={userData.email} />)}
        </div>
        <div className={styles.spacer} />
        <Footer />
      </div>
    </div>
  );
};


export default UserLicensesPage;
