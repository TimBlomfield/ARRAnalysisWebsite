import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Stripe from 'stripe';
import { DateTime } from 'luxon';
import { AuditEvent } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const POST = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const { subscriptionId } = await req.json();

    // Get some recent logs, not older than 20 minutes
    const twentyMinutesAgo = DateTime.now().minus({ minutes: 20 }).toJSDate();
    const recentLogs = await db.auditLog.findMany({
      where: {
        actorEmail: authToken.email,
        eventType: AuditEvent.CANCEL_SUBSCRIPTION,
        createdAt: { gte: twentyMinutesAgo  },
        metadata: {
          some: { key: 'subscriptionId', value: subscriptionId },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    if (recentLogs.length >= 3) {
      // Too many attempts (restrict the user from doing too many cancel / revoke subscription calls)
      const thirdLogTime = DateTime.fromJSDate(recentLogs[2].createdAt);
      const retryTime = thirdLogTime.plus({ minutes: 20 });
      const secondsUntilRetry = Math.ceil(retryTime.diff(DateTime.now(), 'seconds').seconds);
      return NextResponse.json({ message: `Too many cancellation attempts!\nTry again in\n${secondsUntilRetry}\nsedonds.` }, { status: 429 });
    }

    const subscription = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });

    await createAuditLog({
      type: AuditEvent.CANCEL_SUBSCRIPTION,
      email: authToken.email,
      subscriptionId,
      customerId: subscription.customer,
      created: subscription.created,
      start_date: subscription.start_date,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at: subscription.cancel_at,
      interval: subscription.plan.interval,
      quantity: subscription.quantity,
      plan_nickname: subscription.plan.nickname,
    }, req);

    return NextResponse.json({ message: 'Subscription cancelled!' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
