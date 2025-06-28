import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    // Create a server client
    const supabase = await createServerClient();
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during sign out:', error);
    }

    // Create a response that will clear the auth cookies
    const response = NextResponse.json(
      { message: 'Sesión cerrada correctamente' },
      { status: 200 }
    );

    // Clear all auth related cookies
    const authCookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-provider-token',
      'sb-user-data',
      'sb-auth-token',
      'sb:token',
      'sb:refresh_token',
      'sb:provider_token',
      'sb:user',
      'sb:session'
    ];

    // Set all auth cookies to expire immediately
    authCookieNames.forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        path: '/',
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });

    return response;
  } catch (error) {
    console.error('Error en el cierre de sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
