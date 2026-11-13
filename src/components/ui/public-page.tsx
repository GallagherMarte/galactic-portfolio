import Link from 'next/link'

export function PublicPage({ title, message }: { title: string; message: string }) {
  return (
    <section className="public-page">
      <h1>{title}</h1>
      <p>{message}</p>
      <Link className="button secondary" href="/">Volver al inicio</Link>
    </section>
  )
}
