import { Catalog } from '@/features/portfolio/catalog'

export const metadata = { title: 'Proyectos' }

export default function Page() {
  return <section className="public-page catalog-page"><h1>Proyectos</h1><Catalog /></section>
}
