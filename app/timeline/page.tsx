import { getTimelineEvents } from '@/lib/supabase/queries';
import { Badge, Card, Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';

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
        <Stack gap="md">
          {events.map((item, index) => (
            <SimpleGrid key={item.id} cols={{ base: 1, md: 3 }} spacing="sm">
              <div>
                {item.boy_message ? (
                  <Card bg="blue.0" withBorder>
                    <Text size="sm">{item.boy_message}</Text>
                  </Card>
                ) : (
                  <div />
                )}
              </div>
              <div>
                <Card p="xs" ta="center">
                  <Badge color="pink" variant="light">
                    {index === 0 ? `${item.event_date} · 起点` : item.event_date}
                  </Badge>
                  <Text fw={600} mt={6} size="sm">
                    {item.title}
                  </Text>
                </Card>
              </div>
              <div>
                {item.girl_message ? (
                  <Card bg="red.0" withBorder>
                    <Text size="sm">{item.girl_message}</Text>
                  </Card>
                ) : (
                  <div />
                )}
              </div>
            </SimpleGrid>
          ))}
        </Stack>
      )}
    </Container>
  );
}
