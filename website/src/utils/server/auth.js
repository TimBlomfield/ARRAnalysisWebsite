import 'server-only';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import db from '@/utils/db';


const authOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials/*, req*/) {
        try {
          if (!credentials?.email || !credentials?.password)
            return null;

          const exitingUser = await db.adminUser.findUnique({
            where: { email: credentials.email },
          });
          if (!exitingUser)
            return null;

          const passwordMatch = await compare(credentials.password, exitingUser.hashedPassword);
          if (!passwordMatch)
            return null;

          return {
            id: exitingUser.id,
            email: exitingUser.email,
          };
        } catch (err) {
          return null;
        }
      },
    }),
  ],
};


export {
  authOptions,
};
