import { Box } from '@mantine/core';
import { getCoupleProfile, getTimelineEvents, getPosts } from '@/lib/supabase/queries';
import HomeFooter from '@/components/home/HomeFooter';
import HomeHeartNote from '@/components/home/HomeHeartNote';
import HomeHero from '@/components/home/HomeHero';
import HomeLifeRecords from '@/components/home/HomeLifeRecords';
import HomeTimelinePreview from '@/components/home/HomeTimelinePreview';
import { ARCHIVE } from '@/components/home/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function calcDaysFrom(dateStr?: string | null) {
  if (!dateStr) return null;
  const start = new Date(dateStr);
  if (Number.isNaN(start.getTime())) return null;
  const today = new Date();
  const diffMs = today.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default async function HomePage() {
  const profile = await getCoupleProfile();

  const [events, posts] = await Promise.all([getTimelineEvents(), getPosts()]);

  const anniversaryDays = calcDaysFrom(profile?.anniversary_date ?? null);

  const recentTimeline = events.slice(-3).reverse();
  const recentPosts = posts.slice(0, 3);

  return (
    <Box component="section" style={{ background: ARCHIVE.bg }}>
      <HomeHero profile={profile} anniversaryDays={anniversaryDays} />
      <HomeTimelinePreview events={recentTimeline} />
      <HomeLifeRecords posts={recentPosts} />
      <HomeHeartNote profile={profile} />
      <HomeFooter />
    </Box>
  );
}
