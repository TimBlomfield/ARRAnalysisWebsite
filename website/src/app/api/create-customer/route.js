import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { validateUnicodeEmail } from '@/utils/validators';
import { hash } from 'bcrypt';
import db from '@/utils/server/db';


const POST = async req => {
  try {
    const { stripeCustomerId, secret, failed } = await req.json();

    if ((secret == null) || (secret.length < 10)) // secret must be valid
      return NextResponse.json({ message: 'Unacceptable!' }, { status: 406 });  // Probably a hacker trying to create a customer

    if (failed === true) {
      await db.userData.deleteMany({ where: { secret }});

      return NextResponse.json({ success: true });
    } else {
      const theUserData = await db.userData.findFirst({ where: { secret }});

      if (theUserData == null)
        return NextResponse.json({ message: 'UserData not found' }, { status: 404 });

      const newCustomer = await db.customer.create({
        data: {
          id_stripeCustomer: stripeCustomerId,
          id_UserData: theUserData.id,
        },
      });

      // Set the secret to ""
      await db.userData.update({
        where: { id: theUserData.id },
        data: { secret: '' },
      });

      return NextResponse.json({ customerId: newCustomer });
    }
  } catch (err) {
    return NextResponse.json({ message: err?.message ?? 'Something went wrong!' }, { status: 500 });
  }
};


export {
  POST,
};
