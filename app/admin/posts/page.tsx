'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Post } from '@/lib/types/mvp';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from('posts')
      .select('*, post_images(*)')
      .order('created_at', { ascending: false });
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('posts')
      .insert({ title, content, happened_on: date || null })
      .select('*')
      .single();

    if (!error && data) {
      if (imageUrl.trim()) {
        await supabase
          .from('post_images')
          .insert({ post_id: data.id, image_url: imageUrl.trim(), sort_order: 0 });
      }
      setTitle('');
      setContent('');
      setDate('');
      setImageUrl('');
      await load();
    }
    setSaving(false);
  };

  const onDelete = async (id: string) => {
    const confirmDelete = window.confirm('确定要删除这条生活记录吗？删除后就只能靠记忆来回想啦。');
    if (!confirmDelete) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.from('posts').delete().eq('id', id);
    await load();
  };

  return (
    <section className="grid">
      <Card radius="lg" shadow="sm">
        <Title order={3}>生活记录管理</Title>
        <Text className="subtitle" size="sm" c="dimmed">
          在这里写下一些给“以后再看的我们”的小片段。
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
              label="日期"
              type="date"
              value={date}
              onChange={(e) => setDate(e.currentTarget.value)}
            />
            <Textarea
              label="正文"
              placeholder="可以写写当时的心情、对话、想对对方说的话..."
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
              autosize
              minRows={3}
              required
            />
            <TextInput
              label="配图地址"
              placeholder="可选，如果已经上传到图床或 Supabase Storage"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.currentTarget.value)}
            />

            {imageUrl.trim() && (
              <img
                src={imageUrl}
                alt="预览"
                className="cover"
                style={{ maxWidth: 200, height: 120, objectFit: 'cover' }}
              />
            )}

            <Button type="submit" disabled={saving}>
              {saving ? '保存中...' : '写下一条生活记录'}
            </Button>
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
                  <Button
                    color="red"
                    variant="light"
                    size="xs"
                    type="button"
                    onClick={() => onDelete(post.id)}
                  >
                    删除
                  </Button>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: '2px 0 4px' }}>
                  {post.happened_on ?? post.created_at.slice(0, 10)}
                </p>
                <p style={{ margin: 0, fontSize: 14 }}>
                  {post.content.length > 60
                    ? `${post.content.slice(0, 60)}...`
                    : post.content}
                </p>
              </div>
            ))}
          </Stack>
        )}
      </Card>
    </section>
  );
}
