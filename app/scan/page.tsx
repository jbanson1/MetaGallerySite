'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useScanner } from '@/lib/hooks/useScanner'
import { extractMarkerId } from '@/lib/utils/marker'
import { getScanHistory } from '@/lib/utils/storage'
import type { ScanHistoryItem } from '@/lib/utils/storage'
import styles from './scanner.module.css'

const SCANNER_ELEMENT_ID = 'mg-qr-reader'

export default function ScanPage() {
  const router = useRouter()
  const [hasStarted, setHasStarted] = useState(false)
  const [scanResult, setScanResult] = useState<'success' | 'invalid' | null>(null)
  const [resultMarkerId, setResultMarkerId] = useState('')
  const [history, setHistory] = useState<ScanHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setHistory(getScanHistory())
  }, [])

  const handleScan = useCallback(
    (decodedText: string) => {
      // Prevent multiple firings while redirecting
      if (scanResult) return

      const markerId = extractMarkerId(decodedText)
      if (markerId) {
        pause()
        setScanResult('success')
        setResultMarkerId(markerId)
        // Brief visual feedback, then navigate
        resultTimeoutRef.current = setTimeout(() => {
          router.push(`/scan/${markerId}`)
        }, 600)
      } else {
        setScanResult('invalid')
        resultTimeoutRef.current = setTimeout(() => setScanResult(null), 2000)
      }
    },
    [scanResult, router] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const { status, errorMessage, start, stop, pause, resume } = useScanner({
    elementId: SCANNER_ELEMENT_ID,
    onScan: handleScan,
  })

  async function handleStart() {
    setHasStarted(true)
    setScanResult(null)
    await start()
  }

  async function handleStop() {
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current)
    await stop()
    setHasStarted(false)
    setScanResult(null)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current)
      stop()
    }
  }, [stop])

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
              {isScanning ? 'Scanning…' : 'Meta Gallery Scanner'}
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

          {/* Scan frame — only shown while scanning */}
          {isScanning && (
            <div className={`${styles.frame} ${scanResult === 'success' ? styles.frameSuccess : ''} ${scanResult === 'invalid' ? styles.frameInvalid : ''}`}>
              <span className={`${styles.corner} ${styles.tl}`} />
              <span className={`${styles.corner} ${styles.tr}`} />
              <span className={`${styles.corner} ${styles.bl}`} />
              <span className={`${styles.corner} ${styles.br}`} />
              {!scanResult && <span className={styles.scanLine} />}
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
                  Point your camera at a Meta Gallery QR code
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

            {/* Active scanning — hint */}
            {isScanning && !scanResult && (
              <div className={styles.scanHint}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18v2H3zm0 16h18v2H3z"/>
                </svg>
                Align the QR code within the frame
              </div>
            )}

            {/* Success feedback */}
            {scanResult === 'success' && (
              <div className={`${styles.statusMsg} ${styles.statusSuccess}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Found — loading artwork…
              </div>
            )}

            {/* Invalid QR */}
            {scanResult === 'invalid' && (
              <div className={`${styles.statusMsg} ${styles.statusInvalid}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Not a Meta Gallery QR code
              </div>
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
