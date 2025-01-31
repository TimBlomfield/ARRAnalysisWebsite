import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Stripe from 'stripe';
import { AuditEvent } from '@prisma/client';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';
import { createAuditLog } from '@/utils/server/audit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const POST = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const { tier, t3Licenses, period } = await req.json();

    if (![0, 1].includes(period) || ![0, 1, 2].includes(tier))
      return NextResponse.json({ message: 'Invalid tier or period detected!' }, { status: 500 });

    const prices = await stripe.prices.list({
      lookup_keys: [
        `standard_${period === 0 ? 'monthly' : 'yearly'}_tier${tier + 1}`,
      ],
    });

    if (tier === 2 && (!Number.isInteger(t3Licenses) || t3Licenses < 1 || t3Licenses > 300))
      return NextResponse.json({ message: `Invalid quantity provided: ${t3Licenses}` }, { status: 500 });
    if (prices == null || prices.data == null || prices.data.length !== 1)
      return NextResponse.json({ message: 'Could not lookup stripe price-object!' }, { status: 500 });

    const priceId = prices.data[0].id;

    const userData = await db.userData.findUnique({
      where: { email: authToken.email },
      include: { customer: true },
    });

    // Create customer or get existing stripeCustomerId
    let stripeCustomerId;
    if (userData.customer?.id_stripeCustomer != null)
      stripeCustomerId = userData.customer.id_stripeCustomer;
    else {
      const customerObject = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
      };
      const customer = await stripe.customers.create(customerObject);

      stripeCustomerId = customer.id;
    }

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        { price: priceId, quantity: tier === 2 ? t3Licenses : 1 },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    await createAuditLog({
      type: AuditEvent.CREATE_SUBSCRIPTION,
      email: authToken.email,
      existingUser: true,
      quantity: tier === 2 ? t3Licenses : 1,
      tier: tier + 1,
      period: period === 0 ? 'monthly' : 'yearly',
    }, req);

    return NextResponse.json({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      redirectBase: process.env.NEXTAUTH_URL,
      stripeCustomerId,
    });
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Purchase successful!' }, { status: 200 });
};


export {
  POST,
};
