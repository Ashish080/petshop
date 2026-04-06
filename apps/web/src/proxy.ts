import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;
  
  // --- 🛰️ Path Based Isolation Enforcement ---
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0];
  
  const isAdminPortal = hostname === 'kanha-admin.local' || hostname === 'admin.petshop.local';
  const isRiderPortal = hostname === 'kanha-rider.local' || hostname === 'rider.petshop.local';

  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isAuthRoute = nextUrl.pathname.startsWith('/auth') || nextUrl.pathname.includes('/auth/');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isRiderRoute = nextUrl.pathname.startsWith('/rider');
  // Exclude internal Next.js assets
  const isInternal = nextUrl.pathname.startsWith('/_next');

  // If hitting an admin domain but not on an admin route, auto-redirect to /admin
  if (isAdminPortal && !isAdminRoute && !isApiRoute && !isInternal) {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }
  // If hitting a rider domain but not on a rider route, auto-redirect to /rider
  if (isRiderPortal && !isRiderRoute && !isApiRoute && !isInternal) {
    return NextResponse.redirect(new URL('/rider', nextUrl));
  }
  // -------------------------------------------

  if (isApiRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) {
       if (user?.role === 'admin' && nextUrl.pathname.startsWith('/admin/auth')) return NextResponse.redirect(new URL('/admin', nextUrl));
       if (user?.role === 'rider' && nextUrl.pathname.startsWith('/rider/auth')) return NextResponse.redirect(new URL('/rider', nextUrl));
       if (user?.role === 'user' && nextUrl.pathname === '/auth/login') return NextResponse.redirect(new URL('/dashboard', nextUrl));
       if (user?.role === 'admin') return NextResponse.next();
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    if (nextUrl.pathname.includes('/auth')) return NextResponse.next();
    if (!isLoggedIn || user?.role !== 'admin') return NextResponse.redirect(new URL('/admin/auth/login', nextUrl));
    return NextResponse.next();
  }

  if (isRiderRoute) {
    if (nextUrl.pathname.includes('/auth')) return NextResponse.next();
    if (!isLoggedIn || user?.role !== 'rider') return NextResponse.redirect(new URL('/rider/auth/login', nextUrl));
    return NextResponse.next();
  }

  const isProtectedRoute = ['/checkout', '/orders', '/cart', '/profile', '/dashboard'].some(p => nextUrl.pathname.startsWith(p));
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + nextUrl.pathname, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
