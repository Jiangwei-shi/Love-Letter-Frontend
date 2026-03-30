'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? '');
    };
    void load();
  }, []);

  const onLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <section className="card">
      <h1 className="title">后台管理</h1>
      <p className="subtitle">你已登录：{email}</p>
      <p>从上面的导航进入时间线、生活记录、相册管理。</p>
      <button className="btn btn-danger" onClick={onLogout}>退出登录</button>
    </section>
  );
}
