import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';
import { authOptions } from '@/utils/server/auth';
import { getACU_Ids, isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';
// Components
import SubscriptionsClientPage from '@/components/forms/SubscriptionsClientPage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const SubscriptionsPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const acuIds = await getACU_Ids(token.email);
  if (acuIds?.customerId == null)
    notFound();

  let subscriptions = null;
  try {
    // Get the stripe-customer-id
    const customer = await db.customer.findUnique({
      where: { id: acuIds.customerId },
      select: { id_stripeCustomer: true },
    });

    const active = await stripe.subscriptions.list({
      customer: customer.id_stripeCustomer,
      limit: 50,  // Just a big number (fetching virtually all subscriptions for this customer)
    });

    const ended = await stripe.subscriptions.list({
      customer: customer.id_stripeCustomer,
      limit: 50,  // Just a big number (fetching virtually all subscriptions for this customer)
      status: 'ended',
    });

    subscriptions = { active, ended };
  } catch (err) {
    console.error(err);
    notFound();
  }

  return <SubscriptionsClientPage subscriptions={subscriptions} />;
};


export default SubscriptionsPage;
