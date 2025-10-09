'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { K_Theme } from '@/utils/common';
// Components
import Input from '@/components/Input';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ID_PASSWORD = 'input-password-6d6d1d3da6b5-ffc24f14';


const LicensePasswordDialog = ({ isOpen, notifyClosed, onConfirm }) => {
  const dlgId = useId();

  const [password, setPassword] = useState('');
  const [errPassword, setErrPassword] = useState('');

  const handleInputChange = useCallback((val, fn, errFn) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        errFn('');
      }
    };
  }, []);
  const passwordFn = handleInputChange(password, setPassword, setErrPassword);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
    setPassword('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', notifyClosed);
      dialog.showModal();
    }
  }, [isOpen]);

  const onBtnConfirm = useCallback(() => {
    if (password.length < 8)
      setErrPassword('Password must be at least 8 characters long');
    else {
      closeDialog();
      if (onConfirm) onConfirm(password);
    }
  }, [password]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      switch (evt.target.id) {
        case ID_PASSWORD:
          onBtnConfirm();
          break;
      }
    }
  }, [password]);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.dialog}>
      <div className={styles.title}>Change License Password</div>
      <Input theme={K_Theme.Dark}
             id={ID_PASSWORD}
             name="password"
             type="password"
             autoComplete="new-password"
             label="New Password:"
             extraClass={styles.inp}
             errorPlaceholder
             value={password}
             onChange={passwordFn}
             onKeyDown={handleInputReturn}
             errorTextExtraClass={styles.errorTextXtra}
             errorText={errPassword} />
      <div className={styles.buttons}>
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Light}
                    invertBkTheme
                    onClick={onBtnConfirm}>
          Confirm
        </PushButton>
        <PushButton extraClass={styles.pbtn}
                    onClick={closeDialog}>
          Cancel
        </PushButton>
      </div>
    </dialog>
  );
};


export default LicensePasswordDialog;
