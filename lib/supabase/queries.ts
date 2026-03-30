import { getSupabasePublicServerClient } from '@/lib/supabase/server';
import type { CoupleProfile, Post, TimelineEvent } from '@/lib/types/mvp';

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
    .select('*, post_images(*), post_likes(id), post_comments(*)')
    .order('record_time', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = getSupabasePublicServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_images(*), post_likes(id), post_comments(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as Post | null;
}

export async function getCoupleProfile(): Promise<CoupleProfile | null> {
  const supabase = getSupabasePublicServerClient();
  const { data, error } = await supabase
    .from('couple_profile')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as CoupleProfile | null;
}
