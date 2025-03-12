import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { NextResponse } from 'next/server';


const POST = async req => {
  if (process.env.K_ENVIRONMENT !== 'Local' && process.env.K_ENVIRONMENT !== 'Development' && process.env.K_ENVIRONMENT !== 'Staging')
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  const { to, subject, html } = await req.json();

  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Tester <test@${process.env.MAILGUN_DOMAIN}>`,
      to: [to],
      subject,
      html,
    });
  } catch (error) {
    console.error(error);

    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Email sent' }, { status: 200 });
};


export {
  POST,
};
