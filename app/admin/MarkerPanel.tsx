'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Artwork, Marker } from '@/lib/database.types'
import styles from './admin.module.css'

interface Props {
  galleryId: string
  artworks: Artwork[]
  markers: Marker[]
  onMarkersChange: (markers: Marker[]) => void
}

function generateMarkerId(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let id = 'CG-'
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export default function MarkerPanel({ galleryId, artworks, markers, onMarkersChange }: Props) {
  const [selectedArtworkId, setSelectedArtworkId] = useState('')
  const [label, setLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedArtworkId) { setError('Select an artwork first.'); return }
    setCreating(true)
    setError('')

    // Generate unique marker ID (retry on collision)
    let markerId = generateMarkerId()
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('markers')
        .select('id')
        .eq('marker_id', markerId)
        .single()
      if (!existing) break
      markerId = generateMarkerId()
      attempts++
    }

    const { data, error: err } = await supabase
      .from('markers')
      .insert({
        marker_id: markerId,
        artwork_id: selectedArtworkId,
        gallery_id: galleryId,
        label: label.trim() || null,
        is_active: true,
      })
      .select()
      .single()

    if (err) { setError(err.message); setCreating(false); return }
    onMarkersChange([data as Marker, ...markers])
    setSelectedArtworkId('')
    setLabel('')
    setCreating(false)
  }

  async function handleToggle(marker: Marker) {
    const { data } = await supabase
      .from('markers')
      .update({ is_active: !marker.is_active })
      .eq('id', marker.id)
      .select()
      .single()
    if (data) onMarkersChange(markers.map((m) => (m.id === data.id ? data as Marker : m)))
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this marker? Existing QR codes printed with this ID will stop working.')) return
    await supabase.from('markers').delete().eq('id', id)
    onMarkersChange(markers.filter((m) => m.id !== id))
  }

  function getScanUrl(markerId: string): string {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://theconfidential.gallery'
    return `${base}/scan/${markerId}`
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  const artworkMap = new Map(artworks.map((a) => [a.id, a]))

  return (
    <div>
      {/* Create marker form */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Generate new marker</h2>
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Artwork *</label>
              <select value={selectedArtworkId} onChange={(e) => setSelectedArtworkId(e.target.value)} required>
                <option value="">— Select artwork —</option>
                {artworks.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} — {a.artist_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formField}>
              <label>Label (optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Room 1, Plinth A"
              />
            </div>
          </div>
          {error && <p className={styles.formError}>{error}</p>}
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn} disabled={creating}>
              {creating ? 'Generating…' : 'Generate marker'}
            </button>
          </div>
        </form>
      </div>

      {/* Markers list */}
      {markers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No markers yet. Generate one above to get your first QR code URL.</p>
        </div>
      ) : (
        <div className={styles.markerList}>
          {markers.map((marker) => {
            const artwork = artworkMap.get(marker.artwork_id)
            const scanUrl = getScanUrl(marker.marker_id)
            return (
              <div key={marker.id} className={`${styles.markerCard} ${!marker.is_active ? styles.inactiveCard : ''}`}>
                <div className={styles.markerCardHeader}>
                  <div>
                    <code className={styles.markerIdLarge}>{marker.marker_id}</code>
                    {marker.label && <span className={styles.markerLabel}>{marker.label}</span>}
                  </div>
                  <span className={`${styles.badge} ${marker.is_active ? styles.badgeActive : styles.badgeInactive}`}>
                    {marker.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {artwork && (
                  <p className={styles.markerArtwork}>
                    {artwork.title} — {artwork.artist_name}
                  </p>
                )}

                <div className={styles.markerUrl}>
                  <span className={styles.markerUrlText}>{scanUrl}</span>
                  <button
                    className={styles.copyBtn}
                    onClick={() => copyToClipboard(scanUrl)}
                    title="Copy scan URL"
                  >
                    Copy
                  </button>
                </div>

                <div className={styles.markerHint}>
                  Use this URL to generate a QR code. Print and place next to the artwork.
                </div>

                <div className={styles.artworkCardActions}>
                  <button className={styles.actionBtn} onClick={() => handleToggle(marker)}>
                    {marker.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(marker.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
