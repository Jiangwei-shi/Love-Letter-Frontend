'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const check = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      setLoading(false);
    };

    void check();
  }, [pathname, router]);

  if (loading) {
    return <p className="empty">正在校验登录状态...</p>;
  }

  return (
    <div>
      <div className="admin-nav">
        <Link href="/admin" className="btn btn-soft">概览</Link>
        <Link href="/admin/timeline" className="btn btn-soft">时间线</Link>
        <Link href="/admin/posts" className="btn btn-soft">生活记录</Link>
        <Link href="/admin/albums" className="btn btn-soft">相册</Link>
      </div>
      {children}
    </div>
  );
}
