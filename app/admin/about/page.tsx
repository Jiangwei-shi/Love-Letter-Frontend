'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, FileButton, Group, Loader, SimpleGrid, Stack, Text, TextInput, Textarea, Title, useMantineTheme } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
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
  const theme = useMantineTheme();
  const isComfortable = useMediaQuery(`(min-width: ${theme.breakpoints.md})`, false, { getInitialValueInEffect: true });
  const avatarSize = isComfortable ? 126 : 112;

  return (
    <Card
      radius="lg"
      w="100%"
      p={{ base: 'md', sm: 'lg', md: 'xl' }}
      withBorder
      style={{
        background: '#ffffff',
        borderColor: 'rgba(218,192,194,0.22)',
        boxShadow: '0 12px 40px rgba(156,64,80,0.02)',
      }}
    >
      <Group gap={8} mb={{ base: 'md', md: 'lg' }}>
        <Text c="#9c4050">❤</Text>
        <Title order={3} style={{ fontStyle: 'italic', fontWeight: 500 }} lineClamp={1}>
          情侣信息
        </Title>
      </Group>

      <SimpleGrid cols={2} spacing={{ base: 'md', sm: 'xl', md: 48 }}>
        <Stack gap="sm" align="center" miw={0}>
          <FileButton onChange={(file) => file && void onUploadAvatar(file, 'boy')} accept="image/*">
            {(props) => (
              <Avatar
                {...props}
                src={profile.boy_avatar}
                size={avatarSize}
                radius={999}
                style={{ cursor: 'pointer', border: '3px solid #e9e8e4', flexShrink: 0 }}
              >
                男
              </Avatar>
            )}
          </FileButton>
          <Button
            size="xs"
            variant="default"
            className="home-float-btn admin-btn admin-btn-muted"
            radius="xl"
            loading={uploadingBoyAvatar}
            onClick={() => onProfileChange({ ...profile, boy_avatar: null })}
            px={8}
            styles={{ root: { maxWidth: '100%' } }}
          >
            清除头像
          </Button>
          <TextInput
            w="100%"
            label="男生昵称"
            value={profile.boy_name ?? ''}
            onChange={(e) => onProfileChange({ ...profile, boy_name: e.currentTarget.value })}
            styles={{
              label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7d7071' },
              input: { backgroundColor: '#f4f4f0', border: 'none' },
            }}
          />
        </Stack>

        <Stack gap="sm" align="center" miw={0}>
          <FileButton onChange={(file) => file && void onUploadAvatar(file, 'girl')} accept="image/*">
            {(props) => (
              <Avatar
                {...props}
                src={profile.girl_avatar}
                size={avatarSize}
                radius={999}
                style={{ cursor: 'pointer', border: '3px solid #e9e8e4', flexShrink: 0 }}
              >
                女
              </Avatar>
            )}
          </FileButton>
          <Button
            size="xs"
            variant="default"
            className="home-float-btn admin-btn admin-btn-muted"
            radius="xl"
            loading={uploadingGirlAvatar}
            onClick={() => onProfileChange({ ...profile, girl_avatar: null })}
            px={8}
            styles={{ root: { maxWidth: '100%' } }}
          >
            清除头像
          </Button>
          <TextInput
            w="100%"
            label="女生昵称"
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
  const theme = useMantineTheme();
  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [anniversaryDate, setAnniversaryDate] = useState<string | null>(null);
  const [uploadingBoyAvatar, setUploadingBoyAvatar] = useState(false);
  const [uploadingGirlAvatar, setUploadingGirlAvatar] = useState(false);
  const useModalDatePicker = useMediaQuery(`(max-width: ${theme.breakpoints.md})`, false, { getInitialValueInEffect: true });
  const isAboutLgGrid = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`, false, { getInitialValueInEffect: true });

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
    <Box className="admin-page-main-subheader">
        <Box className="admin-inner-topbar">
          <Title order={4} style={{ color: '#9c4050', fontWeight: 600 }}>
            情侣信息
          </Title>
        </Box>

        <Box maw={1180} mx="auto" w="100%">
          <Stack gap="xl">
            <Box>
              <Text
                size="xs"
                fw={700}
                style={{ letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9c4050' }}
              >
                资料与身份
              </Text>
              <Title order={1} mt={6} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.625rem)', fontWeight: 500 }}>
                情侣信息
              </Title>
              <Text c="#6d5c5e" mt="sm" maw={780}>
                在这里更新你们的核心资料。这些信息将构成整个纪念空间的情感底色与记忆基石。
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
            <form onSubmit={onSave} style={{ width: '100%' }}>
              <SimpleGrid cols={isAboutLgGrid ? 12 : 1} spacing="lg" className="admin-about-grid" w="100%">
                <Box className="admin-about-main" style={isAboutLgGrid ? { gridColumn: 'span 8' } : undefined}>
                  <CoupleProfilesCard
                    profile={profile}
                    uploadingBoyAvatar={uploadingBoyAvatar}
                    uploadingGirlAvatar={uploadingGirlAvatar}
                    onProfileChange={setProfile}
                    onUploadAvatar={uploadAvatar}
                  />
                </Box>
                <Box className="admin-about-side" style={isAboutLgGrid ? { gridColumn: 'span 4' } : undefined}>
                  <Card
                    radius="lg"
                    w="100%"
                    p={{ base: 'md', md: 'xl' }}
                    withBorder
                    className="admin-about-side-card"
                    style={{ background: '#f4f4f0', borderColor: 'rgba(218,192,194,0.2)' }}
                  >
                    <Stack align="center" justify="center" gap="md" className="admin-about-anniversary-stack">
                      <Text size="xl" c="#9c4050">📅</Text>
                      <Title order={3} ta="center" style={{ fontStyle: 'italic', fontWeight: 500 }} lineClamp={2}>
                        我们在一起的时间
                      </Title>
                      <Card radius="md" p={{ base: 'sm', sm: 'md' }} w="100%" maw={{ base: '100%', lg: 400 }} mx="auto" style={{ background: '#ffffff' }}>
                        <DatePickerInput
                          label="纪念日"
                          value={anniversaryDate}
                          onChange={setAnniversaryDate}
                          valueFormat="YYYY-MM-DD"
                          placeholder="选择我们在一起的时间"
                          clearable
                          dropdownType={useModalDatePicker ? 'modal' : 'popover'}
                          modalProps={{ title: '选择我们在一起的时间', size: 'sm' }}
                          styles={{
                            label: { textAlign: 'center', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7d7071' },
                            input: { textAlign: 'center', border: 'none', backgroundColor: 'transparent', fontWeight: 600 },
                          }}
                        />
                      </Card>
                      <Text size="xs" c="#6d5c5e" fs="italic">
                        "一切开始的那一天。"
                      </Text>
                    </Stack>
                  </Card>
                </Box>

                <Box style={isAboutLgGrid ? { gridColumn: 'span 12' } : undefined} w="100%">
                  <Card
                    radius="lg"
                    w="100%"
                    p={{ base: 'md', md: 'xl' }}
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
                          关于我们
                        </Title>
                      </Group>
                    </Group>
                    <Stack gap="md">
                      <Textarea
                        label="关于我们"
                        placeholder="在这里写下属于你们的故事..."
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

                <Box style={isAboutLgGrid ? { gridColumn: 'span 12' } : undefined} w="100%">
                  <Group justify="flex-end" gap="md" wrap="wrap">
                    <Button
                      variant="default"
                      className="home-float-btn admin-btn admin-btn-muted"
                      radius="xl"
                      onClick={() => void load()}
                      style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}
                    >
                      放弃更改
                    </Button>
                    <Button
                      type="submit"
                      loading={saving}
                      className="home-float-btn admin-btn admin-btn-primary"
                      radius="xl"
                      style={{
                        paddingLeft: 28,
                        paddingRight: 28,
                        height: 46,
                      }}
                    >
                      更新资料
                    </Button>
                  </Group>
                </Box>
              </SimpleGrid>
            </form>
            )}
          </Stack>
        </Box>
    </Box>
  );
}

