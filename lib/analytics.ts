/**
 * Analytics helper — wraps GA4 gtag calls with typed event names.
 * Vercel Analytics is handled automatically via <Analytics /> in layout.tsx.
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics'
 *   trackEvent('artwork_view', { artwork_id: 'abc', artwork_title: 'Untitled' })
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

// ── Event type catalogue ──────────────────────────────────────────────────────

export type AnalyticsEvent =
  // Artwork engagement
  | { name: 'artwork_view';        params: { artwork_id: string; artwork_title: string; artist_id?: string } }
  | { name: 'artwork_scan';        params: { artwork_id?: string; method: 'qr' | 'ar' | 'ai' } }
  | { name: 'artwork_share';       params: { artwork_id: string; platform?: string } }
  | { name: 'artwork_favourite';   params: { artwork_id: string; action: 'add' | 'remove' } }
  | { name: 'artwork_wall_compare';params: { artwork_id: string } }
  // Sign-up & conversion funnel
  | { name: 'signup_start';        params: { account_type: 'artist' | 'buyer' | 'curator' } }
  | { name: 'signup_complete';     params: { account_type: 'artist' | 'buyer' | 'curator' } }
  | { name: 'login';               params: { method: 'email' | 'google' | 'dev' } }
  | { name: 'waitlist_join';       params: { source?: string } }
  // Artist dashboard usage
  | { name: 'dashboard_tab_view';  params: { tab: string } }
  | { name: 'artwork_upload_start';params: Record<string, never> }
  | { name: 'artwork_upload_complete'; params: { artwork_id: string } }
  | { name: 'message_sent';        params: { conversation_id?: string } }
  // General
  | { name: 'page_view';           params: { page_path: string; page_title?: string } }
  | { name: 'ar_session_start';    params: { mode: 'camera' | 'photo' } }
  | { name: 'event_rsvp';          params: { event_id: string; event_title: string } }

// ── Public API ────────────────────────────────────────────────────────────────

export function trackEvent<E extends AnalyticsEvent>(
  name: E['name'],
  params: E['params'],
) {
  gtag('event', name, params)
}

/** Convenience: track a page view manually (useful for modal-style routing). */
export function trackPageView(path: string, title?: string) {
  gtag('event', 'page_view', { page_path: path, page_title: title })
}
