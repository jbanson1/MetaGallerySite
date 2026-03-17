'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useScanner } from '@/lib/hooks/useScanner'
import { extractMarkerId } from '@/lib/utils/marker'
import { getScanHistory } from '@/lib/utils/storage'
import type { ScanHistoryItem } from '@/lib/utils/storage'
import styles from './scanner.module.css'

const SCANNER_ELEMENT_ID = 'cg-qr-reader'

type ScanMode = 'qr' | 'painting'
type IdentifyStatus = 'idle' | 'capturing' | 'identifying' | 'found' | 'not-found' | 'error'

export default function ScanPage() {
  const router = useRouter()
  const [hasStarted, setHasStarted] = useState(false)
  const [scanResult, setScanResult] = useState<'success' | 'invalid' | null>(null)
  const [history, setHistory] = useState<ScanHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [mode, setMode] = useState<ScanMode>('qr')
  const [identifyStatus, setIdentifyStatus] = useState<IdentifyStatus>('idle')
  const [identifyResult, setIdentifyResult] = useState<{ title: string | null; artist: string | null } | null>(null)
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setHistory(getScanHistory())
  }, [])

  const handleScan = useCallback(
    (decodedText: string) => {
      if (scanResult || mode !== 'qr') return

      const markerId = extractMarkerId(decodedText)
      if (markerId) {
        pause()
        setScanResult('success')
        resultTimeoutRef.current = setTimeout(() => {
          router.push(`/scan/${markerId}`)
        }, 600)
      } else {
        setScanResult('invalid')
        resultTimeoutRef.current = setTimeout(() => setScanResult(null), 2000)
      }
    },
    [scanResult, mode, router] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const { status, errorMessage, start, stop, pause, resume } = useScanner({
    elementId: SCANNER_ELEMENT_ID,
    onScan: handleScan,
  })

  async function handleStart() {
    setHasStarted(true)
    setScanResult(null)
    setIdentifyStatus('idle')
    await start()
  }

  async function handleStop() {
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current)
    await stop()
    setHasStarted(false)
    setScanResult(null)
    setIdentifyStatus('idle')
  }

  useEffect(() => {
    return () => {
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current)
      stop()
    }
  }, [stop])

  // Switch modes: reset identify state, resume QR scanning if switching back
  function handleModeSwitch(next: ScanMode) {
    setMode(next)
    setIdentifyStatus('idle')
    setIdentifyResult(null)
    if (next === 'qr') {
      resume()
    } else {
      // Pause auto QR detection when in painting mode to avoid false triggers
      pause()
    }
  }

  async function handleIdentify() {
    const videoEl = document.querySelector<HTMLVideoElement>(`#${SCANNER_ELEMENT_ID} video`)
    if (!videoEl) return

    setIdentifyStatus('capturing')
    setIdentifyResult(null)

    // Capture the current video frame to a canvas
    const canvas = document.createElement('canvas')
    canvas.width = videoEl.videoWidth || 640
    canvas.height = videoEl.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    const base64 = canvas.toDataURL('image/jpeg', 0.85)

    setIdentifyStatus('identifying')

    try {
      const res = await fetch('/api/identify-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()

      if (data.found && data.markerId) {
        setIdentifyStatus('found')
        resultTimeoutRef.current = setTimeout(() => {
          router.push(`/scan/${data.markerId}`)
        }, 800)
      } else if (!data.found && data.title) {
        setIdentifyStatus('not-found')
        setIdentifyResult({ title: data.title, artist: data.artist })
      } else {
        setIdentifyStatus('error')
      }
    } catch {
      setIdentifyStatus('error')
    }
  }

  const isScanning = status === 'scanning' || status === 'paused'
  const isLoading = status === 'requesting'

  return (
    <div className={styles.page}>
      {/* ── Camera viewfinder ── */}
      <div className={`${styles.viewfinder} ${!hasStarted ? styles.viewfinderIdle : ''}`}>
        {/* html5-qrcode mounts the video stream into this div */}
        <div id={SCANNER_ELEMENT_ID} className={styles.qrReader} />

        {/* Overlay UI on top of camera */}
        <div className={styles.overlay}>
          {/* Top bar */}
          <div className={styles.topBar}>
            <Link href="/" className={styles.closeBtn} onClick={() => stop()} aria-label="Close scanner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </Link>
            <span className={styles.topBarTitle}>
              {isScanning && mode === 'qr' ? 'Scanning…' : isScanning && mode === 'painting' ? 'Identify Painting' : 'Confidential Gallery Scanner'}
            </span>
            <button
              className={styles.historyToggleBtn}
              onClick={() => setShowHistory((v) => !v)}
              aria-label="Recent scans"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </button>
          </div>

          {/* Scan frame — shown in QR mode while scanning */}
          {isScanning && mode === 'qr' && (
            <div className={`${styles.frame} ${scanResult === 'success' ? styles.frameSuccess : ''} ${scanResult === 'invalid' ? styles.frameInvalid : ''}`}>
              <span className={`${styles.corner} ${styles.tl}`} />
              <span className={`${styles.corner} ${styles.tr}`} />
              <span className={`${styles.corner} ${styles.bl}`} />
              <span className={`${styles.corner} ${styles.br}`} />
              {!scanResult && <span className={styles.scanLine} />}
            </div>
          )}

          {/* Painting frame — shown in painting mode while scanning */}
          {isScanning && mode === 'painting' && (
            <div className={styles.paintingFrame}>
              <span className={`${styles.corner} ${styles.tl} ${identifyStatus === 'found' ? styles.cornerSuccess : ''}`} />
              <span className={`${styles.corner} ${styles.tr} ${identifyStatus === 'found' ? styles.cornerSuccess : ''}`} />
              <span className={`${styles.corner} ${styles.bl} ${identifyStatus === 'found' ? styles.cornerSuccess : ''}`} />
              <span className={`${styles.corner} ${styles.br} ${identifyStatus === 'found' ? styles.cornerSuccess : ''}`} />
            </div>
          )}

          {/* Bottom panel */}
          <div className={styles.bottomPanel}>
            {/* Idle — prompt to start */}
            {!hasStarted && status !== 'error' && (
              <div className={styles.startPrompt}>
                <div className={styles.promptIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                    <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
                  </svg>
                </div>
                <p className={styles.promptText}>
                  Point your camera at a QR code or painting
                </p>
                <button className={styles.startBtn} onClick={handleStart}>
                  Open Camera
                </button>
                <p className={styles.promptHint}>
                  You can also scan QR codes directly with your phone camera — the link opens here automatically.
                </p>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className={styles.statusMsg}>
                <span className={styles.spinnerSmall} />
                Requesting camera…
              </div>
            )}

            {/* Mode toggle — visible while scanning */}
            {isScanning && (
              <div className={styles.modeTabs}>
                <button
                  className={`${styles.modeTab} ${mode === 'qr' ? styles.modeTabActive : ''}`}
                  onClick={() => handleModeSwitch('qr')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
                  </svg>
                  QR Code
                </button>
                <button
                  className={`${styles.modeTab} ${mode === 'painting' ? styles.modeTabActive : ''}`}
                  onClick={() => handleModeSwitch('painting')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Painting
                </button>
              </div>
            )}

            {/* QR mode hints / feedback */}
            {isScanning && mode === 'qr' && !scanResult && (
              <div className={styles.scanHint}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18v2H3zm0 16h18v2H3z"/>
                </svg>
                Align the QR code within the frame
              </div>
            )}

            {isScanning && mode === 'qr' && scanResult === 'success' && (
              <div className={`${styles.statusMsg} ${styles.statusSuccess}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Found — loading artwork…
              </div>
            )}

            {isScanning && mode === 'qr' && scanResult === 'invalid' && (
              <div className={`${styles.statusMsg} ${styles.statusInvalid}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Not a Confidential Gallery QR code
              </div>
            )}

            {/* Painting mode UI */}
            {isScanning && mode === 'painting' && (
              <>
                {identifyStatus === 'idle' && (
                  <>
                    <p className={styles.paintingHint}>Point at a painting, then tap to identify</p>
                    <button className={styles.captureBtn} onClick={handleIdentify} aria-label="Identify painting">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M20 7h-3.5l-1.5-2h-6L7.5 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                      </svg>
                    </button>
                  </>
                )}

                {(identifyStatus === 'capturing' || identifyStatus === 'identifying') && (
                  <div className={styles.statusMsg}>
                    <span className={styles.spinnerSmall} />
                    {identifyStatus === 'capturing' ? 'Capturing…' : 'Identifying…'}
                  </div>
                )}

                {identifyStatus === 'found' && (
                  <div className={`${styles.statusMsg} ${styles.statusSuccess}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Painting recognised — loading…
                  </div>
                )}

                {identifyStatus === 'not-found' && identifyResult && (
                  <div className={styles.identifyResult}>
                    <p className={styles.identifyTitle}>{identifyResult.title}</p>
                    {identifyResult.artist && (
                      <p className={styles.identifyArtist}>{identifyResult.artist}</p>
                    )}
                    <p className={styles.identifyNote}>Not in this gallery's collection</p>
                    <button className={styles.retryBtn} onClick={() => setIdentifyStatus('idle')}>
                      Try again
                    </button>
                  </div>
                )}

                {identifyStatus === 'error' && (
                  <div className={styles.identifyResult}>
                    <p className={styles.identifyNote}>No painting detected — try again</p>
                    <button className={styles.retryBtn} onClick={() => setIdentifyStatus('idle')}>
                      Try again
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className={styles.errorPanel}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <p>{errorMessage || 'Camera unavailable. Check permissions and try again.'}</p>
                <button className={styles.retryBtn} onClick={handleStart}>
                  Try again
                </button>
              </div>
            )}

            {/* Stop button while scanning */}
            {isScanning && (
              <button className={styles.stopBtn} onClick={handleStop} aria-label="Stop scanning">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="1"/>
                </svg>
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Scans drawer ── */}
      {showHistory && (
        <div className={styles.historyDrawer}>
          <div className={styles.historyHeader}>
            <h2 className={styles.historyTitle}>Recent scans</h2>
            <button className={styles.historyClose} onClick={() => setShowHistory(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {history.length === 0 ? (
            <p className={styles.historyEmpty}>No scans yet.</p>
          ) : (
            <ul className={styles.historyList}>
              {history.map((item) => (
                <li key={item.markerId}>
                  <Link
                    href={`/scan/${item.markerId}`}
                    className={styles.historyItem}
                    onClick={() => { stop(); setShowHistory(false) }}
                  >
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt="" className={styles.historyThumb} />
                    )}
                    <div className={styles.historyInfo}>
                      <span className={styles.historyArtwork}>{item.artworkTitle}</span>
                      <span className={styles.historyArtist}>{item.artistName}</span>
                      {item.galleryName && (
                        <span className={styles.historyGallery}>{item.galleryName}</span>
                      )}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
