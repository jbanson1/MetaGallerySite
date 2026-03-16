import Link from 'next/link'
import styles from './marketplace.module.css'

export const metadata = {
  title: 'Marketplace — Confidential Gallery',
  description: 'Discover and collect unique artworks, limited prints, and exclusive merchandise from galleries and artists worldwide.',
}

export default function MarketplacePage() {
  return (
    <>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageTag}>
          <span>Marketplace</span>
        </div>
        <h1>Collect <em className={styles.serifItalic}>extraordinary</em> art</h1>
        <p>Discover unique originals, limited edition prints, and exclusive merchandise from galleries and artists using Confidential Gallery.</p>
      </header>

      {/* Marketplace Filters */}
      <div className={styles.marketplaceFilters}>
        <div className={styles.filterGroup}>
          <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>All</button>
          <button className={styles.filterBtn}>Original Works</button>
          <button className={styles.filterBtn}>Limited Prints</button>
          <button className={styles.filterBtn}>Merchandise</button>
          <button className={styles.filterBtn}>AR Collectibles</button>
        </div>
        <div className={styles.filterSort}>
          <select className={styles.sortSelect}>
            <option>Recently Added</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Popular</option>
          </select>
        </div>
      </div>

      {/* Featured Banner */}
      <section className={styles.featuredBanner}>
        <div className={styles.featuredContent}>
          <span className={styles.featuredTag}>Featured Collection</span>
          <h2>Emerging Voices 2025</h2>
          <p>A curated collection from 12 breakthrough artists. Each piece includes exclusive AR content viewable through Confidential Gallery.</p>
          <Link href="#" className={styles.btnPrimary}>
            <span>Explore Collection</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className={styles.featuredImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80')"}}></div>
      </section>

      {/* Products Grid */}
      <section className={styles.marketplaceSection}>
        <div className={styles.productsGrid}>
          
          {/* Product 1 */}
          <article className={styles.productCard}>
            <div className={styles.productImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80')"}}>
              <span className={`${styles.productBadge} ${styles.productBadgeOriginal}`}>Original</span>
              <button className={styles.productFavorite} aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div className={styles.productArBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                AR Enhanced
              </div>
            </div>
            <div className={styles.productContent}>
              <div className={styles.productArtist}>
                <div className={styles.artistAvatar} style={{backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80')"}}></div>
                <span>Marcus Chen</span>
              </div>
              <h3>Ephemeral Light No. 7</h3>
              <p className={styles.productDetails}>Oil on canvas · 80 × 100 cm · 2024</p>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>
                  <span className={styles.price}>£2,400</span>
                </div>
                <Link href="#" className={styles.productCta}>View</Link>
              </div>
            </div>
          </article>

          {/* Product 2 */}
          <article className={styles.productCard}>
            <div className={styles.productImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80')"}}>
              <span className={`${styles.productBadge} ${styles.productBadgePrint}`}>Limited Print</span>
              <button className={styles.productFavorite} aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div className={styles.productContent}>
              <div className={styles.productArtist}>
                <div className={styles.artistAvatar} style={{backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80')"}}></div>
                <span>Sofia Andersson</span>
              </div>
              <h3>Urban Reflections III</h3>
              <p className={styles.productDetails}>Giclée print · 50 × 70 cm · Ed. of 50</p>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>
                  <span className={styles.price}>£180</span>
                  <span className={styles.edition}>23/50 available</span>
                </div>
                <Link href="#" className={styles.productCta}>View</Link>
              </div>
            </div>
          </article>

          {/* Product 3 */}
          <article className={styles.productCard}>
            <div className={styles.productImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80')"}}>
              <span className={`${styles.productBadge} ${styles.productBadgeAr}`}>AR Collectible</span>
              <button className={styles.productFavorite} aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div className={styles.productArBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                AR Enhanced
              </div>
            </div>
            <div className={styles.productContent}>
              <div className={styles.productArtist}>
                <div className={styles.artistAvatar} style={{backgroundImage: "url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80')"}}></div>
                <span>Digital Collective</span>
              </div>
              <h3>Dimensional Shift #042</h3>
              <p className={styles.productDetails}>Print + AR Layer · 40 × 40 cm · Ed. of 100</p>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>
                  <span className={styles.price}>£95</span>
                  <span className={styles.edition}>67/100 available</span>
                </div>
                <Link href="#" className={styles.productCta}>View</Link>
              </div>
            </div>
          </article>

          {/* Product 4 */}
          <article className={styles.productCard}>
            <div className={styles.productImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=600&q=80')"}}>
              <span className={`${styles.productBadge} ${styles.productBadgeOriginal}`}>Original</span>
              <button className={styles.productFavorite} aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div className={styles.productContent}>
              <div className={styles.productArtist}>
                <div className={styles.artistAvatar} style={{backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80')"}}></div>
                <span>Amara Okonkwo</span>
              </div>
              <h3>Ancestral Memory</h3>
              <p className={styles.productDetails}>Mixed media on canvas · 120 × 90 cm · 2024</p>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>
                  <span className={styles.price}>£5,800</span>
                </div>
                <Link href="#" className={styles.productCta}>View</Link>
              </div>
            </div>
          </article>

          {/* Product 5 */}
          <article className={styles.productCard}>
            <div className={styles.productImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80')"}}>
              <span className={`${styles.productBadge} ${styles.productBadgePrint}`}>Limited Print</span>
              <button className={styles.productFavorite} aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div className={styles.productArBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                AR Enhanced
              </div>
            </div>
            <div className={styles.productContent}>
              <div className={styles.productArtist}>
                <div className={styles.artistAvatar} style={{backgroundImage: "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80')"}}></div>
                <span>James Whitmore</span>
              </div>
              <h3>London After Rain</h3>
              <p className={styles.productDetails}>Giclée print · 60 × 40 cm · Ed. of 25</p>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>
                  <span className={styles.price}>£320</span>
                  <span className={styles.edition}>8/25 available</span>
                </div>
                <Link href="#" className={styles.productCta}>View</Link>
              </div>
            </div>
          </article>

          {/* Product 6 */}
          <article className={styles.productCard}>
            <div className={styles.productImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80')"}}>
              <span className={`${styles.productBadge} ${styles.productBadgeOriginal}`}>Original</span>
              <button className={styles.productFavorite} aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div className={styles.productContent}>
              <div className={styles.productArtist}>
                <div className={styles.artistAvatar} style={{backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80')"}}></div>
                <span>Elena Vasquez</span>
              </div>
              <h3>Chromatic Study #12</h3>
              <p className={styles.productDetails}>Acrylic on canvas · 100 × 80 cm · 2024</p>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>
                  <span className={styles.price}>£1,850</span>
                </div>
                <Link href="#" className={styles.productCta}>View</Link>
              </div>
            </div>
          </article>

          {/* Product 7 */}
          <article className={styles.productCard}>
            <div className={styles.productImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=600&q=80')"}}>
              <span className={`${styles.productBadge} ${styles.productBadgeAr}`}>AR Collectible</span>
              <button className={styles.productFavorite} aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div className={styles.productArBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                AR Enhanced
              </div>
            </div>
            <div className={styles.productContent}>
              <div className={styles.productArtist}>
                <div className={styles.artistAvatar} style={{backgroundImage: "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80')"}}></div>
                <span>Kai Tanaka</span>
              </div>
              <h3>Neon Dreams Series</h3>
              <p className={styles.productDetails}>Print + AR animation · 30 × 30 cm · Ed. of 200</p>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>
                  <span className={styles.price}>£65</span>
                  <span className={styles.edition}>142/200 available</span>
                </div>
                <Link href="#" className={styles.productCta}>View</Link>
              </div>
            </div>
          </article>

          {/* Product 8 */}
          <article className={styles.productCard}>
            <div className={styles.productImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80')"}}>
              <span className={`${styles.productBadge} ${styles.productBadgeOriginal}`}>Original</span>
              <button className={styles.productFavorite} aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div className={styles.productArBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                AR Enhanced
              </div>
            </div>
            <div className={styles.productContent}>
              <div className={styles.productArtist}>
                <div className={styles.artistAvatar} style={{backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80')"}}></div>
                <span>Marcus Chen</span>
              </div>
              <h3>Morning Mist</h3>
              <p className={styles.productDetails}>Oil on canvas · 90 × 70 cm · 2024</p>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>
                  <span className={styles.price}>£1,800</span>
                </div>
                <Link href="#" className={styles.productCta}>View</Link>
              </div>
            </div>
          </article>

        </div>

        {/* Load More */}
        <div className={styles.loadMore}>
          <button className={styles.loadMoreBtn}>
            Load More
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Sell With Us */}
      <section className={styles.sellSection}>
        <div className={styles.sellContainer}>
          <div className={styles.sellContent}>
            <div className={styles.sectionTag}>
              <span>For Artists & Galleries</span>
            </div>
            <h2>Sell with <em className={styles.serifItalic}>Confidential Gallery</em></h2>
            <p className={styles.sellDescription}>
              Join our marketplace and reach collectors worldwide. List original works, limited prints, or AR-enhanced collectibles. We handle payments, shipping coordination, and provide AR tools to make your work stand out.
            </p>
            <div className={styles.sellFeatures}>
              <div className={styles.sellFeature}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <div>
                  <h4>Simple Payments</h4>
                  <p>Secure transactions with payouts to your account</p>
                </div>
              </div>
              <div className={styles.sellFeature}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <div>
                  <h4>AR Integration</h4>
                  <p>Add AR layers to make your pieces interactive</p>
                </div>
              </div>
              <div className={styles.sellFeature}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <div>
                  <h4>Global Reach</h4>
                  <p>Connect with collectors from around the world</p>
                </div>
              </div>
            </div>
            <div className={styles.sellCtaGroup}>
              <Link href="/#waitlist" className={styles.btnPrimary}>
                <span>Apply to Sell</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <span className={styles.sellNote}>10% commission · No listing fees</span>
            </div>
          </div>
          <div className={styles.sellVisual}>
            <div className={styles.sellStatCard}>
              <div className={styles.statIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div>
                <div className={styles.statValue}>£320K+</div>
                <div className={styles.statDesc}>Sales through our platform</div>
              </div>
            </div>
            <div className={styles.sellStatCard}>
              <div className={styles.statIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className={styles.statValue}>180+</div>
                <div className={styles.statDesc}>Artists & galleries selling</div>
              </div>
            </div>
            <div className={styles.sellStatCard}>
              <div className={styles.statIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <div className={styles.statValue}>48hrs</div>
                <div className={styles.statDesc}>Average approval time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className={styles.trustSection}>
        <div className={styles.trustContainer}>
          <div className={styles.trustItem}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Secure Payments</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Buyer Protection</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Authenticity Guaranteed</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </section>
    </>
  )
}
