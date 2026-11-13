# GALACTIC PORTFOLIO — PROJECT OVERVIEW

**Versión del plan:** 1.1 aprobada | **Fecha:** 2026-11-13 | **Estado:** planificación entregada; implementación NO autorizada.

## 1. Propósito
Crear un portafolio web profesional, un centro de exposición de trabajos de desarrollo y un laboratorio de ideas de software. Permitirá que reclutadores, empresas, clientes y desarrolladores conozcan el trabajo del propietario, abran repositorios GitHub seleccionados y contacten por formulario o WhatsApp. El propietario gestionará el contenido sin editar código.

## 2. Decisiones aprobadas e inmutables sin control de cambios
- **Estética:** galáctica cinematográfica; planetas, nebulosas, naves y monumentalidad sci-fi, inspirada en el tono de Warhammer 40K **sin copiar arte, marcas, iconografía ni activos protegidos**.
- **Dos experiencias:** sitio público y panel administrativo privado para un solo propietario.
- **GitHub:** selección **manual** de proyectos/repositorios, sin sincronización automática en MVP.
- **Contacto:** formulario guardado para revisión del administrador y botón WhatsApp.
- **Ideas:** privadas o públicas según estado y visibilidad explícita.
- **Stack aprobado:** Next.js + TypeScript, Tailwind CSS, Motion, Three.js/R3F selectivos; PostgreSQL + Auth + Storage + Edge Functions en Supabase; Cloudflare Pages con exportación estática; GitHub + GitHub Actions; Vitest + Playwright.
- **Costo objetivo:** US$0/mes sujeto a límites gratuitos, uso y cambios de condiciones.
- **Plan:** MVP en 4 sprints verificables. Sin microservicios ni una API propia persistente para MVP.

## 3. Personas y necesidades
1. **Visitante/reclutador:** conocer competencias y proyectos en minutos, revisar código/demo y contactar fácilmente.
2. **Cliente potencial:** comprender soluciones, evidencia, tecnologías y vías de contacto.
3. **Administrador propietario:** publicar y modificar proyectos, subir imágenes, registrar ideas, organizar enlaces y revisar mensajes en una UI protegida.

## 4. Objetivos y éxito
- Publicar proyectos sin cambiar código ni redeploy.
- Conectar cada proyecto opcionalmente con URL de GitHub y demo externa.
- Mantener ideas privadas fuera de lecturas públicas y exponer solo ideas publicadas.
- Entregar experiencia móvil accesible con estética galáctica, alternativa liviana a 3D y metadatos SEO básicos.
- Realizar contacto desde formulario validado/antispam y WhatsApp.
- Evitar comprometer gastos fijos en el MVP.

## 5. Alcance del MVP
### Incluido
Inicio; catálogo y detalle de proyectos; búsqueda/filtros por categoría y tecnología; fichas con imágenes/tecnologías/GitHub/demo; sección sobre mí; listado y detalle básico de ideas públicas; contacto y WhatsApp; login de admin; CRUD y ciclo de publicación de proyectos/ideas; gestión de imágenes y tecnologías; configuración del sitio; bandeja de mensajes; RLS, respaldos exportables, pruebas y despliegue.

### No incluido
Registro de usuarios públicos, comentarios, pagos, e-commerce, foro, integración automática con GitHub, buscador externo, blog extenso, aplicación 3D completa, multitenancy, microservicios, notificaciones por correo como requisito, analítica avanzada ni hosting de aplicaciones de terceros dentro del portafolio.

## 6. Restricciones y decisiones abiertas de contenido
- **Por completar antes del lanzamiento:** nombre/marca definitiva, nombre y biografía pública, URL de GitHub, número de WhatsApp en formato internacional, correo de contacto, repositorios elegidos, imágenes autorizadas, aviso de privacidad.
- **Antes de Sprint 1:** confirmar si hay repositorio existente, rama base y último PR; comprobar versiones compatibles de dependencias y prestaciones del proveedor vigentes. Las versiones exactas se registrarán en el lockfile. No asumir que Next.js funciona con cualquier modo de exportación por ser Next.js.
- **Antes de Sprint 4:** revisar límites de Supabase Free, disponibilidad del servicio y método real de exportación/restauración de base de datos y archivos.
- **No inferir:** textos públicos de proyectos, cifras de experiencia, clientes, capturas o repositorios sin evidencia.

## 7. Métricas objetivo (no resultados verificados)
- Core Web Vitals en contexto móvil: LCP <= 2.5 s; INP <= 200 ms; CLS <= 0.1.
- Accesibilidad: objetivo WCAG 2.2 AA; navegación por teclado y `prefers-reduced-motion`.
- Sin desbordamiento horizontal a 360 px.
- Cero lecturas públicas de ideas privadas, borradores o mensajes.
- Todas las operaciones críticas con pruebas automatizadas y verificación de permisos.

## 8. Entregas y gobernanza
Ver [BACKLOG.md](BACKLOG.md). Cada sprint requiere **autorización adicional explícita** tras revisión de plan, alcance, archivos, riesgos y criterios; la aprobación de este documento **no** autoriza implementación, push, PR, merge o despliegue. Cumplir [CODEX_INSTRUCTIONS.md](CODEX_INSTRUCTIONS.md) y el AGENTS.md original del usuario, con las 18 secciones de estándares técnicos.

## 9. Dependencias y riesgos principales
- Supabase Free puede pausar instancias inactivas y no ofrece backups automáticos: exportar y documentar recuperación; monitorizar cuotas.
- `output: 'export'` limita SSR, API routes y rutas generadas dinámicamente: páginas de detalle se resolverán mediante ruta estática `/proyectos/ver?slug=...` (y equivalente para ideas) con datos leídos en cliente; considerar Workers en evolución, previa aprobación de cambio de arquitectura.
- 3D incrementa memoria y carga: efecto limitado, lazy-load, alternativa estática y medición.
- Contacto público expuesto a spam: Edge Function con Turnstile validado en servidor, límites de abuso y respuestas seguras.
- Costes y límites pueden cambiar: cualquier ampliación con gasto requiere autorización.
