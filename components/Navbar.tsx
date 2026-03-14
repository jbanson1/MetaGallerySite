'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <nav className={isHomePage ? '' : 'solid'}>
      <Link href="/" className="logo">
        Meta Gallery
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/#features">
            Features
          </Link>
        </li>
        <li>
          <Link href="/marketplace" className={pathname === '/marketplace' ? 'active' : ''}>
            Marketplace
          </Link>
        </li>
        <li>
          <Link href="/events" className={pathname === '/events' ? 'active' : ''}>
            Events
          </Link>
        </li>
      </ul>
      <button className="nav-cta">Get Started</button>
    </nav>
  )
}
