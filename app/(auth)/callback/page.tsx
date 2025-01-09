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
        // Log the URL for debugging
        console.log('Current URL:', window.location.href)

        // Get access_token from URL hash
        const hash = window.location.hash
        console.log('Hash:', hash)

        if (hash && hash.includes('access_token')) {
          // Extract tokens and parameters from hash
          const params = new URLSearchParams(hash.replace('#', '?'))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')

          if (!accessToken || !refreshToken) {
            throw new Error('No tokens found')
          }

          // Set the session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('Session error:', error)
            throw error
          }

          // Check if session was set
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            console.log('Session established, redirecting...')
            router.push('/protected/building')
          } else {
            throw new Error('No session established')
          }
        } else {
          console.log('No access token found in URL')
          router.push('/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
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