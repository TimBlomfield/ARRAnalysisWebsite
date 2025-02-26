'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import cn from 'classnames';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { validateUnicodeEmail } from '@/utils/validators';
import { ID_TOASTER_DIALOG_CANCEL_SUBSCRIPTION } from '@/utils/toast-container-ids';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ID_FIRST_NAME = 'input-first-name-8887-7c97c8f85497';
const ID_LAST_NAME  = 'input-last-name-bc62-3fe9ad4aaa4e';
const ID_EMAIL      = 'input-email-ab86-5abcab5a9688';


const CancelSubscriptionDialog = ({ isOpen, notifyClosed, subscription, passSuccessMessage }) => {
  const dlgId = useId();

  const [loading, setLoading] = useState(false);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

  const onCloseDialog = useCallback(() => {
    notifyClosed();
    setLoading(false);
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
    setLoading(true);

    /*
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
     */
  }, []);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.cancelSubscriptionDialog}>
      <div className={styles.title}>Cancel Subscription?</div>
      <div className={styles.body}>
        {loading &&
          <div className={styles.overlay}>
            <Loading theme={K_Theme.Dark} scale={2} />
          </div>
        }
      </div>
      <div className={styles.buttons}>
        {/* ToastContainer is placed here to avoid extra gap at the bottom */}
        <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_CANCEL_SUBSCRIPTION} />
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Danger}
                    invertBkTheme
                    {...(loading ? { disabled: true } : {})}
                    onClick={onBtnSubmit}>
          Cancel Subscription
        </PushButton>
        <PushButton extraClass={styles.pbtn}
                    {...(loading ? { disabled: true } : {})}
                    onClick={closeDialog}>
          Don&apos;t Cancel
        </PushButton>
      </div>
    </dialog>
  );
};


export default CancelSubscriptionDialog;
