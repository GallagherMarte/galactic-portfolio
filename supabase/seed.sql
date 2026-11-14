-- Datos ficticios para Supabase local.
insert into public.projects (id, slug, title, summary, description, category, status, featured)
values
  ('00000000-0000-4000-8000-000000000201', 'demo-mapa', 'Mapa orbital (demo)', 'Ficha ficticia para probar el catálogo.', 'Descripción de prueba.', 'Visualización', 'published', true),
  ('00000000-0000-4000-8000-000000000202', 'demo-borrador', 'Borrador ficticio', 'Dato privado de prueba.', 'No debe ser visible.', 'Privada', 'draft', false),
  ('00000000-0000-4000-8000-000000000203', 'demo-archivo', 'Archivo ficticio', 'Dato archivado de prueba.', 'No debe ser visible.', 'Privada', 'archived', false);
insert into public.technologies (id, slug, name)
values ('00000000-0000-4000-8000-000000000211', 'typescript', 'TypeScript');
insert into public.project_technologies (project_id, technology_id) values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000211'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000211');
insert into public.ideas (slug, title, summary, body, status, is_public)
values
  ('demo-idea', 'Bitácora orbital (demo)', 'Idea pública ficticia.', 'Cuerpo ficticio.', 'in_progress', true),
  ('demo-idea-privada', 'Idea privada ficticia', 'Dato privado.', 'Cuerpo ficticio.', 'converted', false),
  ('demo-idea-borrador', 'Idea en borrador', 'Dato privado.', 'Cuerpo ficticio.', 'draft', true),
  ('demo-idea-archivo', 'Idea archivada', 'Dato privado.', 'Cuerpo ficticio.', 'archived', true);
