'use client';

import { useState } from 'react';
// Components
import Loading from '@/components/Loading';
import MultiToggle from '@/components/MultiToggle';
import SubscriptionCard from '../CheckoutClientPage/SubscriptionCard';
// Styles
import styles from './styles.module.scss';


const PurchaseClientPage = ({ tiers }) => {
  //////////////////////////////////////////////////////////////////
  // State
  //////////////////////////////////////////////////////////////////
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(0);
  const [tier, setTier] = useState(0);
  const [t3Licenses, setT3Licenses] = useState(1);
  // Payment
  const [sPay, setSPay] = useState(null);
  const [processing, setProcessing] = useState(false);
  //////////////////////////////////////////////////////////////////

  return (
    <main className={styles.main}>
      <form className={styles.inner}>
        <section className={styles.title}>Purchase additional subscriptions</section>

        <section className={styles.subscription}>
          <div className={styles.cell}>
            <SubscriptionCard tier={tiers.One}
                              selected={tier === 0}
                              onSelect={() => setTier(0)}
                              monthly={period === 0}
                              processing={processing} />
          </div>
          <div className={styles.cell}>
            <SubscriptionCard tier={tiers.Two}
                              selected={tier === 1}
                              onSelect={() => setTier(1)}
                              monthly={period === 0}
                              processing={processing} />
          </div>
          <div className={styles.cell}>
            <SubscriptionCard tier={tiers.Three}
                              selected={tier === 2}
                              onSelect={() => { setTier(2); setT3Licenses(1); }}
                              licenceCount={t3Licenses}
                              setLicenseCount={setT3Licenses}
                              monthly={period === 0}
                              processing={processing} />
          </div>
          <div className={styles.billing}>
            <MultiToggle extraClass={styles.mulTogXtra}
                         disabled={processing}
                         selected={period}
                         onSelect={x => setPeriod(x)}
                         options={['Monthly', 'Yearly']} />
            <div>Billing</div>
          </div>
        </section>
      </form>
    </main>
  )
};


export default PurchaseClientPage;
