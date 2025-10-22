'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { isValidVersionNumber } from '@/utils/func';
import { ID_TOASTER_DIALOG_CHANGE_VERSION } from '@/utils/toast-container-ids';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ID_NEWVERSION = 'input-newversion-8b219d13-3438f429dc0a';


const ChangeVersionNumberDialog = ({ version, versions, versionKeys, files, notifyClosed }) => {
  const router = useRouter();
  const dlgId = useId();
  const isOpen = version != null;

  const [loading, setLoading] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [errVer, setErrVer] = useState('');

  const handleInputChange = useCallback((val, fn, errFn) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        errFn('');
      }
    };
  }, []);
  const versionFn = handleInputChange(newVersion, setNewVersion, setErrVer);

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

  const onCloseDialog = useCallback(() => {
    notifyClosed();
    setLoading(false);
    setNewVersion('');
    setErrVer('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', onCloseDialog);
      dialog.showModal();
    }
  }, [isOpen]);

  const onBtnConfirm = useCallback(() => {
    const targetVersion = newVersion.trim();

    if (!isValidVersionNumber(targetVersion)) {
      setErrVer('Please enter a valid version number');
      return;
    }

    if (targetVersion === version) {
      setErrVer('The new version number is the same as the current version number');
      return;
    }

    for (const existingVersion of versions) {
      if (existingVersion === targetVersion) {
        setErrVer(`There is already an existing version with the number ${targetVersion}`);
        return;
      }
    }

    setLoading(true);
    axios.post('/api/admin/change-version-number', { targetVersion, arrOld: versionKeys[version], files })
      .then(res => {
        setLoading(false);
        toast.success(res.data?.message ?? 'Version Number Changed Successfully!');
        closeDialog();
        router.refresh();
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message ?? 'An error occurred while trying to change the version number!', { containerId: ID_TOASTER_DIALOG_CHANGE_VERSION });
      });
  }, [newVersion]);

  const handleInputReturn = useCallback(evt => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      switch (evt.target.id) {
        case ID_NEWVERSION:
          onBtnConfirm();
          break;
      }
    }
  }, [onBtnConfirm]);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.dialog}>
      {loading &&
        <div className={styles.overlay}>
          <Loading scale={2} text="Changing version number..." />
        </div>
      }
      <div className={styles.title}>Change Version Number</div>
      <div className={styles.body}>
        <div className={styles.ver}>{version}</div>
        <Input id={ID_NEWVERSION}
               name="newversion"
               type="text"
               autoComplete="off"
               label="New Version Number:"
               wrapperExtraClass={styles.wrpInp}
               extraClass={styles.inp}
               errorPlaceholder
               disabled={loading}
               value={newVersion}
               onChange={versionFn}
               onKeyDown={handleInputReturn}
               errorTextExtraClass={styles.errorTextXtra}
               errorText={errVer} />
      </div>
      <div className={styles.buttons}>
        {/* ToastContainer is placed here to avoid extra gap at the bottom */}
        <ToastContainer position="bottom-left" stacked containerId={ID_TOASTER_DIALOG_CHANGE_VERSION} />
        <PushButton extraClass={styles.pbtn}
                    disabled={loading}
                    onClick={onBtnConfirm}>
          Change Version #
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


export default ChangeVersionNumberDialog;
