import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const LoadingSSR = ({theme = K_Theme.Dark, scale = 1, text}) => {
  return (
    <div className={cn(styles.main, {[styles.light]: theme === K_Theme.Light})}>
      <div className={styles.wrapper} style={{ padding: 10*scale }}>
        <div className={styles.loader} style={{scale}} />
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};


export default LoadingSSR;
