import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true"
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === "/login"
  const isProtectedPage = pathname.startsWith("/dashboard") || pathname === "/"


  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }


  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/dashboard"],
}
