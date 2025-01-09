import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      return NextResponse.redirect(new URL('/protected/building', url.origin))
    }

    return NextResponse.redirect(new URL('/login', url.origin))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/login', url.origin))
  }
}