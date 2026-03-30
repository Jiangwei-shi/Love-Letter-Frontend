import { getTimelineEvents } from '@/lib/supabase/queries';

export default async function TimelinePage() {
  const events = await getTimelineEvents();

  return (
    <section>
      <h1 className="title">ʱ����</h1>
      <p className="subtitle">��ʱ��˳��ؿ����ǹ�ͬ�ļ��䡣</p>
      <div className="grid">
        {events.map((item) => (
          <article className="card" key={item.id}>
            <p className="badge">{item.event_date}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      {events.length === 0 && <p className="empty">����ʱ�������ݡ�</p>}
    </section>
  );
}
