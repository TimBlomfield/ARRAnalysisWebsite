'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Link from 'next/link';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import { toast } from 'react-toastify';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PasswordStrength from '@/components/PasswordStrength';
import PushButton from '@/components/PushButton';
// Images
import LogoSvg from '@/../public/logo-blue.svg';
import CheckmarkCircle from '@/../public/CheckmarkCircle.svg';
// Styles
import styles from './styles.module.scss';


const ID_PASSWORD = 'input-password-AE4B-580CAD80B162';
const ID_CONFIRM  = 'input-confirm-password-AC66-E4CEDC546FAA';


const ResetPasswordClientPage = ({ email, token }) => {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [errConfirm, setErrConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleInputChange = useCallback((val, fn, errFn) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        errFn('');
      }
    };
  }, []);
  const passwordFn = handleInputChange(password, setPassword, setErrPassword);
  const confirmFn = handleInputChange(confirm, setConfirm, setErrConfirm);

  const onBtnSubmit = useCallback(() => {
    let bError = false;

    if (password.length < 8) {
      bError = true;
      setErrPassword('Password must contain at least 8 characters');
    } else {
      const zxc = zxcvbn(password);
      if (zxc.score < 3) {
        bError = true;
        setErrPassword('Password strength must be at least "Good"');
      }
    }

    if (confirm !== password) {
      bError = true;
      setErrConfirm('Confirm Password does not match Password');
    }

    if (!bError) {
      setLoading(true);

      axios.post('/api/reset-password/change', { email, token, password })
        .then(res => {
          setPasswordChanged(true);
          setLoading(false); // Unnecessary, but let it stay here
        })
        .catch(err => {
          toast.error(err.response?.data?.message ?? err.message);
          setLoading(false);
          setTimeout(() => document.getElementById(ID_PASSWORD).focus(), 250);
          setTimeout(() => router.refresh(), 300);
        });
    }
  }, [password, confirm]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      evt.preventDefault();
      switch (evt.target.id) {
        case ID_PASSWORD:
          document.getElementById(ID_CONFIRM).focus();
          break;

        case ID_CONFIRM:
          onBtnSubmit();
          break;
      }
    }
  }, [onBtnSubmit]);

  return (
    <main className={styles.layoutMain}>
      <form className={styles.outer}> {/* NOTE: using <form> to prevent Chrome warnings */}
        <LogoSvg className={cn(styles.logo, {[styles.up]: !passwordChanged})} />
        <div className={styles.form}>
          {!passwordChanged &&
            <>
              {loading &&
                <div className={styles.overlay}>
                  <Loading scale={2} text="Changing your password..." />
                </div>
              }
              <div className={styles.caption}>Change Your Password</div>
              <div className={styles.text}>Enter a new password below to change your password.</div>
              <div className={styles.emailLine}>
                <div className={styles.emailTitle}>Email:</div>
                <div className={styles.emailValue}>{email}</div>
              </div>
              <Input id={ID_PASSWORD}
                     name="password"
                     type="password"
                     autoComplete="new-password"
                     autoFocus
                     label="New Password:"
                     wrapperExtraClass={styles.wrapInp}
                     extraClass={styles.inp}
                     {...(loading ? { disabled: true } : {})}
                     errorPlaceholder
                     value={password}
                     onChange={passwordFn}
                     onKeyDown={handleInputReturn}
                     errorText={errPassword} />
              <Input id={ID_CONFIRM}
                     name="confirm-password"
                     type="password"
                     autoComplete="new-password"
                     label="Re-enter New Password:"
                     wrapperExtraClass={styles.wrapInp}
                     extraClass={styles.inp}
                     {...(loading ? { disabled: true } : {})}
                     errorPlaceholder
                     value={confirm}
                     onChange={confirmFn}
                     onKeyDown={handleInputReturn}
                     errorText={errConfirm} />
              <PasswordStrength password={password} />
              <PushButton extraClass={styles.pbtn}
                          {...(loading ? { disabled: true } : {})}
                          onClick={onBtnSubmit}>
                Reset Password
              </PushButton>
            </>
          }
          {passwordChanged &&
            <>
              <CheckmarkCircle className={styles.checkMark} />
              <div className={styles.c1}>Password changed!</div>
              <div className={styles.t1}>Your password has been changed successfully. Click <Link href="/login">here</Link> to go back to the login page.</div>
            </>
          }
        </div>
      </form>
    </main>
  );
};


export default ResetPasswordClientPage;
