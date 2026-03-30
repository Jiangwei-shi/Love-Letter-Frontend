import { getSupabasePublicServerClient } from '@/lib/supabase/server';
import { getTimelineEvents } from '@/lib/supabase/queries';

export default async function HomePage() {
  const events = await getTimelineEvents();
  const supabase = getSupabasePublicServerClient();
  const { data: profile } = await supabase.from('profiles').select('*').limit(1).maybeSingle();

  return (
    <section className="grid">
      <article className="card">
        <p className="badge">情侣纪念网站</p>
        <h1 className="title">{profile?.nickname ?? '我们'} 与 {profile?.partner_nickname ?? 'TA'} 的故事</h1>
        <p className="subtitle">从相遇到现在，每一天都值得被温柔地记录。</p>
        {profile?.anniversary_date && <p>纪念日：{profile.anniversary_date}</p>}
      </article>

      <article className="card">
        <h2>最近时间线</h2>
        {events.slice(0, 3).map((item) => (
          <div key={item.id} style={{ marginBottom: 10 }}>
            <strong>{item.event_date} - {item.title}</strong>
            <p>{item.description}</p>
          </div>
        ))}
        {events.length === 0 && <p className="empty">还没有记录，先去后台新增第一条吧。</p>}
      </article>
    </section>
  );
}
