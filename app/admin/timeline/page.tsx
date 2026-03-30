'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import 'dayjs/locale/zh-cn';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { TimelineEvent } from '@/lib/types/mvp';

type TimelineFormProps = {
  editingId: string | null;
  title: string;
  eventDate: string | null;
  boyMessage: string;
  girlMessage: string;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string | null) => void;
  onBoyMessageChange: (value: string) => void;
  onGirlMessageChange: (value: string) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
  onCancelEdit: () => void;
  currentUserLabel: string;
};

function TimelineFormCard({
  editingId,
  title,
  eventDate,
  boyMessage,
  girlMessage,
  onTitleChange,
  onDateChange,
  onBoyMessageChange,
  onGirlMessageChange,
  onSubmit,
  onCancelEdit,
  currentUserLabel,
}: TimelineFormProps) {
  return (
    <Paper
      p="xl"
      radius="lg"
      withBorder
      className="admin-timeline-form-sticky"
      style={{
        background: '#ffffff',
        borderColor: 'rgba(218,192,194,0.28)',
        boxShadow: '0 12px 40px rgba(156,64,80,0.04)',
      }}
    >
      <Group gap="sm" mb="lg">
        <ThemeIcon size={40} radius="xl" color="pink" variant="light">
          +
        </ThemeIcon>
        <Box>
          <Title order={3} style={{ fontStyle: 'italic', fontWeight: 600 }}>
            {editingId ? '编辑时间节点' : '新增时间节点'}
          </Title>
          <Text size="xs" c="#8f7f80" mt={2}>
            当前登录用户：{currentUserLabel}
          </Text>
        </Box>
      </Group>

      <form onSubmit={(e) => { void onSubmit(e); }}>
        <Stack gap="md">
          <TextInput
            label="事件标题"
            placeholder="例如：第一次见面"
            value={title}
            onChange={(e) => onTitleChange(e.currentTarget.value)}
            required
            styles={{
              label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7d7071' },
              input: { backgroundColor: '#f4f4f0', border: 'none' },
            }}
          />
          <DatePickerInput
            label="事件日期"
            value={eventDate}
            onChange={onDateChange}
            valueFormat="YYYY-MM-DD"
            placeholder="选择事件日期"
            clearable
            required
            styles={{
              label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7d7071' },
              input: { backgroundColor: '#f4f4f0', border: 'none' },
            }}
          />
          <Textarea
            label="男生留言（蓝色便签）"
            placeholder="左侧展示内容（可选）"
            value={boyMessage}
            onChange={(e) => onBoyMessageChange(e.currentTarget.value)}
            autosize
            minRows={3}
            styles={{
              label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1c6392' },
              input: { backgroundColor: 'rgba(142,202,255,0.12)', border: 'none', fontStyle: 'italic' },
            }}
          />
          <Textarea
            label="女生留言（粉色便签）"
            placeholder="右侧展示内容（可选）"
            value={girlMessage}
            onChange={(e) => onGirlMessageChange(e.currentTarget.value)}
            autosize
            minRows={3}
            styles={{
              label: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9c4050' },
              input: { backgroundColor: 'rgba(255,142,158,0.12)', border: 'none', fontStyle: 'italic' },
            }}
          />
          <Button type="submit" radius="xl" style={{ background: '#9c4050' }}>
            {editingId ? '保存修改' : '归档事件'}
          </Button>
          {editingId && (
            <Button variant="light" color="gray" radius="xl" onClick={onCancelEdit}>
              取消编辑
            </Button>
          )}
        </Stack>
      </form>
    </Paper>
  );
}

type TimelineListProps = {
  items: TimelineEvent[];
  onEdit: (item: TimelineEvent) => void;
  onDelete: (id: string) => Promise<void>;
  formatCreatedBy: (createdBy: string | null) => string;
};

function TimelineList({ items, onEdit, onDelete, formatCreatedBy }: TimelineListProps) {
  return (
    <Box style={{ position: 'relative' }}>
      <Box
        style={{
          position: 'absolute',
          left: 15,
          top: 4,
          bottom: 4,
          width: 1,
          background: 'linear-gradient(180deg, rgba(156,64,80,0.24), rgba(156,64,80,0.05))',
        }}
      />
      <Stack gap="lg">
        {items.map((item, index) => (
          <Box key={item.id} style={{ position: 'relative', paddingLeft: 44 }}>
            <Box
              style={{
                position: 'absolute',
                left: 8,
                top: 26,
                width: 14,
                height: 14,
                borderRadius: 999,
                background: index % 2 === 0 ? '#9c4050' : '#1c6392',
                border: '3px solid #faf9f5',
                zIndex: 2,
              }}
            />
            <Card
              radius="lg"
              withBorder
              p="xl"
              style={{
                background: '#ffffff',
                borderColor: 'rgba(218,192,194,0.28)',
                boxShadow: '0 10px 28px rgba(0,0,0,0.03)',
              }}
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Box>
                  <Text size="xs" fw={700} c="#1c6392" style={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    {item.event_date}
                  </Text>
                  <Title order={4} mt={6} style={{ fontStyle: 'italic', fontWeight: 600 }}>
                    {item.title}
                  </Title>
                </Box>
                <Group gap={6}>
                  <ActionIcon variant="light" color="gray" radius="xl" onClick={() => onEdit(item)}>
                    编辑
                  </ActionIcon>
                  <ActionIcon color="red" variant="light" radius="xl" onClick={() => { void onDelete(item.id); }}>
                    删
                  </ActionIcon>
                </Group>
              </Group>

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <Box
                  style={{
                    borderLeft: '4px solid rgba(142,202,255,0.55)',
                    paddingLeft: 12,
                    minHeight: 70,
                  }}
                >
                  <Text size="sm" c="#5e5f65" style={{ fontStyle: 'italic', lineHeight: 1.7 }}>
                    {item.boy_message || '（暂无男生留言）'}
                  </Text>
                  <Text mt={8} size="xs" fw={700} c="#1c6392" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    男生视角
                  </Text>
                </Box>
                <Box
                  style={{
                    borderLeft: '4px solid rgba(255,142,158,0.55)',
                    paddingLeft: 12,
                    minHeight: 70,
                  }}
                >
                  <Text size="sm" c="#5e5f65" style={{ fontStyle: 'italic', lineHeight: 1.7 }}>
                    {item.girl_message || '（暂无女生留言）'}
                  </Text>
                  <Text mt={8} size="xs" fw={700} c="#9c4050" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    女生视角
                  </Text>
                </Box>
              </SimpleGrid>

              <Divider my="md" color="rgba(218,192,194,0.5)" />
              <Text size="xs" c="dimmed">
                created_by: {formatCreatedBy(item.created_by)}
              </Text>
            </Card>
          </Box>
        ))}

        {items.length === 0 && (
          <Paper
            radius="lg"
            p="lg"
            withBorder
            style={{ background: 'rgba(255,255,255,0.78)', borderStyle: 'dashed', borderColor: 'rgba(218,192,194,0.6)' }}
          >
            <Text size="sm" c="dimmed">
              还没有任何时间节点，先在左边写下第一条吧。
            </Text>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

export default function AdminTimelinePage() {
  const [items, setItems] = useState<TimelineEvent[]>([]);
  const [title, setTitle] = useState('');
  const [boyMessage, setBoyMessage] = useState('');
  const [girlMessage, setGirlMessage] = useState('');
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserLabel, setCurrentUserLabel] = useState<string>('未获取到（请重新登录）');

  const load = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    setCurrentUserId(user?.id ?? null);
    setCurrentUserLabel(
      ((user?.user_metadata?.display_name as string | undefined)?.trim())
      || user?.email
      || '未获取到（请重新登录）',
    );
    const { data } = await supabase.from('timeline_events').select('*').order('event_date', { ascending: true });
    setItems((data ?? []) as TimelineEvent[]);
  };

  useEffect(() => { void load(); }, []);

  const formatCreatedBy = (createdBy: string | null) => {
    if (!createdBy) return 'null';
    if (currentUserId && createdBy === currentUserId) {
      return currentUserLabel;
    }
    return createdBy;
  };

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventDate) return;
    const supabase = getSupabaseBrowserClient();
    const payload = {
      title,
      boy_message: boyMessage || null,
      girl_message: girlMessage || null,
      event_date: eventDate,
      created_by: currentUserId,
    };
    if (editingId) {
      await supabase.from('timeline_events').update({
        title: payload.title,
        boy_message: payload.boy_message,
        girl_message: payload.girl_message,
        event_date: payload.event_date,
      }).eq('id', editingId);
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
    setEventDate(item.event_date ?? null);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setBoyMessage('');
    setGirlMessage('');
    setEventDate(null);
  };

  return (
    <Box className="admin-page-main-subheader">
        <Box className="admin-inner-topbar">
          <Title order={4} style={{ color: '#9c4050', fontStyle: 'italic', fontWeight: 600 }} lineClamp={1}>
            Memorial Management
          </Title>
          <Group gap="xs" visibleFrom="sm">
            <Button variant="subtle" color="gray" radius="xl" size="xs">通知</Button>
            <Button variant="subtle" color="gray" radius="xl" size="xs">设置</Button>
          </Group>
        </Box>

        <Container fluid maw={1320} px={0}>
          <Stack gap="xl">
            <Box>
              <Text
                size="xs"
                fw={700}
                style={{ color: '#9c4050', letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                Chronology
              </Text>
              <Title order={1} mt={4} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.625rem)', fontStyle: 'italic', fontWeight: 500 }}>
                Timeline Management
              </Title>
              <Text c="#6d5c5e" mt={8} maw={760}>
                Curate the beautiful journey of life and love. Add milestones, shared memories, and personal reflections to the eternal archive.
              </Text>
            </Box>

            <Grid gutter="xl" align="start">
              <Grid.Col span={{ base: 12, lg: 5 }}>
                <TimelineFormCard
                  editingId={editingId}
                  title={title}
                  eventDate={eventDate}
                  boyMessage={boyMessage}
                  girlMessage={girlMessage}
                  onTitleChange={setTitle}
                  onDateChange={setEventDate}
                  onBoyMessageChange={setBoyMessage}
                  onGirlMessageChange={setGirlMessage}
                  onSubmit={onCreate}
                  onCancelEdit={resetForm}
                  currentUserLabel={currentUserLabel}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 7 }}>
                <TimelineList
                  items={items}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  formatCreatedBy={formatCreatedBy}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
    </Box>
  );
}
