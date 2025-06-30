'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        const redirectTo = searchParams.get('redirectedFrom') || '/login'
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [router, searchParams, supabase.auth])

  return <>{children}</>
}
