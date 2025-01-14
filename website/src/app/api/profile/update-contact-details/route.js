import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';
import {createAuditLog} from '@/utils/server/audit';
import {AuditEvent} from '@prisma/client';


const POST = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const { firstName, lastName, phone, jobTitle } = await req.json();

    const userData = await db.userData.findUnique({
      where: { email: authToken.email },
    });

    const old = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      jobTitle: userData.jobTitle,
    };

    await db.userData.update({
      where: { email: authToken.email },
      data: { firstName, lastName, phone, jobTitle },
    });

    await createAuditLog({
      type: AuditEvent.UPDATE_CONTACT_DETAILS,
      actorEmail: authToken.email,
      changes: {
        old,
        new: {
          firstName,
          lastName,
          phone,
          jobTitle,
        },
      },
    }, req);

  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Contact details updated!' }, { status: 200 });
};


export {
  POST,
};
