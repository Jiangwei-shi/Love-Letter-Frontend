'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { Anchor, Box, Burger, Button, Drawer, Group, Stack, Text } from '@mantine/core';
import AdminSidebar, { ADMIN_NAV_ITEMS, ADMIN_SIDEBAR_WIDTH, adminNavItemActive } from '@/components/AdminSidebar';

const MOBILE_CHROME_H = 52;

const shellBg =
  'radial-gradient(circle at top left, rgba(255, 142, 158, 0.12) 0%, transparent 38%), radial-gradient(circle at bottom right, rgba(142, 202, 255, 0.12) 0%, transparent 40%), #faf9f5';

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const [drawerOpened, { close: closeDrawer, toggle: toggleDrawer }] = useDisclosure(false);

  return (
    <Box className="admin-page-root" style={{ minHeight: '100vh', background: shellBg }}>
      <Box visibleFrom="md" style={{ position: 'relative' }}>
        <AdminSidebar />
      </Box>

      <Box
        hiddenFrom="md"
        px={12}
        className="admin-mobile-chrome"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: MOBILE_CHROME_H,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: 'rgba(250, 249, 245, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(218,192,194,0.28)',
          boxShadow: '0 12px 40px rgba(156,64,80,0.06)',
        }}
      >
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
          <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" aria-label="打开菜单" color="#9c4050" />
          <Text
            fw={600}
            fz="sm"
            style={{
              fontFamily: "var(--font-noto-serif), 'Noto Serif', Georgia, serif",
              fontStyle: 'italic',
              color: '#9c4050',
            }}
            truncate
          >
            LoveLetter · 后台
          </Text>
        </Group>
        <Anchor component={Link} href="/" c="dimmed" fz="xs" fw={500} truncate style={{ flexShrink: 0 }}>
          前往前台
        </Anchor>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="left"
        size="85%"
        padding="md"
        title="管理导航"
        styles={{
          header: { marginBottom: 8 },
          title: { fontFamily: "var(--font-noto-serif), 'Noto Serif', serif", fontWeight: 500 },
        }}
      >
        <Stack gap={6}>
          {ADMIN_NAV_ITEMS.map(({ href, label }) => {
            const active = adminNavItemActive(pathname, href);
            return (
              <Button
                key={href}
                component={Link}
                href={href}
                variant={active ? 'light' : 'subtle'}
                justify="start"
                radius="xl"
                color={active ? 'pink' : 'gray'}
                onClick={closeDrawer}
              >
                {label}
              </Button>
            );
          })}
        </Stack>
      </Drawer>

      <Box
        component="main"
        ml={{ base: 0, md: ADMIN_SIDEBAR_WIDTH }}
        style={{
          minHeight: '100vh',
          maxWidth: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
