'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Button, Stack, Text, Title } from '@mantine/core';

/** Match sidebar width; use same value for main content `ml` on desktop. */
export const ADMIN_SIDEBAR_WIDTH = 256;

export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: '控制台' },
  { href: '/admin/timeline', label: '时间线管理' },
  { href: '/admin/posts', label: '推文管理' },
  { href: '/admin/about', label: '伴侣信息' },
] as const;

export function adminNavItemActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === '/admin' || pathname === '/admin/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname() ?? '';

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: ADMIN_SIDEBAR_WIDTH,
        height: '100vh',
        background: '#faf9f5',
        borderRight: '1px solid rgba(218,192,194,0.3)',
        boxShadow: '12px 0 40px rgba(156,64,80,0.04)',
        padding: '28px 20px',
        zIndex: 50,
      }}
    >
      <Stack h="100%">
        <Stack gap={6}>
          <Title
            order={2}
            style={{
              fontFamily: "var(--font-noto-serif), 'Noto Serif', Georgia, 'Times New Roman', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#9c4050',
              fontSize: '1.65rem',
              lineHeight: 1.2,
            }}
          >
            The Archive
          </Title>
          <Text
            fz={10}
            fw={600}
            style={{
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#a8a29e',
            }}
          >
            Admin Portal
          </Text>
        </Stack>

        <Stack gap={6} mt="lg">
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
              >
                {label}
              </Button>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
