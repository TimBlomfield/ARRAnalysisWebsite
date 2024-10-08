import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';
import db from '@/utils/server/db';
import { checkRegToken, RegTokenState } from '@/utils/server/common';
import axios from 'axios';


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

    // Check if email already exists
    const emailExists = await db.userData.findUnique({
      where: { email },
    });
    if (emailExists)
      return NextResponse.json({ message: `This email ${email} is already registered in the system!` }, { status: 409 });

    // Find the customer
    const udCustomer = await db.userData.findUnique({
      where: { email: tokenState.userData.customerEmail },
      include: { customer: true },
    });
    if (udCustomer == null || udCustomer.customer == null)
      return NextResponse.json({ message: 'Customer not found in the system!' }, { status: 409 });

    const hashedPassword = await hash(password, 10);
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

      if ((firstName != null && firstName != lsUser.first_name) || (lastName != null && lastName != lsUser.last_name)) {
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

    // Prepare "data" for creating a UserData in the local db, and prepare "params" for the License Spring API call
    const data = { email, hashedPassword };
    if (firstName != null && typeof(firstName) === 'string' && firstName.length > 0)
      data.firstName = firstName;
    if (lastName != null && typeof(lastName) === 'string' && lastName.length > 0)
      data.lastName = lastName;
    const params = { email };
    if (data.firstName != null) params.first_name = data.firstName;
    if (data.lastName != null) params.last_name = data.lastName;
    params.password = password;

    // Assign user to license in License Spring
    const { data: licenseSpringResponse } = await axios.post(
      `https://saas.licensespring.com/api/v1/licenses/${tokenState.userData.licenseId}/assign_user/`,
      params,
      {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      },
    );

    if (licenseSpringResponse.new_password !== password)
      return NextResponse.json({ message: 'LicenseSpring error!' }, { status: 400 });

    // Create the new UserData
    const newUserData = await db.userData.create({ data });

    // Create a User
    const newPortalUser = await db.user.create({
      data: {
        licenseIds: [ tokenState.userData.licenseId ],
        id_UserData: newUserData.id,
        id_Customer: udCustomer.customer.id,
      },
    });

    // Delete the RegistrationLink entry
    await db.registrationLink.delete({ where: { token } });

    const portalUser = {
      id: newPortalUser.id,
      idUserData: newUserData.id,
      createdAt: newPortalUser.createdAt,
      email: newUserData.email,
    };
    const message = 'New User registered successfully.';

    return NextResponse.json({ portalUser, message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong!', error }, { status: 500 });
  }
};


export {
  POST,
};
