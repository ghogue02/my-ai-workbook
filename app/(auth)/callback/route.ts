import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const access_token = requestUrl.hash?.split('access_token=')[1]?.split('&')[0]

    if (code || access_token) {
      const supabase = createRouteHandlerClient({ cookies })
      
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
      }

      // Redirect to the protected area after successful authentication
      return NextResponse.redirect(new URL('/protected/building', requestUrl.origin))
    }

    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/login', new URL(request.url).origin))
  }
}