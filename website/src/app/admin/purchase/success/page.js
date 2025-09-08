import { notFound, redirect, RedirectType } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';
import { createAuditLog } from '@/utils/server/audit';
import { AuditEvent } from '@prisma/client';
// Components
import PurchaseSuccessClientPage from '@/components/forms/PurchaseSuccessClientPage';


// Function to check if an audit log exists for the payment intent
const checkExistingAuditLog = async paymentIntentId => {
  try {
    const existingLog = await db.auditLog.findFirst({
      where: {
        description: paymentIntentId,
      },
    });
    return !!existingLog; // Return true if a log exists, false otherwise
  } catch (error) {
    console.error('Error checking existing audit log:', error);
    throw error; // Or handle as needed
  }
};


const PurchaseSuccessPage = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const { scid: id_stripeCustomer, redirect_status, payment_intent } = searchParams;
  let paymentIntentFailed = false;

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
    redirect(`/admin/purchase/failed?${queryString}`, RedirectType.replace); // redirect must be called outside a try/catch block
  }

  let N, period, tier;
  try {
    const purchaseInfo = JSON.parse(atob(searchParams.pi));
    N = purchaseInfo.licenses ?? 1;
    period = purchaseInfo.period === 0 ? 'monthly' : 'yearly';
    tier = purchaseInfo.tier + 1;

    const theUserData = await db.userData.findUnique({
      where: { email: token.email },
      include: { customer: true },
    });

    if (theUserData != null) {
      if (theUserData.customer == null) {
        await db.customer.create({
          data: {
            id_stripeCustomer,
            id_UserData: theUserData.id,
          },
        });
      }
    }

    const logExists = await checkExistingAuditLog(payment_intent);
    if (!logExists)
      await createAuditLog({
        type: AuditEvent.PAYMENT_SUCCESS_ADMINPAGE,
        stripeCustomerId: id_stripeCustomer,
        description: payment_intent, // Saving this in the AuditLog's description field, for uniqueness check
      });

    revalidatePath('/');
  } catch (err) {
    console.error(err);
    notFound();
  }

  return <PurchaseSuccessClientPage N={N} period={period} tier={tier} />;
};


export default PurchaseSuccessPage;
