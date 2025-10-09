// Components
import LoadingSSR from '@/components/LoadingSSR';
// Styles
import styles from '../loading.module.scss';


const LoadingPage = () => {
  return (
    <div className={styles.fullScreenLoading}>
      <LoadingSSR scale={2} />
    </div>
  );
};


export default LoadingPage;
