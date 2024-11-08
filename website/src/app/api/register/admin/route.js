import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { AuditEvent, Role } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import db from '@/utils/server/db';
import { checkRegToken, RegTokenState } from '@/utils/server/common';


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

    // Make sure that the role in the RegistrationLink is ADMIN
    if(tokenState.role !== Role.ADMIN)
      return NextResponse.json({ message: 'Wrong role type (non-admin) associated with admin registration token' }, { status: 409 });

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

    // Create an Administrator
    const newPortalAdmin = await db.administrator.create({
      data: {
        id_UserData: newUserData.id,
      },
    });

    // Delete the RegistrationLink entry
    await db.registrationLink.delete({ where: { token } });

    await createAuditLog({
      type: AuditEvent.ADMIN_REGISTERED,
      email,
    }, req);

    const portalAdmin = {
      id: newPortalAdmin.id,
      idUserData: newUserData.id,
      createdAt: newPortalAdmin.createdAt,
      email: newUserData.email,
    };
    const message = 'Portal Administrator registered successfully.';

    return NextResponse.json({ portalAdmin, message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong!', error }, { status: 500 });
  }
};


export {
  POST,
};
