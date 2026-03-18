'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './ar-preview.module.css'

type Mode = 'choose' | 'camera' | 'photo'
type FrameStyle = 'none' | 'thin' | 'gold' | 'mat'

const FRAME_LABELS: Record<FrameStyle, string> = {
  none: 'No Frame',
  thin: 'Thin Black',
  gold: 'Gold',
  mat: 'White Mat',
}

interface ArtworkOverlay {
  x: number
  y: number
  width: number
  height: number
}

function ARPreviewContent() {
  const params = useSearchParams()
  const imageUrl = params.get('image') ?? ''
  const title    = params.get('title') ?? 'Artwork'
  const artist   = params.get('artist') ?? ''

  const [mode, setMode] = useState<Mode>('choose')
  const [frame, setFrame] = useState<FrameStyle>('thin')
  const [overlay, setOverlay] = useState<ArtworkOverlay>({ x: 80, y: 120, width: 260, height: 200 })
  const [cameraError, setCameraError] = useState('')
  const [imgNaturalRatio, setImgNaturalRatio] = useState(1.33) // default 4:3
  const [showGuide, setShowGuide] = useState(true)
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null)

  const videoRef   = useRef<HTMLVideoElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Drag state ───────────────────────────────────────────────────────────
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; startOX: number; startOY: number }>({
    active: false, startX: 0, startY: 0, startOX: 0, startOY: 0,
  })
  // ── Pinch state ──────────────────────────────────────────────────────────
  const pinchRef = useRef<{ active: boolean; startDist: number; startWidth: number; startHeight: number }>({
    active: false, startDist: 0, startWidth: 0, startHeight: 0,
  })

  // ── Maintain aspect ratio when image loads ────────────────────────────────
  const handleImgLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const ratio = img.naturalWidth / img.naturalHeight
    setImgNaturalRatio(ratio)
    setOverlay(prev => ({ ...prev, height: Math.round(prev.width / ratio) }))
  }, [])

  // ── Camera ────────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setMode('camera')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('Permission') || msg.includes('NotAllowed')) {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings, or use the room photo option instead.')
      } else {
        setCameraError('Could not access camera. Try the room photo option instead.')
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  // ── Room photo ────────────────────────────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setRoomPhoto(ev.target?.result as string)
      setMode('photo')
    }
    reader.readAsDataURL(file)
  }

  // ── Mouse drag ────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startOX: overlay.x, startOY: overlay.y }
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      setOverlay(prev => ({ ...prev, x: dragRef.current.startOX + dx, y: dragRef.current.startOY + dy }))
    }
    const onMouseUp = () => { dragRef.current.active = false }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  // ── Touch drag + pinch ────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1) {
      const t = e.touches[0]
      dragRef.current = { active: true, startX: t.clientX, startY: t.clientY, startOX: overlay.x, startOY: overlay.y }
    } else if (e.touches.length === 2) {
      dragRef.current.active = false
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      pinchRef.current = { active: true, startDist: dist, startWidth: overlay.width, startHeight: overlay.height }
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1 && dragRef.current.active) {
      const t = e.touches[0]
      const dx = t.clientX - dragRef.current.startX
      const dy = t.clientY - dragRef.current.startY
      setOverlay(prev => ({ ...prev, x: dragRef.current.startOX + dx, y: dragRef.current.startOY + dy }))
    } else if (e.touches.length === 2 && pinchRef.current.active) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      const scale = dist / pinchRef.current.startDist
      const newW = Math.max(80, Math.min(600, pinchRef.current.startWidth * scale))
      setOverlay(prev => ({ ...prev, width: newW, height: newW / imgNaturalRatio }))
    }
  }

  const onTouchEnd = () => {
    dragRef.current.active = false
    pinchRef.current.active = false
  }

  // ── Scroll to resize (desktop) ────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 1.05 : 0.95
    setOverlay(prev => {
      const newW = Math.max(80, Math.min(700, prev.width * delta))
      return { ...prev, width: newW, height: newW / imgNaturalRatio }
    })
  }

  // ── Screenshot ────────────────────────────────────────────────────────────
  const handleScreenshot = async () => {
    if (mode === 'camera' && videoRef.current) {
      const canvas = document.createElement('canvas')
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0)
      // Note: cross-origin artwork image can't be drawn to canvas without CORS headers
      // So we just save the camera frame as a reminder to the user
      const url = canvas.toDataURL('image/jpeg', 0.92)
      const a = document.createElement('a')
      a.href = url
      a.download = `ar-preview-${title.replace(/\s+/g, '-')}.jpg`
      a.click()
    }
  }

  // ── Frame CSS ─────────────────────────────────────────────────────────────
  const frameStyle: React.CSSProperties = {
    none: {},
    thin: { border: '8px solid #1a1a1a', boxShadow: '4px 4px 20px rgba(0,0,0,0.6)' },
    gold: { border: '14px solid', borderImage: 'linear-gradient(135deg,#c9a200,#f0d060,#c9a200,#9a7a00) 1', boxShadow: '4px 4px 24px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,220,80,0.3)' },
    mat: { border: '32px solid #f5f0e8', outline: '3px solid #bbb', boxShadow: '4px 4px 24px rgba(0,0,0,0.6)' },
  }[frame]

  // ── Choose mode screen ────────────────────────────────────────────────────
  if (mode === 'choose') {
    return (
      <div className={styles.choosePage}>
        <Link href="javascript:history.back()" className={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>

        <div className={styles.chooseCard}>
          <div className={styles.chooseHeader}>
            <div className={styles.chooseThumb}>
              {imageUrl
                ? <img src={imageUrl} alt={title} />
                : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
            </div>
            <div>
              <h1 className={styles.chooseTitle}>{title}</h1>
              {artist && <p className={styles.chooseArtist}>{artist}</p>}
            </div>
          </div>

          <h2 className={styles.chooseSub}>How would you like to preview this piece?</h2>

          {cameraError && <p className={styles.cameraError}>{cameraError}</p>}

          <div className={styles.chooseOptions}>
            <button className={styles.chooseOption} onClick={startCamera}>
              <div className={styles.optionIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div>
                <span className={styles.optionLabel}>Live Camera</span>
                <span className={styles.optionDesc}>Point your phone at a wall and see the artwork in real time</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.optionArrow}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <button className={styles.chooseOption} onClick={() => fileInputRef.current?.click()}>
              <div className={styles.optionIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div>
                <span className={styles.optionLabel}>Upload Room Photo</span>
                <span className={styles.optionDesc}>Place the artwork on a photo of your space</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.optionArrow}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />

          <p className={styles.chooseTip}>
            Tip: For best results with camera mode, ensure good lighting and hold your device steady while facing a wall.
          </p>
        </div>
      </div>
    )
  }

  // ── AR Viewer (camera or photo) ───────────────────────────────────────────
  const background = mode === 'camera' ? undefined : roomPhoto ?? undefined

  return (
    <div
      className={styles.viewer}
      ref={containerRef}
      onWheel={onWheel}
      style={background ? { background: `url('${background}') center/cover no-repeat` } : undefined}
    >
      {/* Camera feed */}
      {mode === 'camera' && (
        <video ref={videoRef} className={styles.videoFeed} autoPlay playsInline muted />
      )}

      {/* Artwork overlay — draggable / pinch-resizable */}
      {imageUrl && (
        <div
          className={styles.artworkOverlay}
          style={{ left: overlay.x, top: overlay.y, width: overlay.width, height: overlay.height, ...frameStyle }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={imageUrl}
            alt={title}
            className={styles.artworkImg}
            onLoad={handleImgLoad}
            draggable={false}
          />
        </div>
      )}

      {/* Guide overlay */}
      {showGuide && (
        <div className={styles.guide} onClick={() => setShowGuide(false)}>
          <div className={styles.guideBox}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 9V5h4M19 9V5h-4M5 15v4h4M19 15v4h-4"/>
            </svg>
            <p><strong>Drag</strong> to position · <strong>Pinch</strong> or <strong>scroll</strong> to resize</p>
            <button className={styles.guideDismiss}>Got it</button>
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div className={styles.controls}>
        {/* Back */}
        <button className={styles.ctrlBtn} onClick={() => { stopCamera(); setMode('choose') }} title="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className={styles.ctrlCenter}>
          {/* Frame selector */}
          <div className={styles.frameSelector}>
            {(Object.keys(FRAME_LABELS) as FrameStyle[]).map(f => (
              <button
                key={f}
                className={`${styles.frameBtn} ${frame === f ? styles.frameBtnActive : ''}`}
                onClick={() => setFrame(f)}
                title={FRAME_LABELS[f]}
              >
                {FRAME_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Size controls */}
          <div className={styles.sizeControls}>
            <button className={styles.sizeBtn} onClick={() => setOverlay(p => { const w = Math.max(80, p.width * 0.9); return { ...p, width: w, height: w / imgNaturalRatio } })}>−</button>
            <span className={styles.sizeLabel}>{Math.round(overlay.width)}px</span>
            <button className={styles.sizeBtn} onClick={() => setOverlay(p => { const w = Math.min(700, p.width * 1.1); return { ...p, width: w, height: w / imgNaturalRatio } })}>+</button>
          </div>
        </div>

        {/* Screenshot */}
        {mode === 'camera' && (
          <button className={styles.ctrlBtn} onClick={handleScreenshot} title="Save screenshot">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        )}
      </div>

      {/* Info pill */}
      <div className={styles.infoPill}>
        <span className={styles.infoPillTitle}>{title}</span>
        {artist && <span className={styles.infoPillArtist}>{artist}</span>}
      </div>
    </div>
  )
}

export default function ARPreviewPage() {
  return (
    <Suspense>
      <ARPreviewContent />
    </Suspense>
  )
}
