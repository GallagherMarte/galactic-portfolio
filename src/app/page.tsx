import Link from 'next/link'
import { HeroEffects } from '@/components/space/hero-effects'

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <HeroEffects />
        <div className="hero-content">
          <p className="eyebrow">Portafolio de software</p>
          <h1 id="hero-title">Desarrollo<br /><em>en órbita.</em></h1>
          <p className="hero-description">Un espacio para explorar proyectos de software, conocer mi perfil y descubrir ideas en desarrollo.</p>
          <div className="actions">
            <Link className="button primary" href="/proyectos">Explorar proyectos <span aria-hidden="true">↗</span></Link>
            <Link className="button secondary" href="/contacto">Contactar</Link>
          </div>
        </div>
      </section>
      <section className="home-index" aria-label="Explorar el portafolio">
        <Link href="/proyectos"><strong>Proyectos</strong><span>Catálogo de trabajos de software</span><b aria-hidden="true">↗</b></Link>
        <Link href="/ideas"><strong>Ideas</strong><span>Conceptos en desarrollo</span><b aria-hidden="true">↗</b></Link>
        <Link href="/sobre-mi"><strong>Sobre mí</strong><span>Perfil profesional</span><b aria-hidden="true">↗</b></Link>
      </section>
    </>
  )
}
