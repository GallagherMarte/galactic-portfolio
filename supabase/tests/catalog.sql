begin;

-- Fixtures for a fresh local/test database with seed.sql applied.
insert into public.project_images (project_id, storage_path, alt_text) values
  ('00000000-0000-4000-8000-000000000201', 'visible.webp', 'Imagen pública de prueba'),
  ('00000000-0000-4000-8000-000000000202', 'hidden.webp', 'Imagen privada de prueba');
insert into storage.objects (bucket_id, name) values
  ('project-images', 'visible.webp'), ('project-images', 'hidden.webp');

create function pg_temp.assert_true(result boolean, failure text) returns void
language plpgsql as $$
begin
  if result is distinct from true then
    raise exception '%', failure;
  end if;
end
$$;

set local role anon;
select pg_temp.assert_true((select count(*) = 1 from public.projects where slug like 'demo-%'), 'Anon project visibility');
select pg_temp.assert_true(not exists (select from public.projects where slug in ('demo-borrador', 'demo-archivo')), 'Known private slug');
select pg_temp.assert_true((select count(id) = 1 from public.ideas where slug like 'demo-%'), 'Anon idea visibility');
select pg_temp.assert_true((select count(*) = 1 from public.project_technologies where project_id::text like '00000000-0000-4000-8000-0000000002%'), 'Anon association visibility');
select pg_temp.assert_true((select count(*) = 1 from public.project_images where storage_path in ('visible.webp', 'hidden.webp')), 'Anon image metadata visibility');
select pg_temp.assert_true((select count(*) = 1 from storage.objects where bucket_id = 'project-images'), 'Anon Storage visibility');
select pg_temp.assert_true((select array_agg(c) = array['Visualización'] from public.public_project_categories() c), 'Categories from published projects');
select pg_temp.assert_true(not has_table_privilege('public.projects', 'INSERT, UPDATE, DELETE'), 'Anon cannot write projects');
select pg_temp.assert_true(not has_table_privilege('public.contact_messages', 'SELECT, INSERT'), 'Anon cannot read or write messages');
select pg_temp.assert_true(not has_column_privilege('public.ideas', 'related_project_id', 'SELECT'), 'Private link not exposed');

set local role authenticated;
select pg_temp.assert_true((select count(*) = 1 from public.projects where slug like 'demo-%'), 'Authenticated visibility');
select pg_temp.assert_true((select count(id) = 1 from public.ideas where slug like 'demo-%'), 'Authenticated idea visibility');
select pg_temp.assert_true((select count(*) = 1 from storage.objects where bucket_id = 'project-images'), 'Authenticated Storage visibility');
select pg_temp.assert_true(not has_table_privilege('public.projects', 'INSERT, UPDATE, DELETE'), 'Authenticated cannot write projects');
select pg_temp.assert_true(not has_table_privilege('public.profiles', 'INSERT, UPDATE'), 'Authenticated cannot grant admin');
select pg_temp.assert_true(not has_table_privilege('public.contact_messages', 'SELECT, INSERT'), 'Authenticated cannot read or write messages');

reset role;
update public.projects set status = 'published' where slug = 'demo-borrador';
select pg_temp.assert_true((select published_at is not null from public.projects where slug = 'demo-borrador'), 'Publishing timestamps the project');
set local role anon;
select pg_temp.assert_true(exists(select from public.projects where slug = 'demo-borrador'), 'Publish visibility');
reset role;
update public.projects set status = 'draft' where slug = 'demo-mapa';
set local role anon;
select pg_temp.assert_true(not exists(select from public.projects where slug = 'demo-mapa'), 'Unpublish visibility');
select pg_temp.assert_true(not exists(select from storage.objects where bucket_id = 'project-images' and name = 'visible.webp'), 'Unpublish hides Storage metadata');
rollback;
