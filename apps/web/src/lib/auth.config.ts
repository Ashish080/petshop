import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  trustHost: true,
  providers: [],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'user' | 'admin' | 'rider';
        session.user.email = (token.email as string) ?? '';
        session.user.name = (token.name as string) ?? '';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
