'use client';

import { useCallback, useEffect, useId } from 'react';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Components
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ConfirmationDialog = ({ isOpen, danger = false, notifyClosed, titleText = 'Dialog Title', button1Text = 'Confirm',
  button2Text = 'Cancel', onCancel, onConfirm, children }) => {
  const dlgId = useId();

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

  useEffect(() => {
    if (isOpen) {
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', notifyClosed);
      dialog.showModal();
    }
  }, [isOpen]);

  if (!isOpen)
    return null;  // Prevents rendering many <dialog> objects in the DOM

  return (
    <dialog id={dlgId} className={styles.dialog}>
      <div className={styles.title}>{titleText}</div>
      {children}
      <div className={styles.buttons}>
        <PushButton extraClass={cn(styles.pbtn, {[styles.danger]: danger})}
                    theme={danger ? K_Theme.Danger : K_Theme.Light}
                    invertBkTheme={!danger}
                    onClick={() => {
                      closeDialog();
                      if (onConfirm) onConfirm();
                    }}>
          {button1Text}
        </PushButton>
        <PushButton extraClass={styles.pbtn}
                    onClick={() => {
                      closeDialog();
                      if (onCancel) onCancel();
                    }}>
          {button2Text}
        </PushButton>
      </div>
    </dialog>
  );
};


export default ConfirmationDialog;
