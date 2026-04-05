import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth;
  const { pathname } = nextUrl;

  // Handle redirects for /login or /admin/login to the standardized /auth/login
  if (pathname === '/login' || pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // Handle root /admin access
  if (pathname === '/admin') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login', nextUrl));
    }
    if (auth?.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    // Allow /admin to proceed (usually layout will redirect to /admin/products or similar if needed)
  }

  return NextResponse.next();
});

export const config = {
    matcher: [
        '/login',
        '/admin/:path*',
        '/auth/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
