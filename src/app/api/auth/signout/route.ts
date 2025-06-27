import { NextResponse } from 'next/server'
import { signOut } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    const { error } = await signOut(cookieStore)

    if (error) {
      return NextResponse.json(
        { error: 'Error al cerrar sesión' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Sesión cerrada correctamente' })
  } catch (error) {
    console.error('Error en el cierre de sesión:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
