'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card, SimpleGrid, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { CoupleProfile } from '@/lib/types/mvp';

export default function AdminAboutPage() {
  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [saving, setSaving] = useState(false);

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
      return;
    }
    setProfile((data ?? null) as CoupleProfile | null);
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
      anniversary_date: profile.anniversary_date,
      about_text: profile.about_text,
      love_message: profile.love_message,
    }).eq('id', profile.id);
    setSaving(false);
  };

  if (!profile) {
    return <Text c="dimmed">正在加载情侣资料...</Text>;
  }

  return (
    <Card>
      <Title order={3}>情侣信息 / 关于我们设置</Title>
      <Text size="sm" c="dimmed" mt={4}>保存后前台“关于我们”页会立即更新。</Text>
      <form onSubmit={onSave}>
        <Stack gap="sm" mt="md">
          <SimpleGrid cols={{ base: 1, md: 2 }}>
              <TextInput label="男生名字" value={profile.boy_name ?? ''} onChange={(e) => setProfile({ ...profile, boy_name: e.currentTarget.value })} />
            <div>
              <TextInput label="女生名字" value={profile.girl_name ?? ''} onChange={(e) => setProfile({ ...profile, girl_name: e.currentTarget.value })} />
            </div>
          </SimpleGrid>
          <TextInput label="男生头像URL" value={profile.boy_avatar ?? ''} onChange={(e) => setProfile({ ...profile, boy_avatar: e.currentTarget.value })} />
          <TextInput label="女生头像URL" value={profile.girl_avatar ?? ''} onChange={(e) => setProfile({ ...profile, girl_avatar: e.currentTarget.value })} />
          <TextInput
            label="恋爱纪念日"
            type="date"
            value={profile.anniversary_date ?? ''}
            onChange={(e) => setProfile({ ...profile, anniversary_date: e.currentTarget.value })}
          />
          <Textarea label="介绍文字" value={profile.about_text ?? ''} onChange={(e) => setProfile({ ...profile, about_text: e.currentTarget.value })} autosize minRows={3} />
          <Textarea label="一句想说的话" value={profile.love_message ?? ''} onChange={(e) => setProfile({ ...profile, love_message: e.currentTarget.value })} autosize minRows={2} />
          <Button type="submit" loading={saving}>保存</Button>
        </Stack>
      </form>
    </Card>
  );
}

