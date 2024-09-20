import { K_Theme } from '@/utils/common';
// Components
import Loading from '@/components/Loading';
// Styles
import styles from './styles.module.scss';


const LoadingLicensesPage = () => {
  return (
    <div className={styles.fullScreenLoading}>
      <Loading scale={2} theme={K_Theme.Light} />
    </div>
  );
};


export default LoadingLicensesPage;
