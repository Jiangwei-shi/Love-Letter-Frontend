import Link from 'next/link';
import { Box, Button, Card, Group, Stack, Text, Title, Badge } from '@mantine/core';
import SiteFooter from '@/shell/SiteFooter';
import { ARCHIVE, sans, serif } from '@/homepage/constants';
import { getPostById } from '@/lib/supabase/queries';
import PostDetailImageGrid from '@/posts/PostDetailImageGrid';

function formatCommentTime(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('zh-CN', { hour12: false });
}

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
  const sortedImages = [...(post.post_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const sortedComments = [...(post.post_comments ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

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

        <PostDetailImageGrid images={sortedImages} title={post.title} />

        <Stack gap="md" mt={40}>
          <Title order={3} style={{ fontFamily: serif, fontWeight: 500, color: ARCHIVE.onSurface }}>
            访客留言
            <Text span size="sm" fw={400} c="dimmed" ml={8} style={{ fontFamily: sans }}>
              {sortedComments.length} 条
            </Text>
          </Title>
          {sortedComments.length === 0 ? (
            <Text size="sm" c="dimmed" style={{ fontFamily: sans }}>
              还没有留言，在生活记录列表里可以为这篇留下一句话。
            </Text>
          ) : (
            <Stack gap={12}>
              {sortedComments.map((comment) => (
                <Box
                  key={comment.id}
                  p="md"
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${ARCHIVE.outlineVariant}3d`,
                    background: ARCHIVE.surfaceContainerLowest,
                  }}
                >
                  <Group justify="space-between" align="flex-start" wrap="wrap" gap={8} mb={8}>
                    <Text size="sm" fw={600} c={ARCHIVE.onSurfaceVariant} style={{ fontFamily: sans }}>
                      {comment.visitor_name?.trim() || '匿名访客'}
                    </Text>
                    <Text size="xs" c="dimmed" style={{ fontFamily: sans }}>
                      {formatCommentTime(comment.created_at)}
                    </Text>
                  </Group>
                  <Text
                    size="sm"
                    style={{
                      fontFamily: sans,
                      color: ARCHIVE.onSurface,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.7,
                    }}
                  >
                    {comment.message}
                  </Text>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>

        <Text size="xs" c="dimmed" mt="md">
          这一天，就这样被温柔地收进了我们的故事里。
        </Text>
      </Card>
      <SiteFooter />
    </Box>
  );
}
