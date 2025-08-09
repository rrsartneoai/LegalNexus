import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface User {
  id: string
  email: string
  phone?: string
  name: string
  role: "client" | "operator" | "admin"
  createdAt: Date
  avatar?: string
}

interface AuthStore {
  /* state */
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  /* local helpers */
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  /* Supabase helpers */
  signInWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ user: User | null; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  fetchUserSession: () => Promise<void>
}

/* -------------------------------------------------------------------------- */
/* Helper to determine user role from email                                   */
/* -------------------------------------------------------------------------- */
function determineRoleFromEmail(email: string): User["role"] {
  if (email.toLowerCase().includes("admin")) {
    return "admin"
  } else if (email.toLowerCase().includes("operator")) {
    return "operator"
  }
  return "client"
}

/* -------------------------------------------------------------------------- */
/* Zustand store                                                              */
/* -------------------------------------------------------------------------- */

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      /* ---------- local state helpers ---------- */
      login: (user) => set({ user, isAuthenticated: true, loading: false }),
      logout: () => set({ user: null, isAuthenticated: false, loading: false }),
      updateUser: (updates) => {
        const current = get().user
        if (current) set({ user: { ...current, ...updates } })
      },

      /* ---------- Supabase helpers ---------- */
      signInWithEmail: async (email, password) => {
        set({ loading: true })

        if (!isSupabaseConfigured()) {
          // Fallback for development - create mock user with role based on email
          const role = determineRoleFromEmail(email)
          const mockUser: User = {
            id: "mock-" + Math.random().toString(36).substr(2, 9),
            email,
            name: email.split("@")[0],
            role,
            createdAt: new Date(),
          }
          set({ user: mockUser, isAuthenticated: true, loading: false })
          return { user: mockUser, error: null }
        }

        try {
          const supabase = createClient()
          if (!supabase) {
            set({ loading: false })
            return { user: null, error: "Błąd konfiguracji systemu" }
          }

          const { data, error } = await supabase.auth.signInWithPassword({ email, password })

          if (error) {
            set({ loading: false })
            return { user: null, error: error.message }
          }

          if (!data.user) {
            set({ loading: false })
            return { user: null, error: "Nieoczekiwany błąd logowania" }
          }

          const user = supabaseUserToLocal(data.user)
          set({ user, isAuthenticated: true, loading: false })
          return { user, error: null }
        } catch (error) {
          set({ loading: false })
          return { user: null, error: "Błąd połączenia z serwerem" }
        }
      },

      signUpWithEmail: async (email, password, name) => {
        set({ loading: true })

        if (!isSupabaseConfigured()) {
          // Fallback for development - create mock user with role based on email
          const role = determineRoleFromEmail(email)
          const mockUser: User = {
            id: "mock-" + Math.random().toString(36).substr(2, 9),
            email,
            name,
            role,
            createdAt: new Date(),
          }
          set({ user: mockUser, isAuthenticated: true, loading: false })
          return { user: mockUser, error: null }
        }

        try {
          const supabase = createClient()
          if (!supabase) {
            set({ loading: false })
            return { user: null, error: "Błąd konfiguracji systemu" }
          }

          // Determine role from email
          const role = determineRoleFromEmail(email)

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role,
              },
            },
          })

          if (error) {
            set({ loading: false })
            return { user: null, error: error.message }
          }

          if (!data.user) {
            set({ loading: false })
            return { user: null, error: "Nieoczekiwany błąd rejestracji" }
          }

          const user = supabaseUserToLocal(data.user)
          set({ user, isAuthenticated: true, loading: false })
          return { user, error: null }
        } catch (error) {
          set({ loading: false })
          return { user: null, error: "Błąd połączenia z serwerem" }
        }
      },

      signOut: async () => {
        set({ loading: true })

        if (!isSupabaseConfigured()) {
          set({ user: null, isAuthenticated: false, loading: false })
          return { error: null }
        }

        try {
          const supabase = createClient()
          if (!supabase) {
            set({ user: null, isAuthenticated: false, loading: false })
            return { error: null }
          }

          const { error } = await supabase.auth.signOut()
          set({ user: null, isAuthenticated: false, loading: false })
          return { error: error?.message || null }
        } catch (error) {
          set({ user: null, isAuthenticated: false, loading: false })
          return { error: null }
        }
      },

      fetchUserSession: async () => {
        if (!isSupabaseConfigured()) return

        try {
          const supabase = createClient()
          if (!supabase) return

          const { data } = await supabase.auth.getSession()
          const user = data.session?.user

          if (user) {
            set({ user: supabaseUserToLocal(user), isAuthenticated: true })
          } else {
            set({ user: null, isAuthenticated: false })
          }
        } catch (error) {
          console.error("Error fetching user session:", error)
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function supabaseUserToLocal(user: any): User {
  const role = user.user_metadata?.role || determineRoleFromEmail(user.email || "")

  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Użytkownik",
    role,
    createdAt: new Date(user.created_at),
    phone: user.phone || undefined,
    avatar: user.user_metadata?.avatar || undefined,
  }
}

/**
 * Dev-only helper preserved for legacy imports and tests.
 */
export const mockLogin = (email: string, role: User["role"] = "client"): User => {
  const user: User = {
    id: Math.random().toString(36).slice(2, 9),
    email,
    name: email.split("@")[0],
    role,
    createdAt: new Date(),
  }
  useAuth.getState().login(user)
  return user
}

/**
 * Dev-only helper preserved for legacy imports and tests.
 */
export const mockLogout = (): void => {
  useAuth.getState().logout()
}

// Initialize auth state on app load
if (typeof window !== "undefined") {
  useAuth.getState().fetchUserSession()
}
