export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      background: 'var(--ink)',
      color: 'var(--cream)',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'var(--font-outfit, sans-serif)',
    }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#6b6b6b' }}>
        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
      </svg>
      <h1 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '1.5rem', fontWeight: 600 }}>
        You&apos;re offline
      </h1>
      <p style={{ color: '#6b6b6b', maxWidth: '280px', lineHeight: 1.6, fontSize: '0.9rem' }}>
        No internet connection. Previously scanned artworks are still available in the scanner.
      </p>
      <a
        href="/scan"
        style={{
          padding: '0.65rem 1.5rem',
          background: 'var(--gold, #c9a227)',
          color: '#0a0a0a',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}
      >
        View recent scans
      </a>
    </div>
  )
}
