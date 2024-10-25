import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';

// TODO: delete this file
const POST = async req => {
  const authToken = await getToken({ req });
  const { resendList } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
    for (const item of resendList) {
      const { f: firstName, l: lastName, id, token, email } = item;
      const regUrl = process.env.REGISTRATION_BASEURL + '?token=' + token;

      let hello = '';
      if (firstName || lastName) {
        let fl = firstName;
        if (fl.length > 0 && lastName.length > 0) fl += ' ';
        fl += lastName;
        hello = `Hello ${fl},`;
      }
      const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `Webmaster <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: 'User Registration',
        text: 'Ephemeral link',
        html: `${hello}<p>This an ephemeral link for user registration.</p><p>Please click the link below to proceed with activating the add-in license.</p><p><a href="${regUrl}">Register</a></p><br /><p>This link will expire in 24 hours.</p><p>Sincerely, the ArrAnalysis team.</p>`,
      });

      // Update the expiresAt
      const expiresAt = new Date(Date.now() + 1000*60*60*24); // Expires in 24 hours
      await db.registrationLink.update({
        where: { id },
        data: { expiresAt },
      });
    }
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Email(s) sent successfully!' }, { status: 201 });
};


export {
  POST,
};
