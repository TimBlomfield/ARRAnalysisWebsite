import { NextResponse } from 'next/server';


const isStagingOrProd = process.env.K_ENVIRONMENT === 'Staging' || process.env.K_ENVIRONMENT === 'Production';


export const middleware = (request) => {
  const pathname = request.nextUrl.pathname.toLowerCase();

  if (isStagingOrProd && pathname.startsWith('/test-pages'))
    return NextResponse.redirect(new URL('/ ', request.url));

  return NextResponse.next();
};



// NOTE: Don't use config, it doesn't check for letter-case. Navigating to ./Test-pages will not run the middleware.
//       Also `export { middleware, config }` does not work!

/*
export const config = {
  matcher: ['/test-pages/:path*', '/admin/:path*'],
};
*/
