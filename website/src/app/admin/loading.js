import { K_Theme } from '@/utils/common';
// Components
import LoadingSSR from '@/components/LoadingSSR';
// Styles
import styles from './layout.module.scss';


// Common fullscreen loading page for all pages under /admin
const LoadingPage = () => {
  return (
    <div className={styles.fullScreenLoading}>
      <LoadingSSR scale={2} theme={K_Theme.Light} />
    </div>
  );
};


export default LoadingPage;
