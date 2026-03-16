'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Supabase puts tokens in the URL hash after email confirmation.
    // onAuthStateChange picks them up automatically — just wait for session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.replace('/account')
        } else if (event === 'TOKEN_REFRESHED') {
          router.replace('/account')
        }
      }
    )

    // Fallback: if already signed in, redirect immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/account')
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      background: 'var(--ink)',
      color: 'var(--cream)',
      fontFamily: 'var(--font-outfit, sans-serif)',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '2px solid rgba(248,246,241,0.15)',
        borderTopColor: 'var(--gold, #c9a227)',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
      }} />
      <p style={{ color: 'var(--smoke, #6b6b6b)', fontSize: '0.9rem' }}>
        Confirming your account…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
