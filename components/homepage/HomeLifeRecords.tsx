import Link from 'next/link';
import { Box, Button, Image, Stack, Text, Title } from '@mantine/core';
import type { Post } from '@/lib/types/mvp';
import { ARCHIVE, sans, serif } from './constants';

function getCoverUrl(post: Post): string | null {
  const imgs = post.post_images;
  if (!imgs?.length) return null;
  return [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url ?? null;
}

function excerpt(content: string, len = 80) {
  if (content.length <= len) return content;
  return `${content.slice(0, len)}…`;
}

type Props = {
  posts: Post[];
};

export default function HomeLifeRecords({ posts }: Props) {
  const [main, second, third] = posts;

  return (
    <Box component="section" py={96} px={{ base: 24, sm: 32 }} maw={1280} mx="auto">
      <Stack gap={48} align="center" mb={56}>
        <Title order={2} ta="center" style={{ fontFamily: serif, color: ARCHIVE.primary, fontWeight: 400 }}>
          生活记录
        </Title>
        <Box
          h={1}
          w={96}
          style={{
            background: `linear-gradient(90deg, transparent, ${ARCHIVE.primaryContainer}, transparent)`,
          }}
        />
      </Stack>

      {posts.length === 0 ? (
        <Stack align="center" gap="md">
          <Text c="dimmed" ta="center" maw={480} style={{ fontFamily: sans }}>
            还没有写下哪怕一小段日常。没关系，从某一天的一个瞬间开始就好。
          </Text>
          <Button
            component={Link}
            href="/posts"
            radius="xl"
            variant="default"
            color="pink"
            styles={{
              root: {
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: ARCHIVE.cardShadowSoft,
                },
              },
            }}
          >
            去生活记录看看
          </Button>
        </Stack>
      ) : (
        <>
          <Box className="home-life-bento">
            {main && (
              <Box
                className="home-life-bento__main"
                component={Link}
                href={`/posts/${main.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  minHeight: 280,
                  height: '100%',
                }}
              >
                <FeatureTile
                  cover={getCoverUrl(main)}
                  title={main.title}
                  excerpt={excerpt(main.content)}
                  minHeight={360}
                />
              </Box>
            )}
            {second && (
              <Box
                className="home-life-bento__sec1"
                component={Link}
                href={`/posts/${second.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', minHeight: 200 }}
              >
                <FeatureTile
                  cover={getCoverUrl(second)}
                  title={second.title}
                  excerpt={excerpt(second.content)}
                  minHeight={200}
                />
              </Box>
            )}
            {third && (
              <Box
                className="home-life-bento__sec2"
                component={Link}
                href={`/posts/${third.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', minHeight: 200 }}
              >
                <FeatureTile
                  cover={getCoverUrl(third)}
                  title={third.title}
                  excerpt={excerpt(third.content)}
                  minHeight={200}
                />
              </Box>
            )}
          </Box>

          <Stack align="center" mt={48}>
            <Button
              component={Link}
              href="/posts"
              className="home-float-btn"
              size="md"
              radius="xl"
              variant="default"
              styles={{
                root: {
                  borderWidth: 2,
                  borderColor: ARCHIVE.primary,
                  color: ARCHIVE.primary,
                  fontFamily: sans,
                },
              }}
            >
              浏览全部记录
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}

function FeatureTile({
  cover,
  title,
  excerpt: text,
  minHeight,
}: {
  cover: string | null;
  title: string;
  excerpt: string;
  minHeight: number;
}) {
  const base = {
    position: 'relative' as const,
    borderRadius: 12,
    overflow: 'hidden',
    background: ARCHIVE.surfaceContainerHigh,
    height: '100%',
    minHeight,
    boxShadow: ARCHIVE.cardShadowSoft,
  };

  return (
    <Box className="home-bento-tile" style={base}>
      {cover ? (
        <Image
          src={cover}
          alt=""
          fit="cover"
          h="100%"
          w="100%"
          mih={minHeight}
          style={{
            transition: 'transform 0.7s ease',
          }}
        />
      ) : (
        <Box
          style={{
            minHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box p="xl" style={{ width: '100%' }}>
            <Text ta="center" c="dimmed" size="sm">
              {title}
            </Text>
          </Box>
        </Box>
      )}

      {cover && (
        <Box
          pos="absolute"
          inset={0}
          p={32}
          className="home-bento-overlay"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: 'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.62))',
          }}
        >
          <Text tt="uppercase" size="xs" fw={700} c="#ffd9dc" mb={8} style={{ letterSpacing: '0.16em' }}>
            最近故事
          </Text>
          <Title order={3} c="white" mb={8} style={{ fontFamily: serif, fontWeight: 400 }}>
            {title}
          </Title>
          <Text c="rgba(255,255,255,0.85)" size="sm" maw={420} style={{ fontFamily: sans }}>
            {text}
          </Text>
        </Box>
      )}

    </Box>
  );
}
