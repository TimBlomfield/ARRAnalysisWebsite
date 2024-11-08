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

    // Make sure that the role in the RegistrationLink is USER
    if(tokenState.role !== Role.USER)
      return NextResponse.json({ message: 'Wrong role type (non-user) associated with user registration token' }, { status: 409 });

    // Check if email already exists
    const emailExists = await db.userData.findUnique({
      where: { email },
    });
    if (emailExists)
      return NextResponse.json({ message: `This email ${email} is already registered in the system!` }, { status: 409 });

    // Find the customer
    const udCustomer = await db.userData.findUnique({
      where: { email: tokenState.userData.customerEmail },
      include: { customer: true },
    });
    if (udCustomer == null || udCustomer.customer == null)
      return NextResponse.json({ message: 'Customer not found in the system!' }, { status: 409 });

    const hashedPassword = await hash(password, 10);
    const firstName = tokenState.userData.firstName;
    const lastName = tokenState.userData.lastName;

    // Prepare "data" for creating a UserData in the local db
    const data = { email, hashedPassword };
    if (firstName != null && typeof(firstName) === 'string' && firstName.length > 0)
      data.firstName = firstName;
    if (lastName != null && typeof(lastName) === 'string' && lastName.length > 0)
      data.lastName = lastName;

    // Create the new UserData
    const newUserData = await db.userData.create({ data });

    // Create a User
    const newPortalUser = await db.user.create({
      data: {
        licenseIds: [ tokenState.userData.licenseId ],
        id_UserData: newUserData.id,
        id_Customer: udCustomer.customer.id,
      },
    });

    // Delete the RegistrationLink entry
    await db.registrationLink.delete({ where: { token } });

    await createAuditLog({
      type: AuditEvent.USER_REGISTERED,
      data,
      stripeCustomerId: udCustomer.customer.id_stripeCustomer,
      customerEmail: tokenState.userData.customerEmail,
      licenseId: tokenState.userData.licenseId,
    }, req);

    const portalUser = {
      id: newPortalUser.id,
      idUserData: newUserData.id,
      createdAt: newPortalUser.createdAt,
      email: newUserData.email,
    };
    const message = 'New User registered successfully.';

    return NextResponse.json({ portalUser, message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong!', error }, { status: 500 });
  }
};


export {
  POST,
};
