'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { TimelineEvent } from '@/lib/types/mvp';

export default function AdminTimelinePage() {
  const [items, setItems] = useState<TimelineEvent[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');

  const load = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.from('timeline_events').select('*').order('event_date', { ascending: true });
    setItems((data ?? []) as TimelineEvent[]);
  };

  useEffect(() => { void load(); }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    await supabase.from('timeline_events').insert({ title, description, event_date: eventDate });
    setTitle('');
    setDescription('');
    setEventDate('');
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
        <h1 className="title">ʱ���߹���</h1>
        <form className="form-grid" onSubmit={onCreate}>
          <input className="input" placeholder="����" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="input" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          <textarea className="textarea" placeholder="����" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn" type="submit">�����¼�</button>
        </form>
      </article>
      <article className="card">
        {items.map((item) => (
          <div key={item.id} className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <strong>{item.event_date} - {item.title}</strong>
              <p>{item.description}</p>
            </div>
            <button className="btn btn-danger" onClick={() => onDelete(item.id)}>ɾ��</button>
          </div>
        ))}
      </article>
    </section>
  );
}
