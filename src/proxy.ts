import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  
  // High fidelity auth checking via cookies (works for both live session and mock mode)
  const userCookie = request.cookies.get('somskool_user')
  const user = userCookie ? JSON.parse(userCookie.value) : null

  const { pathname } = request.nextUrl

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
  matcher: ['/payment/:path*', '/admin/:path*', '/login', '/register']
}
