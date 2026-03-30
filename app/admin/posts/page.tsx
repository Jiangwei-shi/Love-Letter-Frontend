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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from('posts')
      .select('*, post_images(*)')
      .order('created_at', { ascending: false });
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('posts')
      .insert({ title, content, happened_on: date || null })
      .select('*')
      .single();

    if (!error && data) {
      if (imageUrl.trim()) {
        await supabase
          .from('post_images')
          .insert({ post_id: data.id, image_url: imageUrl.trim(), sort_order: 0 });
      }
      setTitle('');
      setContent('');
      setDate('');
      setImageUrl('');
      await load();
    }
    setSaving(false);
  };

  const onDelete = async (id: string) => {
    const confirmDelete = window.confirm('确定要删除这条生活记录吗？删除后就只能靠记忆来回想啦。');
    if (!confirmDelete) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.from('posts').delete().eq('id', id);
    await load();
  };

  return (
    <section className="grid">
      <article className="card">
        <h1 className="title">生活记录管理</h1>
        <p className="subtitle">
          在这里写下一些给“以后再看的我们”的小片段。
        </p>
        <form className="form-grid" onSubmit={onCreate}>
          <input
            className="input"
            placeholder="标题（例如：第一次一起做饭）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <textarea
            className="textarea"
            placeholder="正文内容，可以写写当时的心情、对话、想对对方说的话..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="配图地址（可选，如果已经上传到图床或 Supabase Storage）"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          {imageUrl.trim() && (
            <div className="row">
              <img
                src={imageUrl}
                alt="预览"
                className="cover"
                style={{ maxWidth: 200, height: 120, objectFit: 'cover' }}
              />
            </div>
          )}

          <button className="btn" type="submit" disabled={saving}>
            {saving ? '保存中...' : '写下一条生活记录'}
          </button>
        </form>
      </article>

      <article className="card">
        <h2 className="card-title">已写下的记录</h2>
        {loading && <p className="empty">正在加载生活记录...</p>}
        {!loading && posts.length === 0 && (
          <p className="empty">还没有任何记录，从左边的表单开始写下第一条吧。</p>
        )}
        {!loading &&
          posts.map((post) => (
            <div key={post.id} style={{ marginBottom: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{post.title}</strong>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => onDelete(post.id)}
                >
                  删除
                </button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '2px 0 4px' }}>
                {post.happened_on ?? post.created_at.slice(0, 10)}
              </p>
              <p style={{ margin: 0, fontSize: 14 }}>
                {post.content.length > 60
                  ? `${post.content.slice(0, 60)}...`
                  : post.content}
              </p>
            </div>
          ))}
      </article>
    </section>
  );
}
