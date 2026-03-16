'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">Confidential Gallery</div>
        <ul className="footer-links">
          <li><Link href="/privacy">Privacy</Link></li>
          <li><Link href="/terms">Terms</Link></li>
          <li><Link href="/events">Events</Link></li>
          <li><a href="/#waitlist">Contact</a></li>
          <li>
            {user
              ? <Link href="/account">My Account</Link>
              : <Link href="/signup">Sign in</Link>
            }
          </li>
        </ul>
        <div className="footer-copy">© 2026 Confidential Gallery. All rights reserved.</div>
      </div>
    </footer>
  )
}
