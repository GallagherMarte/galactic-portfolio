import { expect, test } from '@playwright/test'

const routes = [
  ['/', 'Desarrollo en órbita.'],
  ['/proyectos/', 'Proyectos'],
  ['/ideas/', 'Ideas'],
  ['/sobre-mi/', 'Sobre mí'],
  ['/contacto/', 'Contacto'],
] as const

for (const [path, title] of routes) {
  test(`acceso directo y recarga de ${path}`, async ({ page }) => {
    expect((await page.goto(path))?.ok()).toBe(true)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    expect((await page.reload())?.ok()).toBe(true)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
  })
}

for (const width of [360, 768, 1280]) {
  test(`navegación y portada a ${width} px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused()
    await page.getByRole('link', { name: 'Saltar al contenido' }).blur()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await expect(page.locator('.hero canvas')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Contactar' })).toBeVisible()
    await info.attach('portada', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
    if (width === 360) {
      await page.getByRole('button', { name: 'Menú' }).focus()
      await page.keyboard.press('Enter')
      await expect(page.getByRole('navigation')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('button', { name: 'Menú' })).toBeFocused()
      await page.keyboard.press('Enter')
    }
    await page.getByRole('navigation').getByRole('link', { name: 'Sobre mí' }).click()
    await expect(page.getByRole('heading', { name: 'Sobre mí' })).toBeVisible()
  })
}

test('CTA funcionales sin WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, attributes?: unknown) {
      return type.startsWith('webgl') ? null : Reflect.apply(getContext, this, [type, attributes])
    } as typeof getContext
  })
  await page.goto('/')
  await expect(page.locator('.hero canvas')).toHaveCount(0)
  await page.getByRole('link', { name: 'Explorar proyectos' }).click()
  await expect(page).toHaveURL(/\/proyectos\/$/)
  await page.goto('/')
  await page.getByRole('link', { name: 'Contactar' }).click()
  await expect(page).toHaveURL(/\/contacto\/$/)
})

test('la portada funciona si no carga JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('link', { name: 'Explorar proyectos' }).click()
    await expect(page).toHaveURL(/\/proyectos\/$/)
  } finally {
    await context.close()
  }
})

test('la portada permanece usable si falla la descarga de la escena', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, attributes?: unknown) {
      // Provide WebGL capability for the initial probe so the lazy import runs.
      if (type === 'webgl2') return { getExtension: () => null }
      return Reflect.apply(getContext, this, [type, attributes])
    } as typeof getContext
  })

  let failedChunk = false
  await page.route('**/_next/static/**/*.js', async (route) => {
    const response = await route.fetch()
    if ((await response.text()).includes('d4bdff')) {
      failedChunk = true
      await route.abort()
      return
    }
    await route.fulfill({ response })
  })

  await page.goto('/')
  await expect.poll(() => failedChunk).toBe(true)
  await expect(page.locator('.hero canvas')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('link', { name: 'Contactar' }).click()
  await expect(page).toHaveURL(/\/contacto\/$/)
})
