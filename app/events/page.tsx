'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './events.module.css'

function NewsletterForm() {
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
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p>You&apos;re subscribed! We&apos;ll keep you updated.</p>
      </div>
    )
  }

  return (
    <form className={styles.newsletterForm} onSubmit={handleSubmit}>
      <input 
        type="email" 
        name="email"
        placeholder="Enter your email" 
        required 
      />
      <input type="hidden" name="_subject" value="New Confidential Gallery Events Subscriber" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  )
}

export default function EventsPage() {
  return (
    <>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageTag}>
          <span>Upcoming Events</span>
        </div>
        <h1>Art, Technology & <em className={styles.serifItalic}>Giving Back</em></h1>
        <p>Join us for exhibitions, workshops, and charity fundraisers where creativity meets purpose. A portion of every event supports arts education.</p>
      </header>

      {/* Event Filters */}
      <div className={styles.eventFilters}>
        <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>All Events</button>
        <button className={styles.filterBtn}>Charity Fundraisers</button>
        <button className={styles.filterBtn}>Workshops</button>
        <button className={styles.filterBtn}>Exhibitions</button>
      </div>

      {/* Events Grid */}
      <section className={styles.eventsSection}>
        <div className={styles.eventsGrid}>
          
          {/* Featured Event */}
          <article className={`${styles.eventCard} ${styles.eventCardFeatured}`}>
            <div className={styles.eventImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800&q=80')"}}>
              <span className={`${styles.eventBadge} ${styles.eventBadgeCharity}`}>Charity Gala</span>
            </div>
            <div className={styles.eventContent}>
              <div className={styles.eventDate}>
                <div className={styles.eventDateBox}>
                  <span className={styles.day}>15</span>
                  <span className={styles.month}>Jun</span>
                </div>
                <div className={styles.eventDateInfo}>
                  <div className={styles.time}>7:00 PM – 11:00 PM</div>
                  <div>Saturday Evening</div>
                </div>
              </div>
              <h3>Art After Dark: Annual Charity Gala</h3>
              <p>Our flagship fundraising event returns with an evening of immersive AR art experiences, live performances, and a silent auction. All proceeds benefit the Arts Education Foundation, providing creative programs to underserved schools across the UK.</p>
              <div className={styles.eventMeta}>
                <div className={styles.eventLocation}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Tate Modern, London
                </div>
                <Link href="#" className={styles.eventCta}>Get Tickets</Link>
              </div>
            </div>
          </article>

          {/* Event 2 */}
          <article className={styles.eventCard}>
            <div className={styles.eventImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1577720643272-265f09367456?w=600&q=80')"}}>
              <span className={`${styles.eventBadge} ${styles.eventBadgeWorkshop}`}>Workshop</span>
            </div>
            <div className={styles.eventContent}>
              <div className={styles.eventDate}>
                <div className={styles.eventDateBox}>
                  <span className={styles.day}>22</span>
                  <span className={styles.month}>Jun</span>
                </div>
                <div className={styles.eventDateInfo}>
                  <div className={styles.time}>2:00 PM – 5:00 PM</div>
                  <div>Saturday Afternoon</div>
                </div>
              </div>
              <h3>AR for Artists: Creating Digital Overlays</h3>
              <p>Learn how to enhance your physical artwork with digital layers. This hands-on workshop covers AR basics, storytelling techniques, and using Confidential Gallery&apos;s creator tools.</p>
              <div className={styles.eventMeta}>
                <div className={styles.eventLocation}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Shoreditch Studios
                </div>
                <Link href="#" className={styles.eventCta}>Register</Link>
              </div>
            </div>
          </article>

          {/* Event 3 */}
          <article className={styles.eventCard}>
            <div className={styles.eventImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80')"}}>
              <span className={`${styles.eventBadge} ${styles.eventBadgeCharity}`}>Fundraiser</span>
            </div>
            <div className={styles.eventContent}>
              <div className={styles.eventDate}>
                <div className={styles.eventDateBox}>
                  <span className={styles.day}>5</span>
                  <span className={styles.month}>Jul</span>
                </div>
                <div className={styles.eventDateInfo}>
                  <div className={styles.time}>6:00 PM – 9:00 PM</div>
                  <div>Friday Evening</div>
                </div>
              </div>
              <h3>Young Artists Showcase</h3>
              <p>Celebrating emerging talent from local schools. Students present their first AR-enhanced exhibitions, with all donations supporting art supplies and technology access.</p>
              <div className={styles.eventMeta}>
                <div className={styles.eventLocation}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Hackney Arts Centre
                </div>
                <Link href="#" className={styles.eventCta}>Donate</Link>
              </div>
            </div>
          </article>

          {/* Event 4 */}
          <article className={styles.eventCard}>
            <div className={styles.eventImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80')"}}>
              <span className={`${styles.eventBadge} ${styles.eventBadgeExhibition}`}>Exhibition</span>
            </div>
            <div className={styles.eventContent}>
              <div className={styles.eventDate}>
                <div className={styles.eventDateBox}>
                  <span className={styles.day}>12</span>
                  <span className={styles.month}>Jul</span>
                </div>
                <div className={styles.eventDateInfo}>
                  <div className={styles.time}>10:00 AM – 6:00 PM</div>
                  <div>Opens Saturday</div>
                </div>
              </div>
              <h3>Layers: Physical Meets Digital</h3>
              <p>A month-long exhibition exploring the intersection of traditional art and augmented reality. Featuring 20 artists who&apos;ve created dual-layer works specifically for AR viewing.</p>
              <div className={styles.eventMeta}>
                <div className={styles.eventLocation}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Serpentine Gallery
                </div>
                <Link href="#" className={styles.eventCta}>Learn More</Link>
              </div>
            </div>
          </article>

          {/* Event 5 */}
          <article className={styles.eventCard}>
            <div className={styles.eventImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80')"}}>
              <span className={`${styles.eventBadge} ${styles.eventBadgeCharity}`}>Charity</span>
            </div>
            <div className={styles.eventContent}>
              <div className={styles.eventDate}>
                <div className={styles.eventDateBox}>
                  <span className={styles.day}>28</span>
                  <span className={styles.month}>Jul</span>
                </div>
                <div className={styles.eventDateInfo}>
                  <div className={styles.time}>11:00 AM – 4:00 PM</div>
                  <div>Sunday Family Day</div>
                </div>
              </div>
              <h3>Art & Tech Family Fun Day</h3>
              <p>A free community event with AR treasure hunts, face painting, live art demonstrations, and interactive installations. Donations welcome for the Children&apos;s Art Trust.</p>
              <div className={styles.eventMeta}>
                <div className={styles.eventLocation}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Victoria Park, London
                </div>
                <Link href="#" className={styles.eventCta}>RSVP Free</Link>
              </div>
            </div>
          </article>

          {/* Event 6 */}
          <article className={styles.eventCard}>
            <div className={styles.eventImage} style={{backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80')"}}>
              <span className={`${styles.eventBadge} ${styles.eventBadgeWorkshop}`}>Workshop</span>
            </div>
            <div className={styles.eventContent}>
              <div className={styles.eventDate}>
                <div className={styles.eventDateBox}>
                  <span className={styles.day}>8</span>
                  <span className={styles.month}>Aug</span>
                </div>
                <div className={styles.eventDateInfo}>
                  <div className={styles.time}>10:00 AM – 1:00 PM</div>
                  <div>Saturday Morning</div>
                </div>
              </div>
              <h3>Gallery Owner Masterclass</h3>
              <p>A deep-dive session for gallery owners and curators on implementing Confidential Gallery. Covers setup, best practices, visitor engagement strategies, and measuring success.</p>
              <div className={styles.eventMeta}>
                <div className={styles.eventLocation}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Online + In-Person
                </div>
                <Link href="#" className={styles.eventCta}>Register</Link>
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* Impact Section */}
      <section className={styles.impactSection}>
        <div className={styles.impactContainer}>
          <div className={styles.impactHeader}>
            <h2>Our <em className={styles.serifItalic}>Impact</em> So Far</h2>
            <p>Every event, every scan, every subscription helps us support arts education and make creativity accessible to all.</p>
          </div>

          <div className={styles.impactStats}>
            <div className={styles.impactStat}>
              <div className={styles.number}>£47K</div>
              <div className={styles.label}>Donated to Charity</div>
            </div>
            <div className={styles.impactStat}>
              <div className={styles.number}>12</div>
              <div className={styles.label}>Schools Supported</div>
            </div>
            <div className={styles.impactStat}>
              <div className={styles.number}>2,400</div>
              <div className={styles.label}>Students Reached</div>
            </div>
            <div className={styles.impactStat}>
              <div className={styles.number}>8</div>
              <div className={styles.label}>Charity Events Held</div>
            </div>
          </div>

          <div className={styles.impactPartners}>
            <span>Proud to support</span>
            <div className={styles.partnerLogo}>Arts Education Foundation</div>
            <div className={styles.partnerLogo}>Children&apos;s Art Trust</div>
            <div className={styles.partnerLogo}>Creative Futures UK</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContainer}>
          <h2>Stay in the <em className={styles.serifItalic}>loop</em></h2>
          <p>Get notified about upcoming events, charity initiatives, and the latest from Confidential Gallery.</p>
          <NewsletterForm />
          <p className={styles.formNote}>Join 2,400+ art lovers. No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </>
  )
}