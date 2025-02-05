'use client';

import cn from 'classnames';
import { DateTime } from 'luxon';
// Images
import LogoSvg from '@/../public/logo-blue.svg';
// Styles
import styles from './styles.module.scss';


const RegLicenseDesc = ({ licenseData }) => {
  const statusClass = cn({
    [styles.active]: licenseData.status.toLowerCase().startsWith('active'),
    [styles.inactive]: licenseData.status.toLowerCase().startsWith('inactive'),
    [styles.disabled]: licenseData.status.toLowerCase().startsWith('disabled'),
  });

  const date = DateTime.fromISO(licenseData.validUntil).toLocaleString(DateTime.DATE_FULL);

  const customerText = licenseData.customer?.email ?? '';

  return (
    <div className={styles.license}>
      <div className={styles.header}>
        <LogoSvg className={styles.logo} />
        <div className={styles.headerText}>LICENSE</div>
      </div>
      <div className={styles.body}>
        {customerText !== '' &&
          <>
            <div className={styles.meta}>Purchased by:</div>
            <div title={customerText} className={styles.customer}>{customerText}</div>
          </>
        }
        <div className={styles.meta}>Product:</div>
        <div title={licenseData.productName}>{licenseData.productName}</div>
        <div className={styles.meta}>License Type:</div>
        <div title={licenseData.type}>{licenseData.type}</div>
        <div className={styles.meta}>Expiration Date:</div>
        <div title={date}>{date}</div>
        <div className={styles.meta}>Status:</div>
        <div title={licenseData.status} className={statusClass}>{licenseData.status}</div>
      </div>
    </div>
  );
};


export default RegLicenseDesc;
