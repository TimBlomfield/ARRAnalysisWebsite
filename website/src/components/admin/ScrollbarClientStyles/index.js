'use client';

import { useEffect, useState } from 'react';
import { checkPhoneOrTablet } from '@/utils/client/device';
// Styles
import styles from './styles.module.scss';


const ScrollbarClientStyles = () => {
  const [isPhoneOrTablet] = useState(() => checkPhoneOrTablet());

  useEffect(() => {
    if (!isPhoneOrTablet)
      document.body.classList.add(styles.ffScroll, styles.chScroll);
  }, [isPhoneOrTablet]);

  return null;
};

export default ScrollbarClientStyles;
