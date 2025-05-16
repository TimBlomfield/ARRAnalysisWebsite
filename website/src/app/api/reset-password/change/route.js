import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { DateTime } from 'luxon';
import { AuditEvent } from '@prisma/client';
import { createAuditLog } from '@/utils/server/audit';
import db from '@/utils/server/db';


const POST = async req => {
  try {
    const body = await req.json();
    const { email, token, password } = body;

    // Check if the token is valid
    if (token == null || token === '')
      return NextResponse.json({ message: 'Null token provided!'}, { status: 406 });
    let resetPwdLink = await db.resetPasswordLink.findUnique({
      where: { token },
    });
    if (resetPwdLink == null)
      return NextResponse.json({ message: 'Invalid Token!'}, { status: 406 });

    // Check if the reset password link has expired
    if (resetPwdLink.expiresAt < DateTime.now().toJSDate()) {
      await db.resetPasswordLink.delete({
        where: { id: resetPwdLink.id },
      });
      return NextResponse.json({ message: 'Token expired!'}, { status: 406 });
    }

    // Check if the user exists
    const existingUserData = await db.userData.findUnique({
      where: { email },
    });
    if (existingUserData == null)
      return NextResponse.json({ message: `The email ${email} was not found in the system!`}, { status: 404 });

    // Change the password
    const hashedPassword = await hash(password, 10);
    await db.userData.update({
      where: { id: existingUserData.id },
      data: { hashedPassword },
    });

    await createAuditLog({
      type: AuditEvent.PASSWORD_RESET_SUCCESS,
      email,
    }, req);

    // Delete the ResetPasswordLink entry
    await db.resetPasswordLink.delete({
      where: { id: resetPwdLink.id },
    });

    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong!', error }, { status: 500 });
  }
};


export {
  POST,
};
