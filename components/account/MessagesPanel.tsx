'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/auth/context'
import styles from './panels.module.css'

interface Conversation {
  id: string
  other_user: {
    id: string
    full_name: string | null
    username: string | null
    avatar_url: string | null
    account_type: 'artist' | 'curator'
  }
  last_message_at: string | null
  last_message_body?: string
}

interface Message {
  id: string
  sender_id: string
  body: string
  created_at: string
}

// ── Dev-mode mock data ────────────────────────────────────────────────────────
const DEV_CONVERSATIONS: Record<string, Conversation[]> = {
  'dev-artist-001': [
    {
      id: 'dev-conv-1',
      other_user: { id: 'dev-curator-001', full_name: 'Dev Buyer', username: 'DevBuyer', avatar_url: null, account_type: 'buyer' },
      last_message_at: new Date().toISOString(),
      last_message_body: 'I love the new piece you shared!',
    },
  ],
  'dev-curator-001': [
    {
      id: 'dev-conv-1',
      other_user: { id: 'dev-artist-001', full_name: 'Dev Artist', username: 'DevArtist', avatar_url: null, account_type: 'artist' },
      last_message_at: new Date().toISOString(),
      last_message_body: 'I love the new piece you shared!',
    },
  ],
}

const DEV_MESSAGES: Record<string, Message[]> = {
  'dev-conv-1': [
    { id: 'dm-1', sender_id: 'dev-curator-001', body: 'Hi! I came across your latest preview — stunning work.', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'dm-2', sender_id: 'dev-artist-001', body: 'Thank you so much! Still a work in progress but I wanted to share it early.', created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 'dm-3', sender_id: 'dev-curator-001', body: 'I love the new piece you shared!', created_at: new Date().toISOString() },
  ],
}
// ─────────────────────────────────────────────────────────────────────────────

interface Props { profile: Profile }

export default function MessagesPanel({ profile }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [newConvUsername, setNewConvUsername] = useState('')
  const [showNewConv, setShowNewConv] = useState(false)
  const [newConvMsg, setNewConvMsg] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isDev = profile.id.startsWith('dev-')

  // Load conversations
  useEffect(() => {
    if (isDev) {
      setConversations(DEV_CONVERSATIONS[profile.id] ?? [])
      setLoadingConvs(false)
      return
    }
    supabase
      .from('conversations')
      .select(`
        id, last_message_at,
        participant_a, participant_b,
        profile_a:profiles!participant_a(id, full_name, username, avatar_url, account_type),
        profile_b:profiles!participant_b(id, full_name, username, avatar_url, account_type)
      `)
      .or(`participant_a.eq.${profile.id},participant_b.eq.${profile.id}`)
      .order('last_message_at', { ascending: false })
      .then(({ data }) => {
        const convs: Conversation[] = (data ?? []).map((row: any) => {
          const isA = row.participant_a === profile.id
          const other = isA ? row.profile_b : row.profile_a
          return { id: row.id, other_user: other, last_message_at: row.last_message_at }
        })
        setConversations(convs)
        setLoadingConvs(false)
      })
  }, [profile.id, isDev])

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConv) return
    setLoadingMsgs(true)

    if (isDev) {
      setMessages(DEV_MESSAGES[activeConv.id] ?? [])
      setLoadingMsgs(false)
      return
    }

    supabase
      .from('messages')
      .select('id, sender_id, body, created_at')
      .eq('conversation_id', activeConv.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages((data as Message[]) ?? [])
        setLoadingMsgs(false)
      })

    // Real-time subscription
    const channel = supabase
      .channel(`conv-${activeConv.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConv.id}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeConv, isDev])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv) return
    setSending(true)
    const body = newMessage.trim()
    setNewMessage('')

    if (isDev) {
      const msg: Message = { id: `dm-${Date.now()}`, sender_id: profile.id, body, created_at: new Date().toISOString() }
      setMessages(prev => [...prev, msg])
      setSending(false)
      return
    }

    await supabase.from('messages').insert({
      conversation_id: activeConv.id,
      sender_id: profile.id,
      body,
    })
    setSending(false)
  }

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault()
    const uname = newConvUsername.trim()
    if (!uname) return
    setNewConvMsg('')

    if (isDev) {
      const mockConv: Conversation = {
        id: `dev-conv-${Date.now()}`,
        other_user: { id: `dev-mock-${uname}`, full_name: uname, username: uname, avatar_url: null, account_type: 'buyer' },
        last_message_at: null,
      }
      setConversations(prev => [mockConv, ...prev])
      setActiveConv(mockConv)
      setShowNewConv(false)
      setNewConvUsername('')
      return
    }

    const { data: other } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, account_type')
      .eq('username', uname)
      .single()

    if (!other) { setNewConvMsg('User not found.'); return }
    if (other.id === profile.id) { setNewConvMsg('You cannot message yourself.'); return }

    // Ensure canonical order (smaller UUID first) to respect unique constraint
    const [a, b] = [profile.id, other.id].sort()
    const { data: conv, error } = await supabase
      .from('conversations')
      .upsert({ participant_a: a, participant_b: b }, { onConflict: 'participant_a,participant_b' })
      .select('id, last_message_at')
      .single()

    if (error || !conv) { setNewConvMsg(error?.message ?? 'Could not start conversation.'); return }

    const newConv: Conversation = {
      id: conv.id,
      other_user: other as Conversation['other_user'],
      last_message_at: conv.last_message_at,
    }
    setConversations(prev => {
      const exists = prev.find(c => c.id === conv.id)
      return exists ? prev : [newConv, ...prev]
    })
    setActiveConv(newConv)
    setShowNewConv(false)
    setNewConvUsername('')
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
    if (diffDays === 0) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return 'Yesterday'
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  return (
    <div className={styles.messagesLayout}>
      {/* Sidebar */}
      <div className={styles.convSidebar}>
        <div className={styles.convSidebarHeader}>
          <h2>Messages</h2>
          <button className={styles.btnIconSmall} onClick={() => setShowNewConv(v => !v)} title="New conversation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {showNewConv && (
          <form className={styles.newConvForm} onSubmit={handleStartConversation}>
            <input
              value={newConvUsername}
              onChange={e => setNewConvUsername(e.target.value)}
              placeholder="Username…"
              autoFocus
            />
            <button type="submit" className={styles.btnPrimary}>Start</button>
            {newConvMsg && <p className={styles.error}>{newConvMsg}</p>}
          </form>
        )}

        {loadingConvs ? (
          <div className={styles.emptyState}><div className={styles.spinner} /></div>
        ) : conversations.length === 0 ? (
          <div className={styles.convEmpty}>No conversations yet.</div>
        ) : (
          <ul className={styles.convList}>
            {conversations.map(conv => {
              const name = conv.other_user.full_name || conv.other_user.username || 'Unknown'
              const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
              return (
                <li
                  key={conv.id}
                  className={`${styles.convItem} ${activeConv?.id === conv.id ? styles.convItemActive : ''}`}
                  onClick={() => setActiveConv(conv)}
                >
                  <div className={styles.convAvatar}>
                    {conv.other_user.avatar_url
                      ? <img src={conv.other_user.avatar_url} alt={name} />
                      : <span>{initials}</span>}
                  </div>
                  <div className={styles.convInfo}>
                    <div className={styles.convInfoTop}>
                      <span className={styles.convName}>{name}</span>
                      {conv.last_message_at && <span className={styles.convTime}>{formatTime(conv.last_message_at)}</span>}
                    </div>
                    {conv.last_message_body && (
                      <span className={styles.convPreview}>{conv.last_message_body}</span>
                    )}
                    <span className={`${styles.badge} ${conv.other_user.account_type === 'artist' ? styles.badgeArtist : styles.badgeBuyer}`}>
                      {conv.other_user.account_type}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Message Thread */}
      <div className={styles.messageThread}>
        {!activeConv ? (
          <div className={styles.threadEmpty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p>Select a conversation or start a new one.</p>
          </div>
        ) : (
          <>
            <div className={styles.threadHeader}>
              <button className={styles.btnBack} onClick={() => setActiveConv(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <div className={styles.threadHeaderInfo}>
                <span className={styles.threadName}>{activeConv.other_user.full_name || activeConv.other_user.username}</span>
                <span className={`${styles.badge} ${activeConv.other_user.account_type === 'artist' ? styles.badgeArtist : styles.badgeBuyer}`}>
                  {activeConv.other_user.account_type}
                </span>
              </div>
            </div>

            <div className={styles.messageList}>
              {loadingMsgs ? (
                <div className={styles.emptyState}><div className={styles.spinner} /></div>
              ) : messages.length === 0 ? (
                <div className={styles.threadEmpty}><p>No messages yet. Say hello!</p></div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.sender_id === profile.id
                  return (
                    <div key={msg.id} className={`${styles.messageBubbleWrap} ${isMine ? styles.mine : styles.theirs}`}>
                      <div className={`${styles.messageBubble} ${isMine ? styles.bubbleMine : styles.bubbleTheirs}`}>
                        <p>{msg.body}</p>
                        <span className={styles.msgTime}>{formatTime(msg.created_at)}</span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles.messageInput} onSubmit={handleSend}>
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Write a message…"
                disabled={sending}
              />
              <button type="submit" className={styles.btnSend} disabled={sending || !newMessage.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
