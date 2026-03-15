'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EventsPage() {
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNewsletterStatus('loading')
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const response = await fetch('https://formspree.io/f/xoqbqnpd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        setNewsletterStatus('success')
        form.reset()
      } else {
        setNewsletterStatus('error')
      }
    } catch {
      setNewsletterStatus('error')
    }
  }

  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <div className="page-tag">
          <span>Upcoming Events</span>
        </div>
        <h1>Art, Technology & <em className="serif-italic">Giving Back</em></h1>
        <p>Join us for exhibitions, workshops, and charity fundraisers where creativity meets purpose. A portion of every event supports arts education.</p>
      </header>

      {/* Event Filters */}
      <div className="event-filters">
        <button className="filter-btn active">All Events</button>
        <button className="filter-btn">Charity Fundraisers</button>
        <button className="filter-btn">Workshops</button>
        <button className="filter-btn">Exhibitions</button>
      </div>

      {/* Events Grid */}
      <section className="events-section">
        <div className="events-grid">
          
          {/* Featured Event */}
          <article className="event-card featured">
            <div className="event-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800&q=80')"}}>
              <span className="event-badge charity">Charity Gala</span>
            </div>
            <div className="event-content">
              <div className="event-date">
                <div className="event-date-box">
                  <span className="day">15</span>
                  <span className="month">Jun</span>
                </div>
                <div className="event-date-info">
                  <div className="time">7:00 PM – 11:00 PM</div>
                  <div>Saturday Evening</div>
                </div>
              </div>
              <h3>Art After Dark: Annual Charity Gala</h3>
              <p>Our flagship fundraising event returns with an evening of immersive AR art experiences, live performances, and a silent auction. All proceeds benefit the Arts Education Foundation, providing creative programs to underserved schools across the UK.</p>
              <div className="event-meta">
                <div className="event-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Tate Modern, London
                </div>
                <Link href="#" className="event-cta">Get Tickets</Link>
              </div>
            </div>
          </article>

          {/* Event 2 */}
          <article className="event-card">
            <div className="event-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1577720643272-265f09367456?w=600&q=80')"}}>
              <span className="event-badge workshop">Workshop</span>
            </div>
            <div className="event-content">
              <div className="event-date">
                <div className="event-date-box">
                  <span className="day">22</span>
                  <span className="month">Jun</span>
                </div>
                <div className="event-date-info">
                  <div className="time">2:00 PM – 5:00 PM</div>
                  <div>Saturday Afternoon</div>
                </div>
              </div>
              <h3>AR for Artists: Creating Digital Overlays</h3>
              <p>Learn how to enhance your physical artwork with digital layers. This hands-on workshop covers AR basics, storytelling techniques, and using Meta Gallery&apos;s creator tools.</p>
              <div className="event-meta">
                <div className="event-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Shoreditch Studios
                </div>
                <Link href="#" className="event-cta">Register</Link>
              </div>
            </div>
          </article>

          {/* Event 3 */}
          <article className="event-card">
            <div className="event-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80')"}}>
              <span className="event-badge charity">Fundraiser</span>
            </div>
            <div className="event-content">
              <div className="event-date">
                <div className="event-date-box">
                  <span className="day">5</span>
                  <span className="month">Jul</span>
                </div>
                <div className="event-date-info">
                  <div className="time">6:00 PM – 9:00 PM</div>
                  <div>Friday Evening</div>
                </div>
              </div>
              <h3>Young Artists Showcase</h3>
              <p>Celebrating emerging talent from local schools. Students present their first AR-enhanced exhibitions, with all donations supporting art supplies and technology access.</p>
              <div className="event-meta">
                <div className="event-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Hackney Arts Centre
                </div>
                <Link href="#" className="event-cta">Donate</Link>
              </div>
            </div>
          </article>

          {/* Event 4 */}
          <article className="event-card">
            <div className="event-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80')"}}>
              <span className="event-badge exhibition">Exhibition</span>
            </div>
            <div className="event-content">
              <div className="event-date">
                <div className="event-date-box">
                  <span className="day">12</span>
                  <span className="month">Jul</span>
                </div>
                <div className="event-date-info">
                  <div className="time">10:00 AM – 6:00 PM</div>
                  <div>Opens Saturday</div>
                </div>
              </div>
              <h3>Layers: Physical Meets Digital</h3>
              <p>A month-long exhibition exploring the intersection of traditional art and augmented reality. Featuring 20 artists who&apos;ve created dual-layer works specifically for AR viewing.</p>
              <div className="event-meta">
                <div className="event-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Serpentine Gallery
                </div>
                <Link href="#" className="event-cta">Learn More</Link>
              </div>
            </div>
          </article>

          {/* Event 5 */}
          <article className="event-card">
            <div className="event-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80')"}}>
              <span className="event-badge charity">Charity</span>
            </div>
            <div className="event-content">
              <div className="event-date">
                <div className="event-date-box">
                  <span className="day">28</span>
                  <span className="month">Jul</span>
                </div>
                <div className="event-date-info">
                  <div className="time">11:00 AM – 4:00 PM</div>
                  <div>Sunday Family Day</div>
                </div>
              </div>
              <h3>Art & Tech Family Fun Day</h3>
              <p>A free community event with AR treasure hunts, face painting, live art demonstrations, and interactive installations. Donations welcome for the Children&apos;s Art Trust.</p>
              <div className="event-meta">
                <div className="event-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Victoria Park, London
                </div>
                <Link href="#" className="event-cta">RSVP Free</Link>
              </div>
            </div>
          </article>

          {/* Event 6 */}
          <article className="event-card">
            <div className="event-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80')"}}>
              <span className="event-badge workshop">Workshop</span>
            </div>
            <div className="event-content">
              <div className="event-date">
                <div className="event-date-box">
                  <span className="day">8</span>
                  <span className="month">Aug</span>
                </div>
                <div className="event-date-info">
                  <div className="time">10:00 AM – 1:00 PM</div>
                  <div>Saturday Morning</div>
                </div>
              </div>
              <h3>Gallery Owner Masterclass</h3>
              <p>A deep-dive session for gallery owners and curators on implementing Meta Gallery. Covers setup, best practices, visitor engagement strategies, and measuring success.</p>
              <div className="event-meta">
                <div className="event-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Online + In-Person
                </div>
                <Link href="#" className="event-cta">Register</Link>
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="impact-container">
          <div className="impact-header">
            <h2>Our <em className="serif-italic">Impact</em> So Far</h2>
            <p>Every event, every scan, every subscription helps us support arts education and make creativity accessible to all.</p>
          </div>

          <div className="impact-stats">
            <div className="impact-stat">
              <div className="number">£47K</div>
              <div className="label">Donated to Charity</div>
            </div>
            <div className="impact-stat">
              <div className="number">12</div>
              <div className="label">Schools Supported</div>
            </div>
            <div className="impact-stat">
              <div className="number">2,400</div>
              <div className="label">Students Reached</div>
            </div>
            <div className="impact-stat">
              <div className="number">8</div>
              <div className="label">Charity Events Held</div>
            </div>
          </div>

          <div className="impact-partners">
            <span>Proud to support</span>
            <div className="partner-logo">Arts Education Foundation</div>
            <div className="partner-logo">Children&apos;s Art Trust</div>
            <div className="partner-logo">Creative Futures UK</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter-container">
          <h2>Stay in the <em className="serif-italic">loop</em></h2>
          <p>Get notified about upcoming events, charity initiatives, and the latest from Meta Gallery.</p>
          
          {newsletterStatus === 'success' ? (
            <div className="form-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p>You&apos;re subscribed! Check your inbox soon.</p>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="hidden" name="_subject" value="New Meta Gallery Events Subscriber" />
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                required 
              />
              <button type="submit" disabled={newsletterStatus === 'loading'}>
                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          
          {newsletterStatus === 'error' && (
            <p className="form-error">Something went wrong. Please try again.</p>
          )}
          
          <p className="form-note">Join 2,400+ art lovers. No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </>
  )
}