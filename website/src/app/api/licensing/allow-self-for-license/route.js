import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import { validateUnicodeEmail } from '@/utils/validators';
import { createAuditLog } from '@/utils/server/audit';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';


const POST = async req => {
  const authToken = await getToken({ req });
  const { licenseId } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  const { email } = authToken;
  if (!validateUnicodeEmail(email)) // Sanity check
    return NextResponse.json({ message: 'Invalid email encountered!' }, { status: 400 });

  try {
    // Get the Customer and UserData
    const userData = await db.userData.findUnique({
      where: { email },
      include: { customer: true, user: true },
    });

    if (userData.customer == null)
      return NextResponse.json({ message: 'You are not a customer!' }, { status: 500 });

    if (userData.user == null) {
      // Create a User object
      await db.user.create({
        data: {
          licenseIds: [licenseId],
          id_UserData: userData.id,
          userCustomer: {
            create: {
              customer: {
                connect: { id: userData.customer.id },
              },
            },
          },
        },
      });
    } else {
      // Add the licenseId to the existing user's licensesIds array, but make sure it's not a duplicate
      const uniqueLicenseIds = [...new Set([...userData.user.licenseIds, BigInt(licenseId)])];

      await db.user.update({
        where: { id: userData.user.id },
        data: {
          licenseIds: {
            set: uniqueLicenseIds,
          },
          userCustomer: {
            connectOrCreate: {
              where: {
                id_User_id_Customer: {
                  id_User: userData.user.id,
                  id_Customer: userData.customer.id,
                },
              },
              create: {
                customer: {
                  connect: { id: userData.customer.id },
                },
              },
            },
          },
        },
      });
    }

    await createAuditLog({
      type: AuditEvent.ALLOW_SELF_FOR_LICENSE,
      email,
      licenseId,
    }, req);
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/licenses');

  return NextResponse.json({ message: 'You have been allowed. You can now assign yourself to the license.' }, { status: 200 });
};


export {
  POST,
};
