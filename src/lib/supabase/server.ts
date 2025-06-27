'use server';

import { createServerClient as createSupabaseClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// Create a type-safe cookie store
type CookieStore = {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options: any) => void;
};

// Create a wrapper for the cookie store
function createCookieStore(): CookieStore {
  const cookieStore = cookies();
  
  // Create a proxy to handle the async nature of cookies()
  return {
    get: (name: string) => {
      // @ts-ignore - cookies() returns a proxy that handles get
      return cookieStore.get(name);
    },
    set: (name: string, value: string, options: any) => {
      // @ts-ignore - cookies() returns a proxy that handles set
      cookieStore.set(name, value, options);
    },
  };
}

export function createServerClient() {
  const cookieStore = createCookieStore();
  
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
}

// Alias para compatibilidad
export const createClient = createServerClient;

export async function getSession() {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

export async function getUser() {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const supabase = createServerClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Alias para compatibilidad con el código existente
export const createSupabaseServerClient = createServerClient;
