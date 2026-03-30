import Link from 'next/link';
import { getPosts } from '@/lib/supabase/queries';
import { Badge, Button, Card, Group, Image, Stack, Text, Title } from '@mantine/core';

function getFirstImage(post: Awaited<ReturnType<typeof getPosts>>[number]) {
  return (post.post_images ?? [])[0]?.image_url ?? null;
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <section>
      <Title order={1}>生活记录</Title>
      <Text c="dimmed" mt={6} mb="md">
        这里不是宏大的故事，只是一些普通又特别的小日子。
      </Text>

      {posts.length === 0 ? (
        <Text c="dimmed" size="sm">
          还没有写下一篇生活记录。等想起某个想分享给未来自己的瞬间，就可以从这里开始写啦。
        </Text>
      ) : (
        <Stack gap="sm">
          {posts.map((post) => {
            const imageUrl = getFirstImage(post);
            const date = post.happened_on ?? post.created_at.slice(0, 10);
            const summary =
              post.content.length > 90
                ? `${post.content.slice(0, 90)}...`
                : post.content;

            return (
              <Card key={post.id} component={Link} href={`/posts/${post.id}`}>
                {imageUrl && (
                  <Image src={imageUrl} alt={post.title} radius="md" h={180} fit="cover" />
                )}
                <Stack gap={6} mt={imageUrl ? 'sm' : 0}>
                  <Group>
                    <Badge color="pink" variant="light">{date}</Badge>
                  </Group>
                  <Title order={3}>{post.title}</Title>
                  <Text size="sm">{summary}</Text>
                  <Text size="xs" c="dimmed">小小的生活札记</Text>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}

      <Group mt="md">
        <Button component={Link} href="/albums" variant="light">
          去相册里看看这些日子被拍下来的样子
        </Button>
      </Group>
    </section>
  );
}
