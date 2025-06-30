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

import { Suspense } from "react";

function LoginPageContent() {
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
    <div className="min-h-screen flex items-center justify-center bg-[#0d4b26] p-4 sm:p-6 lg:p-8 text-white">
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
      >
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
      </ErrorDialog>
      
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-24 w-24 mb-4">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Bienvenido de nuevo</h1>
          <p className="mt-2 text-sm text-white/90">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-medium text-white hover:text-white/80 transition-colors underline">
              Regístrate
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full py-3 text-base bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/50 focus:ring-1 focus:ring-white/30"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password" className="block text-sm font-medium text-white">
                    Contraseña
                  </Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-white hover:text-white/80 transition-colors underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full py-3 text-base bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/50 focus:ring-1 focus:ring-white/30"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-white focus:ring-white border-white/50 rounded bg-white/10"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/90">
                  Recordar mi cuenta
                </label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full justify-center py-3 px-4 border border-transparent rounded-xl text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
