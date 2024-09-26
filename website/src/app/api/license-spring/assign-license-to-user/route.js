import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';
import axios from 'axios';


const POST = async req => {
  const token = await getToken({ req });
  const input = await req.json();

  // User must be logged in
  if (token?.email == null || !isAuthTokenValid(token))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  try {
    await axios.post(
      `https://saas.licensespring.com/api/v1/licenses/${input.licenseId}/assign_user/`,
      { ...input.params },
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      });
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/licenses');

  return NextResponse.json({ message: 'User assigned successfully' }, { status: 201 });
};


export {
  POST,
};
