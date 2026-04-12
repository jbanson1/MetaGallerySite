'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'

function CookieSettingsLink() {
  function reopenBanner() {
    try { localStorage.removeItem('cg_cookie_consent') } catch { /* noop */ }
    window.location.reload()
  }
  return (
    <button onClick={reopenBanner} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',padding:0,font:'inherit',textDecoration:'inherit'}}>
      Cookie Settings
    </button>
  )
}

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">The Confidential Gallery</div>
        <ul className="footer-links">
          <li><Link href="/privacy">Privacy</Link></li>
          <li><Link href="/terms">Terms</Link></li>
          <li><Link href="/cookies">Cookies</Link></li>
          <li><CookieSettingsLink /></li>
          <li><Link href="/events">Events</Link></li>
          <li><a href="/#waitlist">Contact</a></li>
          <li>
            {user
              ? <Link href="/account">My Account</Link>
              : <Link href="/signup">Sign in</Link>
            }
          </li>
        </ul>
        <div className="footer-copy">© 2026 The Confidential Gallery. All rights reserved. Registered in England & Wales.</div>
      </div>
    </footer>
  )
}
