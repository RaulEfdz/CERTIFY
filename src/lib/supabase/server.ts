'use server';

import { createServerClient as createSupabaseClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

type CookieOptions = {
  name: string;
  value: string;
  path?: string;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  expires?: Date;
};

// Helper function to set a cookie
function setCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, name: string, value: string, options: Partial<CookieOptions> = {}) {
  try {
    cookieStore.set({
      name,
      value,
      path: '/',
      ...options,
    });
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

// Helper function to remove a cookie
function removeCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, name: string, options: Partial<CookieOptions> = {}) {
  try {
    cookieStore.set({
      name,
      value: '',
      path: '/',
      maxAge: 0,
      ...options,
    });
    // Also try to delete the cookie with the old format
    cookieStore.set({
      name: `sb-${name}`,
      value: '',
      path: '/',
      maxAge: 0,
      ...options,
    });
  } catch (error) {
    console.error('Error removing cookie:', error);
  }
};

export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          setCookie(cookieStore, name, value, options);
        },
        remove(name: string, options: any) {
          removeCookie(cookieStore, name, options);
        }
      }
    }
  );
}

// Alias para compatibilidad
export const createClient = createServerClient;

export async function getSession() {
  const supabase = await createServerClient();
  const session = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createServerClient();
  const user = await supabase.auth.getUser();
  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createServerClient();
  const signInResponse = await supabase.auth.signInWithPassword({ email, password });
  return signInResponse;
}

// Function to clear browser storage (client-side only)
async function clearBrowserStorage(): Promise<void> {
  // This function is intended to be called from client-side code
  if (typeof window !== 'undefined') {
    try {
      // Clear all auth related data from localStorage
      const localStorageKeys = [
        'supabase.auth.token',
        'supabase.auth.user',
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

      localStorageKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to remove ${key} from localStorage:`, e);
        }
      });

      // Clear all auth related data from sessionStorage
      const sessionStorageKeys = [
        'supabase.auth.token',
        'supabase.auth.user',
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

      sessionStorageKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to remove ${key} from sessionStorage:`, e);
        }
      });

      // Clear all cookies by setting them to expire in the past
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name.startsWith('sb-') || name.startsWith('sb:')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    } catch (error) {
      console.error('Error clearing browser storage:', error);
    }
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    
    // Clear all auth cookies
    const authCookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-provider-token',
      'sb-user-data',
      'sb-auth-token',
      'sb:token',
      'sb:token.sig',
      'sb:refresh_token',
      'sb:refresh_token.sig',
      'sb:provider_token',
      'sb:provider_token.sig',
      'sb:user',
      'sb:user.sig',
      'sb:session',
      'sb:session.sig'
    ];

    // Clear each cookie
    for (const cookieName of authCookieNames) {
      // Remove with and without 'sb-' prefix for compatibility
      removeCookie(cookieStore, cookieName);
      if (!cookieName.startsWith('sb-')) {
        removeCookie(cookieStore, `sb-${cookieName}`);
      }
    }

    // Clear the session using the Supabase client
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }

    // Clear browser storage (client-side)
    try {
      await clearBrowserStorage();
    } catch (e) {
      console.error('Error clearing browser storage in signOut:', e);
    }

    return { error: null };
  } catch (error) {
    console.error('Error in signOut:', error);
    // Still try to clear storage on error
    try {
      await clearBrowserStorage();
    } catch (e) {
      console.error('Error clearing browser storage in signOut error handler:', e);
    }
    return { error };
  }
}

// Alias para compatibilidad con el código existente
export const createSupabaseServerClient = createServerClient;
