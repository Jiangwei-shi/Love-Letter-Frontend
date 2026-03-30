'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BackgroundImage,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
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

  return (
    <Box
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(255, 142, 158, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(142, 202, 255, 0.16) 0%, transparent 42%), #faf9f5',
        color: '#1b1c1a',
      }}
    >
      <Container size="sm" py={56}>
        <Flex mih="calc(100vh - 112px)" align="center" justify="center">
          <Stack w="100%" maw={520} gap="xl">
            <Stack align="center" gap={6}>
              <Title
                order={1}
                ta="center"
                fw={500}
                style={{ color: '#9c4050', fontStyle: 'italic', letterSpacing: '-0.02em' }}
              >
                欢迎回到私密档案馆
              </Title>
              <Text c="#554244" opacity={0.85} ta="center" size="lg" fw={300}>
                在这里，继续守护你们的纪念时光。
              </Text>
            </Stack>

            <Card
              radius="xl"
              p={0}
              withBorder
              style={{
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.78)',
                borderColor: 'rgba(136, 114, 115, 0.16)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 12px 40px rgba(156, 64, 80, 0.08)',
              }}
            >
              <Box py="md" px="xl" style={{ borderBottom: '1px solid rgba(218, 192, 194, 0.3)' }}>
                <Title order={3} ta="center" style={{ color: '#9c4050', fontStyle: 'italic' }}>
                  登录
                </Title>
              </Box>

              <Box p="xl">
                <form onSubmit={onLogin}>
                  <Stack gap="md">
                    <TextInput
                      label="邮箱"
                      placeholder="请输入邮箱"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      required
                      styles={{
                        label: {
                          fontSize: 11,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#554244',
                          marginBottom: 6,
                          fontWeight: 700,
                        },
                        input: {
                          height: 52,
                          backgroundColor: '#e9e8e4',
                          border: '1px solid transparent',
                        },
                      }}
                    />

                    <PasswordInput
                      label="密码"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.currentTarget.value)}
                      required
                      styles={{
                        label: {
                          fontSize: 11,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#554244',
                          marginBottom: 6,
                          fontWeight: 700,
                        },
                        input: {
                          height: 52,
                          backgroundColor: '#e9e8e4',
                          border: '1px solid transparent',
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      loading={loading}
                      radius="xl"
                      size="md"
                      mt={4}
                      style={{
                        height: 52,
                        background: 'linear-gradient(90deg, #9c4050 0%, #ff8e9e 100%)',
                        boxShadow: '0 10px 26px rgba(156, 64, 80, 0.25)',
                      }}
                    >
                      进入档案馆
                    </Button>

                    {message && (
                      <Text size="sm" c={message.includes('成功') ? 'teal' : 'red'} ta="center" mt={2}>
                        {message}
                      </Text>
                    )}
                  </Stack>
                </form>
              </Box>
            </Card>

            <Card radius="xl" p={0} style={{ overflow: 'hidden', boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)' }}>
              <BackgroundImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuHmAM9OMoVn2jPlVemkiLQ1b8biL14Nv7DwIF4KOTZclR4_ecz7kuogR0AsRtlLUmFL8lKzQRZU4594NCRO1WNOym7p6PTLkoK_TImgBpG0G_VsD_uZWDEAu4SutLEuQypIwXMaCIaU0rJ4ee85fiDA8aFaKyNwCUuN8ZxiQwuRlzG6Zos9hcJq97XYKenjbMVWYCnPmGsSs2u3-TqtQLJVsXCrc2UijXIkFVNtPU6txGc_DipY1m7XsCjeVyFUYM3hVEJ-IjwmTl"
                h={190}
              >
                <Flex h="100%" align="end" justify="center" p="md">
                  <Text size="sm" c="white" style={{ fontStyle: 'italic', textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}>
                    "被光与时光温柔珍藏。"
                  </Text>
                </Flex>
              </BackgroundImage>
            </Card>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
