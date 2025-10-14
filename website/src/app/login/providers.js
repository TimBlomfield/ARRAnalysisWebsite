'use client';

import { SessionProvider } from 'next-auth/react';


const Providers = ({children}) => (<SessionProvider>{children}</SessionProvider>);  // Must be a client component


export default Providers;
