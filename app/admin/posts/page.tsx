'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ActionIcon, Button, Card, FileInput, Group, Image, Select, SimpleGrid, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { CoupleProfile, Post } from '@/lib/types/mvp';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recordTime, setRecordTime] = useState<string | null>(null);
  const [author, setAuthor] = useState('');
  const [authorOptions, setAuthorOptions] = useState<{ value: string; label: string }[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; image_url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const removeExistingImage = (id: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const load = async () => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { data: profileData } = await supabase
      .from('couple_profile')
      .select('*')
      .limit(1)
      .maybeSingle();
    const profile = (profileData ?? null) as CoupleProfile | null;
    const options = [
      profile?.boy_name ? { value: profile.boy_name, label: profile.boy_name } : null,
      profile?.girl_name ? { value: profile.girl_name, label: profile.girl_name } : null,
    ].filter(Boolean) as { value: string; label: string }[];
    setAuthorOptions(options);
    if (!author && options.length > 0) setAuthor(options[0].value);

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
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    const currentUserId = userData.user?.id ?? null;
    let postId = editingId;
    if (editingId) {
      await supabase
        .from('posts')
        .update({
          title,
          content,
          record_time: recordTime || new Date().toISOString().slice(0, 10),
          author,
        })
        .eq('id', editingId);
      await supabase.from('post_images').delete().eq('post_id', editingId);
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          record_time: recordTime || new Date().toISOString().slice(0, 10),
          author,
          created_by: currentUserId,
        })
        .select('*')
        .single();
      if (!error && data) postId = data.id;
    }

    if (postId) {
      const uploadedUrls: string[] = [];
      for (const file of images.slice(0, 9)) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `posts/${postId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('post-images').upload(path, file, { upsert: true });
        if (uploadError) continue;
        const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }
      const finalUrls = [...existingImages.map((img) => img.image_url), ...uploadedUrls].slice(0, 9);
      if (finalUrls.length > 0) {
        await supabase.from('post_images').insert(
          finalUrls.map((url, index) => ({ post_id: postId, image_url: url, sort_order: index })),
        );
      }
    }

    setTitle('');
    setContent('');
    setRecordTime(null);
    setAuthor(authorOptions[0]?.value ?? '');
    setImages([]);
    setExistingImages([]);
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
    setRecordTime(post.record_time ? post.record_time.slice(0, 10) : null);
    setAuthor(post.author ?? '');
    setExistingImages((post.post_images ?? []).map((img) => ({ id: img.id, image_url: img.image_url })));
    setImages([]);
  };

  const onDeleteComment = async (commentId: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from('post_comments').delete().eq('id', commentId);
    await load();
  };

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
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
            <DateInput
              label="记录时间"
              placeholder="选择记录时间"
              value={recordTime}
              onChange={(value) => setRecordTime(value)}
              valueFormat="YYYY-MM-DD"
              clearable
            />
            <Select
              label="发布者"
              data={authorOptions}
              value={author}
              onChange={(v) => setAuthor(v ?? '')}
              required
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
            <FileInput
              label="上传图片（九宫格，最多9张）"
              placeholder="选择图片"
              multiple
              accept="image/png,image/jpeg,image/webp"
              value={images}
              onChange={(files) => {
                const picked = Array.isArray(files) ? files : files ? [files] : [];
                setImages((prev) => {
                  const merged = [...prev, ...picked];
                  const unique = merged.filter((file, index, arr) => arr.findIndex((f) => (
                    f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                  )) === index);
                  const maxNew = Math.max(0, 9 - existingImages.length);
                  return unique.slice(0, maxNew);
                });
              }}
            />
            <Text size="xs" c="dimmed">
              当前已选 {existingImages.length + images.length}/9 张，可点击图片右上角删除单张预览。
            </Text>
            <SimpleGrid cols={3} spacing="xs">
              {existingImages.map((img) => (
                <Card key={img.id} p={0} radius="sm" style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image src={img.image_url} alt="已存在图片" h={92} radius="sm" fit="cover" />
                  <ActionIcon
                    color="red"
                    variant="filled"
                    size="sm"
                    style={{ position: 'absolute', top: 4, right: 4 }}
                    onClick={() => removeExistingImage(img.id)}
                  >
                    ×
                  </ActionIcon>
                </Card>
              ))}
              {images.map((file, index) => (
                <Card key={`${file.name}-${index}`} p={0} radius="sm" style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    h={92}
                    radius="sm"
                    fit="cover"
                  />
                  <ActionIcon
                    color="red"
                    variant="filled"
                    size="sm"
                    style={{ position: 'absolute', top: 4, right: 4 }}
                    onClick={() => removeNewImage(index)}
                  >
                    ×
                  </ActionIcon>
                </Card>
              ))}
            </SimpleGrid>

            <Button type="submit" disabled={saving}>
              {saving ? '保存中...' : editingId ? '保存修改' : '新增生活记录'}
            </Button>
            {editingId && (
              <Button variant="light" onClick={() => {
                setEditingId(null);
                setTitle('');
                setContent('');
                setRecordTime(null);
                setAuthor(authorOptions[0]?.value ?? '');
                setImages([]);
                setExistingImages([]);
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
              <Card key={post.id} withBorder>
                <Group justify="space-between">
                  <Text fw={700}>{post.title}</Text>
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
                </Group>
                <Text size="xs" c="dimmed" mt={4}>
                  {(post.record_time || '').replace('T', ' ').slice(0, 16)} · {post.author || '未设置'}
                </Text>
                <Text size="sm" mt={4}>
                  {post.content.length > 60
                    ? `${post.content.slice(0, 60)}...`
                    : post.content}
                </Text>
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
              </Card>
            ))}
          </Stack>
        )}
      </Card>
    </SimpleGrid>
  );
}
