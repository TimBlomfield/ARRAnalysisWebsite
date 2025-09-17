import 'server-only';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';
import { createAuditLog } from '@/utils/server/audit';
import { runCleanup } from '@/utils/server/cleanup';


const K_THIRTY_DAYS = 30 * 24 * 60 * 60; // One week in seconds

const authOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: K_THIRTY_DAYS,
  },
  jwt: {
    maxAge: K_THIRTY_DAYS,
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

          // Check if this is a stray userData and if so delete it
          if (existingUserData.admin == null && existingUserData.customer == null && existingUserData.user == null) {
            await db.userData.delete({ where: { email: credentials.email }});
            return null;
          }

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

          await runCleanup();

          return {
            id,
            email,
            adminId: admin?.id,
          };
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {

      if (token?.email) { // Check if the user still exists, because it might have been deleted by a customer or an admin
        const userData = await db.userData.findUnique({
          where: { email: token.email },
          select: { id: true },
        });
        if (userData == null) {
          console.info(`User ${token.email} no longer exists. Invalidating session.`);
          return null;  // User doesn't exist, invalidate session
        }
      }

      session.token = token;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Initial login
        token.userData = user;
      } else {
        // Subsequent calls (e.g. session checks)
      }

      return token;
    },
  },
};


export {
  authOptions,
};
