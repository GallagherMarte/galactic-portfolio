'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/browser'

export function ProjectImage({ path, alt }: { path: string; alt: string }) {
  const [image, setImage] = useState<{ path: string; url: string }>()
  useEffect(() => {
    if (!supabase) return
    const controller = new AbortController()
    let url: string | undefined
    supabase.storage.from('project-images').download(path, {}, {
      signal: controller.signal, cache: 'no-store',
    }).then(({ data }) => {
      if (!data || controller.signal.aborted) return
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(data.type)) return
      url = URL.createObjectURL(data)
      setImage({ path, url })
    }, () => {})
    return () => {
      controller.abort()
      if (url) URL.revokeObjectURL(url)
    }
  }, [path])

  if (image?.path !== path) return null
  // Private Storage assets are fetched with authorization and displayed through a local blob URL.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image.url} alt={alt} className="project-image" />
}
