import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { pathname } = req.nextUrl

  // Manejar errores de autenticación
  if (req.nextUrl.searchParams.has('error_code')) {
    const errorCode = req.nextUrl.searchParams.get('error_code')
    const errorDescription = req.nextUrl.searchParams.get('error_description')
    
    // Si el error es de token expirado o inválido
    if (errorCode === 'otp_expired' || errorCode === 'invalid_token') {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('error', 'auth/verification-failed')
      loginUrl.searchParams.set('message', 'El enlace de verificación ha expirado o no es válido. Por favor, solicita un nuevo enlace.')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Obtener la sesión
  const { data: { session } } = await supabase.auth.getSession()
  
  // Rutas protegidas
  const protectedRoutes = ['/', '/templates', '/templates/new', '/keys', '/audit-log', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Si el usuario no está autenticado y está intentando acceder a una ruta protegida
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/login', req.url)
    // Guardar la URL a la que intentaba acceder para redirigir después del login
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si el usuario está autenticado y está en la página de login/registro, redirigir al dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Manejar redirección después de verificación de correo
  if (pathname === '/auth/callback') {
    // Aquí podrías agregar lógica adicional después de una verificación exitosa
    return NextResponse.redirect(new URL('/?verified=true', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth/).*)',
  ],
}
