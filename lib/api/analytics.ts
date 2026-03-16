import { supabase } from '@/lib/supabase'

export interface ScanEventPayload {
  markerId: string
  artworkId: string
  galleryId: string
  sessionId: string
  referrer?: string | null
  userAgent?: string | null
}

/**
 * Logs a scan event to Supabase. Fire-and-forget — never throws.
 * If offline, the event is queued in localStorage for later retry.
 */
export async function logScanEvent(payload: ScanEventPayload): Promise<void> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true

  if (!isOnline) {
    queueOfflineScanEvent(payload)
    return
  }

  try {
    await supabase.from('scan_events').insert({
      marker_id: payload.markerId,
      artwork_id: payload.artworkId,
      gallery_id: payload.galleryId,
      session_id: payload.sessionId,
      referrer: payload.referrer ?? null,
      user_agent: payload.userAgent ?? null,
    })

    // Flush any queued offline events
    flushOfflineScanEvents()
  } catch {
    queueOfflineScanEvent(payload)
  }
}

const QUEUE_KEY = 'mg_scan_queue'

function queueOfflineScanEvent(payload: ScanEventPayload): void {
  if (typeof window === 'undefined') return
  try {
    const queue: ScanEventPayload[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]')
    queue.push(payload)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-20)))
  } catch {}
}

async function flushOfflineScanEvents(): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    if (!raw) return
    const queue: ScanEventPayload[] = JSON.parse(raw)
    if (!queue.length) return
    localStorage.removeItem(QUEUE_KEY)
    for (const event of queue) {
      await supabase.from('scan_events').insert({
        marker_id: event.markerId,
        artwork_id: event.artworkId,
        gallery_id: event.galleryId,
        session_id: event.sessionId,
        referrer: event.referrer ?? null,
        user_agent: event.userAgent ?? null,
      })
    }
  } catch {}
}
