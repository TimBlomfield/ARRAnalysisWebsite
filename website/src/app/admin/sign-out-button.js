'use client';

import PushButton from '@/components/PushButton';
import { signOut } from 'next-auth/react';

// NOTE: A temporary component which demonstrates how to sign out with next-auth
const SignOutButton = () => {
  return (
    <PushButton onClick={() => {
      signOut({ callbackUrl: '/login', redirect:true });
    }}>Sign Out</PushButton>
  );
};


export default SignOutButton;
