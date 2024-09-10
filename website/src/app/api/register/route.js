import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';
import db from '@/utils/server/db';
import { checkToken, TokenState } from '@/utils/server/common';


// Used for registering both admins, customers or users
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
    const emailExists = await db.userData.findUnique({
      where: { email },
    });
    if (emailExists)
      return NextResponse.json({ message: `The email ${email} already exists in the Portal! Try using another email.` }, { status: 409 });

    // Create the UserData
    const hashedPassword = await hash(password, 10);
    const newUserData = await db.userData.create({
      data: {
        email,
        hashedPassword,
      },
    });

    // Create an Administrator, Customer or User
    let newPortalUser = null;
    switch (tokenState.role) {
      case Role.ADMIN:
        newPortalUser = await  db.administrator.create({
          data: {
            id_UserData: newUserData.id,
          },
        });
        break;

      case Role.CUSTOMER:
        // TODO: implement this
        break;

      case Role.USER:
        // TODO: implement this
        break;
    }

    // Delete the AdminRegistrationLink
    const id = await db.registrationLink.delete({ where: { token } });

    const portalUser = {
      id: newPortalUser.id,
      idUserData: newUserData.id,
      type: tokenState.role,
      createdAt: newPortalUser.createdAt,
      email: newUserData.email,
    };

    const message = tokenState.role === Role.ADMIN
      ? 'Portal Administrator registered successfully.'
      : tokenState.role === Role.CUSTOMER
        ? 'Portal Customer registered successfully.'
        : 'Portal User registered successfully.';

    return NextResponse.json({ portalUser, message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong!', error }, { status: 500 });
  }
};

export {
  POST,
};
