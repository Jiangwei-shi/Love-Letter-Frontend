import { getTimelineEvents } from '@/lib/supabase/queries';
import { Badge, Box, Card, Container, Paper, Stack, Text, Title } from '@mantine/core';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function TimelinePage() {
  noStore();
  const events = await getTimelineEvents();
  const orderedEvents = [...events].sort((a, b) => {
    const at = new Date(a.event_date).getTime();
    const bt = new Date(b.event_date).getTime();
    return bt - at;
  });

  return (
    <Container px={0} py="md">
      <Paper
        radius="xl"
        p={{ base: 'lg', md: 'xl' }}
        mb="xl"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, rgba(255,250,248,0.95) 0%, rgba(255,242,247,0.95) 48%, rgba(246,241,255,0.95) 100%)',
          border: '1px solid rgba(242, 219, 231, 0.9)',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: -76,
            right: -62,
            width: 210,
            height: 210,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,223,236,0.75), rgba(255,223,236,0))',
          }}
        />
        <Box
          style={{
            position: 'relative',
            width: 'fit-content',
            margin: '0 auto',
            padding: '6px 0 10px',
          }}
        >
          <Text size="sm" ta="center" c="pink.6" fw={600}>Our Timeline</Text>
          <Title order={1} ta="center" mt={2}>我们的时间线</Title>
        </Box>
        <Text c="dimmed" ta="center" mt="md">
          把一路走来的纪念点，写在同一条线里，留给未来的我们慢慢回看。
        </Text>
      </Paper>

      {orderedEvents.length === 0 ? (
        <Card
          radius="lg"
          withBorder
          p="lg"
          style={{
            background: 'linear-gradient(180deg, #fffdfd 0%, #fff8fb 100%)',
            borderColor: 'rgba(241, 221, 230, 0.95)',
          }}
        >
          <Text c="dimmed" size="sm">
            还没有时间线记录，等我们慢慢把故事写进来。
          </Text>
        </Card>
      ) : (
        <Stack gap={34} pos="relative">
          <Box
            style={{
              position: 'absolute',
              left: '50%',
              top: 4,
              bottom: 4,
              width: 2,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, rgba(247, 198, 218, 0.2), rgba(222, 190, 245, 0.58), rgba(247, 198, 218, 0.2))',
            }}
            visibleFrom="md"
          />

          <Box
            hiddenFrom="md"
            style={{
              position: 'absolute',
              left: '50%',
              top: 2,
              bottom: 2,
              width: 2,
              transform: 'translateX(-50%)',
              background: 'rgba(232, 197, 217, 0.8)',
            }}
          />

          {orderedEvents.map((item, index) => (
            <Box
              key={item.id}
              style={{
                position: 'relative',
                minHeight: 128,
                paddingLeft: '2px',
                paddingRight: '2px',
              }}
            >
              <Paper
                visibleFrom="md"
                radius="md"
                p="xs"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  minWidth: 148,
                  textAlign: 'center',
                  zIndex: 2,
                  border: '1px solid rgba(239, 208, 222, 0.95)',
                  background: 'rgba(255, 249, 252, 0.98)',
                  boxShadow: '0 8px 22px rgba(205, 160, 179, 0.12)',
                }}
              >
                <Badge color="pink" variant="light" size="sm">
                  {index === 0 ? `${formatDate(item.event_date)} · 最近` : formatDate(item.event_date)}
                </Badge>
                <Text fw={700} fz="sm" mt={6}>{item.title}</Text>
              </Paper>

              <Box
                visibleFrom="md"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  width: '40%',
                  transform: 'translateY(-50%)',
                }}
              >
                <Paper
                  radius="lg"
                  p="md"
                  style={{
                    position: 'relative',
                    border: '1px solid rgba(188, 214, 249, 0.95)',
                    background: 'linear-gradient(160deg, rgba(245, 250, 255, 0.98), rgba(235, 246, 255, 0.98))',
                    boxShadow: '0 10px 24px rgba(111, 152, 214, 0.12)',
                  }}
                >
                  <Box
                    style={{
                      position: 'absolute',
                      right: -8,
                      top: '50%',
                      marginTop: -7,
                      width: 14,
                      height: 14,
                      background: 'rgba(231, 244, 255, 1)',
                      borderTop: '1px solid rgba(188, 214, 249, 0.95)',
                      borderRight: '1px solid rgba(188, 214, 249, 0.95)',
                      transform: 'rotate(45deg)',
                    }}
                  />
                  <Text size="xs" c="blue.7" fw={700} mb={6}>男生留言</Text>
                  <Text size="sm" lh={1.75} style={{ whiteSpace: 'pre-line' }}>
                    {item.boy_message || '这一天的心情，还没写下。'}
                  </Text>
                </Paper>
              </Box>

              <Box
                visibleFrom="md"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  width: '40%',
                  transform: 'translateY(-50%)',
                }}
              >
                <Paper
                  radius="lg"
                  p="md"
                  style={{
                    position: 'relative',
                    border: '1px solid rgba(252, 205, 223, 0.95)',
                    background: 'linear-gradient(160deg, rgba(255,249,252,0.98), rgba(255,238,246,0.98))',
                    boxShadow: '0 10px 24px rgba(219, 138, 171, 0.12)',
                  }}
                >
                  <Box
                    style={{
                      position: 'absolute',
                      left: -8,
                      top: '50%',
                      marginTop: -7,
                      width: 14,
                      height: 14,
                      background: 'rgba(255, 236, 245, 1)',
                      borderLeft: '1px solid rgba(252, 205, 223, 0.95)',
                      borderBottom: '1px solid rgba(252, 205, 223, 0.95)',
                      transform: 'rotate(45deg)',
                    }}
                  />
                  <Text size="xs" c="pink.7" fw={700} mb={6}>女生留言</Text>
                  <Text size="sm" lh={1.75} style={{ whiteSpace: 'pre-line' }}>
                    {item.girl_message || '这一天的温柔，也在等你写下。'}
                  </Text>
                </Paper>
              </Box>

              <Stack hiddenFrom="md" gap="xs" style={{ position: 'relative' }}>
                <Paper
                  radius="md"
                  p="xs"
                  style={{
                    width: 'fit-content',
                    margin: '0 auto',
                    border: '1px solid rgba(239, 208, 222, 0.95)',
                    background: 'rgba(255, 249, 252, 0.98)',
                  }}
                >
                  <Badge color="pink" variant="light" size="sm">
                    {index === 0 ? `${formatDate(item.event_date)} · 最近` : formatDate(item.event_date)}
                  </Badge>
                  <Text fw={700} fz="sm" mt={4}>{item.title}</Text>
                </Paper>
                <Paper
                  radius="lg"
                  p="sm"
                  style={{
                    width: '88%',
                    alignSelf: 'flex-start',
                    border: '1px solid rgba(188, 214, 249, 0.95)',
                    background: 'linear-gradient(160deg, rgba(245, 250, 255, 0.98), rgba(235, 246, 255, 0.98))',
                  }}
                >
                  <Text size="xs" c="blue.7" fw={700} mb={4}>男生留言</Text>
                  <Text size="sm" lh={1.7} style={{ whiteSpace: 'pre-line' }}>
                    {item.boy_message || '这一天的心情，还没写下。'}
                  </Text>
                </Paper>
                <Paper
                  radius="lg"
                  p="sm"
                  style={{
                    width: '88%',
                    alignSelf: 'flex-end',
                    border: '1px solid rgba(252, 205, 223, 0.95)',
                    background: 'linear-gradient(160deg, rgba(255,249,252,0.98), rgba(255,238,246,0.98))',
                  }}
                >
                  <Text size="xs" c="pink.7" fw={700} mb={4}>女生留言</Text>
                  <Text size="sm" lh={1.7} style={{ whiteSpace: 'pre-line' }}>
                    {item.girl_message || '这一天的温柔，也在等你写下。'}
                  </Text>
                </Paper>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
}
