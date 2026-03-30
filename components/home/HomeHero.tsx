import Link from 'next/link';
import {
  Badge,
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowRight, IconHeartFilled } from '@tabler/icons-react';
import type { CoupleProfile } from '@/lib/types/mvp';
import { ARCHIVE, sans, serif } from './constants';

type Props = {
  profile: CoupleProfile | null;
  anniversaryDays: number | null;
};

export default function HomeHero({ profile, anniversaryDays }: Props) {
  const boy = profile?.boy_name ?? '我们';
  const girl = profile?.girl_name ?? 'TA';
  const subtitle =
    profile?.about_text ??
    '从相遇到现在，每一个普通的日子，都因为有你而变得值得被记住。';
  const mainPhoto = profile?.boy_avatar;
  const insetPhoto = profile?.girl_avatar;

  return (
    <Box
      component="section"
      py={{ base: 48, md: 96 }}
      px={{ base: 24, sm: 32 }}
      maw={1280}
      mx="auto"
      pos="relative"
      style={{ overflow: 'hidden' }}
    >
      <Group align="flex-start" justify="space-between" wrap="wrap" gap={32}>
        <Stack gap="xl" maw={640} style={{ zIndex: 1 }} flex="1 1 320px">
          <Badge
            size="lg"
            radius="xl"
            variant="light"
            color="pink"
            leftSection={<IconHeartFilled size={14} />}
            styles={{
              root: {
                background: 'rgba(255, 142, 158, 0.28)',
                color: '#782435',
                border: 'none',
                fontFamily: sans,
                textTransform: 'none',
              },
            }}
          >
            情侣纪念网站 · 我们的旅程
          </Badge>

          <Title
            order={1}
            fw={300}
            style={{
              fontFamily: serif,
              fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: ARCHIVE.primary,
            }}
          >
            {boy}{' '}
            <Text span fs="italic" c={ARCHIVE.primaryContainer} inherit component="span">
              &
            </Text>{' '}
            {girl}
          </Title>

          <Text
            size="xl"
            fw={300}
            maw={520}
            style={{ fontFamily: sans, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.65 }}
          >
            {subtitle}
          </Text>

          {profile?.anniversary_date && (
            <Text size="sm" c="dimmed" style={{ fontFamily: sans }}>
              相恋始于 <Text span fw={600}>{profile.anniversary_date}</Text>
            </Text>
          )}

          <Group align="flex-end" gap={24} mt="md" wrap="wrap">
            <Paper
              p="lg"
              radius="md"
              style={{
                background: ARCHIVE.surfaceContainerLowest,
                border: `1px solid ${ARCHIVE.outlineVariant}1a`,
                boxShadow: ARCHIVE.cardShadow,
              }}
            >
              <Text tt="uppercase" size="xs" fw={600} c="dimmed" style={{ letterSpacing: '0.2em' }}>
                相爱天数
              </Text>
              <Text
                mt={4}
                style={{
                  fontFamily: serif,
                  fontSize: '2.75rem',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: ARCHIVE.primary,
                }}
              >
                {anniversaryDays !== null ? anniversaryDays.toLocaleString('zh-CN') : '尚未设置'}
              </Text>
              {anniversaryDays === null && (
                <Text size="xs" c="dimmed" mt={6}>
                  在后台填写纪念日后，这里会自动累计天数。
                </Text>
              )}
            </Paper>

            <Stack gap="sm">
              <Button
                component={Link}
                href="/timeline"
                size="lg"
                radius="xl"
                rightSection={<IconArrowRight size={18} />}
                styles={{
                  root: {
                    background: `linear-gradient(90deg, ${ARCHIVE.primary}, ${ARCHIVE.primaryContainer})`,
                    border: 'none',
                    fontFamily: sans,
                    boxShadow: '0 10px 30px rgba(156, 64, 80, 0.25)',
                  },
                }}
              >
                探索我们的故事
              </Button>
              <Button
                component={Link}
                href="/posts"
                size="md"
                radius="xl"
                variant="default"
                styles={{
                  root: {
                    fontFamily: sans,
                    borderColor: ARCHIVE.outlineVariant,
                    color: ARCHIVE.primary,
                  },
                }}
              >
                查看生活记录
              </Button>
            </Stack>
          </Group>

          {(profile?.girl_message_for_boy || profile?.boy_message_for_girl) && (
            <Paper
              p="md"
              radius="md"
              mt="sm"
              style={{
                background: ARCHIVE.surfaceContainer,
                border: `1px solid ${ARCHIVE.outlineVariant}33`,
              }}
            >
              <Text size="sm" style={{ fontFamily: serif }} fs="italic" c={ARCHIVE.onSurfaceVariant}>
                {profile?.girl_message_for_boy ?? profile?.boy_message_for_girl}
              </Text>
            </Paper>
          )}
        </Stack>

        <Box
          flex="1 1 280px"
          maw={420}
          w="100%"
          hiddenFrom="md"
          mt="lg"
          mx="auto"
        >
          <Box
            pos="relative"
            w="100%"
            style={{
              aspectRatio: '4 / 5',
              maxWidth: 400,
              margin: '0 auto',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
              background: ARCHIVE.surfaceContainerHigh,
            }}
          >
            {mainPhoto ? (
              <Image src={mainPhoto} alt="我们的照片" fit="cover" h="100%" w="100%" />
            ) : (
              <Box
                h="100%"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  color: ARCHIVE.onSurfaceVariant,
                  fontFamily: sans,
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                这里以后可以放一张只属于我们的照片
              </Box>
            )}
          </Box>
        </Box>

        <Box
          flex="0 1 380px"
          maw={420}
          w="100%"
          visibleFrom="md"
          pos="relative"
          style={{ minHeight: 320 }}
        >
          <Box
            pos="relative"
            w="100%"
            style={{
              aspectRatio: '4 / 5',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              transform: 'rotate(3deg)',
              background: ARCHIVE.surfaceContainerHigh,
            }}
          >
            {mainPhoto ? (
              <Image
                src={mainPhoto}
                alt="我们的照片"
                fit="cover"
                h="100%"
                w="100%"
                style={{ filter: 'grayscale(20%)', transition: 'filter 0.7s' }}
              />
            ) : (
              <Box
                h="100%"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  color: ARCHIVE.onSurfaceVariant,
                  fontFamily: sans,
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                这里以后可以放一张只属于我们的照片
              </Box>
            )}
          </Box>

          {insetPhoto && (
            <Box
              visibleFrom="md"
              pos="absolute"
              bottom={-32}
              left={-32}
              w={192}
              h={192}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                transform: 'rotate(-6deg)',
                border: `8px solid ${ARCHIVE.bg}`,
                background: ARCHIVE.secondaryContainer,
              }}
            >
              <Image src={insetPhoto} alt="" fit="cover" h="100%" w="100%" />
            </Box>
          )}
        </Box>
      </Group>
    </Box>
  );
}
