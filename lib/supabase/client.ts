import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Singleton pattern to prevent multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function createClientComponentClient() {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Check for environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing")
    return createMockClient()
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
        detectSessionInUrl: typeof window !== "undefined",
      },
    })

    return supabaseInstance
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient()
  }
}

// Mock client for fallback
function createMockClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Supabase not configured" },
        }),
      signInWithOAuth: () =>
        Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Supabase not configured" },
        }),
      signUp: () =>
        Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Supabase not configured" },
        }),
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

// Export for backward compatibility
export { createClient }

// Authentication helpers with error handling
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
    if (typeof window === "undefined") {
      return { data: { user: null, session: null }, error: { message: "Not available on server" } }
    }

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
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/confirm` : undefined,
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
    const result = await supabase.auth.signOut()
    // Clear singleton on sign out
    supabaseInstance = null
    return result
  } catch (error) {
    console.error("Sign out error:", error)
    return { error }
  }
}
