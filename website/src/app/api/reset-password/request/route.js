import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { DateTime } from 'luxon';
import { AuditEvent } from '@prisma/client';
import { debugWait } from '@/utils/server/common';
import { createAuditLog } from '@/utils/server/audit';
import db from '@/utils/server/db';
import resetPasswordEmail from '@/utils/emails/reset-password.html';


const sendPwdResetEmail = async (email, token) => {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

  const html =  resetPasswordEmail.replaceAll('[[Logo URL]]', `${process.env.NEXTAUTH_URL}/logo-blue.svg`)
    .replaceAll('[[Password Reset URL]]', process.env.RESET_PASSWORD_BASEURL + '?token=' + token)
    .replaceAll('[[Customer Email]]', email);

  await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `The ARR Analysis Support Team <support@${process.env.MAILGUN_DOMAIN}>`,
    to: [email],
    subject: 'ARR Analysis - Password Reset Request',
    html,
  });
};


const POST = async req => {
  try {
    const body = await req.json();
    const { email } = body;

    await debugWait(500); // This is not a debugging line. Wait 500ms on purpose!

    // Check if the email exists in the db
    const userData = await db.userData.findUnique({ where: { email }});
    if (userData == null) {
      // Pretend we've sent an email
      return NextResponse.json({ message: 'Password reset link sent successfully.' }, { status: 200 });
    }

    // Check if a resetEmailLink already exists for this email
    let workLink = await db.resetPasswordLink.findUnique({ where: { email }});

    let token = randomBytes(32).toString('hex');
    const expiresAt = DateTime.now().plus({ hours: 24 }).toJSDate(); // Expires in 24 hours

    if (workLink == null) {
      workLink = await db.resetPasswordLink.create({
        data: {
          token,
          email,
          expiresAt,
        },
      });
    } else {
      // Check if we're locked out
      const lockDuration = DateTime.fromJSDate(workLink.lockedUntil).diff(DateTime.now(), 'seconds');
      let secondsWait = lockDuration.as('seconds');
      if (secondsWait > 0) {
        secondsWait = Math.ceil(secondsWait);
        return NextResponse.json({ message: `Too many requests. You need to wait ${secondsWait} seconds!` }, { status: 429 });
      }

      // Increase the sentCount (which counts how many password-resets have been requested)
      // Calculate lockedUntil accordingly
      let lockedUntil, sentCount = +workLink.sentCount + 1;
      if (sentCount < 5) {
        lockedUntil = DateTime.now().toJSDate();
        token = workLink.token; // Don't reset the token
      } else {
        const minutes = Math.min(60, 5 * (sentCount - 4));
        lockedUntil = DateTime.now().plus({ minutes }).toJSDate();
      }

      // Update the ResetPasswordLink record in the db
      workLink = await db.resetPasswordLink.update({
        where: { id: workLink.id },
        data: { sentCount, lockedUntil, token },
      });
    }

    // Send the email
    await sendPwdResetEmail(email, token);

    await createAuditLog({
      type: AuditEvent.PASSWORD_RESET_REQUEST,
      email,
    }, req);

    return NextResponse.json({ message: 'Password reset link sent successfully.' }, { status: 200 });
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message, error }, { status: 500 });
  }
};


export {
  POST,
};
