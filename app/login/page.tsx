'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get('next') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.replace(nextPath);
  };

  const onRegister = async () => {
    setLoading(true);
    setMessage('');
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('注册成功，请直接登录。');
  };

  return (
    <section className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 className="title">登录后台</h1>
      <p className="subtitle">用 Supabase Auth 管理你们的纪念内容。</p>
      <form className="form-grid" onSubmit={onLogin}>
        <input className="input" type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="row-wrap">
          <button className="btn" type="submit" disabled={loading}>登录</button>
          <button className="btn btn-soft" type="button" onClick={onRegister} disabled={loading}>注册</button>
        </div>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </section>
  );
}
