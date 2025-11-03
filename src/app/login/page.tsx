'use client'

import { useLogin } from '@/hooks/useLogin'
import { LoadingState } from '@/components/login/LoadingState'
import { LoginHeader } from '@/components/login/LoginHeader'
import { GoogleSignInButton } from '@/components/login/GoogleSignInButton'
import { LoginFooter } from '@/components/login/LoginFooter'

export default function LoginPage() {
  const { loading, handleGoogleSignIn } = useLogin()

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <LoginHeader />
        <GoogleSignInButton onSignIn={handleGoogleSignIn} />
        <LoginFooter />
      </div>
    </div>
  )
}
