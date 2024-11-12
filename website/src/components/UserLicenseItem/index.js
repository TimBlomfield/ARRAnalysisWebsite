'use client';

import { useState } from 'react';
import { K_Theme } from '@/utils/common';
// Components
import Loading from '@/components/Loading';
import RegLicenseDesc from '@/components/RegLicenseDesc';
// Styles
import styles from './styles.module.scss';


const UserLicenseItem = ({ license }) => {
  const [licenseData] = useState(() => ({
    status: license.status,
    productName: license.product.product_name,
    type: license.license_type,
    validUntil: license.validity_period,
  }));
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.licenseBlock}>
      {loading &&
        <div className={styles.overlay}>
          <Loading theme={K_Theme.Light} scale={2} />
        </div>
      }
      <RegLicenseDesc licenseData={licenseData} />
    </div>
  );
};


export default UserLicenseItem;
