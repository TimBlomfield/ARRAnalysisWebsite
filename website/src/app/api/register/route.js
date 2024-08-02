import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import db from '@/utils/db';
import { checkToken, TokenState } from '@/utils/server/common';


const POST = async req => {
  try {
    const body = await req.json();
    const { email, password, token } = body;

    const tokenState = await checkToken(token);

    // Check if the token is valid and not expired
    switch (tokenState.ts) {
      case TokenState.Null:
      case TokenState.Empty:
        return NextResponse.json({ message: 'Null token provided!'}, { status: 406 });
      case TokenState.NotFound:
        return NextResponse.json({ message: 'Invalid Token!'}, { status: 406 });
      case TokenState.Expired:
        return NextResponse.json({ message: 'Token expired!'}, { status: 406 });
    }

    // Check if email already exists
    const existingUserByEmail = await db.adminUser.findUnique({
      where: { email },
    });
    if (existingUserByEmail)
      return NextResponse.json({ message: `An Admin User with the email ${email} already exists!` }, { status: 409 });

    // Create a new AdminUser
    const hashedPassword = await hash(password, 10);
    const newAdmin = await db.adminUser.create({
      data: {
        email,
        hashedPassword,
      },
    });

    const { hashedPassword: newUserPassword, updatedAt, ...rest } = newAdmin;  // Don't send back the hashed password

    // Delete the AdminRegistrationLink
    const id = await db.adminRegistrationLink.delete({ where: { token } });

    return NextResponse.json({ user: rest, message: 'Admin User created successfully.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong!', error }, { status: 500 });
  }
};

export {
  POST,
};
