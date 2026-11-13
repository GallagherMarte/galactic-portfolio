'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'

const links = [
  ['/', 'Inicio'],
  ['/proyectos', 'Proyectos'],
  ['/ideas', 'Ideas'],
  ['/contacto', 'Contacto'],
] as const

export function SiteHeader() {
  const pathname = usePathname().replace(/\/$/, '') || '/'
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)

  function navigate() {
    if (!open) return
    setOpen(false)
    document.getElementById('contenido')?.focus()
  }

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        toggle.current?.focus()
      }
    }}>
      <Link className="wordmark" href="/" onClick={navigate}>
        <span className="brand-mark" aria-hidden="true">✦</span> Galactic <span>Portfolio</span>
      </Link>
      <button className="menu-toggle" ref={toggle} type="button" aria-expanded={open} aria-controls="site-nav"
        onClick={() => setOpen(!open)}>
        {open ? 'Cerrar' : 'Menú'} <span aria-hidden="true">{open ? '×' : '☰'}</span>
      </button>
      <nav className="site-nav" id="site-nav" aria-label="Navegación principal" data-open={open}>
        {links.map(([href, label]) => (
          <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={navigate}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
