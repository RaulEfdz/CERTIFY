'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { ErrorDialog } from '@/components/ui/error-dialog'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{
    message: string
    type?: string
    field?: string
    code?: string
  } | null>(null)
  
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, isAuthenticated, sendVerificationEmail } = useAuth()
  const [showVerificationSent, setShowVerificationSent] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirectedFrom') || '/'
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, searchParams])

  const handleResendVerification = async () => {
    try {
      setIsLoading(true)
      const { success, error } = await sendVerificationEmail(verificationEmail)
      
      if (error) {
        setError({
          message: error.message,
          type: error.type || 'error',
          code: error.code
        })
        return
      }
      
      if (success) {
        toast({
          title: 'Correo de verificación enviado',
          children: 'Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación.',
        })
        setShowVerificationSent(false)
      }
    } catch (error) {
      console.error('Error al reenviar el correo de verificación:', error)
      setError({
        message: 'No se pudo enviar el correo de verificación. Por favor, inténtalo de nuevo.',
        type: 'verification',
        code: 'verification_failed'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Limpiar errores previos
    
    try {
      setIsLoading(true)
      const { data, error: authError } = await signIn(email, password)
      
      if (authError) {
        // Si el error es de correo no verificado, mostramos el diálogo
        if (authError.code === 'email_not_verified') {
          setVerificationEmail(email)
          setShowVerificationSent(true)
          return
        }
        
        // Mostrar otros errores en el diálogo
        setError({
          message: authError.message,
          type: authError.type || 'error',
          field: authError.field,
          code: authError.code
        })
        return
      }
      
      if (data) {
        // Mostrar mensaje de éxito
        toast({
          title: '¡Bienvenido!',
          children: 'Inicio de sesión exitoso',
        })
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      // Para errores inesperados, mostramos un mensaje genérico
      setError({
        message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
        type: 'unexpected',
        code: 'unexpected_error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ErrorDialog
        open={!!error}
        onOpenChange={(open) => !open && setError(null)}
        title={
          error?.type === 'auth' ? 'Error de autenticación' :
          error?.type === 'validation' ? 'Error de validación' :
          error?.type === 'verification' ? 'Error de verificación' :
          'Ha ocurrido un error'
        }
        description={error?.message || 'Ocurrió un error inesperado'}
      />
      
      <ErrorDialog
        open={showVerificationSent}
        onOpenChange={setShowVerificationSent}
        title="Verificación de correo requerida"
        description={
          <div className="space-y-4">
            <div className="text-sm text-foreground">
              Tu correo electrónico no ha sido verificado. Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.
            </div>
            <div className="text-sm text-foreground">
              ¿No recibiste el correo?
            </div>
            <Button 
              onClick={handleResendVerification}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Enviando...' : 'Reenviar correo de verificación'}
            </Button>
          </div>
        }
      />
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              crea una cuenta nueva
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label htmlFor="email-address">Correo electrónico</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="mb-6">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
