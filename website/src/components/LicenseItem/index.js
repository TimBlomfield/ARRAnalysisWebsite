'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import axios from 'axios';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';
import { K_Theme } from '@/utils/common';
// Components
import InviteUserDialog from './InviteUserDialog';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const LoadingHelper = {
  None: 'None',
  Enable: 'Enable',
  Disable: 'Disable',
};

const LicenseItem = ({ license }) => {
  const router = useRouter();

  const [isOpen_InviteUserDialog, setIsOpen_InviteUserDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHelper, setLoadingHelper] = useState(LoadingHelper.None); // Helps display the loading state until the license was enabled/disabled and page has refreshed

  useEffect(() => {
    if (!isOpen_InviteUserDialog && successMessage !== '') {
      toast.success(successMessage);
      setSuccessMessage('');
      router.refresh();
    }
  }, [isOpen_InviteUserDialog, successMessage]);

  const bLicenseDisabled = license.status.toLowerCase().startsWith('disabled');
  const statusClass = cn(styles.status, {
    [styles.active]: license.status.toLowerCase().startsWith('active'),
    [styles.inactive]: license.status.toLowerCase().startsWith('inactive'),
    [styles.disabled]: bLicenseDisabled,
  });

  useEffect(() => {
    if ((loadingHelper === LoadingHelper.Enable && !bLicenseDisabled) || (loadingHelper === LoadingHelper.Disable && bLicenseDisabled)) {
      setLoading(false);
      setLoadingHelper(LoadingHelper.None);
    }
  }, [bLicenseDisabled, loadingHelper]);

  const onEnableDisableLicense = useCallback(() => {
    setLoading(true);

    axios.post('/api/licensing/enable-disable/', { licenseId: license.id, enable: bLicenseDisabled })
      .then(res => {
        router.refresh();
        setLoadingHelper(bLicenseDisabled ? LoadingHelper.Enable : LoadingHelper.Disable);
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message ?? `Could not ${bLicenseDisabled ? 'enable' : 'disable'} license!`);
      });
  }, [bLicenseDisabled]);

  const onAllowSelf = useCallback(() => {
    setLoading(true);

    axios.post('/api/licensing/allow-self-for-license', { licenseId: license.id })
      .then(res => {
        setLoading(false);
        router.refresh();
        toast.success(res?.data?.message ?? 'Allowed');
      })
      .catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message ?? 'Could not allow!');
      });
  }, [license]);

  let licenseUser = 'Unassigned';
  let bAssigned = false;
  if (Array.isArray(license.license_users) && license.license_users.length > 0) {
    bAssigned = true;
    licenseUser = '';
    for (let i = 0; i < license.license_users.length; ++i) {
      if (i > 0) licenseUser += ', ';
      const u = license.license_users[i];
      licenseUser += u.true_email;
      const fn = u.first_name ?? '';
      const ln = u.last_name ?? '';
      if (fn || ln) {
        let fnln = fn;
        if (fn.length > 0 && ln.length > 0) fnln += ' ';
        fnln += ln;
        licenseUser += ` (${fnln})`;
      }
    }
  }

  const dateActivated = DateTime.fromISO(license.time_activated);
  const bMailsSent = Array.isArray(license.mailsSent) && license.mailsSent.length > 0;
  const bWaitingToAssign = Array.isArray(license.portalUsers) && license.portalUsers.length > 0;

  return (
    <div className={styles.licenseBlock}>
      {loading &&
        <div className={styles.overlay}>
          <Loading theme={K_Theme.Light} scale={2} />
        </div>
      }
      <div className={styles.dataList}>
        <div>Status:</div>
        <div className={statusClass}>{license.status}</div>
        <div>Product name:</div>
        <div>{license.product?.product_name ?? '?'}</div>
        <div>License type:</div>
        <div>{license.license_type}</div>
        {dateActivated.isValid &&
          <>
            <div>Activated on:</div>
            <div>{dateActivated.toFormat('MMM d yyyy')}</div>
          </>
        }
        <div>Valid until:</div>
        <div>{DateTime.fromISO(license.validity_period).toFormat('MMM d yyyy')}</div>
        {bMailsSent &&
          <>
            <div>Invited by email:</div>
            <div>{license.mailsSent.map(item => item.email).join(', ')}</div>
          </>
        }
        {bWaitingToAssign &&
          <>
            <div>Allowed users ({license.portalUsers.length}):</div>
            <div>{license.portalUsers.map(item => item.email).join(', ')}</div>
          </>
        }
        {bAssigned &&
          <>
            <div>Assigned users ({license.license_users.length}):</div>
            <div className={styles.user}>{licenseUser}</div>
          </>
        }
      </div>
      <div className={styles.actions}>
        <PushButton extraClass={styles.pbXtra}
                    disabled={loading}
                    title="Send an invitation email."
                    onClick={() => setIsOpen_InviteUserDialog(true)}>
          Invite User
        </PushButton>
        <PushButton extraClass={styles.pbXtra}
                    disabled={loading}
                    title="Allow this license for yourself. You will then be able to assign yourself to this license and use the add-in."
                    onClick={onAllowSelf}>
          Allow for Self
        </PushButton>
        {(bMailsSent || bWaitingToAssign || bAssigned) &&
          <PushButton extraClass={styles.pbXtra}
                      disabled={loading}
                      onClick={() => { router.push(`/admin/licenses/${license.encodedId}/manage-users`); }}>
            Manage License Users
          </PushButton>
        }
        <PushButton extraClass={styles.pbXtra}
                    disabled={loading}
                    onClick={onEnableDisableLicense}>
          {bLicenseDisabled ? 'Enable' : 'Disable'} License
        </PushButton>
      </div>
      <InviteUserDialog isOpen={isOpen_InviteUserDialog}
                        notifyClosed={() => setIsOpen_InviteUserDialog(false)}
                        licenseId={license.id}
                        customerId={license.portalCustomerId}
                        passSuccessMessage={msg => setSuccessMessage(msg)} />
    </div>
  );
};


export default LicenseItem;
