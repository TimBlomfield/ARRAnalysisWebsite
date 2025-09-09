import { DateTime } from 'luxon';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { notFound, redirect, RedirectType } from 'next/navigation';
import Link from 'next/link';
import Stripe from 'stripe';
import { AuditEvent } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import db from '@/utils/server/db';
import thankYouEmail from '@/utils/emails/thank-you.html';
import { getPricingTiers } from '@/utils/server/prices';
// Components
import LinkButton from '@/components/LinkButton';
import PurchaseSummary from '@/components/PurchaseSummary';
// Images
import CheckmarkCircle from '@/../public/CheckmarkCircle.svg';
// Styles
import styles from './page.module.scss';


const PaymentSuccessPage = async ({ searchParams }) => {
  const { scid: id_stripeCustomer, secret, pi, redirect_status, payment_intent } = searchParams;
  let purchaseInfo, bHasUserData = false, paymentIntentFailed = false;

  if (payment_intent != null) {
    // Verifying the payment intent because it's possible that the redirect_status is 'succeeded' but the payment_intent is not.
    // This can happen if the payment process redirects to a new tab.
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
      paymentIntentFailed = paymentIntent.status !== 'succeeded';
    } catch (err) {
      console.error('An error occurred while trying to verify PaymentIntent:');
      console.error(err);
    }
  }

  if (redirect_status !== 'succeeded' || paymentIntentFailed) {
    const queryString = new URLSearchParams(searchParams).toString();
    redirect(`/purchase/checkout/failed?${queryString}`, RedirectType.replace); // redirect must be called outside a try/catch block
  }

  try {
    purchaseInfo = JSON.parse(atob(pi));

    const tiers = await getPricingTiers();

    const theUserData = await db.userData.findFirst({ where: { secret }});
    if (theUserData != null)
      bHasUserData = true;

    if (theUserData != null) {
      await db.customer.create({
        data: {
          id_stripeCustomer,
          id_UserData: theUserData.id,
        },
      });

      // Set the secret to ""
      await db.userData.update({
        where: { id: theUserData.id },
        data: { secret: '' },
      });

      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

      const subscriptions = purchaseInfo.licenses == null || purchaseInfo.licenses === 1 ? 'a subscription' : `${purchaseInfo.licenses} subscriptions`;
      let prodName = '';
      switch (purchaseInfo.tier) {
        case 0: prodName = tiers.One.Desc; break;
        case 1: prodName = tiers.Two.Desc; break;
        case 2: prodName = tiers.Three.Desc; break;
      }

      const html = thankYouEmail.replaceAll('[[Logo URL]]', `${process.env.NEXTAUTH_URL}/logo-blue.svg`)
        .replaceAll('[[Login URL]]', process.env.LOGIN_BASEURL)
        .replaceAll('[[Customer Name]]', `${theUserData.firstName} ${theUserData.lastName}`)
        .replaceAll('[[Subscription]]', subscriptions)
        .replaceAll('[[Tier]]', `Tier ${purchaseInfo.tier + 1}`)
        .replaceAll('[[Product Name]]', `${prodName} (Tier ${purchaseInfo.tier + 1})`)
        .replaceAll('[[Subscription Type]]', purchaseInfo.period === 0 ? 'Monthly' : 'Yearly')
        .replaceAll('[[Purchase Date]]', DateTime.now().toFormat('dd LLL yyyy'))
        .replaceAll('[[Your Name]]', 'Tim Blomfield')
        .replaceAll('[[Your Company]]', 'ARR Analysis')
        .replaceAll('[[Current Year]]', DateTime.now().toFormat('yyyy'))
        .replaceAll('[[Customer Email]]', theUserData.email);

      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `The ARR Analysis Support Team <support-team@${process.env.MAILGUN_DOMAIN}>`,
        to: [theUserData.email],
        subject: 'Welcome to ARR Analysis - Your Excel Add-in purchase confirmation',
        text: 'Thank you for your purchase',
        html,
      });
    }
  } catch {
    notFound();
  }

  if (bHasUserData) { // Don't audit log if there is no UserData. That's probably a page refresh.
    await createAuditLog({
      type: AuditEvent.PAYMENT_SUCCESS_PAGE,
      stripeCustomerId: id_stripeCustomer,
      secret,
    });
  }

  const tierDesc = purchaseInfo.tier === 0
    ? 'Basic'
    : purchaseInfo.tier === 1 ? 'Intermediate' : 'Advanced';

  const licenses = purchaseInfo.licenses == null || purchaseInfo.licenses === 1 ? '1 License' : `${purchaseInfo.licenses} Licenses`;

  return (
    <div className={styles.main}>
      <div className={styles.contents}>
        <CheckmarkCircle className={styles.checkMark} />
        <div className={styles.txtThankYou}>Thank You for Your Purchase!</div>
        <div className={styles.txtWelcome}>Your order has been processed successfully. Welcome to the ARR Analysis family!</div>
        <PurchaseSummary {...purchaseInfo} />
        <LinkButton href="/login" extraClass={styles.loginLink}>
          Access Your Account
        </LinkButton>
        <div className={styles.txtHelp}>Need help getting started? Check out our <Link href="/help-center">help center</Link> or <Link href="mailto:support-team@arr-analysis.com">send an e-mail</Link> to our support team.<br />We&apos;re here to help you succeed!</div>
      </div>
    </div>
  );
};


export default PaymentSuccessPage;
