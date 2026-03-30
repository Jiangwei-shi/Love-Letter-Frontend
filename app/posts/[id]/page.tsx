import Link from 'next/link';
import { Button, Card, Group, Image, SimpleGrid, Stack, Text, Title, Badge } from '@mantine/core';
import { getPostById } from '@/lib/supabase/queries';

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return (
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
    );
  }

  const date = (post.record_time || '').replace('T', ' ').slice(0, 16);

  return (
    <Card>
      <Group>
        <Button component={Link} href="/posts" variant="light">
          ← 回到生活记录
        </Button>
      </Group>
      <Group mt="sm">
        <Badge color={post.author_type === 'boy' ? 'blue' : 'red'} variant="light">
          {post.author_type === 'boy' ? '男生' : '女生'}
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
  );
}

