import { getCoupleProfile, getPosts } from '@/lib/supabase/queries';
import { Box, Stack, Text, Title } from '@mantine/core';
import { unstable_noStore as noStore } from 'next/cache';
import PostsFeed from '@/components/PostsFeed';
import SiteFooter from '@/components/SiteFooter';
import { ARCHIVE, sans, serif } from '@/components/home/constants';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  noStore();
  const [posts, coupleProfile] = await Promise.all([getPosts(), getCoupleProfile()]);

  return (
    <Box style={{ background: ARCHIVE.bg }}>
      <Box component="main" maw={896} mx="auto" px={{ base: 4, sm: 0 }} py={{ base: 24, md: 32 }} pb={48}>
        <Stack gap={48}>
          <Box component="header" ta="center" mb={8}>
            <Title
              order={1}
              style={{
                fontFamily: serif,
                fontWeight: 300,
                fontStyle: 'italic',
                color: ARCHIVE.primary,
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              }}
            >
              Life Records
            </Title>
            <Text
              mt="sm"
              style={{
                fontFamily: sans,
                color: ARCHIVE.onSurfaceVariant,
                opacity: 0.72,
                letterSpacing: '0.04em',
              }}
            >
              A collective diary of our shared journey
            </Text>
            <Text size="sm" c="dimmed" mt={6} style={{ fontFamily: sans }}>
              像朋友圈一样记录日常：标题、正文、时间、照片、点赞和留言。
            </Text>
          </Box>

          <PostsFeed initialPosts={posts} coupleProfile={coupleProfile} />
        </Stack>
      </Box>
      <SiteFooter />
    </Box>
  );
}
