'use client';

import { useState } from 'react';
import { Box, Button, Paper, Stack, Text } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { CoupleProfile, Post, PostComment } from '@/lib/types/mvp';
import EtherealPostCard from '@/posts/EtherealPostCard';
import { ARCHIVE, sans } from '@/homepage/constants';

export default function PostsFeed({
  initialPosts,
  coupleProfile,
}: {
  initialPosts: Post[];
  coupleProfile: CoupleProfile | null;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [commentInputs, setCommentInputs] = useState<Record<string, { visitor_name: string; message: string }>>({});
  const [commentSubmitting, setCommentSubmitting] = useState<Record<string, boolean>>({});
  const [commentErrors, setCommentErrors] = useState<Record<string, string>>({});

  const setCommentField = (postId: string, field: 'visitor_name' | 'message', value: string) => {
    setCommentInputs((prev) => {
      const current = prev[postId] ?? { visitor_name: '', message: '' };
      return {
        ...prev,
        [postId]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const onLike = async (postId: string) => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc('increment_post_like_count', { p_post_id: postId });
    if (error) return;
    const nextCount = Number(data ?? 0);

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, like_count: nextCount || (post.like_count ?? 0) + 1 }
          : post,
      ),
    );
  };

  const onComment = async (postId: string) => {
    const input = commentInputs[postId] ?? { visitor_name: '', message: '' };
    const visitor_name = input.visitor_name.trim();
    const message = input.message.trim();
    if (!visitor_name || !message) {
      setCommentErrors((prev) => ({ ...prev, [postId]: '请输入昵称和留言内容。' }));
      return;
    }

    setCommentSubmitting((prev) => ({ ...prev, [postId]: true }));
    setCommentErrors((prev) => ({ ...prev, [postId]: '' }));
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, visitor_name, message })
      .select('*')
      .single();
    if (error || !data) {
      setCommentErrors((prev) => ({
        ...prev,
        [postId]: error?.message || '评论失败，请稍后重试。',
      }));
      setCommentSubmitting((prev) => ({ ...prev, [postId]: false }));
      return;
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, post_comments: [...(post.post_comments ?? []), data as PostComment] }
          : post,
      ),
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: { visitor_name: '', message: '' } }));
    setCommentSubmitting((prev) => ({ ...prev, [postId]: false }));
  };

  if (posts.length === 0) {
    return (
      <Paper
        p="xl"
        radius="md"
        style={{
          background: ARCHIVE.surfaceContainerLowest,
          border: `1px dashed ${ARCHIVE.outlineVariant}80`,
        }}
      >
        <Text c="dimmed" size="sm" ta="center" style={{ fontFamily: sans }}>
          还没有生活记录，等第一条动态发布后，这里就会热闹起来。
        </Text>
      </Paper>
    );
  }

  return (
    <>
      <Stack gap={48}>
        {posts.map((post, index) => {
          const comments = post.post_comments ?? [];
          return (
            <EtherealPostCard
              key={post.id}
              post={post}
              coupleProfile={coupleProfile}
              index={index}
              journalNumber={posts.length - index}
              comments={comments}
              commentInput={commentInputs[post.id] ?? { visitor_name: '', message: '' }}
              commentError={commentErrors[post.id]}
              commentSubmitting={Boolean(commentSubmitting[post.id])}
              onLike={() => onLike(post.id)}
              onComment={() => onComment(post.id)}
              onCommentFieldChange={(field, value) => setCommentField(post.id, field, value)}
            />
          );
        })}
      </Stack>

      <Box ta="center" mt={48}>
        <Button
          className="home-float-btn admin-btn admin-btn-primary"
          radius="xl"
          size="md"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          回到顶部
        </Button>
      </Box>

    </>
  );
}
