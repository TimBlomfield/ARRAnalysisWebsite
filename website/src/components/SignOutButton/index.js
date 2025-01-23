'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import axios from 'axios';
// Components
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const SignOutButton = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <PushButton extraClass={styles.btnSignOut}
                disabled={disabled}
                onClick={() => {
                  setDisabled(true);
                  axios.post('/api/audit-log/logout')
                    .then(res => {
                      signOut({ callbackUrl: '/login', redirect:true });
                    })
                    .catch(err => {
                      setDisabled(false);
                    });
                }}>
      Sign Out
    </PushButton>
  );
};


export default SignOutButton;
