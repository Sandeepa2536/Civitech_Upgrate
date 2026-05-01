import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  
  // Verify token if it exists (await the async verification)
  const isValid = sessionCookie ? await verifyToken(sessionCookie.value) : null;

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isValid) {
      // Clear invalid cookie if it exists
      const response = NextResponse.redirect(new URL('/login', request.url));
      if (sessionCookie) {
        response.cookies.delete('admin_session');
      }
      return response;
    }
  }

  // Prevent logged in users from visiting login page
  if (request.nextUrl.pathname === '/login' && isValid) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
