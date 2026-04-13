'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import styles from './signup.module.css'
import { trackEvent } from '@/lib/analytics'

type Step = 'form' | 'confirm'

export default function SignupPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()

  const [step, setStep] = useState<Step>('form')
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [accountType, setAccountType] = useState<'artist' | 'buyer'>('buyer')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    trackEvent('signup_start', { account_type: accountType })
    const { error, needsConfirmation } = await signUp(email, password, fullName, username, accountType)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    trackEvent('signup_complete', { account_type: accountType })
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
    trackEvent('login', { method: 'email' })
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
          <p className={styles.confirmHint}>Didn&apos;t receive it? Check your spam folder or&nbsp;
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
            <p className={styles.subtitle}>Join The Confidential Gallery.</p>

            {/* Account type selector */}
            <div className={styles.accountTypeRow}>
              <button
                type="button"
                className={`${styles.accountTypeCard} ${accountType === 'buyer' ? styles.accountTypeCardActive : ''}`}
                onClick={() => setAccountType('buyer')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span className={styles.accountTypeLabel}>Buyer</span>
                <span className={styles.accountTypeDesc}>Discover &amp; collect art</span>
              </button>
              <button
                type="button"
                className={`${styles.accountTypeCard} ${accountType === 'artist' ? styles.accountTypeCardActive : ''}`}
                onClick={() => setAccountType('artist')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                <span className={styles.accountTypeLabel}>Artist</span>
                <span className={styles.accountTypeDesc}>Showcase your work</span>
              </button>
            </div>

            <form onSubmit={handleSignup} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName" type="text" value={fullName} required
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name" autoFocus
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="username">Username</label>
                <input
                  id="username" type="text" value={username} required
                  onChange={e => setUsername(e.target.value)}
                  placeholder="letters, numbers, underscores"
                  autoComplete="username"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email" type="email" value={email} required
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} value={password} required
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} required
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className={styles.legal}>
              By joining you agree to our{' '}
              <Link href="/terms">Terms of Service</Link> and{' '}
              <Link href="/privacy">Privacy Policy</Link>.
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
                <div className={styles.passwordWrapper}>
                  <input
                    id="loginPassword" type={showPassword ? 'text' : 'password'} value={password} required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p className={styles.legal} style={{marginTop: '0.25rem'}}>
              Don&apos;t have an account?{' '}
              <button className={styles.inlineBtn} onClick={() => { setMode('signup'); setError('') }}>Create one</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
