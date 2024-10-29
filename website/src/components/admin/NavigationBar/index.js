import styles from './styles.module.scss';
import Link from 'next/link';


const NavigationBar = () => {
  return (
    <div className={styles.navbar}>
      <Link href="/admin/dashboard">Dashboard</Link>
      <div style={{ minHeight: 20 }} />
      <Link href="/admin/licenses" prefetch={false}>Customer Licenses</Link>
    </div>
  );
};


export default NavigationBar;
