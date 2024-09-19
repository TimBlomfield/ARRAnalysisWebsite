'use client';

import { useEffect, useState } from 'react';
import { checkPhoneOrTablet } from '@/utils/client/device';
// Styles
import styles from './styles.module.scss';


const ScrollbarClientStyles = () => {
  // NOTE: The following line is executed on the server as well, even though this is a client side component. That's why
  // we must load this component dynamically using dynamic from next/dynamic.
  // The problem is checkPhoneOrTablet() which accesses client properties (namely: navigator and window)
  const [isPhoneOrTablet] = useState(() => checkPhoneOrTablet());

  useEffect(() => {
    if (!isPhoneOrTablet)
      document.body.classList.add(styles.ffScroll, styles.chScroll);
  }, [isPhoneOrTablet]);

  return null;
};

export default ScrollbarClientStyles;
