import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

    // For other doctor routes, check if user is a verified doctor
    const { data: doctorProfile } = await supabase
      .from("doctors")
      .select("id, is_verified, is_active, verification_status")
      .eq("user_id", user.id)
      .single()

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
  }

  // Redirect authenticated users away from auth pages
  if (
    (request.nextUrl.pathname.startsWith("/auth/signin") || request.nextUrl.pathname.startsWith("/auth/signup")) &&
    user
  ) {
    // Check if user is a doctor and redirect accordingly
    const { data: doctorProfile } = await supabase
      .from("doctors")
      .select("id, is_verified, is_active")
      .eq("user_id", user.id)
      .single()

    if (doctorProfile && doctorProfile.is_verified && doctorProfile.is_active) {
      return NextResponse.redirect(new URL("/doctor/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
