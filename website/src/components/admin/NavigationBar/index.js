import styles from './styles.module.scss';
import Link from 'next/link';


const NavigationBar = () => {
  return (
    <div className={styles.navbar}>
      <Link href="/admin/dashboard">Dashboard</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/profile" prefetch={false}>Profile</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/licenses" prefetch={false}>Customer Licenses</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/subscription" prefetch={false}>Subscription Status</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/user-licenses" prefetch={false}>User Licenses</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/downloads" prefetch={false}>Downloads</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/purchase" prefetch={false}>Purchase</Link>
    </div>
  );
};


export default NavigationBar;
