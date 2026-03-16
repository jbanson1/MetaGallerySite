import { supabase } from '@/lib/supabase'
import type { Gallery } from '@/lib/database.types'

export async function fetchGallery(id: string): Promise<Gallery | null> {
  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Gallery
}

export async function fetchGalleryBySlug(slug: string): Promise<Gallery | null> {
  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as Gallery
}
