// Components
import LoadingSSR from '@/components/LoadingSSR';
// Styles
import styles from './loading.module.scss';


// Common fullscreen loading page for all pages under /(main)
const LoadingPage = () => {
  return (
    <div className={styles.fullScreenLoading}>
      <LoadingSSR scale={2} />
    </div>
  );
};


export default LoadingPage;
