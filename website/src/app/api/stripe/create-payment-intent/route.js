import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Tiers } from '@/utils/common';
import { convertToSuburrency } from '@/utils/func';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getAmount = (tier, period) => {
  const prices = tier === 0
    ? Tiers.One.Prices
    : (tier === 1 ? Tiers.Two.Prices : Tiers.Three.Prices);
  return period === 0 ? prices.Monthly : prices.Yearly;
};


const POST = async req => {
  try {
    const { tier, period } = await req.json();

    if (tier == null || period == null || tier < 0 || tier > 2 || period < 0 || period > 1)
      throw new Error('Invalid tier or period detected!');

    const dollars = getAmount(tier, period);
    const amount = convertToSuburrency( dollars );  // Amount in cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, amount, paid: { amount, dollars }, redirectBase: process.env.NEXTAUTH_URL });
  } catch (err) {
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
