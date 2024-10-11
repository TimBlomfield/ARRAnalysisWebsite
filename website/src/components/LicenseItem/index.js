'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';
// Components
import AssignLicenseDialog from './AssignLicenseDialog';
import ManageInvitesDialog from './ManageInvitesDialog';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const LicenseItem = ({ license }) => {
  const router = useRouter();

  const [isOpen_AssignLicenseDialog, setIsOpen_AssignLicenseDialog] = useState(false);
  const [isOpen_ManageInvitesDialog, setIsOpen_ManageInvitesDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isOpen_AssignLicenseDialog && !isOpen_ManageInvitesDialog && successMessage !== '') {
      toast.success(successMessage);
      setSuccessMessage('');
      router.refresh();
    }
  }, [isOpen_AssignLicenseDialog, isOpen_ManageInvitesDialog, successMessage]);

  const statusClass = cn(styles.status, {
    [styles.active]: license.status.toLowerCase().startsWith('active'),
    [styles.inactive]: license.status.toLowerCase().startsWith('inactive'),
    [styles.disabled]: license.status.toLowerCase().startsWith('disabled'),
  });

  let licenseUser = 'Unassigned';
  let bAssigned = false;
  if (Array.isArray(license.license_users) && license.license_users.length > 0) {
    bAssigned = true;
    const u = license.license_users[0];
    licenseUser = u.true_email;
    const fn = u.first_name ?? '';
    const ln = u.last_name ?? '';
    if (fn || ln) {
      let fnln = fn;
      if (fn.length > 0 && ln.length > 0) fnln += ' ';
      fnln += ln;
      licenseUser += ` (${fnln})`;
    }
  }

  const dateActivated = DateTime.fromISO(license.time_activated);
  const bMailsSent = Array.isArray(license.mailsSent) && license.mailsSent.length > 0;

  return (
    <div className={styles.licenseBlock}>
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
        <div>Assigned to:</div>
        <div className={bAssigned ? styles.user : ''}>{licenseUser}</div>
        {bMailsSent &&
          <>
            <div>Email sent to:</div>
            <div>{license.mailsSent.map(item => item.email).join(', ')}</div>
          </>
        }
      </div>
      <div className={styles.actions}>
        {!bAssigned &&
          <>
            <PushButton extraClass={styles.pbXtra}
                        onClick={() => setIsOpen_AssignLicenseDialog(true)}>
              Assign
            </PushButton>
            <PushButton extraClass={styles.pbXtra}
                        onClick={() => { /* TODO: to be implemented*/ }}>
              Assign to self
            </PushButton>
            {bMailsSent &&
              <PushButton extraClass={styles.pbXtra}
                          onClick={() => setIsOpen_ManageInvitesDialog(true)}>
                Manage invites
              </PushButton>
            }
          </>
        }
        {bAssigned &&
          <PushButton extraClass={styles.pbXtra}
                      onClick={() => { /* TODO: to be implemented*/ }}>
            Unassign user
          </PushButton>
        }
      </div>
      <AssignLicenseDialog isOpen={isOpen_AssignLicenseDialog}
                           notifyClosed={() => setIsOpen_AssignLicenseDialog(false)}
                           licenseId={license.id}
                           passSuccessMessage={msg => setSuccessMessage(msg)} />
      <ManageInvitesDialog isOpen={isOpen_ManageInvitesDialog}
                           notifyClosed={() => setIsOpen_ManageInvitesDialog(false)}
                           emailList={license.mailsSent}
                           passSuccessMessage={msg => setSuccessMessage(msg)} />
    </div>
  );
};


export default LicenseItem;
