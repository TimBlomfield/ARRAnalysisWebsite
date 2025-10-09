'use client';

import { useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import useFilesStore from '@/utils/client/useFilesStore';
// Components
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const UploadOverview_HeaderExtra = () => {
  const router = useRouter();
  const { files, topFolder, installsFolder } = useFilesStore(); // Auto-reacts to changes
  const refFileInput = useRef();

  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback(evt => {
    const selectedFiles = Array.from(evt.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file); // Appends as array under 'files' key
    });

    axios.post('/api/admin/upload-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        setUploading(false);
        toast.success(res.data?.message ?? 'File(s) Uploaded Successfully!');
        router.refresh();
        evt.target.value = '';  // Reset the <input> value
      })
      .catch(err => {
        setUploading(false);
        toast.error(err.response?.data?.message ?? 'An error occurred while uploading the file(s)!');
      });
  }, []);

  return (
    <div className={styles.adminUploadOverview}>
      <input type="file" ref={refFileInput} multiple style={{ display: 'none' }} onChange={handleFileSelect} />
      <PushButton extraClass={styles.btnUpload}
                  disabled={uploading}
                  textStyle={{ fontSize: 14, whiteSpace: 'nowrap' }}
                  onClick={() => { refFileInput.current?.click(); }}>
        Upload Files
      </PushButton>
      <div className={styles.extraNfo}>
        <div>Count:</div>
        <div className={styles.bold}>{topFolder === '-' ? '-' : files.length}</div>
        <div>Top Folder:</div>
        <div className={cn(styles.bold, styles.folder, {[styles.error]: topFolder === 'Error'})}>{topFolder}</div>
        <div>Installs Folder:</div>
        <div className={cn(styles.bold, styles.folder, {[styles.error]: installsFolder === 'Error'})}>{installsFolder}</div>
      </div>
    </div>
  );
};


export default UploadOverview_HeaderExtra;
