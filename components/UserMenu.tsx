'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Skeleton } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setDisplayName((data.user?.user_metadata?.display_name as string | undefined) ?? null);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return <Skeleton width={80} height={32} radius="xl" />;
  }

  if (!email) {
    return (
      <Button
        component={Link}
        href="/login"
        size="sm"
        radius="xl"
        styles={{
          root: {
            background: '#9c4050',
            border: 'none',
            color: '#fff',
            fontFamily: "var(--font-inter), Inter, 'Segoe UI', sans-serif",
            boxShadow: '0 6px 18px rgba(156, 64, 80, 0.2)',
          },
        }}
      >
        登录
      </Button>
    );
  }

  return (
    <Button
      component={Link}
      href="/admin"
      variant="default"
      size="sm"
      radius="xl"
      styles={{
        root: {
          borderColor: '#dac0c2',
          color: '#9c4050',
          fontFamily: "var(--font-inter), Inter, 'Segoe UI', sans-serif",
        },
      }}
    >
      {displayName?.trim() || email}
    </Button>
  );
}

