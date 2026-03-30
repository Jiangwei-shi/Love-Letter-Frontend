'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
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
      <article className="card">
        <h1 className="title">时间线管理</h1>
        <form className="form-grid" onSubmit={onCreate}>
          <input className="input" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <DateInput
            value={eventDate}
            onChange={setEventDate}
            valueFormat="YYYY-MM-DD"
            placeholder="选择事件日期"
            locale="zh-cn"
            clearable
            required
          />
          <textarea className="textarea" placeholder="描述" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn" type="submit">新增事件</button>
        </form>
      </article>
      <article className="card">
        {items.map((item) => (
          <div key={item.id} className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <strong>{item.event_date} - {item.title}</strong>
              <p>{item.description}</p>
            </div>
            <button className="btn btn-danger" onClick={() => onDelete(item.id)}>删除</button>
          </div>
        ))}
      </article>
    </section>
  );
}
