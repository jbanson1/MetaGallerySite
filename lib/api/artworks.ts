import { supabase } from '@/lib/supabase'
import type { ArtworkWithAssets } from '@/lib/database.types'

const ARTWORK_CACHE_PREFIX = 'mg_artwork_'
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour

interface CachedArtwork {
  data: ArtworkWithAssets
  cachedAt: number
}

function cacheKey(markerId: string) {
  return `${ARTWORK_CACHE_PREFIX}${markerId}`
}

function readFromCache(markerId: string): ArtworkWithAssets | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(cacheKey(markerId))
    if (!raw) return null
    const cached: CachedArtwork = JSON.parse(raw)
    if (Date.now() - cached.cachedAt > CACHE_TTL_MS) return null
    return cached.data
  } catch {
    return null
  }
}

function writeToCache(markerId: string, artwork: ArtworkWithAssets): void {
  if (typeof window === 'undefined') return
  try {
    const cached: CachedArtwork = { data: artwork, cachedAt: Date.now() }
    localStorage.setItem(cacheKey(markerId), JSON.stringify(cached))
  } catch {
    // Storage quota — silently fail
  }
}

export type FetchArtworkResult =
  | { status: 'found'; artwork: ArtworkWithAssets; fromCache: boolean }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
  | { status: 'offline'; artwork: ArtworkWithAssets }

export async function fetchArtworkByMarkerId(
  markerId: string
): Promise<FetchArtworkResult> {
  // Try cache first when offline
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  const cached = readFromCache(markerId)

  if (!isOnline) {
    if (cached) return { status: 'offline', artwork: cached }
    return { status: 'error', message: 'No internet connection and no cached data available.' }
  }

  try {
    const { data: marker, error: markerError } = await supabase
      .from('markers')
      .select('artwork_id, gallery_id')
      .eq('marker_id', markerId)
      .eq('is_active', true)
      .single()

    if (markerError || !marker) {
      return { status: 'not_found' }
    }

    const { data: artworkData, error: artworkError } = await supabase
      .from('artworks')
      .select(`
        *,
        artwork_assets(*),
        markers(id, marker_id, label),
        galleries(id, name, logo_url)
      `)
      .eq('id', marker.artwork_id)
      .eq('is_active', true)
      .single()

    if (artworkError || !artworkData) {
      // Fall back to cache if network query fails
      if (cached) return { status: 'offline', artwork: cached }
      return { status: 'error', message: artworkError?.message ?? 'Failed to load artwork.' }
    }

    const artwork = artworkData as ArtworkWithAssets
    writeToCache(markerId, artwork)
    return { status: 'found', artwork, fromCache: false }
  } catch (err) {
    if (cached) return { status: 'offline', artwork: cached }
    return { status: 'error', message: 'Network error. Please try again.' }
  }
}
