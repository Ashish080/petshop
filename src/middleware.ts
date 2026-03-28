import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = ['/checkout', '/orders', '/admin'];
  
  // Paths that should redirect to dashboard if already authenticated
  const authPaths = ['/auth/login', '/auth/register'];

  // Check if user is authenticated
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isAuthenticated = !!token;
  const isAdmin = token?.role === 'admin';

  const isAdminLoginPage =
    pathname === '/admin/login' || pathname.startsWith('/admin/login/');

  // Protect admin routes (guests may open /admin/login to sign in with NextAuth)
  if (pathname.startsWith('/admin') && !isAdminLoginPage) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect checkout and orders routes
  if (protectedPaths.some(path => pathname.startsWith(path)) && !pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (isAuthenticated) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/auth/login',
    '/auth/register'
  ]
};
