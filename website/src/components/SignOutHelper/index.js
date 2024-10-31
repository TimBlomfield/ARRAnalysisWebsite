'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';


// Helper for server-side logout
const SignOutHelper = () => {
  useEffect(() => {
    signOut({ callbackUrl: '/login', redirect:true });
  }, []);

  return null;
};


export default SignOutHelper;
