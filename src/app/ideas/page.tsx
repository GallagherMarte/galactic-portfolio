import { IdeasList } from '@/features/ideas/ideas-list'

export const metadata = { title: 'Ideas' }

export default function Page() {
  return <section className="public-page catalog-page"><h1>Ideas</h1><IdeasList /></section>
}
