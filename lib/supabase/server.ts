import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Server-side Supabase client
export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return mock client if environment variables are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockSupabaseClient()
  }

  try {
    const cookieStore = cookies()

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          try {
            return cookieStore.get(name)?.value
          } catch (error) {
            console.error("Error getting cookie:", error)
            return undefined
          }
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error("Error setting cookie:", error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.error("Error removing cookie:", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Error creating server client:", error)
    return createMockSupabaseClient()
  }
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

// Create a mock client for build time and error cases
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
