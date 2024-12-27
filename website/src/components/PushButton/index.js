'use client';

import { forwardRef } from 'react';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const PushButton = forwardRef(({theme = K_Theme.Dark, invertBkTheme = false, extraClass = '', textExtraClass = '',
  children, type = 'button', ...attr}, ref) => {
  return (
    <button ref={ref}
            className={cn(styles.pushButton, {
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
});

PushButton.displayName = 'PushButton';


export default PushButton;
