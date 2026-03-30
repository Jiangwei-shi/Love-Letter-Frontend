import { getSupabasePublicServerClient } from '@/lib/supabase/server';
import type { Album, AlbumPhoto, Post, TimelineEvent } from '@/lib/types/mvp';

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const supabase = getSupabasePublicServerClient();
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) throw error;
  return (data ?? []) as TimelineEvent[];
}

export async function getPosts(): Promise<Post[]> {
  const supabase = getSupabasePublicServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_images(*)')
    .order('happened_on', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function getAlbums(): Promise<Album[]> {
  const supabase = getSupabasePublicServerClient();
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Album[];
}

export async function getAlbumPhotos(albumId: string): Promise<AlbumPhoto[]> {
  const supabase = getSupabasePublicServerClient();
  const { data, error } = await supabase
    .from('album_photos')
    .select('*')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as AlbumPhoto[];
}
