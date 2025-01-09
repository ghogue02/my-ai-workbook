import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const hash = url.hash
  
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Handle hash-based access token
    if (hash && hash.includes('access_token')) {
      // Extract access_token from hash
      const accessToken = hash.split('access_token=')[1].split('&')[0]
      
      // Set the session using the token
      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hash.split('refresh_token=')[1].split('&')[0]
      })

      if (session) {
        return NextResponse.redirect(new URL('/protected/building', url.origin))
      }
    }

    // If no valid session, redirect to login
    return NextResponse.redirect(new URL('/login', url.origin))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/login', url.origin))
  }
}