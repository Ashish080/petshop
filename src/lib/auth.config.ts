import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPage = nextUrl.pathname.startsWith('/admin');
      const isAuthPage = nextUrl.pathname.startsWith('/auth');

      if (isAdminPage) {
        if (isLoggedIn) {
          return auth?.user?.role === 'admin';
        }
        return false; // Redirect to login
      }
      
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'user' | 'admin';
        session.user.email = (token.email as string) ?? '';
        session.user.name = (token.name as string | undefined) ?? '';
      }
      return session;
    }
  },
  providers: [], // Add providers in auth.ts
};
