import type { QueryData, SupabaseClient } from '@supabase/supabase-js'

const cardFields = 'id,slug,title,summary,category,project_images(storage_path,alt_text),project_technologies(technologies(name))'
export const pageSize = 9

export function projectsQuery(client: SupabaseClient, technology?: string) {
  const fields = technology
    ? `${cardFields},filter_tech:project_technologies!inner(technology_id)`
    : cardFields
  const query = client.from('projects').select(fields as typeof cardFields, { count: 'exact' })
    .eq('status', 'published')
    .order('featured', { ascending: false }).order('sort_order').order('id')
    .order('sort_order', { referencedTable: 'project_images' })
    .order('id', { referencedTable: 'project_images' })
  return technology ? query.eq('filter_tech.technology_id', technology) : query
}

export type ProjectCard = QueryData<ReturnType<typeof projectsQuery>>[number]

export async function getOptions(client: SupabaseClient, signal: AbortSignal) {
  const [categories, technologies] = await Promise.all([
    client.rpc('public_project_categories').abortSignal(signal),
    client.from('technologies').select('id,name').order('name').order('id').abortSignal(signal),
  ])
  if (categories.error || technologies.error) throw new Error('Error al cargar filtros')
  return {
    categories: (categories.data ?? []) as string[],
    technologies: technologies.data as { id: string; name: string }[],
  }
}

export function safeLink(value: string | null, github = false) {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    if (github && (url.origin !== 'https://github.com' || url.search || url.hash ||
      !/^\/[\w.-]+\/[\w.-]+\/?$/.test(url.pathname))) return null
    return url.href
  } catch {
    return null
  }
}
