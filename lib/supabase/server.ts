import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Original function with the name expected by the application
export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return mock client if environment variables are missing (build time)
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockSupabaseClient()
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookies in middleware or other contexts
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Handle cookies in middleware or other contexts
        }
      },
    },
  })
}

// Also export as createServerComponentClient for newer code
export const createServerComponentClient = createServerSupabaseClient

// Helper function for server-side data fetching
export async function getServerSideUser() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.getUser()
    return { user: data?.user || null, error }
  } catch (error) {
    console.error("Server-side user fetch error:", error)
    return { user: null, error }
  }
}

// Create a mock client for build time
function createMockSupabaseClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => Promise.resolve({ error: null }),
      update: () => Promise.resolve({ error: null }),
      delete: () => Promise.resolve({ error: null }),
    }),
  } as any
}
