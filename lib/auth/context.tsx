'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  location: string | null
  bio: string | null
  account_type: 'artist' | 'curator'
}

// ─── DEV HARDCODED ACCOUNTS ──────────────────────────────────────────────────
const DEV_PASSWORD = 'CG2026!'

const DEV_ADMIN_USER = {
  id: 'dev-admin-000',
  email: 'admin@theconfidential.gallery',
  app_metadata: {},
  user_metadata: { full_name: 'Admin' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User
const DEV_ADMIN_PROFILE: Profile = {
  id: 'dev-admin-000',
  full_name: 'Admin',
  username: 'Admin',
  avatar_url: null,
  location: null,
  bio: null,
  account_type: 'curator',
}

const DEV_CURATOR_USER = {
  id: 'dev-curator-001',
  email: 'curator@theconfidential.gallery',
  app_metadata: {},
  user_metadata: { full_name: 'Dev Curator' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User
const DEV_CURATOR_PROFILE: Profile = {
  id: 'dev-curator-001',
  full_name: 'Dev Curator',
  username: 'DevCurator',
  avatar_url: null,
  location: 'London, UK',
  bio: 'Development curator account for testing the platform.',
  account_type: 'curator',
}

const DEV_ARTIST_USER = {
  id: 'dev-artist-001',
  email: 'artist@theconfidential.gallery',
  app_metadata: {},
  user_metadata: { full_name: 'Dev Artist' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User
const DEV_ARTIST_PROFILE: Profile = {
  id: 'dev-artist-001',
  full_name: 'Dev Artist',
  username: 'DevArtist',
  avatar_url: null,
  location: 'Paris, France',
  bio: 'Development artist account for testing the platform.',
  account_type: 'artist',
}

const DEV_ACCOUNTS: Record<string, { user: User; profile: Profile }> = {
  Admin:      { user: DEV_ADMIN_USER,   profile: DEV_ADMIN_PROFILE },
  DevCurator: { user: DEV_CURATOR_USER, profile: DEV_CURATOR_PROFILE },
  DevArtist:  { user: DEV_ARTIST_USER,  profile: DEV_ARTIST_PROFILE },
}
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string, username: string, accountType?: 'artist' | 'curator') => Promise<{ error: string | null; needsConfirmation: boolean }>
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

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

  const signIn = useCallback(async (username: string, password: string) => {
    // Dev hardcoded bypass
    if (password === DEV_PASSWORD && DEV_ACCOUNTS[username]) {
      const { user: devUser, profile: devProfile } = DEV_ACCOUNTS[username]
      setUser(devUser)
      setProfile(devProfile)
      setSession({ user: devUser } as unknown as Session)
      return { error: null }
    }
    const { data: email, error: lookupError } = await supabase.rpc('get_email_by_username', { p_username: username })
    if (lookupError || !email) return { error: 'Username not found.' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    username: string,
    accountType: 'artist' | 'curator' = 'curator'
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username, account_type: accountType },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    })
    if (error) return { error: error.message, needsConfirmation: false }
    const needsConfirmation = !!data.user && !data.session
    return { error: null, needsConfirmation }
  }, [])

  const signOut = useCallback(async () => {
    const isDevAccount = user && Object.values(DEV_ACCOUNTS).some(a => a.user.id === user.id)
    if (isDevAccount) {
      setUser(null)
      setSession(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
  }, [user])

  const updateProfile = useCallback(async (updates: Partial<Omit<Profile, 'id'>>) => {
    if (!user) return { error: 'Not signed in' }
    const isDevAccount = Object.values(DEV_ACCOUNTS).some(a => a.user.id === user.id)
    if (isDevAccount) {
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
