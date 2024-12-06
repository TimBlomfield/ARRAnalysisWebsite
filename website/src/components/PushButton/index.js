'use client';

import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const PushButton = ({theme = K_Theme.Dark, invertBkTheme = false, extraClass = '', textExtraClass = '', children, type = 'button', ...attr}) => {
  return (
    <button className={cn(styles.pushButton, {
      [styles.dark]: theme === K_Theme.Dark,
      [styles.light]: theme === K_Theme.Light,
      [styles.red]: theme === K_Theme.Danger,
      [styles.invertBkTheme]: invertBkTheme,
    }, extraClass)}
            type={type}
            {...attr}>
      <div className={cn(styles.text, textExtraClass)}>
        {children}
      </div>
      <div className={styles.inner} />
    </button>
  );
};


export default PushButton;
