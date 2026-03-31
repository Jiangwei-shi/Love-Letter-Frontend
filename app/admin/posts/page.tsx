'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Box, Button, Card, FileInput, Group, Image, Select, SimpleGrid, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { CoupleProfile, Post } from '@/lib/types/mvp';

type PostFormProps = {
  title: string;
  content: string;
  recordTime: string | null;
  author: string;
  authorOptions: { value: string; label: string }[];
  images: File[];
  existingImages: { id: string; image_url: string }[];
  editingId: string | null;
  saving: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onRecordTimeChange: (value: string | null) => void;
  onAuthorChange: (value: string) => void;
  onImagesChange: (files: File[]) => void;
  onRemoveExistingImage: (id: string) => void;
  onRemoveNewImage: (index: number) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
  onCancelEdit: () => void;
};

function PostFormCard({
  title,
  content,
  recordTime,
  author,
  authorOptions,
  images,
  existingImages,
  editingId,
  saving,
  onTitleChange,
  onContentChange,
  onRecordTimeChange,
  onAuthorChange,
  onImagesChange,
  onRemoveExistingImage,
  onRemoveNewImage,
  onSubmit,
  onCancelEdit,
}: PostFormProps) {
  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Text size="xs" fw={700} style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9c4050' }}>
          新增生活记录
        </Text>
        <Title order={1} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.625rem)', lineHeight: 1.15, fontStyle: 'italic', fontWeight: 500 }}>
          珍藏一个新的
          <br />
          生活片段
        </Title>
      </Stack>

      <Card
        radius="lg"
        p="xl"
        withBorder
        style={{
          background: '#ffffff',
          borderColor: 'rgba(218,192,194,0.22)',
          boxShadow: '0 12px 40px rgba(156,64,80,0.03)',
        }}
      >
        <form onSubmit={(e) => { void onSubmit(e); }}>
          <Stack gap="md">
            <TextInput
              label="记录标题"
              placeholder="例如：第一次一起做饭"
              value={title}
              onChange={(e) => onTitleChange(e.currentTarget.value)}
              required
              styles={{
                label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8f7f80' },
                input: { backgroundColor: '#e9e8e4', border: 'none', fontStyle: 'italic', fontSize: 17 },
              }}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <DateInput
                label="记录日期"
                placeholder="选择记录时间"
                value={recordTime}
                onChange={(value) => onRecordTimeChange(value)}
                valueFormat="YYYY-MM-DD"
                clearable
                styles={{
                  label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8f7f80' },
                  input: { backgroundColor: '#e9e8e4', border: 'none' },
                }}
              />
              <Select
                label="记录者"
                data={authorOptions}
                value={author}
                onChange={(v) => onAuthorChange(v ?? '')}
                required
                styles={{
                  label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8f7f80' },
                  input: { backgroundColor: '#e9e8e4', border: 'none' },
                }}
              />
            </SimpleGrid>
            <Textarea
              label="内容叙述"
              placeholder="在这里写下这段故事..."
              value={content}
              onChange={(e) => onContentChange(e.currentTarget.value)}
              autosize
              minRows={6}
              maxLength={200}
              required
              styles={{
                label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8f7f80' },
                input: { backgroundColor: '#e9e8e4', border: 'none', lineHeight: 1.75 },
              }}
            />
            <TextInput label="字数统计" value={`${content.length}/200`} readOnly styles={{ input: { backgroundColor: '#f4f4f0' } }} />
            <FileInput
              label="图片档案（最多9张）"
              placeholder="选择图片"
              multiple
              accept="image/png,image/jpeg,image/webp"
              value={images}
              onChange={(files) => {
                const picked = Array.isArray(files) ? files : files ? [files] : [];
                onImagesChange(picked);
              }}
              styles={{
                label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8f7f80' },
                input: { backgroundColor: '#e9e8e4', border: '1px dashed rgba(136,114,115,0.35)' },
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
                    onClick={() => onRemoveExistingImage(img.id)}
                  >
                    ×
                  </ActionIcon>
                </Card>
              ))}
              {images.map((file, index) => (
                <Card key={`${file.name}-${index}`} p={0} radius="sm" style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image src={URL.createObjectURL(file)} alt={file.name} h={92} radius="sm" fit="cover" />
                  <ActionIcon
                    color="red"
                    variant="filled"
                    size="sm"
                    style={{ position: 'absolute', top: 4, right: 4 }}
                    onClick={() => onRemoveNewImage(index)}
                  >
                    ×
                  </ActionIcon>
                </Card>
              ))}
            </SimpleGrid>
            <Button
              type="submit"
              disabled={saving}
              radius="xl"
              style={{
                marginTop: 8,
                height: 50,
                background: 'linear-gradient(90deg, #9c4050, #ff8e9e)',
                boxShadow: '0 12px 40px rgba(156,64,80,0.15)',
              }}
            >
              {saving ? '保存中...' : editingId ? '保存修改' : '创建记录'}
            </Button>
            {editingId && (
              <Button variant="light" color="gray" radius="xl" onClick={onCancelEdit}>
                取消编辑
              </Button>
            )}
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}

type PostListProps = {
  posts: Post[];
  loading: boolean;
  sortOrder: 'asc' | 'desc';
  onToggleSort: () => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
};

function PostList({ posts, loading, sortOrder, onToggleSort, onEdit, onDelete, onDeleteComment }: PostListProps) {
  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Text size="xs" fw={700} style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1c6392' }}>
            记录集合
          </Text>
          <Title order={3} style={{ fontStyle: 'italic', fontWeight: 500 }}>
            最近归档记录
          </Title>
        </Stack>
        <Group gap="xs" mb={2}>
          <Button variant="light" color="gray" radius="xl" size="xs" onClick={onToggleSort}>
            按记录时间{sortOrder === 'desc' ? '倒序' : '正序'}
          </Button>
        </Group>
      </Group>

      {loading && <Text size="sm" c="dimmed">正在加载生活记录...</Text>}
      {!loading && posts.length === 0 && (
        <Card withBorder radius="lg" p="xl" style={{ borderStyle: 'dashed' }}>
          <Text size="sm" c="dimmed">还没有任何记录，从左边的表单开始写下第一条吧。</Text>
        </Card>
      )}

      {!loading && (
        <Stack gap="md" style={{ maxHeight: 1200, overflowY: 'auto', paddingRight: 8 }}>
          {posts.map((post) => {
            const previewImage = post.post_images?.[0]?.image_url;
            return (
              <Card
                key={post.id}
                radius="lg"
                p={0}
                withBorder
                style={{
                  overflow: 'hidden',
                  background: '#ffffff',
                  borderColor: 'rgba(218,192,194,0.18)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                }}
              >
                <Group align="stretch" gap={0} wrap="nowrap">
                  <Box style={{ width: 190, minWidth: 190, height: 200, background: '#e3e2df' }}>
                    {previewImage ? (
                      <Image src={previewImage} alt={post.title} h={200} w={190} fit="cover" />
                    ) : (
                      <Stack justify="center" align="center" h={200} gap={4}>
                        <Text size="xs" c="dimmed">暂无封面</Text>
                      </Stack>
                    )}
                  </Box>
                  <Stack justify="space-between" gap="md" p="xl" style={{ flex: 1 }}>
                    <Stack gap={6}>
                      <Group justify="space-between" align="flex-start">
                        <Box>
                          <Text size="xs" fw={700} style={{ color: '#9c4050', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                            {(post.record_time || '').replace('T', ' ').slice(0, 16)}
                          </Text>
                          <Title order={4} mt={2} style={{ fontStyle: 'italic', fontWeight: 500 }}>
                            {post.title}
                          </Title>
                        </Box>
                        <Group gap={6}>
                          <ActionIcon
                            variant="light"
                            color="gray"
                            radius="xl"
                            aria-label="编辑"
                            onClick={() => onEdit(post)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="light"
                            radius="xl"
                            aria-label="删除"
                            onClick={() => { void onDelete(post.id); }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Group>
                      <Text size="sm" c="#6d5c5e" style={{ lineHeight: 1.8, fontStyle: 'italic' }} lineClamp={2}>
                        {post.content}
                      </Text>
                    </Stack>
                    <Group justify="space-between" style={{ borderTop: '1px solid rgba(218,192,194,0.22)', paddingTop: 12 }}>
                      <Text size="xs" c="#8f7f80" fs="italic">
                        记录者：{post.author || '未设置'}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {(post.post_comments ?? []).length} 条留言
                      </Text>
                    </Group>
                    {(post.post_comments ?? []).length > 0 && (
                      <Stack gap={4}>
                        {(post.post_comments ?? []).map((comment) => (
                          <Group key={comment.id} justify="space-between">
                            <Text size="xs">{comment.visitor_name}: {comment.message}</Text>
                            <Button
                              size="compact-xs"
                              variant="subtle"
                              color="red"
                              onClick={() => { void onDeleteComment(comment.id); }}
                            >
                              删除留言
                            </Button>
                          </Group>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Group>
              </Card>
            );
          })}
          {!loading && posts.length > 0 && (
            <Stack align="center" gap={6} py="md">
              <Box w={46} h={1} style={{ background: 'rgba(136,114,115,0.25)' }} />
              <Text size="xs" c="#9b8a8b" style={{ letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                记录到底啦
              </Text>
              <Box w={46} h={1} style={{ background: 'rgba(136,114,115,0.25)' }} />
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}

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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aTime = a.record_time ? new Date(a.record_time).getTime() : 0;
      const bTime = b.record_time ? new Date(b.record_time).getTime() : 0;
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    });
  }, [posts, sortOrder]);

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

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setRecordTime(null);
    setAuthor(authorOptions[0]?.value ?? '');
    setImages([]);
    setExistingImages([]);
  };

  return (
    <Box className="admin-page-main-subheader">
        <Box className="admin-inner-topbar">
          <Title order={4} style={{ color: '#9c4050', fontWeight: 600 }}>
            推文管理
          </Title>
        </Box>

        <SimpleGrid cols={{ base: 1, lg: 12 }} spacing="xl" className="admin-posts-grid">
          <Box className="admin-col-form" style={{ gridColumn: 'span 5' }}>
            <PostFormCard
              title={title}
              content={content}
              recordTime={recordTime}
              author={author}
              authorOptions={authorOptions}
              images={images}
              existingImages={existingImages}
              editingId={editingId}
              saving={saving}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onRecordTimeChange={setRecordTime}
              onAuthorChange={setAuthor}
              onImagesChange={(picked) => {
                setImages((prev) => {
                  const merged = [...prev, ...picked];
                  const unique = merged.filter((file, index, arr) => arr.findIndex((f) => (
                    f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                  )) === index);
                  const maxNew = Math.max(0, 9 - existingImages.length);
                  return unique.slice(0, maxNew);
                });
              }}
              onRemoveExistingImage={removeExistingImage}
              onRemoveNewImage={removeNewImage}
              onSubmit={onCreate}
              onCancelEdit={resetForm}
            />
          </Box>
          <Box className="admin-col-list" style={{ gridColumn: 'span 7' }}>
            <PostList
              posts={sortedPosts}
              loading={loading}
              sortOrder={sortOrder}
              onToggleSort={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              onEdit={onEdit}
              onDelete={onDelete}
              onDeleteComment={onDeleteComment}
            />
          </Box>
        </SimpleGrid>
    </Box>
  );
}
