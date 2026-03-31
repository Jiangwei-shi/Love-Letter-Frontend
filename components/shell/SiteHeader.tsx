'use client';

import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import { Anchor, Box, Burger, Drawer, Group, Stack, Text } from '@mantine/core';
import UserMenu from '@/shell/UserMenu';
import { ARCHIVE, serif } from '@/homepage/constants';

const navLinkProps = {
  underline: 'never' as const,
  styles: {
    root: {
      color: '#78716c',
      fontSize: '0.9375rem',
      fontFamily: serif,
      fontWeight: 300,
      transition: 'color 0.2s ease',
      '&:hover': { color: ARCHIVE.primary },
    },
  },
};

export default function SiteHeader() {
  const [opened, { close, toggle }] = useDisclosure(false);

  const links = (
    <>
      <Anchor component={Link} href="/timeline" {...navLinkProps}>
        时间线
      </Anchor>
      <Anchor component={Link} href="/posts" {...navLinkProps}>
        生活记录
      </Anchor>
      <Anchor component={Link} href="/about" {...navLinkProps}>
        关于我们
      </Anchor>
      <UserMenu />
    </>
  );

  return (
    <Box
      component="header"
      className="site-root-header"
      pos="fixed"
      top={0}
      left={0}
      right={0}
      style={{
        zIndex: 50,
        background: 'rgba(250, 249, 245, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: ARCHIVE.navShadow,
      }}
    >
      <Group justify="space-between" align="center" px={32} py={16} maw={1280} mx="auto" wrap="nowrap">
        <Anchor component={Link} href="/" underline="never">
          <Text
            fz="xl"
            fw={400}
            fs="italic"
            style={{ fontFamily: serif, color: ARCHIVE.primary }}
          >
            LoveLetter
          </Text>
        </Anchor>

        <Group gap={32} visibleFrom="md" wrap="nowrap" align="center">
          {links}
        </Group>

        <Burger hiddenFrom="md" opened={opened} onClick={toggle} aria-label="打开菜单" color={ARCHIVE.primary} />
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xs"
        title="导航"
        styles={{
          header: { fontFamily: serif },
          body: { paddingTop: 8 },
        }}
      >
        <Stack gap="lg" onClick={close}>
          <Anchor component={Link} href="/" {...navLinkProps}>
            LoveLetter
          </Anchor>
          {links}
        </Stack>
      </Drawer>
    </Box>
  );
}
