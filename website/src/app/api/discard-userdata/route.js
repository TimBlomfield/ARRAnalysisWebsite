import { NextResponse } from 'next/server';
import db from '@/utils/server/db';


// Discard temporary UserData object created with a `secret` field set.
const POST = async req => {
  try {
    const { secret } = await req.json();

    if ((secret == null) || (secret.length < 10)) // secret must be valid
      return NextResponse.json({ message: 'Unacceptable!' }, { status: 406 });

    await db.userData.deleteMany({ where: { secret }});

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
