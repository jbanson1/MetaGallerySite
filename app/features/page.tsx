'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './features.module.css'


function WaitlistForm({ styles }: { styles: any }) {
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
        headers: {
          'Accept': 'application/json'
        }
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
        <h3>You&apos;re on the list!</h3>
        <p>Thanks for joining. We&apos;ll be in touch soon with early access details.</p>
      </div>
    )
  }

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit}>
      <div className={styles.waitlistFields}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
        />
        <select name="type" required>
          <option value="">I am a...</option>
          <option value="gallery_owner">Gallery Owner</option>
          <option value="artist">Artist</option>
          <option value="museum">Museum</option>
          <option value="buyer">Buyer</option>
          <option value="collector">Collector</option>
          <option value="other">Other</option>
        </select>
      </div>
      <input type="hidden" name="_subject" value="New Confidential Gallery Waitlist Signup" />
      <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
        <span>{isSubmitting ? 'Joining...' : 'Join the Waitlist'}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </form>
  )
}

export default function Features() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.floatingElement} ${styles.float1}`}></div>
        <div className={`${styles.floatingElement} ${styles.float2}`}></div>

        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.heroTag}>
              <span>Augmented Reality for Art</span>
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.line}><span>Transform how</span></span>
              <span className={styles.line}><span>visitors <em>experience</em></span></span>
              <span className={styles.line}><span>your gallery</span></span>
            </h1>
            <p className={styles.heroDescription}>
              Confidential Gallery brings artwork to life with AR overlays, audio guides, and instant access to rich context. No app download required.
            </p>
            <div className={styles.heroButtons}>
              <Link href="#how-it-works" className={styles.btnPrimary}>
                <span>See How It Works</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="#how-it-works" className={styles.btnSecondary}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Watch Demo
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            {/* Smart Glasses */}
            <div className={styles.heroGlasses}>
              <svg viewBox="0 0 400 160" className={styles.glassesSvg}>
                <defs>
                  <linearGradient id="lensGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#1a1a2e', stopOpacity:0.9}} />
                    <stop offset="50%" style={{stopColor:'#16213e', stopOpacity:0.85}} />
                    <stop offset="100%" style={{stopColor:'#0f0f1a', stopOpacity:0.95}} />
                  </linearGradient>
                  <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#2a2a2a'}} />
                    <stop offset="50%" style={{stopColor:'#1a1a1a'}} />
                    <stop offset="100%" style={{stopColor:'#0a0a0a'}} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Frame */}
                <path d="M 20 80 Q 20 40 60 40 L 140 40 Q 180 40 185 60 L 215 60 Q 220 40 260 40 L 340 40 Q 380 40 380 80 Q 380 120 340 120 L 260 120 Q 220 120 215 100 L 185 100 Q 180 120 140 120 L 60 120 Q 20 120 20 80 Z"
                      fill="url(#frameGradient)"
                      stroke="#333"
                      strokeWidth="1"/>

                {/* Left lens */}
                <rect x="35" y="50" width="130" height="60" rx="12" fill="url(#lensGradient)" className={styles.lens}/>

                {/* Right lens */}
                <rect x="235" y="50" width="130" height="60" rx="12" fill="url(#lensGradient)" className={styles.lens}/>

                {/* AR Display on right lens */}
                <g className={styles.arOverlay} filter="url(#glow)">
                  <rect x="245" y="58" width="110" height="44" rx="4" fill="rgba(201, 162, 39, 0.15)" stroke="var(--gold)" strokeWidth="0.5"/>
                  <text x="255" y="74" fill="var(--gold)" fontFamily="var(--font-playfair)" fontSize="10" fontWeight="600">Starry Night</text>
                  <text x="255" y="88" fill="rgba(248, 246, 241, 0.7)" fontFamily="var(--font-outfit)" fontSize="7">Van Gogh · 1889</text>

                  {/* Audio indicator */}
                  <circle cx="340" cy="70" r="6" fill="none" stroke="var(--gold)" strokeWidth="0.5"/>
                  <path d="M337 68 L337 72 M339 66 L339 74 M341 68 L341 72" stroke="var(--gold)" strokeWidth="0.8" className={styles.audioBars}/>
                </g>

                {/* Temple arms hints */}
                <path d="M 20 70 Q 5 70 0 65" stroke="#222" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M 380 70 Q 395 70 400 65" stroke="#222" strokeWidth="8" fill="none" strokeLinecap="round"/>

                {/* Nose bridge detail */}
                <ellipse cx="200" cy="85" rx="8" ry="4" fill="#1a1a1a"/>

                {/* Subtle LED indicator */}
                <circle cx="370" cy="55" r="2" fill="var(--gold)" className={styles.ledIndicator}/>
              </svg>

              <div className={styles.glassesLabel}>
                <span className={styles.labelTag}>Coming Soon</span>
                <span className={styles.labelText}>Smart Glasses Ready</span>
              </div>
            </div>

            {/* Phone */}
            <div className={styles.heroPhone}>
              <div className={styles.phoneScreen}>
                <div className={styles.phoneNotch}></div>
                <div className={styles.phoneContent}>
                  <div className={styles.phoneArtwork}>
                    <div className={styles.scanIndicator}></div>
                  </div>
                  <div className={styles.phoneInfoCard}>
                    <h4>Starry Night</h4>
                    <p>Vincent van Gogh · 1889</p>
                  </div>
                </div>
              </div>

              <div className={styles.phoneLabel}>
                <span className={styles.labelTag}>Available Now</span>
                <span className={styles.labelText}>Mobile Web AR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <span>Why Confidential Gallery</span>
          </div>
          <h2>Everything you need to create <em className={styles.serifItalic}>unforgettable</em> gallery visits</h2>
          <p>A complete platform for galleries, museums, and artists to enhance the visitor experience with AR technology.</p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>01</div>
            <h3>Instant Recognition</h3>
            <p>Visitors simply point their phone at any artwork. QR codes or image recognition triggers an immediate overlay with rich context and stories.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>02</div>
            <h3>Audio Storytelling</h3>
            <p>Upload narrated guides that bring each piece to life. Visitors can listen hands-free while they absorb the art — museum quality, zero infrastructure.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>03</div>
            <h3>Smart Glasses Ready</h3>
            <p>Built from day one for the AR glasses future. When visitors walk through your gallery wearing Meta Ray-Bans or similar devices, artwork info appears right in their field of view.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>04</div>
            <h3>No App Required</h3>
            <p>Works instantly in any mobile browser. Visitors scan and go — no downloads, no friction, no barriers to engagement.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>05</div>
            <h3>Analytics Dashboard</h3>
            <p>See which artworks get the most attention, track visitor engagement patterns, and understand your audience with real-time analytics.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>06</div>
            <h3>Multi-Language Support</h3>
            <p>Reach international visitors with automatic translations. Upload content once and serve it in multiple languages effortlessly.</p>
          </div>

          <div className={styles.featureCard} style={{borderColor:'rgba(201,162,39,0.25)', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute',top:'1rem',right:'1rem',background:'rgba(201,162,39,0.15)',border:'1px solid rgba(201,162,39,0.4)',color:'var(--gold)',fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.08em',padding:'0.2rem 0.6rem',textTransform:'uppercase'}}>Coming Soon</div>
            <div className={styles.featureNumber} style={{opacity:0.5}}>07</div>
            <h3>AI Art Identification</h3>
            <p>Point your phone, AR glasses, or smart device at any artwork — in a gallery, museum, or private collection — and instantly surface the listing. AI identifies the piece, pulls the artist profile, price, provenance, and purchase link from The Confidential Gallery in seconds.</p>
            <p style={{marginTop:'0.75rem',fontSize:'0.82rem',color:'rgba(248,246,241,0.45)',lineHeight:1.5}}>Works across mobile, Meta glasses, Apple Vision, and any AR-capable device. No QR code required.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <span>Simple Setup</span>
          </div>
          <h2>Live in <em className={styles.serifItalic}>minutes</em>, not months</h2>
          <p>No developers, no complex integrations. Just upload your art and you&apos;re ready to go.</p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.stepsVisual}>
            <img src="https://images.unsplash.com/photo-1577720643272-265f09367456?w=600&q=80" alt="Gallery view" className={styles.stepImage} />
            <img src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80" alt="Artwork detail" className={styles.stepImage} />
            <img src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80" alt="Visitor experience" className={styles.stepImage} />
          </div>

          <div className={styles.stepsContent}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div>
                <h3>Create your gallery</h3>
                <p>Sign up and add your gallery profile with name, logo, and location. Takes about 30 seconds.</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div>
                <h3>Add your artworks</h3>
                <p>For each piece, upload an image, add title/artist/year, write a description, and optionally attach an audio guide.</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div>
                <h3>Print & place QR codes</h3>
                <p>We generate unique QR codes for each artwork. Print the sheet and place labels beside your pieces.</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div>
                <h3>Go live</h3>
                <p>Hit publish and you&apos;re done. Visitors can start scanning immediately — no app install needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Waiting List */}
      <section className={styles.cta} id="waitlist">
        <div className={styles.ctaContent}>
          <h2>Ready to transform your <em className={styles.serifItalic}>gallery?</em></h2>
          <p>Start your journey with Confidential Gallery and create deeper connections between visitors and art.</p>

          <WaitlistForm styles={styles} />

          <p className={styles.waitlistNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Early access for the first 100 galleries. No credit card required.
          </p>
        </div>
      </section>
    </>
  )
}
