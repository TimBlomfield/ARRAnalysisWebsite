'use client';

import { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import zxcvbn from 'zxcvbn';
import axios from 'axios';
import { toast } from 'react-toastify';
import { validateUnicodeEmail } from '@/utils/validators';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PasswordStrength from '@/components/PasswordStrength';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ID_EMAIL    = 'input-email-4013378082fa-961385';
const ID_PASSWORD = 'input-password-1347f78c1377-69560';
const ID_CONFIRM  = 'input-confirm-password-c01bd06c782e-355245';


const ToastMsg = ({ email }) => {
  return (
    <div className={styles.toastCustomStyle}>
      <div>An admin with this email:</div>
      <div className={styles.b}>{email}</div>
      <div>already exists in the portal.</div>
    </div>
  );
};

// Note: this is a full page, therefore the name ends with Page and not Form
const AdminRegistrationPage = ({ reglinkEmail }) => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState(() => reglinkEmail);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [errConfirm, setErrConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  useEffect(() => {
    if (reglinkEmail === '') {
      const inputEmail = document.getElementsByName('email')[0];
      if (inputEmail != null)
        inputEmail.focus();
    } else {
      const inputPwd = document.getElementsByName('password')[0];
      if (inputPwd != null)
        inputPwd.focus();
    }
  }, []);

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

  const onBtnSubmit = useCallback(() => {
    let bError = false;

    // Validate the email
    if (email.trim() === '') {
      bError = true;
      setErrEmail('An email is required');
    } else if (!validateUnicodeEmail(email.trim())) {
      bError = true;
      setErrEmail('Invalid email');
    }

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

      // Using APIs
      axios.post('/api/register/admin', { email, password, token })
        .then(res => {
          setAdminCreated(true);
          setLoading(false); // Unnecessary, but let it stay here
        })
        .catch(err => {
          if (err.response?.data?.adminExists === 'Yes') {
            toast.error(<ToastMsg email={email} />);
          } else {
            toast.error(err.response?.data?.message ?? err.message);
          }
          setLoading(false);
          setTimeout(() => document.getElementById(ID_EMAIL).focus(), 250);
        });
    }
  }, [email, password, confirm]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      evt.preventDefault();
      switch (evt.target.id) {
        case ID_EMAIL:
          document.getElementById(ID_PASSWORD).focus();
          break;

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
          {!adminCreated &&
            <>
              {loading &&
                <div className={styles.overlay}>
                  <Loading scale={2} />
                </div>
              }
              <div className={styles.caption}>Register Admin</div>
              <Input id={ID_EMAIL}
                     name="email"
                     type="email"
                     autoComplete="off"
                     label="Email:"
                     wrapperExtraClass={styles.wrapInp}
                     extraClass={styles.inp}
                     {...(loading ? { disabled: true } : {})}
                     errorPlaceholder
                     value={email}
                     onChange={emailFn}
                     onKeyDown={handleInputReturn}
                     errorText={errEmail} />
              <Input id={ID_PASSWORD}
                     name="password"
                     type="password"
                     autoComplete="new-password"
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
          {adminCreated &&
            <>
              <div className={styles.c1}>Admin created successfully!</div>
              <div className={styles.t2}>You can now <Link href="/login">login here</Link> as a portal administrator.</div>
            </>
          }
        </div>
      </form>
    </main>
  );
};


export default AdminRegistrationPage;
