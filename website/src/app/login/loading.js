// Components
import LoadingSSR from '@/components/LoadingSSR';
// Styles
import styles from './loading.module.scss';


const LoadingPage = () => (
  <div className={styles.loadingScreen}>
    <LoadingSSR scale={1.5} /> {/* Note: Cannot use a client component here. */}
  </div>
);


export default LoadingPage;
