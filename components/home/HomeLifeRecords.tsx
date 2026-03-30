import Link from 'next/link';
import { Box, Button, Image, Stack, Text, Title } from '@mantine/core';
import { IconHeartFilled } from '@tabler/icons-react';
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
          <Button component={Link} href="/posts" radius="xl" variant="default" color="pink">
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
                  variant="hero"
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
                  variant="blurCaption"
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
                  variant="heart"
                />
              </Box>
            )}
          </Box>

          <Stack align="center" mt={48}>
            <Button
              component={Link}
              href="/posts"
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

type Variant = 'hero' | 'blurCaption' | 'heart';

function FeatureTile({
  cover,
  title,
  excerpt: text,
  variant,
}: {
  cover: string | null;
  title: string;
  excerpt: string;
  variant: Variant;
}) {
  const base = {
    position: 'relative' as const,
    borderRadius: 12,
    overflow: 'hidden',
    background: ARCHIVE.surfaceContainerHigh,
    height: '100%',
    minHeight: variant === 'hero' ? 360 : 200,
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
          mih={variant === 'hero' ? 360 : 200}
          style={{
            transition: 'transform 0.7s ease',
          }}
        />
      ) : (
        <Box
          p="xl"
          style={{
            minHeight: variant === 'hero' ? 360 : 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text ta="center" c="dimmed" size="sm">
            {title}
          </Text>
        </Box>
      )}

      {variant === 'hero' && (
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
            精选故事
          </Text>
          <Title order={3} c="white" mb={8} style={{ fontFamily: serif, fontWeight: 400 }}>
            {title}
          </Title>
          <Text c="rgba(255,255,255,0.85)" size="sm" maw={420} style={{ fontFamily: sans }}>
            {text}
          </Text>
        </Box>
      )}

      {variant === 'blurCaption' && (
        <Box
          pos="absolute"
          inset={0}
          className="home-bento-blur"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <Box p="lg" bg={ARCHIVE.bg} style={{ borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
            <Text style={{ fontFamily: serif }} fs="italic" fz="lg" c={ARCHIVE.primary}>
              {title}
            </Text>
          </Box>
        </Box>
      )}

      {variant === 'heart' && (
        <>
          <Box
            pos="absolute"
            bottom={16}
            right={16}
            p={8}
            style={{
              borderRadius: 999,
              background: ARCHIVE.primary,
              color: 'white',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            }}
          >
            <IconHeartFilled size={20} />
          </Box>
          <Box
            pos="absolute"
            inset={0}
            p={24}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              background: 'linear-gradient(180deg, transparent 40%, rgba(27,28,26,0.45))',
            }}
          >
            <Text c="white" size="sm" fw={300} style={{ fontFamily: sans }}>
              {text}
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
}
