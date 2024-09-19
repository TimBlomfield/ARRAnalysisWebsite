import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthTokenValid } from '@/utils/server/common';


const isStagingOrProd = process.env.K_ENVIRONMENT === 'Staging' || process.env.K_ENVIRONMENT === 'Production';


export const middleware = async request => {
  const pathname = request.nextUrl.pathname.toLowerCase();

  if (isStagingOrProd && pathname.startsWith('/test-pages'))
    return NextResponse.redirect(new URL('/', request.url));

  // Redirect to /login if not logged in
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request });
    if (!isAuthTokenValid(token))
      return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to /admin if logged in
  if (pathname === '/login') {
    const token = await getToken({ req: request });
    if (isAuthTokenValid(token))
      return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
};



// NOTE: Don't use config, it doesn't check for letter-case. Navigating to ./Test-pages will not run the middleware.
//       Also `export { middleware, config }` does not work!

/*
export const config = {
  matcher: ['/test-pages/:path*', '/admin/:path*'],
};
*/
