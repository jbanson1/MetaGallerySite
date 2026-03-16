'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { ArtworkWithAssets } from '@/lib/database.types'
import styles from './scan.module.css'

type ScanStatus = 'loading' | 'found' | 'not_found' | 'error'

export default function ScanPage() {
  const { markerId } = useParams<{ markerId: string }>()
  const [status, setStatus] = useState<ScanStatus>('loading')
  const [artwork, setArtwork] = useState<ArtworkWithAssets | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [activeTab, setActiveTab] = useState<'about' | 'details'>('about')
  const audioRef = useRef<HTMLAudioElement>(null)
  const sessionId = useRef<string>(
    typeof window !== 'undefined'
      ? sessionStorage.getItem('mg_session') ?? generateSessionId()
      : ''
  )

  function generateSessionId() {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    if (typeof window !== 'undefined') sessionStorage.setItem('mg_session', id)
    return id
  }

  // Fetch artwork by marker ID
  useEffect(() => {
    if (!markerId) return

    async function fetchArtwork() {
      const { data: marker, error: markerError } = await supabase
        .from('markers')
        .select('artwork_id, gallery_id')
        .eq('marker_id', markerId)
        .eq('is_active', true)
        .single()

      if (markerError || !marker) {
        setStatus('not_found')
        return
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
        setStatus('error')
        return
      }

      setArtwork(artworkData as ArtworkWithAssets)
      setStatus('found')

      // Log scan event (fire and forget)
      logScanEvent(markerId, marker.artwork_id, marker.gallery_id)
    }

    fetchArtwork()
  }, [markerId])

  async function logScanEvent(mId: string, artworkId: string, galleryId: string) {
    await supabase.from('scan_events').insert({
      marker_id: mId,
      artwork_id: artworkId,
      gallery_id: galleryId,
      session_id: sessionId.current,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    })
  }

  // Audio controls
  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (!audio) return
    setAudioProgress((audio.currentTime / audio.duration) * 100)
  }

  function handleLoadedMetadata() {
    if (audioRef.current) setAudioDuration(audioRef.current.duration)
  }

  function handleEnded() {
    setIsPlaying(false)
    setAudioProgress(0)
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const pct = Number(e.target.value)
    audio.currentTime = (pct / 100) * audio.duration
    setAudioProgress(pct)
  }

  function formatTime(seconds: number) {
    if (!seconds || isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const primaryImage = artwork?.artwork_assets.find(
    (a) => a.asset_type === 'image' && a.is_primary
  ) ?? artwork?.artwork_assets.find((a) => a.asset_type === 'image')

  const audioGuide = artwork?.artwork_assets.find((a) => a.asset_type === 'audio')

  // ─── LOADING ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.spinner} />
        <p className={styles.stateText}>Looking up artwork…</p>
      </div>
    )
  }

  // ─── NOT FOUND ──────────────────────────────────────────────────────────────
  if (status === 'not_found') {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.stateIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className={styles.stateHeading}>Marker not found</h1>
        <p className={styles.stateText}>The marker <code className={styles.markerCode}>{markerId}</code> doesn't match any active artwork.</p>
        <Link href="/" className={styles.stateLink}>Return home</Link>
      </div>
    )
  }

  // ─── ERROR ──────────────────────────────────────────────────────────────────
  if (status === 'error' || !artwork) {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.stateIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className={styles.stateHeading}>Something went wrong</h1>
        <p className={styles.stateText}>We couldn't load this artwork. Please try again.</p>
        <button className={styles.stateLink} onClick={() => window.location.reload()}>Try again</button>
      </div>
    )
  }

  // ─── ARTWORK FOUND ──────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Gallery header */}
      <header className={styles.galleryHeader}>
        <div className={styles.galleryInfo}>
          {artwork.galleries.logo_url && (
            <img src={artwork.galleries.logo_url} alt={artwork.galleries.name} className={styles.galleryLogo} />
          )}
          <span className={styles.galleryName}>{artwork.galleries.name}</span>
        </div>
        <div className={styles.markerBadge}>{markerId}</div>
      </header>

      {/* Artwork image */}
      <div className={styles.imageWrapper}>
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={artwork.title}
            className={styles.artworkImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Artwork info */}
      <div className={styles.content}>
        {/* Title block */}
        <div className={styles.titleBlock}>
          <h1 className={styles.artworkTitle}>{artwork.title}</h1>
          <div className={styles.artworkMeta}>
            <span className={styles.artistName}>{artwork.artist_name}</span>
            {artwork.year && <span className={styles.metaDot}>·</span>}
            {artwork.year && <span className={styles.artworkYear}>{artwork.year}</span>}
          </div>
          {artwork.medium && (
            <p className={styles.medium}>{artwork.medium}{artwork.dimensions ? `, ${artwork.dimensions}` : ''}</p>
          )}
        </div>

        {/* Audio guide */}
        {audioGuide && (
          <div className={styles.audioPlayer}>
            <audio
              ref={audioRef}
              src={audioGuide.url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
            />
            <button
              className={`${styles.playBtn} ${isPlaying ? styles.playing : ''}`}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause audio guide' : 'Play audio guide'}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            <div className={styles.audioTrack}>
              <div className={styles.audioLabel}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                </svg>
                Audio guide
              </div>
              <div className={styles.progressRow}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={handleSeek}
                  className={styles.progressBar}
                  aria-label="Audio progress"
                />
                <span className={styles.audioTime}>
                  {formatTime((audioProgress / 100) * audioDuration)} / {formatTime(audioDuration)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'about' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>

        {activeTab === 'about' && (
          <div className={styles.tabContent}>
            {artwork.description ? (
              <p className={styles.description}>{artwork.description}</p>
            ) : (
              <p className={styles.descriptionEmpty}>No description available.</p>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className={styles.tabContent}>
            <dl className={styles.detailList}>
              {artwork.artist_name && <><dt>Artist</dt><dd>{artwork.artist_name}</dd></>}
              {artwork.year && <><dt>Year</dt><dd>{artwork.year}</dd></>}
              {artwork.medium && <><dt>Medium</dt><dd>{artwork.medium}</dd></>}
              {artwork.dimensions && <><dt>Dimensions</dt><dd>{artwork.dimensions}</dd></>}
              {artwork.galleries.name && <><dt>Gallery</dt><dd>{artwork.galleries.name}</dd></>}
              <dt>Reference</dt><dd className={styles.markerRef}>{markerId}</dd>
            </dl>

            {artwork.is_for_sale && artwork.price && (
              <div className={styles.forSale}>
                <div className={styles.saleInfo}>
                  <span className={styles.saleLabel}>Available for purchase</span>
                  <span className={styles.salePrice}>
                    {new Intl.NumberFormat('en-GB', { style: 'currency', currency: artwork.currency }).format(artwork.price)}
                  </span>
                </div>
                <a
                  href={`mailto:hello@metagallery.art?subject=Enquiry: ${encodeURIComponent(artwork.title)}&body=I'm interested in purchasing "${artwork.title}" by ${artwork.artist_name} (Ref: ${markerId}).`}
                  className={styles.enquireBtn}
                >
                  Enquire
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.scanFooter}>
        <Link href="/" className={styles.footerBrand}>
          <span className={styles.footerLogo}>MG</span>
          <span>Meta Gallery</span>
        </Link>
        <span className={styles.footerTagline}>AR Art Guides</span>
      </footer>
    </div>
  )
}
