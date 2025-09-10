// Components
import LinkButton from '@/components/LinkButton';
// Styles
import styles from './not-found.module.scss';


const NotFoundPage = () => {
  return (
    <div className={styles.main}>
      <section className={styles.mid}>
        <div className={styles.errorTitle}>Page not found</div>
        <div className={styles.errorDetail}>The requested resource could not be found on our website. The URL you entered may be incorrect, or the page may have been moved or deleted.</div>
        <LinkButton href="/login">
          Back to Login
        </LinkButton>
      </section>
    </div>
  );
};


export default NotFoundPage;
