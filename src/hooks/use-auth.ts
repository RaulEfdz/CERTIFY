'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useSession } from '@/components/auth/session-provider'

export function useAuth() {
  const { session, user, loading } = useSession()
  const router = useRouter()
  const supabase = createClient()

  const sendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Error al enviar el correo de verificación:', error)
        throw {
          message: 'No se pudo enviar el correo de verificación. Por favor, inténtalo de nuevo.',
          type: 'verification',
          code: 'verification_failed'
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error('Error inesperado al enviar correo de verificación:', error)
      return {
        success: false,
        error: {
          message: 'Ocurrió un error inesperado al enviar el correo de verificación.',
          type: 'unexpected',
          code: 'unexpected_error'
        }
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const trimmedEmail = email.trim()
      const trimmedPassword = password.trim()

      // Validación básica de email
      if (!trimmedEmail) {
        return { 
          data: null, 
          error: { 
            message: 'El correo electrónico es requerido',
            type: 'validation',
            field: 'email'
          } 
        }
      }

      if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
        return { 
          data: null,
          error: {
            message: 'Por favor ingresa un correo electrónico válido',
            type: 'validation',
            field: 'email'
          }
        }
      }

      // Validación básica de contraseña
      if (!trimmedPassword) {
        return {
          data: null,
          error: {
            message: 'La contraseña es requerida',
            type: 'validation',
            field: 'password'
          }
        }
      }

      if (trimmedPassword.length < 6) {
        return {
          data: null,
          error: {
            message: 'La contraseña debe tener al menos 6 caracteres',
            type: 'validation',
            field: 'password',
            minLength: 6
          }
        }
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      })

      if (authError) {
        // Mapear errores comunes de Supabase a mensajes más amigables
        let errorMessage = 'Error al iniciar sesión'
        let errorType = 'auth'
        let errorCode = 'unknown_error'

        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Correo o contraseña incorrectos. Por favor, verifica tus credenciales.'
          errorCode = 'invalid_credentials'
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.'
          errorCode = 'email_not_verified'
        } else if (authError.message.includes('Too many requests')) {
          errorMessage = 'Demasiados intentos. Por favor, inténtalo de nuevo más tarde.'
          errorType = 'rate_limit'
          errorCode = 'too_many_requests'
        }

        return {
          data: null,
          error: {
            message: errorMessage,
            type: errorType,
            code: errorCode
          }
        }
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('Error inesperado al iniciar sesión:', error)
      return {
        data: null,
        error: {
          message: 'Ocurrió un error inesperado al iniciar sesión. Por favor, inténtalo de nuevo.',
          type: 'unexpected',
          code: 'unexpected_error'
        }
      }
    }
  }


  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al registrarse:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
      router.refresh()
      return { error: null }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return { error }
    }
  }

  return {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    sendVerificationEmail,
    isAuthenticated: !!session,
  }
}
