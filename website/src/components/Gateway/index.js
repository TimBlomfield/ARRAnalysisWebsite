'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';


const Gateway = ({ portalId, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return portalId ? createPortal(children, document.getElementById(portalId)) : <>{children}</>;
};


export default Gateway;
