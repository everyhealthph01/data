import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase.from("users").select("id").eq("id", data.user.id).single()

      // If user doesn't exist, create a new record
      if (!existingUser) {
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          full_name:
            data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0] || "",
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || "",
          google_id: data.user.user_metadata?.sub || "",
        }

        const { error: insertError } = await supabase.from("users").insert(userData)

        if (insertError) {
          console.error("Error creating user record:", insertError)
          // Continue anyway - user can still access the app
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
