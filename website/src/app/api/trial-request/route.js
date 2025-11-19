import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { randomBytes } from 'node:crypto';
import { TrialStatus } from '@prisma/client';
import db from '@/utils/server/db';


const POST = async req => {
  try {
    const { email } = await req.json();

    let ipAddress, userAgent;
    if (req.headers?.get != null && (typeof req.headers.get === 'function')) {
      ipAddress = req.headers.get('x-forwarded-for') || req.ip;
      userAgent = req.headers.get('user-agent');
    } else {
      ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.connection?.remoteAddress;
      userAgent = req.headers['user-agent'];
    }

    // Get or create the trial request limit record for this IP address
    let ipLimitRecord = await db.trialRequestLimitIp.findUnique({
      where: { ipAddress },
    });
    if (!ipLimitRecord) {
      ipLimitRecord = await db.trialRequestLimitIp.create({
        data: { ipAddress },
      });
    } else {
      // Check if we're locked out
      const lockDuration = DateTime.fromJSDate(ipLimitRecord.lockedUntil).diff(DateTime.now(), 'seconds');
      let secondsWait = lockDuration.as('seconds');
      if (secondsWait > 0) {
        secondsWait = Math.ceil(secondsWait);
        return NextResponse.json({ message: `Too many requests. You can try again in  ${secondsWait} seconds!` }, { status: 429 });
      }

      // Check if updatedAt is older than one hour
      if (ipLimitRecord.updatedAt < DateTime.now().minus({ hours: 1 }).toJSDate()) {
        ipLimitRecord = await db.trialRequestLimitIp.update({
          where: { ipAddress },
          data: {
            sentCount: 1,
            lockedUntil: DateTime.now().toJSDate(),
          },
        });
      } else {
        // Update sentCount and lockedUntil accordingly
        const sentCount = ipLimitRecord.sentCount + 1;
        const lockedUntil = sentCount > 9
          ? DateTime.now().plus({ hours: 1 }).toJSDate()
          : ipLimitRecord.lockedUntil;
        ipLimitRecord = await db.trialRequestLimitIp.update({
          where: { ipAddress },
          data: { sentCount, lockedUntil },
        });
      }
    }

    let trialRequestRecord = await db.trialRequest.findFirst({ where: { email }});
    const expiresAt = DateTime.now().plus({ minutes: 15 }).toJSDate(); // Expires in 15 minutes
    if (trialRequestRecord == null) {
      const token = randomBytes(32).toString('hex');
      trialRequestRecord = await db.trialRequest.create({
        data: { email, token, ipAddress, userAgent, expiresAt },
      });
    }

    if (trialRequestRecord.status === TrialStatus.PENDING_VERIFICATION) {
      trialRequestRecord = await db.trialRequest.update({
        where: { id: trialRequestRecord.id },
        data: { attempts: trialRequestRecord.attempts + 1, expiresAt },
      });

      // Send the email
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

      const regUrl = process.env.NEXTAUTH_URL + '/trial/register?token=' + trialRequestRecord.token;
      const html = `Hi,<p>Thank you for your interest in ARR Analysis.</p><p>To proceed with your request please register at the following web page within the next few minutes:</p><p><a href="${regUrl}">${regUrl}</a></p><p>If you are visiting the above-mentioned page later, the session might have expired. In this case, please simply complete the request form again to receive a new registration link.</p><p></p><p>Kind regards,<br />the ARR Analysis team</p>`;

      const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `The ARR Analysis Support Team <support-team@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: 'Please visit the ARR Analysis website to register',
        text: 'Ephemeral link',
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
