import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AuditEvent } from '@prisma/client';
import { isAuthTokenValid } from '@/utils/server/common';
import { createAuditLog } from '@/utils/server/audit';
import db from '@/utils/server/db';


const POST = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const { address, street1, street2, street3, city, postalCode, country, state } = await req.json();

    const userData = await db.userData.findUnique({
      where: { email: authToken.email },
    });

    const old = {
      address: userData.address,
      street1: userData.street1,
      street2: userData.street2,
      street3: userData.street3,
      city: userData.city,
      postalCode: userData.postalCode,
      country: userData.country,
      state: userData.state,
    };

    await db.userData.update({
      where: { email: authToken.email },
      data: { address, street1, street2, street3, city, postalCode, country, state },
    });

    await createAuditLog({
      type: AuditEvent.UPDATE_ACCOUNT_DETAILS,
      actorEmail: authToken.email,
      changes: {
        old,
        new: { address, street1, street2, street3, city, postalCode, country, state },
      },
    }, req);
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Your account details were updated!' }, { status: 200 });
};


export {
  POST,
};
