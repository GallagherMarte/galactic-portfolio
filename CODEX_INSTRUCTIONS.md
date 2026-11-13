# GALACTIC PORTFOLIO — INSTRUCCIONES OBLIGATORIAS PARA CODEX

## 0. Estado de autorización — LEER PRIMERO
**El usuario aprobó el PLAN maestro v1.1 y pidió generar documentación. No ha aprobado comenzar a programar, ejecutar un sprint, crear o fusionar PR ni desplegar.** Estos archivos son insumo para revisar y planificar. Si Codex recibe este paquete, debe analizar/validar, presentar Sprint 1 y **solicitar aprobación expresa antes de editar**.

## 1. Documentos obligatorios en este orden
1. `PROJECT_OVERVIEW.md` — propósito/alcance.
2. `REQUIREMENTS.md` — requisitos y criterios.
3. `ARCHITECTURE.md` — arquitectura/contratos.
4. `DATABASE.md` — esquema/permisos.
5. `UI_UX.md` — experiencia visual.
6. `BACKLOG.md` — sprints, dependencias, DoD.
7. `CODEX_INSTRUCTIONS.md` — esta gobernanza.
8. `AGENTS.md` del usuario cuando esté presente en el repositorio; sus 18 secciones siguen siendo los estándares técnicos generales. Si hay contradicción, obedecer instrucciones de mayor prioridad y elevar decisión material.

## 2. Preflight obligatorio ANTES de cambios
- Confirmar carpeta del repo, branch activa, `git status`, cambios no comprometidos.
- Revisar último PR pertinente y distinguir abierto/fusionado/no verificable; verificar qué llegó realmente a main.
- Detectar framework, versiones, package manager/lockfile, scripts efectivos, políticas existentes y configuración de despliegue.
- Comparar estado real con backlog. **No asumir repo vacío ni sobrescribir archivos preexistentes.**
- Verificar versiones vigentes de Next.js/React/Tailwind/Supabase, compatibilidad de `output: 'export'` y disponibilidad de planes Free, sin cambiar stack aprobado sin consentimiento.
- Si no hay acceso a GitHub, indicar estado de PR no verificable.

## 3. Antes de cada sprint: presentación obligatoria al propietario
Entregar en chat esta ficha y **esperar aprobación explícita**:
1. Nombre/objetivo y alcance exacto del sprint.
2. Estado último PR/main, branch y cambios locales.
3. Lista de archivos/rutas/áreas que se prevén crear o modificar (estimada).
4. Dependencias y riesgos.
5. Diferencias frente al plan maestro y justificación; cambios materiales requieren aceptación separada.
6. Historias y criterios de aceptación trazables.
7. Pruebas a ejecutar y evidencia esperada.
8. Guía breve de revisión manual para el usuario.
No tratar "apruebo plan maestro" como "apruebo sprint".

## 4. Orden de implementación tras aprobar cada sprint
1. Inspección dirigida y validación del alcance.
2. Cambios verticales mínimos y cohesivos conforme a `BACKLOG.md`.
3. Validación de permisos, contratos y estados de UI.
4. Tests relevantes + lint + typecheck + build + inspección visual cuando disponible.
5. Corregir fallos propios sin debilitar tests.
6. Revisar `git diff`, secretos, scope y documentación.
7. Comunicar resumen final y guía de PR; **esperar revisión/aprobación**.
8. No comenzar sprint siguiente sin confirmar estado de PR y nueva autorización.

## 5. Reglas técnicas innegociables
- Next.js estático en Cloudflare Pages para MVP, Supabase Auth/PostgreSQL/Storage/Edge Function; no API Routes Next ni SSR/Server Actions como dependencia de ejecución de la exportación estática.
- Proyecto en TypeScript strict; módulo por feature; formularios Zod; no deps excesivas.
- GitHub elegido manualmente, no auto-sync; ideas privadas/públicas bajo condiciones exactas de `DATABASE.md`.
- No crear usuarios admin desde signup público ni poner `service_role` o Turnstile secret en frontend; RLS + GRANTS y verificación de servidor.
- Mensajes por Edge Function con Turnstile validado en servidor, antifraude/abuso proporcional; sin INSERT anónimo directo sobre tabla de mensajes.
- Reducir carga 3D, fallback estático, accesibilidad WCAG objetivo 2.2 AA.
- No usar material Warhammer 40K protegido ni copiar logos/imágenes sin licencia.
- Los datos demostrativos se etiquetan claramente como tales y no se anuncian como experiencia profesional real.
- No prometer SEO SSR de páginas individuales mientras permanezca `output:'export'`.
- Costo US$0 sujeto a cuotas; no crear servicios de pago sin permiso.

## 6. Estándar de pruebas
- Unitarias: validación formularios, visibilidad, URLs, estado de publicación.
- Integración: repositorio Supabase, CRUD, estados de contacto, Storage.
- Seguridad: tests de RLS/grants anon, authenticated no-admin y admin; políticas Storage; contacto sin token, token inválido, spam, payload inválido.
- E2E: navegación, GitHub, login/logout, publicación/despublicación, ideas privadas, contacto, lectura inbox, responsive.
- Estática/visual: eslint, tsc, build exportado, screenshots/navegador cuando accesible, teclado, reduced motion.
- Rendimiento: medición con condiciones explícitas, no afirmar que cumple sin medir.
- Clasificar **ejecutadas / fallidas / no disponibles / omitidas justificadamente**.

## 7. Git, ramas y Pull Requests
- Ramas por sprint/feature: p.ej. `feat/sprint-01-foundation`, base verificada. Adaptarse al estándar real del repo.
- Commits claros, limitados al sprint; no push a ramas protegidas ni operaciones destructivas.
- **Antes de crear o actualizar PR**, enumerar alcance, diff de archivos, cambios respecto a plan, pruebas y guía de revisión; si se requiere una acción externa, solicitar autorización pertinente.
- **NUNCA auto-merge**, no aprobar PR en nombre del dueño, no asumir que PR fusionado equivale a funcionalidad verificada.
- Al iniciar un nuevo sprint revisar el último PR, estado de integración y comportamiento efectivamente presente.
- Nunca desplegar producción sin autorización explícita separada.

## 8. Formato de entrega tras sprint
```text
Sprint: X — [objetivo]
Estado: completado/parcial/bloqueado
Rama y último PR: [verificados / no verificables]
Cambios: [archivos y módulos]
Comportamiento implementado: [resumen]
Pruebas: [comando -> resultado; no disponibles]
Revisión visual: [evidencia, tamaños, límites]
Seguridad/RLS: [evidencia]
Diferencias frente al plan: [ninguna / detalle y aprobación]
Riesgos o pendientes: [detalle]
Guía del usuario para revisar: [pasos]
Acciones pendientes de autorización: [PR / merge / deploy / sprint siguiente]
```

## 9. Condiciones para escalaciones
Pedir decisión al propietario cuando afecte a coste, hosting, autenticación, visibilidad de datos, permisos, modo SSR, inclusión de funcionalidades fuera de MVP, cambios de arquitectura o acciones destructivas. Si la información de perfil, WhatsApp o GitHub falta, mantener configuración vacía/placeholder expresamente etiquetado; nunca inventar datos personales.

## 10. Primera respuesta que debe dar Codex al recibir este paquete
Reconocer que **no hay permiso de programar**, validar documentos con repo si existe y presentar propuesta concreta de Sprint 1 con archivos estimados, pruebas y guía de revisión. Finalizar solicitando autorización expresa **solo para Sprint 1**. No ejecutar hasta obtenerla.
