'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)

    // Listen for login/logout events
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true')
    }
    
    const handleLogout = () => {
      setIsLoggedIn(false)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userLogout', handleLogout)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLogout', handleLogout)
    }
  }, [])

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setShowLoginModal(true)
      setPassword('')
      setLoginError('')
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'MG2026!') {
      setIsLoggedIn(true)
      localStorage.setItem('isLoggedIn', 'true')
      setShowLoginModal(false)
      setPassword('')
      setLoginError('')
      window.location.href = '/account'
    } else {
      setLoginError('Incorrect password')
      setPassword('')
    }
  }

  const closeModal = () => {
    setShowLoginModal(false)
    setPassword('')
    setLoginError('')
  }

  return (
    <>
      <footer>
        <div className="footer-content">
          <div className="footer-logo">Meta Gallery</div>
          <ul className="footer-links">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><a href="/#waitlist">Contact</a></li>
            <li>
              {isLoggedIn ? (
                <Link href="/account">My Account</Link>
              ) : (
                <a href="#" onClick={handleAccountClick}>My Account</a>
              )}
            </li>
          </ul>
          <div className="footer-copy">© 2026 Meta Gallery. All rights reserved.</div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="login-modal-overlay" onClick={closeModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="login-modal-close" onClick={closeModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <h2>Login</h2>
            <p>Enter your password to access your account</p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
              />
              {loginError && <span className="login-error">{loginError}</span>}
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
