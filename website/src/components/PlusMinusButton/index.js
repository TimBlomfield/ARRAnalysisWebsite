'use client';

import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const PlusMinusButton = ({ theme = K_Theme.Dark, invertBkTheme = false, extraClass = '', extraBtnClass = '', onLess, onMore, ...attr }) => {
  return (
    <div className={cn(styles.wrapper, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.invertBkTheme]: invertBkTheme}, extraClass)}>
      <button type="button" className={cn(styles.button, styles.left, extraBtnClass)} onClick={onLess} {...attr}>-</button>
      <button type="button" className={cn(styles.button, styles.right, extraBtnClass)} onClick={onMore} {...attr}>+</button>
    </div>
  );
};


export default PlusMinusButton;
