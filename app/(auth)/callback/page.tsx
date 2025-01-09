'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get code from URL
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (!code) {
          throw new Error('No code found')
        }

        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          throw error
        }

        // Redirect after successful authentication
        router.push('/protected/building')
      } catch (error) {
        console.error('Error:', error)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router, supabase.auth])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Processing login...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  )
}