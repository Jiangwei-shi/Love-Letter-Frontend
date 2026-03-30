import Link from 'next/link';
import { Box, Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconHeartFilled } from '@tabler/icons-react';
import type { CoupleProfile } from '@/lib/types/mvp';
import { ARCHIVE, sans, serif } from './constants';

type Props = {
  profile: CoupleProfile | null;
};

export default function HomeHeartNote({ profile }: Props) {
  const noteHint =
    profile?.boy_message_for_girl?.trim() ||
    profile?.girl_message_for_boy?.trim() ||
    '把想说的话留给彼此，也留给未来的我们。';

  return (
    <Box
      component="section"
      py={96}
      px={{ base: 24, sm: 32 }}
      style={{ background: ARCHIVE.heartTint }}
    >
      <Stack gap="lg" maw={720} mx="auto" align="center" ta="center">
        <IconHeartFilled size={40} color={ARCHIVE.primary} />
        <Title
          order={2}
          style={{
            fontFamily: serif,
            fontWeight: 400,
            color: '#782435',
          }}
        >
          把回忆留在离心脏最近的地方
        </Title>
        <Text
          size="lg"
          fw={300}
          style={{ fontFamily: sans, color: ARCHIVE.onSurfaceVariant, lineHeight: 1.7 }}
        >
          一个只属于我们的小宇宙。无论外面的世界多快，回到这里时，愿我们仍觉得当下很值得。
        </Text>
        <Text size="sm" maw={520} fs="italic" c="dimmed" style={{ fontFamily: serif }}>
          {noteHint}
        </Text>
        <Group justify="center" wrap="wrap" gap="md" w="100%">
          <TextInput
            radius="xl"
            size="md"
            flex={{ base: '1 1 100%', sm: '0 1 320px' }}
            placeholder="写一句想对 Ta 说的话…"
            readOnly
            styles={{
              input: {
                background: ARCHIVE.surfaceContainerLowest,
                border: 'none',
                boxShadow: ARCHIVE.cardShadowSoft,
                fontFamily: sans,
              },
            }}
          />
          <Button
            component={Link}
            href="/posts"
            size="md"
            radius="xl"
            styles={{
              root: {
                background: ARCHIVE.primary,
                color: '#fff',
                fontFamily: sans,
                boxShadow: '0 6px 20px rgba(156, 64, 80, 0.22)',
              },
            }}
          >
            去记录生活
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
