'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Group, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get('next') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.replace(nextPath);
  };

  const onRegister = async () => {
    setLoading(true);
    setMessage('');
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('注册成功，请直接登录。');
  };

  return (
    <Card radius="lg" shadow="sm" style={{ maxWidth: 480, margin: '0 auto' }}>
      <Stack gap="xs">
        <Title order={2}>登录后台</Title>
        <Text size="sm" c="dimmed">
          用 Supabase Auth 管理你们的纪念内容。
        </Text>
      </Stack>

      <form onSubmit={onLogin}>
        <Stack gap="sm" mt="md">
          <TextInput
            label="邮箱"
            placeholder="请输入邮箱"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="密码"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <Group justify="space-between" mt="xs">
            <Button type="submit" loading={loading}>
              登录
            </Button>
            <Button variant="light" type="button" onClick={onRegister} loading={loading}>
              注册
            </Button>
          </Group>
          {message && (
            <Text size="sm" mt="xs">
              {message}
            </Text>
          )}
        </Stack>
      </form>
    </Card>
  );
}
