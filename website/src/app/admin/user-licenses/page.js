import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import db from '@/utils/server/db';
import { isAuthTokenValid } from '@/utils/server/common';
import { authOptions } from '@/utils/server/auth';
// Components
import UserLicenseItem from '@/components/UserLicenseItem';
// Styles
import styles from '@/app/admin/licenses/styles.module.scss';


const UserLicensesPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

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
      <div className={styles.licenseList}>
        {licenses.map(license => <UserLicenseItem key={license.id} license={license} />)}
      </div>
    </div>
  );
};


export default UserLicensesPage;
