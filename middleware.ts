import { NextResponse, type NextRequest } from "next/server"

// Simple middleware that doesn't rely on external dependencies
export async function middleware(request: NextRequest) {
  // Create a basic response
  const response = NextResponse.next()

  try {
    // Skip middleware for static files and API routes
    const { pathname } = request.nextUrl

    // Skip for static assets and files
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api/") ||
      pathname.includes(".") ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml"
    ) {
      return response
    }

    // Get auth cookie to check if user is logged in
    const hasSession =
      request.cookies.has("sb-access-token") ||
      request.cookies.has("sb-refresh-token") ||
      request.cookies.has("supabase-auth-token")

    // Basic route protection without Supabase client

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard") && !hasSession) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    // Handle doctor routes
    if (pathname.startsWith("/doctor")) {
      // Public doctor pages
      const publicDoctorPages = ["/doctor/register", "/doctor/register/success", "/doctor/login"]

      if (publicDoctorPages.includes(pathname)) {
        return response
      }

      // All other doctor routes require authentication
      if (!hasSession) {
        return NextResponse.redirect(new URL("/doctor/login", request.url))
      }

      // For verification status, we'll rely on client-side checks
      // This simplifies middleware and prevents server errors
    }

    // Redirect authenticated users away from auth pages
    if ((pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup")) && hasSession) {
      // Default to dashboard - specific redirects handled client-side
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // Always return a response, never throw
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
