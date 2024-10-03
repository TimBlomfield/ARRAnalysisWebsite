'use client';

import { signOut } from 'next-auth/react';
// Components
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const SignOutButton = () => {
  return (
    <PushButton extraClass={styles.btn}
                onClick={() => {
                  signOut({ callbackUrl: '/login', redirect:true });
                }}>
      Sign Out
    </PushButton>
  );
};


export default SignOutButton;
