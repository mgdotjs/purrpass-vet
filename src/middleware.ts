import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route configuration
const routes = {
  // Public routes - accessible to everyone
  public: [
    '/',
  ],
  
  // Guest only routes - redirect authenticated users to dashboard
  guestOnly: [
    '/auth/login',
    '/auth/register', 
    '/auth/verify-email',
  ],
  
  // Protected routes - require authentication
  protected: [
    '/dashboard',
    '/appointments',
  ],
  
  // VET only routes - require VET role
  vetOnly: [
    '/onboarding',
    '/onboarding/personal-info',
    '/onboarding/clinic-info', 
    '/onboarding/company-info',
    '/onboarding/success',
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle legacy /login redirect to /auth/login
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Get auth data from cookies (we'll need to store tokens in cookies for SSR)
  const accessToken = request.cookies.get('access_token')?.value;
  const userCookie = request.cookies.get('user')?.value;
  
  let user = null;
  try {
    user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  } catch (error) {
    console.error('Error parsing user cookie:', error);
  }
  
  const isAuthenticated = !!(accessToken && user);
  const isVet = user?.role === 'VET';
  
  // Check if current path matches any route pattern
  const matchesRoute = (routeArray: string[]) => {
    return routeArray.some(route => {
      if (route === pathname) return true;
      // Support for dynamic routes like /onboarding/*
      if (route.endsWith('/*')) {
        const baseRoute = route.slice(0, -2);
        return pathname.startsWith(baseRoute);
      }
      return false;
    });
  };
  
  // Guest only routes - redirect authenticated users
  if (matchesRoute(routes.guestOnly) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Protected routes - require authentication
  if (matchesRoute(routes.protected) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // VET only routes - require VET role
  if (matchesRoute(routes.vetOnly)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (!isVet) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  // Match all routes except static files, API routes, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
