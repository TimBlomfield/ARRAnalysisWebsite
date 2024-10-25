import cn from 'classnames';
import Link from 'next/link';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const LinkButton = ({theme = K_Theme.Dark, extraClass = '', children, ...attr}) => {
  return (
    <Link className={cn(styles.button, theme === K_Theme.Dark ? styles.dark : styles.light, extraClass)}
          {...attr}>
      <div className={styles.text}>
        {children}
      </div>
      <div className={styles.inner} />
    </Link>
  );
};


export default LinkButton;
