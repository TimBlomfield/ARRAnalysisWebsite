// Styles
import styles from './not-found.module.scss';


const NotFoundPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.errorCode}>404</div>
      <div className={styles.errorTitle}>Page Not Found</div>
      <div className={styles.errorMessage}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec dignissim mauris. Donec facilisis turpis urna, eu scelerisque massa pulvinar semper. Cras sed porttitor odio. In vestibulum aliquet eros non sodales. In tincidunt maximus ex quis imperdiet. Praesent porttitor nec nunc nec lacinia. Phasellus tempor rhoncus justo, id ultrices metus auctor vitae. Duis id blandit metus, sit amet feugiat lacus. Suspendisse euismod augue sed porta commodo. Sed volutpat enim vel dolor vestibulum fringilla pellentesque nec nisl.</div>
    </div>
  );
};


export default NotFoundPage;
