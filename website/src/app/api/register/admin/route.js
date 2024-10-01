import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';
import db from '@/utils/server/db';
import { checkRegToken, RegTokenState } from '@/utils/server/common';


// TODO: make this for admin exclusive
const POST = async req => {
  try {
    const body = await req.json();
    const { email, password, token } = body;

    const tokenState = await checkRegToken(token);

    // Check if the token is valid and not expired
    switch (tokenState.ts) {
      case RegTokenState.Null:
      case RegTokenState.Empty:
        return NextResponse.json({ message: 'Null token provided!'}, { status: 406 });
      case RegTokenState.NotFound:
        return NextResponse.json({ message: 'Invalid Token!'}, { status: 406 });
      case RegTokenState.Expired:
        return NextResponse.json({ message: 'Token expired!'}, { status: 406 });
    }

    // Check if email already exists
    const emailExists = await db.userData.findUnique({
      where: { email },
    });
    if (emailExists)
      return NextResponse.json({ message: `An admin with this email ${email} already exists! Try using another email.`, adminExists: 'Yes' }, { status: 409 });

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
