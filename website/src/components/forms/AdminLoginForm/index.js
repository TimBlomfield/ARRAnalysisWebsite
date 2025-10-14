'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { validateUnicodeEmail } from '@/utils/validators';
import { toast } from 'react-toastify';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
import ResetPasswordDialog from '@/components/dialogs/ResetPasswordDialog';
// Styles
import styles from './styles.module.scss';

const ID_EMAIL    = 'input-email-6a8a90da85df-404944';
const ID_PASSWORD = 'input-password-3ed52da1f277-566727';


const AdminLoginForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dummyCount, setDummyCount] = useState(0);
  const [resetEmailDlg, setResetEmailDlg] = useState(false);

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
    // Client side redirection (fix for caching and link navigation)
    if (status === 'loading') return; // Wait for session check

    if (session)
      router.push('/admin');  // Redirect if logged in
  }, [session, status, router]);

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

    if (password.length < 8) {
      bError = true;
      setErrPassword('Password must contain at least 8 characters');
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
  }, [email, password]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      switch (evt.target.id) {
        case ID_EMAIL:
          document.getElementById(ID_PASSWORD).focus();
          break;

        case ID_PASSWORD:
          onBtnSubmit();
          break;
      }
    }
  }, [onBtnSubmit]);


  const isLoading = loading || (status === 'loading');

  return (
    <>
      <form className={styles.main}> {/* NOTE: using <form> to prevent Chrome warnings */}
        {isLoading &&
          <div className={styles.overlay}>
            <Loading scale={2} />
          </div>
        }
        <Input id={ID_EMAIL}
               name="email"
               type="email"
               autoComplete="email"
               label="Email:"
               wrapperExtraClass={styles.wrapInp}
               extraClass={styles.inp}
               {...(isLoading ? { disabled: true } : {})}
               errorPlaceholder
               value={email}
               onChange={emailFn}
               onKeyDown={handleInputReturn}
               errorText={errEmail} />
        <Input id={ID_PASSWORD}
               name="password"
               type="password"
               autoComplete="current-password"
               label="Password:"
               wrapperExtraClass={styles.wrapInp}
               extraClass={styles.inp}
               {...(isLoading ? { disabled: true } : {})}
               errorPlaceholder
               value={password}
               onChange={passwordFn}
               onKeyDown={handleInputReturn}
               errorText={errPassword} />
        <div className={styles.hfx}>
          <PushButton extraClass={styles.pbtn}
                      {...(isLoading ? { disabled: true } : {})}
                      onClick={onBtnSubmit}>
            Sign In
          </PushButton>
          <button className={styles.link}
                  type="button"
                  onClick={() => setResetEmailDlg(true)}>
            Forgot Password?
          </button>
        </div>
      </form>
      <ResetPasswordDialog isOpen={resetEmailDlg}
                           notifyClosed={() => setResetEmailDlg(false)}
                           onConfirm={email => toast.success(`Email sent to ${email}`) } />
    </>
  );
};


export default AdminLoginForm;
