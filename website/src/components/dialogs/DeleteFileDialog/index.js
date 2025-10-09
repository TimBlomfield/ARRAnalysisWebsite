'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { ID_TOASTER_DIALOG_DELETE_FILE } from '@/utils/toast-container-ids';
// Components
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const DeleteFileDialog = ({ file, notifyClosed }) => {
  const router = useRouter();
  const dlgId = useId();
  const isOpen = file != null;

  const [fileNameBetter, setFileNameBetter] = useState('');
  const [loading, setLoading] = useState(false);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

  const onBtnConfirm = useCallback(() => {
    setLoading(true);
    axios.post('/api/admin/delete-file', { file })
      .then(res => {
        setLoading(false);
        toast.success(res.data?.message ?? 'File Deleted!');
        closeDialog();
        router.refresh();
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message ?? 'An error occurred while deleting the file!', { containerId: ID_TOASTER_DIALOG_DELETE_FILE });
      });
  }, [file]);

  useEffect(() => {
    if (isOpen) {
      setFileNameBetter(file.name.replaceAll('/', ' / '));
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', notifyClosed);
      dialog.showModal();
    }
  }, [isOpen]);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.dialog}>
      {loading &&
        <div className={styles.overlay}>
          <Loading scale={2} text="Deleting file..." />
        </div>
      }
      <div className={styles.title}>Delete File</div>
      <div className={styles.body}>
        <div className={styles.theFile}>{fileNameBetter}</div>
        <div className={styles.question}>Delete this file?</div>
      </div>
      <div className={styles.buttons}>
        {/* ToastContainer is placed here to avoid extra gap at the bottom */}
        <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_DELETE_FILE} />
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Danger}
                    disabled={loading}
                    onClick={onBtnConfirm}>
          Delete File
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


export default DeleteFileDialog;
