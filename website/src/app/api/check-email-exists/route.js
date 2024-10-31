import { NextResponse } from 'next/server';
import db from '@/utils/server/db';


// Check if an email exists in the system
const GET = async req => {
  try {
    const { searchParams } = new URL(req.url);
    let email = searchParams.get('email');

    if (email) {
      email = email.toLowerCase().trim();

      const existingUser = await db.userData.findUnique({
        where: { email },
        select: {
          id: true, // Only select ID to minimize data transfer
          user: {
            select: { id: true},
          },
          customer: {
            select: { id: true},
          },
          admin: {
            select: { id: true},
          },
        },
      });

      return NextResponse.json({
        exists: existingUser != null,
        user: existingUser?.user != null,
        customer: existingUser?.customer != null,
        admin: existingUser?.admin != null,
      }, { status: 200 });
    }

    return NextResponse.json({ exists: false }, { status: 200 });
  } catch (error) {
    const message = error?.message ?? 'Email existence check error!!';
    return NextResponse.json({ message , error }, { status: 500 });
  }
};


export {
  GET,
};
