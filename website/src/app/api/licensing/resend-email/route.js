import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';


const POST = async req => {
  const authToken = await getToken({ req });
  const { person } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    const { f: firstName, l: lastName, id, token, email } = person;
    const regUrl = process.env.REGISTRATION_BASEURL + '?token=' + token;
    let hello = '';
    if (firstName || lastName) {
      let fl = firstName;
      if (fl.length > 0 && lastName.length > 0) fl += ' ';
      fl += lastName;
      hello = `Hello ${fl},`;
    }

    const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `The ARR Analysis Support Team <support@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: 'User Registration',
      text: `${hello}\n\nThis is an ephemeral link for user registration. Please visit the link below to proceed with activating the add-in license:\n\n${regUrl}\n\nThis link will expire in 24 hours.\n\nSincerely,\nThe ArrAnalysis team`,
      html: `${hello}<p>This an ephemeral link for user registration.</p><p>Please click the link below to proceed with activating the add-in license.</p><p><a href="${regUrl}">Register</a></p><br /><p>This link will expire in 24 hours.</p><p>Sincerely, the ArrAnalysis team.</p>`,
    });

    // Update the expiresAt
    const expiresAt = new Date(Date.now() + 1000*60*60*24); // Expires in 24 hours
    await db.registrationLink.update({
      where: { id },
      data: { expiresAt },
    });
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: `Email sent successfully to ${person.email}!` }, { status: 201 });
};


export {
  POST,
};
