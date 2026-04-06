import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;
  const role = user?.role;
  const pathname = nextUrl.pathname;
  
  // --- 🪐 Metadata & Static Asset Filter ---
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    ['/favicon.ico', '/sitemap.xml', '/robots.txt', '/sw.js'].includes(pathname)
  ) {
    return NextResponse.next();
  }

  // --- 🛰️ Path Based Isolation Enforcement ---
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0];
  const isAdminPortal = hostname === 'kanha-admin.local' || hostname === 'admin.petshop.local';
  const isRiderPortal = hostname === 'kanha-rider.local' || hostname === 'rider.petshop.local';

  if (isAdminPortal && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }
  if (isRiderPortal && !pathname.startsWith('/rider')) {
    return NextResponse.redirect(new URL('/rider', nextUrl));
  }

  // --- 🔐 RBAC logic ---
  const isAuthPage = pathname.startsWith('/auth/') || pathname === '/login' || pathname === '/auth/register';
  const isProtectedUserPage = ['/checkout', '/orders', '/cart', '/profile', '/dashboard'].some(p => pathname.startsWith(p));
  const isAdminPage = pathname.startsWith('/admin');
  const isRiderPage = pathname.startsWith('/rider');

  // 1. Auth Page Logic (Hide from logged in users)
  if (isAuthPage && isLoggedIn) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin', nextUrl));
    if (role === 'rider') return NextResponse.redirect(new URL('/rider', nextUrl));
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // 2. Admin Page Logic
  if (isAdminPage) {
    const isAdminAuthPage = pathname.startsWith('/admin/auth') || pathname === '/admin/login';
    if (isAdminAuthPage) {
      if (isLoggedIn && role === 'admin') return NextResponse.redirect(new URL('/admin', nextUrl));
      return NextResponse.next();
    }
    if (!isLoggedIn) return NextResponse.redirect(new URL('/admin/login', nextUrl));
    if (role !== 'admin') return NextResponse.redirect(new URL('/', nextUrl));
    return NextResponse.next();
  }

  // 3. Rider Page Logic
  if (isRiderPage) {
    const isRiderAuthPage = pathname.startsWith('/rider/auth');
    if (isRiderAuthPage) {
      if (isLoggedIn && role === 'rider') return NextResponse.redirect(new URL('/rider', nextUrl));
      return NextResponse.next();
    }
    if (!isLoggedIn) return NextResponse.redirect(new URL('/rider/auth/login', nextUrl));
    if (role !== 'rider') return NextResponse.redirect(new URL('/', nextUrl));
    return NextResponse.next();
  }

  // 4. General Protected User Page Logic
  if (isProtectedUserPage && !isLoggedIn) {
    const loginUrl = new URL('/auth/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js|manifest.json|icons/).*)',
  ],
};
