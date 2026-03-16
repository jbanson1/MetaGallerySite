const SCAN_HISTORY_KEY = 'mg_scan_history'
const MAX_HISTORY = 50

export interface ScanHistoryItem {
  markerId: string
  artworkTitle: string
  artistName: string
  imageUrl?: string
  galleryName?: string
  scannedAt: string
}

export function getScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(SCAN_HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToScanHistory(item: ScanHistoryItem): void {
  if (typeof window === 'undefined') return
  const history = getScanHistory()
  const filtered = history.filter((h) => h.markerId !== item.markerId)
  const updated = [item, ...filtered].slice(0, MAX_HISTORY)
  localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated))
}

export function clearScanHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SCAN_HISTORY_KEY)
}

export function storageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const data = localStorage.getItem(key)
    return data !== null ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded — silently fail
  }
}
