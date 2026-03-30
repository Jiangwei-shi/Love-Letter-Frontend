'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return <span className="btn btn-soft" style={{ opacity: 0.6 }}>...</span>;
  }

  if (!email) {
    return (
      <Link href="/login" className="btn btn-soft">
        登录
      </Link>
    );
  }

  return (
    <Link href="/admin" className="btn btn-soft">
      {email}
    </Link>
  );
}

