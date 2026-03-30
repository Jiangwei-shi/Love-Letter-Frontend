'use client';

import Link from 'next/link';
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
} from '@mantine/core';
import { IconBookmark, IconDots, IconHeartFilled, IconMessageCircle, IconSparkles } from '@tabler/icons-react';
import type { Post, PostComment } from '@/lib/types/mvp';
import { ARCHIVE, sans, serif } from '@/components/home/constants';

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

function pickLayout(index: number, imageCount: number): 'quote' | 'split' | 'grid' {
  if (imageCount === 0) return 'quote';
  if (imageCount >= 3) return 'grid';
  if (imageCount >= 1 && index % 2 === 1) return 'split';
  return 'grid';
}

type Props = {
  post: Post;
  index: number;
  journalNumber: number;
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
  index,
  journalNumber,
  comments,
  commentInput,
  commentError,
  commentSubmitting,
  onLike,
  onComment,
  onCommentFieldChange,
}: Props) {
  const images = sortImages(post);
  const layout = pickLayout(index, images.length);
  const likes = post.like_count ?? 0;
  const author = post.author?.trim() || '发布者';

  const cardBase = {
    background: layout === 'quote' ? `${ARCHIVE.surfaceContainerLow}80` : ARCHIVE.surfaceContainerLowest,
    border:
      layout === 'quote'
        ? `1px solid ${ARCHIVE.outlineVariant}26`
        : `1px solid ${ARCHIVE.outlineVariant}1a`,
    boxShadow: layout === 'quote' ? 'none' : ARCHIVE.cardShadow,
  } as const;

  const headerRow = (
    <Group justify="space-between" align="flex-start" wrap="nowrap" mb={layout === 'quote' ? 0 : 24}>
      <Group gap="md" wrap="nowrap">
        <Avatar
          radius="xl"
          size={48}
          color={index % 2 === 0 ? 'pink' : 'blue'}
          src={layout === 'split' ? undefined : images[0]?.image_url}
          alt=""
          styles={{
            root: {
              border: `2px solid ${index % 2 === 0 ? 'rgba(255, 142, 158, 0.35)' : 'rgba(142, 202, 255, 0.35)'}`,
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
      {layout !== 'quote' && (
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
      )}
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
          fontSize: layout === 'quote' ? '1.25rem' : '1.35rem',
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

  const imageGrid = (
    <SimpleGrid cols={3} spacing={8} className="posts-feed-img-grid">
      {images.slice(0, 9).map((img) => (
        <Box
          key={img.id}
          style={{
            aspectRatio: '1',
            borderRadius: 8,
            overflow: 'hidden',
            background: ARCHIVE.surfaceContainerHigh,
          }}
        >
          <Image src={img.image_url} alt="" h="100%" w="100%" fit="cover" />
        </Box>
      ))}
    </SimpleGrid>
  );

  const interactionBar = (
    <Group
      gap={24}
      pt={24}
      mt={24}
      w="100%"
      justify="flex-start"
      style={{ borderTop: `1px solid ${ARCHIVE.surfaceContainerHigh}` }}
      wrap="wrap"
    >
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
      <ActionIcon
        variant="subtle"
        color="gray"
        ml="auto"
        aria-label="收藏"
        styles={{ root: { color: '#78716c' } }}
      >
        <IconBookmark size={22} stroke={1.25} />
      </ActionIcon>
    </Group>
  );

  const commentPreview =
    comments.length > 0 ? (
      <Stack gap={6} mt="md">
        {comments.slice(0, 3).map((c) => (
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
      <Group align="flex-start" wrap="nowrap" gap="sm">
        <Avatar size={32} radius="xl" color="gray">
          ?
        </Avatar>
        <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
          <TextInput
            size="xs"
            radius="xl"
            placeholder="你的昵称"
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
          <Group gap="xs" wrap="nowrap" align="flex-end">
            <TextInput
              flex={1}
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
            <Button
              variant="subtle"
              size="xs"
              loading={commentSubmitting}
              onClick={onComment}
              styles={{ root: { fontFamily: sans, color: ARCHIVE.primary } }}
            >
              发送
            </Button>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );

  if (layout === 'quote') {
    return (
      <Paper
        component="article"
        p={{ base: 24, md: 32 }}
        radius="md"
        styles={{ root: { ...cardBase, transition: 'background 0.25s ease' } }}
        className="ethereal-post-card ethereal-post-card--quote"
      >
        <Stack align="center" ta="center">
          <Box
            w={40}
            h={40}
            style={{
              borderRadius: 999,
              display: 'grid',
              placeItems: 'center',
              background: `${ARCHIVE.primary}1a`,
              color: ARCHIVE.primary,
              marginBottom: 20,
            }}
          >
            <IconSparkles size={22} stroke={1.25} />
          </Box>
          {titleBlock(true)}
          <Group gap="md" mt="lg" justify="center">
            <Box h={1} w={32} bg={`${ARCHIVE.outlineVariant}55`} />
            <Text
              fz={10}
              tt="uppercase"
              c="dimmed"
              style={{ letterSpacing: '0.2em', fontFamily: sans }}
            >
              Journal Entry #{journalNumber}
            </Text>
            <Box h={1} w={32} bg={`${ARCHIVE.outlineVariant}55`} />
          </Group>
          {interactionBar}
          {commentComposer}
        </Stack>
      </Paper>
    );
  }

  if (layout === 'split' && images[0]) {
    const hero = images[0];
    return (
      <Paper
        component="article"
        p={{ base: 24, md: 32 }}
        radius="md"
        styles={{ root: { ...cardBase, transition: 'box-shadow 0.3s ease' } }}
        className="ethereal-post-card"
      >
        {headerRow}
        <Group align="flex-start" gap={32} wrap="wrap">
          <Stack style={{ flex: '1 1 280px' }} gap={0}>
            {titleBlock(true)}
          </Stack>
          <Box
            style={{
              flex: '1 1 260px',
              position: 'relative',
            }}
          >
            <Box
              style={{
                aspectRatio: '4 / 5',
                borderRadius: 12,
                overflow: 'hidden',
                background: ARCHIVE.surfaceContainerHigh,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                transform: 'rotate(0deg)',
              }}
              visibleFrom="md"
              className="posts-feed-split-rotate"
            >
              <Image src={hero.image_url} alt="" h="100%" w="100%" fit="cover" />
            </Box>
            <Box hiddenFrom="md" style={{ borderRadius: 12, overflow: 'hidden' }}>
              <Image src={hero.image_url} alt="" radius="md" fit="cover" mah={280} />
            </Box>
          </Box>
        </Group>
        {images.length > 1 && (
          <Box mt="md">
            <SimpleGrid cols={3} spacing={8}>
              {images.slice(1, 4).map((img) => (
                <Box
                  key={img.id}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: ARCHIVE.surfaceContainerHigh,
                  }}
                >
                  <Image src={img.image_url} alt="" h="100%" w="100%" fit="cover" />
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}
        {interactionBar}
        {commentComposer}
      </Paper>
    );
  }

  return (
    <Paper
      component="article"
      p={{ base: 24, md: 32 }}
      radius="md"
      styles={{ root: { ...cardBase, transition: 'box-shadow 0.3s ease' } }}
      className="ethereal-post-card"
    >
      {headerRow}
      {titleBlock(true)}
      {images.length > 0 && <Box mt={24}>{imageGrid}</Box>}
      {interactionBar}
      {commentComposer}
    </Paper>
  );
}
