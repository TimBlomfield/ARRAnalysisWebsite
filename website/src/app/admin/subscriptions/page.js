import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';
import { authOptions } from '@/utils/server/auth';
import { getACU_Ids, isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';
import heavilyReduce from './utils';
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

    // Get the subscriptions
    subscriptions = await stripe.subscriptions.list({
      customer: customer.id_stripeCustomer,
      limit: 50,  // Just a big number (fetching virtually all subscriptions for this customer)
      status: 'all',
    });

    if (subscriptions.object !== 'list' || !Array.isArray(subscriptions.data)) {
      console.error('Subscriptions:');
      console.error(subscriptions);
      throw new Error('Invalid subscriptions retrieved!');
    }

    // Get products
    const products = await stripe.products.list({ limit: 50 });

    if (products.object !== 'list' || !Array.isArray(products.data)) {
      console.error(products);
      throw new Error('Invalid products retrieved!');
    }

    // Get the invoices and the upcoming invoice
    for (const sub of subscriptions.data) {
      sub.kProduct = products.data.find(prod => prod.id === sub?.plan?.product);

      sub.kInvoices = await stripe.invoices.list({
        customer: customer.id_stripeCustomer,
        subscription: sub.id,
        limit: 10,
      });

      try {
        sub.kUpcoming = await stripe.invoices.retrieveUpcoming({
          customer: customer.id_stripeCustomer,
          subscription: sub.id,
        });
      } catch (err) {
        if (err.code !== 'invoice_upcoming_none')
          throw err;
      }
    }

    subscriptions = heavilyReduce(subscriptions.data);
  } catch (err) {
    console.error(err);
    notFound();
  }

  return <SubscriptionsClientPage subscriptions={subscriptions} />;
};


export default SubscriptionsPage;
