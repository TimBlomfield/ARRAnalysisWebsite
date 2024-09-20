import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {isAuthTokenValid} from '@/utils/server/common';
import {redirect} from 'next/navigation';


const POST = async req => {
  const token = await getToken({ req });
  const user = await req.json();

  if (token?.email == null || !isAuthTokenValid(token))
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });

  return NextResponse.json({ message: 'Something went wrong!', error }, { status: 500 });
};


export {
  POST,
};
