'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { validateUnicodeEmail } from '@/utils/validators';
import { ID_TOASTER_DIALOG_RESET_EMAIL } from '@/utils/toast-container-ids';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ID_EMAIL = 'input-email-7ee44b8d-6ade83e824db';


const ResetPasswordDialog = ({ isOpen, notifyClosed, onConfirm }) => {
  const dlgId = useId();

  const [email, setEmail] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((val, fn, errFn) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        errFn('');
      }
    };
  }, []);
  const emailFn = handleInputChange(email, setEmail, setErrEmail);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
    setEmail('');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', notifyClosed);
      dialog.showModal();
    }
  }, [isOpen]);

  useEffect(() => {
    const preventCloseOnLoadingFn = evt => {
      if (evt.code === 'Escape' && loading)
        evt.preventDefault();
    };

    if (isOpen) {
      document.addEventListener('keydown', preventCloseOnLoadingFn);

      return () => {
        document.removeEventListener('keydown', preventCloseOnLoadingFn);
      };
    }
  }, [isOpen, loading]);

  const onBtnConfirm = useCallback(() => {
    const e1 = email.trim();

    if (!validateUnicodeEmail(e1))
      setErrEmail('Please enter a valid email address');
    else {
      setLoading(true);

      axios.post('/api/reset-password/request', {
        email: e1,
      })
        .then(res => {
          closeDialog();
          onConfirm(e1);
        })
        .catch(err => {
          setLoading(false);
          toast.error(err.response?.data?.message ?? 'Could not send a reset-email link!', { containerId: ID_TOASTER_DIALOG_RESET_EMAIL });
        });
    }
  }, [email]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      switch (evt.target.id) {
        case ID_EMAIL:
          onBtnConfirm(email);
          break;
      }
    }
  }, [email]);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.dialog}>
      <div className={styles.title}>Reset Password</div>
      {loading &&
        <div className={styles.overlay}>
          <Loading theme={K_Theme.Dark} scale={2} />
        </div>
      }
      <Input theme={K_Theme.Dark}
             id={ID_EMAIL}
             name="email"
             type="email"
             autoComplete="email"
             label="Email:"
             wrapperExtraClass={styles.wrapInp}
             extraClass={styles.inp}
             {...(loading ? { disabled: true } : {})}
             errorPlaceholder
             value={email}
             onChange={emailFn}
             onKeyDown={handleInputReturn}
             errorTextExtraClass={styles.errorTextXtra}
             errorText={errEmail} />
      <div className={styles.buttons}>
        {/* ToastContainer is placed here to avoid extra gap at the bottom */}
        <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_RESET_EMAIL} />
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Light}
                    invertBkTheme
                    {...(loading ? { disabled: true } : {})}
                    onClick={onBtnConfirm}>
          Confirm
        </PushButton>
        <PushButton extraClass={styles.pbtn}
                    {...(loading ? { disabled: true } : {})}
                    onClick={closeDialog}>
          Cancel
        </PushButton>
      </div>
    </dialog>
  );
};


export default ResetPasswordDialog;
