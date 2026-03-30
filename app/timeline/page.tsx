import { getTimelineEvents } from '@/lib/supabase/queries';
import { Badge, Card, Container, Stack, Text, Title } from '@mantine/core';

export default async function TimelinePage() {
  const events = await getTimelineEvents();

  return (
    <Container px={0}>
      <Title order={1}>我们的时间线</Title>
      <Text c="dimmed" mt={6} mb="md">
        从怦然心动的那一刻开始，把重要的节点认真地放在这里。
      </Text>

      {events.length === 0 ? (
        <Text c="dimmed" size="sm">
          时间线上还空着，等第一段故事落笔，这里就会慢慢被填满。
        </Text>
      ) : (
        <Stack gap="sm">
          {events.map((item, index) => (
            <Card key={item.id}>
              <Badge color="pink" variant="light">
                {index === 0 ? `${item.event_date} · 起点` : item.event_date}
              </Badge>
              <Title order={4} mt={8}>
                {item.title}
              </Title>
              {item.description && (
                <Text size="sm" mt={4}>
                  {item.description}
                </Text>
              )}
              <Text size="xs" c="dimmed" mt={8}>
                记录于时间线
              </Text>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
