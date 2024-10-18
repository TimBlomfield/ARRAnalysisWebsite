import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { isAuthTokenValid } from '@/utils/server/common';
import { revalidatePath } from 'next/cache';


const POST = async req => {
  const authToken = await getToken({ req });
  const { licenseId, userId } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  let message = 'User removed (unassigned) from license';
  try {
    // Unassign User from License
    const { data: licenseSpringResponse } = await axios.post(
      `https://saas.licensespring.com/api/v1/licenses/${licenseId}/unassign_user/`,
      { license_user_id: userId },
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      },
    );
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
