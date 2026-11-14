'use client'

import { useEffect, useState } from 'react'
import { supabase } from './browser'

type Client = NonNullable<typeof supabase>
type Result<T> = { status: 'loading' | 'unconfigured' | 'error' } | { status: 'success'; data: T }

export function usePublicQuery<T>(query: (client: Client, signal: AbortSignal) => Promise<T>, attempt = 0): Result<T> {
  const [result, setResult] = useState<{ query: typeof query; attempt: number; value: Result<T> }>()
  useEffect(() => {
    if (!supabase) return
    const controller = new AbortController()
    query(supabase, controller.signal).then(
      data => {
        if (!controller.signal.aborted) setResult({ query, attempt, value: { status: 'success', data } })
      },
      () => {
        if (!controller.signal.aborted) setResult({ query, attempt, value: { status: 'error' } })
      },
    )
    return () => controller.abort()
  }, [query, attempt])

  if (!supabase) return { status: 'unconfigured' }
  return result?.query === query && result.attempt === attempt ? result.value : { status: 'loading' }
}
