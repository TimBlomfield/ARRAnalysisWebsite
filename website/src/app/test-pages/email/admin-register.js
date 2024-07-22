'use client';

import { useCallback, useState } from 'react';
import { K_Theme } from '@/utils/common';
import { validateUnicodeEmail } from '@/utils/validators';
// Components
import Input from '@/components/Input';
import PasswordStrength from '@/components/PasswordStrength';
import PushButton from '@/components/PushButton';
// Styles
import styles from './admin-register.module.scss';


const AdminRegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [errConfirm, setErrConfirm] = useState('');

  const handleInputChange = useCallback((val, fn, errFn) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        errFn('');
      }
    };
  }, []);
  const emailFn = handleInputChange(email, setEmail, setErrEmail);
  const passwordFn = handleInputChange(password, setPassword, setErrPassword);
  const confirmFn = handleInputChange(confirm, setConfirm, setErrConfirm);

  const onBtnSubmit = useCallback(evt => {
    let bError = false;

    // Validate the email
    if (email.trim() === '') {
      bError = true;
      setErrEmail('An email is required');
    } else if (!validateUnicodeEmail(email.trim())) {
      bError = true;
      setErrEmail('Invalid email');
    }

    if (password.length < 4) {
      bError = true;
      setErrPassword('Password must contain at least 4 characters');
    }

    if (confirm !== password) {
      bError = true;
      setErrConfirm('Confirm Password does not match Password');
    }

  }, [email, password, confirm]);


  return (
    <main className={styles.layoutMain}>
      <section className={styles.outer}>
        <div className={styles.form}>
          <div className={styles.caption}>Register Admin</div>
          <Input name="email"
                 type="email"
                 label="Email:"
                 wrapperExtraClass={styles.wrapInp}
                 extraClass={styles.inp}
                 errorPlaceholder
                 value={email}
                 onChange={emailFn}
                 errorText={errEmail} />
          <Input name="password"
                 type="password"
                 label="Password:"
                 wrapperExtraClass={styles.wrapInp}
                 extraClass={styles.inp}
                 errorPlaceholder
                 value={password}
                 onChange={passwordFn}
                 errorText={errPassword} />
          <Input name="confirm-password"
                 type="password"
                 label="Confirm Password:"
                 wrapperExtraClass={styles.wrapInp}
                 extraClass={styles.inp}
                 errorPlaceholder
                 value={confirm}
                 onChange={confirmFn}
                 errorText={errConfirm} />
          <PasswordStrength password={password} />
          <PushButton extraClass={styles.pbtn} onClick={onBtnSubmit}>Submit</PushButton>
        </div>
      </section>
    </main>
  );
};


export default AdminRegisterPage;
