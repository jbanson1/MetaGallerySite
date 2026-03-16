'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { getScanHistory } from '@/lib/utils/storage'
import type { ScanHistoryItem } from '@/lib/utils/storage'
import styles from './account.module.css'

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, loading, signOut, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<'scans' | 'purchases' | 'favorites' | 'settings'>('scans')
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])
  const [settingsName, setSettingsName] = useState('')
  const [settingsLocation, setSettingsLocation] = useState('')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signup')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setScanHistory(getScanHistory())
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      setSettingsName(profile.full_name ?? '')
      setSettingsLocation(profile.location ?? '')
    }
  }, [profile])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsSaving(true)
    setSettingsMsg('')
    const { error } = await updateProfile({ full_name: settingsName, location: settingsLocation })
    setSettingsSaving(false)
    setSettingsMsg(error ? error : 'Changes saved.')
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(248,246,241,0.15)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Member'
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const memberSince = new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <>
      {/* Account Header */}
      <section className={styles.accountHeader}>
        <div className={styles.accountHeaderContent}>
          <div className={styles.accountAvatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,162,39,0.15)', color: 'var(--gold)', fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 600 }}>
            {initials}
          </div>
          <div className={styles.accountInfo}>
            <h1>{displayName}</h1>
            <p className={styles.accountMeta}>
              {profile?.location && (
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {profile.location}
                </span>
              )}
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Member since {memberSince}
              </span>
            </p>
            <div className={styles.accountStats}>
              <div className={styles.accountStat}>
                <span className={styles.statNumber}>{scanHistory.length}</span>
                <span className={styles.statLabel}>Scans</span>
              </div>
              <div className={styles.accountStat}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Purchases</span>
              </div>
              <div className={styles.accountStat}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Favorites</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnLogout} onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </section>

      {/* Account Tabs */}
      <div className={styles.accountTabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'scans' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('scans')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
            <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
          </svg>
          Scan History
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'purchases' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('purchases')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Purchases
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Favorites
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <section className={styles.accountContent}>
        {/* Scan History Tab */}
        {activeTab === 'scans' && (
          <div className={styles.purchasesSection}>
            <div className={styles.sectionHeaderRow}>
              <h2>Scan History</h2>
              <span className={styles.sectionCount}>{scanHistory.length} scans</span>
            </div>
            {scanHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--smoke)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.4 }}>
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                  <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
                </svg>
                <p>No scans yet.</p>
                <Link href="/scan" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>Start scanning →</Link>
              </div>
            ) : (
              <div className={styles.purchasesList}>
                {scanHistory.map((item) => (
                  <div key={`${item.markerId}-${item.scannedAt}`} className={styles.purchaseCard}>
                    {item.imageUrl && (
                      <div className={styles.purchaseImage} style={{ backgroundImage: `url('${item.imageUrl}')` }} />
                    )}
                    <div className={styles.purchaseDetails}>
                      <div className={styles.purchaseInfo}>
                        <h3>{item.artworkTitle}</h3>
                        <p className={styles.purchaseArtist}>{item.artistName}</p>
                        <p className={styles.purchaseDate}>{new Date(item.scannedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className={styles.purchaseActions}>
                      <Link href={`/scan/${item.markerId}`} className={styles.actionBtn}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className={styles.purchasesSection}>
            <div className={styles.sectionHeaderRow}>
              <h2>Your Collection</h2>
              <span className={styles.sectionCount}>0 items</span>
            </div>
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--smoke)' }}>
              <p>No purchases yet.</p>
              <Link href="/marketplace" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>Browse the marketplace →</Link>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className={styles.favoritesSection}>
            <div className={styles.sectionHeaderRow}>
              <h2>Saved Artworks</h2>
              <span className={styles.sectionCount}>0 items</span>
            </div>
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--smoke)' }}>
              <p>No saved artworks yet.</p>
              <Link href="/marketplace" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>Explore artworks →</Link>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={styles.settingsSection}>
            <h2>Account Settings</h2>

            <div className={styles.settingsGroup}>
              <h3>Profile Information</h3>
              <form className={styles.settingsForm} onSubmit={handleSaveSettings}>
                <div className={styles.formRow}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Email Address</label>
                  <input type="email" value={user.email ?? ''} disabled style={{ opacity: 0.5 }} />
                </div>
                <div className={styles.formRow}>
                  <label>Location</label>
                  <input
                    type="text"
                    value={settingsLocation}
                    onChange={(e) => setSettingsLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                {settingsMsg && (
                  <p style={{ fontSize: '0.85rem', color: settingsMsg === 'Changes saved.' ? 'var(--gold)' : '#e05c5c' }}>
                    {settingsMsg}
                  </p>
                )}
                <button type="submit" className={styles.btnSave} disabled={settingsSaving}>
                  {settingsSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className={`${styles.settingsGroup} ${styles.dangerZone}`}>
              <h3>Danger Zone</h3>
              <div className={styles.dangerActions}>
                <button className={styles.btnDanger} onClick={handleLogout}>Sign out</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
