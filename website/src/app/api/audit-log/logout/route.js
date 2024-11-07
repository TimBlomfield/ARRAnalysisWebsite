import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import { createAuditLog } from '@/utils/server/audit';
import { AuditEvent } from '@prisma/client';


const POST = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    await createAuditLog({
      type: AuditEvent.LOGOUT,
      email: authToken.email,
      isAdmin: authToken.userData.adminId != null,
      isCustomer: authToken.userData.customerId != null,
      isUser: authToken.userData.userId != null,
    }, req);
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  return NextResponse.json({ message: 'LOGOUT audit log entry created.' }, { status: 200 });
};


export {
  POST,
};
