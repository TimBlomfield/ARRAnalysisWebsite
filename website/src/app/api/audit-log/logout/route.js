import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getACU_Ids, isAuthTokenValid } from '@/utils/server/common';
import { createAuditLog } from '@/utils/server/audit';
import { AuditEvent } from '@prisma/client';


const POST = async req => {
  const authToken = await getToken({ req });

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  const acuIds = await getACU_Ids(authToken.email);

  try {
    await createAuditLog({
      type: AuditEvent.LOGOUT,
      email: authToken.email,
      isAdmin: acuIds?.adminId != null,
      isCustomer: acuIds?.customerId != null,
      isUser: acuIds?.userId != null,
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
