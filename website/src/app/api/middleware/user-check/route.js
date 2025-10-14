import { NextResponse } from 'next/server';
import db from '@/utils/server/db';


// Check if an email exists in the system
const GET = async req => {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  const emailExists = await db.userData.findUnique({
    where: { email },
  });
  if (!emailExists)
    return NextResponse.json({ message: `User Check failed! (the email ${email} doesn't exist in the DB)` }, { status: 403 });

  return NextResponse.json({ message: 'User Check succeeded!' }, { status: 200 });
};


export {
  GET,
};
