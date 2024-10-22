'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
import RegLicenseDesc from '@/components/RegLicenseDesc';
// Images
import LogoSvg from '@/../public/logo-blue.svg';
// Styles
import styles from './styles.module.scss';

// TODO: delete this file
const ID_PASSWORD = 'input-password-AB53-52D339ADD204';


const ExistingUserNewLicensePage = ({ email, licenseData }) => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCreated, setUserCreated] = useState(false);

  const handleInputChange = useCallback((val, fn) => {
    return evt => {
      if (val !== evt.target.value)
        fn(evt.target.value);
    };
  }, []);
  const passwordFn = handleInputChange(password, setPassword);

  const onBtnSubmit = useCallback(() => {
    if (password.length < 4) return;

    setLoading(true);

    axios.post('/api/register/user/assign-existing-to-license', { email, password, token })
      .then(res => {
        setUserCreated(true);
        setLoading(false); // Unnecessary, but let it stay here
      })
      .catch(err => {
        toast.error(err.response?.data?.message ?? err.message);
        setLoading(false);
        setTimeout(() => document.getElementById(ID_PASSWORD).focus(), 250);
      });
  }, [password]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      evt.preventDefault();
      switch (evt.target.id) {
        case ID_PASSWORD:
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
                  <Loading scale={2} text="Assigning user to license..." />
                </div>
              }
              <div className={styles.caption}>Assign User</div>
              <div className={styles.text}>Assign the existing portal user ({email}) to the following license:</div>
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
                     autoComplete="current-password"
                     autoFocus
                     label="Password:"
                     wrapperExtraClass={styles.wrapInp}
                     extraClass={styles.inp}
                     {...(loading ? { disabled: true } : {})}
                     value={password}
                     onChange={passwordFn}
                     onKeyDown={handleInputReturn} />
              <PushButton extraClass={styles.pbtn}
                          {...((loading || password.length < 4) ? { disabled: true } : {})}
                          onClick={onBtnSubmit}>
                Submit
              </PushButton>
            </>
          }
          {userCreated &&
            <>
              <div className={styles.c1}>User assigned successfully!</div>
              <div className={styles.t1}><span className={styles.mail}>{email}</span> has been assigned to the license. You can now start using the <LogoSvg className={styles.logo} /> Excel Add-in, with your email and password as credentials.</div>
              <div className={styles.t2}>You can also <Link href="/login">login here</Link> and review your license status using the same credentials.</div>
            </>
          }
        </div>
      </form>
    </main>
  );
};


export default ExistingUserNewLicensePage;
