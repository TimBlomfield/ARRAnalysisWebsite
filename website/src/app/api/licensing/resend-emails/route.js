import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import {debugWait, isAuthTokenValid} from '@/utils/server/common';
import { randomBytes } from 'node:crypto';
import db from '@/utils/server/db';
import { Role } from '@prisma/client';


const POST = async req => {
  const authToken = await getToken({ req });
  const { resendList } = await req.json();

  await debugWait(2000);

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    // return NextResponse.json({ message: 'Failure!' }, { status: 401 });
  } catch (error) {
  }

  return NextResponse.json({ message: 'Email(s) sent successfully!' }, { status: 201 });
};


export {
  POST,
};
