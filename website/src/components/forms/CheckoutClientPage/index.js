'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';
import { validateUnicodeEmail } from '@/utils/validators';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import MultiToggle from '@/components/MultiToggle';
import PushButton from '@/components/PushButton';
import SubscriptionCard from './SubscriptionCard';
import ValidationError from '@/components/ValidationError';
// Images
import imgPadlock from '@/../public/Padlock.png';
// Styles
import styles from './styles.module.scss';


const ID_FIRST_NAME   = 'input-first-name-4ed8b1ab-6b5ba413a969';
const ID_LAST_NAME    = 'input-last-name-4144acc0-df0b9627fc38';
const ID_EMAIL        = 'input-email-4b4fae39-042834bf0b68';
const ID_COMPANY      = 'input-company-48a98f9b-285389b15627';
const ID_PASSWORD     = 'input-password-4e1e819f-c22942d6e8ce';
const ID_CONFIRM      = 'input-confirm-password-4404a5dc-de51f57bccd2';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY == null)
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined!');

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const getAmount = (tier, period, tiers) => {
  const prices = tier === 0
    ? tiers.One.Prices
    : (tier === 1 ? tiers.Two.Prices : tiers.Three.Prices);
  return period === 0 ? prices.Monthly : prices.Yearly;
};


const CheckoutClientPage = ({ tiers }) => {
  const searchParams = useSearchParams();

  //////////////////////////////////////////////////////////////////
  // State
  //////////////////////////////////////////////////////////////////
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(0);
  const [tier, setTier] = useState(0);
  const [t3Licenses, setT3Licenses] = useState(1);
  // Customer Information
  const [firstName, setFirstName] = useState('');
  const [errFirstName, setErrFirstName] = useState(false);
  const [lastName, setLastName] = useState('');
  const [errLastName, setErrLastName] = useState(false);
  const [email, setEmail] = useState('');
  const [errEmail, setErrEmail] = useState(false);
  const [company, setCompany] = useState('');
  const [errCompany, setErrCompany] = useState(false);
  const [password, setPassword] = useState('');
  const [errPassword, setErrPassword] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [errConfirm, setErrConfirm] = useState(false);
  // Validation error
  const [validationError, setValidationError] = useState('');
  // Payment
  const [sPay, setSPay] = useState(null);
  const [processing, setProcessing] = useState(false);
  //////////////////////////////////////////////////////////////////

  const amount = getAmount(tier, period, tiers);  // Amount in cents
  const fnUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const dollars = amount / 100 * (tier === 2 ? t3Licenses : 1);
  const txtPayBtn = `SUBSCRIBE\u00A0\u00A0(${fnUSD.format(dollars)})`;
  const bDisablePayButton = processing || sPay == null || sPay.stripe == null || sPay.elements == null;


  //////////////////////////////////////////////////////////////////
  // Effects
  //////////////////////////////////////////////////////////////////
  useEffect(() => {
    const period = window.atob(searchParams.get('period'));
    const tierDesc = window.atob(searchParams.get('tier'));

    setPeriod(period === 'Monthly' ? 0 : 1);
    setTier(tierDesc === tiers.One.Desc ? 0 : (tierDesc === tiers.Two.Desc ? 1 : 2));
    setLoading(false);
  }, []);
  //////////////////////////////////////////////////////////////////


  const handleInputChange = useCallback((val, fn, errFn = null) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        if (errFn) errFn(false);
      }
    };
  }, []);
  const firstNameFn = handleInputChange(firstName, setFirstName, setErrFirstName);
  const lastNameFn = handleInputChange(lastName, setLastName, setErrLastName);
  const emailFn = handleInputChange(email, setEmail, setErrEmail);
  const companyFn = handleInputChange(company, setCompany, setErrCompany);
  const passwordFn = handleInputChange(password, setPassword, setErrPassword);
  const confirmFn = handleInputChange(confirm, setConfirm, setErrConfirm);

  const handlePay = async evt => {
    evt.preventDefault(); // Don't submit the form

    try {
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        company: company.trim(),
        password: password,
        confirm: confirm,
      };
      let bErrorMissing = false, bErrorInvalidEmail = false, bErrorPassMatch = false, bErrorPassShort = false;

      if (userData.firstName.length === 0) { bErrorMissing = true; setErrFirstName(true); }
      if (userData.lastName.length === 0) { bErrorMissing = true; setErrLastName(true); }
      if (userData.email.length === 0) { bErrorMissing = true; setErrEmail(true); }
      if (userData.password.length === 0) { bErrorMissing = true; setErrPassword(true); }
      if (userData.password.length > 0 && userData.password.length < 4) { bErrorPassShort = true; setErrPassword(true); }
      if (userData.email.length > 0 && !validateUnicodeEmail(userData.email)) { bErrorInvalidEmail = true; setErrEmail(true); }
      if (userData.password !== userData.confirm) { bErrorPassMatch = true; setErrPassword(true); setErrConfirm(true); }
      if (bErrorMissing || bErrorInvalidEmail || bErrorPassMatch || bErrorPassShort) {
        let strError = 'Customer validation failed:';
        if (bErrorMissing)
          strError += '\n\u00A0\u00A0\u00A0• Missing required user data';
        if (bErrorInvalidEmail)
          strError += '\n\u00A0\u00A0\u00A0• Invalid email address';
        if (bErrorPassShort)
          strError += '\n\u00A0\u00A0\u00A0• Password must be at least 4 characters long';
        if (bErrorPassMatch)
          strError += '\n\u00A0\u00A0\u00A0• Password confirmation does not match';
        throw new Error(strError);
      }

      setValidationError('');
      if (bDisablePayButton) return; // Sanity check
      const { stripe, elements } = sPay;  // These are valid because bDisablePayButton is false at this point

      const { error: submitError } = await elements.submit();
      if (submitError) {
        const errElems = new Error(submitError?.message ?? 'Payment Method error');
        errElems.name = 'submitForm';
        throw errElems;
      }

      setProcessing(true);

      const { data } = await axios.post('/api/stripe/create-subscription', { tier, period, userData });
      const { clientSecret, redirectBase } = data;

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${redirectBase}/purchase/checkout/success`,
        },
      });

      if (error) {
        const errConfirm = new Error(error?.message ?? 'Payment Method error');
        errConfirm.name = 'confirmPayment';
        throw errConfirm;
      }
    } catch (error) {
      let strErr, bScroll = true;
      if (error?.name === 'AxiosError') {
        // Server error
        strErr = `Server error - ${(error?.message?.length > 0) ? error.message : 'An unknown error has occurred.'}`;
        if (error?.response?.data?.message?.length > 0)
          strErr += `:\n\u00A0\u00A0\u00A0• ${error.response.data.message}`;
      } else {
        // Client error (or Server non-Axios error)
        if (error?.name === 'submitForm') {
          bScroll = false;
          strErr = '';
        } else
          strErr = (error?.message?.length > 0) ? error.message : 'An unknown error has occurred.';
      }
      setValidationError(strErr);
      setProcessing(false);
      if (bScroll) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className={styles.main}>

      <form className={styles.inner}>
        <section className={styles.title}>
          <Image alt="lock" src={imgPadlock} className={styles.padlock} priority />
          Checkout
        </section>

        {loading && <Loading scale={2} />}
        {!loading &&
          <>
            {validationError && <ValidationError onClose={() => setValidationError('')}>{validationError}</ValidationError>}

            <section className={styles.subscription}>
              <div className={styles.title}>Subscription</div>
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

            <section className={styles.customerInfo}>
              <div className={styles.title}>Customer Information</div>
              <Input id={ID_FIRST_NAME}
                     disabled={processing}
                     name="first-name"
                     type="text"
                     autoComplete="given-name"
                     placeholder="First Name"
                     extraClass={styles.inp}
                     value={firstName}
                     onChange={firstNameFn}
                     errorBorder={errFirstName} />
              <Input id={ID_LAST_NAME}
                     disabled={processing}
                     name="last-name"
                     type="text"
                     autoComplete="family-name"
                     placeholder="Last Name"
                     extraClass={styles.inp}
                     value={lastName}
                     onChange={lastNameFn}
                     errorBorder={errLastName} />
              <Input id={ID_EMAIL}
                     disabled={processing}
                     name="email"
                     type="email"
                     autoComplete="email"
                     placeholder="Email"
                     extraClass={styles.inp}
                     value={email}
                     onChange={emailFn}
                     errorBorder={errEmail} />
              <Input id={ID_COMPANY}
                     disabled={processing}
                     name="company"
                     type="text"
                     autoComplete="organization"
                     placeholder="Company"
                     wrapperExtraClass={styles.inpWrapComp}
                     extraClass={styles.inp}
                     value={company}
                     onChange={companyFn}
                     errorBorder={errCompany} />
              <Input id={ID_PASSWORD}
                     disabled={processing}
                     name="password"
                     type="password"
                     autoComplete="new-password"
                     placeholder="Password"
                     extraClass={styles.inp}
                     value={password}
                     onChange={passwordFn}
                     errorBorder={errPassword} />
              <Input id={ID_CONFIRM}
                     disabled={processing}
                     name="confirm"
                     type="password"
                     autoComplete="new-password"
                     placeholder="Confirm Password"
                     extraClass={styles.inp}
                     value={confirm}
                     onChange={confirmFn}
                     errorBorder={errConfirm} />
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
          </>
        }
      </form>
    </main>
  );
};


export default CheckoutClientPage;
