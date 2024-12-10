'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import cn from 'classnames';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { validateUnicodeEmail } from '@/utils/validators';
import { ID_TOASTER_DIALOG_INVITE_USER } from '@/utils/toast-container-ids';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ID_FIRST_NAME = 'input-first-name-8887-7c97c8f85497';
const ID_LAST_NAME  = 'input-last-name-bc62-3fe9ad4aaa4e';
const ID_EMAIL      = 'input-email-ab86-5abcab5a9688';


const InviteUserDialog = ({ isOpen, notifyClosed, licenseId, customerId, passSuccessMessage }) => {
  const dlgId = useId();

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errEmail, setErrEmail] = useState('');

  const handleInputChange = useCallback((val, fn, errFn = null) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        if (errFn) errFn('');
      }
    };
  }, []);
  const firstNameFn = handleInputChange(firstName, setFirstName);
  const lastNameFn = handleInputChange(lastName, setLastName);
  const emailFn = handleInputChange(email, setEmail, setErrEmail);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

  const onCloseDialog = useCallback(() => {
    notifyClosed();
    setLoading(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setErrEmail('');
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

    // Validate the email
    if (email.trim() === '') {
      bError = true;
      setErrEmail('An email is required');
    } else if (!validateUnicodeEmail(email.trim())) {
      bError = true;
      setErrEmail('Invalid email');
    }

    if (!bError) {
      setLoading(true);

      axios.post('/api/licensing/send-license-user-email', {
        licenseId,
        customerId,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
        .then(res => {
          closeDialog();
          passSuccessMessage(res.data.message);
        })
        .catch(err => {
          setLoading(false);
          toast.error(err.response?.data?.message ?? 'Could not assign user!', { containerId: ID_TOASTER_DIALOG_INVITE_USER });
        });
    }
  }, [email]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      switch (evt.target.id) {
        case ID_FIRST_NAME:
          document.getElementById(ID_LAST_NAME).focus();
          break;

        case ID_LAST_NAME:
          document.getElementById(ID_EMAIL).focus();
          break;

        case ID_EMAIL:
          onBtnSubmit();
          break;
      }
    }
  }, [onBtnSubmit]);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.inviteUserDialog}>
      <div className={styles.title}>Invite a User</div>
      <div className={styles.inputs}>
        {loading &&
          <div className={styles.overlay}>
            <Loading theme={K_Theme.Dark} scale={2} />
          </div>
        }
        <Input theme={K_Theme.Dark}
               id={ID_FIRST_NAME}
               name="first-name"
               type="text"
               autoComplete="given-name"
               label="First Name (optional):"
               extraClass={styles.inp}
               {...(loading ? { disabled: true } : {})}
               value={firstName}
               onChange={firstNameFn}
               onKeyDown={handleInputReturn} />
        <Input theme={K_Theme.Dark}
               id={ID_LAST_NAME}
               name="last-name"
               type="text"
               autoComplete="family-name"
               label="Last Name (optional):"
               extraClass={styles.inp}
               {...(loading ? { disabled: true } : {})}
               value={lastName}
               onChange={lastNameFn}
               onKeyDown={handleInputReturn} />
        <Input theme={K_Theme.Dark}
               id={ID_EMAIL}
               name="email"
               type="email"
               autoComplete="email"
               label="Email:"
               extraClass={cn(styles.inp, styles.light, {[styles.error]: errEmail !== ''})}
               {...(loading ? { disabled: true } : {})}
               value={email}
               onChange={emailFn}
               onKeyDown={handleInputReturn}
               errorPlaceholder
               errorTextExtraClass={styles.errorTextXtra}
               errorText={errEmail} />
      </div>
      <div className={styles.buttons}>
        {/* ToastContainer is placed here to avoid extra gap at the bottom */}
        <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_INVITE_USER} />
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Light}
                    invertBkTheme
                    {...(loading ? { disabled: true } : {})}
                    onClick={onBtnSubmit}>
          Send Email
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


export default InviteUserDialog;
