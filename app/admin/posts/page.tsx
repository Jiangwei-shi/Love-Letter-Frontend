'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ActionIcon, Box, Button, Card, CopyButton, Divider, Drawer, FileInput, Group, Image, Select, SimpleGrid, Stack, Switch, Text, Textarea, TextInput, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconArrowsMove, IconEdit, IconTrash } from '@tabler/icons-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { resolvePostAuthorDisplayName } from '@/lib/posts/authorFromRole';
import type { CoupleProfile, Post, PostAuthorRole } from '@/lib/types/mvp';

const TARGET_IMAGE_SIZE_BYTES = 300 * 1024;
const MAX_IMAGE_EDGE = 1920;

/** 与微信类似：长按后才进入拖动排序 */
const IMAGE_SORT_LONG_PRESS_MS = 480;
const IMAGE_SORT_MOVE_CANCEL_PX = 12;

const detectFileExtension = (mimeType: string) => {
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  return 'jpg';
};

const loadImageElement = (file: File) => new Promise<HTMLImageElement>((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const img = new window.Image();
  img.onload = () => {
    URL.revokeObjectURL(objectUrl);
    resolve(img);
  };
  img.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('无法读取图片内容'));
  };
  img.src = objectUrl;
});

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality: number) => (
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  })
);

async function compressImageForUpload(file: File) {
  if (file.size <= TARGET_IMAGE_SIZE_BYTES) return file;

  const img = await loadImageElement(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.width, img.height));
  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('无法初始化图片压缩画布');
  context.drawImage(img, 0, 0, targetWidth, targetHeight);

  const outputMimeType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
  const qualityCandidates = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.35];
  let bestBlob: Blob | null = null;

  for (const quality of qualityCandidates) {
    const blob = await canvasToBlob(canvas, outputMimeType, quality);
    if (!blob) continue;
    bestBlob = blob;
    if (blob.size <= TARGET_IMAGE_SIZE_BYTES) break;
  }

  if (!bestBlob) return file;

  const outputExt = detectFileExtension(bestBlob.type || outputMimeType);
  const outputName = file.name.replace(/\.[^.]+$/, '') || `compressed-${Date.now()}`;
  return new File([bestBlob], `${outputName}.${outputExt}`, {
    type: bestBlob.type || outputMimeType,
    lastModified: Date.now(),
  });
}

type PostFormProps = {
  title: string;
  content: string;
  recordTime: string | null;
  authorRole: PostAuthorRole;
  locked: boolean;
  authorOptions: { value: PostAuthorRole; label: string }[];
  images: File[];
  existingImages: { id: string; image_url: string }[];
  imagePreviewItems: {
    key: string;
    kind: 'existing' | 'new';
    imageUrl: string;
    alt: string;
    existingId?: string;
    newIndex?: number;
  }[];
  editingId: string | null;
  saving: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onRecordTimeChange: (value: string | null) => void;
  onAuthorRoleChange: (value: PostAuthorRole) => void;
  onLockedChange: (value: boolean) => void;
  onAddImages: (files: File[]) => void;
  onRemoveExistingImage: (id: string) => void;
  onRemoveNewImage: (index: number) => void;
  onReorderImages: (fromKey: string, toKey: string) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
  onCancelEdit: () => void;
};

function PostFormCard({
  title,
  content,
  recordTime,
  authorRole,
  locked,
  authorOptions,
  images,
  existingImages,
  imagePreviewItems,
  editingId,
  saving,
  onTitleChange,
  onContentChange,
  onRecordTimeChange,
  onAuthorRoleChange,
  onLockedChange,
  onAddImages,
  onRemoveExistingImage,
  onRemoveNewImage,
  onReorderImages,
  onSubmit,
  onCancelEdit,
}: PostFormProps) {
  type SortGesture =
    | null
    | { type: 'pending'; key: string; startX: number; startY: number }
    | { type: 'drag'; key: string };

  const [sortGesture, setSortGesture] = useState<SortGesture>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const dragOverKeyRef = useRef<string | null>(null);
  /** 从 pointerdown 到 finish/cancel 整段交互占用的互斥，避免重复按下；不在 effect cleanup 里清除（pending→drag 会换 effect） */
  const sortBusyRef = useRef(false);

  useEffect(() => {
    dragOverKeyRef.current = dragOverKey;
  }, [dragOverKey]);

  const draggingKey = sortGesture?.type === 'drag' ? sortGesture.key : null;

  useEffect(() => {
    if (!sortGesture) return undefined;

    let longPressTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    if (sortGesture.type === 'pending') {
      longPressTimer = setTimeout(() => {
        if (cancelled) return;
        setSortGesture({ type: 'drag', key: sortGesture.key });
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(20);
          }
        } catch {
          /* ignore */
        }
      }, IMAGE_SORT_LONG_PRESS_MS);
    }

    const onMove = (e: PointerEvent) => {
      if (sortGesture.type === 'pending') {
        const dx = e.clientX - sortGesture.startX;
        const dy = e.clientY - sortGesture.startY;
        if (dx * dx + dy * dy > IMAGE_SORT_MOVE_CANCEL_PX * IMAGE_SORT_MOVE_CANCEL_PX) {
          cancelled = true;
          if (longPressTimer) clearTimeout(longPressTimer);
          sortBusyRef.current = false;
          setSortGesture(null);
          setDragOverKey(null);
        }
        return;
      }
      if (sortGesture.type === 'drag') {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const dropZone = el?.closest<HTMLElement>('[data-image-key]');
        const targetKey = dropZone?.dataset.imageKey ?? null;
        setDragOverKey(targetKey);
      }
    };

    const finish = () => {
      cancelled = true;
      if (longPressTimer) clearTimeout(longPressTimer);
      const g = sortGesture;
      if (g?.type === 'drag') {
        const to = dragOverKeyRef.current;
        if (to && g.key !== to) {
          onReorderImages(g.key, to);
        }
      }
      sortBusyRef.current = false;
      setSortGesture(null);
      setDragOverKey(null);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', finish);
    document.addEventListener('pointercancel', finish);
    return () => {
      cancelled = true;
      if (longPressTimer) clearTimeout(longPressTimer);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', finish);
      document.removeEventListener('pointercancel', finish);
    };
  }, [sortGesture, onReorderImages]);

  useEffect(
    () => () => {
      sortBusyRef.current = false;
    },
    [],
  );

  const onImageSortPointerDown = (e: React.PointerEvent, key: string) => {
    if (e.button !== 0) return;
    if (sortBusyRef.current) return;
    sortBusyRef.current = true;
    setDragOverKey(null);
    setSortGesture({ type: 'pending', key, startX: e.clientX, startY: e.clientY });
  };

  const normalizePickedFiles = (files: File[] | File | null) => {
    if (!files) return [];
    return Array.isArray(files) ? files : [files];
  };

  const handleImagePick = (files: File[] | File | null) => {
    const picked = normalizePickedFiles(files);
    if (picked.length === 0) return;
    onAddImages(picked);
  };

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
                value={authorRole}
                onChange={(v) => onAuthorRoleChange(v === 'girl' ? 'girl' : 'boy')}
                required
                styles={{
                  label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8f7f80' },
                  input: { backgroundColor: '#e9e8e4', border: 'none' },
                }}
              />
            </SimpleGrid>
            <Switch
              label="是否上锁"
              checked={locked}
              onChange={(e) => onLockedChange(e.currentTarget.checked)}
            />
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
              // Android 端使用 image/* 更容易弹出“图库/文件”等图片来源选项
              accept="image/*"
              value={images}
              onChange={handleImagePick}
              styles={{
                label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8f7f80' },
                input: { backgroundColor: '#e9e8e4', border: '1px dashed rgba(136,114,115,0.35)' },
              }}
            />
            <Text size="xs" c="dimmed">
              当前已选 {existingImages.length + images.length}/9 张，可点击图片右上角删除；长按缩略图松手前拖到目标位置可调换顺序（与微信类似）。
            </Text>
            <Text size="xs" c="dimmed">
              新上传图片会在上传前自动压缩到约 300KB，以节省云存储空间。
            </Text>
            <SimpleGrid cols={3} spacing="xs">
              {imagePreviewItems.map((item) => (
                <Card
                  key={item.key}
                  p={0}
                  radius="sm"
                  onPointerDown={(e) => onImageSortPointerDown(e, item.key)}
                  data-image-key={item.key}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: draggingKey ? (draggingKey === item.key ? 'grabbing' : 'default') : 'default',
                    opacity: draggingKey === item.key ? 0.82 : 1,
                    touchAction: draggingKey ? 'none' : 'manipulation',
                    border: dragOverKey === item.key && draggingKey ? '2px solid #9c4050' : '2px solid transparent',
                    boxSizing: 'border-box',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                >
                  <Image src={item.imageUrl} alt={item.alt} h={92} radius="sm" fit="cover" />
                  <Box
                    style={{
                      position: 'absolute',
                      left: 4,
                      top: 4,
                      zIndex: 2,
                      background: 'rgba(156,64,80,0.9)',
                      color: '#ffffff',
                      borderRadius: 6,
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconArrowsMove size={12} />
                  </Box>
                  <ActionIcon
                    color="red"
                    variant="filled"
                    size="sm"
                    style={{ position: 'absolute', top: 4, right: 4, zIndex: 3 }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      if (item.kind === 'existing' && item.existingId) onRemoveExistingImage(item.existingId);
                      if (item.kind === 'new' && typeof item.newIndex === 'number') onRemoveNewImage(item.newIndex);
                    }}
                  >
                    ×
                  </ActionIcon>
                </Card>
              ))}
            </SimpleGrid>
            <Button
              type="submit"
              disabled={saving}
              className="home-float-btn admin-btn admin-btn-primary"
              radius="xl"
              style={{
                marginTop: 8,
                height: 50,
              }}
            >
              {saving ? '保存中...' : editingId ? '保存修改' : '创建记录'}
            </Button>
            {editingId && (
              <Button
                variant="default"
                className="home-float-btn admin-btn admin-btn-muted"
                radius="xl"
                onClick={onCancelEdit}
              >
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
  coupleProfile: CoupleProfile | null;
  loading: boolean;
  sortOrder: 'asc' | 'desc';
  onToggleSort: () => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
};

function PostList({ posts, coupleProfile, loading, sortOrder, onToggleSort, onEdit, onDelete, onDeleteComment }: PostListProps) {
  const [detailOpened, setDetailOpened] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{
    postTitle: string;
    comment: NonNullable<Post['post_comments']>[number];
  } | null>(null);
  const [ipLocationMap, setIpLocationMap] = useState<Record<string, string>>({});
  const [ipLookupLoading, setIpLookupLoading] = useState(false);

  const openCommentDetail = (postTitle: string, comment: NonNullable<Post['post_comments']>[number]) => {
    setSelectedComment({ postTitle, comment });
    setDetailOpened(true);
  };

  const closeCommentDetail = () => {
    setDetailOpened(false);
    setSelectedComment(null);
  };

  const formatCommentTime = (value?: string | null) => {
    if (!value) return '未知';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '未知';
    return date.toLocaleString('zh-CN', { hour12: false });
  };

  const resolveIp = (comment: NonNullable<Post['post_comments']>[number]) => {
    return comment.ip_address || (comment as Record<string, string | null | undefined>).ip || '未知';
  };

  const normalizeIp = (ip: string) => {
    if (ip.startsWith('::ffff:')) return ip.slice(7);
    return ip;
  };

  const isPrivateOrLocalIp = (ip: string) => {
    const normalized = normalizeIp(ip).toLowerCase();
    if (normalized === 'localhost' || normalized === '::1' || normalized === '127.0.0.1') return true;
    if (normalized.startsWith('10.')) return true;
    if (normalized.startsWith('192.168.')) return true;
    if (normalized.startsWith('172.')) {
      const second = Number(normalized.split('.')[1] ?? -1);
      if (second >= 16 && second <= 31) return true;
    }
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
    return false;
  };

  const formatLocation = (
    country: unknown,
    region: unknown,
    city: unknown,
  ) => {
    const parts = [country, region, city]
      .map((part) => (typeof part === 'string' ? part.trim() : ''))
      .filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '未知地区';
  };

  const lookupIpLocation = async (ip: string) => {
    const normalizedIp = normalizeIp(ip);
    if (!normalizedIp || normalizedIp === '未知') return;
    if (ipLocationMap[normalizedIp]) return;

    if (isPrivateOrLocalIp(normalizedIp)) {
      setIpLocationMap((prev) => ({ ...prev, [normalizedIp]: '内网或本地地址' }));
      return;
    }

    setIpLookupLoading(true);
    try {
      const ipWhoRes = await fetch(`https://ipwho.is/${encodeURIComponent(normalizedIp)}?lang=zh`);
      if (ipWhoRes.ok) {
        const ipWhoData = await ipWhoRes.json() as {
          success?: boolean;
          country?: string;
          region?: string;
          city?: string;
        };
        if (ipWhoData.success !== false) {
          setIpLocationMap((prev) => ({
            ...prev,
            [normalizedIp]: formatLocation(ipWhoData.country, ipWhoData.region, ipWhoData.city),
          }));
          return;
        }
      }

      const ipApiRes = await fetch(`https://ipapi.co/${encodeURIComponent(normalizedIp)}/json/`);
      if (ipApiRes.ok) {
        const ipApiData = await ipApiRes.json() as {
          country_name?: string;
          region?: string;
          city?: string;
        };
        setIpLocationMap((prev) => ({
          ...prev,
          [normalizedIp]: formatLocation(ipApiData.country_name, ipApiData.region, ipApiData.city),
        }));
        return;
      }

      setIpLocationMap((prev) => ({ ...prev, [normalizedIp]: '定位失败' }));
    } catch (error) {
      console.error('IP 归属地解析失败', error);
      setIpLocationMap((prev) => ({ ...prev, [normalizedIp]: '定位失败' }));
    } finally {
      setIpLookupLoading(false);
    }
  };

  const resolveUserAgent = (comment: NonNullable<Post['post_comments']>[number]) => {
    return comment.user_agent || '未知';
  };

  useEffect(() => {
    if (!selectedComment) return;
    const rawIp = resolveIp(selectedComment.comment);
    const normalizedIp = normalizeIp(rawIp);
    if (!normalizedIp || normalizedIp === '未知') return;
    if (ipLocationMap[normalizedIp]) return;
    void lookupIpLocation(normalizedIp);
  }, [selectedComment, ipLocationMap]);

  return (
    <>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end" className="admin-posts-list-header">
          <Stack gap={4}>
            <Text size="xs" fw={700} style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1c6392' }}>
              记录集合
            </Text>
            <Title order={3} style={{ fontStyle: 'italic', fontWeight: 500 }}>
              最近归档记录
            </Title>
          </Stack>
          <Group gap="xs" mb={2}>
            <Button
              variant="default"
              className="home-float-btn admin-btn admin-btn-muted"
              radius="xl"
              size="xs"
              onClick={onToggleSort}
            >
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
          <Stack gap="md" style={{ paddingRight: 8 }}>
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
                  <Group align="stretch" gap={0} wrap="nowrap" className="admin-post-archive-main">
                    {previewImage && (
                      <Box
                        className="admin-post-archive-cover"
                        style={{ width: 190, minWidth: 190, height: 200 }}
                      >
                        <Image src={previewImage} alt={post.title} h={200} w={190} fit="cover" />
                      </Box>
                    )}
                    <Stack gap="md" p="xl" style={{ flex: 1 }} className="admin-post-archive-content">
                      <Stack gap={6}>
                        <Group justify="space-between" align="flex-start" className="admin-post-archive-header">
                          <Box>
                            <Text size="xs" fw={700} style={{ color: '#9c4050', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                              {(post.record_time || '').replace('T', ' ').slice(0, 16)}
                            </Text>
                            <Title order={4} mt={2} style={{ fontStyle: 'italic', fontWeight: 500 }}>
                              {post.title}
                            </Title>
                          </Box>
                        </Group>
                        <Text size="sm" c="#6d5c5e" style={{ lineHeight: 1.8, fontStyle: 'italic' }} lineClamp={2}>
                          {post.content}
                        </Text>
                        <Group gap={6} justify="flex-end" className="admin-post-archive-actions">
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
                      </Stack>
                      <Group
                        justify="space-between"
                        className="admin-post-archive-meta"
                        style={{ borderTop: '1px solid rgba(218,192,194,0.22)', paddingTop: 12 }}
                      >
                        <Group gap={10}>
                          <Text size="xs" c="#8f7f80" fs="italic">
                            记录者：{resolvePostAuthorDisplayName(post.author_role, coupleProfile)}
                          </Text>
                          <Text size="xs" c={post.locked ? '#9c4050' : 'dimmed'}>
                            {post.locked ? '已上锁' : '未上锁'}
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {(post.post_comments ?? []).length} 条留言
                        </Text>
                      </Group>
                      {(post.post_comments ?? []).length > 0 && (
                        <Stack gap={8} className="admin-post-archive-comments">
                          {(post.post_comments ?? []).map((comment) => (
                            <Box
                              key={comment.id}
                              p={10}
                              style={{
                                borderRadius: 10,
                                border: '1px solid rgba(218,192,194,0.24)',
                                background: 'rgba(250,249,245,0.65)',
                              }}
                            >
                              <Stack gap={6}>
                                <Group justify="space-between" align="flex-start" wrap="wrap" gap={8} className="admin-post-comment-header">
                                  <Text size="xs" fw={700} c="#7f6b6d">
                                    {comment.visitor_name || '匿名访客'}
                                  </Text>
                                </Group>
                                <Text
                                  size="xs"
                                  style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.7,
                                  }}
                                >
                                  {comment.message}
                                </Text>
                                <Group gap={6} wrap="wrap" justify="flex-end" className="admin-post-comment-actions">
                                  <Button
                                    size="compact-xs"
                                    variant="default"
                                    className="home-float-btn admin-btn admin-btn-muted"
                                    radius="xl"
                                    onClick={() => openCommentDetail(post.title, comment)}
                                  >
                                    查看详情
                                  </Button>
                                  <Button
                                    size="compact-xs"
                                    variant="default"
                                    className="home-float-btn admin-btn admin-btn-danger"
                                    radius="xl"
                                    onClick={() => { void onDeleteComment(comment.id); }}
                                  >
                                    删除留言
                                  </Button>
                                </Group>
                              </Stack>
                            </Box>
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

      <Drawer
        opened={detailOpened}
        onClose={closeCommentDetail}
        position="right"
        size="md"
        title="留言详情"
      >
        {!selectedComment ? (
          <Text c="dimmed" size="sm">未选中留言</Text>
        ) : (
          <Stack gap="md">
            <Box>
              <Text size="xs" c="dimmed">所属记录</Text>
              <Text fw={600}>{selectedComment.postTitle}</Text>
            </Box>
            <Group justify="space-between" align="center">
              <Box>
                <Text size="xs" c="dimmed">访客昵称</Text>
                <Text fw={600}>{selectedComment.comment.visitor_name || '匿名访客'}</Text>
              </Box>
              <CopyButton value={selectedComment.comment.message} timeout={1200}>
                {({ copied, copy }) => (
                  <Button
                    size="xs"
                    variant="default"
                    className="home-float-btn admin-btn admin-btn-secondary"
                    radius="xl"
                    onClick={copy}
                  >
                    {copied ? '已复制' : '复制留言'}
                  </Button>
                )}
              </CopyButton>
            </Group>
            <Divider />
            <Box>
              <Text size="xs" c="dimmed" mb={6}>留言内容</Text>
              <Text
                size="sm"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.8,
                }}
              >
                {selectedComment.comment.message}
              </Text>
            </Box>
            <Divider />
            <SimpleGrid cols={1} spacing="xs">
              <Group justify="space-between">
                <Text size="xs" c="dimmed">留言时间</Text>
                <Text size="xs">{formatCommentTime(selectedComment.comment.created_at)}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">IP</Text>
                <Text size="xs">{normalizeIp(resolveIp(selectedComment.comment))}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">归属地</Text>
                <Text size="xs">
                  {(() => {
                    const normalizedIp = normalizeIp(resolveIp(selectedComment.comment));
                    if (!normalizedIp || normalizedIp === '未知') return '未知';
                    if (ipLocationMap[normalizedIp]) return ipLocationMap[normalizedIp];
                    return ipLookupLoading ? '解析中...' : '待解析';
                  })()}
                </Text>
              </Group>
              <Group justify="space-between" align="flex-start">
                <Text size="xs" c="dimmed">User-Agent</Text>
                <Text size="xs" ta="right" style={{ maxWidth: '75%', wordBreak: 'break-word' }}>
                  {resolveUserAgent(selectedComment.comment)}
                </Text>
              </Group>
            </SimpleGrid>
          </Stack>
        )}
      </Drawer>
    </>
  );
}

export default function AdminPostsPage() {
  const [coupleProfile, setCoupleProfile] = useState<CoupleProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recordTime, setRecordTime] = useState<string | null>(null);
  const [authorRole, setAuthorRole] = useState<PostAuthorRole>('boy');
  const [locked, setLocked] = useState(false);
  const [authorOptions, setAuthorOptions] = useState<{ value: PostAuthorRole; label: string }[]>([]);
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

  const reorderImages = (fromKey: string, toKey: string) => {
    if (fromKey === toKey) return;

    const orderedItems = [
      ...existingImages.map((img) => ({ key: `existing-${img.id}`, kind: 'existing' as const, existingId: img.id })),
      ...images.map((_, index) => ({ key: `new-${index}`, kind: 'new' as const, newIndex: index })),
    ];
    const fromIndex = orderedItems.findIndex((item) => item.key === fromKey);
    const toIndex = orderedItems.findIndex((item) => item.key === toKey);
    if (fromIndex < 0 || toIndex < 0) return;

    const nextOrdered = [...orderedItems];
    [nextOrdered[fromIndex], nextOrdered[toIndex]] = [nextOrdered[toIndex], nextOrdered[fromIndex]];

    const existingMap = new Map(existingImages.map((img) => [img.id, img]));
    const newMap = new Map(images.map((file, index) => [index, file]));
    const nextExisting: { id: string; image_url: string }[] = [];
    const nextNew: File[] = [];

    nextOrdered.forEach((item) => {
      if (item.kind === 'existing') {
        const id = item.existingId;
        if (!id) return;
        const existing = existingMap.get(id);
        if (existing) nextExisting.push(existing);
        return;
      }
      const file = typeof item.newIndex === 'number' ? newMap.get(item.newIndex) : null;
      if (file) nextNew.push(file);
    });

    setExistingImages(nextExisting);
    setImages(nextNew);
  };

  const imagePreviewItems = useMemo(() => {
    const existing = existingImages.map((img) => ({
      key: `existing-${img.id}`,
      kind: 'existing' as const,
      imageUrl: img.image_url,
      alt: '已存在图片',
      existingId: img.id,
    }));
    const fresh = images.map((file, index) => ({
      key: `new-${index}`,
      kind: 'new' as const,
      imageUrl: URL.createObjectURL(file),
      alt: file.name,
      newIndex: index,
    }));
    return [...existing, ...fresh];
  }, [existingImages, images]);

  const appendPickedImages = (picked: File[]) => {
    setImages((prev) => {
      const merged = [...prev, ...picked];
      const unique = merged.filter((file, index, arr) => arr.findIndex((f) => (
        f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
      )) === index);
      const maxNew = Math.max(0, 9 - existingImages.length);
      return unique.slice(0, maxNew);
    });
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
    setCoupleProfile(profile);
    const options: { value: PostAuthorRole; label: string }[] = [
      { value: 'boy' as const, label: profile?.boy_name?.trim() || '他（男方）' },
      { value: 'girl' as const, label: profile?.girl_name?.trim() || '她（女方）' },
    ];
    setAuthorOptions(options);

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
          author_role: authorRole,
          locked,
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
          author_role: authorRole,
          locked,
          created_by: currentUserId,
        })
        .select('*')
        .single();
      if (!error && data) postId = data.id;
    }

    if (postId) {
      const uploadedUrls: string[] = [];
      for (const file of images.slice(0, 9)) {
        let uploadFile = file;
        try {
          uploadFile = await compressImageForUpload(file);
        } catch (error) {
          console.error('图片压缩失败，已回退原图上传', error);
        }
        const ext = detectFileExtension(uploadFile.type || file.type);
        const path = `posts/${postId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('post-images').upload(path, uploadFile, { upsert: true });
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
    setAuthorRole(authorOptions[0]?.value ?? 'boy');
    setLocked(false);
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
    setAuthorRole(post.author_role ?? 'boy');
    setLocked(Boolean(post.locked));
    setExistingImages((post.post_images ?? []).map((img) => ({ id: img.id, image_url: img.image_url })));
    setImages([]);

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const onDeleteComment = async (commentId: string) => {
    const confirmDelete = window.confirm('确定要删除这条留言吗？删除后将无法恢复。');
    if (!confirmDelete) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.from('post_comments').delete().eq('id', commentId);
    await load();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setRecordTime(null);
    setAuthorRole(authorOptions[0]?.value ?? 'boy');
    setLocked(false);
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
              authorRole={authorRole}
              locked={locked}
              authorOptions={authorOptions}
              images={images}
              existingImages={existingImages}
              imagePreviewItems={imagePreviewItems}
              editingId={editingId}
              saving={saving}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onRecordTimeChange={setRecordTime}
              onAuthorRoleChange={setAuthorRole}
              onLockedChange={setLocked}
              onAddImages={appendPickedImages}
              onRemoveExistingImage={removeExistingImage}
              onRemoveNewImage={removeNewImage}
              onReorderImages={reorderImages}
              onSubmit={onCreate}
              onCancelEdit={resetForm}
            />
          </Box>
          <Box className="admin-col-list" style={{ gridColumn: 'span 7' }}>
            <PostList
              posts={sortedPosts}
              coupleProfile={coupleProfile}
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
