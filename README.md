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

## Catálogo y Supabase

Para una instancia de prueba local, inicia Supabase CLI con Docker y aplica las migraciones y el seed local con `supabase db reset --local`. Este comando recrea la base local. Usa la URL y la clave **publishable** de la instancia en `.env.local` siguiendo `.env.example`. La clave debe empezar por `sb_publishable_`. Las variables públicas se incluyen al compilar. Una vez conectado, el sitio consulta los datos nuevamente al abrir o recargar la página.

El seed contiene ejemplos ficticios. No lo ejecutes sobre datos de producción. Para verificar permisos, ejecuta `supabase/tests/catalog.sql` con `psql -v ON_ERROR_STOP=1 -f supabase/tests/catalog.sql` contra la base local con el seed aplicado. Las escrituras de la prueba se revierten con una transacción.

La imagen de un proyecto debe estar en el bucket privado `project-images`, con una fila correspondiente en `project_images`. El catálogo descarga el archivo bajo RLS, con una petición sin caché de navegador y sin generar enlaces firmados. Verifica en Supabase Storage que una nueva descarga sea denegada al despublicar el proyecto. Una copia ya descargada puede seguir en manos del visitante.

Para ejecutar el recorrido simulado del catálogo desde PowerShell, usa en una sesión de pruebas:

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL = 'https://supabase-catalog.test'
$env:NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test_only'
npm run build
npm run test:e2e
```

Playwright intercepta el dominio de prueba y usa el puerto 4174. Abre una sesión nueva y reconstruye con tus valores locales para recuperar la vista previa en el puerto 4173.
