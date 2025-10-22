'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import useVersionsStore from '@/utils/client/useVersionsStore';
import { TierNames } from '@/utils/common';
import { isValidVersionNumber } from '@/utils/func';
// Components
import Input from '@/components/Input';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ID_VERUPLOAD = 'input-verupload-08d931e8-2abccd0d0771';


const UploadVersions_HeaderExtra = () => {
  const router = useRouter();
  const { versions } = useVersionsStore(); // Auto-reacts to changes
  const refFileInput = useRef();

  const [uploading, setUploading] = useState(false);
  const [uploadVer, setUploadVer] = useState('');

  const handleFileSelect = useCallback(evt => {
    const selectedFiles = Array.from(evt.target.files);
    if (selectedFiles.length === 0) return;
    if (selectedFiles.length !== 3) {
      toast.error('Please select exactly 3 files!');
      return;
    }

    const correctFileNames = TierNames.toArray().map(name => `${name}.exe`);
    const file1 = selectedFiles[0].name;
    const file2 = selectedFiles[1].name;
    const file3 = selectedFiles[2].name;
    const areGoodFileNames = file1 !== file2 && file1 !== file3 && file2 !== file3 && correctFileNames.includes(file1) && correctFileNames.includes(file2) && correctFileNames.includes(file3);

    if (!areGoodFileNames) {
      toast.error('Please select exactly 3 files with the correct names!');
      return;
    }

    setUploadVer(prev => prev.trim());
    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file); // Appends as array under 'files' key
    });
    formData.append('version', uploadVer.trim());

    axios.post('/api/admin/upload-version', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        setUploading(false);
        toast.success(res.data?.message ?? 'Version Uploaded Successfully!');
        router.refresh();
        evt.target.value = '';  // Reset the <input> value
      })
      .catch(err => {
        setUploading(false);
        toast.error(err.response?.data?.message ?? 'An error occurred while uploading the files for the new version!');
      });
  }, [uploadVer]);

  const onBtnClick = useCallback(evt => {
    const targetVersion = uploadVer.trim();

    if (!isValidVersionNumber(targetVersion)) {
      toast.error('Please enter a valid version number');
      return;
    }

    for (const existingVersion of versions) {
      if (existingVersion === targetVersion) {
        toast.error(`There is already an existing version with the number ${targetVersion}`);
        return;
      }
    }

    refFileInput.current?.click();
  }, [handleFileSelect, uploadVer]);

  return (
    <div className={styles.adminUploadOverview}>
      <input type="file" ref={refFileInput} multiple style={{ display: 'none' }} onChange={handleFileSelect} />
      <PushButton extraClass={styles.btnUpload}
                  disabled={uploading}
                  textStyle={{ fontSize: 14, whiteSpace: 'nowrap' }}
                  onClick={onBtnClick}>
        Upload Version
      </PushButton>
      <Input id={ID_VERUPLOAD}
             name="versionupload"
             type="text"
             autoComplete="off"
             wrapperExtraClass={styles.wrpInp}
             extraClass={styles.inp}
             disabled={uploading}
             value={uploadVer}
             onChange={evt => setUploadVer(evt.target.value)} />
    </div>
  );
};


export default UploadVersions_HeaderExtra;
