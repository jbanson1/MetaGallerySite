'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type ConsentValue = 'all' | 'necessary' | null

const CONSENT_KEY = 'cg_cookie_consent'
const CONSENT_VERSION = '1' // bump this to re-show banner after policy changes

export function getCookieConsent(): ConsentValue {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const { value, version } = JSON.parse(raw)
    if (version !== CONSENT_VERSION) return null
    return value as ConsentValue
  } catch {
    return null
  }
}

function setConsentValue(value: 'all' | 'necessary') {
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, version: CONSENT_VERSION }))
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (getCookieConsent() === null) {
      // Small delay so it doesn't flash on initial render
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function accept() {
    setConsentValue('all')
    setVisible(false)
  }

  function necessary() {
    setConsentValue('necessary')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'rgba(14,14,14,0.97)',
      borderTop: '1px solid rgba(201,162,39,0.25)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(201,162,39,0.8)" strokeWidth="1.5" style={{flexShrink:0, marginTop:'2px'}}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>

        {/* Text */}
        <div style={{flex:1, minWidth:'220px'}}>
          <p style={{
            margin: '0 0 0.25rem',
            fontSize: '0.9rem',
            color: 'rgba(248,246,241,0.9)',
            fontFamily: 'var(--font-outfit), sans-serif',
            lineHeight: 1.5,
          }}>
            <strong style={{color:'#f8f6f1'}}>We use cookies</strong> to keep you signed in and improve your experience.
            {' '}
            <button
              onClick={() => setShowDetails(v => !v)}
              style={{background:'none',border:'none',color:'rgba(201,162,39,0.9)',cursor:'pointer',padding:0,fontSize:'inherit',textDecoration:'underline'}}
            >
              {showDetails ? 'Hide details' : 'What we use'}
            </button>
          </p>
          <p style={{margin:0, fontSize:'0.78rem', color:'rgba(248,246,241,0.45)', fontFamily:'var(--font-outfit), sans-serif'}}>
            Under UK GDPR you have the right to choose. See our{' '}
            <Link href="/privacy" style={{color:'rgba(201,162,39,0.7)', textDecoration:'underline'}}>Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/cookies" style={{color:'rgba(201,162,39,0.7)', textDecoration:'underline'}}>Cookie Policy</Link>.
          </p>
        </div>

        {/* Buttons */}
        <div style={{display:'flex', gap:'0.6rem', flexShrink:0, alignItems:'center'}}>
          <button
            onClick={necessary}
            style={{
              padding: '0.55rem 1rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(248,246,241,0.7)',
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.4)'; (e.target as HTMLElement).style.color = '#f8f6f1' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.target as HTMLElement).style.color = 'rgba(248,246,241,0.7)' }}
          >
            Necessary only
          </button>
          <button
            onClick={accept}
            style={{
              padding: '0.55rem 1.25rem',
              background: 'var(--gold, #c9a227)',
              border: 'none',
              color: '#0e0e0e',
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '0.88' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '1' }}
          >
            Accept all
          </button>
        </div>
      </div>

      {/* Expandable details */}
      {showDetails && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}>
          {[
            { name: 'Strictly necessary', desc: 'Session cookies to keep you signed in. Cannot be disabled.', required: true },
            { name: 'Functional', desc: 'Remember your preferences (favourites, AR settings, theme).', required: false },
            { name: 'Analytics', desc: 'Anonymous usage data to improve the platform. Only enabled with consent.', required: false },
          ].map(c => (
            <div key={c.name} style={{
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '2px',
            }}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
                <strong style={{fontSize:'0.8rem',color:'#f8f6f1',fontFamily:'var(--font-outfit),sans-serif'}}>{c.name}</strong>
                <span style={{fontSize:'0.7rem',color:c.required ? 'var(--gold,#c9a227)' : 'rgba(248,246,241,0.4)',fontFamily:'var(--font-outfit),sans-serif'}}>
                  {c.required ? 'Always on' : 'Optional'}
                </span>
              </div>
              <p style={{margin:0,fontSize:'0.75rem',color:'rgba(248,246,241,0.5)',fontFamily:'var(--font-outfit),sans-serif',lineHeight:1.4}}>{c.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
