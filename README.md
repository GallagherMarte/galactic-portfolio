# Galactic Portfolio

Base pública del portafolio de desarrollo de software. El Sprint 1 incluye la portada y las rutas Proyectos, Ideas, Sobre mí y Contacto. Las páginas muestran estados vacíos mientras se incorpora el contenido real.

## Desarrollo local

Requiere Node 22.16 o posterior dentro de la serie 22 y npm. Los scripts de Next.js usan Webpack porque Turbopack falló al ejecutar PostCSS en el entorno Windows de desarrollo.

```sh
npm ci
npm run dev
```

## Verificar la exportación

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Para la revisión manual, ejecutar `npm run preview` y abrir http://127.0.0.1:4173. Recorrer y recargar las cinco rutas, abrir el menú móvil con teclado y revisar la portada a 360, 768 y 1280 px. El informe de Playwright en `playwright-report/index.html` adjunta capturas de estos tres tamaños.

El arte de portada en `public/space/orbit.webp` es una ilustración original generada con OpenAI ImageGen para el proyecto. La escena de estrellas se genera en el cliente. La exportación queda en `out/` y no necesita credenciales.
