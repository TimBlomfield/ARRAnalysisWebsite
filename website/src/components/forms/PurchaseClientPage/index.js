'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
// Components
import Loading from '@/components/Loading';
import MultiToggle from '@/components/MultiToggle';
import SubscriptionCard from '../CheckoutClientPage/SubscriptionCard';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY == null)
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined!');

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const getAmount = (tier, period, tiers) => {
  const prices = tier === 0
    ? tiers.One.Prices
    : (tier === 1 ? tiers.Two.Prices : tiers.Three.Prices);
  return period === 0 ? prices.Monthly : prices.Yearly;
};


const PurchaseClientPage = ({ tiers }) => {
  //////////////////////////////////////////////////////////////////
  // State
  //////////////////////////////////////////////////////////////////
  const [period, setPeriod] = useState(0);
  const [tier, setTier] = useState(2);
  const [t3Licenses, setT3Licenses] = useState(1);
  // Payment
  const [sPay, setSPay] = useState(null);
  const [processing, setProcessing] = useState(false);
  //////////////////////////////////////////////////////////////////

  const amount = getAmount(tier, period, tiers);  // Amount in cents
  const fnUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const dollars = amount / 100 * (tier === 2 ? t3Licenses : 1);
  const txtPayBtn = `PURCHASE\u00A0\u00A0(${fnUSD.format(dollars)})`;
  const bDisablePayButton = processing || sPay == null || sPay.stripe == null || sPay.elements == null;

  const handlePay = async evt => {
    evt.preventDefault(); // Don't submit the form
    try {
      if (bDisablePayButton) return; // Sanity check
      const { stripe, elements } = sPay;  // These are valid because bDisablePayButton is false at this point

      const { error: submitError } = await elements.submit();
      if (submitError) {
        return;
      }

      setProcessing(true);

      const { data } = await axios.post('/api/stripe/purchase/', { tier, t3Licenses, period });
      const { clientSecret, redirectBase, stripeCustomerId } = data;

      const purchaseInfo = { tier, period, ...(tier === 2 ? { licenses: t3Licenses} : {}) };
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${redirectBase}/admin/purchase/success?pi=${btoa(JSON.stringify(purchaseInfo))}&scid=${stripeCustomerId}`,
        },
      });

      if (error) {
        const errConfirm = new Error(error?.message ?? 'Payment Method error');
        errConfirm.name = 'confirmPayment';
        throw errConfirm;
      }
    } catch (error) {
      let strErr;
      if (error?.name === 'AxiosError') {
        // Server error
        strErr = `Server error - ${(error?.message?.length > 0) ? error.message : 'An unknown error has occurred.'}`;
        if (error?.response?.data?.message?.length > 0)
          strErr += `:\n\u00A0\u00A0\u00A0• ${error.response.data.message}`;
      } else {
        // Client error (or Server non-Axios error)
        if (error?.name === 'submitForm') {
          strErr = '';
        } else
          strErr = (error?.message?.length > 0) ? error.message : 'An unknown error has occurred.';
      }
      if (!!strErr) console.error(strErr);
    }
  };

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

        <section className={styles.paymentMethod}>
          <div className={styles.title}>Payment Method</div>
          <Elements stripe={stripePromise}
                    options={{
                      mode: 'subscription',
                      amount,
                      currency: 'usd',
                      setupFutureUsage: 'off_session',
                    }}>
            <ElementsConsumer>
              {({stripe, elements}) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => setSPay({ stripe, elements }), [stripe, elements]);

                return <PaymentElement options={{ readOnly: processing }} />;
              }}
            </ElementsConsumer>
          </Elements>
          {processing && <div className={styles.overlay}><Loading scale={2} /></div>}
        </section>

        <PushButton disabled={bDisablePayButton} extraClass={styles.btnPayXtra} onClick={handlePay}>{processing ? 'Processing...' : txtPayBtn}</PushButton>
      </form>
    </main>
  );
};


export default PurchaseClientPage;
