create table public.profiles (
  id uuid primary key references auth.users(id),
  role text not null check (role = 'admin'),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,100}$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null check (char_length(summary) between 1 and 500),
  description text not null check (char_length(description) between 1 and 20000),
  category text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  github_url text check (github_url ~ '^https://github[.]com/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+/?$'),
  demo_url text check (demo_url ~ '^https://[^[:space:]]+$'),
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null check (length(btrim(alt_text)) > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,100}$'),
  name text not null,
  icon_key text,
  created_at timestamptz not null default now()
);

create table public.project_technologies (
  project_id uuid references public.projects(id) on delete cascade,
  technology_id uuid references public.technologies(id) on delete restrict,
  primary key (project_id, technology_id)
);

create table public.ideas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,100}$'),
  title text not null check (char_length(title) between 1 and 160),
  summary text not null check (char_length(summary) between 1 and 500),
  body text not null check (char_length(body) between 1 and 20000),
  status text not null default 'draft' check (status in ('draft', 'in_progress', 'converted', 'archived')),
  is_public boolean not null default false,
  related_project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.site_settings (
  id integer primary key check (id = 1),
  site_name text not null,
  hero_heading text,
  hero_description text,
  bio text,
  github_profile_url text,
  whatsapp_e164 text,
  contact_email text,
  updated_at timestamptz not null default now()
);

create index projects_catalog on public.projects (featured desc, sort_order, id) where status = 'published';
create index projects_category on public.projects (category) where status = 'published';
create index project_images_order on public.project_images (project_id, sort_order);
create index project_technologies_technology on public.project_technologies (technology_id);
create index ideas_public_order on public.ideas (published_at desc nulls last, id) where is_public and status in ('in_progress', 'converted');
create index ideas_related_project on public.ideas (related_project_id);
create index contact_messages_status on public.contact_messages (status, created_at desc);

create function public.set_updated_at() returns trigger
language plpgsql set search_path = ''
as $$ begin new.updated_at := now(); return new; end $$;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();
create trigger ideas_updated before update on public.ideas for each row execute function public.set_updated_at();
create trigger settings_updated before update on public.site_settings for each row execute function public.set_updated_at();
revoke execute on function public.set_updated_at() from public, anon, authenticated;

create function public.set_project_published_at() returns trigger
language plpgsql set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end
$$;
create trigger projects_published before insert or update of status on public.projects
for each row execute function public.set_project_published_at();
revoke execute on function public.set_project_published_at() from public, anon, authenticated;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.technologies enable row level security;
alter table public.project_technologies enable row level security;
alter table public.ideas enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

revoke all on public.profiles, public.projects, public.project_images, public.technologies,
  public.project_technologies, public.ideas, public.contact_messages, public.site_settings
  from public, anon, authenticated;
grant select on public.projects, public.project_images, public.technologies,
  public.project_technologies, public.site_settings to anon, authenticated;
-- The public list does not expose body or private project associations.
grant select (id, slug, title, summary, status, is_public, published_at)
  on public.ideas to anon, authenticated;

create policy published_projects on public.projects for select to anon, authenticated using (status = 'published');
create policy published_project_images on public.project_images for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published'));
create policy public_technologies on public.technologies for select to anon, authenticated using (true);
create policy published_project_technologies on public.project_technologies for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published'));
create policy public_ideas on public.ideas for select to anon, authenticated
  using (is_public and status in ('in_progress', 'converted'));
create policy public_site_settings on public.site_settings for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', false, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
create policy published_project_files on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images' and exists (
    select 1 from public.project_images image
    join public.projects project on project.id = image.project_id
    where image.storage_path = storage.objects.name and project.status = 'published'
  ));


create function public.public_project_categories() returns setof text
language sql stable security invoker set search_path = ''
as $$
  select distinct category from public.projects
  where status = 'published' and category is not null and btrim(category) <> ''
  order by category
$$;
revoke execute on function public.public_project_categories() from public;
grant execute on function public.public_project_categories() to anon, authenticated;
