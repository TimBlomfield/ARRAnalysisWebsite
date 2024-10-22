import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import { randomBytes } from 'node:crypto';
import db from '@/utils/server/db';
import { Role } from '@prisma/client';


const POST = async req => {
  const authToken = await getToken({ req });
  const { licenseId, email, firstName, lastName } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  let id = 0, bExisting = false;
  try {
    // First check if the email exists in the system and if so, what role it is associated with
    const existingUserData = await db.userData.findUnique({
      where: { email },
      include: { user: true, customer: true, admin: true },
    });
    if (existingUserData != null) {
      // Check if this is a stray UserData (not associated with a User or Customer or Admin)
      if (existingUserData.user == null && existingUserData.customer == null && existingUserData.admin == null)
        await db.userData.delete({ where: { email }});  // Delete the stray UserData
      else
        bExisting = true;
    }

    const token = randomBytes(32).toString('hex');

    // We don't want duplicates, so first delete any existing RegistrationLink that contains the email, licenseId, and role=USER
    await db.registrationLink.deleteMany({
      where: { email, licenseId, role: Role.USER },
    });

    // Now create the RegistrationLink in the DB
    const expiresAt = bExisting
      ? new Date(Date.now() + 1000*60*60*24*365*5)  // Expires in 5 years
      : new Date(Date.now() + 1000*60*60*24);       // Expires in 24 hours
    const ret = await db.registrationLink.create({
      data: {
        role: Role.USER,
        licenseId,
        firstName,
        lastName,
        customerEmail: authToken.email,
        token,
        email,
        expiresAt,
      },
    });

    id = ret.id;

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
    const regUrl = bExisting ? process.env.LOGIN_BASEURL : process.env.REGISTRATION_BASEURL + '?token=' + token;

    let hello = '';
    if (firstName || lastName) {
      let fl = firstName;
      if (fl.length > 0 && lastName.length > 0) fl += ' ';
      fl += lastName;
      hello = `Hello ${fl},`;
    }

    let html;
    if (bExisting) {
      html = `${hello}<p>You have been registered for a new ARR Analysis add-in license.</p><p>Please <a href="${regUrl}">login</a> to the portal and register yourself with the new license.</p><p>Sincerely, the ArrAnalysis team.</p>`;
    } else {
      html = `${hello}<p>This an ephemeral link for user registration.</p><p>Please click the link below to proceed with activating the add-in license.</p><p><a href="${regUrl}">Register</a></p><br /><p>This link will expire in 24 hours.</p><p>Sincerely, the ArrAnalysis team.</p>`;
    }
    const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Webmaster <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: 'User Registration',
      text: 'Ephemeral link',
      html,
    });

  } catch (error) {

    if (id > 0) {
      // Something went wrong when sending the email, so we have to delete the DB entry
      try {
        await db.registrationLink.delete({
          where: { id },
        });
      } catch (error) {
        const message = error?.response?.data?.detail ?? 'Something went wrong!';
        return NextResponse.json({ message , error }, { status: 500 });
      }
    }

    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/licenses');

  return NextResponse.json({ message: 'Email sent' }, { status: 201 });
};


export {
  POST,
};
