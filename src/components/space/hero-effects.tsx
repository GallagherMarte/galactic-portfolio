'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, type ReactNode, Component } from 'react'
import { useReducedMotion } from 'motion/react'

const StarScene = dynamic(() => import('./star-scene'), { ssr: false })

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function HeroEffects() {
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timeout = window.setTimeout(() => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2')
      if (!gl) return
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      setReady(true)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [reducedMotion])

  if (!ready || reducedMotion) return null

  return (
    <div className="hero-effects" aria-hidden="true">
      <SceneBoundary><StarScene /></SceneBoundary>
    </div>
  )
}
