'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { usePublicQuery } from '@/lib/supabase/use-public-query'
import { ProjectImage } from './project-image'
import { safeLink } from './queries'

type ProjectDetailRow = {
  title: string
  summary: string
  description: string
  category: string | null
  github_url: string | null
  demo_url: string | null
  project_images: { storage_path: string; alt_text: string }[]
  project_technologies: { technology_id: string; technologies: { name: string } | null }[]
}

export function ProjectDetail() {
  const slug = useSearchParams().get('slug') ?? ''
  const valid = /^[a-z0-9-]{3,100}$/.test(slug)
  const getProject = useCallback(async (client: SupabaseClient, signal: AbortSignal) => {
    if (!valid) return null
    const { data, error } = await client.from('projects')
      .select('title,summary,description,category,github_url,demo_url,project_images(storage_path,alt_text),project_technologies(technology_id,technologies(name))')
      .eq('status', 'published').eq('slug', slug)
      .order('sort_order', { referencedTable: 'project_images' })
      .order('id', { referencedTable: 'project_images' })
      .abortSignal(signal).maybeSingle().overrideTypes<ProjectDetailRow | null, { merge: false }>()
    if (error) throw error
    return data
  }, [slug, valid])
  const result = usePublicQuery(getProject)

  if (!valid) return <h1>Proyecto no encontrado</h1>
  if (result.status === 'loading') return <h1>Cargando proyecto…</h1>
  if (result.status === 'unconfigured') return <h1>Catálogo sin configurar</h1>
  if (result.status !== 'success') return <h1>No se pudo cargar el proyecto</h1>
  const project = result.data
  if (!project) return <h1>Proyecto no encontrado</h1>
  const github = safeLink(project.github_url, true)
  const demo = safeLink(project.demo_url)

  return (
    <article>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>
      <p className="project-description">{project.description}</p>
      {project.project_technologies.length > 0 && (
        <ul className="project-tech" aria-label="Tecnologías">
          {project.project_technologies.map(({ technology_id, technologies }) =>
            technologies && <li key={technology_id}>{technologies.name}</li>)}
        </ul>
      )}
      <div className="actions">
        {github && <a className="button primary" href={github} target="_blank" rel="noopener noreferrer">Ver GitHub</a>}
        {demo && <a className="button secondary" href={demo} target="_blank" rel="noopener noreferrer">Abrir demo</a>}
      </div>
      {project.project_images.map(image => <ProjectImage key={image.storage_path} path={image.storage_path} alt={image.alt_text} />)}
    </article>
  )
}
