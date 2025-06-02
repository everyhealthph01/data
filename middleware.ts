import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Create response immediately to ensure we always return something
  const response = NextResponse.next()

  try {
    const { pathname } = request.nextUrl

    // Skip all processing for static files, API routes, and special paths
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon") ||
      pathname.includes(".") ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml" ||
      pathname === "/manifest.json"
    ) {
      return response
    }

    // Very basic auth check using cookies only
    const authCookies = request.cookies.getAll()
    const hasAuthCookie = authCookies.some(
      (cookie) => cookie.name.includes("supabase") || cookie.name.includes("sb-") || cookie.name.includes("auth"),
    )

    // Simple route protection without any external dependencies

    // Protect dashboard (patient area)
    if (pathname.startsWith("/dashboard")) {
      if (!hasAuthCookie) {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }
      return response
    }

    // Handle doctor routes
    if (pathname.startsWith("/doctor")) {
      // Always allow these public pages
      if (pathname === "/doctor/register" || pathname === "/doctor/register/success" || pathname === "/doctor/login") {
        return response
      }

      // For all other doctor routes, just check for any auth cookie
      if (!hasAuthCookie) {
        return NextResponse.redirect(new URL("/doctor/login", request.url))
      }

      return response
    }

    // Redirect from auth pages if user seems to be logged in
    if (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup")) {
      if (hasAuthCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return response
  } catch (error) {
    // Log error but always return a response
    console.error("Middleware error:", error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
