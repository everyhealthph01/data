import { createClient } from "@supabase/supabase-js"

// Environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables")
}

// Singleton client instance to prevent multiple GoTrueClient instances
let supabaseClient: ReturnType<typeof createClient> | null = null

// Create singleton Supabase client
export function createClientComponentClient() {
  // Return existing instance if available
  if (supabaseClient) {
    return supabaseClient
  }

  // Only create client if environment variables are available
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: null }),
        updateUser: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
            order: () => Promise.resolve({ data: [], error: null }),
          }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => Promise.resolve({ error: null }),
        update: () => Promise.resolve({ error: null }),
        delete: () => Promise.resolve({ error: null }),
      }),
    } as any
  }

  // Create the actual Supabase client
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: typeof window !== "undefined", // Only persist on client
      autoRefreshToken: typeof window !== "undefined",
      detectSessionInUrl: typeof window !== "undefined",
    },
  })

  return supabaseClient
}

// Export for backward compatibility
export { createClient }

// Authentication helper functions
export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = createClientComponentClient()
    return await supabase.auth.signInWithPassword({ email, password })
  } catch (error) {
    console.error("Sign in error:", error)
    return { data: { user: null, session: null }, error }
  }
}

export async function signInWithGoogle() {
  try {
    const supabase = createClientComponentClient()
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  } catch (error) {
    console.error("Google sign in error:", error)
    return { data: { user: null, session: null }, error }
  }
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    const supabase = createClientComponentClient()
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
  } catch (error) {
    console.error("Sign up error:", error)
    return { data: { user: null, session: null }, error }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createClientComponentClient()
    return await supabase.auth.getUser()
  } catch (error) {
    console.error("Get user error:", error)
    return { data: { user: null }, error }
  }
}

export async function signOut() {
  try {
    const supabase = createClientComponentClient()
    return await supabase.auth.signOut()
  } catch (error) {
    console.error("Sign out error:", error)
    return { error }
  }
}
