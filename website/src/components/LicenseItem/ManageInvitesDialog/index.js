'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { ID_TOASTER_DIALOG_MANAGE_INVITES } from '@/utils/toast-container-ids';
// Components
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ManageInvitesDialog = ({ isOpen, notifyClosed, emailList, passSuccessMessage }) => {
  const dlgId = useId();

  const [loading, setLoading] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);

  const getCheckedInputs = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    let checkedInputs = null;
    if (dialog != null)
      checkedInputs = dialog.querySelectorAll('input[type="checkbox"]:checked');
    return checkedInputs;
  }, []);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

  const onCloseDialog = useCallback(() => {
    notifyClosed();
    setLoading(false);
    setButtonsDisabled(true);
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

  const onBtnReSend = useCallback(() => {
    const checkedInputs = getCheckedInputs();
    if (checkedInputs != null && checkedInputs.length > 0) {
      const arrCI = Array.from(checkedInputs);
      const reducedList = emailList.reduce((acc, cur) => {
        if (arrCI.some(checkbox => +checkbox.dataset.id === +cur.id)) {
          acc.push({ ...cur });
        }
        return acc;
      }, []);

      setLoading(true);

      axios.post('/api/licensing/resend-emails', { resendList: reducedList })
        .then(res => {
          closeDialog();
          passSuccessMessage(res.data.message);
        })
        .catch(err => {
          setLoading(false);
          toast.error(err.response?.data?.message ?? 'Could not re-send email(s)!', { containerId: ID_TOASTER_DIALOG_MANAGE_INVITES });
        });
    }
  }, []);
  const onBtnUninvite = useCallback(() => {
    const checkedInputs = getCheckedInputs();
    if (checkedInputs != null && checkedInputs.length > 0) {
      const arrCI = Array.from(checkedInputs);
      const reducedList = emailList.reduce((acc, cur) => {
        if (arrCI.some(checkbox => +checkbox.dataset.id === +cur.id)) {
          acc.push(+cur.id);
        }
        return acc;
      }, []);

      setLoading(true);

      axios.post('/api/licensing/uninvite-user-for-license', { uninviteList: reducedList })
        .then(res => {
          closeDialog();
          passSuccessMessage(res.data.message);
        })
        .catch(err => {
          setLoading(false);
          toast.error(err.response?.data?.message ?? 'Could not re-send email(s)!', { containerId: ID_TOASTER_DIALOG_MANAGE_INVITES });
        });
    }
  }, []);

  const onCheckboxChange = evt => {
    const checkedInputs = getCheckedInputs();
    setButtonsDisabled(checkedInputs == null || checkedInputs.length === 0);
  };

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.manageInvitesDialog}>
      <div className={styles.title}>Manage Invites</div>
      <div className={styles.checkboxes}>
        {loading &&
          <div className={styles.overlay}>
            <Loading theme={K_Theme.Light} scale={2} />
          </div>
        }
        {emailList.map((item, idx) => (
          <label key={idx}>
            <input className={styles.cb} type="checkbox" data-id={item.id} onChange={onCheckboxChange} disabled={loading} />
            {item.email}
          </label>
        ))}
      </div>
      <div className={styles.buttons}>
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Light}
                    {...(loading || buttonsDisabled ? { disabled: true } : {})}
                    onClick={onBtnReSend}>
          Re-Send Email(s)
        </PushButton>
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Light}
                    {...(loading || buttonsDisabled ? { disabled: true } : {})}
                    onClick={onBtnUninvite}>
          Uninvite
        </PushButton>
        <PushButton extraClass={styles.pbtn}
                    {...(loading ? { disabled: true } : {})}
                    onClick={closeDialog}>
          Cancel
        </PushButton>
      </div>
      <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_MANAGE_INVITES} />
    </dialog>
  );
};


export default ManageInvitesDialog;
