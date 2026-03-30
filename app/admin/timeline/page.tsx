'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Button, Card, Group, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { TimelineEvent } from '@/lib/types/mvp';

export default function AdminTimelinePage() {
  const [items, setItems] = useState<TimelineEvent[]>([]);
  const [title, setTitle] = useState('');
  const [boyMessage, setBoyMessage] = useState('');
  const [girlMessage, setGirlMessage] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.from('timeline_events').select('*').order('event_date', { ascending: true });
    setItems((data ?? []) as TimelineEvent[]);
  };

  useEffect(() => { void load(); }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventDate) return;
    const supabase = getSupabaseBrowserClient();
    const payload = {
      title,
      boy_message: boyMessage || null,
      girl_message: girlMessage || null,
      event_date: dayjs(eventDate).format('YYYY-MM-DD'),
    };
    if (editingId) {
      await supabase.from('timeline_events').update(payload).eq('id', editingId);
    } else {
      await supabase.from('timeline_events').insert(payload);
    }
    setTitle('');
    setBoyMessage('');
    setGirlMessage('');
    setEventDate(null);
    setEditingId(null);
    await load();
  };

  const onDelete = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from('timeline_events').delete().eq('id', id);
    await load();
  };

  const onEdit = (item: TimelineEvent) => {
    setEditingId(item.id);
    setTitle(item.title);
    setBoyMessage(item.boy_message ?? '');
    setGirlMessage(item.girl_message ?? '');
    setEventDate(item.event_date ? new Date(item.event_date) : null);
  };

  return (
    <section className="grid">
      <Card radius="lg" shadow="sm">
        <Text fw={600} fz="lg">时间线管理</Text>
        <Text size="sm" c="dimmed" mt={4}>
          新增、编辑、删除时间线，按日期从早到晚展示。
        </Text>
        <form onSubmit={onCreate}>
          <Stack gap="sm" mt="md">
            <TextInput
              label="标题"
              placeholder="例如：第一次见面"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />
            <DateInput
              label="日期"
              value={eventDate}
              onChange={setEventDate}
              valueFormat="YYYY-MM-DD"
              placeholder="选择事件日期"
              locale="zh-cn"
              clearable
              required
            />
            <Textarea
              label="男生留言"
              placeholder="左侧蓝色气泡内容（可选）"
              value={boyMessage}
              onChange={(e) => setBoyMessage(e.currentTarget.value)}
              autosize
              minRows={2}
            />
            <Textarea
              label="女生留言"
              placeholder="右侧红色气泡内容（可选）"
              value={girlMessage}
              onChange={(e) => setGirlMessage(e.currentTarget.value)}
              autosize
              minRows={2}
            />
            <Button type="submit">
              {editingId ? '保存修改' : '新增事件'}
            </Button>
            {editingId && (
              <Button variant="light" onClick={() => {
                setEditingId(null);
                setTitle('');
                setBoyMessage('');
                setGirlMessage('');
                setEventDate(null);
              }}
              >
                取消编辑
              </Button>
            )}
          </Stack>
        </form>
      </Card>
      <Card radius="lg" shadow="sm">
        <Stack gap="sm">
          {items.map((item) => (
            <Group key={item.id} justify="space-between" align="flex-start">
              <div>
                <Text fw={500}>{item.event_date} · {item.title}</Text>
                {item.boy_message && <Text size="sm" c="blue">{item.boy_message}</Text>}
                {item.girl_message && <Text size="sm" c="red">{item.girl_message}</Text>}
              </div>
              <Group gap={6}>
                <Button variant="light" size="xs" onClick={() => onEdit(item)}>编辑</Button>
                <Button color="red" variant="light" size="xs" onClick={() => onDelete(item.id)}>
                  删除
                </Button>
              </Group>
            </Group>
          ))}
          {items.length === 0 && (
            <Text size="sm" c="dimmed">
              还没有任何时间节点，先在左边写下第一条吧。
            </Text>
          )}
        </Stack>
      </Card>
    </section>
  );
}
