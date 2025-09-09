'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Components
import Footer from '@/components/admin/Footer';
import PurchaseSummary from '@/components/PurchaseSummary';
// Styles
import styles from './styles.module.scss';


const PurchaseSuccessClientPage = ({ tier, licenses, period }) => {
  const router = useRouter();

  useEffect(() => { router.refresh(); }, []);

  return (
    <main className={styles.main}>
      <div className={styles.info}>
        <div className={styles.title}>Thank You for Your Purchase&nbsp;!</div>
        <PurchaseSummary tier={tier} licenses={licenses} period={period} />
      </div>
      <Footer />
    </main>
  );
};


export default PurchaseSuccessClientPage;
