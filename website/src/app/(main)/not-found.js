// Components
import AnimateX from '@/components/AnimateX';
import Footer from '@/components/Footer';
// Styles
import styles from './not-found.module.scss';


const NotFoundPage = () => {
  return (
    <AnimateX>
      <div className={styles.main}>
        <section className={styles.mid}>
          <div className={styles.errorTitle}>Page not found</div>
          <div className={styles.errorDetail}>The requested resource could not be found on our website. The URL you entered may be incorrect, or the page may have been moved or deleted.</div>
          <div className={styles.errorDetail}>Use the navigation menu above or the links in the footer below to browse available pages.</div>
        </section>
        <Footer />
      </div>
    </AnimateX>
  );
};


export default NotFoundPage;
