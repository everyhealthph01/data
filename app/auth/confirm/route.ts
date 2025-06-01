import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? "/dashboard"

  if (token_hash && type) {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error && data.user) {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase.from("users").select("id").eq("id", data.user.id).single()

      // If user doesn't exist, create a new record
      if (!existingUser) {
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "",
          avatar_url: data.user.user_metadata?.avatar_url || "",
        }

        const { error: insertError } = await supabase.from("users").insert(userData)

        if (insertError) {
          console.error("Error creating user record:", insertError)
          // Continue anyway - user can still access the app
        }
      }

      // Redirect to dashboard on successful confirmation
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
