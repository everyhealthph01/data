import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    // Create a basic response first
    const response = NextResponse.next()

    // Skip middleware for static files and API routes that don't need auth
    const { pathname } = request.nextUrl

    // Skip for static assets, API routes (except auth), and special Next.js routes
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/favicon") ||
      pathname.includes(".") ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml"
    ) {
      return response
    }

    // Environment variables check
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If environment variables are missing, allow all requests but log warning
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase environment variables missing in middleware")
      return response
    }

    // Dynamic import to avoid build issues
    const { createServerClient } = await import("@supabase/ssr")

    let user = null
    let doctorProfile = null

    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      })

      // Get user with timeout
      const userPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 5000))

      const {
        data: { user: authUser },
      } = (await Promise.race([userPromise, timeoutPromise])) as any
      user = authUser

      // If user exists, try to get doctor profile
      if (user) {
        try {
          const { data: profile } = await supabase
            .from("doctors")
            .select("id, is_verified, is_active, verification_status")
            .eq("user_id", user.id)
            .single()

          doctorProfile = profile
        } catch (error) {
          // Ignore doctor profile errors - user might be a patient
          console.log("No doctor profile found or error fetching:", error)
        }
      }
    } catch (error) {
      console.error("Auth error in middleware:", error)
      // Continue without user if auth fails
    }

    // Route protection logic

    // Protect dashboard routes (patient dashboard)
    if (pathname.startsWith("/dashboard")) {
      if (!user) {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }
      return response
    }

    // Handle doctor routes
    if (pathname.startsWith("/doctor")) {
      // Public doctor pages (no auth required)
      const publicDoctorPages = ["/doctor/register", "/doctor/register/success", "/doctor/login"]

      if (publicDoctorPages.includes(pathname)) {
        return response
      }

      // All other doctor routes require authentication
      if (!user) {
        return NextResponse.redirect(new URL("/doctor/login", request.url))
      }

      // Doctor dashboard - just needs authentication
      if (pathname === "/doctor/dashboard") {
        return response
      }

      // Other doctor routes - check verification status
      if (pathname.startsWith("/doctor/") && pathname !== "/doctor/pending") {
        if (!doctorProfile) {
          // No doctor profile - redirect to registration
          return NextResponse.redirect(new URL("/doctor/register", request.url))
        }

        if (!doctorProfile.is_verified || !doctorProfile.is_active) {
          // Not verified - redirect to pending page
          return NextResponse.redirect(new URL("/doctor/pending", request.url))
        }
      }

      return response
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup")) {
      if (user) {
        // Check if user is a verified doctor
        if (doctorProfile && doctorProfile.is_verified && doctorProfile.is_active) {
          return NextResponse.redirect(new URL("/doctor/dashboard", request.url))
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // Always return a response, never throw
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
