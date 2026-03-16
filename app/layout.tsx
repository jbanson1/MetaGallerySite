import type { Metadata, Viewport } from 'next'
import './globals.css'
import SiteShell from '@/components/SiteShell'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import { AuthProvider } from '@/lib/auth/context'

export const metadata: Metadata = {
  title: 'Meta Gallery — AR Art Guide',
  description:
    'Transform how visitors experience your gallery with AR overlays, audio guides, and instant access to rich context.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Meta Gallery',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
