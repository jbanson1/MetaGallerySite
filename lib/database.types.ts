export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // ── User accounts ────────────────────────────────────────────────────
      profiles: {
        Row: {
          id: string
          full_name: string | null
          username: string | null
          email: string | null
          avatar_url: string | null
          location: string | null
          bio: string | null
          account_type: 'artist' | 'buyer' | 'curator'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          account_type?: 'artist' | 'buyer' | 'curator'
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          account_type?: 'artist' | 'buyer' | 'curator'
          updated_at?: string
        }
      }
      artist_profiles: {
        Row: {
          id: string
          specialty: string | null
          website_url: string | null
          instagram_url: string | null
          portfolio_url: string | null
          years_active: number | null
          is_available_for_commission: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          specialty?: string | null
          website_url?: string | null
          instagram_url?: string | null
          portfolio_url?: string | null
          years_active?: number | null
          is_available_for_commission?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          specialty?: string | null
          website_url?: string | null
          instagram_url?: string | null
          portfolio_url?: string | null
          years_active?: number | null
          is_available_for_commission?: boolean
          updated_at?: string
        }
      }
      buyer_profiles: {
        Row: {
          id: string
          interests: string | null
          collection_focus: string | null
          website_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          interests?: string | null
          collection_focus?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          interests?: string | null
          collection_focus?: string | null
          website_url?: string | null
          updated_at?: string
        }
      }
      // ── Galleries & exhibitions ──────────────────────────────────────────
      galleries: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          address: string | null
          city: string | null
          country: string | null
          logo_url: string | null
          website_url: string | null
          owner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          logo_url?: string | null
          website_url?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          logo_url?: string | null
          website_url?: string | null
          owner_id?: string | null
          updated_at?: string
        }
      }
      exhibitions: {
        Row: {
          id: string
          gallery_id: string
          title: string
          description: string | null
          start_date: string | null
          end_date: string | null
          cover_image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          title: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          cover_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          gallery_id?: string
          title?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          cover_image_url?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      // ── Artworks ─────────────────────────────────────────────────────────
      artworks: {
        Row: {
          id: string
          gallery_id: string
          exhibition_id: string | null
          title: string
          artist_name: string
          year: number | null
          medium: string | null
          dimensions: string | null
          description: string | null
          compact_description: string | null
          price: number | null
          currency: string
          is_for_sale: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          exhibition_id?: string | null
          title: string
          artist_name: string
          year?: number | null
          medium?: string | null
          dimensions?: string | null
          description?: string | null
          compact_description?: string | null
          price?: number | null
          currency?: string
          is_for_sale?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          gallery_id?: string
          exhibition_id?: string | null
          title?: string
          artist_name?: string
          year?: number | null
          medium?: string | null
          dimensions?: string | null
          description?: string | null
          compact_description?: string | null
          price?: number | null
          currency?: string
          is_for_sale?: boolean
          is_active?: boolean
          updated_at?: string
        }
      }
      artwork_assets: {
        Row: {
          id: string
          artwork_id: string
          asset_type: 'image' | 'audio' | 'video' | '3d_model'
          url: string
          filename: string | null
          mime_type: string | null
          size_bytes: number | null
          duration_seconds: number | null
          is_primary: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          artwork_id: string
          asset_type: 'image' | 'audio' | 'video' | '3d_model'
          url: string
          filename?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          duration_seconds?: number | null
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          artwork_id?: string
          asset_type?: 'image' | 'audio' | 'video' | '3d_model'
          url?: string
          filename?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          duration_seconds?: number | null
          is_primary?: boolean
          sort_order?: number
        }
      }
      artwork_previews: {
        Row: {
          id: string
          artist_id: string
          title: string
          description: string | null
          medium: string | null
          image_url: string | null
          status: 'wip' | 'nearly_complete' | 'complete'
          visibility: 'private' | 'curator_list' | 'public'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          title: string
          description?: string | null
          medium?: string | null
          image_url?: string | null
          status?: 'wip' | 'nearly_complete' | 'complete'
          visibility?: 'private' | 'curator_list' | 'public'
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          medium?: string | null
          image_url?: string | null
          status?: 'wip' | 'nearly_complete' | 'complete'
          visibility?: 'private' | 'curator_list' | 'public'
          updated_at?: string
        }
      }
      // ── Social / networking ──────────────────────────────────────────────
      curator_list_members: {
        Row: {
          id: string
          artist_id: string
          curator_id: string
          added_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          curator_id: string
          added_at?: string
        }
        Update: {
          artist_id?: string
          curator_id?: string
        }
      }
      // ── Messaging ────────────────────────────────────────────────────────
      conversations: {
        Row: {
          id: string
          participant_a: string
          participant_b: string
          last_message_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_a: string
          participant_b: string
          last_message_at?: string | null
          created_at?: string
        }
        Update: {
          last_message_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          body: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          body: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          read_at?: string | null
        }
      }
      // ── Scan & QR events ─────────────────────────────────────────────────
      markers: {
        Row: {
          id: string
          marker_id: string
          artwork_id: string
          gallery_id: string
          label: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          marker_id: string
          artwork_id: string
          gallery_id: string
          label?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          marker_id?: string
          artwork_id?: string
          gallery_id?: string
          label?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          gallery_id: string
          role: 'owner' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gallery_id: string
          role?: 'owner' | 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          user_id?: string
          gallery_id?: string
          role?: 'owner' | 'editor' | 'viewer'
        }
      }
      scan_events: {
        Row: {
          id: string
          marker_id: string
          artwork_id: string
          gallery_id: string
          scanned_at: string
          user_agent: string | null
          ip_hash: string | null
          session_id: string | null
          referrer: string | null
        }
        Insert: {
          id?: string
          marker_id: string
          artwork_id: string
          gallery_id: string
          scanned_at?: string
          user_agent?: string | null
          ip_hash?: string | null
          session_id?: string | null
          referrer?: string | null
        }
        Update: {
          marker_id?: string
          artwork_id?: string
          gallery_id?: string
          scanned_at?: string
          user_agent?: string | null
          ip_hash?: string | null
          session_id?: string | null
          referrer?: string | null
        }
      }
    }
    Functions: {
      get_email_by_username: {
        Args: { p_username: string }
        Returns: string | null
      }
    }
  }
}

// ── Convenience types ─────────────────────────────────────────────────────────
export type Profile         = Database['public']['Tables']['profiles']['Row']
export type ArtistProfile   = Database['public']['Tables']['artist_profiles']['Row']
export type BuyerProfile    = Database['public']['Tables']['buyer_profiles']['Row']
export type Gallery         = Database['public']['Tables']['galleries']['Row']
export type Exhibition      = Database['public']['Tables']['exhibitions']['Row']
export type Artwork         = Database['public']['Tables']['artworks']['Row']
export type ArtworkAsset    = Database['public']['Tables']['artwork_assets']['Row']
export type ArtworkPreview  = Database['public']['Tables']['artwork_previews']['Row']
export type CuratorListMember = Database['public']['Tables']['curator_list_members']['Row']
export type Conversation    = Database['public']['Tables']['conversations']['Row']
export type Message         = Database['public']['Tables']['messages']['Row']
export type Marker          = Database['public']['Tables']['markers']['Row']
export type AdminUser       = Database['public']['Tables']['admin_users']['Row']
export type ScanEvent       = Database['public']['Tables']['scan_events']['Row']

export interface ArtworkWithAssets extends Artwork {
  artwork_assets: ArtworkAsset[]
  markers: Marker[]
  galleries: Pick<Gallery, 'id' | 'name' | 'logo_url'>
}
