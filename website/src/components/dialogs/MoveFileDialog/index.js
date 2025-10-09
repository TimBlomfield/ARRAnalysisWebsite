'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { isValidS3Key } from '@/utils/func';
import { ID_TOASTER_DIALOG_MOVE_FILE } from '@/utils/toast-container-ids';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ID_DESTINATION = 'input-destination-a2684148b3d0-0fc60713cd5c';


const MoveFileDialog = ({ file, topFolder = '', notifyClosed }) => {
  const router = useRouter();
  const dlgId = useId();
  const isOpen = file != null;

  const [loading, setLoading] = useState(false);
  const [fileNameBetter, setFileNameBetter] = useState('');
  const [destination, setDestination] = useState('');
  const [errDestination, setErrDestination] = useState('');

  const handleInputChange = useCallback((val, fn, errFn) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        const { valid, error } = isValidS3Key(evt.target.value, { strictSafeChars: true });
        if (!valid && error)
          errFn(error);
        else {
          if (topFolder + evt.target.value === file.name)
            errFn('The destination cannot be the same as the source file');
          else
            errFn('');
        }
      }
    };
  }, [file, topFolder]);
  const destinationFn = handleInputChange(destination, setDestination, setErrDestination);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
    setDestination('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFileNameBetter(file.name.replaceAll('/', ' / '));
      setDestination(file.name.replace(topFolder, ''));
      setErrDestination('The destination cannot be the same as the source file');
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', notifyClosed);
      dialog.showModal();
    }
  }, [isOpen]);

  const onBtnConfirm = useCallback(() => {
    setLoading(true);
    axios.post('/api/admin/move-file', { file, destination: topFolder + destination })
      .then(res => {
        setLoading(false);
        toast.success(res.data?.message ?? 'File Moved!');
        closeDialog();
        router.refresh();
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message ?? 'An error occurred while moving the file!', { containerId: ID_TOASTER_DIALOG_MOVE_FILE });
      });
  }, [file, topFolder, destination]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      switch (evt.target.id) {
        case ID_DESTINATION:
          onBtnConfirm();
          break;
      }
    }
  }, [destination]);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.dialog}>
      {loading &&
        <div className={styles.overlay}>
          <Loading scale={2} text="Moving file..." />
        </div>
      }
      <div className={styles.title}>Move File</div>
      <div>
        <div className={styles.lblFrom}>From:</div>
        <div className={styles.from}>
          <div className={styles.txtFrom}>{fileNameBetter}</div>
        </div>
      </div>
      <div className={styles.destHolder}>
        <Input theme={K_Theme.Dark}
               id={ID_DESTINATION}
               multiline
               name="destination"
               type="text"
               label="Destination (without top folder):"
               extraClass={styles.inp}
               errorPlaceholder
               disabled={loading}
               value={destination}
               onChange={destinationFn}
               onKeyDown={handleInputReturn}
               errorTextExtraClass={styles.errorTextXtra}
               errorText={errDestination} />
        <div className={styles.imposedTxt}>{topFolder}</div>
      </div>
      <div className={styles.buttons}>
        {/* ToastContainer is placed here to avoid extra gap at the bottom */}
        <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_MOVE_FILE} />
        <PushButton extraClass={styles.pbtn}
                    theme={K_Theme.Light}
                    invertBkTheme
                    disabled={loading}
                    onClick={onBtnConfirm}>
          Move
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


export default MoveFileDialog;
