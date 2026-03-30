import { Text } from '@mantine/core';
import { unstable_noStore as noStore } from 'next/cache';
import AboutPageView from '@/components/AboutPageView';
import { getCoupleProfile } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  noStore();
  const profile = await getCoupleProfile();

  if (!profile) {
    return (
      <Text c="dimmed" size="sm">
        还没有设置关于我们内容，请先到后台完善情侣资料。
      </Text>
    );
  }

  return <AboutPageView profile={profile} />;
}

