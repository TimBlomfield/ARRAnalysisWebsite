import { NextResponse } from 'next/server';
import axios from 'axios';
import { DateTime } from 'luxon';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { TrialStatus } from '@prisma/client';
import db from '@/utils/server/db';
import sendDownloadEmail from '@/utils/server/send-download-email';


const POST = async req => {
  try {
    const { token, firstName, lastName, phone, company, country, jobTitle } = await req.json();

    const trialRequest = await db.trialRequest.findUnique({ where: { token }});
    if (trialRequest == null || trialRequest.status !== TrialStatus.PENDING_VERIFICATION)
      return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });

    const productCodes = process.env.LICENSESPRING_PRODUCT_CODES.split(';');
    const luxonDateAfter14Days = DateTime.now().plus({ days: 14 });

    // Create a LicenseSpring order, a customer (if not already created), and a user for a trial license (14 days)
    const requestBody = {
      id: `trial-order-${token}`,
      reference: 'Trial',
      is_trial: true,
      items: [
        {
          product_code: productCodes[2],
          licenses: [
            {
              policy_code: process.env.LICENSESPRING_TRIAL_14_POLICY_CODE,
              is_trial: true,
              trial_days: 14,
              validity_period: luxonDateAfter14Days.toJSDate(),
              note: `Generated license for trial request from ${trialRequest.email} on ${DateTime.now().toJSDate()} with job title ${jobTitle ?? 'N/A'}, from company: ${company ?? 'N/A'}`,
              users: [{
                email: trialRequest.email,
                is_manager: false,
              }],
            },
          ],
        },
      ],
      customer: {
        email: 'trial@arr-analysis.com',
        first_name: 'ARR Analysis, LLC',
      },
    };

    const { data: createdOrder } = await axios.post('https://saas.licensespring.com/api/v1/orders/create_order/',
      requestBody,
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      }
    );

    // Update the TrialRequest
    const trialRequestUpdated = await db.trialRequest.update({
      where: { token },
      data: {
        expiresAt: luxonDateAfter14Days.toJSDate(),
        status: TrialStatus.EMAIL_VERIFIED,
        firstName,
        lastName,
        company,
        phone,
        jobTitle,
        country,
        licenseId: createdOrder.order_items[0].licenses[0].id,
        licensePassword: createdOrder.order_items[0].licenses[0]?.license_users[0]?.initial_password ?? 'N/A',
      },
    });

    // Send the email
    await sendDownloadEmail(token, firstName, trialRequestUpdated.email, trialRequestUpdated.licensePassword, luxonDateAfter14Days);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in POST /api/trial-requestor-info:', err);
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
