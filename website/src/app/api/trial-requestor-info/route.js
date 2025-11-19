import { NextResponse } from 'next/server';
import axios from 'axios';
import { DateTime } from 'luxon';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { randomBytes } from 'node:crypto';
import { TrialStatus } from '@prisma/client';
import db from '@/utils/server/db';


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
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    const downloadUrl = process.env.NEXTAUTH_URL + '/trial/download?token=' + token;
    const helpCenterUrl = process.env.NEXTAUTH_URL + '/help-center';
    const purchaseUrl = process.env.NEXTAUTH_URL + '/purchase';
    const html = `Dear ${firstName},
                 <p>Thank you for your interest in ARR Analysis.</p>
                 <p>Your trial license credentials are:</p>
                 <p>Your Email: <strong>${trialRequestUpdated.email}</strong></p>
                 <p>Your License Password: <strong>${trialRequestUpdated.licensePassword}</strong></p>
                 <p>It is valid until ${luxonDateAfter14Days.toFormat('dd - LLL - yyyy')}.</p>
                 <p>You can use the following download link to download the most recent version of our ARR Analysis Excel Add-in:</p>
                 <p><a href="${downloadUrl}">${downloadUrl}</a></p>
                 <p>After downloading and installing the software, start Microsoft Excel and navigate to the <em>ARR Analysis</em> tab. Click on the <em>License</em> button and enter your credentials to activate the add-in.</p>
                 <p>In case of any problems with installation and usage please refer to the following web page</p>
                 <p><a href="${helpCenterUrl}">${helpCenterUrl}</a></p>
                 <p>For purchasing please visit the following web page</p>
                 <p><a href="${purchaseUrl}">${purchaseUrl}</a></p>
                 <p>Please let us know if we can be of further assistance.</p>
                 <p></p>
                 <p>Kind regards,<br />the ARR Analysis team</p>`;

    const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `The ARR Analysis Support Team <support-team@${process.env.MAILGUN_DOMAIN}>`,
      to: [trialRequestUpdated.email],
      subject: 'Your ARR Analysis trial request',
      text: 'Ephemeral link',
      html,
    });


    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in POST /api/trial-requestor-info:', err);
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
