import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { SiteHeader } from '../../src/components/ui/site-header'

vi.mock('next/navigation', () => ({ usePathname: () => '/ideas/' }))
afterEach(cleanup)

test('indica la página activa y cierra el menú con Escape', () => {
  render(<SiteHeader />)
  expect(screen.getByRole('link', { name: 'Ideas' }).getAttribute('aria-current')).toBe('page')
  fireEvent.click(screen.getByRole('button', { name: 'Menú' }))
  const button = screen.getByRole('button', { name: 'Cerrar' })
  expect(button.getAttribute('aria-expanded')).toBe('true')
  fireEvent.keyDown(button, { key: 'Escape' })
  expect(button.getAttribute('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(button)
})
