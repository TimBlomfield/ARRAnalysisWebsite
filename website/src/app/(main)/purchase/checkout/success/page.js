import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { notFound } from 'next/navigation';
import { AuditEvent } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import db from '@/utils/server/db';
import thankYouEmail from '@/utils/emails/thank-you.html';


const PaymentSuccessPage = async ({ searchParams }) => {
  const { scid: id_stripeCustomer, secret, pi } = searchParams;
  let purchaseInfo;

  try {
    purchaseInfo = JSON.parse(atob(pi));

    const theUserData = await db.userData.findFirst({ where: { secret }});

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

      // TODO: Send a "Thank you" email here. I think the email will be sent only once, even if the user refreshes the page.
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

      const hello = `Hello ${theUserData.firstName} ${theUserData.lastName},`;

      /*
      const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `The ARR Analysis Support Team <support@${process.env.MAILGUN_DOMAIN}>`,
        to: [theUserData.email],
        subject: 'Welcome to ARR Analysis - Your Excel Add-in purchase confirmation',
        text: `${hello}`,
        html: `${hello}`,
      });*/
    }
  } catch {
    notFound();
  }

  await createAuditLog({
    type: AuditEvent.PAYMENT_SUCCESS_PAGE,
    stripeCustomerId: id_stripeCustomer,
    tier: purchaseInfo.tier + 1,
    period: purchaseInfo.period === 0 ? 'monthly' : 'yearly',
    quantity: (purchaseInfo.tier === 2) ? purchaseInfo.licenses : 1,
    secret,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', marginTop: '60px' }}>Success! You are subscribed now!</h1>
      <h3 style={{ fontSize: '18px' }}>You&apos;ve purchased Tier-{purchaseInfo.tier + 1} {purchaseInfo.period === 0 ? 'Monthly' : 'Yearly'} subscription(s)</h3>
      {purchaseInfo.tier === 2 && <h3 style={{ fontSize: '18px', marginTop: '10px', color: 'darkred', fontWeight: 'bold' }}>Count: {purchaseInfo.licenses}</h3>}
      <h2 style={{ fontSize: '24px', marginTop: '40px', fontStyle: 'italic', color: 'teal' }}>You can now login as a customer!</h2>
    </div>
  );
};


export default PaymentSuccessPage;
