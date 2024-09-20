'use client';

import cn from 'classnames';
import { DateTime } from 'luxon';
// Components
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';
import axios from 'axios';


const LicenseItem = ({ license }) => {
  const statusClass = cn(styles.status, {
    [styles.active]: license.status.toLowerCase().startsWith('active'),
    [styles.inactive]: license.status.toLowerCase().startsWith('inactive'),
    [styles.disabled]: license.status.toLowerCase().startsWith('disabled'),
  });

  const assignUser = async () => {
    try {
      // const { data } = await axios.post('/api/stripe/create-subscription', { tier, t3Licenses, period, userData });
      const { data } = await axios.post('/api/license-spring/assign-license-to-user', {
        email: 'truk_123@example.com',
        first_name: 'Katherine',
        last_name: 'Truman',
      });

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.licenseBlock}>
      <div className={styles.dataList}>
        <div>Status:</div>
        <div className={statusClass}>{license.status}</div>
        <div>Product name:</div>
        <div>{license.product?.product_name ?? '?'}</div>
        <div>License type:</div>
        <div>{license.license_type}</div>
        <div>Activated on:</div>
        <div>{DateTime.fromISO(license.time_activated).toFormat('MMM d yyyy')}</div>
        <div>Valid until:</div>
        <div>{DateTime.fromISO(license.validity_period).toFormat('MMM d yyyy')}</div>
        <div>Assigned to:</div>
        <div>{license.license_user == null ? 'Unassigned' : 'Some User'}</div>
      </div>
      <div className={styles.actions}>
        <PushButton extraClass={styles.pbXtra} onClick={assignUser}>Assign</PushButton>
      </div>
    </div>
  );
};


export default LicenseItem;
