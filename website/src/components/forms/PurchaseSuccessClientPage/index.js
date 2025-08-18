'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Components
import Footer from '@/components/admin/Footer';
// Styles
import styles from './styles.module.scss';


const PurchaseSuccessClientPage = ({ N, period, tier }) => {
  const router = useRouter();

  useEffect(() => { router.refresh(); }, []);

  return (
    <main className={styles.main}>
      <div className={styles.info}>
        <div className={styles.title}>Payment Successful</div>
        <div className={styles.desc}>You have purchased<br />{N} {period} subscription{N > 1 ? 's' : ''} for Tier {tier}<br />of the ARR Analysis add-in</div>
      </div>
      <Footer />
    </main>
  );
};


export default PurchaseSuccessClientPage;
