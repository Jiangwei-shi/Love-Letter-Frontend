'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type EntryCardProps = {
  title: string;
  desc: string;
  href: string;
  actionText: string;
  accent: string;
};

function EntryCard({ title, desc, href, actionText, accent }: EntryCardProps) {
  return (
    <Card
      radius="lg"
      p="xl"
      style={{
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        boxShadow: '0 12px 40px rgba(156,64,80,0.06)',
        border: '1px solid rgba(218,192,194,0.25)',
      }}
    >
      <Box
        style={{
          width: 52,
          height: 52,
          borderRadius: 999,
          background: `${accent}12`,
          marginBottom: 20,
        }}
      />
      <Title order={3} mb={8} style={{ fontWeight: 600 }}>
        {title}
      </Title>
      <Text size="sm" c="#666" style={{ lineHeight: 1.8 }}>
        {desc}
      </Text>
      <Button
        component={Link}
        href={href}
        mt="auto"
        className="home-float-btn admin-btn admin-btn-secondary"
        radius="xl"
        variant="default"
        style={{ alignSelf: 'flex-start' }}
      >
        {actionText}
      </Button>
    </Card>
  );
}

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [lastSignInAt, setLastSignInAt] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? '早安' : currentHour < 18 ? '午安' : '晚安';
  const greetingName = displayName.trim() || '珍藏者';

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
      backgroundColor: '#f4f4f0',
      color: '#8b8b95',
      borderColor: 'rgba(214, 214, 224, 0.9)',
    },
    label: {
      color: '#6d5c5e',
      fontWeight: 600,
    },
  } as const;

  return (
    <Box className="admin-dashboard-main">
        <Container fluid maw={1180} px={0}>
          <Stack gap="xl">
            <Box>
              <Title order={2} mb={8}>
                {timeGreeting}，{greetingName}
              </Title>
              <Text c="#6d5c5e" maw={620}>
                欢迎回到您的记忆圣殿。在这里，您可以编织过去，记录现在，为未来留下永恒印记。
              </Text>
            </Box>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
                <Card
                  radius="lg"
                  p="xl"
                  style={{
                    height: '100%',
                    background: '#ffffff',
                    boxShadow: '0 12px 40px rgba(156,64,80,0.06)',
                    border: '1px solid rgba(218,192,194,0.25)',
                  }}
                >
                  <Stack h="100%">
                    <Title order={3}>快速操作</Title>
                    <Text size="sm" c="#666" style={{ lineHeight: 1.8 }}>
                      当前登录账号：{email || '—'}
                    </Text>
                    <Button
                      component={Link}
                      href="/admin"
                      className="home-float-btn admin-btn admin-btn-primary"
                      radius="xl"
                    >
                      修改账号信息
                    </Button>
                    <Button
                      mt="auto"
                      className="home-float-btn admin-btn admin-btn-danger"
                      radius="xl"
                      onClick={onLogout}
                    >
                      退出登录
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
                <EntryCard
                  title="时间线管理"
                  desc="整理生活中的里程碑，让每一个重要时刻都按序排列。"
                  href="/admin/timeline"
                  actionText="管理回忆"
                  accent="#1c6392"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
                <EntryCard
                  title="推文管理"
                  desc="发布、编辑或删除记录内容，持续完善你们的故事。"
                  href="/admin/posts"
                  actionText="书写生活"
                  accent="#006d3e"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
                <EntryCard
                  title="情侣信息"
                  desc="维护双人空间资料，更新我们在一起的时间与专属誓言。"
                  href="/admin/about"
                  actionText="守护甜蜜"
                  accent="#9c4050"
                />
              </Grid.Col>
            </Grid>

            <Card
              withBorder
              radius="lg"
              p={{ base: 'md', md: 'lg' }}
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(218,192,194,0.45)',
                boxShadow: '0 12px 32px rgba(156,64,80,0.08)',
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Title order={4}>账号信息</Title>
                  <Badge color="pink" variant="light">
                    控制台
                  </Badge>
                </Group>
                <Divider color="pink.1" />
                <TextInput
                  label="显示名称"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.currentTarget.value)}
                  placeholder="请输入展示名称"
                />
                <TextInput
                  label="邮箱（只读）"
                  value={email}
                  readOnly
                  styles={readonlyInputStyles}
                />
                <Stack gap="sm">
                  <TextInput
                    label="创建时间（只读）"
                    value={createdAt}
                    readOnly
                    styles={readonlyInputStyles}
                  />
                  <TextInput
                    label="上次登录时间（只读）"
                    value={lastSignInAt}
                    readOnly
                    styles={readonlyInputStyles}
                  />
                </Stack>
                <Group
                  justify="space-between"
                  align="center"
                  style={{
                    border: '1px solid rgba(214, 214, 224, 0.85)',
                    borderRadius: 10,
                    padding: '10px 12px',
                    background: '#f4f4f0',
                  }}
                >
                  <Text size="sm" c="dimmed">
                    认证状态
                  </Text>
                  <Badge color={isVerified ? 'teal' : 'gray'} variant="light">
                    {isVerified ? '已认证' : '未认证'}
                  </Badge>
                </Group>
                <Group justify="space-between" align="center">
                  <Text size="xs" c="dimmed">
                    仅可修改显示名称
                  </Text>
                  <Button
                    onClick={onSave}
                    loading={saving}
                    radius="xl"
                    className="home-float-btn admin-btn admin-btn-primary"
                  >
                    保存更改
                  </Button>
                </Group>
                {saveMessage && (
                  <Alert color={saveMessage.includes('失败') ? 'red' : 'green'}>
                    {saveMessage}
                  </Alert>
                )}
              </Stack>
            </Card>

            <Flex gap="xl" align="center" direction={{ base: 'column', md: 'row' }}>
              <Box flex={1}>
                <Title order={3} mb="sm" style={{ color: '#9c4050' }}>
                  “记忆是灵魂的香气，记录则是让香气永存的瓶子。”
                </Title>
                <Text c="#6d5c5e" fs="italic">
                  —— 斯嘉玮·史率格致词
                </Text>
              </Box>
              <Card radius="lg" p={0} style={{ flex: 1, minWidth: 280, overflow: 'hidden' }}>
                <Box
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    backgroundImage: 'url(/aboutUs.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </Card>
            </Flex>
          </Stack>
        </Container>
    </Box>
  );
}
