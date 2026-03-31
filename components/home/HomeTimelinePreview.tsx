import Link from 'next/link';
import { Anchor, Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconExternalLink, IconPlane, IconSparkles, IconToolsKitchen2 } from '@tabler/icons-react';
import type { TimelineEvent } from '@/lib/types/mvp';
import { ARCHIVE, sans, serif } from './constants';

const ICONS = [IconSparkles, IconToolsKitchen2, IconPlane];

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

type Props = {
  events: TimelineEvent[];
};

export default function HomeTimelinePreview({ events }: Props) {
  return (
    <Box
      component="section"
      py={96}
      px={{ base: 24, sm: 32 }}
      style={{ background: ARCHIVE.surfaceContainerLow }}
    >
      <Box maw={1280} mx="auto">
        <Group justify="space-between" align="flex-end" mb={48} wrap="wrap" gap="md">
          <Stack gap={6}>
            <Title order={2} style={{ fontFamily: serif, color: ARCHIVE.primary, fontWeight: 400 }}>
              时光里的片段
            </Title>
            <Text fs="italic" c="dimmed" style={{ fontFamily: sans }}>
              沿着时间线，拾起我们一起走过的脚印。
            </Text>
          </Stack>
          <Anchor
            component={Link}
            href="/timeline"
            fw={500}
            c={ARCHIVE.primary}
            underline="never"
            display="inline-flex"
            style={{ fontFamily: sans, alignItems: 'center', gap: 6 }}
          >
            查看完整时间线 <IconExternalLink size={16} stroke={1.5} />
          </Anchor>
        </Group>

        {events.length === 0 ? (
          <Paper
            p="xl"
            radius="md"
            style={{ background: ARCHIVE.surfaceContainerLowest, boxShadow: ARCHIVE.cardShadowSoft }}
          >
            <Text c="dimmed" style={{ fontFamily: sans }}>
              时间线上还空空的，等第一段故事落笔，这里就会慢慢被填满。
            </Text>
          </Paper>
        ) : (
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 32,
            }}
          >
            {events.map((item, index) => {
              const Icon = ICONS[index % ICONS.length];
              const offset = index === 1;
              return (
                <Paper
                  key={item.id}
                  p={32}
                  radius="md"
                  className={offset ? 'home-timeline-card-offset' : undefined}
                  style={{
                    background: ARCHIVE.surfaceContainerLowest,
                    boxShadow: ARCHIVE.cardShadowSoft,
                  }}
                >
                  <Stack gap="lg">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Text
                        tt="uppercase"
                        size="xs"
                        fw={700}
                        style={{
                          fontFamily: sans,
                          letterSpacing: '0.12em',
                          color: `${ARCHIVE.primary}99`,
                        }}
                      >
                        {formatEventDate(item.event_date)}
                      </Text>
                      <Icon size={26} color={ARCHIVE.secondaryContainer} stroke={1.25} />
                    </Group>
                    <Title order={3} style={{ fontFamily: serif, fontWeight: 400 }}>
                      {item.title}
                    </Title>
                    <Stack gap="md">
                      {item.boy_message && (
                        <Box pl="md" style={{ borderLeft: `2px solid ${ARCHIVE.secondaryContainer}` }}>
                          <Text
                            tt="uppercase"
                            size="xs"
                            c="dimmed"
                            mb={4}
                            style={{ letterSpacing: '0.08em', fontFamily: sans }}
                          >
                            他的记忆
                          </Text>
                          <Text
                            size="sm"
                            fs="italic"
                            style={{ fontFamily: sans, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.65 }}
                          >
                            「{item.boy_message}」
                          </Text>
                        </Box>
                      )}
                      {item.girl_message && (
                        <Box pl="md" style={{ borderLeft: `2px solid ${ARCHIVE.primaryContainer}` }}>
                          <Text
                            tt="uppercase"
                            size="xs"
                            c="dimmed"
                            mb={4}
                            style={{ letterSpacing: '0.08em', fontFamily: sans }}
                          >
                            她的记忆
                          </Text>
                          <Text
                            size="sm"
                            fs="italic"
                            style={{ fontFamily: sans, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.65 }}
                          >
                            「{item.girl_message}」
                          </Text>
                        </Box>
                      )}
                      {!item.boy_message && !item.girl_message && (
                        <Text size="sm" c="dimmed">
                          这段回忆还没有补充彼此的叮咛，去时间线里慢慢填满吧。
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
