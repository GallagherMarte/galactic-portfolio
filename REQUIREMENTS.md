# GALACTIC PORTFOLIO — REQUIREMENTS

**Fuente:** plan maestro v1.1 aprobado el 2026-11-13. **Estado:** especificación para revisar; no autoriza programar.

## 1. Personas y roles
- **ANON (visitante):** leer contenido publicado, abrir enlaces externos, enviar contacto bajo protección antispam.
- **ADMIN (propietario autenticado):** todas las funciones de contenido, configuración y lectura/gestión de mensajes. No existe alta pública de admin; se asigna mediante procedimiento controlado en Supabase.
- La UI no determina los permisos: el backend/DB debe verificarlos.

## 2. Requisitos funcionales y criterios de aceptación

| ID | Prioridad | Requisito | Criterio de aceptación mínimo |
|---|---|---|---|
| RF-01 | P0 | Inicio galáctico | Hero, presentación y accesos a proyectos, sobre mí y contacto; no bloquea navegación. |
| RF-02 | P0 | Proyectos públicos | Listar solo `published`; vacío/carga/error previstos. |
| RF-03 | P0 | Detalle | `/proyectos/ver?slug=...`; detalle público, tecnologías, imágenes, enlaces; slug inexistente -> estado no encontrado. |
| RF-04 | P1 | Filtros | Filtrar por categoría y tecnología; limpiar filtros; estados vacíos. |
| RF-05 | P0 | GitHub/demos | URLs externas verificadas/sanitizadas; botón GitHub solo si existe URL; ninguna sincronización automática. |
| RF-06 | P0 | Perfil profesional | Bio, habilidades/contactos configurables, sin datos inventados. |
| RF-07 | P0 | Formulario contacto | Nombre/email/mensaje con Zod en cliente y servidor; Edge Function, antispam, mensajes en DB, feedback. |
| RF-08 | P0 | WhatsApp | Abrir `https://wa.me/<numero>` con mensaje predefinido y número configurable; sin mostrar número si no configurado. |
| RF-09 | P1 | Ideas públicas | Solo `is_public=true` y `status` permitido; borradores privados excluidos incluso por id/slug. |
| RF-10 | P0 | Responsive | 360 px, tablet y desktop, teclado, foco, movimiento reducido. |
| RF-11 | P0 | Login/logout admin | Auth Supabase; sesión persistente segura; login incorrecto sin revelar detalles; admin verificado. |
| RF-12 | P0 | CRUD proyectos | Crear, validar, editar, archivar, publicar y ordenar; no publicación involuntaria. |
| RF-13 | P0 | Imágenes | Upload seguro, límites de formato/tamaño, texto alternativo y orden; prevenir huérfanos. |
| RF-14 | P0 | Ideas | Crear privada, editar, publicar/ocultar; conservar vinculación al proyecto si se convierte. |
| RF-15 | P0 | Mensajes | Solo admin ve y marca mensajes como nuevos/leídos/archivados; sin acceso público. |
| RF-16 | P1 | Tecnologías/categorías | Selección y administración restringidas; slugs únicos. |
| RF-17 | P1 | Configuración | Editar título, bio, enlaces, WhatsApp, email público y texto principal. |
| RF-18 | P1 | Destacados | Marcar y ordenar proyectos destacados sin redeploy. |

**Estados:**
- Proyecto: `draft`, `published`, `archived`.
- Idea: `draft`, `in_progress`, `converted`, `archived`; `is_public` controla visibilidad y solo `in_progress` o `converted` (o un borrador expresamente publicado si se añade regla futura aprobada) puede mostrarse. Para MVP, usar **`is_public=true AND status IN ('in_progress','converted')`**.
- Mensaje: `new`, `read`, `archived`.

## 3. Historias de usuario (comprobables)
- **HU-01** Visitante: entender presentación profesional; acepta portada visible y CTA funcional.
- **HU-02** Visitante: usar sitio desde móvil o con movimiento reducido; acepta escena alternativa.
- **HU-03** Visitante: encontrar perfil/redes; acepta enlaces sin destinos inventados.
- **HU-04** Visitante: filtrar proyectos; acepta resultados correctos y botón limpiar.
- **HU-05** Visitante: entrar a GitHub seleccionado; acepta URL pública del proyecto correcto.
- **HU-06** Visitante: explorar ideas públicas; acepta exclusión de ideas privadas.
- **HU-07** Admin: iniciar sesión protegido; acepta rechazo de anónimos/usuarios no administradores.
- **HU-08** Admin: publicar un proyecto sin cambios de código; acepta actualización pública tras escribir DB.
- **HU-09** Admin: registrar ideas privadas y publicarlas selectivamente; acepta RLS efectiva.
- **HU-10** Visitante: enviar consulta; acepta validación cliente/servidor y persistencia o error explícito.
- **HU-11** Visitante: abrir WhatsApp; acepta enlace operativo si número está configurado.
- **HU-12** Admin: leer y clasificar mensajes; acepta lectura exclusiva y actualización de estado.

## 4. Requisitos no funcionales
- **NFR-01 Seguridad:** OWASP Top 10/ASVS relevantes, RLS deny-by-default; validación de URLs y subida de archivos; rate limiting/antispam.
- **NFR-02 Accesibilidad:** objetivo WCAG 2.2 AA, semántica, foco visible, labels, navegación por teclado, alternativa a efectos.
- **NFR-03 Rendimiento:** objetivos móviles LCP <=2.5 s, INP <=200 ms, CLS <=0.1; presupuesto de carga de medios medido.
- **NFR-04 SEO:** title/description/OG/sitemap/robots para rutas estáticas; limitación documentada de SEO individual en exportación estática.
- **NFR-05 Observabilidad:** errores sin datos sensibles, métricas mínimas y auditoría relevante admin.
- **NFR-06 Fiabilidad:** migraciones versionadas, exportación de backups y recuperación documentada.
- **NFR-07 Calidad:** TypeScript strict, lint, build, unitarias, integración, E2E, tests RLS y responsive; no afirmar resultados sin ejecución.
- **NFR-08 Costo:** US$0/mes objetivo con Free; no realizar contrataciones ni upgrades sin aprobación.
- **NFR-09 Compatibilidad:** navegadores modernos; mobile-first; sin dependencias de servidor Node permanente.
- **NFR-10 Privacidad:** aviso de finalidad, minimización de datos, retención configurable y eliminación controlada de mensajes.

## 5. Flujos de aceptación principales
### Publicar proyecto
1. Admin autenticado crea borrador con título, slug, descripción y tecnologías.
2. Opcional: agrega imágenes, URL GitHub y demo; sistema valida formatos/URLs.
3. Publica; la lista pública muestra el proyecto actualizado sin rebuild.
4. Revierte a borrador; lectura pública deja de devolver el registro, incluso desde URL previa.
5. Anónimo nunca puede mutar proyecto ni obtener su estado borrador.

### Idea privada → pública
1. Admin registra idea con `is_public=false`, `status=draft`; no aparece públicamente.
2. Admin la mueve a `in_progress`, cambia `is_public=true`; aparece.
3. Admin la vuelve privada; deja de ser accesible a anónimos aun con slug conocido.

### Contacto
1. Usuario completa nombre, email y mensaje; acepta aviso necesario.
2. UI obtiene token Turnstile; Edge Function valida token server-to-server, campos, límites y longitud.
3. Mensaje válido se almacena con privilegios mínimos; UI muestra éxito sin filtrar detalles.
4. Entrada inválida/spam devuelve error consistente; no inserta mensajes.
5. Solo admin accede a bandeja y cambia estados.

## 6. Fuera de alcance explícito
Notificación automática por email, envío de WhatsApp por API, live chat, pagos, usuarios públicos, roles de editor, IA generativa, blog completo, auto-import GitHub, SSR y backoffice multiusuario.

## 7. Pendientes de contenido (no bloquear arquitectura)
Marca y nombre comercial; perfil GitHub; WhatsApp; bio; imágenes con derechos; links de demos; política de retención de mensajes; idioma adicional (MVP español solamente). Requieren configuración antes de lanzamiento, no invención.
