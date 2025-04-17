
import Link from 'next/link';
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
    </main>
  );
};


export default LoginPage;
