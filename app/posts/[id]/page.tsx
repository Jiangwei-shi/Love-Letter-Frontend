import Link from 'next/link';
import { Box, Button, Card, Group, Image, SimpleGrid, Text, Title, Badge } from '@mantine/core';
import SiteFooter from '@/components/SiteFooter';
import { ARCHIVE } from '@/components/home/constants';
import { getPostById } from '@/lib/supabase/queries';

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return (
      <Box style={{ background: ARCHIVE.bg }}>
        <section>
          <Text c="dimmed" size="sm">
            这篇生活记录好像找不到了，也许被时光悄悄藏了起来。
          </Text>
          <Group mt="sm">
            <Button component={Link} href="/posts" variant="light">
              回到生活记录
            </Button>
          </Group>
        </section>
        <SiteFooter />
      </Box>
    );
  }

  const date = (post.record_time || '').replace('T', ' ').slice(0, 16);

  return (
    <Box style={{ background: ARCHIVE.bg }}>
      <Card style={{ background: 'transparent' }}>
        <Group>
          <Button component={Link} href="/posts" variant="light">
            ← 回到生活记录
          </Button>
        </Group>
        <Group mt="sm">
          <Badge color="pink" variant="light">
            {post.author || '发布者'}
          </Badge>
          <Badge color="pink" variant="light">{date}</Badge>
        </Group>
        <Title order={1} mt="xs">{post.title}</Title>
        <Text c="dimmed" mt={4}>这一小段记忆，被认真地写给以后看的我们。</Text>

        <Text style={{ whiteSpace: 'pre-wrap' }} mt="md" mb="md">
          {post.content}
        </Text>

        {(post.post_images ?? []).length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {(post.post_images ?? []).map((img) => (
              <Image
                key={img.id}
                src={img.image_url}
                alt={post.title}
                radius="md"
                h={220}
                fit="cover"
              />
            ))}
          </SimpleGrid>
        )}

        <Text size="xs" c="dimmed" mt="md">
          这一天，就这样被温柔地收进了我们的故事里。
        </Text>
      </Card>
      <SiteFooter />
    </Box>
  );
}

