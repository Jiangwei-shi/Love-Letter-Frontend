import Link from 'next/link';
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCirclePlus, IconEdit, IconMars, IconVenus } from '@tabler/icons-react';
import type { TimelineEvent } from '@/lib/types/mvp';
import SiteFooter from '@/shell/SiteFooter';
import { ARCHIVE, sans, serif } from '@/homepage/constants';

type Props = {
  events: TimelineEvent[];
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
}

function EventNode({ item, isLatest }: { item: TimelineEvent; isLatest: boolean }) {
  return (
    <Box component="section" className="timeline-shell-entry" pos="relative">
      <Stack align="center" gap={8} mb={52} className="timeline-shell-node">
        <Badge
          radius="xl"
          variant="light"
          styles={{
            root: {
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              background: ARCHIVE.surfaceContainerHigh,
              color: ARCHIVE.onSurfaceVariant,
              border: 'none',
              fontFamily: sans,
              fontSize: 10,
            },
          }}
        >
          {isLatest ? `${formatDate(item.event_date)} · Recent` : formatDate(item.event_date)}
        </Badge>
        <Title order={2} ta="center" style={{ fontFamily: serif, color: ARCHIVE.primary, fontWeight: 500 }}>
          {item.title}
        </Title>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 16, md: 56 }} verticalSpacing={{ base: 16, md: 24 }}>
        <Paper
          p={{ base: 22, md: 36 }}
          radius={28}
          className="timeline-perspective-card"
          style={{
            background: ARCHIVE.surfaceContainerLowest,
            border: `1px solid ${ARCHIVE.outlineVariant}1f`,
            boxShadow: '0 20px 50px rgba(156, 64, 80, 0.04)',
          }}
        >
          <Group gap={8} mb="lg">
            <IconMars size={18} color={`${ARCHIVE.primary}99`} />
            <Text
              size="10px"
              tt="uppercase"
              c="dimmed"
              style={{ letterSpacing: '0.2em', fontFamily: sans }}
            >
              His Perspective
            </Text>
          </Group>
          <Text
            fs="italic"
            fz={{ base: 'sm', md: 'lg' }}
            style={{ fontFamily: serif, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.75, fontWeight: 300 }}
          >
            "{item.boy_message || '这一天的心情，还没写下。'}"
          </Text>
        </Paper>

        <Paper
          p={{ base: 22, md: 36 }}
          radius={28}
          className="timeline-perspective-card timeline-perspective-card-right"
          style={{
            background: ARCHIVE.surfaceContainerLowest,
            border: `1px solid ${ARCHIVE.outlineVariant}1f`,
            boxShadow: '0 20px 50px rgba(156, 64, 80, 0.04)',
          }}
        >
          <Group gap={8} mb="lg">
            <IconVenus size={18} color={ARCHIVE.primaryContainer} />
            <Text
              size="10px"
              tt="uppercase"
              c="dimmed"
              style={{ letterSpacing: '0.2em', fontFamily: sans }}
            >
              Her Perspective
            </Text>
          </Group>
          <Text
            fs="italic"
            fz={{ base: 'sm', md: 'lg' }}
            style={{ fontFamily: serif, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.75, fontWeight: 300 }}
          >
            "{item.girl_message || '这一天的温柔，也在等你写下。'}"
          </Text>
        </Paper>
      </SimpleGrid>
    </Box>
  );
}

export default function TimelinePageView({ events }: Props) {
  return (
    <Box style={{ background: ARCHIVE.bg }}>
      <Box component="main" pt={20} pb={80}>
        <Box component="header" pos="relative" py={80} px={24} style={{ overflow: 'hidden' }}>
          <Box maw={860} mx="auto" ta="center" pos="relative" style={{ zIndex: 1 }}>
            <Title
              order={1}
              mb="md"
              style={{
                fontFamily: serif,
                fontWeight: 300,
                letterSpacing: '-0.03em',
                color: ARCHIVE.primary,
                fontSize: 'clamp(2.6rem, 5vw, 4.6rem)',
              }}
            >
              Our Journey
            </Title>
            <Text maw={620} mx="auto" fs="italic" style={{ color: ARCHIVE.onSurfaceVariant, opacity: 0.85 }}>
              A digital chronicle of whispered promises, shared sunsets, and the quiet magic of building a life together.
            </Text>
          </Box>
          <Box className="timeline-header-glow timeline-header-glow-1" />
          <Box className="timeline-header-glow timeline-header-glow-2" />
        </Box>

        <Box maw={1120} mx="auto" px={24} className="timeline-shell">
          {events.length > 0 && <Box className="timeline-shell-axis" />}

          {events.length === 0 ? (
            <Paper
              p={32}
              radius={24}
              style={{
                background: ARCHIVE.surfaceContainerLow,
                border: `1px dashed ${ARCHIVE.outlineVariant}80`,
                textAlign: 'center',
              }}
            >
              <Text c="dimmed">还没有时间线记录，等我们慢慢把故事写进来。</Text>
            </Paper>
          ) : (
            <Stack gap={128}>
              {events.map((item, idx) => (
                <EventNode key={item.id} item={item} isLatest={idx === 0} />
              ))}
            </Stack>
          )}

          <Box py={80} style={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              p={{ base: 28, md: 42 }}
              radius={40}
              style={{
                width: 'min(100%, 760px)',
                border: `2px dashed ${ARCHIVE.outlineVariant}55`,
                background: `${ARCHIVE.surfaceContainerLow}99`,
                textAlign: 'center',
              }}
            >
              <Stack align="center" gap={18}>
                <Box
                  w={72}
                  h={72}
                  style={{
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    background: ARCHIVE.surfaceContainerHigh,
                    color: ARCHIVE.primaryContainer,
                  }}
                >
                  <IconCirclePlus size={34} />
                </Box>
                <Title order={3} style={{ fontFamily: serif, color: '#57534e', fontWeight: 300 }}>
                  Capture a New Moment
                </Title>
                <Text c="dimmed" size="sm">
                  Add a new chapter to our digital archive of memories and whispers.
                </Text>
                <Button
                  component={Link}
                  href="/admin/timeline"
                  radius="xl"
                  variant="default"
                  styles={{
                    root: {
                      borderColor: `${ARCHIVE.primary}33`,
                      color: ARCHIVE.primary,
                      fontFamily: sans,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      fontSize: 12,
                    },
                  }}
                >
                  Open the Editor
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>

      <SiteFooter />

      <Box className="timeline-mobile-fab" hiddenFrom="md">
        <Button
          component={Link}
          href="/admin/timeline"
          radius="xl"
          size="xl"
          styles={{
            root: {
              width: 64,
              height: 64,
              borderRadius: 999,
              padding: 0,
              background: ARCHIVE.primary,
              boxShadow: '0 18px 36px rgba(0,0,0,0.25)',
            },
          }}
        >
          <IconEdit size={22} />
        </Button>
      </Box>
    </Box>
  );
}
