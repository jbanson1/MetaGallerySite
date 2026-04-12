'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import CookieConsent from './CookieConsent'

// Routes that render their own full-screen layout
const SHELL_EXCLUDED = ['/scan', '/admin']

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showShell = !SHELL_EXCLUDED.some((prefix) => pathname.startsWith(prefix))

  return (
    <>
      {showShell && <Navbar />}
      {children}
      {showShell && <Footer />}
      <CookieConsent />
    </>
  )
}
