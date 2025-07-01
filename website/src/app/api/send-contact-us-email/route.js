import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';


const POST = async req => {
  const { firstName, lastName, email, message, recaptchaToken } = await req.json();

  try {
    // Verify reCAPTCHA
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const recaptchaResponse = await fetch(verificationUrl, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success)
      return NextResponse.json({ message: 'reCAPTCHA verification failed' }, { status: 400 });

    // Send email
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    const text = `By ${firstName} ${lastName},\r\n${email}\r\n\r\nMessage:\r\n\r\n${message}`;
    const randomExtension = randomBytes(8).toString('hex');

    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Contact Form <contact-form@${process.env.MAILGUN_DOMAIN}>`,
      to: `Contact <contact@${process.env.MAILGUN_DOMAIN}>`,
      subject: `Website Form Contact -- ${randomExtension}`,  // randomExtension prevents grouping in the inbox
      text,
      'h:Reply-To': email,
    });
  } catch (error) {
    console.error(error);

    const message = error?.response?.data?.detail ?? 'Something went wrong! Your message could not be sent.';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Your message has been sent' }, { status: 200 });
};


export {
  POST,
};
