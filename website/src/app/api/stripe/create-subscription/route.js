import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { hash } from 'bcrypt';
import Stripe from 'stripe';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';
import { validateUnicodeEmail } from '@/utils/validators';
import { createAuditLog } from '@/utils/server/audit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const POST = async req => {
  try {
    const { tier, t3Licenses, period, userData } = await req.json();

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

    // Server side user data validation
    if (userData === null)
      return NextResponse.json({ message: 'Invalid Customer data!' }, { status: 500 });

    let bInvalidUserData = false;
    const { firstName, lastName, email, company, password, confirm } = userData;
    if (firstName == null || (typeof firstName !== 'string') || firstName.length === 0) bInvalidUserData = true;
    else if (lastName == null || (typeof lastName !== 'string') || lastName.length === 0) bInvalidUserData = true;
    else if (email == null || (typeof email !== 'string') || email.length === 0 || !validateUnicodeEmail(email)) bInvalidUserData = true;
    else if (password == null || (typeof password !== 'string') || (password !== confirm)) bInvalidUserData = true;
    if (bInvalidUserData)
      return NextResponse.json({ message: 'Invalid Customer data!' }, { status: 500 });

    const customerObject = {
      name: `${firstName} ${lastName}`,
      email,
    };
    const customer = await stripe.customers.create(customerObject);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        { price: priceId, quantity: tier === 2 ? t3Licenses : 1 },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const hashedPassword = await hash(password, 10);
    const secret = randomBytes(32).toString('hex');

    await createAuditLog({
      type: AuditEvent.CREATE_SUBSCRIPTION,
      firstName,
      lastName,
      email,
      company,
      hashedPassword,
      secret,
      quantity: tier === 2 ? t3Licenses : 1,
      tier: tier + 1,
      period: period === 0 ? 'monthly' : 'yearly',
    }, req);

    await db.userData.create({
      data: {
        firstName,
        lastName,
        email,
        company,
        hashedPassword,
        secret,
      },
    });

    return NextResponse.json({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      stripeCustomerId: customer.id,
      secret,
      redirectBase: process.env.NEXTAUTH_URL,
    });
  } catch (err) {
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
