// Tipos para la autenticación
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  email_verified_at?: string | null;
  image?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  session_token: string;
  user_id: string;
  expires: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  created_at: string;
  updated_at: string;
}

// Tipos para las respuestas de autenticación
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: Error | null;
}

export interface AuthError extends Error {
  status?: number;
  __isAuthError: boolean;
}

// Tipos para las opciones de autenticación
export interface AuthOptions {
  redirectTo?: string;
  queryParams?: Record<string, string>;
  skipBrowserRedirect?: boolean;
}
