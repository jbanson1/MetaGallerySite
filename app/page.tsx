'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './home.module.css'

function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await fetch('https://formspree.io/f/xoqbqnpd', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={styles.formSuccess}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h3>You&apos;re part of the movement!</h3>
        <p>Thanks for joining. We&apos;ll be in touch soon with early access details.</p>
      </div>
    )
  }

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit}>
      <div className={styles.waitlistFields}>
        <input type="text" name="name" placeholder="Your name" required />
        <input type="email" name="email" placeholder="Email address" required />
        <select name="type" required>
          <option value="">I am a...</option>
          <option value="gallery_owner">Gallery Owner</option>
          <option value="artist">Artist</option>
          <option value="museum">Museum</option>
          <option value="curator">Curator</option>
          <option value="collector">Collector</option>
          <option value="other">Other</option>
        </select>
      </div>
      <input type="hidden" name="_subject" value="New Confidential Gallery Waitlist Signup" />
      <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
        <span>{isSubmitting ? 'Joining...' : 'Join the Movement'}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </form>
  )
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.floatingElement} ${styles.float1}`}></div>
        <div className={`${styles.floatingElement} ${styles.float2}`}></div>

        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <span>A New Kind of Gallery</span>
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.line}><span>Empowering Artists.</span></span>
            <span className={styles.line}><span>Connecting <em>Collectors.</em></span></span>
            <span className={styles.line}><span>Changing Lives.</span></span>
          </h1>
          <p className={styles.heroDescription}>
            We&apos;re building a global marketplace where emerging artists thrive, collectors discover extraordinary work, and every purchase makes a difference.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/artists" className={styles.btnPrimary}>
              <span>Explore Artists</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="#mission" className={styles.btnSecondary}>
              Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.mission} id="mission">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <span>Our Mission</span>
          </div>
          <h2>Art with <em className={styles.serifItalic}>purpose</em> at the centre</h2>
        </div>

        <div className={styles.pillarsGrid}>
          <div className={styles.pillar}>
            <div className={styles.pillarIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h3>Championing Emerging Artists</h3>
            <ul className={styles.pillarList}>
              <li>We give up-and-coming artists a global stage</li>
              <li>No gatekeepers, no galleries taking 50%</li>
              <li>Direct connection between artist and collector</li>
            </ul>
          </div>

          <div className={styles.pillar}>
            <div className={styles.pillarIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3>Connecting Collectors Worldwide</h3>
            <ul className={styles.pillarList}>
              <li>Discover extraordinary work from around the world</li>
              <li>Every piece has a story, every artist has a voice</li>
              <li>Build meaningful collections with purpose</li>
            </ul>
          </div>

          <div className={styles.pillar}>
            <div className={styles.pillarIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3>Giving Back Through Art</h3>
            <ul className={styles.pillarList}>
              <li>Artists keep 75% — one of the highest rates in digital art</li>
              <li>A portion of every sale goes to arts education charities</li>
              <li>We believe art should be accessible to everyone</li>
              <li>Every purchase directly funds the next generation of artists</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className={styles.technology} id="technology">
        <div className={styles.technologyInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <span>Technology</span>
            </div>
            <h2>Experience art like <em className={styles.serifItalic}>never before</em></h2>
            <p>We use cutting-edge technology to deepen the connection between you and the work you love.</p>
          </div>

          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <h4>AR Viewing</h4>
              <p>See artwork in your space before you buy — hold up your phone and watch it come to life on your wall.</p>
            </div>

            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
                </svg>
              </div>
              <h4>AI Art Identification</h4>
              <p>Point your phone or AR glasses at any artwork and instantly pull up the listing — artist, price, story, and availability. <em style={{color:'var(--gold)', fontSize:'0.8em'}}>Coming soon</em></p>
            </div>

            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
                  <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/>
                </svg>
              </div>
              <h4>Smart Glasses Ready</h4>
              <p>Built for the AR glasses future — Meta, Apple Vision, and beyond. Walk into any gallery and the art speaks to you. <em style={{color:'var(--gold)', fontSize:'0.8em'}}>Coming soon</em></p>
            </div>

            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <h4>Audio Stories</h4>
              <p>Hear the artist tell their story. Each piece comes with an intimate audio guide straight from the creator.</p>
            </div>
          </div>

          <div className={styles.technologyCta}>
            <Link href="/features" className={styles.btnPrimary}>
              <span>See How It Works</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>


      {/* Featured Artists Section */}
      <section className={styles.featuredArtists}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <span>Featured Artists</span>
          </div>
          <h2>Discover <em className={styles.serifItalic}>emerging talent</em></h2>
        </div>

        <div className={styles.artistsGrid}>
          <div className={styles.artistCard}>
            <div className={styles.artistImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80')"}}></div>
            <div className={styles.artistInfo}>
              <h4>Marcus Chen</h4>
              <p>Oil Painting · London</p>
            </div>
          </div>
          <div className={styles.artistCard}>
            <div className={styles.artistImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&q=80')"}}></div>
            <div className={styles.artistInfo}>
              <h4>Sofia Andersson</h4>
              <p>Photography · Stockholm</p>
            </div>
          </div>
          <div className={styles.artistCard}>
            <div className={styles.artistImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&q=80')"}}></div>
            <div className={styles.artistInfo}>
              <h4>Amara Okonkwo</h4>
              <p>Mixed Media · Lagos</p>
            </div>
          </div>
          <div className={styles.artistCard}>
            <div className={styles.artistImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80')"}}></div>
            <div className={styles.artistInfo}>
              <h4>Kai Tanaka</h4>
              <p>Digital Art · Tokyo</p>
            </div>
          </div>
        </div>

        <div className={styles.centeredCta}>
          <Link href="/artists" className={styles.btnPrimary}>
            <span>View All Artists</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Charity Section */}
      <section className={styles.charity} id="charity">
        <div className={styles.charityInner}>
          <div className={styles.charityContent}>
            <div className={styles.sectionTag}>
              <span>Art That Gives Back</span>
            </div>
            <h2>Every sale <em className={styles.serifItalic}>changes a life</em></h2>
            <p className={styles.charityDescription}>
              Artists keep 75% of every sale. A portion of the remainder goes towards charities helping young artists discover their craft.
            </p>
            <Link href="/events" className={styles.givingCta}>
              <span>Learn About Our Events</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className={styles.charityVisual}>
            <div className={styles.charityStatBig}>
              <span className={styles.bigNumber}>75%</span>
              <span className={styles.bigLabel}>kept by artists on every sale</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className={styles.dualCta}>
        <div className={styles.dualCtaGrid}>
          <div className={styles.ctaPanel}>
            <div className={styles.ctaPanelTag}>For Artists</div>
            <h3>Ready to share your work with the world?</h3>
            <p>Join our marketplace, keep 75% of every sale, and connect directly with collectors who value your vision.</p>
            <Link href="/features#waitlist" className={styles.btnPrimary}>
              <span>Apply to Join</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className={styles.ctaDivider}></div>
          <div className={styles.ctaPanel}>
            <div className={styles.ctaPanelTag}>For Collectors</div>
            <h3>Start your collection today</h3>
            <p>Discover original works from emerging artists around the world. Every piece tells a story — and every purchase makes a difference.</p>
            <Link href="/marketplace" className={styles.btnPrimary}>
              <span>Browse Marketplace</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Waitlist / Join the Movement */}
      <section className={styles.waitlistSection} id="waitlist">
        <div className={styles.waitlistContent}>
          <div className={styles.sectionTag}>
            <span>Join the Movement</span>
          </div>
          <h2>Be part of something <em className={styles.serifItalic}>bigger</em></h2>
          <p>Get early access, meet fellow collectors and artists, and help shape the future of the art world.</p>

          <WaitlistForm />

          <p className={styles.waitlistNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            No credit card required. Be among the first to experience the platform.
          </p>
        </div>
      </section>
    </>
  )
}
