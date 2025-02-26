'use client';

import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { K_Theme } from '@/utils/common';
// Components
import LicensePasswordDialog from '@/components/dialogs/LicensePasswordDialog';
import Loading from '@/components/Loading';
import RegLicenseDesc from '@/components/RegLicenseDesc';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const UserLicenseItem = ({ license, email }) => {
  const router = useRouter();

  const [licenseData, setLicenseData] = useState(() => ({
    customer: license.customer,
    status: license.status,
    productName: license.product.product_name,
    type: license.license_type,
    validUntil: license.validity_period,
  }));
  const [initialLoading, setInitialLoading] = useState(true);
  const [isAssigned, setIsAssigned] = useState(false);
  const [initialPassword, setInitialPassword] = useState(null);
  const [pwdChangeDlg, setPwdChangeDlg] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLicenseData({
      customer: license.customer,
      status: license.status,
      productName: license.product.product_name,
      type: license.license_type,
      validUntil: license.validity_period,
    });
    const arrUsers = license.license_users || [];
    const user = arrUsers.find(u => u.true_email === email);
    setIsAssigned(user != null);
    setInitialLoading(false);
    if (user != null && user.is_initial_password)
      setInitialPassword(user.initial_password);
    else
      setInitialPassword(null);
    setLoading(false);
  }, [license]);

  const copyToClipboard = useCallback(code => {
    const { NativeAndroid } = window;

    if (typeof NativeAndroid !== 'undefined') {
      NativeAndroid.copyToClipboard(code);
      toast.success('Password copied to clipboard.');
    } else {
      navigator.clipboard.writeText(code)
        .then(() => toast.success('Password copied to clipboard.'))
        .catch(error => toast.error('Could not copy password to clipboard.'));
    }
  }, []);

  const onAssignSelf = useCallback(() => {
    setLoading(true);

    axios.post('/api/licensing/assign-user', { licenseId: license.id, email })
      .then(res => {
        router.refresh();
        toast.success(res?.data?.message ?? 'Assigned');
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message ?? 'Could not assign!');
      });
  }, [license]);

  const onChangePassword = useCallback(password => {
    setLoading(true);

    axios.post('/api/licensing/change-user-password', { password, email })
      .then(res => {
        setLoading(false);
        router.refresh();
        toast.success(res?.data?.message ?? 'Password changed.');
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message ?? 'Password change failed!');
      });
  }, []);

  return (
    <div className={styles.licenseBlock}>
      {loading &&
        <div className={styles.overlay}>
          <Loading theme={K_Theme.Dark} scale={2} />
        </div>
      }
      <RegLicenseDesc licenseData={licenseData} />
      <div className={cn(styles.dataBlock, styles.g15)}>
        {(!isAssigned && !initialLoading) &&
          <>
            <div className={styles.txt}>This license is allowed for your usage. Click the <span className={styles.emph}>Assign Self</span> button to assign yourself to this license, after which you will be able to use the ARR Analysis add-in.</div>
            <PushButton extraClass={styles.btnCntr}
                        disabled={loading}
                        onClick={onAssignSelf}>
              Assing Self
            </PushButton>
          </>
        }
        {isAssigned &&
          <>
            <div className={styles.txt}>You can use the ARR Analysis add-in with your credentials (email and password) for this license.</div>
            {initialPassword != null &&
              <div className={styles.initialPwdArea}>
                <div className={styles.txt}>An initial password has been generated for you. You can use the add-in with this password but we strongly recommend that you change it.</div>
                <PushButton extraClass={styles.btn48}
                            disabled={loading}
                            onClick={() => copyToClipboard(initialPassword)}>
                  Copy Initial Password
                </PushButton>
              </div>
            }
            <PushButton disabled={loading}
                        onClick={() => setPwdChangeDlg(true)}>
              Change Password
            </PushButton>
          </>
        }
      </div>
      <LicensePasswordDialog isOpen={pwdChangeDlg}
                             notifyClosed={() => setPwdChangeDlg(false)}
                             onConfirm={onChangePassword} />
    </div>
  );
};


export default UserLicenseItem;
