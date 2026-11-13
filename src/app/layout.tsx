import type { Metadata } from 'next'
import { SiteHeader } from '@/components/ui/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Galactic Portfolio', template: '%s | Galactic Portfolio' },
  description: 'Portafolio de desarrollo de software, proyectos e ideas.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <SiteHeader />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <footer className="site-footer"><span className="brand-mark" aria-hidden="true">✦</span> Galactic Portfolio</footer>
      </body>
    </html>
  )
}
