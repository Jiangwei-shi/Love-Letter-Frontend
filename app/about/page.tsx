import { Box, Paper, Text } from '@mantine/core';
import { unstable_noStore as noStore } from 'next/cache';
import AboutPageView from '@/components/AboutPageView';
import SiteFooter from '@/components/SiteFooter';
import { getCoupleProfile } from '@/lib/supabase/queries';
import { ARCHIVE, sans } from '@/components/home/constants';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  noStore();
  const profile = await getCoupleProfile();

  if (!profile) {
    return (
      <Box style={{ background: ARCHIVE.bg }}>
        <Box py="xl">
          <Paper
            maw={560}
            mx="auto"
            p="xl"
            radius="md"
            style={{
              background: ARCHIVE.surfaceContainerLowest,
              border: `1px dashed ${ARCHIVE.outlineVariant}80`,
            }}
          >
            <Text c="dimmed" size="sm" ta="center" style={{ fontFamily: sans }}>
              还没有设置关于我们内容，请先到后台完善情侣资料。
            </Text>
          </Paper>
        </Box>
        <SiteFooter />
      </Box>
    );
  }

  return <AboutPageView profile={profile} />;
}
