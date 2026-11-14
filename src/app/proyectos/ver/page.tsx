import Link from 'next/link'
import { Suspense } from 'react'
import { ProjectDetail } from '@/features/portfolio/project-detail'

export const metadata = { title: 'Ficha de proyecto' }

export default function Page() {
  return <section className="public-page catalog-page">
    <Link className="back-link" href="/proyectos">← Volver a proyectos</Link>
    <Suspense fallback={<h1>Cargando proyecto…</h1>}><ProjectDetail /></Suspense>
  </section>
}
