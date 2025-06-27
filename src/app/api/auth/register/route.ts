import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
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
    const supabase = await createSupabaseServerClient(cookieStore)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Error al registrar el usuario' },
        { status: 400 }
      )
    }

    // Crear perfil de usuario en la tabla profiles
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        console.error('Error al crear perfil:', profileError)
        return NextResponse.json(
          { error: 'Error al crear el perfil del usuario' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      message: 'Registro exitoso. Por favor verifica tu correo electrónico.',
      user: data.user,
    })
  } catch (error) {
    console.error('Error en el registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
