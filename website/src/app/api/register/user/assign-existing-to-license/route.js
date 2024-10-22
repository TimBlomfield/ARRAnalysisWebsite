import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { checkRegToken, RegTokenState } from '@/utils/server/common';
import db from '@/utils/server/db';
import { Role } from '@prisma/client';
import axios from 'axios';
// TODO: Delete this file
const POST = async req => {
  try {
    const body = await req.json();
    const { email, password, token } = body;

    const tokenState = await checkRegToken(token);

    // Check if the token is valid and not expired
    switch (tokenState.ts) {
      case RegTokenState.Null:
      case RegTokenState.Empty:
        return NextResponse.json({ message: 'Null token provided!'}, { status: 406 });
      case RegTokenState.NotFound:
        return NextResponse.json({ message: 'Invalid Token!'}, { status: 406 });
      case RegTokenState.Expired:
        return NextResponse.json({ message: 'Token expired!'}, { status: 406 });
    }

    // Make sure that the role in the RegistrationLink is USER
    if(tokenState.role !== Role.USER)
      return NextResponse.json({ message: 'Wrong role type (non-user) associated with user registration token' }, { status: 409 });

    // Get the existing UserData
    const existingUserData = await db.userData.findUnique({
      where: { email },
      include: { user: true },
    });
    if (existingUserData == null || !tokenState.userExists)
      return NextResponse.json({ message: 'User not found in the system!'}, { status: 409 });

    // Find the customer
    const udCustomer = await db.userData.findUnique({
      where: { email: tokenState.userData.customerEmail },
      include: { customer: true },
    });
    if (udCustomer == null || udCustomer.customer == null)
      return NextResponse.json({ message: 'Customer not found in the system!' }, { status: 409 });

    // Check if the password matches
    const passwordMatch = await compare(password, existingUserData.hashedPassword);
    if (!passwordMatch)
      return NextResponse.json({ message: 'Wrong password!'}, { status: 409 });

    // If no associated User create one
    let userObj = existingUserData.user;
    if (userObj == null) {
      userObj = await db.user.create({
        data: {
          id_UserData: existingUserData.id,
          id_Customer: udCustomer.customer.id,
        },
      });
    }

    const firstName = tokenState.userData.firstName;
    const lastName = tokenState.userData.lastName;

    // Check if the user exists in LicenseSpring
    const { data: lsUsersList } = await axios.get('https://saas.licensespring.com/api/v1/license-users/', {
      headers: {
        Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
      },
      params: {
        true_email__iexact: email,
      },
    });

    // Update the LicenseSpring user with the new first-name and last-name if they are different
    if (lsUsersList?.results?.length > 0) {
      const lsUser = lsUsersList.results[0];

      if ((firstName != null && firstName !== lsUser.first_name) || (lastName != null && lastName !== lsUser.last_name)) {
        const userParams = {};
        if (firstName != null) userParams.first_name = firstName;
        if (lastName != null) userParams.last_name = lastName;
        await axios.patch(
          `https://saas.licensespring.com/api/v1/license-users/${lsUser.id}/`,
          userParams,
          {
            headers: {
              Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
            },
          },
        );
      }
    }

    // Assign user to license in License Spring
    const { data: licenseSpringResponse } = await axios.post(
      `https://saas.licensespring.com/api/v1/licenses/${tokenState.userData.licenseId}/assign_user/`,
      { email, password },
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      },
    );

    if (licenseSpringResponse?.new_password !== password)
      return NextResponse.json({ message: 'LicenseSpring error!' }, { status: 400 });

    // Add the license-id to the user's licenseIds array
    const updatedUser = await db.user.update({
      where: { id: userObj.id },
      data: {
        licenseIds: {
          push: tokenState.userData.licenseId,
        },
      },
    });

    // Delete the RegistrationLink entry
    await db.registrationLink.delete({ where: { token } });

    const message = 'User assigned to license successfully.';
    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong!', error }, { status: 500 });
  }
};


export {
  POST,
};
