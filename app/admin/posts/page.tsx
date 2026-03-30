'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Post } from '@/lib/types/mvp';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const load = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from('posts')
      .select('*, post_images(*)')
      .order('created_at', { ascending: false });
    setPosts((data ?? []) as Post[]);
  };

  useEffect(() => { void load(); }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('posts')
      .insert({ title, content, happened_on: date || null })
      .select('*')
      .single();
    if (error || !data) return;

    if (imageUrl.trim()) {
      await supabase.from('post_images').insert({ post_id: data.id, image_url: imageUrl.trim(), sort_order: 0 });
    }

    setTitle('');
    setContent('');
    setDate('');
    setImageUrl('');
    await load();
  };

  const onDelete = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from('posts').delete().eq('id', id);
    await load();
  };

  return (
    <section className="grid">
      <article className="card">
        <h1 className="title">�����¼����</h1>
        <form className="form-grid" onSubmit={onCreate}>
          <input className="input" placeholder="����" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <textarea className="textarea" placeholder="����" value={content} onChange={(e) => setContent(e.target.value)} required />
          <input className="input" placeholder="����ͼ���ӣ���ѡ��" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button className="btn" type="submit">������¼</button>
        </form>
      </article>
      <article className="card">
        {posts.map((post) => (
          <div key={post.id} style={{ marginBottom: 14 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>{post.title}</strong>
              <button className="btn btn-danger" onClick={() => onDelete(post.id)}>ɾ��</button>
            </div>
            <p>{post.content}</p>
          </div>
        ))}
      </article>
    </section>
  );
}
