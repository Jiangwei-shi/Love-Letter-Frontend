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
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);

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
    await supabase
      .from('timeline_events')
      .insert({ title, description, event_date: dayjs(eventDate).format('YYYY-MM-DD') });
    setTitle('');
    setDescription('');
    setEventDate(null);
    await load();
  };

  const onDelete = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from('timeline_events').delete().eq('id', id);
    await load();
  };

  return (
    <section className="grid">
      <Card radius="lg" shadow="sm">
        <Text fw={600} fz="lg">时间线管理</Text>
        <Text size="sm" c="dimmed" mt={4}>
          为你们的重要节点写下一句简短的说明。
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
              label="描述"
              placeholder="可以简单写写当时的心情或发生了什么（可选）"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              autosize
              minRows={3}
            />
            <Button type="submit">
              新增事件
            </Button>
          </Stack>
        </form>
      </Card>
      <Card radius="lg" shadow="sm">
        <Stack gap="sm">
          {items.map((item) => (
            <Group key={item.id} justify="space-between" align="flex-start">
              <div>
                <Text fw={500}>{item.event_date} · {item.title}</Text>
                {item.description && (
                  <Text size="sm" c="dimmed">
                    {item.description}
                  </Text>
                )}
              </div>
              <Button color="red" variant="light" size="xs" onClick={() => onDelete(item.id)}>
                删除
              </Button>
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
