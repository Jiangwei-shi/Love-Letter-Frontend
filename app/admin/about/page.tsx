'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Avatar, Button, Card, FileButton, Group, SimpleGrid, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { CoupleProfile } from '@/lib/types/mvp';

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

  if (!profile) {
    return <Text c="dimmed">正在加载情侣资料...</Text>;
  }

  return (
    <Card>
      <Title order={3}>关于我们设置</Title>
      <Text size="sm" c="dimmed" mt={4}>保存后前台“关于我们”页会立即更新。</Text>
      <form onSubmit={onSave}>
        <Stack gap="sm" mt="md">
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <TextInput label="男生名字" value={profile.boy_name ?? ''} onChange={(e) => setProfile({ ...profile, boy_name: e.currentTarget.value })} />
            <TextInput label="女生名字" value={profile.girl_name ?? ''} onChange={(e) => setProfile({ ...profile, girl_name: e.currentTarget.value })} />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Card withBorder radius="md" p="sm">
              <Stack align="center" gap="xs">
                <Text fw={500}>男生头像（点击上传）</Text>
                <FileButton onChange={(file) => file && void uploadAvatar(file, 'boy')} accept="image/png,image/jpeg,image/webp">
                  {(props) => (
                    <Avatar
                      {...props}
                      src={profile.boy_avatar}
                      size={96}
                      radius="xl"
                      style={{ cursor: 'pointer' }}
                    >
                      男
                    </Avatar>
                  )}
                </FileButton>
                <Button
                  size="xs"
                  variant="light"
                  loading={uploadingBoyAvatar}
                  onClick={() => setProfile({ ...profile, boy_avatar: null })}
                >
                  清除头像
                </Button>
              </Stack>
            </Card>
            <Card withBorder radius="md" p="sm">
              <Stack align="center" gap="xs">
                <Text fw={500}>女生头像（点击上传）</Text>
                <FileButton onChange={(file) => file && void uploadAvatar(file, 'girl')} accept="image/png,image/jpeg,image/webp">
                  {(props) => (
                    <Avatar
                      {...props}
                      src={profile.girl_avatar}
                      size={96}
                      radius="xl"
                      style={{ cursor: 'pointer' }}
                    >
                      女
                    </Avatar>
                  )}
                </FileButton>
                <Button
                  size="xs"
                  variant="light"
                  loading={uploadingGirlAvatar}
                  onClick={() => setProfile({ ...profile, girl_avatar: null })}
                >
                  清除头像
                </Button>
              </Stack>
            </Card>
          </SimpleGrid>

          <DatePickerInput
            label="恋爱纪念日"
            value={anniversaryDate}
            onChange={setAnniversaryDate}
            valueFormat="YYYY-MM-DD"
            placeholder="选择纪念日"
            clearable
          />
          <Textarea label="介绍文字" value={profile.about_text ?? ''} onChange={(e) => setProfile({ ...profile, about_text: e.currentTarget.value })} autosize minRows={3} />
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Textarea
              label="男生想对女生说的话"
              value={profile.boy_message_for_girl ?? ''}
              onChange={(e) => setProfile({ ...profile, boy_message_for_girl: e.currentTarget.value })}
              autosize
              minRows={2}
            />
            <Textarea
              label="女生想对男生说的话"
              value={profile.girl_message_for_boy ?? ''}
              onChange={(e) => setProfile({ ...profile, girl_message_for_boy: e.currentTarget.value })}
              autosize
              minRows={2}
            />
          </SimpleGrid>
          <Group>
            <Button type="submit" loading={saving}>保存</Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}

