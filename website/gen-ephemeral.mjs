// Test file to generate ephemeral link record in the db
// Should also send email to the potential admin, with the registration link (containing a token)
// Must specify email when running it via --email xxx@yyy.zzz
// Run from the terminal: node ./gen-ephemeral.mjs

import Mailgun from 'mailgun.js';
import { randomBytes } from 'node:crypto';
import { PrismaClient, Role } from '@prisma/client';
import formData from 'form-data';
import XRegExp from 'xregexp';

const prisma = new PrismaClient();


const validateUnicodeEmail = value => {
  const re = XRegExp("^[\\p{L}\\p{N}!#$%&'*+\\/=?^_`{|}~-]+(\\.[\\p{L}\\p{N}!#$%&'*+\\/=?^_`{|}~-]+)*@[\\p{L}\\p{N}-]+(\\.[\\p{L}\\p{N}-]+)*(\\.[\\p{L}]{2,})$");
  return re.test(value);
};


const sendEmail = async (id, to, token) => {
  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    const regUrl = process.env.REGISTRATION_BASEURL + '?token=' + token;

    const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `ARR Analysis Webmaster <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: [to],
      subject: 'Admin Registration',
      text: 'Ephemeral link',
      html: `<p>This is an ephemeral link for admin registration.</p><p><a href="${regUrl}">Register</a></p><br /><p>This link will expire in 24 hours.</p>`,
    });

    console.info(msg);
  } catch (err) {
    console.error(err);

    try {
      await prisma.registrationLink.delete({
        where: { id },
      });
      console.info('RegistrationLink DB entry deleted!');
    } catch (error) {
      console.error(error.message);
    }
  }
};

const createRegistrationLink = async () => {
  let email = '';
  const args = process.argv.slice(2);
  if (args.length > 1) {
    if (args[0] === '--email') {
      email = args[1];
    }
  }

  if (email === '') {
    console.error('No email provided!');
    console.error('Please provide an email as an argument like this: --email test@example.com');
    process.exit(1);
  }

  if (!validateUnicodeEmail(email)) {
    console.error(`"${email}" is not a valid email!`);
    console.error('Please try again and provide a valid email.');
    process.exit(1);
  }

  const token = randomBytes(32).toString('hex');
  let id = 0;
  try {
    const expiresAt = new Date(Date.now() + 1000*60*60*24); // Expires in 24 hours

    const existingRegLink = await prisma.registrationLink.findFirst({ where: { email, role: Role.ADMIN } });

    if (existingRegLink != null) {
      id = existingRegLink.id;
      await prisma.registrationLink.update({
        where: { id },
        data: { token, expiresAt },
      });

      console.info('Admin RegistrationLink updated.');
    } else {
      const ret = await prisma.registrationLink.create({
        data: {
          role: Role.ADMIN,
          token,
          email,
          expiresAt,
        },
      });
      id = ret.id;

      console.info('Admin RegistrationLink entry created and stored in the database.');
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  await sendEmail(id, email, token);

  process.exit(0);
}

createRegistrationLink();
