'use client';

import cn from 'classnames';
import { Button_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const PushButton = ({theme = Button_Theme.Dark, onClick, children}) => {
  return (
    <button className={cn(styles.pushButton, theme === Button_Theme.Dark ? styles.dark : styles.light)} onClick={onClick}>{children}</button>
  )
};


export default PushButton;
