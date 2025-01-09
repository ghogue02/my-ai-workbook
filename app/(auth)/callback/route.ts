import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const requestUrl = new URL(request.url)
  
  // Log for debugging
  console.log('Callback URL:', request.url)
  
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      console.log('No code found in URL')
      return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code:', error)
      return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }

    // Redirect to the protected area
    return NextResponse.redirect(new URL('/protected/building', requestUrl.origin))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }
}