'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import styles from './profile.module.css'

// Mock data - would come from Supabase in production
const artistsData: Record<string, any> = {
  'marcus-chen': {
    slug: 'marcus-chen',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80',
    location: 'London, UK',
    specialty: 'Oil Painting',
    bio: 'Contemporary artist exploring light and emotion through oil on canvas. My work investigates the interplay between natural light and human perception.',
    longBio: 'Born in Hong Kong and raised in London, I have always been fascinated by the way light transforms spaces and emotions. After studying Fine Art at the Royal College of Art, I spent five years traveling across Asia and Europe, studying traditional techniques while developing my own contemporary voice.\n\nMy paintings often begin with a single moment of light—a sunset glimpsed through a window, the glow of a street lamp on wet pavement. I work primarily in oils, building up layers of translucent color to capture the ephemeral quality of these moments.',
    verified: true,
    followers: 1240,
    following: 89,
    works: 24,
    joined: 'March 2024',
    website: 'https://marcuschen.art',
    instagram: '@marcuschenart',
    twitter: '@marcuschen_art',
    achievements: [
      { icon: '🏆', title: 'Featured Artist', description: 'March 2025' },
      { icon: '⭐', title: 'Top Seller', description: '15+ works sold' },
      { icon: '🎨', title: 'AR Pioneer', description: 'Early adopter' },
    ],
    artworks: [
      { id: 1, title: 'Ephemeral Light No. 7', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', price: 2400, type: 'Original', hasAR: true },
      { id: 2, title: 'Morning Mist', image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80', price: 1800, type: 'Original', hasAR: true },
      { id: 3, title: 'Urban Glow Series #3', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80', price: 320, type: 'Limited Print', edition: '12/25', hasAR: false },
      { id: 4, title: 'Twilight Reflections', image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80', price: 2100, type: 'Original', hasAR: true },
      { id: 5, title: 'City Lights at Dusk', image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=600&q=80', price: 180, type: 'Limited Print', edition: '8/50', hasAR: false },
      { id: 6, title: 'Golden Hour', image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80', price: 95, type: 'AR Collectible', edition: '34/100', hasAR: true },
    ],
    exhibitions: [
      { title: 'Light & Shadow', venue: 'Tate Modern', date: 'Jun 2025', type: 'Group' },
      { title: 'New Perspectives', venue: 'White Cube', date: 'Mar 2025', type: 'Solo' },
      { title: 'Emerging Voices', venue: 'Serpentine Gallery', date: 'Jan 2025', type: 'Group' },
    ],
    reviews: [
      { id: 1, reviewer: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', rating: 5, date: 'Feb 2025', title: 'Absolutely stunning piece', text: 'The Ephemeral Light painting exceeded all my expectations. The way Marcus captures light is truly magical.', verified: true, artwork: 'Ephemeral Light No. 5' },
      { id: 2, reviewer: 'James T.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', rating: 5, date: 'Jan 2025', title: 'A new favorite artist', text: 'Marcus is one of the most exciting artists I have discovered. His technique is impeccable.', verified: true, artwork: 'Morning Mist' },
    ],
  },
  'sofia-andersson': {
    slug: 'sofia-andersson',
    name: 'Sofia Andersson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&q=80',
    location: 'Stockholm, Sweden',
    specialty: 'Photography',
    bio: 'Urban photographer capturing the poetry of city life.',
    longBio: 'Based in Stockholm, I have spent the last decade documenting urban environments across Europe and Asia. My work explores the relationship between architecture, light, and human presence in modern cities.',
    verified: true,
    followers: 890,
    following: 156,
    works: 45,
    joined: 'January 2024',
    website: 'https://sofiaandersson.com',
    instagram: '@sofia.captures',
    twitter: '@sofiaandersson',
    achievements: [
      { icon: '📸', title: 'Photo Excellence', description: 'Top rated' },
    ],
    artworks: [
      { id: 1, title: 'Urban Reflections III', image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80', price: 180, type: 'Limited Print', edition: '23/50', hasAR: false },
      { id: 2, title: 'Stockholm Dawn', image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80', price: 220, type: 'Limited Print', edition: '15/30', hasAR: true },
    ],
    exhibitions: [
      { title: 'Urban Poetry', venue: 'Fotografiska', date: 'Apr 2025', type: 'Solo' },
    ],
    reviews: [
      { id: 1, reviewer: 'Michael R.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', rating: 5, date: 'Mar 2025', title: 'Exceptional quality', text: 'The print quality is museum-grade. Sofia has an incredible eye.', verified: true, artwork: 'Urban Reflections III' },
    ],
  },
  'amara-okonkwo': {
    slug: 'amara-okonkwo',
    name: 'Amara Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=1200&q=80',
    location: 'Lagos, Nigeria',
    specialty: 'Mixed Media',
    bio: 'Exploring identity and heritage through layered mixed media compositions.',
    longBio: 'My work is a conversation between past and present, between the ancestral wisdom I inherited and the modern world I navigate daily. Using textiles, found objects, paint, and digital elements, I create pieces that tell stories of migration, identity, and belonging.',
    verified: true,
    followers: 2100,
    following: 234,
    works: 18,
    joined: 'February 2024',
    website: 'https://amaraokonkwo.art',
    instagram: '@amara.creates',
    twitter: null,
    achievements: [
      { icon: '🎨', title: 'Rising Star', description: '2024 Award' },
      { icon: '🏛️', title: 'Museum Collected', description: 'Tate Modern' },
    ],
    artworks: [
      { id: 1, title: 'Ancestral Memory', image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=600&q=80', price: 5800, type: 'Original', hasAR: true },
      { id: 2, title: 'Diaspora Dreams', image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80', price: 4200, type: 'Original', hasAR: true },
    ],
    exhibitions: [
      { title: 'New African Voices', venue: 'Tate Modern', date: 'May 2025', type: 'Group' },
    ],
    reviews: [
      { id: 1, reviewer: 'David L.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', rating: 5, date: 'Feb 2025', title: 'Powerful and moving', text: 'Ancestral Memory is one of the most impactful pieces in my collection.', verified: true, artwork: 'Ancestral Memory' },
    ],
  },
  'james-whitmore': {
    slug: 'james-whitmore',
    name: 'James Whitmore',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=1200&q=80',
    location: 'Edinburgh, UK',
    specialty: 'Landscape',
    bio: 'Capturing the moody beauty of Scottish landscapes.',
    longBio: 'The Scottish Highlands have been my muse for over two decades. I wake before dawn to chase the perfect light, waiting for those magical moments when mist rolls through glens.',
    verified: false,
    followers: 560,
    following: 78,
    works: 32,
    joined: 'April 2024',
    website: 'https://jameswhitmore.co.uk',
    instagram: '@jwlandscapes',
    twitter: '@jameswhitmore',
    achievements: [
      { icon: '🏔️', title: 'Landscape Master', description: '20+ years' },
    ],
    artworks: [
      { id: 1, title: 'London After Rain', image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80', price: 320, type: 'Limited Print', edition: '8/25', hasAR: true },
    ],
    exhibitions: [
      { title: 'Scottish Light', venue: 'National Galleries Scotland', date: 'Aug 2025', type: 'Solo' },
    ],
    reviews: [
      { id: 1, reviewer: 'Anne M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', rating: 5, date: 'Jan 2025', title: 'Stunning atmospheric work', text: 'James captures Scotland like no other.', verified: true, artwork: 'Highland Mist' },
    ],
  },
  'elena-vasquez': {
    slug: 'elena-vasquez',
    name: 'Elena Vasquez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80',
    location: 'Barcelona, Spain',
    specialty: 'Abstract',
    bio: 'Color theory and geometric abstraction in contemporary form.',
    longBio: 'I studied at the Barcelona School of Fine Arts before spending years in Berlin and New York. My current work focuses on the intersection of digital precision and painterly gesture.',
    verified: true,
    followers: 1780,
    following: 145,
    works: 29,
    joined: 'March 2024',
    website: 'https://elenavasquez.es',
    instagram: '@elena.abstract',
    twitter: '@elenavasquezart',
    achievements: [
      { icon: '🎨', title: 'Color Master', description: 'Featured collection' },
    ],
    artworks: [
      { id: 1, title: 'Chromatic Study #12', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80', price: 1850, type: 'Original', hasAR: false },
    ],
    exhibitions: [
      { title: 'Color Fields', venue: 'MACBA', date: 'Jun 2025', type: 'Solo' },
    ],
    reviews: [
      { id: 1, reviewer: 'Carlos P.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', rating: 5, date: 'Feb 2025', title: 'Vibrant and sophisticated', text: 'Elena palette choices are extraordinary.', verified: true, artwork: 'Chromatic Study #12' },
    ],
  },
  'kai-tanaka': {
    slug: 'kai-tanaka',
    name: 'Kai Tanaka',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=1200&q=80',
    location: 'Tokyo, Japan',
    specialty: 'Digital Art',
    bio: 'Blending traditional Japanese aesthetics with digital innovation.',
    longBio: 'Growing up surrounded by both ancient temples and neon-lit streets of Tokyo, I have always been fascinated by the coexistence of tradition and technology. My digital art explores this duality.',
    verified: true,
    followers: 3200,
    following: 312,
    works: 67,
    joined: 'January 2024',
    website: 'https://kaitanaka.jp',
    instagram: '@kai.digital',
    twitter: '@kaitanaka_art',
    achievements: [
      { icon: '🎮', title: 'AR Pioneer', description: 'First 50 AR artists' },
      { icon: '🏆', title: 'Most Followed', description: 'Top 10 artist' },
    ],
    artworks: [
      { id: 1, title: 'Neon Dreams Series', image: 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=600&q=80', price: 65, type: 'AR Collectible', edition: '142/200', hasAR: true },
      { id: 2, title: 'Digital Sakura', image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80', price: 85, type: 'AR Collectible', edition: '89/150', hasAR: true },
    ],
    exhibitions: [
      { title: 'Digital Japan', venue: 'teamLab Borderless', date: 'Jul 2025', type: 'Group' },
    ],
    reviews: [
      { id: 1, reviewer: 'Yuki S.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', rating: 5, date: 'Mar 2025', title: 'Mind-blowing AR', text: 'The AR layer completely transforms this piece.', verified: true, artwork: 'Neon Dreams Series' },
    ],
  },
  'olivia-reed': {
    slug: 'olivia-reed',
    name: 'Olivia Reed',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=1200&q=80',
    location: 'New York, USA',
    specialty: 'Sculpture',
    bio: 'Minimalist sculptures exploring space and negative form.',
    longBio: 'My sculptural practice investigates the tension between presence and absence, solid and void. I trained classically in Florence before developing my minimalist approach.',
    verified: false,
    followers: 420,
    following: 67,
    works: 12,
    joined: 'May 2024',
    website: 'https://oliviareed.art',
    instagram: '@olivia.sculpts',
    twitter: null,
    achievements: [
      { icon: '🗿', title: 'Classical Training', description: 'Florence Academy' },
    ],
    artworks: [
      { id: 1, title: 'Void Study I', image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80', price: 8500, type: 'Original', hasAR: true },
    ],
    exhibitions: [
      { title: 'New Minimalism', venue: 'MoMA PS1', date: 'Sep 2025', type: 'Group' },
    ],
    reviews: [
      { id: 1, reviewer: 'Patricia W.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', rating: 5, date: 'Jan 2025', title: 'Elegant and powerful', text: 'Olivia has a masterful understanding of form.', verified: true, artwork: 'Void Study I' },
    ],
  },
  'david-okafor': {
    slug: 'david-okafor',
    name: 'David Okafor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80',
    location: 'London, UK',
    specialty: 'AR Collectibles',
    bio: 'Pioneering the intersection of physical art and augmented reality.',
    longBio: 'I started my career as a traditional painter before discovering AR technology. Now I create works that exist simultaneously in physical and digital space.',
    verified: true,
    followers: 1560,
    following: 198,
    works: 34,
    joined: 'February 2024',
    website: 'https://davidokafor.io',
    instagram: '@david.ar.art',
    twitter: '@davidokafor_ar',
    achievements: [
      { icon: '🚀', title: 'Innovation Award', description: 'AR Excellence 2024' },
    ],
    artworks: [
      { id: 1, title: 'Dimensional Shift #042', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80', price: 95, type: 'AR Collectible', edition: '67/100', hasAR: true },
    ],
    exhibitions: [
      { title: 'Beyond the Frame', venue: 'Serpentine Gallery', date: 'Jun 2025', type: 'Solo' },
    ],
    reviews: [
      { id: 1, reviewer: 'Simon K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', rating: 5, date: 'Feb 2025', title: 'The future is here', text: 'David AR work is revolutionary.', verified: true, artwork: 'Living Canvas' },
    ],
  },
}

const defaultArtist = artistsData['marcus-chen']

export default function ArtistProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const artist = artistsData[slug] || defaultArtist
  
  const [activeTab, setActiveTab] = useState<'works' | 'about' | 'exhibitions' | 'reviews'>('works')
  const [isFollowing, setIsFollowing] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < rating ? 'var(--gold)' : 'none'} stroke="var(--gold)" strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
    ))
  }

  return (
    <>
      <section className={styles.artistHero}>
        <div className={styles.coverImage} style={{backgroundImage: `url('${artist.coverImage}')`}}>
          <div className={styles.coverOverlay}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.artistProfile}>
            <div className={styles.artistAvatarLarge} style={{backgroundImage: `url('${artist.avatar}')`}}></div>
            
            <div className={styles.artistInfo}>
              <div className={styles.artistName}>
                <h1>{artist.name}</h1>
                {artist.verified && (
                  <svg className={styles.verifiedBadge} width="24" height="24" viewBox="0 0 24 24" fill="var(--gold)">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
              </div>
              <div className={styles.artistMeta}>
                <span>{artist.specialty}</span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {artist.location}
                </span>
              </div>
              <p className={styles.artistBio}>{artist.bio}</p>
              
              <div className={styles.artistStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{artist.followers.toLocaleString()}</span>
                  <span className={styles.statLabel}>Followers</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{artist.following}</span>
                  <span className={styles.statLabel}>Following</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{artist.works}</span>
                  <span className={styles.statLabel}>Works</span>
                </div>
              </div>
            </div>

            <div className={styles.artistActions}>
              <button className={styles.btnFollow} onClick={() => setIsFollowing(!isFollowing)}>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className={styles.btnShare} aria-label="Share">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.artistAchievements}>
            {artist.achievements.map((achievement: any, index: number) => (
              <div key={index} className={styles.achievement}>
                <span className={styles.achievementIcon}>{achievement.icon}</span>
                <span className={styles.achievementTitle}>{achievement.title}</span>
                <span className={styles.achievementDescription}>{achievement.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.artistTabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'works' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('works')}>
          Works ({artist.artworks.length})
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'about' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('about')}>
          About
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'exhibitions' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('exhibitions')}>
          Exhibitions
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('reviews')}>
          Reviews ({artist.reviews.length})
        </button>
      </div>

      <section className={styles.artistContent}>
        {activeTab === 'works' && (
          <div className={styles.artistWorks}>
            <h2>Artworks</h2>
            
            <div className={styles.worksGrid}>
              {artist.artworks.map((artwork: any) => (
                <article key={artwork.id} className={styles.workCard}>
                  <div className={styles.workImage} style={{backgroundImage: `url('${artwork.image}')`}}>
                    <span className={`${styles.workBadge} ${artwork.type === 'Original' ? styles.workBadgeOriginal : artwork.type === 'Limited Print' ? styles.workBadgePrint : styles.workBadgeAr}`}>{artwork.type}</span>
                    {artwork.hasAR && (
                      <div className={styles.workArBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        AR
                      </div>
                    )}
                  </div>
                  <div className={styles.workContent}>
                    <h3>{artwork.title}</h3>
                    <div className={styles.workFooter}>
                      <div className={styles.workPrice}>
                        <span className={styles.price}>£{artwork.price.toLocaleString()}</span>
                        {artwork.edition && <span className={styles.edition}>{artwork.edition}</span>}
                      </div>
                      <Link href="#" className={styles.workCta}>View</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className={styles.artistAbout}>
            <div className={styles.aboutContent}>
              <h2>About {artist.name}</h2>
              <div className={styles.aboutText}>
                {artist.longBio.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className={styles.aboutDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>{artist.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Specialty</span>
                  <span className={styles.detailValue}>{artist.specialty}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Joined</span>
                  <span className={styles.detailValue}>{artist.joined}</span>
                </div>
              </div>

              <div className={styles.artistSocialLinks}>
                <h3>Connect</h3>
                <div className={styles.socialLinks}>
                  {artist.website && (
                    <a href={artist.website} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      Website
                    </a>
                  )}
                  {artist.instagram && (
                    <a href={`https://instagram.com/${artist.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                      {artist.instagram}
                    </a>
                  )}
                  {artist.twitter && (
                    <a href={`https://twitter.com/${artist.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                      {artist.twitter}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exhibitions' && (
          <div className={styles.artistExhibitions}>
            <h2>Exhibition History</h2>
            <div className={styles.exhibitionsList}>
              {artist.exhibitions.map((exhibition: any, index: number) => (
                <div key={index} className={styles.exhibitionItem}>
                  <div className={styles.exhibitionDate}>{exhibition.date}</div>
                  <div className={styles.exhibitionDetails}>
                    <h3>{exhibition.title}</h3>
                    <p>{exhibition.venue}</p>
                  </div>
                  <span className={`${styles.exhibitionType} ${exhibition.type.toLowerCase() === 'solo' ? styles.solo : ''}`}>{exhibition.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className={styles.artistReviews}>
            <div className={styles.reviewsHeader}>
              <h2>Collector Reviews</h2>
              <div className={styles.reviewsSummary}>
                <div className={styles.ratingBig}>
                  <span className={styles.ratingNumber}>4.9</span>
                  <div className={styles.ratingStars}>{renderStars(5)}</div>
                  <span className={styles.ratingCount}>{artist.reviews.length} reviews</span>
                </div>
              </div>
            </div>
            
            <div className={styles.reviewsList}>
              {artist.reviews.map((review: any) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <div className={styles.reviewerAvatar} style={{backgroundImage: `url('${review.avatar}')`}}></div>
                      <div>
                        <span className={styles.reviewerName}>
                          {review.reviewer}
                          {review.verified && <span className={styles.verifiedPurchase}>✓ Verified Purchase</span>}
                        </span>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                    <div className={styles.reviewRating}>{renderStars(review.rating)}</div>
                  </div>
                  <h4 className={styles.reviewTitle}>{review.title}</h4>
                  <p className={styles.reviewText}>{review.text}</p>
                  <p className={styles.reviewArtwork}>Purchased: {review.artwork}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
