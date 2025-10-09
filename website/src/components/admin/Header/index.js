import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/server/auth';
import db from '@/utils/server/db';
// Components
import ExtraHeaderContent from '@/components/admin/ExtraHeaderContent';
import SignOutButton from '@/components/SignOutButton';
import SignOutHelper from '@/components/SignOutHelper';
// Styles
import styles from './styles.module.scss';


const Header = async () => {
  let bAdmin = false, bCustomer = false, bUser = false;
  let name = '', email = '';
  try {
    const session = await getServerSession(authOptions);

    const userData = await db.userData.findUnique({
      where: { email: session.token.email },
      include: {
        admin: true,
        customer: true,
        user: true,
      },
    });

    if (userData == null)
      throw new Error(`UserData not found for ${session.token.email}. <Header> component, Admin section.`); // Unexpected error

    name = [userData.firstName, userData.lastName].join(' ').trim();
    email = userData.email;
    bAdmin = userData.admin != null;
    bCustomer = userData.customer != null;
    bUser = userData.user != null;

  } catch (error) {
    const message = error?.message ?? 'Something went wrong (Header error)!';
    console.error(message);
    return <SignOutHelper />;
  }

  return (
    <div className={styles.header}>
      <div className={styles.info}>
        <div className={styles.naming}>
          {name && <div className={styles.name}>{name}</div>}
          <div className={styles.email}>{email}</div>
        </div>
        <div className={styles.roleCards}>
          {bAdmin && <div className={styles.card}>Admin</div>}
          {bCustomer && <div className={styles.card}>Customer</div>}
          {bUser && <div className={styles.card}>User</div>}
        </div>
      </div>
      <ExtraHeaderContent />
      <SignOutButton />
    </div>
  );
};


export default Header;
