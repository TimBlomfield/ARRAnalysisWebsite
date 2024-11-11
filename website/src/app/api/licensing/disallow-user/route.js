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
  const { id, email, using, licenseId, pathname, terminate } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    const theUser = await db.user.findUnique({
      where: { id },
      include: {
        data: {
          include: {
            admin: true,
            customer: true,
          },
        },
      },
    });

    if (terminate && theUser.licenseIds.length > 1)
      return NextResponse.json({ message: 'Cannot delete a user who is allowed to use multiple licenses!' }, { status: 405 });

    if (using) {
      // Unassign user from license in License Spring
      const { data: licenseSpringResponse } = await axios.post(
        `https://saas.licensespring.com/api/v1/licenses/${licenseId}/unassign_user/`,
        { license_user_email: email },
        {
          headers: {
            Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
          },
        },
      );
    }

    if (terminate) {
      await db.user.delete({ where: { id } });
      if (theUser.data.admin == null && theUser.data.customer == null) {  // Make sure this user isn't an admin or a customer
        await db.userData.delete({ where: { id: theUser.data.id } });
      }

      await createAuditLog({
        type: AuditEvent.DELETE_USER,
        actorEmail: authToken.email,
        user: theUser,
      }, req);
    } else {
      const bigLid = BigInt(licenseId);

      // Remove the licenseId from the user
      await db.user.update({
        where: { id },
        data: {
          licenseIds: {
            set: theUser.licenseIds.filter(x => x !== bigLid),
          },
        },
      });

      await createAuditLog({
        type: AuditEvent.DISALLOW_USER_FOR_LICENSE,
        actorEmail: authToken.email,
        using,
        email,
        licenseId,
      }, req);
    }
  } catch (error) {
    const message = error?.response?.data?.detail ?? error?.message ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/licenses');
  revalidatePath(pathname);

  const message = terminate
    ? `${email} was deleted from the system.`
    :`${email} was disallowed.`;
  return NextResponse.json({ message }, { status: 200 });
};


export {
  POST,
};
