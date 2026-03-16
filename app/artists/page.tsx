import Link from 'next/link'
import styles from './artists.module.css'

export const metadata = {
  title: 'Artists — Confidential Gallery',
  description: 'Discover talented artists from galleries worldwide. Browse portfolios, explore AR-enhanced artwork, and connect with creators.',
}

// Mock data - would come from Supabase in production
const artists = [
  {
    slug: 'marcus-chen',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    location: 'London, UK',
    specialty: 'Oil Painting',
    bio: 'Contemporary artist exploring light and emotion through oil on canvas.',
    verified: true,
    followers: 1240,
    works: 24,
    featuredWork: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
  },
  {
    slug: 'sofia-andersson',
    name: 'Sofia Andersson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    location: 'Stockholm, Sweden',
    specialty: 'Photography',
    bio: 'Urban photographer capturing the poetry of city life.',
    verified: true,
    followers: 890,
    works: 45,
    featuredWork: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80',
  },
  {
    slug: 'amara-okonkwo',
    name: 'Amara Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    location: 'Lagos, Nigeria',
    specialty: 'Mixed Media',
    bio: 'Exploring identity and heritage through layered mixed media compositions.',
    verified: true,
    followers: 2100,
    works: 18,
    featuredWork: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=600&q=80',
  },
  {
    slug: 'james-whitmore',
    name: 'James Whitmore',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    location: 'Edinburgh, UK',
    specialty: 'Landscape',
    bio: 'Capturing the moody beauty of Scottish landscapes.',
    verified: false,
    followers: 560,
    works: 32,
    featuredWork: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80',
  },
  {
    slug: 'elena-vasquez',
    name: 'Elena Vasquez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    location: 'Barcelona, Spain',
    specialty: 'Abstract',
    bio: 'Color theory and geometric abstraction in contemporary form.',
    verified: true,
    followers: 1780,
    works: 29,
    featuredWork: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
  },
  {
    slug: 'kai-tanaka',
    name: 'Kai Tanaka',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    location: 'Tokyo, Japan',
    specialty: 'Digital Art',
    bio: 'Blending traditional Japanese aesthetics with digital innovation.',
    verified: true,
    followers: 3200,
    works: 67,
    featuredWork: 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=600&q=80',
  },
  {
    slug: 'olivia-reed',
    name: 'Olivia Reed',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    location: 'New York, USA',
    specialty: 'Sculpture',
    bio: 'Minimalist sculptures exploring space and negative form.',
    verified: false,
    followers: 420,
    works: 12,
    featuredWork: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80',
  },
  {
    slug: 'david-okafor',
    name: 'David Okafor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    location: 'London, UK',
    specialty: 'AR Collectibles',
    bio: 'Pioneering the intersection of physical art and augmented reality.',
    verified: true,
    followers: 1560,
    works: 34,
    featuredWork: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
  },
]

const specialties = ['All', 'Oil Painting', 'Photography', 'Mixed Media', 'Abstract', 'Digital Art', 'Sculpture', 'AR Collectibles']

export default function ArtistsPage() {
  return (
    <>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageTag}>
          <span>Artists</span>
        </div>
        <h1>Discover <em className={styles.serifItalic}>extraordinary</em> creators</h1>
        <p>Explore the talented artists bringing their work to life through Confidential Gallery. Follow your favorites and be the first to see new pieces.</p>
      </header>

      {/* Filters */}
      <div className={styles.artistFilters}>
        <div className={styles.filterGroup}>
          {specialties.map((specialty) => (
            <button 
              key={specialty} 
              className={`${styles.filterBtn} ${specialty === 'All' ? styles.filterBtnActive : ''}`}
            >
              {specialty}
            </button>
          ))}
        </div>
        <div className={styles.filterSort}>
          <select className={styles.sortSelect}>
            <option>Most Followed</option>
            <option>Recently Joined</option>
            <option>Most Works</option>
            <option>A-Z</option>
          </select>
        </div>
      </div>

      {/* Featured Artist Banner */}
      <section className={styles.featuredArtistBanner}>
        <div className={styles.featuredArtistImage} style={{backgroundImage: `url('${artists[5].featuredWork}')`}}>
          <div className={styles.featuredArtistOverlay}></div>
        </div>
        <div className={styles.featuredArtistContent}>
          <span className={styles.featuredTag}>Featured Artist</span>
          <div className={styles.featuredArtistHeader}>
            <div className={styles.featuredAvatar} style={{backgroundImage: `url('${artists[5].avatar}')`}}></div>
            <div>
              <h2>
                {artists[5].name}
                <svg className={styles.verifiedBadge} width="20" height="20" viewBox="0 0 24 24" fill="var(--gold)">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </h2>
              <p className={styles.featuredLocation}>{artists[5].location} · {artists[5].specialty}</p>
            </div>
          </div>
          <p className={styles.featuredBio}>{artists[5].bio}</p>
          <div className={styles.featuredStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{artists[5].followers.toLocaleString()}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{artists[5].works}</span>
              <span className={styles.statLabel}>Works</span>
            </div>
          </div>
          <Link href={`/artists/${artists[5].slug}`} className={styles.btnPrimary}>
            <span>View Profile</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Artists Grid */}
      <section className={styles.artistsSection}>
        <div className={styles.artistsGrid}>
          {artists.map((artist) => (
            <Link href={`/artists/${artist.slug}`} key={artist.slug} className={styles.artistCard}>
              <div className={styles.artistCardImage} style={{backgroundImage: `url('${artist.featuredWork}')`}}>
                <div className={styles.artistCardOverlay}></div>
                <div className={styles.artistAvatarWrapper}>
                  <div className={styles.artistAvatar} style={{backgroundImage: `url('${artist.avatar}')`}}></div>
                  {artist.verified && (
                    <svg className={styles.verifiedBadgeSmall} width="16" height="16" viewBox="0 0 24 24" fill="var(--gold)">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={styles.artistCardContent}>
                <h3>{artist.name}</h3>
                <p className={styles.artistSpecialty}>{artist.specialty}</p>
                <p className={styles.artistLocation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {artist.location}
                </p>
                <p className={styles.artistBio}>{artist.bio}</p>
                <div className={styles.artistCardStats}>
                  <span>{artist.followers.toLocaleString()} followers</span>
                  <span>{artist.works} works</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className={styles.loadMore}>
          <button className={styles.loadMoreBtn}>
            Load More Artists
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Become an Artist CTA */}
      <section className={styles.becomeArtistSection}>
        <div className={styles.becomeArtistContainer}>
          <div className={styles.sectionTag}>
            <span>Join Our Community</span>
          </div>
          <h2>Share your art with the <em className={styles.serifItalic}>world</em></h2>
          <p>Create your artist profile, showcase your portfolio, and connect with collectors globally. Plus, add AR layers to make your work truly unforgettable.</p>
          <div className={styles.becomeArtistFeatures}>
            <div className={styles.becomeFeature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>AR-Enhanced Portfolio</span>
            </div>
            <div className={styles.becomeFeature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>Global Reach</span>
            </div>
            <div className={styles.becomeFeature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <span>10% Commission Only</span>
            </div>
          </div>
          <Link href="/#waitlist" className={styles.btnPrimary}>
            <span>Apply to Join</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
