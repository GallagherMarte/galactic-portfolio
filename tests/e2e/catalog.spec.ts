import { expect, test } from '@playwright/test'

const configured = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://supabase-catalog.test'

test('la ficha exportada permite un acceso directo con slug inválido', async ({ page }) => {
  await page.goto('/proyectos/ver/?slug=%2F')
  await expect(page.getByRole('heading', { name: 'Proyecto no encontrado' })).toBeVisible()
})

test('filtros, proyecto no encontrado y actualización de contenido sin reconstruir', async ({ page }) => {
  test.skip(!configured, 'Este escenario requiere el build de pruebas con Supabase simulado.')
  let published = true
  let requestCount = 0
  const project = {
    id: '1', slug: 'mapa-orbital', title: 'Mapa orbital (demo)', summary: 'Proyecto de prueba',
    description: 'Descripción de prueba', category: 'Visualización',
    github_url: 'https://github.com/GallagherMarte/galactic-portfolio', demo_url: 'javascript:alert(1)',
    project_images: [], project_technologies: [],
  }
  await page.route('https://supabase-catalog.test/rest/v1/**', async (route) => {
    const url = new URL(route.request().url())
    const headers = { 'access-control-allow-origin': '*', 'access-control-expose-headers': 'content-range' }
    if (url.pathname.endsWith('/rpc/public_project_categories')) return route.fulfill({ headers, json: ['Visualización', 'Herramientas'] })
    if (url.pathname.endsWith('/technologies')) return route.fulfill({ headers, json: [{ id: '42', name: 'TypeScript' }] })
    requestCount += 1
    expect(url.searchParams.get('status')).toBe('eq.published')
    const category = url.searchParams.get('category')
    const slug = url.searchParams.get('slug')
    if (url.searchParams.has('filter_tech.technology_id')) {
      expect(url.searchParams.get('filter_tech.technology_id')).toBe('eq.42')
      expect(url.searchParams.get('select')).toContain('filter_tech:project_technologies!inner')
    }
    const rows = published && (!category || category === 'eq.Visualización') && (!slug || slug === 'eq.mapa-orbital') ? [project] : []
    return route.fulfill({ headers: { ...headers, 'content-range': rows.length ? '0-0/1' : '*/0' }, json: rows })
  })

  await page.goto('/proyectos/')
  await expect(page.getByRole('link', { name: project.title })).toBeVisible()
  await page.setViewportSize({ width: 360, height: 860 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360)
  await page.getByLabel('Categoría').selectOption('Herramientas')
  await expect(page.getByText('No hay proyectos para estos filtros.')).toBeVisible()
  await page.getByLabel('Tecnología').selectOption('42')
  await page.getByLabel('Categoría').selectOption('Visualización')
  await expect(page.getByRole('link', { name: project.title })).toBeVisible()
  await page.getByRole('button', { name: 'Limpiar filtros' }).click()
  await page.getByRole('link', { name: project.title }).click()
  await expect(page).toHaveURL(/\/proyectos\/ver\/?\?slug=mapa-orbital$/)
  await expect(page.getByRole('heading', { level: 1, name: project.title })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: project.title })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ver GitHub' })).toHaveAttribute('href', project.github_url)
  await expect(page.getByRole('link', { name: 'Abrir demo' })).toHaveCount(0)
  const before = requestCount
  published = false
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Proyecto no encontrado' })).toBeVisible()
  expect(requestCount).toBeGreaterThan(before)
})

test('el listado de ideas consulta únicamente estados públicos', async ({ page }) => {
  test.skip(!configured, 'Este escenario requiere el build de pruebas con Supabase simulado.')
  await page.route('https://supabase-catalog.test/rest/v1/ideas?*', async route => {
    const query = new URL(route.request().url()).searchParams
    expect(query.get('is_public')).toBe('eq.true')
    expect(query.get('status')).toBe('in.(in_progress,converted)')
    await route.fulfill({
      headers: { 'access-control-allow-origin': '*' },
      json: [{ id: '1', title: 'Bitácora orbital (demo)', summary: 'Idea ficticia.', status: 'in_progress' }],
    })
  })
  await page.goto('/ideas/')
  await expect(page.getByRole('heading', { name: 'Bitácora orbital (demo)' })).toBeVisible()
})
