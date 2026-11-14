'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import { usePublicQuery } from '@/lib/supabase/use-public-query'

async function getIdeas(client: SupabaseClient, signal: AbortSignal) {
  const { data, error } = await client.from('ideas').select('id,title,summary,status')
    .eq('is_public', true).in('status', ['in_progress', 'converted'])
    .order('published_at', { ascending: false, nullsFirst: false }).order('id').abortSignal(signal)
  if (error) throw error
  return data
}

export function IdeasList() {
  const result = usePublicQuery(getIdeas)
  if (result.status === 'unconfigured') return <p>Las ideas estarán disponibles cuando se conecte la fuente de datos.</p>
  if (result.status === 'loading') return <p role="status">Cargando ideas…</p>
  if (result.status !== 'success') return <p role="status">No se pudieron cargar las ideas.</p>
  if (result.data.length === 0) return <p>No hay ideas públicas todavía.</p>

  return <ul className="catalog-grid">
    {result.data.map(idea => <li className="catalog-card" key={idea.id}>
      <span className="idea-status">{idea.status === 'converted' ? 'Convertida en proyecto' : 'En desarrollo'}</span>
      <h2>{idea.title}</h2>
      <p>{idea.summary}</p>
    </li>)}
  </ul>
}
