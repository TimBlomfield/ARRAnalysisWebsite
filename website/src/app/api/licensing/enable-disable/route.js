import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { revalidatePath } from 'next/cache';
import axios from 'axios';
import { AuditEvent } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import { isAuthTokenValid } from '@/utils/server/common';


const POST = async req => {
  const authToken = await getToken({ req });
  const { licenseId, enable } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  let message = `License ${enable ? 'enabled' : 'disabled'}.`;
  try {
    // Enable or disable a license in License Spring
    const { data: licenseSpringResponse } = await axios.post(
      `https://saas.licensespring.com/api/v1/licenses/${licenseId}/${enable ? 'enable' : 'disable'}/`,
      {},
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      },
    );

    message = licenseSpringResponse.message;

    createAuditLog({
      type: AuditEvent.ENABLE_DISABLE_LICENSE,
      actorEmail: authToken.email,
      enable,
      licenseId,
    }, req);
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/licenses');

  return NextResponse.json({ message }, { status: 201 });
};


export {
  POST,
};
