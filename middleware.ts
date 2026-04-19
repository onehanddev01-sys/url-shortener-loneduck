import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/secret-admin/dashboard') || pathname.startsWith('/api/admin')) {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.redirect(new URL('/secret-admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/secret-admin/dashboard/:path*',
    '/api/admin/:path*',
  ],
}
