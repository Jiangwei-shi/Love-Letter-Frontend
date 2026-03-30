'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Skeleton } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return <Skeleton width={80} height={32} radius="xl" />;
  }

  if (!email) {
    return (
      <Button component={Link} href="/login" variant="light" size="xs" radius="xl">
        登录
      </Button>
    );
  }

  return (
    <Button component={Link} href="/admin" variant="light" size="xs" radius="xl">
      {email}
    </Button>
  );
}

