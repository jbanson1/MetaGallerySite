'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  location: string | null
  bio: string | null
}

// ─── DEV HARDCODED ACCOUNT ───────────────────────────────────────────────────
const DEV_USERNAME = 'Admin'
const DEV_PASSWORD = 'CG2026!'
const DEV_USER = {
  id: 'dev-admin-000',
  email: 'admin@metagallery.dev',
  app_metadata: {},
  user_metadata: { full_name: 'Admin' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User
const DEV_PROFILE: Profile = {
  id: 'dev-admin-000',
  full_name: 'Admin',
  avatar_url: null,
  location: null,
  bio: null,
}
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Omit<Profile, 'id'>>) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as Profile)
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    // Dev hardcoded bypass
    if (email === DEV_USERNAME && password === DEV_PASSWORD) {
      setUser(DEV_USER)
      setProfile(DEV_PROFILE)
      setSession({ user: DEV_USER } as unknown as Session)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    })
    if (error) return { error: error.message, needsConfirmation: false }
    // If user is returned but not confirmed, email confirmation is required
    const needsConfirmation = !!data.user && !data.session
    return { error: null, needsConfirmation }
  }, [])

  const signOut = useCallback(async () => {
    if (user?.id === DEV_USER.id) {
      setUser(null)
      setSession(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
  }, [user])

  const updateProfile = useCallback(async (updates: Partial<Omit<Profile, 'id'>>) => {
    if (!user) return { error: 'Not signed in' }
    // Dev account: update state only, no DB call
    if (user.id === DEV_USER.id) {
      setProfile((prev) => prev ? { ...prev, ...updates } : prev)
      return { error: null }
    }
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (!error) setProfile((prev) => prev ? { ...prev, ...updates } : prev)
    return { error: error?.message ?? null }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
