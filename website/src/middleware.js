import { NextResponse } from 'next/server';
import { cookies  } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { isAuthTokenValid } from '@/utils/server/common';


const isStagingOrProd = process.env.K_ENVIRONMENT === 'Staging' || process.env.K_ENVIRONMENT === 'Production';


export const middleware = async request => {
  // Force HTTPS in staging or production
  if (isStagingOrProd && !request.url.startsWith('https://'))
    return NextResponse.redirect(new URL(request.url.replace('http://', 'https://')));

  const response = NextResponse.next();

  const pathname = request.nextUrl.pathname.toLowerCase();

  // Add HSTS header in staging or production
  if (isStagingOrProd) {/*
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  */}

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
    if (isAuthTokenValid(token)) {
      // Check if the token email exists in the database. This prevents infinite redirects which can happen if the auth-token is valid but the user has been manually deleted from the db.
      try {
        await axios.get(`${process.env.NEXTAUTH_URL}/api/middleware/user-check`, {
          params: { email: token.email },
        });
      } catch (error) {
        // Delete the cookies (invalidates the token)
        const cookieStore = (await cookies()).getAll();
        for (const cookie of cookieStore)
          response.cookies.delete(cookie.name);
        return response;
      }

      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return response;
};



// NOTE: Don't use config, it doesn't check for letter-case. Navigating to ./Test-pages will not run the middleware.
//       Also `export { middleware, config }` does not work!

/*
export const config = {
  matcher: ['/test-pages/:path*', '/admin/:path*'],
};
*/
