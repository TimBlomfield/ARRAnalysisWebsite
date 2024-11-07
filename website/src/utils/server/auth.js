import 'server-only';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';
import { createAuditLog } from '@/utils/server/audit';


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
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password)
            return null;

          const existingUserData = await db.userData.findUnique({
            where: { email: credentials.email },
            include: {
              admin: true,
              customer: true,
              user: true,
            },
          });
          if (!existingUserData)
            return null;

          const passwordMatch = await compare(credentials.password, existingUserData.hashedPassword);
          if (!passwordMatch)
            return null;

          const { id, email, admin, customer, user } = existingUserData;

          await createAuditLog({
            type: AuditEvent.LOGIN,
            email,
            admin,
            customer,
            user,
          }, req);
          return {
            id,
            email,
            adminId: admin?.id,
            customerId: customer?.id,
            userId: user?.id,
          };
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.token = token;
      return session;
    },
    async jwt({ token, user }) {
      if (user)
        token.userData = user;
      return token;
    },
  },
};


export {
  authOptions,
};
