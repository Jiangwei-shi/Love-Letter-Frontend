'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ActionIcon,
  Alert,
  Avatar,
  Box,
  Button,
  Group,
  Image,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  useMatches,
} from '@mantine/core';
import { IconDots, IconHeartFilled, IconLock, IconMessageCircle } from '@tabler/icons-react';
import type { CoupleProfile, Post, PostComment } from '@/lib/types/mvp';
import { resolvePostAuthorAvatarUrl, resolvePostAuthorDisplayName } from '@/lib/posts/authorFromRole';
import { ARCHIVE, sans, serif } from '@/homepage/constants';
import PostImagePreviewModal from '@/posts/PostImagePreviewModal';

function sortImages(post: Post) {
  const imgs = post.post_images ?? [];
  return [...imgs].sort((a, b) => a.sort_order - b.sort_order);
}

function formatPostDateUpper(recordTime: string) {
  const d = new Date(recordTime);
  if (Number.isNaN(d.getTime())) {
    return recordTime.replace('T', ' ').slice(0, 10).toUpperCase();
  }
  return d
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();
}

type Props = {
  post: Post;
  coupleProfile: CoupleProfile | null;
  comments: PostComment[];
  commentInput: { visitor_name: string; message: string };
  commentError?: string;
  commentSubmitting: boolean;
  onLike: () => void;
  onComment: () => void;
  onCommentFieldChange: (field: 'visitor_name' | 'message', value: string) => void;
};

export default function EtherealPostCard({
  post,
  coupleProfile,
  comments,
  commentInput,
  commentError,
  commentSubmitting,
  onLike,
  onComment,
  onCommentFieldChange,
}: Props) {
  const [viewer, setViewer] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const commentNickBox = useMatches({
    base: { flex: '1 1 100%', minWidth: 0, width: '100%', order: 1, maxWidth: '100%' },
    sm: { flex: '0 1 120px', minWidth: 88, maxWidth: 160, order: 1, width: 'auto' },
  });
  const commentMsgBox = useMatches({
    base: { flex: '1 1 100%', minWidth: 0, width: '100%', order: 2 },
    sm: { flex: '1 1 200px', minWidth: 0, order: 2 },
  });
  const commentSendBox = useMatches({
    base: {
      order: 3,
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      flexShrink: 0,
    },
    sm: { order: 3, width: 'auto', display: 'block', justifyContent: 'unset', flexShrink: 0 },
  });

  const images = sortImages(post);
  const galleryUrls = useMemo(
    () => images.slice(0, 9).map((img) => img.image_url),
    [images],
  );
  const likes = post.like_count ?? 0;
  const author = resolvePostAuthorDisplayName(post.author_role, coupleProfile);
  const avatarSrc = resolvePostAuthorAvatarUrl(post.author_role, coupleProfile);
  const isBoy = post.author_role === 'boy';
  const avatarBorder = isBoy ? 'rgba(142, 202, 255, 0.35)' : 'rgba(255, 142, 158, 0.35)';

  const cardBase = {
    background: ARCHIVE.surfaceContainerLowest,
    border: `1px solid ${ARCHIVE.outlineVariant}1a`,
    boxShadow: ARCHIVE.cardShadow,
  } as const;

  const headerRow = (
    <Group justify="space-between" align="flex-start" wrap="nowrap" mb={24}>
      <Group gap="md" wrap="nowrap">
        <Avatar
          radius="xl"
          size={48}
          color={isBoy ? 'blue' : 'pink'}
          src={avatarSrc}
          alt=""
          styles={{
            root: {
              border: `2px solid ${avatarBorder}`,
            },
          }}
        >
          {author.slice(0, 1)}
        </Avatar>
        <Box>
          <Text fw={600} style={{ fontFamily: sans, color: ARCHIVE.onSurface, lineHeight: 1.3 }}>
            {author}
          </Text>
          <Text
            fz={10}
            tt="uppercase"
            c="dimmed"
            style={{ letterSpacing: '0.14em', fontFamily: sans, marginTop: 2 }}
          >
            {formatPostDateUpper(post.record_time)}
          </Text>
        </Box>
      </Group>
      <Menu shadow="md" width={160} position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" aria-label="更多">
            <IconDots size={20} stroke={1.25} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item component={Link} href={`/posts/${post.id}`}>
            查看详情
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );

  const titleBlock = (italicTitle = true) => (
    <>
      <Title
        order={2}
        mb={12}
        style={{
          fontFamily: serif,
          fontWeight: 400,
          fontStyle: italicTitle ? 'italic' : 'normal',
          color: ARCHIVE.onSurface,
          fontSize: '1.35rem',
          lineHeight: 1.35,
        }}
      >
        {post.title}
      </Title>
      <Text
        style={{
          fontFamily: sans,
          color: ARCHIVE.onSurfaceVariant,
          lineHeight: 1.7,
          opacity: 0.9,
          whiteSpace: 'pre-line',
        }}
      >
        {post.content}
      </Text>
    </>
  );

  /** 九宫格：3 列网格，最多展示 9 张 */
  const imageGrid = (
    <SimpleGrid cols={3} spacing={8} className="posts-feed-img-grid">
      {images.slice(0, 9).map((img, idx) => (
        <UnstyledButton
          key={img.id}
          type="button"
          onClick={() => setViewer({ open: true, index: idx })}
          aria-label={`查看大图：${post.title}`}
          style={{
            aspectRatio: '1',
            borderRadius: 8,
            overflow: 'hidden',
            background: ARCHIVE.surfaceContainerHigh,
            padding: 0,
            border: 'none',
            cursor: 'zoom-in',
            display: 'block',
            width: '100%',
          }}
        >
          <Image src={img.image_url} alt="" h="100%" w="100%" fit="cover" />
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );

  const interactionBar = (
    <Group
      pt={24}
      mt={24}
      w="100%"
      justify="space-between"
      align="center"
      style={{ borderTop: `1px solid ${ARCHIVE.surfaceContainerHigh}` }}
      wrap="nowrap"
    >
      <Group gap={24} wrap="wrap">
        <UnstyledButton onClick={onLike} style={{ fontFamily: sans }}>
          <Group gap={8} c="#78716c">
            <IconHeartFilled size={22} color={ARCHIVE.primary} />
            <Text size="sm" fw={500}>
              {likes}
            </Text>
          </Group>
        </UnstyledButton>
        <Group gap={8} c="#78716c" style={{ cursor: 'default' }}>
          <IconMessageCircle size={22} stroke={1.25} color="#1c6392" />
          <Text size="sm" fw={500}>
            {comments.length}
          </Text>
        </Group>
      </Group>
      {post.locked && (
        <Group gap={6} c="#78716c" wrap="nowrap">
          <IconLock size={18} stroke={1.5} />
          <Text size="xs" c="dimmed">
            已上锁
          </Text>
        </Group>
      )}
    </Group>
  );

  const commentPreview =
    comments.length > 0 ? (
      <Stack gap={6} mt="md">
        {comments.map((c) => (
          <Text key={c.id} size="xs" c="dimmed" lineClamp={2} style={{ fontFamily: sans }}>
            <Text span fw={600} c={ARCHIVE.onSurfaceVariant}>
              {c.visitor_name}
            </Text>
            ：{c.message}
          </Text>
        ))}
      </Stack>
    ) : null;

  const commentComposer = (
    <Stack gap="xs" mt="md">
      {commentPreview}
      {commentError ? (
        <Alert color="red" py={6}>
          {commentError}
        </Alert>
      ) : null}
      <Group align="flex-end" gap="xs" wrap="wrap" w="100%" style={{ rowGap: 8 }}>
        <Box style={commentNickBox}>
          <TextInput
            size="sm"
            radius="xl"
            placeholder="昵称"
            value={commentInput.visitor_name}
            onChange={(e) => onCommentFieldChange('visitor_name', e.currentTarget.value)}
            styles={{
              input: {
                background: ARCHIVE.surfaceContainer,
                border: 'none',
                fontFamily: sans,
              },
            }}
          />
        </Box>
        <Box style={commentMsgBox}>
          <TextInput
            radius="xl"
            size="sm"
            placeholder="Add a memory..."
            value={commentInput.message}
            onChange={(e) => onCommentFieldChange('message', e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onComment();
              }
            }}
            styles={{
              input: {
                background: ARCHIVE.surfaceContainer,
                border: 'none',
                fontFamily: sans,
              },
            }}
          />
        </Box>
        <Box style={commentSendBox}>
          <Button
            variant="subtle"
            size="sm"
            loading={commentSubmitting}
            onClick={onComment}
            styles={{ root: { fontFamily: sans, color: ARCHIVE.primary } }}
          >
            发送
          </Button>
        </Box>
      </Group>
    </Stack>
  );

  return (
    <Paper
      component="article"
      p={{ base: 24, md: 32 }}
      radius="md"
      styles={{ root: { ...cardBase, transition: 'box-shadow 0.3s ease' } }}
      className="ethereal-post-card"
    >
      {headerRow}
      <Box w="100%" style={{ width: '100%' }}>
        {titleBlock(true)}
      </Box>
      {images.length > 0 && (
        <Box mt={24} w="100%" maw="100%">
          {imageGrid}
        </Box>
      )}
      <PostImagePreviewModal
        urls={galleryUrls}
        initialIndex={viewer.index}
        opened={viewer.open}
        onClose={() => setViewer((v) => ({ ...v, open: false }))}
        alt={post.title}
      />
      {interactionBar}
      {commentComposer}
    </Paper>
  );
}
