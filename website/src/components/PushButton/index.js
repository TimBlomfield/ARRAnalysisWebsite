'use client';

import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const PushButton = ({theme = K_Theme.Dark, extraClass='', children, ...attr}) => {
  return (
    <button className={cn(styles.pushButton, theme === K_Theme.Dark ? styles.dark : styles.light, extraClass)}
            {...attr}>
      <div className={styles.text}>
        {children}
      </div>
      <div className={styles.inner} />
    </button>
  );
};


export default PushButton;
