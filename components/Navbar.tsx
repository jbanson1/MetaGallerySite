'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
    
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      setIsLoggedIn(loggedIn)
    }

    window.addEventListener('storage', handleStorageChange)
    
    const handleLogout = () => {
      setIsLoggedIn(false)
    }
    window.addEventListener('userLogout', handleLogout)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLogout', handleLogout)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const closeMenu = () => setMenuOpen(false)

  const isActive = (path: string) => {
    if (path === '/marketplace') {
      return pathname === '/marketplace' || pathname.startsWith('/marketplace/')
    }
    if (path === '/artists') {
      return pathname === '/artists' || pathname.startsWith('/artists/')
    }
    return pathname === path
  }

  const handleLoginClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setShowLoginModal(true)
      setPassword('')
      setLoginError('')
    }
    closeMenu()
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

  // Theme toggle button component (reused in both places)
  const ThemeToggleButton = ({ showLabel = false }: { showLabel?: boolean }) => (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      {showLabel && <span className="theme-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  )

  return (
    <>
      <nav className={`solid ${menuOpen ? 'menu-open' : ''} ${isScrolled ? 'scrolled' : ''}`}>
        {/* Full logo - hidden on mobile when scrolled */}
        <Link href="/" className="logo logo-full" onClick={closeMenu}>
          Meta Gallery
        </Link>
        
        {/* Short logo (MG) - only visible on mobile when scrolled */}
        <Link href="/" className="logo logo-short" onClick={closeMenu}>
          MG
        </Link>

        {/* Desktop theme toggle - outside menu */}
        <div className="desktop-theme-toggle">
          <ThemeToggleButton />
        </div>
        
        {/* Right-side group: scan button (mobile, logged-in) stacked above hamburger */}
        <div className="nav-right-group">
          {isLoggedIn && (
            <Link
              href="/scan"
              className={`scan-icon-btn ${isActive('/scan') ? 'active' : ''}`}
              aria-label="Scan QR code"
              onClick={closeMenu}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
              </svg>
              <span>Scan</span>
            </Link>
          )}

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
          </button>
        </div>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link
                href="/artists"
                className={isActive('/artists') ? 'active' : ''}
                onClick={closeMenu}
              >
                Artists
              </Link>
            </li>
            <li>
              <Link
                href="/marketplace"
                className={isActive('/marketplace') ? 'active' : ''}
                onClick={closeMenu}
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className={isActive('/events') ? 'active' : ''}
                onClick={closeMenu}
              >
                Events
              </Link>
            </li>
            {/* Desktop Scan link — only shown when logged in */}
            {isLoggedIn && (
              <li className="desktop-scan-link">
                <Link
                  href="/scan"
                  className={`scan-desktop-btn ${isActive('/scan') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
                  </svg>
                  Scan
                </Link>
              </li>
            )}
          </ul>
          
          {/* Mobile theme toggle - inside menu with label */}
          <div className="mobile-theme-toggle">
            <ThemeToggleButton showLabel />
          </div>
          
          {isLoggedIn ? (
            <Link href="/account" className="nav-cta" onClick={closeMenu}>
              My Account
            </Link>
          ) : (
            <button className="nav-cta" onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      </nav>

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