import { K_Theme } from '@/utils/common';
// Components
import LoadingSSR from '@/components/LoadingSSR';
// Styles
import styles from './styles.module.scss';


const LoadingLicensesPage = () => {
  return (
    <div className={styles.fullScreenLoading}>
      <LoadingSSR scale={2} theme={K_Theme.Light} />
    </div>
  );
};


export default LoadingLicensesPage;
