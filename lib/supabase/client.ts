import { createClient } from "@supabase/supabase-js"

// Environment variables with proper validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== "undefined") {
    console.warn("Missing Supabase environment variables")
  }
}

// Singleton client instance
let supabaseClient: ReturnType<typeof createClient> | null = null

// Create singleton Supabase client
export function createClientComponentClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  // Return mock client if environment variables are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient()
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
      detectSessionInUrl: typeof window !== "undefined",
    },
  })

  return supabaseClient
}

// Mock client for build time and missing env vars
function createMockClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: "Environment not configured" } }),
      signInWithOAuth: () =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: "Environment not configured" } }),
      signUp: () =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: "Environment not configured" } }),
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

// Authentication helper functions with proper error handling
export async function signInWithEmail(email: string, password: string) {
  try {
    if (!email || !password) {
      return { data: { user: null, session: null }, error: { message: "Email and password are required" } }
    }

    const supabase = createClientComponentClient()
    const result = await supabase.auth.signInWithPassword({ email, password })
    return result
  } catch (error) {
    console.error("Sign in error:", error)
    return { data: { user: null, session: null }, error: error || { message: "Sign in failed" } }
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
    return { data: { user: null, session: null }, error: error || { message: "Google sign in failed" } }
  }
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    if (!email || !password || !fullName) {
      return { data: { user: null, session: null }, error: { message: "All fields are required" } }
    }

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
    return { data: { user: null, session: null }, error: error || { message: "Sign up failed" } }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createClientComponentClient()
    return await supabase.auth.getUser()
  } catch (error) {
    console.error("Get user error:", error)
    return { data: { user: null }, error: error || { message: "Failed to get user" } }
  }
}

export async function signOut() {
  try {
    const supabase = createClientComponentClient()
    const result = await supabase.auth.signOut()
    // Clear the singleton client on sign out
    supabaseClient = null
    return result
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: error || { message: "Sign out failed" } }
  }
}
