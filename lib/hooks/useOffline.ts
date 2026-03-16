'use client'

import { useEffect, useState } from 'react'

interface UseOfflineReturn {
  isOffline: boolean
  wasOffline: boolean
}

export function useOffline(): UseOfflineReturn {
  const [isOffline, setIsOffline] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Set initial state after mount (navigator is not available server-side)
    setIsOffline(!navigator.onLine)

    function handleOnline() {
      setIsOffline(false)
    }

    function handleOffline() {
      setIsOffline(true)
      setWasOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOffline, wasOffline }
}
