import cn from 'classnames';

import Link from 'next/link';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const LinkButton = ({theme = K_Theme.Dark, invertBkTheme = false, disabled = false, extraClass = '', href, children, ...attr}) => {
  return (
    <Link className={cn(styles.button, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.invertBkTheme]: invertBkTheme}, extraClass)}
          {...(disabled ? { 'aria-disabled': true, tabIndex: -1, href: '#' } : { href: href })}
          {...attr}>
      <div className={styles.text}>
        {children}
      </div>
      <div className={styles.inner} />
    </Link>
  );
};


export default LinkButton;
