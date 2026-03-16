'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Gallery, Artwork, Marker, ScanEvent } from '@/lib/database.types'
import styles from './admin.module.css'
import ArtworkForm from './ArtworkForm'
import MarkerPanel from './MarkerPanel'

type AdminView = 'dashboard' | 'artworks' | 'markers' | 'analytics'
type AuthState = 'checking' | 'unauthenticated' | 'authenticated'

interface Stats {
  totalArtworks: number
  totalMarkers: number
  totalScans: number
  scansToday: number
}

export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [markers, setMarkers] = useState<Marker[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentScans, setRecentScans] = useState<ScanEvent[]>([])

  const [view, setView] = useState<AdminView>('dashboard')
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null)
  const [showArtworkForm, setShowArtworkForm] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(session ? 'authenticated' : 'unauthenticated')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? 'authenticated' : 'unauthenticated')
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load gallery data once authenticated
  useEffect(() => {
    if (authState === 'authenticated') {
      loadGalleryData()
    }
  }, [authState])

  async function loadGalleryData() {
    setDataLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get gallery for this admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('gallery_id, role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      setDataLoading(false)
      return
    }

    const [galleryRes, artworksRes, markersRes, scansRes, todayScansRes] = await Promise.all([
      supabase.from('galleries').select('*').eq('id', adminUser.gallery_id).single(),
      supabase.from('artworks').select('*').eq('gallery_id', adminUser.gallery_id).order('created_at', { ascending: false }),
      supabase.from('markers').select('*').eq('gallery_id', adminUser.gallery_id).order('created_at', { ascending: false }),
      supabase.from('scan_events').select('*', { count: 'exact', head: true }).eq('gallery_id', adminUser.gallery_id),
      supabase.from('scan_events').select('*', { count: 'exact', head: true })
        .eq('gallery_id', adminUser.gallery_id)
        .gte('scanned_at', new Date().toISOString().split('T')[0]),
    ])

    const recentScansRes = await supabase
      .from('scan_events')
      .select('*')
      .eq('gallery_id', adminUser.gallery_id)
      .order('scanned_at', { ascending: false })
      .limit(20)

    setGallery(galleryRes.data ?? null)
    setArtworks(artworksRes.data ?? [])
    setMarkers(markersRes.data ?? [])
    setRecentScans(recentScansRes.data ?? [])
    setStats({
      totalArtworks: artworksRes.data?.length ?? 0,
      totalMarkers: markersRes.data?.length ?? 0,
      totalScans: scansRes.count ?? 0,
      scansToday: todayScansRes.count ?? 0,
    })
    setDataLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError(error.message)
    setLoginLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function handleDeleteArtwork(id: string) {
    if (!confirm('Delete this artwork? All associated markers and assets will also be removed.')) return
    await supabase.from('artworks').delete().eq('id', id)
    setArtworks((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleToggleArtwork(artwork: Artwork) {
    const { data } = await supabase
      .from('artworks')
      .update({ is_active: !artwork.is_active })
      .eq('id', artwork.id)
      .select()
      .single()
    if (data) setArtworks((prev) => prev.map((a) => (a.id === data.id ? data : a)))
  }

  // ─── AUTH CHECK ─────────────────────────────────────────────────────────────
  if (authState === 'checking') {
    return (
      <div className={styles.loadScreen}>
        <div className={styles.spinner} />
      </div>
    )
  }

  // ─── LOGIN ──────────────────────────────────────────────────────────────────
  if (authState === 'unauthenticated') {
    return (
      <div className={styles.loginScreen}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>MG</div>
          <h1 className={styles.loginTitle}>Gallery Admin</h1>
          <p className={styles.loginSubtitle}>Sign in to manage your artworks and markers</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formField}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gallery.com"
                required
                autoComplete="email"
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {loginError && <p className={styles.loginError}>{loginError}</p>}
            <button type="submit" className={styles.loginBtn} disabled={loginLoading}>
              {loginLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─── NO GALLERY ASSIGNED ────────────────────────────────────────────────────
  if (!dataLoading && !gallery) {
    return (
      <div className={styles.loadScreen}>
        <p className={styles.noGalleryMsg}>Your account isn't linked to a gallery yet. Contact support.</p>
        <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
      </div>
    )
  }

  // ─── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoMark}>MG</span>
          <span className={styles.logoLabel}>Admin</span>
        </div>
        {gallery && <p className={styles.galleryLabel}>{gallery.name}</p>}
        <ul className={styles.navList}>
          {([
            { id: 'dashboard', label: 'Dashboard', icon: '◈' },
            { id: 'artworks',  label: 'Artworks',  icon: '◻' },
            { id: 'markers',   label: 'Markers',   icon: '◈' },
            { id: 'analytics', label: 'Analytics', icon: '◉' },
          ] as { id: AdminView; label: string; icon: string }[]).map((item) => (
            <li key={item.id}>
              <button
                className={`${styles.navItem} ${view === item.id ? styles.navActive : ''}`}
                onClick={() => setView(item.id)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <button className={styles.logoutSideBtn} onClick={handleLogout}>Sign out</button>
      </nav>

      {/* Main content */}
      <main className={styles.main}>
        {dataLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
          </div>
        )}

        {/* ── Dashboard ── */}
        {view === 'dashboard' && (
          <div className={styles.section}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Overview for {gallery?.name}</p>

            <div className={styles.statsGrid}>
              {[
                { label: 'Artworks', value: stats?.totalArtworks ?? '—' },
                { label: 'Markers',  value: stats?.totalMarkers ?? '—' },
                { label: 'Total scans', value: stats?.totalScans ?? '—' },
                { label: 'Scans today', value: stats?.scansToday ?? '—' },
              ].map((s) => (
                <div key={s.label} className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.recentPanel}>
              <h2 className={styles.panelTitle}>Recent scans</h2>
              {recentScans.length === 0 ? (
                <p className={styles.emptyMsg}>No scans yet. Print your markers and share them!</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Marker</th>
                      <th>Time</th>
                      <th>Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentScans.map((scan) => (
                      <tr key={scan.id}>
                        <td><code className={styles.code}>{scan.marker_id}</code></td>
                        <td>{new Date(scan.scanned_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td className={styles.dimText}>{scan.session_id?.slice(0, 8) ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Artworks ── */}
        {view === 'artworks' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h1 className={styles.pageTitle}>Artworks</h1>
                <p className={styles.pageSubtitle}>{artworks.length} total</p>
              </div>
              <button
                className={styles.primaryBtn}
                onClick={() => { setEditingArtwork(null); setShowArtworkForm(true) }}
              >
                + Add artwork
              </button>
            </div>

            {showArtworkForm && gallery && (
              <ArtworkForm
                galleryId={gallery.id}
                artwork={editingArtwork}
                onSave={(saved) => {
                  setArtworks((prev) =>
                    editingArtwork
                      ? prev.map((a) => (a.id === saved.id ? saved : a))
                      : [saved, ...prev]
                  )
                  setShowArtworkForm(false)
                  setEditingArtwork(null)
                }}
                onCancel={() => { setShowArtworkForm(false); setEditingArtwork(null) }}
              />
            )}

            {artworks.length === 0 && !showArtworkForm ? (
              <div className={styles.emptyState}>
                <p>No artworks yet. Add your first artwork to get started.</p>
              </div>
            ) : (
              <div className={styles.artworkGrid}>
                {artworks.map((artwork) => (
                  <div key={artwork.id} className={`${styles.artworkCard} ${!artwork.is_active ? styles.inactiveCard : ''}`}>
                    <div className={styles.artworkCardBody}>
                      <div className={styles.artworkCardInfo}>
                        <h3 className={styles.artworkCardTitle}>{artwork.title}</h3>
                        <p className={styles.artworkCardArtist}>{artwork.artist_name}{artwork.year ? `, ${artwork.year}` : ''}</p>
                        {artwork.medium && <p className={styles.artworkCardMedium}>{artwork.medium}</p>}
                        {artwork.compact_description && (
                          <p className={styles.artworkCardCompact}>"{artwork.compact_description}"</p>
                        )}
                      </div>
                      <div className={styles.artworkCardBadges}>
                        <span className={`${styles.badge} ${artwork.is_active ? styles.badgeActive : styles.badgeInactive}`}>
                          {artwork.is_active ? 'Active' : 'Hidden'}
                        </span>
                        {artwork.is_for_sale && <span className={`${styles.badge} ${styles.badgeSale}`}>For sale</span>}
                      </div>
                    </div>
                    <div className={styles.artworkCardActions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => { setEditingArtwork(artwork); setShowArtworkForm(true) }}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleToggleArtwork(artwork)}
                      >
                        {artwork.is_active ? 'Hide' : 'Show'}
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteArtwork(artwork.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Markers ── */}
        {view === 'markers' && gallery && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h1 className={styles.pageTitle}>Markers</h1>
                <p className={styles.pageSubtitle}>{markers.length} active markers</p>
              </div>
            </div>
            <MarkerPanel
              galleryId={gallery.id}
              artworks={artworks}
              markers={markers}
              onMarkersChange={setMarkers}
            />
          </div>
        )}

        {/* ── Analytics ── */}
        {view === 'analytics' && (
          <div className={styles.section}>
            <h1 className={styles.pageTitle}>Analytics</h1>
            <p className={styles.pageSubtitle}>Scan activity for {gallery?.name}</p>

            <div className={styles.statsGrid}>
              {[
                { label: 'Total scans', value: stats?.totalScans ?? '—' },
                { label: 'Scans today', value: stats?.scansToday ?? '—' },
              ].map((s) => (
                <div key={s.label} className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.recentPanel}>
              <h2 className={styles.panelTitle}>All recent scans</h2>
              {recentScans.length === 0 ? (
                <p className={styles.emptyMsg}>No scans yet.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Marker</th>
                      <th>Time</th>
                      <th>Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentScans.map((scan) => (
                      <tr key={scan.id}>
                        <td><code className={styles.code}>{scan.marker_id}</code></td>
                        <td>{new Date(scan.scanned_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td className={styles.dimText}>{scan.session_id?.slice(0, 8) ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
