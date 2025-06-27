
import { NextResponse } from 'next/server'
import { signInWithEmail } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const { data, error } = await signInWithEmail(email, password, cookieStore)

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error al iniciar sesión' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error('Error en la autenticación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
