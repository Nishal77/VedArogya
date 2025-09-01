import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // For now, we'll allow all routes (you can implement proper auth logic later)
  // This is where you'd check for authentication tokens, user sessions, etc.
  
  // Example: Redirect to login if accessing dashboard without auth
  // if (pathname.startsWith('/dashboard') && !isAuthenticated) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  
  // Example: Redirect to dashboard if accessing login while authenticated
  // if (pathname === '/login' && isAuthenticated) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
