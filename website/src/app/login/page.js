
import Link from 'next/link';
import { DateTime } from 'luxon';
// Components
import AdminLoginForm from '@/components/forms/AdminLoginForm';
// Images
import LogoBlueSvg from '@/../public/logo-blue.svg';
// Styles
import styles from './page.module.scss';


const LoginPage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.topArea}>
        <Link href="/"><LogoBlueSvg className={styles.logo} /></Link>
        <div className={styles.adm}>Admin Console</div>
      </section>
      <section className={styles.form}>
        <AdminLoginForm />
      </section>
      <section className={styles.bottomArea}>
        <div className={styles.copyright}>© {DateTime.now().year} ARR Analysis</div>
        &nbsp;·&nbsp;
        <Link href="/help-center" className={styles.link}>Help Center</Link>
        &nbsp;·&nbsp;
        <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
        &nbsp;·&nbsp;
        <Link href="/terms" className={styles.link}>Terms of Use</Link>
      </section>
    </main>
  );
};


export default LoginPage;
