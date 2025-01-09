'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hash = window.location.hash
        
        // If we have an access token, process it
        if (hash && hash.includes('access_token')) {
          const params = new URLSearchParams(hash.replace('#', '?'))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })

            if (error) throw error
            
            // Redirect to protected area after successful auth
            router.push('/protected/building')
            return
          }
        }

        // If no token, check if we have an active session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/protected/building')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      }
    }

    handleAuth()
  }, [router, supabase.auth])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Loading...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}