import cn from 'classnames';
// Components
import LoadingSSR from '@/components/LoadingSSR';
// Styles
import styles from '../../loading.module.scss';


// Common fullscreen loading page for all pages under /purchase
const LoadingPage = () => {
  return (
    <div className={cn(styles.fullScreenLoading, styles.checkout)}>
      <LoadingSSR scale={2} />
    </div>
  );
};

export default LoadingPage;
