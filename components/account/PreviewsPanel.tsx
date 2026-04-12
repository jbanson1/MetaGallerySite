'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/auth/context'
import styles from './panels.module.css'

interface Preview {
  id: string
  title: string
  description: string | null
  medium: string | null
  image_url: string | null
  status: 'wip' | 'nearly_complete' | 'complete'
  visibility: 'private' | 'curator_list' | 'public'
  created_at: string
}

const STATUS_LABELS: Record<Preview['status'], string> = {
  wip: 'Work in Progress',
  nearly_complete: 'Nearly Complete',
  complete: 'Complete',
}
const VISIBILITY_LABELS: Record<Preview['visibility'], string> = {
  private: 'Private',
  curator_list: 'My Buyers',
  public: 'Public',
}

const EMPTY_FORM = {
  title: '',
  description: '',
  medium: '',
  image_url: '',
  status: 'wip' as Preview['status'],
  visibility: 'curator_list' as Preview['visibility'],
}

interface Props { profile: Profile }

export default function PreviewsPanel({ profile }: Props) {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Dev mode: use local state only
  const isDev = profile.id.startsWith('dev-')

  useEffect(() => {
    if (isDev) { setLoading(false); return }
    supabase
      .from('artwork_previews')
      .select('*')
      .eq('artist_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPreviews((data as Preview[]) ?? [])
        setLoading(false)
      })
  }, [profile.id, isDev])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    setMsg('')

    if (isDev) {
      setPreviews(prev => [{
        id: `dev-${Date.now()}`,
        ...form,
        created_at: new Date().toISOString(),
      }, ...prev])
      setForm(EMPTY_FORM)
      setShowForm(false)
      setSaving(false)
      return
    }

    const { data, error } = await supabase
      .from('artwork_previews')
      .insert({ ...form, artist_id: profile.id })
      .select()
      .single()

    setSaving(false)
    if (error) { setMsg(error.message); return }
    setPreviews(prev => [data as Preview, ...prev])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (isDev) {
      setPreviews(prev => prev.filter(p => p.id !== id))
      return
    }
    await supabase.from('artwork_previews').delete().eq('id', id)
    setPreviews(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Work Previews</h2>
          <p className={styles.panelSubtitle}>Share works-in-progress with your trusted buyers.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ Add Preview'}
        </button>
      </div>

      {showForm && (
        <form className={styles.inlineForm} onSubmit={handleAdd}>
          <div className={styles.formRow}>
            <label>Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Untitled work" required />
          </div>
          <div className={styles.formRow}>
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of the piece…" rows={3} />
          </div>
          <div className={styles.formRowDouble}>
            <div className={styles.formRow}>
              <label>Medium</label>
              <input value={form.medium} onChange={e => setForm(f => ({ ...f, medium: e.target.value }))} placeholder="Oil on canvas" />
            </div>
            <div className={styles.formRow}>
              <label>Image URL</label>
              <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://…" />
            </div>
          </div>
          <div className={styles.formRowDouble}>
            <div className={styles.formRow}>
              <label>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Preview['status'] }))}>
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Visible to</label>
              <select value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value as Preview['visibility'] }))}>
                {Object.entries(VISIBILITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          {msg && <p className={styles.error}>{msg}</p>}
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Saving…' : 'Add Preview'}</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className={styles.emptyState}><div className={styles.spinner} /></div>
      ) : previews.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>No previews yet. Add your first work-in-progress.</p>
        </div>
      ) : (
        <div className={styles.previewGrid}>
          {previews.map(p => (
            <div key={p.id} className={styles.previewCard}>
              {p.image_url ? (
                <div className={styles.previewThumb} style={{ backgroundImage: `url('${p.image_url}')` }} />
              ) : (
                <div className={styles.previewThumbEmpty}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
              <div className={styles.previewInfo}>
                <h3>{p.title}</h3>
                {p.medium && <p className={styles.previewMedium}>{p.medium}</p>}
                {p.description && <p className={styles.previewDesc}>{p.description}</p>}
                <div className={styles.previewBadges}>
                  <span className={`${styles.badge} ${styles[`badge_${p.status}`]}`}>{STATUS_LABELS[p.status]}</span>
                  <span className={`${styles.badge} ${styles.badgeVis}`}>{VISIBILITY_LABELS[p.visibility]}</span>
                </div>
              </div>
              <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)} title="Delete preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
