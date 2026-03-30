import { getTimelineEvents } from '@/lib/supabase/queries';
import TimelinePageView from '@/components/timeline/TimelinePageView';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  noStore();
  const events = await getTimelineEvents();
  const orderedEvents = [...events].sort((a, b) => {
    const at = new Date(a.event_date).getTime();
    const bt = new Date(b.event_date).getTime();
    return bt - at;
  });

  return <TimelinePageView events={orderedEvents} />;
}
