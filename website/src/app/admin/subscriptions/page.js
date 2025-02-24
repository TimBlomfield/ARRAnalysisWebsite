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

    const products = await stripe.products.list({ limit: 50 });

    if (active.object !== 'list' || !Array.isArray(active.data) || ended.object !== 'list' || !Array.isArray(ended.data)) {
      console.error('Active subscriptions:');
      console.error(active);
      console.error('Ended subscriptions:');
      console.error(ended);
      throw new Error('Invalid subscriptions retrieved!');
    }
    if (products.object !== 'list' || !Array.isArray(products.data)) {
      console.error(products);
      throw new Error('Invalid products retrieved!');
    }

    subscriptions = { active: active.data, ended: ended.data };
    for (const sub of [...subscriptions.active, ...subscriptions.ended])
      sub.kProduct = products.data.find(prod => prod.id === sub?.plan?.product);
  } catch (err) {
    console.error(err);
    notFound();
  }

  return <SubscriptionsClientPage subscriptions={subscriptions} />;
};


export default SubscriptionsPage;
