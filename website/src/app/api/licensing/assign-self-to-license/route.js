import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { isAuthTokenValid } from '@/utils/server/common';
import { validateUnicodeEmail } from '@/utils/validators';


const POST = async req => {
  const authToken = await getToken({ req });
  const { licenseId, password } = await req.json();

  // User must be logged in
  if (authToken?.email == null || !isAuthTokenValid(authToken))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });


  return NextResponse.json({ message: 'Hold your horses!' , error }, { status: 500 });

  const { email } = authToken;
  if (!validateUnicodeEmail(email)) // Sanity check
    return NextResponse.json({ message: 'Invalid email encountered!' }, { status: 400 });

  try {
    // Assign user to license in License Spring
    const { data: assignUserResponse } = await axios.post(
      `https://saas.licensespring.com/api/v1/licenses/${licenseId}/assign_user/`,
      { email },
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      },
    );
    // Set the password
    const { data: setPasswordResponse } = await axios.post(
      `https://saas.licensespring.com/api/v1/license-users/${assignUserResponse.id}/set_password`,
      { password },
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      },
    );

    // Update the password for the user
    const x = setPasswordResponse?.x;
    // if (licenseSpringResponse?.new_password !== password)
    //   return NextResponse.json({ message: 'LicenseSpring error!' }, { status: 400 });
  } catch (error) {
    const message = error?.response?.data?.detail ?? 'Something went wrong!';
    return NextResponse.json({ message , error }, { status: 500 });
  }

  revalidatePath('/admin/licenses');

  return NextResponse.json({ message: 'You have been assigned to the license' }, { status: 200 });
};


export {
  POST,
};
