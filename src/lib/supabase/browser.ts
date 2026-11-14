import { createClient } from '@supabase/supabase-js'

function publicUrl(value: string | undefined) {
  try {
    const url = new URL(value ?? '')
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null
    return url.protocol === 'https:' || (local && url.protocol === 'http:') ? url.origin : null
  } catch {
    return null
  }
}

const url = publicUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key?.startsWith('sb_publishable_')
  ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
  : null
