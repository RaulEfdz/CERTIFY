import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = await createSupabaseServerClient(cookieStore)
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirigir al dashboard después de iniciar sesión
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
