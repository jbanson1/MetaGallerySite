'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import styles from './signup.module.css'

type Step = 'form' | 'confirm'

export default function SignupPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()

  const [step, setStep] = useState<Step>('form')
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!username.trim()) {
      setError('Please choose a username.')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { error, needsConfirmation } = await signUp(email, password, fullName, username)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    if (needsConfirmation) {
      setStep('confirm')
    } else {
      router.push('/account')
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    router.push('/account')
  }

  // ── Email confirmation sent ──────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.confirmIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h1 className={styles.title}>Check your inbox</h1>
          <p className={styles.subtitle}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <p className={styles.confirmHint}>Didn't receive it? Check your spam folder or&nbsp;
            <button className={styles.inlineBtn} onClick={() => setStep('form')}>try again</button>.
          </p>
          <Link href="/" className={styles.backHome}>Back to home</Link>
        </div>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>Confidential Gallery</Link>

        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeTab} ${mode === 'login' ? styles.modeTabActive : ''}`}
            onClick={() => { setMode('login'); setError('') }}
          >
            Sign in
          </button>
          <button
            className={`${styles.modeTab} ${mode === 'signup' ? styles.modeTabActive : ''}`}
            onClick={() => { setMode('signup'); setError('') }}
          >
            Create account
          </button>
        </div>

        {mode === 'signup' ? (
          <>
            <p className={styles.subtitle}>Confidential Gallery is currently invite-only. Join the waitlist to be among the first to get access.</p>
            <Link href="/#waitlist" className={styles.submitBtn} style={{display: 'block', textAlign: 'center', marginTop: '1.5rem', textDecoration: 'none'}}>
              Join the Waitlist
            </Link>
            <p className={styles.legal} style={{marginTop: '1rem'}}>
              Already have an account?{' '}
              <button className={styles.inlineBtn} onClick={() => { setMode('login'); setError('') }}>Sign in</button>
            </p>
          </>
        ) : (
          <>
            <p className={styles.subtitle}>Welcome back.</p>
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="loginUsername">Username</label>
                <input
                  id="loginUsername" type="text" value={email} required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your username"
                  autoComplete="username" autoFocus
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="loginPassword">Password</label>
                <input
                  id="loginPassword" type="password" value={password} required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
