'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import styles from './artwork.module.css'

interface ArtworkAsset {
  asset_type: string
  url: string
  is_primary: boolean
  sort_order: number
}

interface ProcessMedia {
  id: string
  media_type: 'image' | 'video'
  url: string
  thumbnail_url: string | null
  caption: string | null
  sort_order: number
}

interface Artwork {
  id: string
  title: string
  artist_name: string
  year: number | null
  medium: string | null
  dimensions: string | null
  description: string | null
  price: number | null
  currency: string
  is_for_sale: boolean
  artwork_assets: ArtworkAsset[]
  galleries: { name: string; logo_url: string | null } | null
}

export default function MarketplaceArtworkPage() {
  const { artworkId } = useParams<{ artworkId: string }>()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [processMedia, setProcessMedia] = useState<ProcessMedia[]>([])
  const [status, setStatus] = useState<'loading' | 'found' | 'not_found' | 'error'>('loading')
  const [lightboxItem, setLightboxItem] = useState<ProcessMedia | null>(null)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  useEffect(() => {
    if (!artworkId) return
    supabase
      .from('artworks')
      .select(`
        id, title, artist_name, year, medium, dimensions, description,
        price, currency, is_for_sale,
        artwork_assets(asset_type, url, is_primary, sort_order),
        galleries(name, logo_url)
      `)
      .eq('id', artworkId)
      .eq('is_active', true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setStatus(error?.code === 'PGRST116' ? 'not_found' : 'error')
          return
        }
        setArtwork(data as unknown as Artwork)
        setStatus('found')

        // Fetch process media
        supabase
          .from('artwork_process_media')
          .select('id, media_type, url, thumbnail_url, caption, sort_order')
          .eq('artwork_id', artworkId)
          .order('sort_order', { ascending: true })
          .then(({ data: media }) => {
            if (media) setProcessMedia(media as ProcessMedia[])
          })
      })
  }, [artworkId])

  function getPrimaryImage(assets: ArtworkAsset[]) {
    return (
      assets.find((a) => a.asset_type === 'image' && a.is_primary)?.url ??
      assets.find((a) => a.asset_type === 'image')?.url ??
      null
    )
  }

  function formatPrice(price: number, currency: string) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(price)
  }

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.spinner} />
        <p>Loading artwork…</p>
      </div>
    )
  }

  // ─── Not found ──────────────────────────────────────────────────────────────
  if (status === 'not_found' || !artwork) {
    return (
      <div className={styles.stateScreen}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h1>Artwork not found</h1>
        <Link href="/marketplace" className={styles.stateLink}>Back to marketplace</Link>
      </div>
    )
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className={styles.stateScreen}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h1>Something went wrong</h1>
        <Link href="/marketplace" className={styles.stateLink}>Back to marketplace</Link>
      </div>
    )
  }

  const primaryImage = getPrimaryImage(artwork.artwork_assets)

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/marketplace" className={styles.breadcrumbLink}>Marketplace</Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className={styles.breadcrumbCurrent}>{artwork.title}</span>
      </nav>

      {/* Main layout: image + details */}
      <div className={styles.artworkLayout}>
        {/* Left: image */}
        <div className={styles.imageColumn}>
          {primaryImage ? (
            <img src={primaryImage} alt={artwork.title} className={styles.artworkImage} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}
          {artwork.galleries && (
            <div className={styles.galleryTag}>
              {artwork.galleries.logo_url && (
                <img src={artwork.galleries.logo_url} alt={artwork.galleries.name} className={styles.galleryLogo} />
              )}
              <span>{artwork.galleries.name}</span>
            </div>
          )}
        </div>

        {/* Right: details */}
        <div className={styles.detailsColumn}>
          <h1 className={styles.title}>{artwork.title}</h1>
          <p className={styles.artist}>{artwork.artist_name}</p>

          {(artwork.year || artwork.medium || artwork.dimensions) && (
            <p className={styles.meta}>
              {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(' · ')}
            </p>
          )}

          {artwork.description && (
            <p className={styles.description}>{artwork.description}</p>
          )}

          {/* View in Your Space — AR preview */}
          {primaryImage && (
            <Link
              href={`/ar-preview?image=${encodeURIComponent(primaryImage)}&title=${encodeURIComponent(artwork.title)}&artist=${encodeURIComponent(artwork.artist_name)}&autostart=camera`}
              className={styles.arBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 9V5h4M19 9V5h-4M5 15v4h4M19 15v4h-4"/>
              </svg>
              View in Your Space
            </Link>
          )}

          {artwork.is_for_sale && artwork.price != null && (
            <div className={styles.purchaseBox}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Price</span>
                <span className={styles.price}>{formatPrice(artwork.price, artwork.currency)}</span>
              </div>
              <a
                href={`mailto:hello@theconfidential.gallery?subject=Purchase Enquiry: ${encodeURIComponent(artwork.title)}&body=I'm interested in purchasing "${artwork.title}" by ${artwork.artist_name}.`}
                className={styles.enquireBtn}
              >
                Enquire to Purchase
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <p className={styles.enquireNote}>We'll connect you directly with the gallery or artist.</p>
            </div>
          )}
        </div>
      </div>

      {/* Making Of — process media */}
      {processMedia.length > 0 && (
        <section className={styles.makingOf}>
          <div className={styles.makingOfHeader}>
            <h2 className={styles.makingOfTitle}>The Making Of</h2>
            <p className={styles.makingOfSubtitle}>
              Behind the scenes with {artwork.artist_name}
            </p>
          </div>

          {/* Featured large item */}
          <div className={styles.featuredMedia} onClick={() => setLightboxItem(processMedia[activeMediaIndex])}>
            {processMedia[activeMediaIndex].media_type === 'video' ? (
              <div className={styles.featuredVideoWrap}>
                <img
                  src={processMedia[activeMediaIndex].thumbnail_url ?? processMedia[activeMediaIndex].url}
                  alt={processMedia[activeMediaIndex].caption ?? ''}
                  className={styles.featuredImage}
                />
                <div className={styles.featuredPlayBtn}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            ) : (
              <img
                src={processMedia[activeMediaIndex].url}
                alt={processMedia[activeMediaIndex].caption ?? ''}
                className={styles.featuredImage}
              />
            )}
            {processMedia[activeMediaIndex].caption && (
              <p className={styles.featuredCaption}>{processMedia[activeMediaIndex].caption}</p>
            )}
            <div className={styles.expandHint}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
              Click to expand
            </div>
          </div>

          {/* Thumbnails strip */}
          {processMedia.length > 1 && (
            <div className={styles.thumbStrip}>
              {processMedia.map((item, i) => (
                <button
                  key={item.id}
                  className={`${styles.thumb} ${i === activeMediaIndex ? styles.thumbActive : ''}`}
                  onClick={() => setActiveMediaIndex(i)}
                  aria-label={item.caption ?? `Process media ${i + 1}`}
                >
                  <img
                    src={item.media_type === 'video' ? (item.thumbnail_url ?? item.url) : item.url}
                    alt={item.caption ?? ''}
                    className={styles.thumbImg}
                  />
                  {item.media_type === 'video' && (
                    <div className={styles.thumbVideoIcon}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxItem(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightboxItem(null)} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            {lightboxItem.media_type === 'video' ? (
              <video
                src={lightboxItem.url}
                controls
                autoPlay
                className={styles.lightboxMedia}
                poster={lightboxItem.thumbnail_url ?? undefined}
                ref={(el) => { videoRefs.current[lightboxItem.id] = el }}
              />
            ) : (
              <img src={lightboxItem.url} alt={lightboxItem.caption ?? ''} className={styles.lightboxMedia} />
            )}
            {lightboxItem.caption && (
              <p className={styles.lightboxCaption}>{lightboxItem.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
