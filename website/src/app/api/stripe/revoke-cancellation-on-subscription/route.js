import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Stripe from 'stripe';
import { AuditEvent } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import { isAuthTokenValid } from '@/utils/server/common';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const POST = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const { subscriptionId } = await req.json();

    await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false });

    await createAuditLog({
      type: AuditEvent.REVOKE_CANCEL_SUBSCRIPTION,
      email: authToken.email,
      subscriptionId,
    }, req);

    return NextResponse.json({ message: 'Subscription cancellation revoked!' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
