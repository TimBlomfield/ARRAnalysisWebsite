import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';


const POST = async req => {
  const authToken = await getToken({ req });
  const { uninviteList } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    await db.registrationLink.deleteMany({
      where: {
        id: {
          in: uninviteList,
        },
      },
    });
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/licenses');

  return NextResponse.json({ message: 'Invitation(s) deleted!' }, { status: 201 });
};


export {
  POST,
};
