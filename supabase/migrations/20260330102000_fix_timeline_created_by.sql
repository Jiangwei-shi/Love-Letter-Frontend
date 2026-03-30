create or replace function public.timeline_events_fill_created_by()
returns trigger
language plpgsql
as $$
begin
  if new.created_by is null then
    new.created_by = auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_timeline_events_fill_created_by on public.timeline_events;
create trigger trg_timeline_events_fill_created_by
before insert on public.timeline_events
for each row execute function public.timeline_events_fill_created_by();

update public.timeline_events
set created_by = (
  select id
  from auth.users
  order by created_at asc
  limit 1
)
where created_by is null
  and exists (select 1 from auth.users);
