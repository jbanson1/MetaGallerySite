'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { getScanHistory } from '@/lib/utils/storage'
import type { ScanHistoryItem } from '@/lib/utils/storage'
import PreviewsPanel from '@/components/account/PreviewsPanel'
import BuyerListPanel from '@/components/account/BuyerListPanel'
import MessagesPanel from '@/components/account/MessagesPanel'
import AnalyticsPanel from '@/components/account/AnalyticsPanel'
import styles from './account.module.css'

// ── Tab definitions ────────────────────────────────────────────────────────
type ArtistTab = 'portfolio' | 'previews' | 'buyers' | 'messages' | 'analytics' | 'settings'
type BuyerTab = 'collection' | 'scans' | 'wall' | 'messages' | 'settings'

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, loading, signOut, updateProfile, deleteAccount } = useAuth()

  const [artistTab, setArtistTab] = useState<ArtistTab>('portfolio')
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('collection')
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])
  const [settingsName, setSettingsName] = useState('')
  const [settingsLocation, setSettingsLocation] = useState('')
  const [settingsBio, setSettingsBio] = useState('')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!loading && !user) router.replace('/signup')
  }, [user, loading, router])

  useEffect(() => {
    if (user) setScanHistory(getScanHistory())
  }, [user])

  useEffect(() => {
    if (profile) {
      setSettingsName(profile.full_name ?? '')
      setSettingsLocation(profile.location ?? '')
      setSettingsBio(profile.bio ?? '')
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
    const { error } = await updateProfile({ full_name: settingsName, location: settingsLocation, bio: settingsBio })
    setSettingsSaving(false)
    setSettingsMsg(error ?? 'Changes saved.')
  }

  if (loading || !user || !profile) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(248,246,241,0.15)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const isArtist = profile.account_type === 'artist'
  const displayName = profile.full_name || user.email?.split('@')[0] || 'Member'
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const memberSince = new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  // ── Settings Tab (shared) ────────────────────────────────────────────────
  const settingsPanel = (
    <div className={styles.settingsSection}>
      <h2>Account Settings</h2>
      <div className={styles.settingsGroup}>
        <h3>Profile Information</h3>
        <p className={styles.accountTypeTag}>
          Account type: <strong>{isArtist ? 'Artist' : 'Buyer'}</strong>
        </p>
        <form className={styles.settingsForm} onSubmit={handleSaveSettings}>
          <div className={styles.formRow}>
            <label>Full Name</label>
            <input type="text" value={settingsName} onChange={e => setSettingsName(e.target.value)} placeholder="Your name" />
          </div>
          <div className={styles.formRow}>
            <label>Email Address</label>
            <input type="email" value={user.email ?? ''} disabled style={{ opacity: 0.5 }} />
          </div>
          <div className={styles.formRow}>
            <label>Location</label>
            <input type="text" value={settingsLocation} onChange={e => setSettingsLocation(e.target.value)} placeholder="City, Country" />
          </div>
          <div className={styles.formRow}>
            <label>Bio</label>
            <textarea
              value={settingsBio}
              onChange={e => setSettingsBio(e.target.value)}
              placeholder={isArtist ? 'Tell buyers about your practice…' : 'Tell artists about what you collect…'}
              rows={4}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', padding: '0.6rem 0.875rem', outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
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
          {!showDeleteConfirm && (
            <button className={styles.btnDanger} onClick={() => { setShowDeleteConfirm(true); setDeleteError('') }}>
              Delete my account
            </button>
          )}
        </div>
        {showDeleteConfirm && (
          <div className={styles.deleteConfirm}>
            <p>This will permanently delete your account and all associated data. This cannot be undone.</p>
            {deleteError && <p style={{color:'#e05c5c', fontSize:'0.82rem', margin:'0.25rem 0 0'}}>{deleteError}</p>}
            <div className={styles.deleteConfirmActions}>
              <button className={styles.btnDanger} disabled={deleteLoading} onClick={async () => {
                setDeleteLoading(true)
                setDeleteError('')
                const { error } = await deleteAccount()
                if (error) { setDeleteError(error); setDeleteLoading(false); return }
                router.replace('/')
              }}>
                {deleteLoading ? 'Deleting…' : 'Yes, delete my account'}
              </button>
              <button className={styles.btnCancel} onClick={() => setShowDeleteConfirm(false)} disabled={deleteLoading}>
                Cancel
              </button>
            </div>
          </div>
        )}
        <p className={styles.gdprNote}>
          Under UK GDPR you have the right to erasure. Your data will be removed within 30 days.{' '}
          <a href="/privacy#your-rights" style={{color:'var(--gold)', textDecoration:'underline'}}>Learn more</a>
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Account Header ─────────────────────────────────────────────── */}
      <section className={styles.accountHeader}>
        <div className={styles.accountHeaderContent}>
          <div className={styles.accountAvatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,162,39,0.15)', color: 'var(--gold)', fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 600 }}>
            {initials}
          </div>
          <div className={styles.accountInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1>{displayName}</h1>
              <span className={isArtist ? styles.badgeArtist : styles.badgeBuyer}>
                {isArtist ? 'Artist' : 'Buyer'}
              </span>
            </div>
            <p className={styles.accountMeta}>
              {profile.location && (
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {profile.location}
                </span>
              )}
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Member since {memberSince}
              </span>
            </p>
            {profile.bio && <p className={styles.accountBio}>{profile.bio}</p>}
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

      {/* ── Artist Dashboard ───────────────────────────────────────────── */}
      {isArtist && (
        <>
          <div className={styles.accountTabs}>
            <button className={`${styles.tabBtn} ${artistTab === 'portfolio' ? styles.tabBtnActive : ''}`} onClick={() => setArtistTab('portfolio')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              Portfolio
            </button>
            <button className={`${styles.tabBtn} ${artistTab === 'previews' ? styles.tabBtnActive : ''}`} onClick={() => setArtistTab('previews')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Work Previews
            </button>
            <button className={`${styles.tabBtn} ${artistTab === 'buyers' ? styles.tabBtnActive : ''}`} onClick={() => setArtistTab('buyers')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              My Buyers
            </button>
            <button className={`${styles.tabBtn} ${artistTab === 'messages' ? styles.tabBtnActive : ''}`} onClick={() => setArtistTab('messages')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Messages
            </button>
            <button className={`${styles.tabBtn} ${artistTab === 'analytics' ? styles.tabBtnActive : ''}`} onClick={() => setArtistTab('analytics')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Analytics
            </button>
            <button className={`${styles.tabBtn} ${artistTab === 'settings' ? styles.tabBtnActive : ''}`} onClick={() => setArtistTab('settings')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Settings
            </button>
          </div>

          <section className={styles.accountContent}>
            {artistTab === 'portfolio' && (
              <div className={styles.purchasesSection}>
                <div className={styles.sectionHeaderRow}>
                  <h2>My Artworks</h2>
                </div>
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--smoke)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.4 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>Your published artworks will appear here.</p>
                  <Link href="/marketplace" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>Browse the marketplace →</Link>
                </div>
              </div>
            )}
            {artistTab === 'previews' && <PreviewsPanel profile={profile} />}
            {artistTab === 'buyers' && <BuyerListPanel profile={profile} />}
            {artistTab === 'messages' && <MessagesPanel profile={profile} />}
            {artistTab === 'analytics' && <AnalyticsPanel profile={profile} />}
            {artistTab === 'settings' && settingsPanel}
          </section>
        </>
      )}

      {/* ── Buyer Dashboard ────────────────────────────────────────────── */}
      {!isArtist && (
        <>
          <div className={styles.accountTabs}>
            <button className={`${styles.tabBtn} ${buyerTab === 'collection' ? styles.tabBtnActive : ''}`} onClick={() => setBuyerTab('collection')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              My Collection
            </button>
            <button className={`${styles.tabBtn} ${buyerTab === 'scans' ? styles.tabBtnActive : ''}`} onClick={() => setBuyerTab('scans')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
              </svg>
              Scan History
            </button>
            <button className={`${styles.tabBtn} ${buyerTab === 'wall' ? styles.tabBtnActive : ''}`} onClick={() => setBuyerTab('wall')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
                <rect x="6" y="7" width="5" height="4" rx="1"/>
              </svg>
              Wall Preview
            </button>
            <button className={`${styles.tabBtn} ${buyerTab === 'messages' ? styles.tabBtnActive : ''}`} onClick={() => setBuyerTab('messages')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Messages
            </button>
            <button className={`${styles.tabBtn} ${buyerTab === 'settings' ? styles.tabBtnActive : ''}`} onClick={() => setBuyerTab('settings')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Settings
            </button>
          </div>

          <section className={styles.accountContent}>
            {buyerTab === 'collection' && (
              <div className={styles.purchasesSection}>
                <div className={styles.sectionHeaderRow}>
                  <h2>My Collection</h2>
                  <span className={styles.sectionCount}>0 items</span>
                </div>
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--smoke)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.4 }}>
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <p>No purchases yet.</p>
                  <Link href="/marketplace" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>Browse the marketplace →</Link>
                </div>
              </div>
            )}

            {buyerTab === 'scans' && (
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
                        {item.imageUrl && <div className={styles.purchaseImage} style={{ backgroundImage: `url('${item.imageUrl}')` }} />}
                        <div className={styles.purchaseDetails}>
                          <div className={styles.purchaseInfo}>
                            <h3>{item.artworkTitle}</h3>
                            <p className={styles.purchaseArtist}>{item.artistName}</p>
                            <p className={styles.purchaseDate}>{new Date(item.scannedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className={styles.purchaseActions}>
                          <Link href={`/scan/${item.markerId}`} className={styles.actionBtn}>View</Link>
                          {item.imageUrl && (
                            <Link
                              href={`/ar-preview?image=${encodeURIComponent(item.imageUrl)}&title=${encodeURIComponent(item.artworkTitle)}&artist=${encodeURIComponent(item.artistName)}&autostart=camera`}
                              className={`${styles.actionBtn} ${styles.actionBtnAr}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <rect x="2" y="3" width="20" height="14" rx="2"/>
                                <path d="M8 21h8M12 17v4"/>
                              </svg>
                              Try on Wall
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {buyerTab === 'wall' && (
              <div>
                {/* Hero */}
                <div className={styles.wallHero}>
                  <div className={styles.wallHeroIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <path d="M8 21h8M12 17v4"/>
                      <rect x="6" y="7" width="5" height="4" rx="1"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className={styles.wallHeroTitle}>Wall Preview</h2>
                    <p className={styles.wallHeroDesc}>
                      Point your phone at a wall and see how any artwork would look in your space — live, using your camera.
                    </p>
                  </div>
                </div>

                {/* How it works */}
                <div className={styles.wallSteps}>
                  <div className={styles.wallStep}>
                    <span className={styles.wallStepNum}>1</span>
                    <p>Pick an artwork below</p>
                  </div>
                  <div className={styles.wallStepDivider} />
                  <div className={styles.wallStep}>
                    <span className={styles.wallStepNum}>2</span>
                    <p>Allow camera access</p>
                  </div>
                  <div className={styles.wallStepDivider} />
                  <div className={styles.wallStep}>
                    <span className={styles.wallStepNum}>3</span>
                    <p>Point at your wall &amp; drag to position</p>
                  </div>
                </div>

                {/* Demo artwork — always visible for testing */}
                <div className={styles.sectionHeaderRow} style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 300, fontSize: '1.1rem', color: 'var(--cream)' }}>
                    Try It Now
                  </h3>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(201,162,39,0.3)', color: 'var(--gold)' }}>Demo</span>
                </div>
                <div className={styles.wallGrid} style={{ marginBottom: '2.5rem' }}>
                  <div className={styles.wallCard}>
                    <div
                      className={styles.wallCardImg}
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80')` }}
                    />
                    <div className={styles.wallCardBody}>
                      <h4 className={styles.wallCardTitle}>Ephemeral Light No. 7</h4>
                      <p className={styles.wallCardArtist}>Marcus Chen</p>
                      <Link
                        href={`/ar-preview?image=${encodeURIComponent('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=90')}&title=${encodeURIComponent('Ephemeral Light No. 7')}&artist=${encodeURIComponent('Marcus Chen')}&autostart=camera`}
                        className={styles.wallCardBtn}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 9V5h4M19 9V5h-4M5 15v4h4M19 15v4h-4"/>
                        </svg>
                        Try on My Wall
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Artwork grid from scan history */}
                <div className={styles.sectionHeaderRow}>
                  <h3 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 300, fontSize: '1.1rem', color: 'var(--cream)' }}>
                    From Your Scan History
                  </h3>
                  <Link href="/scan" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem' }}>
                    Scan new artwork →
                  </Link>
                </div>
                {scanHistory.filter(i => i.imageUrl).length === 0 ? (
                  <div className={styles.wallEmpty}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <path d="M8 21h8M12 17v4"/>
                    </svg>
                    <p>Scan an artwork in a gallery to preview it on your wall.</p>
                    <Link href="/scan" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem' }}>
                      Open scanner →
                    </Link>
                  </div>
                ) : (
                  <div className={styles.wallGrid}>
                    {scanHistory.filter(i => i.imageUrl).map((item) => (
                      <div key={`wall-${item.markerId}-${item.scannedAt}`} className={styles.wallCard}>
                        <div
                          className={styles.wallCardImg}
                          style={{ backgroundImage: `url('${item.imageUrl}')` }}
                        />
                        <div className={styles.wallCardBody}>
                          <h4 className={styles.wallCardTitle}>{item.artworkTitle}</h4>
                          <p className={styles.wallCardArtist}>{item.artistName}</p>
                          <Link
                            href={`/ar-preview?image=${encodeURIComponent(item.imageUrl!)}&title=${encodeURIComponent(item.artworkTitle)}&artist=${encodeURIComponent(item.artistName)}&autostart=camera`}
                            className={styles.wallCardBtn}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 9V5h4M19 9V5h-4M5 15v4h4M19 15v4h-4"/>
                            </svg>
                            Try on My Wall
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Browse marketplace CTA */}
                <div className={styles.wallMarketplaceCta}>
                  <p>Discover more artworks to preview in your space</p>
                  <Link href="/marketplace" className={styles.wallMarketplaceBtn}>
                    Browse Marketplace
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {buyerTab === 'messages' && <MessagesPanel profile={profile} />}
            {buyerTab === 'settings' && settingsPanel}
          </section>
        </>
      )}
    </>
  )
}
