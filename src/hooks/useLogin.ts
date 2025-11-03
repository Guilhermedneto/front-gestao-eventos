'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export function useLogin() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle()
    if (error) {
      alert('Erro ao fazer login: ' + error)
    }
  }

  return {
    loading,
    handleGoogleSignIn,
  }
}
