'use client';

import { useEffect } from 'react';

const PreviewLayout = ({ children }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return <>{children}</>;
};

export default PreviewLayout;
