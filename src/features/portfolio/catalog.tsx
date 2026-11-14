'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { usePublicQuery } from '@/lib/supabase/use-public-query'
import { ProjectImage } from './project-image'
import { getOptions, pageSize, projectsQuery } from './queries'

export function Catalog() {
  const [category, setCategory] = useState('')
  const [technology, setTechnology] = useState('')
  const [page, setPage] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const options = usePublicQuery(getOptions)
  const getProjects = useCallback(async (client: SupabaseClient, signal: AbortSignal) => {
    const query = projectsQuery(client, technology)
    if (category) query.eq('category', category)
    const start = page * pageSize
    const { data, error, count } = await query.range(start, start + pageSize - 1).abortSignal(signal)
    if (error) throw error
    return { projects: data, total: count ?? 0 }
  }, [category, technology, page])
  const result = usePublicQuery(getProjects, attempt)

  if (result.status === 'unconfigured') return <p>El catálogo estará disponible cuando se conecte la fuente de datos.</p>

  return (
    <>
      {options.status === 'success' && (
        <div className="catalog-filters" aria-label="Filtros" role="group">
          <label>Categoría<select value={category} onChange={e => { setCategory(e.target.value); setPage(0) }}>
            <option value="">Todas</option>
            {options.data.categories.map(item => <option key={item}>{item}</option>)}
          </select></label>
          <label>Tecnología<select value={technology} onChange={e => { setTechnology(e.target.value); setPage(0) }}>
            <option value="">Todas</option>
            {options.data.technologies.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select></label>
          {(category || technology) && <button type="button" className="button secondary" onClick={() => {
            setCategory(''); setTechnology(''); setPage(0)
          }}>Limpiar filtros</button>}
        </div>
      )}
      {options.status === 'error' && <p role="status">Los filtros no están disponibles en este momento.</p>}
      {result.status === 'loading' && <p role="status">Cargando proyectos…</p>}
      {result.status === 'error' && <div role="status">
        <p>No se pudieron cargar los proyectos.</p>
        <button type="button" className="button secondary" onClick={() => setAttempt(attempt + 1)}>Reintentar</button>
      </div>}
      {result.status === 'success' && (
        <>
          {result.data.projects.length === 0
            ? <p role="status">{category || technology ? 'No hay proyectos para estos filtros.' : 'Todavía no hay proyectos publicados en esta página.'}</p>
            : <ul className="catalog-grid">
              {result.data.projects.map(project => {
                const cover = project.project_images[0]
                return (
                  <li key={project.id} className="catalog-card">
                    {cover && <ProjectImage path={cover.storage_path} alt={cover.alt_text} />}
                    <h2><Link href={`/proyectos/ver/?slug=${encodeURIComponent(project.slug)}`}>{project.title}</Link></h2>
                    <p>{project.summary}</p>
                  </li>
                )
              })}
            </ul>}
          {(page > 0 || result.data.total > pageSize) && <nav className="catalog-pagination" aria-label="Páginas del catálogo">
            <button className="button secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
            <span>Página {page + 1}</span>
            <button className="button secondary" disabled={(page + 1) * pageSize >= result.data.total} onClick={() => setPage(page + 1)}>Siguiente</button>
          </nav>}
        </>
      )}
    </>
  )
}
