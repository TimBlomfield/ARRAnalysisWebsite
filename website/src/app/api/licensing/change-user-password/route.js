import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { revalidatePath } from 'next/cache';
import axios from 'axios';
import { AuditEvent } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import { isAuthTokenValid } from '@/utils/server/common';


const POST = async req => {
  const authToken = await getToken({ req });
  const { password, email } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  let message = 'Password updated.';
  try {
    // Change password for user (email) for licence (licenseId)
    const { data: licenseSpringResponse } = await axios.post(
      'https://saas.licensespring.com/api/v1/license-users/set_password/',
      { password },
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
        params: { email },
      },
    );

    message = licenseSpringResponse.message;

    createAuditLog({
      type: AuditEvent.LICENSE_PASSWORD_CHANGED,
      actorEmail: authToken.email,
      email,
    }, req);
  } catch (error) {
    message = 'Something went wrong!';
    if (error?.response?.data?.message)
      message = `Failed: ${error.response.data.message}`;
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/user-licenses');

  return NextResponse.json({ message }, { status: 201 });
};


export {
  POST,
};
