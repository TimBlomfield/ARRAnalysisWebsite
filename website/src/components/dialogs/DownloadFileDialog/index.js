'use client';

import { useCallback, useEffect, useId, useState } from 'react';
// Components
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const DownloadFileDialog = ({ file, notifyClosed }) => {
  const dlgId = useId();
  const isOpen = file != null;

  const [fileNameBetter, setFileNameBetter] = useState('');

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

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
      <div className={styles.title}>Download File</div>
      <div className={styles.body}>
        <div className={styles.theFile}>{fileNameBetter}</div>
        <a className={styles.downloadLink} rel="nofollow" href={`/api/admin/download-file?fileKey=${file.name}`} onClick={closeDialog}>Download</a>
      </div>
      <div className={styles.buttons}>
        <PushButton extraClass={styles.pbtn}
                    onClick={closeDialog}>
          Cancel
        </PushButton>
      </div>
    </dialog>
  );
};


export default DownloadFileDialog;
