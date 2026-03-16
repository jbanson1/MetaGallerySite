'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useArtwork } from '@/lib/hooks/useArtwork'
import { useOffline } from '@/lib/hooks/useOffline'
import styles from './scan.module.css'

export default function ScanDetailPage() {
  const { markerId } = useParams<{ markerId: string }>()
  const { status, artwork, errorMessage, isOfflineCopy, reload } = useArtwork(markerId)
  const { isOffline } = useOffline()

  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [activeTab, setActiveTab] = useState<'about' | 'details'>('about')
  const audioRef = useRef<HTMLAudioElement>(null)

  // Audio controls
  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    isPlaying ? audio.pause() : audio.play()
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
  if (status === 'idle' || status === 'loading') {
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
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 className={styles.stateHeading}>Marker not found</h1>
        <p className={styles.stateText}>
          <code className={styles.markerCode}>{markerId}</code> doesn't match any active artwork.
        </p>
        <Link href="/scan" className={styles.stateLink}>Scan another</Link>
      </div>
    )
  }

  // ─── ERROR ──────────────────────────────────────────────────────────────────
  if (status === 'error' || !artwork) {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.stateIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h1 className={styles.stateHeading}>Something went wrong</h1>
        <p className={styles.stateText}>{errorMessage || "We couldn't load this artwork."}</p>
        <button className={styles.stateLink} onClick={reload}>Try again</button>
      </div>
    )
  }

  // ─── ARTWORK FOUND (including offline copy) ─────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Offline / cached banner */}
      {(isOfflineCopy || isOffline) && (
        <div className={styles.offlineBanner}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
          </svg>
          {isOfflineCopy ? 'Showing cached version' : 'You are offline'}
        </div>
      )}

      {/* Gallery header */}
      <header className={styles.galleryHeader}>
        <div className={styles.galleryInfo}>
          {artwork.galleries?.logo_url && (
            <img src={artwork.galleries.logo_url} alt={artwork.galleries.name} className={styles.galleryLogo} />
          )}
          <span className={styles.galleryName}>{artwork.galleries?.name}</span>
        </div>
        <div className={styles.markerBadge}>{markerId}</div>
      </header>

      {/* Artwork image */}
      <div className={styles.imageWrapper}>
        {primaryImage ? (
          <img src={primaryImage.url} alt={artwork.title} className={styles.artworkImage} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
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
            <p className={styles.medium}>
              {artwork.medium}{artwork.dimensions ? `, ${artwork.dimensions}` : ''}
            </p>
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
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>
            <div className={styles.audioTrack}>
              <div className={styles.audioLabel}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
                </svg>
                Audio guide
              </div>
              <div className={styles.progressRow}>
                <input
                  type="range" min="0" max="100" value={audioProgress}
                  onChange={handleSeek} className={styles.progressBar}
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
            {artwork.description
              ? <p className={styles.description}>{artwork.description}</p>
              : <p className={styles.descriptionEmpty}>No description available.</p>
            }
          </div>
        )}

        {activeTab === 'details' && (
          <div className={styles.tabContent}>
            <dl className={styles.detailList}>
              {artwork.artist_name && <><dt>Artist</dt><dd>{artwork.artist_name}</dd></>}
              {artwork.year && <><dt>Year</dt><dd>{artwork.year}</dd></>}
              {artwork.medium && <><dt>Medium</dt><dd>{artwork.medium}</dd></>}
              {artwork.dimensions && <><dt>Dimensions</dt><dd>{artwork.dimensions}</dd></>}
              {artwork.galleries?.name && <><dt>Gallery</dt><dd>{artwork.galleries.name}</dd></>}
              <dt>Reference</dt><dd className={styles.markerRef}>{markerId}</dd>
            </dl>

            {artwork.is_for_sale && artwork.price && (
              <div className={styles.forSale}>
                <div className={styles.saleInfo}>
                  <span className={styles.saleLabel}>Available for purchase</span>
                  <span className={styles.salePrice}>
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: artwork.currency,
                    }).format(artwork.price)}
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
        <Link href="/scan" className={styles.footerBrand}>
          <span className={styles.footerLogo}>MG</span>
          <span>Scan another</span>
        </Link>
        <span className={styles.footerTagline}>AR Art Guides</span>
      </footer>
    </div>
  )
}
