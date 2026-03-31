import Link from 'next/link';
import { Anchor, Box, Group, Stack, Text } from '@mantine/core';
import { ARCHIVE, serif } from '@/components/home/constants';

/** 全站公共页脚：首页、时间线、生活记录、关于我们等统一使用 */
export default function SiteFooter() {
  const linkStyle = {
    fontFamily: serif,
    fontStyle: 'italic' as const,
  };

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
            href="/"
            c="dimmed"
            size="sm"
            style={linkStyle}
            underline="hover"
          >
            LoveLetter
          </Anchor>
          <Anchor
            component={Link}
            href="/timeline"
            c="dimmed"
            size="sm"
            style={linkStyle}
            underline="hover"
          >
            时间线
          </Anchor>
          <Anchor
            component={Link}
            href="/posts"
            c="dimmed"
            size="sm"
            style={linkStyle}
            underline="hover"
          >
            生活记录
          </Anchor>
          <Anchor
            component={Link}
            href="/about"
            c="dimmed"
            size="sm"
            style={linkStyle}
            underline="hover"
          >
            关于我们
          </Anchor>
        </Group>
        <Text size="sm" c="dimmed" ta="center" style={linkStyle}>
          我们的故事仍在继续，愿以后翻开这里时，都会觉得今天也很值得被记住。
        </Text>
      </Stack>
    </Box>
  );
}
