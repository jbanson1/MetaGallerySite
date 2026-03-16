'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Artwork } from '@/lib/database.types'
import styles from './admin.module.css'

interface Props {
  galleryId: string
  artwork: Artwork | null
  onSave: (artwork: Artwork) => void
  onCancel: () => void
}

export default function ArtworkForm({ galleryId, artwork, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    title: artwork?.title ?? '',
    artist_name: artwork?.artist_name ?? '',
    year: artwork?.year?.toString() ?? '',
    medium: artwork?.medium ?? '',
    dimensions: artwork?.dimensions ?? '',
    description: artwork?.description ?? '',
    compact_description: artwork?.compact_description ?? '',
    price: artwork?.price?.toString() ?? '',
    currency: artwork?.currency ?? 'GBP',
    is_for_sale: artwork?.is_for_sale ?? false,
    is_active: artwork?.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState('')

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function uploadFile(file: File, bucket: string, prefix: string): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `${prefix}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) return null
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.artist_name.trim()) {
      setError('Title and artist name are required.')
      return
    }
    if (form.compact_description.length > 140) {
      setError('Compact description must be 140 characters or fewer.')
      return
    }
    setSaving(true)
    setError('')

    const payload = {
      gallery_id: galleryId,
      title: form.title.trim(),
      artist_name: form.artist_name.trim(),
      year: form.year ? parseInt(form.year) : null,
      medium: form.medium.trim() || null,
      dimensions: form.dimensions.trim() || null,
      description: form.description.trim() || null,
      compact_description: form.compact_description.trim() || null,
      price: form.price ? parseFloat(form.price) : null,
      currency: form.currency,
      is_for_sale: form.is_for_sale,
      is_active: form.is_active,
    }

    let saved: Artwork | null = null
    if (artwork) {
      const { data, error: err } = await supabase.from('artworks').update(payload).eq('id', artwork.id).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      saved = data
    } else {
      const { data, error: err } = await supabase.from('artworks').insert(payload).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      saved = data
    }

    if (!saved) { setError('Unexpected error saving artwork.'); setSaving(false); return }

    // Upload assets if provided
    if (imageFile) {
      setUploadProgress('Uploading image…')
      const url = await uploadFile(imageFile, 'artwork-images', saved.id)
      if (url) {
        await supabase.from('artwork_assets').upsert({
          artwork_id: saved.id,
          asset_type: 'image',
          url,
          filename: imageFile.name,
          mime_type: imageFile.type,
          size_bytes: imageFile.size,
          is_primary: true,
          sort_order: 0,
        })
      }
    }

    if (audioFile) {
      setUploadProgress('Uploading audio guide…')
      const url = await uploadFile(audioFile, 'artwork-audio', saved.id)
      if (url) {
        await supabase.from('artwork_assets').upsert({
          artwork_id: saved.id,
          asset_type: 'audio',
          url,
          filename: audioFile.name,
          mime_type: audioFile.type,
          size_bytes: audioFile.size,
          is_primary: false,
          sort_order: 1,
        })
      }
    }

    setSaving(false)
    setUploadProgress('')
    onSave(saved)
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>{artwork ? 'Edit artwork' : 'Add artwork'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>Title *</label>
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} required />
          </div>
          <div className={styles.formField}>
            <label>Artist name *</label>
            <input type="text" value={form.artist_name} onChange={(e) => update('artist_name', e.target.value)} required />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>Year</label>
            <input type="number" value={form.year} onChange={(e) => update('year', e.target.value)} min="1000" max="2099" />
          </div>
          <div className={styles.formField}>
            <label>Medium</label>
            <input type="text" value={form.medium} onChange={(e) => update('medium', e.target.value)} placeholder="Oil on canvas" />
          </div>
          <div className={styles.formField}>
            <label>Dimensions</label>
            <input type="text" value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} placeholder="120 × 90 cm" />
          </div>
        </div>

        <div className={styles.formField}>
          <label>Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Full artwork description for visitors" />
        </div>

        <div className={styles.formField}>
          <label>
            Compact description
            <span className={`${styles.charCount} ${form.compact_description.length > 140 ? styles.charOver : ''}`}>
              {form.compact_description.length}/140
            </span>
          </label>
          <textarea
            rows={2}
            value={form.compact_description}
            onChange={(e) => update('compact_description', e.target.value)}
            placeholder="Short version for smart glasses (max 140 chars)"
            maxLength={140}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>Price</label>
            <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} min="0" step="0.01" />
          </div>
          <div className={styles.formField}>
            <label>Currency</label>
            <select value={form.currency} onChange={(e) => update('currency', e.target.value)}>
              <option value="GBP">GBP £</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>
        </div>

        <div className={styles.formCheckboxRow}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={form.is_for_sale} onChange={(e) => update('is_for_sale', e.target.checked)} />
            Available for sale
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} />
            Visible to visitors
          </label>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>Artwork image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className={styles.fileInput}
            />
          </div>
          <div className={styles.formField}>
            <label>Audio guide</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              className={styles.fileInput}
            />
          </div>
        </div>

        {error && <p className={styles.formError}>{error}</p>}
        {uploadProgress && <p className={styles.uploadProgress}>{uploadProgress}</p>}

        <div className={styles.formActions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={saving}>Cancel</button>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? 'Saving…' : artwork ? 'Save changes' : 'Add artwork'}
          </button>
        </div>
      </form>
    </div>
  )
}
