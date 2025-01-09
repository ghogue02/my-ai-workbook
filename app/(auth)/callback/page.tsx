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
        // Get access_token from URL hash
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          const accessToken = hash.split('access_token=')[1].split('&')[0]
          const refreshToken = hash.split('refresh_token=')[1].split('&')[0]

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) throw error
          
          // Redirect to protected area on success
          router.push('/protected/building')
        }
      } catch (error) {
        console.error('Error:', error)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router, supabase.auth])

  return <div>Loading...</div>
}