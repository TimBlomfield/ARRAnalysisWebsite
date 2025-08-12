import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { randomBytes } from 'node:crypto';
import { isAuthTokenValid } from '@/utils/server/common';
import { AuditEvent, Role } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import db from '@/utils/server/db';


const POST = async req => {
  const authToken = await getToken({ req });
  const { licenseId, customerId, email, firstName, lastName } = await req.json();

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

    // We don't want duplicates, so first delete any existing RegistrationLink that contains the email, licenseId, and role=USER
    await db.registrationLink.deleteMany({
      where: { email, licenseId, role: Role.USER },
    });

    let regUrl;
    if (bExisting) {
      regUrl =  process.env.LOGIN_BASEURL;
      if (existingUserData.user == null) {
        // The existing portal user is either an Administrator or a Customer, so we create the new User.
        await db.user.create({
          data: {
            licenseIds: [licenseId],
            id_UserData: existingUserData.id,
            userCustomer: {
              create: {
                customer: {
                  connect: { id: customerId },
                },
              },
            },
          },
        });
      } else {
        // Add the licenseId to the existing user's licensesIds array, but make sure it's not a duplicate
        const uniqueLicenseIds = [...new Set([...existingUserData.user.licenseIds, BigInt(licenseId)])];

        await db.user.update({
          where: { id: existingUserData.user.id },
          data: {
            licenseIds: {
              set: uniqueLicenseIds,
            },
            userCustomer: {
              connectOrCreate: {
                where: {
                  id_User_id_Customer: {
                    id_User: existingUserData.user.id,
                    id_Customer: customerId,
                  },
                },
                create: {
                  customer: {
                    connect: { id: customerId },
                  },
                },
              },
            },
          },
        });
      }
    } else {
      const token = randomBytes(32).toString('hex');

      // We create the RegistrationLink in the DB for non-existing portal users
      const ret = await db.registrationLink.create({
        data: {
          role: Role.USER,
          licenseId,
          firstName,
          lastName,
          customerEmail: authToken.email,
          token,
          email,
          expiresAt: new Date(Date.now() + 1000*60*60*24), // Expires in 24 hours
        },
      });

      id = ret.id;
      regUrl = process.env.REGISTRATION_BASEURL + '?token=' + token;
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    let hello = '';
    if (firstName || lastName) {
      let fl = firstName;
      if (fl.length > 0 && lastName.length > 0) fl += ' ';
      fl += lastName;
      hello = `Hello ${fl},`;
    }

    const html = bExisting
      ? `${hello}<p>You have been registered for a new ARR Analysis add-in license.</p><p>Please <a href="${regUrl}">login</a> to the portal and register yourself with the new license.</p><p>Sincerely, the ArrAnalysis team.</p>`
      : `${hello}<p>This an ephemeral link for user registration.</p><p>Please click the link below to proceed with activating the add-in license.</p><p><a href="${regUrl}">Register</a></p><br /><p>This link will expire in 24 hours.</p><p>Sincerely, the ArrAnalysis team.</p>`;

    const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `The ARR Analysis Support Team <support-team@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: 'User Registration',
      text: 'Ephemeral link',
      html,
    });

    await createAuditLog({
      type: AuditEvent.SEND_USER_EMAIL_INVITE,
      actor: authToken.email,
      email,
      licenseId,
      firstName,
      lastName,
      bExisting,
      regUrl,
      html,
    }, req);
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
