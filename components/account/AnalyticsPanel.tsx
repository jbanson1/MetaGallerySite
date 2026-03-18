'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/auth/context'
import styles from './panels.module.css'

interface AnalyticsPanelProps {
  profile: Profile
}

interface MonthlyData {
  month: string
  enquiries: number
  views: number
}

// Last 6 months labels
function getLast6Months(): MonthlyData[] {
  const months: MonthlyData[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      month: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      enquiries: 0,
      views: 0,
    })
  }
  return months
}

export default function AnalyticsPanel({ profile }: AnalyticsPanelProps) {
  const [loading, setLoading] = useState(true)
  const [totalPreviews, setTotalPreviews] = useState(0)
  const [totalCurators, setTotalCurators] = useState(0)
  const [totalMessages, setTotalMessages] = useState(0)
  const [monthlyData] = useState<MonthlyData[]>(getLast6Months())
  const [locationData, setLocationData] = useState<{ location: string; count: number }[]>([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [previewsRes, curatorsRes, messagesRes, locationsRes] = await Promise.all([
          supabase
            .from('previews')
            .select('id', { count: 'exact', head: true })
            .eq('artist_id', profile.id),
          supabase
            .from('artist_curators')
            .select('id', { count: 'exact', head: true })
            .eq('artist_id', profile.id),
          supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('recipient_id', profile.id),
          supabase
            .from('profiles')
            .select('location')
            .in(
              'id',
              (
                await supabase
                  .from('artist_curators')
                  .select('curator_id')
                  .eq('artist_id', profile.id)
              ).data?.map((r: { curator_id: string }) => r.curator_id) ?? []
            )
            .not('location', 'is', null),
        ])

        setTotalPreviews(previewsRes.count ?? 0)
        setTotalCurators(curatorsRes.count ?? 0)
        setTotalMessages(messagesRes.count ?? 0)

        // Aggregate curator locations
        const raw = (locationsRes.data ?? []) as { location: string }[]
        const map: Record<string, number> = {}
        for (const row of raw) {
          if (!row.location) continue
          // Use the last part of "City, Country" as the region label
          const parts = row.location.split(',')
          const region = (parts[parts.length - 1] ?? row.location).trim()
          map[region] = (map[region] ?? 0) + 1
        }
        const sorted = Object.entries(map)
          .map(([location, count]) => ({ location, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)
        setLocationData(sorted)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [profile.id])

  const maxBar = Math.max(...monthlyData.map(m => m.enquiries), 1)

  if (loading) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <div className={`${styles.panel} ${styles.analyticsPanel}`}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Analytics</h2>
          <p className={styles.panelSubtitle}>An overview of your presence and activity on the platform.</p>
        </div>
      </div>

      {/* ── Overview KPI cards ─────────────────────────────── */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <div className={styles.kpiValue}>{totalPreviews}</div>
          <div className={styles.kpiLabel}>Artworks uploaded</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className={styles.kpiValue}>{totalCurators}</div>
          <div className={styles.kpiLabel}>Curator connections</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div className={styles.kpiValue}>{totalMessages}</div>
          <div className={styles.kpiLabel}>Messages received</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className={styles.kpiValue}>—</div>
          <div className={styles.kpiLabel}>Total sales</div>
        </div>
      </div>

      {/* ── Sales / enquiries over time ────────────────────── */}
      <div className={styles.analyticsSection}>
        <h3 className={styles.analyticsSectionTitle}>Enquiries over time</h3>
        <p className={styles.analyticsSectionSubtitle}>Message enquiries received per month</p>
        <div className={styles.barChart}>
          {monthlyData.map((m) => (
            <div key={m.month} className={styles.barGroup}>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ height: `${Math.round((m.enquiries / maxBar) * 100)}%` }}
                  title={`${m.enquiries} enquiries`}
                />
              </div>
              <span className={styles.barLabel}>{m.month}</span>
              <span className={styles.barValue}>{m.enquiries}</span>
            </div>
          ))}
        </div>
        {monthlyData.every(m => m.enquiries === 0) && (
          <p className={styles.analyticsNote}>Enquiry data will appear here as curators reach out to you.</p>
        )}
      </div>

      {/* ── Audience by location ───────────────────────────── */}
      <div className={styles.analyticsSection}>
        <h3 className={styles.analyticsSectionTitle}>Audience by location</h3>
        <p className={styles.analyticsSectionSubtitle}>Regions your connected curators are based in</p>

        {locationData.length === 0 ? (
          <p className={styles.analyticsNote}>Location data will appear here once you have curator connections.</p>
        ) : (
          <div className={styles.locationList}>
            {locationData.map(({ location, count }, i) => {
              const pct = Math.round((count / totalCurators) * 100)
              return (
                <div key={location} className={styles.locationRow}>
                  <span className={styles.locationRank}>#{i + 1}</span>
                  <span className={styles.locationName}>{location}</span>
                  <div className={styles.locationBar}>
                    <div className={styles.locationBarFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.locationCount}>{count}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
