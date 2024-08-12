'use client';

import { useCallback, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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


// Note: this is a full page, therefore the name ends with Page and not Form
const AdminRegisterPage = ({ dbEmail }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [email, setEmail] = useState(() => dbEmail);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [errConfirm, setErrConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (dbEmail === '') {
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

      // Using APIs
      axios.post('/api/register', { email, password, token })
        .then(res => {
          toast.success('Admin User successfully created.', {
            autoClose: false,
            onClose: () => router.push('/login'),
          });
          setLoader(false);
        })
        .catch(err => {
          toast.error(err.response?.data?.message ?? err.message);
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
          {loading &&
            <div className={styles.overlay}>
              { loader && <Loading scale={2} /> }
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
        </div>
      </form>
    </main>
  );
};


export default AdminRegisterPage;
