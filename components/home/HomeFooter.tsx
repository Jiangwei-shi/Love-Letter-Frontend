import Link from 'next/link';
import { Anchor, Box, Group, Stack, Text } from '@mantine/core';
import { ARCHIVE, serif } from './constants';

export default function HomeFooter() {
  return (
    <Box
      component="footer"
      py={48}
      px={24}
      style={{ background: ARCHIVE.bg, borderTop: 'none' }}
    >
      <Stack gap={16} align="center" maw={960} mx="auto">
        <Group gap={32} justify="center" wrap="wrap">
          <Anchor
            component={Link}
            href="/timeline"
            c="dimmed"
            size="sm"
            style={{ fontFamily: serif, fontStyle: 'italic' }}
            underline="hover"
          >
            时间线
          </Anchor>
          <Anchor
            component={Link}
            href="/posts"
            c="dimmed"
            size="sm"
            style={{ fontFamily: serif, fontStyle: 'italic' }}
            underline="hover"
          >
            生活记录
          </Anchor>
          <Anchor
            component={Link}
            href="/about"
            c="dimmed"
            size="sm"
            style={{ fontFamily: serif, fontStyle: 'italic' }}
            underline="hover"
          >
            关于我们
          </Anchor>
        </Group>
        <Text size="sm" c="dimmed" ta="center" style={{ fontFamily: serif, fontStyle: 'italic' }}>
          我们的故事仍在继续，愿以后翻开这里时，都会觉得今天也很值得被记住。
        </Text>
      </Stack>
    </Box>
  );
}
