'use client'

import { useEffect, useState, useCallback } from 'react'
import { fetchArtworkByMarkerId, type FetchArtworkResult } from '@/lib/api/artworks'
import { logScanEvent } from '@/lib/api/analytics'
import { addToScanHistory } from '@/lib/utils/storage'
import type { ArtworkWithAssets } from '@/lib/database.types'

export type ArtworkLoadStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'error' | 'offline'

interface UseArtworkReturn {
  status: ArtworkLoadStatus
  artwork: ArtworkWithAssets | null
  errorMessage: string
  isOfflineCopy: boolean
  reload: () => void
}

let sessionId: string | null = null

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  if (!sessionId) {
    sessionId =
      sessionStorage.getItem('mg_session') ??
      Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('mg_session', sessionId)
  }
  return sessionId
}

export function useArtwork(markerId: string | undefined): UseArtworkReturn {
  const [status, setStatus] = useState<ArtworkLoadStatus>('idle')
  const [artwork, setArtwork] = useState<ArtworkWithAssets | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isOfflineCopy, setIsOfflineCopy] = useState(false)

  const load = useCallback(async () => {
    if (!markerId) return
    setStatus('loading')
    setErrorMessage('')

    const result: FetchArtworkResult = await fetchArtworkByMarkerId(markerId)

    switch (result.status) {
      case 'found': {
        setArtwork(result.artwork)
        setIsOfflineCopy(false)
        setStatus('found')
        // Save to history
        const primaryImage = result.artwork.artwork_assets.find(
          (a) => a.asset_type === 'image' && a.is_primary
        )
        addToScanHistory({
          markerId,
          artworkTitle: result.artwork.title,
          artistName: result.artwork.artist_name,
          imageUrl: primaryImage?.url,
          galleryName: result.artwork.galleries?.name,
          scannedAt: new Date().toISOString(),
        })
        // Log analytics (fire & forget)
        const markerRecord = result.artwork.markers?.[0]
        if (markerRecord) {
          logScanEvent({
            markerId,
            artworkId: result.artwork.id,
            galleryId: result.artwork.gallery_id,
            sessionId: getSessionId(),
            referrer:
              typeof document !== 'undefined' ? document.referrer || null : null,
            userAgent:
              typeof navigator !== 'undefined' ? navigator.userAgent : null,
          })
        }
        break
      }
      case 'offline': {
        setArtwork(result.artwork)
        setIsOfflineCopy(true)
        setStatus('offline')
        break
      }
      case 'not_found':
        setStatus('not_found')
        break
      case 'error':
        setErrorMessage(result.message)
        setStatus('error')
        break
    }
  }, [markerId])

  useEffect(() => {
    if (markerId) load()
  }, [markerId, load])

  return { status, artwork, errorMessage, isOfflineCopy, reload: load }
}
