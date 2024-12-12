// Styles
import styles from './not-found.module.scss';

const NotFoundPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.txt1}>Sorry, this page isn&apos;t available.</div>
      <div className={styles.txt2}>The link you followed may be broken, or the page may have been removed.</div>
    </div>
  );
};


export default NotFoundPage;
