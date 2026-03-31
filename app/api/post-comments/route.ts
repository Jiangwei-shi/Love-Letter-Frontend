import { NextRequest, NextResponse } from 'next/server';
import { getSupabasePublicServerClient } from '@/lib/supabase/server';

type CreateCommentPayload = {
  post_id?: string;
  visitor_name?: string;
  message?: string;
  source?: string;
};

function normalizeText(value: unknown, maxLen: number) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function resolveClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateCommentPayload;
    const postId = normalizeText(body.post_id, 128);
    const visitorName = normalizeText(body.visitor_name, 64);
    const message = normalizeText(body.message, 1000);
    if (!postId || !visitorName || !message) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }

    const source = normalizeText(
      body.source || req.headers.get('origin') || req.headers.get('referer') || 'web:unknown',
      255,
    );
    const userAgent = normalizeText(req.headers.get('user-agent') || '', 500);
    const ipAddress = resolveClientIp(req);

    const supabase = getSupabasePublicServerClient();
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        visitor_name: visitorName,
        message,
        source,
        user_agent: userAgent || null,
        ip_address: ipAddress,
      })
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || '写入失败' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: '请求无效' }, { status: 400 });
  }
}
