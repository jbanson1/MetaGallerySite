import { supabase } from '@/lib/supabase'
import type { Exhibition } from '@/lib/database.types'

export async function fetchExhibition(id: string): Promise<Exhibition | null> {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Exhibition
}

export async function fetchExhibitions(galleryId: string): Promise<Exhibition[]> {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('gallery_id', galleryId)
    .eq('is_active', true)
    .order('start_date', { ascending: false })
  if (error) return []
  return (data ?? []) as Exhibition[]
}
