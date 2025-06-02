import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is not defined.")
}

if (!supabaseAnonKey) {
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined.")
}

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL or Anon Key is missing.")
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({
              name: name,
              value: value,
              ...options,
            })
            supabaseResponse.cookies.set({
              name: name,
              value: value,
              ...options,
            })
          })
        },
      },
    })

    // Refresh session if expired - with error handling
    let user = null
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch (error) {
      console.error("Auth error in middleware:", error)
      // Continue without user if auth fails
    }

    // Protect dashboard routes (patient dashboard)
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    // Protect doctor routes
    if (request.nextUrl.pathname.startsWith("/doctor")) {
      // Allow access to doctor registration and login pages without authentication
      if (
        request.nextUrl.pathname === "/doctor/register" ||
        request.nextUrl.pathname === "/doctor/register/success" ||
        request.nextUrl.pathname === "/doctor/login"
      ) {
        return supabaseResponse
      }

      // Require authentication for all other doctor routes
      if (!user) {
        return NextResponse.redirect(new URL("/doctor/login", request.url))
      }

      // For doctor dashboard, just check if user is authenticated
      if (request.nextUrl.pathname === "/doctor/dashboard") {
        return supabaseResponse
      }

      // For other doctor routes, check if user is a verified doctor (with error handling)
      try {
        const { data: doctorProfile, error } = await supabase
          .from("doctors")
          .select("id, is_verified, is_active, verification_status")
          .eq("user_id", user.id)
          .single()

        if (error && error.code !== "PGRST116") {
          // If there's a database error (not "no rows"), log it and allow access
          console.error("Database error in middleware:", error)
          return supabaseResponse
        }

        // If no doctor profile exists, redirect to registration
        if (!doctorProfile) {
          if (request.nextUrl.pathname !== "/doctor/register") {
            return NextResponse.redirect(new URL("/doctor/register", request.url))
          }
        }
        // If doctor profile exists but not verified/active, show pending page
        else if (!doctorProfile.is_verified || !doctorProfile.is_active) {
          if (request.nextUrl.pathname !== "/doctor/pending") {
            return NextResponse.redirect(new URL("/doctor/pending", request.url))
          }
        }
      } catch (error) {
        console.error("Error checking doctor profile:", error)
        // On error, allow access to prevent blocking
        return supabaseResponse
      }
    }

    // Redirect authenticated users away from auth pages
    if (
      (request.nextUrl.pathname.startsWith("/auth/signin") || request.nextUrl.pathname.startsWith("/auth/signup")) &&
      user
    ) {
      try {
        // Check if user is a doctor and redirect accordingly
        const { data: doctorProfile, error } = await supabase
          .from("doctors")
          .select("id, is_verified, is_active")
          .eq("user_id", user.id)
          .single()

        if (error) {
          console.error("Error fetching doctor profile:", error)
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        if (doctorProfile && doctorProfile.is_verified && doctorProfile.is_active) {
          return NextResponse.redirect(new URL("/doctor/dashboard", request.url))
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      } catch (error) {
        console.error("Error checking user type:", error)
        // Default to patient dashboard on error
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error("Middleware error:", error)
    // Return a basic response if middleware fails completely
    return NextResponse.next({
      request,
    })
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
