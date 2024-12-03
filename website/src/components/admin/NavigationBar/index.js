import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid, getACU_Ids } from '@/utils/server/common';
// Components
import Link from 'next/link';
// Styles
import styles from './styles.module.scss';
import db from '@/utils/server/db';


const NavigationBar = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const acuIds = await getACU_Ids(token.email);
  if (acuIds == null)
    redirect('/login');

  const isCustomer = acuIds.customerId != null;
  const isUser = acuIds.userId != null;

  return (
    <div className={styles.navbar}>
      <Link href="/admin/dashboard">Dashboard</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/profile" prefetch={false}>Profile</Link>
      {isCustomer &&
        <>
          <div style={{ minHeight: 20 }} />
          <Link href="/admin/subscriptions" prefetch={false}>Subscriptions</Link>
          <div style={{ minHeight: 20 }} />
          <Link href="/admin/licenses" prefetch={false}>Customer Licenses</Link>
        </>
      }
      {isUser &&
        <>
          <div style={{ minHeight: 20 }} />
          <Link href="/admin/user-licenses" prefetch={false}>User Licenses</Link>
        </>
      }
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/downloads" prefetch={false}>Downloads</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/purchase" prefetch={false}>Purchase</Link>
    </div>
  );
};


export default NavigationBar;
