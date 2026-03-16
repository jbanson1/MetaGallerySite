'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export type ScannerStatus =
  | 'idle'
  | 'requesting'
  | 'scanning'
  | 'paused'
  | 'error'
  | 'stopped'

interface UseScannerOptions {
  /** ID of the DOM element that will contain the camera feed */
  elementId: string
  /** Called when a QR code is successfully decoded */
  onScan: (decodedText: string) => void
  /** Called on unrecoverable scanner errors */
  onError?: (message: string) => void
}

interface UseScannerReturn {
  status: ScannerStatus
  errorMessage: string
  start: () => Promise<void>
  stop: () => Promise<void>
  pause: () => void
  resume: () => void
}

export function useScanner({
  elementId,
  onScan,
  onError,
}: UseScannerOptions): UseScannerReturn {
  const [status, setStatus] = useState<ScannerStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerRef = useRef<any>(null)
  const pausedRef = useRef(false)
  const onScanRef = useRef(onScan)

  // Keep ref in sync with latest callback to avoid stale closures
  useEffect(() => { onScanRef.current = onScan }, [onScan])

  const stop = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch {
        // ignore cleanup errors — already stopped
      }
      scannerRef.current = null
    }
    pausedRef.current = false
    setStatus('stopped')
  }, [])

  const start = useCallback(async () => {
    setStatus('requesting')
    setErrorMessage('')

    try {
      // Dynamic import keeps html5-qrcode out of the SSR bundle
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode(elementId, { verbose: false })
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: window.innerHeight / window.innerWidth,
          disableFlip: false,
        },
        (decodedText: string) => {
          if (!pausedRef.current) {
            onScanRef.current(decodedText)
          }
        },
        undefined // suppress per-frame "no QR found" errors
      )

      setStatus('scanning')
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Camera access denied. Please allow camera permissions and try again.'
      setErrorMessage(msg)
      setStatus('error')
      onError?.(msg)
      scannerRef.current = null
    }
  }, [elementId, onError])

  const pause = useCallback(() => {
    pausedRef.current = true
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    pausedRef.current = false
    setStatus('scanning')
  }, [])

  // Stop scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [])

  return { status, errorMessage, start, stop, pause, resume }
}
