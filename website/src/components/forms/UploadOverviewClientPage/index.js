'use client';

import { useEffect, useRef, useState } from 'react';
import useFilesStore from '@/utils/client/useFilesStore';
// Components
import ActionButton from './ActionButton';
import DeleteFileDialog from '@/components/dialogs/DeleteFileDialog';
import DownloadFileDialog from '@/components/dialogs/DownloadFileDialog';
import Footer from '@/components/admin/Footer';
import MoveFileDialog from '@/components/dialogs/MoveFileDialog';
// Styles
import styles from './styles.module.scss';


const formatFileSize = bytes => {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};


const UploadOverviewClientPage = ({ files, topFolder, installsFolder }) => {
  const setFiles = useFilesStore(state => state.setFiles);
  const refMain = useRef();

  const [dlgMove, setDlgMove] = useState(null);
  const [dlgDownload, setDlgDownload] = useState(null);
  const [dlgDelete, setDlgDelete] = useState(null);

  useEffect(() => {
    // Hydrate global store, to update the header data
    setFiles(files, topFolder, installsFolder);
    return () => setFiles();  // Unset (hydrate with default values) on unmount [just in case]
  }, [files.length, topFolder, installsFolder]);

  return (
    <div className={styles.main} ref={refMain}>
      <div className={styles.listAndFooter}>
        <div className={styles.files}>
          {files.map(file => (
            <div className={styles.file} key={file.name}>
              <div className={styles.name}>{file.name.replaceAll('/', ' / ')}</div>
              <div className={styles.size}>{formatFileSize(file.size)}</div>
              <ActionButton onMove={() => setDlgMove({ ...file })}
                            onDownload={() => setDlgDownload({ ...file })}
                            onDelete={() => setDlgDelete({ ...file })}
                            refLimiter={refMain} />
            </div>
          ))}
        </div>
        <div className={styles.spacer} />
        <Footer />
      </div>
      <MoveFileDialog file={dlgMove}
                      topFolder={topFolder}
                      notifyClosed={() => setDlgMove(null)} />
      <DownloadFileDialog file={dlgDownload}
                          notifyClosed={() => setDlgDownload(null)} />
      <DeleteFileDialog file={dlgDelete}
                        notifyClosed={() => setDlgDelete(null)} />
    </div>
  );
};


export default UploadOverviewClientPage;
