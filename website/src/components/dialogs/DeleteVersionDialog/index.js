'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { ID_TOASTER_DIALOG_DELETE_FILE } from '@/utils/toast-container-ids';
// Components
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const DeleteVersionDialog = ({ version, versionKeys, files, notifyClosed }) => {
  const router = useRouter();
  const dlgId = useId();
  const isOpen = version != null;

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

  const onBtnConfirm = useCallback(() => {
    setLoading(true);
    axios.post('/api/admin/delete-version', { version, versionObj: versionKeys[version], files })
      .then(res => {
        setLoading(false);
        toast.success(res.data?.message ?? 'Version Deleted!');
        closeDialog();
        router.refresh();
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message ?? `An error occurred while deleting version ${version}!`, { containerId: ID_TOASTER_DIALOG_DELETE_FILE });
      });
  }, [version]);

  useEffect(() => {
    if (isOpen) {
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', onCloseDialog);
      dialog.showModal();
    }
  }, [isOpen]);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.dialog}>
      {loading &&
        <div className={styles.overlay}>
          <Loading scale={2} text="Deleting version..." />
        </div>
      }
      <div className={styles.title}>Delete Version</div>
      <div className={styles.body}>
        <div className={styles.theVersion}>{version}</div>
        <div className={styles.question}>Delete this version?</div>
      </div>
      <div className={styles.buttons}>
        {/* ToastContainer is placed here to avoid extra gap at the bottom */}
        <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_DELETE_FILE} />
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Danger}
                    disabled={loading}
                    onClick={onBtnConfirm}>
          Delete Version
        </PushButton>
        <PushButton extraClass={styles.pbtn}
                    disabled={loading}
                    onClick={closeDialog}>
          Cancel
        </PushButton>
      </div>
    </dialog>
  );
};


export default DeleteVersionDialog;
