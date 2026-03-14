import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="floating-element float-1"></div>
        <div className="floating-element float-2"></div>
        
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-tag">
              <span>Augmented Reality for Art</span>
            </div>
            <h1>
              <span className="line"><span>Transform how</span></span>
              <span className="line"><span>visitors <em>experience</em></span></span>
              <span className="line"><span>your gallery</span></span>
            </h1>
            <p className="hero-description">
              Meta Gallery brings artwork to life with AR overlays, audio guides, and instant access to rich context. No app download required.
            </p>
            <div className="hero-buttons">
              <Link href="#how-it-works" className="btn-primary">
                <span>See How It Works</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="#how-it-works" className="btn-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Watch Demo
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            {/* Smart Glasses */}
            <div className="hero-glasses">
              <svg viewBox="0 0 400 160" className="glasses-svg">
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
                <rect x="35" y="50" width="130" height="60" rx="12" fill="url(#lensGradient)" className="lens left-lens"/>
                
                {/* Right lens */}
                <rect x="235" y="50" width="130" height="60" rx="12" fill="url(#lensGradient)" className="lens right-lens"/>
                
                {/* AR Display on right lens */}
                <g className="ar-overlay" filter="url(#glow)">
                  <rect x="245" y="58" width="110" height="44" rx="4" fill="rgba(201, 162, 39, 0.15)" stroke="var(--gold)" strokeWidth="0.5"/>
                  <text x="255" y="74" fill="var(--gold)" fontFamily="var(--font-playfair)" fontSize="10" fontWeight="600">Starry Night</text>
                  <text x="255" y="88" fill="rgba(248, 246, 241, 0.7)" fontFamily="var(--font-outfit)" fontSize="7">Van Gogh · 1889</text>
                  
                  {/* Audio indicator */}
                  <circle cx="340" cy="70" r="6" fill="none" stroke="var(--gold)" strokeWidth="0.5"/>
                  <path d="M337 68 L337 72 M339 66 L339 74 M341 68 L341 72" stroke="var(--gold)" strokeWidth="0.8" className="audio-bars"/>
                </g>
                
                {/* Temple arms hints */}
                <path d="M 20 70 Q 5 70 0 65" stroke="#222" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M 380 70 Q 395 70 400 65" stroke="#222" strokeWidth="8" fill="none" strokeLinecap="round"/>
                
                {/* Nose bridge detail */}
                <ellipse cx="200" cy="85" rx="8" ry="4" fill="#1a1a1a"/>
                
                {/* Subtle LED indicator */}
                <circle cx="370" cy="55" r="2" fill="var(--gold)" className="led-indicator"/>
              </svg>
              
              <div className="glasses-label">
                <span className="label-tag">Coming Soon</span>
                <span className="label-text">Smart Glasses Ready</span>
              </div>
            </div>

            {/* Phone */}
            <div className="hero-phone">
              <div className="phone-screen">
                <div className="phone-notch"></div>
                <div className="phone-content">
                  <div className="phone-artwork">
                    <div className="scan-indicator"></div>
                  </div>
                  <div className="phone-info-card">
                    <h4>Starry Night</h4>
                    <p>Vincent van Gogh · 1889</p>
                  </div>
                </div>
              </div>
              
              <div className="phone-label">
                <span className="label-tag">Available Now</span>
                <span className="label-text">Mobile Web AR</span>
              </div>
            </div>
            
            {/* Connection line */}
            <svg className="connection-line" viewBox="0 0 200 300">
              <path d="M 100 0 Q 100 150 100 150 Q 100 150 50 300" stroke="url(#connectionGradient)" strokeWidth="1" fill="none" strokeDasharray="4 4" className="connection-path"/>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor:'var(--gold)', stopOpacity:0.5}} />
                  <stop offset="100%" style={{stopColor:'var(--gold)', stopOpacity:0.1}} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-header">
          <div className="section-tag">
            <span>Why Meta Gallery</span>
          </div>
          <h2>Everything you need to create <em className="serif-italic">unforgettable</em> gallery visits</h2>
          <p>A complete platform for galleries, museums, and artists to enhance the visitor experience with AR technology.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">01</div>
            <h3>Instant Recognition</h3>
            <p>Visitors simply point their phone at any artwork. QR codes or image recognition triggers an immediate overlay with rich context and stories.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">02</div>
            <h3>Audio Storytelling</h3>
            <p>Upload narrated guides that bring each piece to life. Visitors can listen hands-free while they absorb the art — museum quality, zero infrastructure.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">03</div>
            <h3>Smart Glasses Ready</h3>
            <p>Built from day one for the AR glasses future. When visitors walk through your gallery wearing Meta Ray-Bans or similar devices, artwork info appears right in their field of view — hands-free, magical.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">04</div>
            <h3>Simple Dashboard</h3>
            <p>Add exhibitions and artworks in minutes. Upload images, write descriptions, attach audio, and generate QR codes — all from one intuitive interface.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">05</div>
            <h3>Visitor Analytics</h3>
            <p>Understand what captivates your audience. See which artworks get the most attention, average viewing times, and popular tour paths.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">06</div>
            <h3>No App Required</h3>
            <p>Pure web technology means zero friction. Visitors scan and go — no App Store, no downloads, no waiting. Works on any smartphone.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-header">
          <div className="section-tag">
            <span>Simple Setup</span>
          </div>
          <h2>Live in <em className="serif-italic">minutes</em>, not months</h2>
          <p>No technical expertise required. If you can upload a photo, you can launch Meta Gallery.</p>
        </div>

        <div className="steps-container">
          <div className="steps-visual">
            <img src="https://images.unsplash.com/photo-1577720643272-265f09367456?w=600&q=80" alt="Gallery view" className="step-image" />
            <img src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80" alt="Artwork detail" className="step-image" />
            <img src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80" alt="Visitor experience" className="step-image" />
          </div>

          <div className="steps-content">
            <div className="step">
              <div className="step-number">1</div>
              <div>
                <h3>Create your gallery</h3>
                <p>Sign up and add your gallery profile with name, logo, and location. Takes about 30 seconds.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div>
                <h3>Add your artworks</h3>
                <p>For each piece, upload an image, add title/artist/year, write a description, and optionally attach an audio guide.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div>
                <h3>Print & place QR codes</h3>
                <p>We generate unique QR codes for each artwork. Print the sheet and place labels beside your pieces.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div>
                <h3>Go live</h3>
                <p>Hit publish and you&apos;re done. Visitors can start scanning immediately — no app install needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giving Back */}
      <section className="giving-back" id="giving-back">
        <div className="giving-container">
          <div className="giving-visual">
            <div className="charity-icon">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="var(--gold)" strokeWidth="1" opacity="0.3"/>
                <circle cx="40" cy="40" r="28" stroke="var(--gold)" strokeWidth="1" opacity="0.5"/>
                <path d="M40 20C40 20 25 32 25 42C25 52 32 58 40 58C48 58 55 52 55 42C55 32 40 20 40 20Z" fill="none" stroke="var(--gold)" strokeWidth="2"/>
                <path d="M40 30V50M32 40H48" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="charity-stat">
              <span className="stat-number">10%</span>
              <span className="stat-label">of proceeds donated</span>
            </div>
          </div>
          
          <div className="giving-content">
            <div className="section-tag">
              <span>Art for Good</span>
            </div>
            <h2>Technology with <em className="serif-italic">purpose</em></h2>
            <p className="giving-description">
              We believe art has the power to change lives. That&apos;s why 10% of all Meta Gallery proceeds go directly to arts education charities, supporting underfunded programs and bringing creative opportunities to communities that need them most.
            </p>
            <div className="giving-features">
              <div className="giving-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <div>
                  <h4>Arts Education</h4>
                  <p>Funding school programs, workshops, and museum visits for young people</p>
                </div>
              </div>
              <div className="giving-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <div>
                  <h4>Charity Events</h4>
                  <p>Regular fundraising exhibitions and AR experiences for causes that matter</p>
                </div>
              </div>
              <div className="giving-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <div>
                  <h4>Community Access</h4>
                  <p>Free Meta Gallery access for non-profit galleries and community spaces</p>
                </div>
              </div>
            </div>
            <Link href="/events" className="giving-cta">
              <span>View Upcoming Charity Events</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA / Waiting List */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to transform your <em className="serif-italic">gallery?</em></h2>
          <p>Join forward-thinking galleries and museums already using Meta Gallery to create deeper connections between visitors and art.</p>
          
          <form 
            className="waitlist-form"
            action="https://formspree.io/f/xoqbqnpd" 
            method="POST"
          >
            <div className="waitlist-fields">
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
                <option value="curator">Curator</option>
                <option value="collector">Collector</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input type="hidden" name="_subject" value="New Meta Gallery Waitlist Signup" />
            <button type="submit" className="btn-primary">
              <span>Join the Waitlist</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
          <p className="waitlist-note">
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
