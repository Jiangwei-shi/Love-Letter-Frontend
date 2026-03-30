import { getTimelineEvents } from '@/lib/supabase/queries';

export default async function TimelinePage() {
  const events = await getTimelineEvents();

  return (
    <section>
      <h1 className="title">我们的时间线</h1>
      <p className="subtitle">
        从怦然心动的那一刻开始，把重要的节点认真地放在这里。
      </p>

      {events.length === 0 ? (
        <p className="empty">
          时间线上还空着，等第一段故事落笔，这里就会慢慢被填满。
        </p>
      ) : (
        <div className="timeline">
          {events.map((item, index) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-line" />
              <div className="timeline-dot" />
              <div className="timeline-content card">
                <p className="badge">
                  {item.event_date}
                  {index === 0 && ' · 起点'}
                </p>
                <h3 className="timeline-title">{item.title}</h3>
                {item.description && (
                  <p className="timeline-text">{item.description}</p>
                )}
                <p className="timeline-meta">记录于时间线</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
