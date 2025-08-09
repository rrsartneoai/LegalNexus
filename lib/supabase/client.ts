import { createBrowserClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "your-supabase-url" &&
    supabaseAnonKey !== "your-supabase-anon-key"
  )
}

// Create Supabase client with singleton pattern for browser
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    console.warn(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    )
    return null
  }

  if (typeof window !== "undefined") {
    // Browser environment - use singleton
    if (!supabaseInstance) {
      supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    }
    return supabaseInstance
  } else {
    // Server environment - create new instance
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
}

// Export default client
