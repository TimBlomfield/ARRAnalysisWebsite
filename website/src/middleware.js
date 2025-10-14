import { NextResponse } from 'next/server';
import { cookies  } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { isAuthTokenValid, requiresBasicAuth } from '@/utils/server/common';


const isStagingOrProd = process.env.K_ENVIRONMENT === 'Staging' || process.env.K_ENVIRONMENT === 'Production';
const isDevelopmentOrStaging = process.env.K_ENVIRONMENT === 'Development' || process.env.K_ENVIRONMENT === 'Staging';
const USER = process.env.K_ALLOWED_USER || 'admin';
const PASS = process.env.K_ALLOWED_PASS || 'password';


export const middleware = async request => {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname.toLowerCase();

  // Require basic authentication in the Development and Staging heroku apps
  if (isDevelopmentOrStaging && requiresBasicAuth(pathname)) {
    const basicAuth = request.headers.get('authorization');

    const unauthorized = new NextResponse('Authentication required!', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Development or Staging Area"',
      },
    });

    if (!basicAuth) return unauthorized;

    try {
      const [user, pass] = Buffer.from(basicAuth.split(' ')[1], 'base64')
        .toString()
        .split(':');

      if (user !== USER || pass !== PASS) return unauthorized;
    } catch {
      return unauthorized;
    }
  }

  // Add HSTS header in staging or production
  if (isStagingOrProd) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  if (isStagingOrProd && pathname.startsWith('/test-pages'))
    return NextResponse.redirect(new URL('/', request.url));

  // Redirect to /login if not logged in
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request });
    if (!isAuthTokenValid(token))
      return NextResponse.redirect(new URL('/login', request.url));
  }
  if (pathname === '/login')
    console.log('Pathname IS /login');
  // Redirect to /admin if logged in
  if (pathname === '/login') {
    const token = await getToken({ req: request });
    console.log('Token:', token);
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
