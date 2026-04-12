'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/auth/context'
import styles from './panels.module.css'

interface BuyerEntry {
  id: string
  curator_id: string
  added_at: string
  buyer: {
    full_name: string | null
    username: string | null
    avatar_url: string | null
    location: string | null
  }
}

interface Props { profile: Profile }

export default function BuyerListPanel({ profile }: Props) {
  const [entries, setEntries] = useState<BuyerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [usernameInput, setUsernameInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok')

  const isDev = profile.id.startsWith('dev-')

  useEffect(() => {
    if (isDev) { setLoading(false); return }
    supabase
      .from('curator_list_members')
      .select('id, curator_id, added_at, buyer:profiles!curator_id(full_name, username, avatar_url, location)')
      .eq('artist_id', profile.id)
      .order('added_at', { ascending: false })
      .then(({ data }) => {
        setEntries((data as unknown as BuyerEntry[]) ?? [])
        setLoading(false)
      })
  }, [profile.id, isDev])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const uname = usernameInput.trim()
    if (!uname) return
    setAdding(true)
    setMsg('')

    if (isDev) {
      const mock: BuyerEntry = {
        id: `dev-entry-${Date.now()}`,
        curator_id: `dev-mock-${uname}`,
        added_at: new Date().toISOString(),
        buyer: { full_name: uname, username: uname, avatar_url: null, location: null },
      }
      setEntries(prev => [mock, ...prev])
      setUsernameInput('')
      setMsg(`${uname} added to your buyer list.`)
      setMsgType('ok')
      setAdding(false)
      return
    }

    const { data: buyerProfile, error: lookupErr } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, location, account_type')
      .eq('username', uname)
      .single()

    if (lookupErr || !buyerProfile) {
      setMsg('No user found with that username.')
      setMsgType('err')
      setAdding(false)
      return
    }
    if (buyerProfile.account_type !== 'curator') {
      setMsg('That user is not a buyer account.')
      setMsgType('err')
      setAdding(false)
      return
    }
    if (buyerProfile.id === profile.id) {
      setMsg('You cannot add yourself.')
      setMsgType('err')
      setAdding(false)
      return
    }

    const { data: newEntry, error: insertErr } = await supabase
      .from('curator_list_members')
      .insert({ artist_id: profile.id, curator_id: buyerProfile.id })
      .select('id, curator_id, added_at')
      .single()

    if (insertErr) {
      setMsg(insertErr.message.includes('unique') ? 'That buyer is already on your list.' : insertErr.message)
      setMsgType('err')
      setAdding(false)
      return
    }

    setEntries(prev => [{
      ...newEntry,
      buyer: {
        full_name: buyerProfile.full_name,
        username: buyerProfile.username,
        avatar_url: buyerProfile.avatar_url,
        location: buyerProfile.location,
      },
    } as BuyerEntry, ...prev])
    setUsernameInput('')
    setMsg(`${buyerProfile.full_name || uname} added to your buyer list.`)
    setMsgType('ok')
    setAdding(false)
  }

  const handleRemove = async (entryId: string) => {
    if (!isDev) {
      await supabase.from('curator_list_members').delete().eq('id', entryId)
    }
    setEntries(prev => prev.filter(e => e.id !== entryId))
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2>My Buyer List</h2>
          <p className={styles.panelSubtitle}>Buyers on this list can view your private work previews.</p>
        </div>
      </div>

      <form className={styles.addRow} onSubmit={handleAdd}>
        <input
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
          placeholder="Add by username…"
          className={styles.addInput}
        />
        <button type="submit" className={styles.btnPrimary} disabled={adding}>
          {adding ? 'Adding…' : 'Add'}
        </button>
      </form>
      {msg && <p className={`${styles.formMsg} ${msgType === 'err' ? styles.error : styles.success}`}>{msg}</p>}

      {loading ? (
        <div className={styles.emptyState}><div className={styles.spinner} /></div>
      ) : entries.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p>No buyers added yet.</p>
        </div>
      ) : (
        <ul className={styles.buyerList}>
          {entries.map(entry => {
            const name = entry.buyer.full_name || entry.buyer.username || 'Unknown'
            const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
            return (
              <li key={entry.id} className={styles.buyerItem}>
                <div className={styles.buyerAvatar}>
                  {entry.buyer.avatar_url
                    ? <img src={entry.buyer.avatar_url} alt={name} />
                    : <span>{initials}</span>}
                </div>
                <div className={styles.buyerMeta}>
                  <span className={styles.buyerName}>{name}</span>
                  {entry.buyer.username && <span className={styles.buyerUsername}>@{entry.buyer.username}</span>}
                  {entry.buyer.location && <span className={styles.buyerLocation}>{entry.buyer.location}</span>}
                </div>
                <span className={styles.addedDate}>
                  Added {new Date(entry.added_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <button className={styles.removeBtn} onClick={() => handleRemove(entry.id)} title="Remove">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
