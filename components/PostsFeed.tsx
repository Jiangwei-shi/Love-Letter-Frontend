'use client';

import { useState } from 'react';
import { Badge, Button, Card, Group, Image, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Post, PostComment } from '@/lib/types/mvp';

function formatRecordTime(recordTime: string) {
  return recordTime.replace('T', ' ').slice(0, 16);
}

export default function PostsFeed({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [commentInputs, setCommentInputs] = useState<Record<string, { visitor_name: string; message: string }>>({});

  const onLike = async (postId: string) => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('post_likes').insert({ post_id: postId }).select('id').single();
    if (error || !data) return;

    setPosts((prev) => prev.map((post) => (
      post.id === postId
        ? { ...post, post_likes: [...(post.post_likes ?? []), { id: data.id, post_id: postId, created_at: new Date().toISOString() }] }
        : post
    )));
  };

  const onComment = async (postId: string) => {
    const input = commentInputs[postId] ?? { visitor_name: '', message: '' };
    const visitor_name = input.visitor_name.trim();
    const message = input.message.trim();
    if (!visitor_name || !message) return;

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, visitor_name, message })
      .select('*')
      .single();
    if (error || !data) return;

    setPosts((prev) => prev.map((post) => (
      post.id === postId
        ? { ...post, post_comments: [...(post.post_comments ?? []), data as PostComment] }
        : post
    )));

    setCommentInputs((prev) => ({ ...prev, [postId]: { visitor_name: '', message: '' } }));
  };

  if (posts.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        还没有生活记录，等第一条动态发布后，这里就会热闹起来。
      </Text>
    );
  }

  return (
    <Stack gap="md">
      {posts.map((post) => {
        const likes = post.post_likes?.length ?? 0;
        const comments = post.post_comments ?? [];

        return (
          <Card key={post.id}>
            <Group justify="space-between">
              <Badge color="pink" variant="light">
                {post.author || '发布者'}
              </Badge>
              <Text size="xs" c="dimmed">{formatRecordTime(post.record_time)}</Text>
            </Group>
            <Title order={3} mt="xs">{post.title}</Title>
            <Text mt={6}>{post.content}</Text>

            {(post.post_images ?? []).length > 0 && (
              <SimpleGrid cols={{ base: 3, sm: 3, md: 3 }} mt="sm" spacing="xs">
                {(post.post_images ?? []).slice(0, 9).map((img) => (
                  <Image key={img.id} src={img.image_url} alt={post.title} h={110} radius="sm" fit="cover" />
                ))}
              </SimpleGrid>
            )}

            <Group mt="sm">
              <Button variant="light" onClick={() => onLike(post.id)}>点赞</Button>
              <Text size="sm" c="dimmed">共 {likes} 次点赞</Text>
            </Group>

            <Stack gap={6} mt="sm">
              {comments.map((comment) => (
                <Card key={comment.id} p="xs" bg="pink.0">
                  <Text size="sm"><strong>{comment.visitor_name}：</strong>{comment.message}</Text>
                </Card>
              ))}
              <Group grow>
                <TextInput
                  placeholder="访客昵称"
                  value={commentInputs[post.id]?.visitor_name ?? ''}
                  onChange={(e) => setCommentInputs((prev) => ({
                    ...prev,
                    [post.id]: { visitor_name: e.currentTarget.value, message: prev[post.id]?.message ?? '' },
                  }))}
                />
                <TextInput
                  placeholder="写下留言..."
                  value={commentInputs[post.id]?.message ?? ''}
                  onChange={(e) => setCommentInputs((prev) => ({
                    ...prev,
                    [post.id]: { visitor_name: prev[post.id]?.visitor_name ?? '', message: e.currentTarget.value },
                  }))}
                />
                <Button onClick={() => onComment(post.id)}>发送</Button>
              </Group>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}

