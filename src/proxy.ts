import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isAuthRoute = nextUrl.pathname.startsWith('/auth') || nextUrl.pathname.includes('/auth/');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isRiderRoute = nextUrl.pathname.startsWith('/rider');

  // 1. Allow API routes (they handle their own auth)
  if (isApiRoute) return NextResponse.next();

  // 2. Auth Page Access (Don't let logged in users go to login)
  if (isAuthRoute) {
    if (isLoggedIn) {
       // Redirect based on role
       if (user?.role === 'admin') return NextResponse.redirect(new URL('/admin', nextUrl));
       if (user?.role === 'rider') return NextResponse.redirect(new URL('/rider', nextUrl));
       return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Admin Protection
  if (isAdminRoute) {
    // Admin login path should be allowed if unauthenticated
    if (nextUrl.pathname.includes('/auth')) return NextResponse.next();
    
    if (!isLoggedIn || user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/auth/login', nextUrl));
    }
    return NextResponse.next();
  }

  // 4. Rider Protection
  if (isRiderRoute) {
    // Rider signup/login should be allowed if unauthenticated
    if (nextUrl.pathname.includes('/auth')) return NextResponse.next();
    
    if (!isLoggedIn || user?.role !== 'rider') {
      return NextResponse.redirect(new URL('/rider/auth/login', nextUrl));
    }
    return NextResponse.next();
  }

  // 5. General Protection (Checkout/Orders/Profile)
  const isProtectedRoute = ['/checkout', '/orders', '/cart', '/profile', '/dashboard'].some(p => nextUrl.pathname.startsWith(p));
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + nextUrl.pathname, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
