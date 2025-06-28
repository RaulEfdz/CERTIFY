import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl

  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return res
  }

  // Skip middleware for static files
  if (
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return res
  }

  // Handle auth errors
  if (req.nextUrl.searchParams.has('error_code')) {
    const errorCode = req.nextUrl.searchParams.get('error_code')
    
    if (errorCode === 'otp_expired' || errorCode === 'invalid_token') {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('error', 'auth/verification-failed')
      loginUrl.searchParams.set('message', 'El enlace de verificación ha expirado o no es válido. Por favor, solicita un nuevo enlace.')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Create a Supabase client and get the session
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/auth/callback', '/auth/confirm', '/auth/reset-password']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Protected routes
  const protectedRoutes = ['/', '/templates', '/templates/new', '/keys', '/audit-log', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If user is not authenticated and trying to access a protected route
  if (!session && isProtectedRoute) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and trying to access a public auth route
  if (session && isPublicRoute) {
    // Don't redirect if it's the auth callback
    if (pathname.startsWith('/auth/callback')) {
      return res
    }
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth API routes)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2?|eot|ttf|otf)$).*)',
  ],
}
