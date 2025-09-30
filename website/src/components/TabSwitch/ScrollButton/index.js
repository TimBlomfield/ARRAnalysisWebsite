// Node modules
import React from 'react';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Images
import ArrowLeftSvg from '@/../public/ArrowLeft.svg';


const ScrollButton = ({ theme = K_Theme.Dark, styles, right = false, onClick }) => {
  return (
    <button className={styles.scrollButton} onClick={onClick} tabIndex={-1}>
      <ArrowLeftSvg className={cn(styles.tri, {[styles.right]: right})} />
    </button>
  );
};


export default ScrollButton;
