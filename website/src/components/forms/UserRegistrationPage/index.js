'use client';

import { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PasswordStrength from '@/components/PasswordStrength';
import PushButton from '@/components/PushButton';
import RegLicenseDesc from '@/components/RegLicenseDesc';
// Images
import LogoSvg from '@/../public/logo-blue.svg';
// Styles
import styles from './styles.module.scss';


const ID_PASSWORD = 'input-password-832B-BE5101F0CF31';
const ID_CONFIRM  = 'input-confirm-password-9805-190BF5C13F60';


const UserRegistrationPage = ({ email, licenseData }) => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [errConfirm, setErrConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCreated, setUserCreated] = useState(false);

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

    if (password.length < 4) {
      bError = true;
      setErrPassword('Password must contain at least 4 characters');
    }

    if (confirm !== password) {
      bError = true;
      setErrConfirm('Confirm Password does not match Password');
    }

    if (!bError) {
      setLoading(true);

      axios.post('/api/register/user/new', { email, password, token })
        .then(res => {
          setUserCreated(true);
          setLoading(false); // Unnecessary, but let it stay here
        })
        .catch(err => {
          toast.error(err.response?.data?.message ?? err.message);
          setLoading(false);
          setTimeout(() => document.getElementById(ID_PASSWORD).focus(), 250);
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
        <div className={styles.form}>
          {!userCreated &&
            <>
              {loading &&
                <div className={styles.overlay}>
                  <Loading scale={2} text="Creating new user..." />
                </div>
              }
              <div className={styles.caption}>Create User</div>
              <div className={styles.text}>Create a new user for the following license:</div>
              <div className={styles.central}>
                <RegLicenseDesc licenseData={licenseData} />
              </div>
              <div className={styles.emailLine}>
                <div className={styles.emailTitle}>Email:</div>
                <div className={styles.emailValue}>{email}</div>
              </div>
              <Input id={ID_PASSWORD}
                     name="password"
                     type="password"
                     autoComplete="new-password"
                     autoFocus
                     label="Password:"
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
                     label="Confirm Password:"
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
                Submit
              </PushButton>
            </>
          }
          {userCreated &&
            <>
              <div className={styles.c1}>User created successfully!</div>
              <div className={styles.t1}>You can now start using the <LogoSvg className={styles.logo} /> Excel Add-in, with your email <span className={styles.mail}>{email}</span> and the password that you have just provided as credentials.</div>
              <div className={styles.t2}>You can also <Link href="/login">login here</Link> and review your license status using the same credentials.</div>
            </>
          }
        </div>
      </form>
    </main>
  );
};


export default UserRegistrationPage;
