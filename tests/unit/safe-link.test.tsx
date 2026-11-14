import { expect, test } from 'vitest'
import { safeLink } from '../../src/features/portfolio/queries'

test('acepta repositorios HTTPS de GitHub', () => {
  expect(safeLink('https://github.com/GallagherMarte/galactic-portfolio', true))
    .toBe('https://github.com/GallagherMarte/galactic-portfolio')
})

test.each([
  'https://github.com.ejemplo.test/user/proyecto',
  'https://github.com@ejemplo.test/user/proyecto',
  'https://github.com/user/proyecto/issues',
  'https://github.com/user/proyecto?fake=1',
  'javascript:alert(1)',
  'http://github.com/user/proyecto',
])('omite %s como enlace de GitHub', (value) => {
  expect(safeLink(value, true)).toBeNull()
})

test('limita las demos a HTTPS sin credenciales', () => {
  expect(safeLink('https://example.com/demo')).toBe('https://example.com/demo')
  expect(safeLink('https://user:pass@example.com/demo')).toBeNull()
  expect(safeLink('data:text/html,hello')).toBeNull()
})
