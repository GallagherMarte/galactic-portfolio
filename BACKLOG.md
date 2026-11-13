# GALACTIC PORTFOLIO — BACKLOG, SPRINTS & ACCEPTANCE

**Plan v1.1 aprobado como diseño.** **Ningún sprint está autorizado para implementación hasta aprobación específica del propietario.**

## 1. Prioridades
- P0: imprescindible para MVP operativo y seguro.
- P1: incluido en MVP, diferible dentro de su sprint si se documenta, con aprobación de cambio de alcance.
- P2: evolución futura, excluida del MVP.

## 2. Dependencias
Sprint 1 (base visual/técnica) → Sprint 2 (modelo y catálogo) → Sprint 3 (auth/CRUD) → Sprint 4 (contacto/seguridad/operaciones). En caso de necesidades técnicas, puede proponerse preparar cimientos (ej. Auth) antes, pero cambios materiales se aprueban.

## 3. Sprint 1 — Fundamentos y experiencia visual
**Objetivo:** aplicación Next.js exportable a Cloudflare Pages con portada e identidad profesional y navegación navegable.
**Historias:** HU-01, HU-02, HU-03.
**Tareas:** S1-T01 inspeccionar repo/rama/status/PR; S1-T02 fijar versiones compatibles y lockfile; S1-T03 estructura de features + rutas; S1-T04 tokens/layout/header/nav; S1-T05 hero cinematográfico con fallback estático; S1-T06 páginas públicas esqueleto con estados vacíos etiquetados; S1-T07 lint/types/unit/UI responsive; S1-T08 preparar guía de revisión PR.
**Dependencias:** no requiere credenciales reales para maqueta; contenido ficticio solo si se etiqueta como demo en entorno local.
**DoD:** build estático exitoso; navegación móvil/desktop; hero no bloquea interacción; reduced motion; sin links muertos; pruebas registradas.
**Evidencia:** pantallas/capturas y resultados de build/lint/typecheck; cambios listados.

## 4. Sprint 2 — Catálogo, datos y publicaciones
**Objetivo:** proyectos e ideas públicas con DB y políticas de visibilidad; GitHub manual.
**Historias:** HU-04, HU-05, HU-06.
**Tareas:** S2-T01 migraciones tablas y restricciones; S2-T02 índices y RLS SELECT; S2-T03 cliente Supabase; S2-T04 listado/detalle `/proyectos/ver?slug=`; S2-T05 filtros/estados; S2-T06 imágenes públicas permitidas y URLs GitHub seleccionadas; S2-T07 listado de ideas públicas; S2-T08 pruebas de RLS, contenido y E2E navegación.
**Dependencias:** instancia Supabase Free configurada de forma segura; decidir contenido inicial por propietario; assets con derechos.
**DoD:** solo proyectos published e ideas permitidas son visibles; urls correctas; no fuga con slug conocido; sin redeploy cuando datos cambien (verificación con inserción aprobada de test).
**Evidencia:** resultados tests SQL RLS con anon/no-admin, flujos de lectura pública y capturas.

## 5. Sprint 3 — Administración privada
**Objetivo:** propietario crea y publica contenido desde panel seguro.
**Historias:** HU-07, HU-08, HU-09.
**Tareas:** S3-T01 Supabase Auth y creación controlada de admin; S3-T02 políticas RLS escritura; S3-T03 guardias UI y cierre de sesión; S3-T04 CRUD proyectos con borrador/publicado/archivado; S3-T05 upload de imágenes y políticas Storage; S3-T06 CRUD ideas y `is_public`; S3-T07 tecnologías y configuración básica; S3-T08 tests auth/RLS/CRUD/upload/E2E; S3-T09 guía de revisión de panel.
**Dependencias:** Sprint 2 y cuentas/credenciales Supabase; admin creado de manera controlada.
**DoD:** admin puede publicar proyecto sin editar código; usuario anon/no-admin no puede leer/escribir contenido privado; error/validación robustos; rollback seguro de media.
**Evidencia:** test automatizado de permisos positivos/negativos y flujo E2E de publicación/despublicación.

## 6. Sprint 4 — Contacto, seguridad y lanzamiento
**Objetivo:** contacto funcional, mensajería administrable y sitio listo para publicación aprobada.
**Historias:** HU-10, HU-11, HU-12.
**Tareas:** S4-T01 Edge Function contacto + validaciones; S4-T02 Turnstile server verification y protección de abuso; S4-T03 formulario estados de error/éxito; S4-T04 WhatsApp configurable; S4-T05 inbox de admin (new/read/archived); S4-T06 SEO básico, metadatos y política privacidad; S4-T07 backups y restauración de ensayo; S4-T08 CI/CD, configuraciones y docs despliegue; S4-T09 pruebas E2E/seguridad/a11y/perf; S4-T10 checklist final y autorización explícita de despliegue.
**Dependencias:** dominios/subdominios y credenciales Turnstile configuradas; información real de contacto; infraestructura Free disponible.
**DoD:** contacto válido almacenado y consultable solo por admin; spam/replay básico rechazado; link WhatsApp correcto; restauración probada; CI verde; mediciones documentadas; despliegue únicamente con permiso explícito.
**Evidencia:** pruebas del endpoint sin secretos, RLS, E2E y reporte de verificaciones.

## 7. Definition of Done general
- Alcance aprobado y diferencias documentadas antes de modificar.
- Typecheck, lint, build y tests relevantes ejecutados (o limitaciones reportadas); ningún test debilitado para pasar.
- Políticas de seguridad e integración verificadas donde corresponda.
- Estados loading/empty/error/success y accesibilidad revisados.
- Diff revisado; no secretos ni archivos ajenos; docs de contratos y migraciones sincronizados.
- Resumen final: archivos cambiados, implementación, pruebas (ejecutadas/fallidas/no disponibles), riesgos, pendientes y guía de revisión PR.
- PR puede prepararse solo con permiso pertinente; **no fusionar sin aprobación**.

## 8. Checklist de aceptación final
- [ ] Inicio/CTA/proyectos/sobre mí/contacto accesibles por teclado y móvil.
- [ ] Catálogo/detalle con GitHub manual y enlaces válidos.
- [ ] Publicados visibles y borradores inaccesibles desde navegador sin sesión.
- [ ] Ideas privadas no se filtran por listados ni consultas directas.
- [ ] Login admin, CRUD y subida de archivos con políticas correctas.
- [ ] Formulario Turnstile verificado en servidor, mensajes solo admin.
- [ ] WhatsApp configurable y operativo.
- [ ] Metadatos básicos y aviso privacidad con datos reales.
- [ ] Backups exportados y restauración verificada.
- [ ] CI y pruebas documentadas; métricas de rendimiento medidas o justificadas.
- [ ] Límites/costos Free revisados.
- [ ] Dueño aprueba explícitamente despliegue final.

## 9. Evolución (no ejecutar como parte del MVP)
P2: blog técnico, laboratorio de demos, métricas avanzadas, integración automática GitHub, mejores rutas SEO con SSR/Workers, sistemas externos enlazados. Cada evolución requiere su propio plan/ADR/aprobación.
