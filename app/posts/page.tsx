import { getPosts } from '@/lib/supabase/queries';
import { Stack, Text, Title } from '@mantine/core';
import PostsFeed from '@/components/PostsFeed';

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <section>
      <Title order={1}>生活记录</Title>
      <Text c="dimmed" mt={6} mb="md">
        像朋友圈一样记录日常：标题、正文、时间、照片、点赞和留言。
      </Text>
      <Stack>
        <PostsFeed initialPosts={posts} />
      </Stack>
    </section>
  );
}
