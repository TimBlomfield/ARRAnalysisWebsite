import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import axios from 'axios';
import { createAuditLog } from '@/utils/server/audit';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';


const POST = async req => {
  const authToken = await getToken({ req });
  const { email, licenseId } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  let message = "Success";

  try {
    // Assign user to license in License Spring
    const { data: licenseSpringResponse } = await axios.post(
      `https://saas.licensespring.com/api/v1/licenses/${licenseId}/assign_user/`,
      { email },
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      },
    );

    message = licenseSpringResponse.message;

    await createAuditLog({
      type: AuditEvent.ASSIGN_USER_TO_LICENSE,
      actorEmail: authToken.email,
      licenseId,
    }, req);
  } catch (error) {
    const message = error?.response?.data?.detail ?? error?.message ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/user-licenses');

  return NextResponse.json({ message: "Assigned successfully!" }, { status: 200 });
};


export {
  POST,
};
