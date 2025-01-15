import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { hash } from 'bcrypt';
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
    const { newPassword } = await req.json();

    const hashedPassword = await hash(newPassword, 10);

    await db.userData.update({
      where: { email: authToken.email },
      data: { hashedPassword },
    });

    await createAuditLog({
      type: AuditEvent.UPDATE_PASSWORD,
      actorEmail: authToken.email,
    }, req);
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Your password was updated!' }, { status: 200 });
};


export {
  POST,
};
