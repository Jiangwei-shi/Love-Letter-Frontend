import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';
import { getCoupleProfile } from '@/lib/supabase/queries';

export default async function AboutPage() {
  const profile = await getCoupleProfile();

  if (!profile) {
    return (
      <Text c="dimmed" size="sm">
        还没有设置关于我们内容，请先到后台完善情侣资料。
      </Text>
    );
  }

  return (
    <Stack gap="md">
      <Title order={1}>关于我们</Title>
      <Card>
        <Group justify="center" gap="xl">
          <Stack align="center" gap={6}>
            <Avatar src={profile.boy_avatar} size={92} radius="xl" color="blue">
              男
            </Avatar>
            <Text fw={600}>{profile.boy_name || '男生'}</Text>
          </Stack>
          <Stack align="center" gap={6}>
            <Avatar src={profile.girl_avatar} size={92} radius="xl" color="red">
              女
            </Avatar>
            <Text fw={600}>{profile.girl_name || '女生'}</Text>
          </Stack>
        </Group>
        <Text ta="center" mt="md" c="dimmed">
          恋爱纪念日：{profile.anniversary_date || '未设置'}
        </Text>
        <Text mt="md">{profile.about_text || '在这里写下你们的故事简介。'}</Text>
        <Card mt="sm" bg="pink.0">
          <Text ta="center">{profile.love_message || '愿我们一直保持热爱。'}</Text>
        </Card>
      </Card>
    </Stack>
  );
}

