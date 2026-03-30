'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Stack, Text, Title } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? '');
    };
    void load();
  }, []);

  const onLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <Card radius="lg" shadow="sm">
      <Stack gap="xs">
        <Title order={2}>后台管理</Title>
        <Text c="dimmed" size="sm">
          你已登录：{email || '—'}
        </Text>
        <Text size="sm">
          从上面的导航进入时间线、生活记录和情侣信息管理。
        </Text>
        <Button color="red" mt="md" onClick={onLogout}>
          退出登录
        </Button>
      </Stack>
    </Card>
  );
}
