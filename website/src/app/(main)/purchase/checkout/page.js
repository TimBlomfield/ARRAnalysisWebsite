'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Tiers } from '@/utils/common';
// Components
import Loading from '@/components/Loading';
import MultiToggle from '@/components/MultiToggle';
import SubscriptionCard from './subscription-card';
// Images
import imgPadlock from '@/../public/Padlock.png';
// Styles
import styles from './page.module.scss';


const CheckoutPage = () => {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(0);
  const [tier, setTier] = useState(0);

  useEffect(() => {
    const period = window.atob(searchParams.get('period'));
    const tierDesc = window.atob(searchParams.get('tier'));

    setPeriod(period === 'Monthly' ? 0 : 1);
    setTier(tierDesc === Tiers.One.Desc ? 0 : (tierDesc === Tiers.Two.Desc ? 1 : 2));
    setLoading(false);
  }, []);

  return (
    <main className={styles.main}>

      <div className={styles.inner}>
        <section className={styles.title}>
          <Image alt="lock" src={imgPadlock} className={styles.padlock} priority />
          Checkout
        </section>

        {loading && <Loading scale={2} />}
        {!loading &&
          <>
            <section className={styles.card}>
              <div className={styles.title}>Subscription</div>
              <div className={styles.cell}>
                <SubscriptionCard tier={Tiers.One} selected={tier === 0} onSelect={() => setTier(0)} monthly={period == 0} />
              </div>
              <div className={styles.cell}>
                <SubscriptionCard tier={Tiers.Two} selected={tier === 1} onSelect={() => setTier(1)} monthly={period == 0} />
              </div>
              <div className={styles.cell}>
                <SubscriptionCard tier={Tiers.Three} selected={tier === 2} onSelect={() => setTier(2)} monthly={period == 0} />
              </div>
              <div className={styles.billing}>
                <MultiToggle extraClass={styles.mulTogXtra}
                             selected={period}
                             onSelect={x => setPeriod(x)}
                             options={['Monthly', 'Yearly']} />
                <div>Billing</div>
              </div>
            </section>
          </>
        }
      </div>
    </main>
  );
};


export default CheckoutPage;
