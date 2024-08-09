'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { validateUnicodeEmail } from '@/utils/validators';
import { toast } from 'react-toastify';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';

const ID_EMAIL    = 'input-email-6a8a90da85df-404944';
const ID_PASSWORD = 'input-password-3ed52da1f277-566727';


const AdminLoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dummyCount, setDummyCount] = useState(0);

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

  useEffect(() => {
    const elemEmail = document.getElementById(ID_EMAIL);
    if (elemEmail) elemEmail.focus();
  }, [dummyCount]);

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

    if (!bError) {
      setLoading(true);
      let signInCredentials = null;

      try {
        signIn('credentials', {
          email: email.trim(),
          password: password,
          redirect: false,
        })
          .then(rsp => {
            signInCredentials = rsp;
            if (!rsp.ok)
              toast.error('Invalid username or password');
          })
          .catch(err => {
            toast.error('Something went wrong while logging in');
          })
          .finally(() => {
            if (!signInCredentials || !signInCredentials.ok) {
              setPassword('');
              setDummyCount(prev => prev + 1);
              setLoading(false);
            } else {
              router.push('/admin');
            }
          });
      } catch (err) {
        toast.error('Something went wrong!');
      }
    }
  });

  return (
    <main className={styles.main}>
      {loading &&
        <div className={styles.overlay}>
          <Loading scale={2} />
        </div>
      }
      <Input id={ID_EMAIL}
             name="email"
             type="email"
             label="Email:"
             wrapperExtraClass={styles.wrapInp}
             extraClass={styles.inp}
             {...(loading ? { disabled: true } : {})}
             errorPlaceholder
             value={email}
             onChange={emailFn}
             errorText={errEmail} />
      <Input id={ID_PASSWORD}
             name="password"
             type="password"
             label="Password:"
             wrapperExtraClass={styles.wrapInp}
             extraClass={styles.inp}
             {...(loading ? { disabled: true } : {})}
             errorPlaceholder
             value={password}
             onChange={passwordFn}
             errorText={errPassword} />
      <PushButton extraClass={styles.pbtn}
                  {...(loading ? { disabled: true } : {})}
                  onClick={onBtnSubmit}>
        Sign In
      </PushButton>
    </main>
  );
};


export default AdminLoginForm;
