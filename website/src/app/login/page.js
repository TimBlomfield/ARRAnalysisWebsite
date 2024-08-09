import AdminLoginForm from '@/components/forms/AdminLoginForm';
// Styles
import styles from './page.module.scss';


const LoginPage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.topArea}>
        <div className={styles.arr}>ARR Analysis</div>
        <div className={styles.adm}>Admin Console</div>
      </section>
      <section className={styles.form}>
        <AdminLoginForm />
      </section>
    </main>
  );
};


export default LoginPage;
