'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`${isHomePage ? '' : 'solid'} ${menuOpen ? 'menu-open' : ''}`}>
      <Link href="/" className="logo" onClick={closeMenu}>
        Meta Gallery
      </Link>
      
      <button 
        className="menu-toggle" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
      </button>

      <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li>
            <Link href="/#features" onClick={closeMenu}>
              Features
            </Link>
          </li>
          <li>
            <Link 
              href="/marketplace" 
              className={pathname === '/marketplace' ? 'active' : ''}
              onClick={closeMenu}
            >
              Marketplace
            </Link>
          </li>
          <li>
            <Link 
              href="/events" 
              className={pathname === '/events' ? 'active' : ''}
              onClick={closeMenu}
            >
              Events
            </Link>
          </li>
        </ul>
        <button className="nav-cta" onClick={closeMenu}>Get Started</button>
      </div>
    </nav>
  )
}