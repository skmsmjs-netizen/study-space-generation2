-- Existing project, private immutable originals; no public URLs or new paid service.
insert into storage.buckets (id, name, public, file_size_limit)
values ('study-material-originals', 'study-material-originals', false, 52428800)
on conflict (id) do nothing;

create or replace function public.study_material_original_access(p_name text, p_insert boolean default false)
returns boolean language plpgsql security definer
set search_path = pg_catalog, public, auth, storage
as $$
declare v_user uuid := auth.uid(); v_session text := auth.jwt()->>'session_id';
begin
  if v_user is null or p_name !~ ('^' || v_user::text || '/(personal|test)/(audio|document)/[a-f0-9]{64}$') then return false; end if;
  if not exists (select 1 from public.study_account_permissions where user_id=v_user and status='approved') then return false; end if;
  if v_session is null or not exists (select 1 from auth.sessions where id::text=v_session and user_id=v_user) then return false; end if;
  if p_insert then
    -- Bound this new bucket's use without buying additional storage.
    perform pg_advisory_xact_lock(hashtext('study-material-originals'));
    if (select coalesce(sum(coalesce((metadata->>'size')::bigint,52428800)),0) from storage.objects where bucket_id='study-material-originals') > 471859200 then return false; end if;
  end if;
  return true;
end $$;
revoke all on function public.study_material_original_access(text, boolean) from public, anon;
grant execute on function public.study_material_original_access(text, boolean) to authenticated;

create policy study_material_original_read on storage.objects for select to authenticated
using (bucket_id='study-material-originals' and public.study_material_original_access(name, false));
create policy study_material_original_insert on storage.objects for insert to authenticated
with check (bucket_id='study-material-originals' and public.study_material_original_access(name, true));
-- Documents are immutable. Audio cleanup is explicit and separately authorized in the UI.
create policy study_material_audio_delete on storage.objects for delete to authenticated
using (bucket_id='study-material-originals' and name ~ '/audio/[a-f0-9]{64}$' and public.study_material_original_access(name, false));
-- No update policy: retry cannot overwrite an original.
