'use client';

import { useEffect, useState } from 'react';
import { Alert, Badge, Box, Button, Card, Divider, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [lastSignInAt, setLastSignInAt] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const formatDateTime = (value?: string | null) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('zh-CN', { hour12: false });
  };

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setEmail(user?.email ?? '');
      setDisplayName((user?.user_metadata?.display_name as string | undefined) ?? '');
      setPhone(user?.phone ?? '');
      setCreatedAt(formatDateTime(user?.created_at));
      setLastSignInAt(formatDateTime(user?.last_sign_in_at));
      setIsVerified(Boolean(user?.email_confirmed_at || user?.phone_confirmed_at));
    };
    void load();
  }, []);

  const onSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() },
      ...(phone.trim() ? { phone: phone.trim() } : {}),
    });
    if (error) {
      setSaveMessage(`保存失败：${error.message}`);
      setSaving(false);
      return;
    }
    setSaveMessage('保存成功');
    setSaving(false);
  };

  const onLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const readonlyInputStyles = {
    input: {
      backgroundColor: 'rgba(240, 240, 245, 0.75)',
      color: '#8b8b95',
      borderColor: 'rgba(214, 214, 224, 0.9)',
    },
    label: {
      color: '#8b8b95',
    },
  } as const;

  return (
    <Paper
      radius="xl"
      p={{ base: 'md', md: 'lg' }}
      style={{
        background: 'linear-gradient(145deg, rgba(255,250,251,0.96), rgba(255,244,249,0.96), rgba(246,242,255,0.9))',
        border: '1px solid rgba(244, 221, 232, 0.85)',
        boxShadow: '0 14px 36px rgba(214, 152, 176, 0.14)',
      }}
    >
      <Stack gap="md">
        <Title order={2}>后台管理</Title>
        <Text c="dimmed" size="sm">
          你已登录：{email || '—'}
        </Text>
        <Card
          withBorder
          radius="lg"
          p={{ base: 'md', md: 'lg' }}
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(241, 217, 228, 0.95)',
            boxShadow: '0 8px 22px rgba(194, 153, 172, 0.12)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={4}>账号信息</Title>
              <Badge color="pink" variant="light">
                浪漫小站
              </Badge>
            </Group>
            <Divider color="pink.1" />
            <TextInput
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.currentTarget.value)}
              placeholder="请输入展示名称"
            />
            <TextInput
              label="Email（联系你宝宝修改）"
              value={email}
              readOnly
              styles={readonlyInputStyles}
            />
            <TextInput
              label="Phone（可选）"
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
              placeholder="例如 +8613800000000"
            />
            <TextInput
              label="创建时间（联系你宝宝修改）"
              value={createdAt}
              readOnly
              styles={readonlyInputStyles}
            />
            <TextInput
              label="上次登录时间（联系你宝宝修改）"
              value={lastSignInAt}
              readOnly
              styles={readonlyInputStyles}
            />
            <Group
              justify="space-between"
              align="center"
              style={{
                border: '1px solid rgba(214, 214, 224, 0.85)',
                borderRadius: 10,
                padding: '10px 12px',
                background: 'rgba(240, 240, 245, 0.5)',
              }}
            >
              <Text size="sm" c="dimmed">邮箱是否认证过</Text>
              <Badge color={isVerified ? 'teal' : 'gray'} variant="light">
                {isVerified ? '已认证' : '未认证'}
              </Badge>
            </Group>
            <Group justify="space-between" align="center">
              <Text size="xs" c="dimmed">
                仅可修改 Display name 与 Phone
              </Text>
              <Button onClick={onSave} loading={saving} color="pink">
                保存
              </Button>
            </Group>
            {saveMessage && (
              <Alert color={saveMessage.includes('失败') ? 'red' : 'green'}>
                {saveMessage}
              </Alert>
            )}
          </Stack>
        </Card>
        <Text size="sm">
          从上面的导航进入时间线、生活记录和情侣信息管理。
        </Text>
        <Box>
          <Button color="red" variant="light" onClick={onLogout}>
            退出登录
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
