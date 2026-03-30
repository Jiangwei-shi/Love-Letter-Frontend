'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, Box, Button, Card, FileButton, Group, Loader, SimpleGrid, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import AdminSidebar, { ADMIN_SIDEBAR_WIDTH } from '@/components/AdminSidebar';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { CoupleProfile } from '@/lib/types/mvp';

type CoupleCardProps = {
  profile: CoupleProfile;
  uploadingBoyAvatar: boolean;
  uploadingGirlAvatar: boolean;
  onProfileChange: (next: CoupleProfile) => void;
  onUploadAvatar: (file: File, role: 'boy' | 'girl') => Promise<void>;
};

function CoupleProfilesCard({
  profile,
  uploadingBoyAvatar,
  uploadingGirlAvatar,
  onProfileChange,
  onUploadAvatar,
}: CoupleCardProps) {
  return (
    <Card
      radius="lg"
      p="xl"
      withBorder
      style={{
        background: '#ffffff',
        borderColor: 'rgba(218,192,194,0.22)',
        boxShadow: '0 12px 40px rgba(156,64,80,0.02)',
      }}
    >
      <Group gap={8} mb="lg">
        <Text c="#9c4050">❤</Text>
        <Title order={3} style={{ fontStyle: 'italic', fontWeight: 500 }}>
          The Couple
        </Title>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={48}>
        <Stack gap="md" align="center">
          <FileButton onChange={(file) => file && void onUploadAvatar(file, 'boy')} accept="image/png,image/jpeg,image/webp">
            {(props) => (
              <Avatar
                {...props}
                src={profile.boy_avatar}
                size={126}
                radius={999}
                style={{ cursor: 'pointer', border: '4px solid #e9e8e4' }}
              >
                男
              </Avatar>
            )}
          </FileButton>
          <Button
            size="xs"
            variant="light"
            loading={uploadingBoyAvatar}
            onClick={() => onProfileChange({ ...profile, boy_avatar: null })}
          >
            清除头像
          </Button>
          <TextInput
            w="100%"
            label="Partner A Name"
            value={profile.boy_name ?? ''}
            onChange={(e) => onProfileChange({ ...profile, boy_name: e.currentTarget.value })}
            styles={{
              label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7d7071' },
              input: { backgroundColor: '#f4f4f0', border: 'none' },
            }}
          />
        </Stack>

        <Stack gap="md" align="center">
          <FileButton onChange={(file) => file && void onUploadAvatar(file, 'girl')} accept="image/png,image/jpeg,image/webp">
            {(props) => (
              <Avatar
                {...props}
                src={profile.girl_avatar}
                size={126}
                radius={999}
                style={{ cursor: 'pointer', border: '4px solid #e9e8e4' }}
              >
                女
              </Avatar>
            )}
          </FileButton>
          <Button
            size="xs"
            variant="light"
            loading={uploadingGirlAvatar}
            onClick={() => onProfileChange({ ...profile, girl_avatar: null })}
          >
            清除头像
          </Button>
          <TextInput
            w="100%"
            label="Partner B Name"
            value={profile.girl_name ?? ''}
            onChange={(e) => onProfileChange({ ...profile, girl_name: e.currentTarget.value })}
            styles={{
              label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7d7071' },
              input: { backgroundColor: '#f4f4f0', border: 'none' },
            }}
          />
        </Stack>
      </SimpleGrid>
    </Card>
  );
}

export default function AdminAboutPage() {
  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [anniversaryDate, setAnniversaryDate] = useState<string | null>(null);
  const [uploadingBoyAvatar, setUploadingBoyAvatar] = useState(false);
  const [uploadingGirlAvatar, setUploadingGirlAvatar] = useState(false);

  const load = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.from('couple_profile').select('*').limit(1).maybeSingle();
    if (!data) {
      const { data: created } = await supabase
        .from('couple_profile')
        .insert({})
        .select('*')
        .single();
      setProfile((created ?? null) as CoupleProfile | null);
      setAnniversaryDate(created?.anniversary_date ?? null);
      return;
    }
    setProfile((data ?? null) as CoupleProfile | null);
    setAnniversaryDate(data?.anniversary_date ?? null);
  };

  useEffect(() => {
    void load();
  }, []);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.from('couple_profile').update({
      boy_name: profile.boy_name,
      boy_avatar: profile.boy_avatar,
      girl_name: profile.girl_name,
      girl_avatar: profile.girl_avatar,
      anniversary_date: anniversaryDate,
      about_text: profile.about_text,
      boy_message_for_girl: profile.boy_message_for_girl,
      girl_message_for_boy: profile.girl_message_for_boy,
    }).eq('id', profile.id);
    setSaving(false);
  };

  const uploadAvatar = async (file: File, role: 'boy' | 'girl') => {
    if (!profile) return;
    const supabase = getSupabaseBrowserClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `couple-profile/${profile.id}/${role}-${Date.now()}.${ext}`;
    if (role === 'boy') setUploadingBoyAvatar(true);
    if (role === 'girl') setUploadingGirlAvatar(true);
    try {
      const { error: uploadError } = await supabase.storage.from('couple-avatars').upload(filePath, file, {
        upsert: true,
      });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('couple-avatars').getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;
      if (role === 'boy') {
        setProfile({ ...profile, boy_avatar: avatarUrl });
      } else {
        setProfile({ ...profile, girl_avatar: avatarUrl });
      }
    } finally {
      if (role === 'boy') setUploadingBoyAvatar(false);
      if (role === 'girl') setUploadingGirlAvatar(false);
    }
  };

  return (
    <Box
      className="admin-page-root"
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(255, 142, 158, 0.12) 0%, transparent 38%), radial-gradient(circle at bottom right, rgba(142, 202, 255, 0.12) 0%, transparent 40%), #faf9f5',
      }}
    >
      <AdminSidebar />

      <Box ml={ADMIN_SIDEBAR_WIDTH} style={{ paddingTop: 92, paddingLeft: 28, paddingRight: 28, paddingBottom: 40 }}>
        <Box
          style={{
            position: 'fixed',
            left: ADMIN_SIDEBAR_WIDTH,
            right: 0,
            top: 0,
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            borderBottom: '1px solid rgba(218,192,194,0.2)',
            backdropFilter: 'blur(12px)',
            background: 'rgba(250, 249, 245, 0.82)',
            zIndex: 40,
          }}
        >
          <Title order={4} style={{ color: '#9c4050', fontStyle: 'italic', fontWeight: 600 }}>
            Memorial Management
          </Title>
          <Group gap="xs">
            <Button variant="subtle" color="gray" radius="xl" size="xs">通知</Button>
            <Button variant="subtle" color="gray" radius="xl" size="xs">设置</Button>
          </Group>
        </Box>

        <Box maw={1180} mx="auto">
          <Stack gap="xl">
            <Box>
              <Text
                size="xs"
                fw={700}
                style={{ letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9c4050' }}
              >
                Settings &amp; Identity
              </Text>
              <Title order={1} mt={6} style={{ fontSize: 42, fontWeight: 500 }}>
                Couple Information
              </Title>
              <Text c="#6d5c5e" mt="sm" maw={780}>
                Update the core details of the memorial profile. This information forms the emotional foundation of the digital archive.
              </Text>
            </Box>

            {!profile ? (
              <Card
                radius="lg"
                p="xl"
                withBorder
                style={{ minHeight: 360, borderColor: 'rgba(218,192,194,0.25)', background: '#ffffff' }}
              >
                <Stack align="center" justify="center" gap="md" mih={320}>
                  <Loader size="md" color="pink" />
                  <Text size="sm" c="dimmed">
                    正在加载情侣资料…
                  </Text>
                </Stack>
              </Card>
            ) : (
            <form onSubmit={onSave}>
              <SimpleGrid cols={{ base: 1, lg: 12 }} spacing="lg">
                <Box style={{ gridColumn: 'span 8' }}>
                  <CoupleProfilesCard
                    profile={profile}
                    uploadingBoyAvatar={uploadingBoyAvatar}
                    uploadingGirlAvatar={uploadingGirlAvatar}
                    onProfileChange={setProfile}
                    onUploadAvatar={uploadAvatar}
                  />
                </Box>
                <Box style={{ gridColumn: 'span 4' }}>
                  <Card
                    radius="lg"
                    p="xl"
                    withBorder
                    style={{ background: '#f4f4f0', borderColor: 'rgba(218,192,194,0.2)', minHeight: '100%' }}
                  >
                    <Stack align="center" justify="center" h="100%" gap="md">
                      <Text size="xl" c="#9c4050">📅</Text>
                      <Title order={3} style={{ fontStyle: 'italic', fontWeight: 500 }}>
                        Anniversary Date
                      </Title>
                      <Card radius="md" p="md" w="100%" style={{ background: '#ffffff' }}>
                        <DatePickerInput
                          label="纪念日"
                          value={anniversaryDate}
                          onChange={setAnniversaryDate}
                          valueFormat="YYYY-MM-DD"
                          placeholder="选择纪念日"
                          clearable
                          styles={{
                            label: { textAlign: 'center', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7d7071' },
                            input: { textAlign: 'center', border: 'none', backgroundColor: 'transparent', fontWeight: 600 },
                          }}
                        />
                      </Card>
                      <Text size="xs" c="#6d5c5e" fs="italic">
                        "The date that started it all."
                      </Text>
                    </Stack>
                  </Card>
                </Box>

                <Box style={{ gridColumn: 'span 12' }}>
                  <Card
                    radius="lg"
                    p="xl"
                    withBorder
                    style={{
                      background: '#ffffff',
                      borderColor: 'rgba(218,192,194,0.22)',
                      boxShadow: '0 12px 40px rgba(156,64,80,0.02)',
                    }}
                  >
                    <Group justify="space-between" mb="md">
                      <Group gap={8}>
                        <Text c="#9c4050">📖</Text>
                        <Title order={3} style={{ fontStyle: 'italic', fontWeight: 500 }}>
                          About Us
                        </Title>
                      </Group>
                    </Group>
                    <Stack gap="md">
                      <Textarea
                        label="About Us"
                        placeholder="Tell their story here..."
                        value={profile.about_text ?? ''}
                        onChange={(e) => setProfile({ ...profile, about_text: e.currentTarget.value })}
                        autosize
                        minRows={8}
                        styles={{
                          label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7d7071' },
                          input: { backgroundColor: '#f4f4f0', border: 'none', lineHeight: 1.75 },
                        }}
                      />
                      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                        <Textarea
                          label="男生想对女生说的话"
                          value={profile.boy_message_for_girl ?? ''}
                          onChange={(e) => setProfile({ ...profile, boy_message_for_girl: e.currentTarget.value })}
                          autosize
                          minRows={3}
                          styles={{ input: { backgroundColor: 'rgba(142,202,255,0.12)', border: 'none' } }}
                        />
                        <Textarea
                          label="女生想对男生说的话"
                          value={profile.girl_message_for_boy ?? ''}
                          onChange={(e) => setProfile({ ...profile, girl_message_for_boy: e.currentTarget.value })}
                          autosize
                          minRows={3}
                          styles={{ input: { backgroundColor: 'rgba(255,142,158,0.12)', border: 'none' } }}
                        />
                      </SimpleGrid>
                    </Stack>
                  </Card>
                </Box>

                <Box style={{ gridColumn: 'span 12' }}>
                  <Group justify="flex-end" gap="md">
                    <Button
                      variant="subtle"
                      color="gray"
                      onClick={() => void load()}
                      style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}
                    >
                      Discard Changes
                    </Button>
                    <Button
                      type="submit"
                      loading={saving}
                      radius="xl"
                      style={{
                        paddingLeft: 28,
                        paddingRight: 28,
                        height: 46,
                        background: 'linear-gradient(145deg, #9c4050, #ff8e9e)',
                        boxShadow: '0 12px 40px rgba(156,64,80,0.15)',
                      }}
                    >
                      Update Information
                    </Button>
                  </Group>
                </Box>
              </SimpleGrid>
            </form>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

