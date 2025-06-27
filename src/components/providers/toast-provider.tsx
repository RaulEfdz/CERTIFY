'use client'

import { 
  ToastProvider as Toast, 
  ToastViewport 
} from '@/components/ui/toast'

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <Toast>
      {children}
      <ToastViewport />
    </Toast>
  )
}
