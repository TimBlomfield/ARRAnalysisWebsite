import cn from 'classnames';
import Link from 'next/link';
import { LinkButton_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const LinkButton = ({href, theme = LinkButton_Theme.Dark, children, ...attr}) => {
  return (
    <Link className={cn(styles.button, theme === LinkButton_Theme.Dark ? styles.dark : styles.light)}
          {...attr}
          href={href}>
      <div className={styles.text}>
        {children}
      </div>
      <div className={styles.inner} />
    </Link>
  );
};


export default LinkButton;
