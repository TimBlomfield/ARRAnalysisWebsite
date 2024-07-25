// Test file to generate ephemeral link record in the db
// Should also send email to the potential admin, with the registration link (containing a token)
// Must specify email when running it via --email xxx@yyy.zzz
// Run from the terminal: node ./gen-ephemeral.mjs

import Mailgun from 'mailgun.js';
import { randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import XRegExp from 'xregexp';

const prisma = new PrismaClient();


const validateUnicodeEmail = value => {
  const re = XRegExp("^[\\p{L}0-9!$'*+\\-_]+(\\.[\\p{L}0-9!$'*+\\-_]+)*@[\\p{L}0-9]+(\\.[\\p{L}0-9]+)*(\\.[\\p{L}]{2,})$");
  return re.test(value);
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

  try {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000*60*60*24);
    await prisma.adminRegistrationLink.create({
      data: {
        token,
        email,
        expiresAt,
      },
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  console.info('AdminRegistrationLink entry created and stored in the database.');

  // TODO: Send the email using mailgun here
  console.info(process.env.EMAIL);

  process.exit(0);
}

const sendEmail = () => {
  const mailgun = new Mailgun();
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_VERIFICATION_PUBLIC_KEY});

  mg.messages.create('')
  console.log(mg.validate);
};

//createRegistrationLink();
sendEmail();
