'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Group, Loader, Pill } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const check = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      setLoading(false);
    };

    void check();
  }, [pathname, router]);

  if (loading) {
    return (
      <Group justify="center" mt="md">
        <Loader size="sm" />
        <span>正在校验登录状态...</span>
      </Group>
    );
  }

  return (
    <div>
      <Group gap="xs" mb="md">
        <Pill component={Link} href="/admin" withRemove={false}>
          概览
        </Pill>
        <Pill component={Link} href="/admin/timeline" withRemove={false}>
          时间线
        </Pill>
        <Pill component={Link} href="/admin/posts" withRemove={false}>
          生活记录
        </Pill>
        <Pill component={Link} href="/admin/albums" withRemove={false}>
          相册
        </Pill>
      </Group>
      {children}
    </div>
  );
}
