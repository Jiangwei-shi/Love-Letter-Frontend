import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export async function uploadAlbumPhoto(file: File, userId: string) {
  const supabase = getSupabaseBrowserClient();
  const safe = file.name.replace(/[^\w.-]/g, '_');
  const path = `${userId}/${Date.now()}_${safe}`;
  const { error } = await supabase.storage.from('album-photos').upload(path, file, { upsert: true });
  if (error) {
    throw error;
  }
  return supabase.storage.from('album-photos').getPublicUrl(path).data.publicUrl;
}
