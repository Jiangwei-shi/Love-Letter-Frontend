'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, Group, Select, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Post } from '@/lib/types/mvp';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recordTime, setRecordTime] = useState('');
  const [authorType, setAuthorType] = useState<'boy' | 'girl'>('boy');
  const [imageUrls, setImageUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from('posts')
      .select('*, post_images(*), post_comments(*)')
      .order('created_at', { ascending: false });
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (content.length > 200) return;
    const urls = imageUrls.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 9);
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    let postId = editingId;
    if (editingId) {
      await supabase
        .from('posts')
        .update({
          title,
          content,
          record_time: recordTime || new Date().toISOString(),
          author_type: authorType,
        })
        .eq('id', editingId);
      await supabase.from('post_images').delete().eq('post_id', editingId);
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          record_time: recordTime || new Date().toISOString(),
          author_type: authorType,
        })
        .select('*')
        .single();
      if (!error && data) postId = data.id;
    }

    if (postId && urls.length > 0) {
      await supabase.from('post_images').insert(
        urls.map((url, index) => ({ post_id: postId, image_url: url, sort_order: index })),
      );
    }

    setTitle('');
    setContent('');
    setRecordTime('');
    setAuthorType('boy');
    setImageUrls('');
    setEditingId(null);
    await load();
    setSaving(false);
  };

  const onDelete = async (id: string) => {
    const confirmDelete = window.confirm('确定要删除这条生活记录吗？删除后就只能靠记忆来回想啦。');
    if (!confirmDelete) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.from('posts').delete().eq('id', id);
    await load();
  };

  const onEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setRecordTime(post.record_time?.slice(0, 16) ?? '');
    setAuthorType(post.author_type);
    setImageUrls((post.post_images ?? []).map((img) => img.image_url).join('\n'));
  };

  const onDeleteComment = async (commentId: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from('post_comments').delete().eq('id', commentId);
    await load();
  };

  return (
    <section className="grid">
      <Card radius="lg" shadow="sm">
        <Title order={3}>生活记录管理</Title>
        <Text className="subtitle" size="sm" c="dimmed">
          支持新增、编辑、删除动态，并可删除访客留言。
        </Text>
        <form onSubmit={onCreate}>
          <Stack gap="sm" mt="md">
            <TextInput
              label="标题"
              placeholder="例如：第一次一起做饭"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />
            <TextInput
              label="记录时间"
              type="datetime-local"
              value={recordTime}
              onChange={(e) => setRecordTime(e.currentTarget.value)}
            />
            <Select
              label="发布者身份"
              data={[
                { value: 'boy', label: '男生' },
                { value: 'girl', label: '女生' },
              ]}
              value={authorType}
              onChange={(v) => setAuthorType((v as 'boy' | 'girl') || 'boy')}
            />
            <Textarea
              label="正文"
              placeholder="最多200字"
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
              autosize
              minRows={3}
              maxLength={200}
              required
            />
            <TextInput
              label="字数统计"
              value={`${content.length}/200`}
              readOnly
            />
            <Textarea
              label="图片URL（每行一个，最多9行）"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.currentTarget.value)}
              autosize
              minRows={3}
            />

            <Button type="submit" disabled={saving}>
              {saving ? '保存中...' : editingId ? '保存修改' : '新增生活记录'}
            </Button>
            {editingId && (
              <Button variant="light" onClick={() => {
                setEditingId(null);
                setTitle('');
                setContent('');
                setRecordTime('');
                setAuthorType('boy');
                setImageUrls('');
              }}
              >
                取消编辑
              </Button>
            )}
          </Stack>
        </form>
      </Card>

      <Card radius="lg" shadow="sm">
        <Title order={4}>已写下的记录</Title>
        {loading && <Text size="sm" c="dimmed">正在加载生活记录...</Text>}
        {!loading && posts.length === 0 && (
          <Text size="sm" c="dimmed">还没有任何记录，从左边的表单开始写下第一条吧。</Text>
        )}
        {!loading && (
          <Stack gap="sm" mt="sm">
            {posts.map((post) => (
              <div key={post.id}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <strong>{post.title}</strong>
                  <Group gap={6}>
                    <Button variant="light" size="xs" onClick={() => onEdit(post)}>编辑</Button>
                    <Button
                      color="red"
                      variant="light"
                      size="xs"
                      type="button"
                      onClick={() => onDelete(post.id)}
                    >
                      删除
                    </Button>
                  </Group>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: '2px 0 4px' }}>
                  {(post.record_time || '').replace('T', ' ').slice(0, 16)} · {post.author_type === 'boy' ? '男生' : '女生'}
                </p>
                <p style={{ margin: 0, fontSize: 14 }}>
                  {post.content.length > 60
                    ? `${post.content.slice(0, 60)}...`
                    : post.content}
                </p>
                {(post.post_comments ?? []).length > 0 && (
                  <Stack gap={4} mt="xs">
                    {(post.post_comments ?? []).map((comment) => (
                      <Group key={comment.id} justify="space-between">
                        <Text size="xs">{comment.visitor_name}: {comment.message}</Text>
                        <Button size="compact-xs" variant="subtle" color="red" onClick={() => onDeleteComment(comment.id)}>
                          删除留言
                        </Button>
                      </Group>
                    ))}
                  </Stack>
                )}
              </div>
            ))}
          </Stack>
        )}
      </Card>
    </section>
  );
}
