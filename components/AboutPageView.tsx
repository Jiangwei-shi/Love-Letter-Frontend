'use client';

import { useEffect, useState } from 'react';
import { Avatar, Box, Card, Center, Divider, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title, Transition } from '@mantine/core';
import type { CoupleProfile } from '@/lib/types/mvp';

type AboutPageViewProps = {
  profile: CoupleProfile;
};

export default function AboutPageView({ profile }: AboutPageViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const boyName = profile.boy_name || '男生';
  const girlName = profile.girl_name || '女生';
  const anniversary = profile.anniversary_date || '还在等待你们写下纪念日';
  const aboutText = profile.about_text || '故事还在继续，等你们慢慢把每一个温柔的日子写进这里。';
  const boyMessage = profile.boy_message_for_girl || '想对你说的话，会一直认真地放在心里。';
  const girlMessage = profile.girl_message_for_boy || '谢谢你出现在我的生活里，也谢谢你一直在。';

  return (
    <Stack gap="xl">
      <Transition mounted={mounted} transition="fade-up" duration={420} timingFunction="ease">
        {(styles) => (
          <Paper
            style={{
              ...styles,
              position: 'relative',
              overflow: 'hidden',
              background:
                'linear-gradient(135deg, rgba(255,248,245,0.96) 0%, rgba(255,239,244,0.96) 40%, rgba(245,239,255,0.96) 100%)',
              border: '1px solid rgba(255, 222, 231, 0.7)',
              boxShadow: '0 18px 45px rgba(229, 164, 178, 0.16)',
            }}
            radius="xl"
            p={{ base: 'lg', md: 'xl' }}
          >
            <Box
              style={{
                position: 'absolute',
                top: -90,
                right: -70,
                width: 260,
                height: 260,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,224,231,0.7), rgba(255,224,231,0))',
              }}
            />
            <Box
              style={{
                position: 'absolute',
                bottom: -110,
                left: -80,
                width: 280,
                height: 280,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(232,223,255,0.65), rgba(232,223,255,0))',
              }}
            />
            <Stack gap={10} style={{ position: 'relative' }}>
              <Text size="sm" c="pink.6" fw={600}>
                Our Story
              </Text>
              <Title order={1} fz={{ base: 30, md: 42 }} lh={1.2}>
                关于我们
              </Title>
              <Text c="dimmed" maw={560}>
                把日常写成纪念，把陪伴过成浪漫。这里记录我们共同走过的温柔时光。
              </Text>
              <Group mt="xs" gap="xs">
                <ThemeIcon radius="xl" size="sm" variant="light" color="pink">
                  ❤
                </ThemeIcon>
                <Text size="sm" fw={500} c="pink.8">
                  恋爱纪念日：{anniversary}
                </Text>
              </Group>
            </Stack>
          </Paper>
        )}
      </Transition>

      <Transition mounted={mounted} transition="fade-up" duration={520} timingFunction="ease" enterDelay={100}>
        {(styles) => (
          <Card
            style={{
              ...styles,
              border: '1px solid rgba(243, 226, 233, 0.9)',
              background: 'linear-gradient(180deg, #fffdfd 0%, #fff8fb 100%)',
              boxShadow: '0 10px 32px rgba(199, 155, 167, 0.1)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
            }}
            radius="xl"
            p={{ base: 'lg', md: 'xl' }}
          >
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 'md', sm: 'xl' }} verticalSpacing="md">
              <Stack align="center" gap={8}>
                <Avatar
                  src={profile.boy_avatar}
                  size={106}
                  radius="xl"
                  styles={{ root: { border: '3px solid rgba(170, 201, 255, 0.45)', boxShadow: '0 8px 25px rgba(94, 133, 198, 0.2)' } }}
                >
                  {boyName.slice(0, 1)}
                </Avatar>
                <Text fw={700} size="lg">
                  {boyName}
                </Text>
              </Stack>

              <Center>
                <Stack align="center" gap={6}>
                  <ThemeIcon size={52} radius="xl" variant="light" color="pink">
                    ❤
                  </ThemeIcon>
                  <Text size="sm" c="dimmed">
                    你和我，刚好是我们
                  </Text>
                </Stack>
              </Center>

              <Stack align="center" gap={8}>
                <Avatar
                  src={profile.girl_avatar}
                  size={106}
                  radius="xl"
                  styles={{ root: { border: '3px solid rgba(255, 183, 210, 0.5)', boxShadow: '0 8px 25px rgba(220, 129, 163, 0.2)' } }}
                >
                  {girlName.slice(0, 1)}
                </Avatar>
                <Text fw={700} size="lg">
                  {girlName}
                </Text>
              </Stack>
            </SimpleGrid>
          </Card>
        )}
      </Transition>

      <Transition mounted={mounted} transition="fade-up" duration={560} timingFunction="ease" enterDelay={160}>
        {(styles) => (
          <Paper
            style={{
              ...styles,
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(243, 225, 233, 0.85)',
              boxShadow: '0 12px 30px rgba(206, 166, 178, 0.12)',
              backdropFilter: 'blur(4px)',
            }}
            radius="xl"
            p={{ base: 'lg', md: 'xl' }}
          >
            <Stack gap="sm">
              <Title order={3}>我们的故事</Title>
              <Divider color="pink.1" />
              <Text size="md" lh={1.95} c="gray.8" style={{ whiteSpace: 'pre-line' }}>
                {aboutText}
              </Text>
            </Stack>
          </Paper>
        )}
      </Transition>

      <Transition mounted={mounted} transition="fade-up" duration={620} timingFunction="ease" enterDelay={220}>
        {(styles) => (
          <SimpleGrid style={styles} cols={{ base: 1, md: 2 }} spacing="md">
            <Card
              radius="xl"
              p="lg"
              style={{
                border: '1px solid rgba(195, 218, 255, 0.85)',
                background: 'linear-gradient(160deg, rgba(247,251,255,0.96), rgba(238,246,255,0.96))',
                boxShadow: '0 10px 28px rgba(114, 154, 222, 0.14)',
                transition: 'transform 220ms ease, box-shadow 220ms ease',
              }}
            >
              <Stack gap={8}>
                <Text fw={700} c="blue.7">
                  他想对她说
                </Text>
                <Text lh={1.85} c="gray.8" style={{ whiteSpace: 'pre-line' }}>
                  {boyMessage}
                </Text>
              </Stack>
            </Card>

            <Card
              radius="xl"
              p="lg"
              style={{
                border: '1px solid rgba(255, 209, 226, 0.95)',
                background: 'linear-gradient(160deg, rgba(255,249,251,0.97), rgba(255,242,248,0.97))',
                boxShadow: '0 10px 28px rgba(225, 139, 173, 0.15)',
                transition: 'transform 220ms ease, box-shadow 220ms ease',
              }}
            >
              <Stack gap={8}>
                <Text fw={700} c="pink.7">
                  她想对他说
                </Text>
                <Text lh={1.85} c="gray.8" style={{ whiteSpace: 'pre-line' }}>
                  {girlMessage}
                </Text>
              </Stack>
            </Card>
          </SimpleGrid>
        )}
      </Transition>
    </Stack>
  );
}
