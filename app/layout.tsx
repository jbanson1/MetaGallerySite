import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import SiteShell from '@/components/SiteShell'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import { AuthProvider } from '@/lib/auth/context'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Confidential Gallery — Every Artwork Has a Secret',
  description:
    'Transform how visitors experience your gallery with AR overlays, audio guides, and instant access to rich context.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Confidential Gallery',
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
        <Analytics />
        <ServiceWorkerRegistration />
        {/* GA4 — replace G-XXXXXXXXXX with your Measurement ID */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `}
            </Script>
          </>
        )}
        <Script
          src="//cdn.cookie-script.com/s/786352fd3658d4920c495acd299b808c.js"
          type="text/javascript"
          charSet="UTF-8"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
