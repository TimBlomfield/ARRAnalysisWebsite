'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import cn from 'classnames';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { ID_TOASTER_DIALOG_SELF_ASSIGN } from '@/utils/toast-container-ids';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Images
import LogoSvg from '@/../public/logo-white.svg';
// Styles
import styles from './styles.module.scss';


const ID_PASSWORD = 'input-password-48a5-bf4b-bafa5a50950e';
const ID_CONFIRM  = 'input-confirm-489f-9a81-07f8b4b324c6';

// TODO: delete this file
const SelfAssignDialog = ({ isOpen, notifyClosed, licenseId, myEmail, passSuccessMessage }) => {
  const dlgId = useId();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [errConfirm, setErrConfirm] = useState('');

  const handleInputChange = useCallback((val, fn, errFn = null) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        if (errFn) errFn('');
      }
    };
  }, []);
  const passwordFn = handleInputChange(password, setPassword, setErrPassword);
  const confirmFn = handleInputChange(confirm, setConfirm, setErrConfirm);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

  const onCloseDialog = useCallback(() => {
    notifyClosed();
    setLoading(false);
    setPassword('');
    setConfirm('');
    setErrPassword('');
    setErrConfirm('');
  }, []);

  useEffect(() => {
    if (isOpen === true) {
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', onCloseDialog);
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

      axios.post('/api/licensing/assign-self-to-license', {
        licenseId,
        email: myEmail,
        password,
      })
        .then(res => {
          closeDialog();
          passSuccessMessage(res.data.message);
        })
        .catch(err => {
          setLoading(false);
          toast.error(err.response?.data?.message ?? 'Failed to assign yourself to license!', { containerId: ID_TOASTER_DIALOG_SELF_ASSIGN });
        });
    }
  }, [password, confirm]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
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

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.selfAssignDialog}>
      <div className={styles.title}>Assign Self to License</div>
      <div className={styles.inputs}>
        {loading &&
          <div className={styles.overlay}>
            <Loading theme={K_Theme.Light} scale={2} />
          </div>
        }
        <div className={styles.t1}>You need to set a password for the <LogoSvg className={styles.logo} /> Excel Add-in.
          Your email (<span className={styles.mail}>{myEmail}</span>) and this password will be used as credentials in the
          addin.
        </div>
        <Input theme={K_Theme.Light}
               id={ID_PASSWORD}
               name="password"
               type="password"
               autoComplete="new-password"
               label="Set Password:"
               extraClass={styles.inp}
               {...(loading ? {disabled: true} : {})}
               value={password}
               onChange={passwordFn}
               onKeyDown={handleInputReturn}
               errorPlaceholder
               errorText={errPassword} />
        <Input theme={K_Theme.Light}
               id={ID_CONFIRM}
               name="confirm-password"
               type="password"
               autoComplete="new-password"
               label="Confirm Password:"
               extraClass={styles.inp}
               {...(loading ? {disabled: true} : {})}
               value={confirm}
               onChange={confirmFn}
               onKeyDown={handleInputReturn}
               errorPlaceholder
               errorText={errConfirm} />
      </div>
      <div className={styles.buttons}>
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Light}
                    {...(loading ? {disabled: true} : {})}
                    onClick={onBtnSubmit}>
        Assign
        </PushButton>
        <PushButton extraClass={styles.pbtn}
                    {...(loading ? { disabled: true } : {})}
                    onClick={closeDialog}>
          Cancel
        </PushButton>
      </div>
      <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_SELF_ASSIGN} />
    </dialog>
  );
};


export default SelfAssignDialog;
