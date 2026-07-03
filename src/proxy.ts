import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next()
  
  // High fidelity auth checking via cookies (works for both live session and mock mode)
  const userCookie = request.cookies.get('somskool_user')
  const user = userCookie ? JSON.parse(userCookie.value) : null

  const { pathname } = request.nextUrl

  // Refresh Supabase Session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseUrl !== 'your_url' && supabaseAnonKey) {
    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
              response = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      await supabase.auth.getUser()
    } catch (error) {
      console.error('Proxy session refresh error:', error)
    }
  }

  // Protected Routes
  if (pathname.startsWith('/payment') && !user) {
    return NextResponse.redirect(new URL('/login?next=/payment', request.url))
  }

  // Secure Admin Portal
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?next=/admin', request.url))
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  // Guest-Only Routes (Redirect logged in users)
  if ((pathname === '/login' || pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/courses', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
