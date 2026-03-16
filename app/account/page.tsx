'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './account.module.css'

// Mock user data
const userData = {
  name: 'Alexandra Morrison',
  email: 'alex.morrison@email.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  memberSince: 'January 2024',
  location: 'London, UK',
  purchases: 7,
  favorites: 23,
  following: 12,
  reviews: 4,
}

const purchases = [
  {
    id: 1,
    title: 'Ephemeral Light No. 5',
    artist: 'Marcus Chen',
    artistSlug: 'marcus-chen',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    price: 2400,
    type: 'Original',
    date: 'Feb 15, 2025',
    status: 'Delivered',
    hasReview: true,
  },
  {
    id: 2,
    title: 'Urban Reflections III',
    artist: 'Sofia Andersson',
    artistSlug: 'sofia-andersson',
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80',
    price: 180,
    type: 'Limited Print',
    date: 'Jan 28, 2025',
    status: 'Delivered',
    hasReview: true,
  },
  {
    id: 3,
    title: 'Dimensional Shift #042',
    artist: 'Digital Collective',
    artistSlug: 'digital-collective',
    image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80',
    price: 95,
    type: 'AR Collectible',
    date: 'Jan 10, 2025',
    status: 'Delivered',
    hasReview: false,
  },
  {
    id: 4,
    title: 'Morning Mist',
    artist: 'Marcus Chen',
    artistSlug: 'marcus-chen',
    image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80',
    price: 1800,
    type: 'Original',
    date: 'Dec 20, 2024',
    status: 'Delivered',
    hasReview: true,
  },
]

const favorites = [
  {
    id: 1,
    title: 'Ancestral Memory',
    artist: 'Amara Okonkwo',
    image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=600&q=80',
    price: 5800,
    type: 'Original',
  },
  {
    id: 2,
    title: 'London After Rain',
    artist: 'James Whitmore',
    image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80',
    price: 320,
    type: 'Limited Print',
  },
  {
    id: 3,
    title: 'Chromatic Study #12',
    artist: 'Elena Vasquez',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
    price: 1850,
    type: 'Original',
  },
  {
    id: 4,
    title: 'Neon Dreams Series',
    artist: 'Kai Tanaka',
    image: 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=600&q=80',
    price: 65,
    type: 'AR Collectible',
  },
]

const followingArtists = [
  {
    slug: 'marcus-chen',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    specialty: 'Oil Painting',
    newWorks: 2,
  },
  {
    slug: 'sofia-andersson',
    name: 'Sofia Andersson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    specialty: 'Photography',
    newWorks: 0,
  },
  {
    slug: 'kai-tanaka',
    name: 'Kai Tanaka',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    specialty: 'Digital Art',
    newWorks: 5,
  },
  {
    slug: 'elena-vasquez',
    name: 'Elena Vasquez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    specialty: 'Abstract',
    newWorks: 1,
  },
]

export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'purchases' | 'favorites' | 'following' | 'settings'>('purchases')
   const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false')
     window.dispatchEvent(new Event('userLogout'))
    router.push('/')
  }

  return (
    <>
      {/* Account Header */}
      <section className={styles.accountHeader}>
        <div className={styles.accountHeaderContent}>
          <div className={styles.accountAvatar} style={{backgroundImage: `url('${userData.avatar}')`}}></div>
          <div className={styles.accountInfo}>
            <h1>{userData.name}</h1>
            <p className={styles.accountMeta}>
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {userData.location}
              </span>
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Member since {userData.memberSince}
              </span>
            </p>
            <div className={styles.accountStats}>
              <div className={styles.accountStat}>
                <span className={styles.statNumber}>{userData.purchases}</span>
                <span className={styles.statLabel}>Purchases</span>
              </div>
              <div className={styles.accountStat}>
                <span className={styles.statNumber}>{userData.favorites}</span>
                <span className={styles.statLabel}>Favorites</span>
              </div>
              <div className={styles.accountStat}>
                <span className={styles.statNumber}>{userData.following}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
              <div className={styles.accountStat}>
                <span className={styles.statNumber}>{userData.reviews}</span>
                <span className={styles.statLabel}>Reviews</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnEditProfile}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>
            <button className={styles.btnLogout} onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Account Tabs */}
      <div className={styles.accountTabs}>
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
          className={`${styles.tabBtn} ${activeTab === 'following' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('following')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Following
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
        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className={styles.purchasesSection}>
            <div className={styles.sectionHeaderRow}>
              <h2>Your Collection</h2>
              <span className={styles.sectionCount}>{purchases.length} items</span>
            </div>
            
            <div className={styles.purchasesList}>
              {purchases.map((purchase) => (
                <div key={purchase.id} className={styles.purchaseCard}>
                  <div className={styles.purchaseImage} style={{backgroundImage: `url('${purchase.image}')`}}>
                    <span className={`${styles.purchaseBadge} ${styles[purchase.type.toLowerCase().replace(' ', '-')]}`}>
                      {purchase.type}
                    </span>
                  </div>
                  <div className={styles.purchaseDetails}>
                    <div className={styles.purchaseInfo}>
                      <h3>{purchase.title}</h3>
                      <Link href={`/artists/${purchase.artistSlug}`} className={styles.purchaseArtist}>
                        by {purchase.artist}
                      </Link>
                      <p className={styles.purchaseDate}>Purchased {purchase.date}</p>
                    </div>
                    <div className={styles.purchaseMeta}>
                      <span className={styles.purchasePrice}>£{purchase.price.toLocaleString()}</span>
                      <span className={styles.purchaseStatus}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        {purchase.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.purchaseActions}>
                    <Link href="#" className={styles.actionBtn}>View Details</Link>
                    {!purchase.hasReview && (
                      <button className={`${styles.actionBtn} ${styles.review}`}>Write Review</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className={styles.favoritesSection}>
            <div className={styles.sectionHeaderRow}>
              <h2>Saved Artworks</h2>
              <span className={styles.sectionCount}>{favorites.length} items</span>
            </div>
            
            <div className={styles.favoritesGrid}>
              {favorites.map((item) => (
                <article key={item.id} className={styles.favoriteCard}>
                  <div className={styles.favoriteImage} style={{backgroundImage: `url('${item.image}')`}}>
                    <button className={styles.removeFavorite} aria-label="Remove from favorites">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <span className={styles.favoriteBadge}>
                      {item.type}
                    </span>
                  </div>
                  <div className={styles.favoriteContent}>
                    <h3>{item.title}</h3>
                    <p className={styles.favoriteArtist}>{item.artist}</p>
                    <div className={styles.favoriteFooter}>
                      <span className={styles.favoritePrice}>£{item.price.toLocaleString()}</span>
                      <Link href="#" className={styles.favoriteCta}>View</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div className={styles.followingSection}>
            <div className={styles.sectionHeaderRow}>
              <h2>Artists You Follow</h2>
              <span className={styles.sectionCount}>{followingArtists.length} artists</span>
            </div>
            
            <div className={styles.followingGrid}>
              {followingArtists.map((artist) => (
                <Link href={`/artists/${artist.slug}`} key={artist.slug} className={styles.followingCard}>
                  <div className={styles.followingAvatar} style={{backgroundImage: `url('${artist.avatar}')`}}>
                    {artist.newWorks > 0 && (
                      <span className={styles.newWorksBadge}>{artist.newWorks} new</span>
                    )}
                  </div>
                  <div className={styles.followingInfo}>
                    <h3>{artist.name}</h3>
                    <p>{artist.specialty}</p>
                  </div>
                  <button className={styles.btnUnfollow}>Following</button>
                </Link>
              ))}
            </div>
            
            <div className={styles.discoverMore}>
              <p>Discover more artists to follow</p>
              <Link href="/artists" className={styles.btnDiscover}>
                Browse Artists
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={styles.settingsSection}>
            <h2>Account Settings</h2>
            
            <div className={styles.settingsGroup}>
              <h3>Profile Information</h3>
              <div className={styles.settingsForm}>
                <div className={styles.formRow}>
                  <label>Full Name</label>
                  <input type="text" defaultValue={userData.name} />
                </div>
                <div className={styles.formRow}>
                  <label>Email Address</label>
                  <input type="email" defaultValue={userData.email} />
                </div>
                <div className={styles.formRow}>
                  <label>Location</label>
                  <input type="text" defaultValue={userData.location} />
                </div>
                <button className={styles.btnSave}>Save Changes</button>
              </div>
            </div>

            <div className={styles.settingsGroup}>
              <h3>Notifications</h3>
              <div className={styles.settingsToggles}>
                <div className={styles.toggleRow}>
                  <div>
                    <span className={styles.toggleLabel}>New works from artists you follow</span>
                    <span className={styles.toggleDesc}>Get notified when artists you follow add new pieces</span>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
                <div className={styles.toggleRow}>
                  <div>
                    <span className={styles.toggleLabel}>Price drops on favorites</span>
                    <span className={styles.toggleDesc}>Get notified when saved items go on sale</span>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
                <div className={styles.toggleRow}>
                  <div>
                    <span className={styles.toggleLabel}>Upcoming events</span>
                    <span className={styles.toggleDesc}>Reminders for exhibitions and charity events</span>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
                <div className={styles.toggleRow}>
                  <div>
                    <span className={styles.toggleLabel}>Marketing emails</span>
                    <span className={styles.toggleDesc}>News, features, and special offers</span>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>

            <div className={`${styles.settingsGroup} ${styles.dangerZone}`}>
              <h3>Danger Zone</h3>
              <div className={styles.dangerActions}>
                <button className={styles.btnDangerOutline}>Download My Data</button>
                <button className={styles.btnDanger}>Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
