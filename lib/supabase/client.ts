import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | undefined;

/**
 * 浏览器端单例，供 Client Component 使用。
 * 需在 `.env.local` 中配置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY。
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!url || !anonKey) {
    throw new Error(
      '缺少 Supabase 环境变量：请在项目根目录创建 .env.local，并设置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY（或 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY）。',
    );
  }

  browserClient = createClient(url, anonKey);
  return browserClient;
}
