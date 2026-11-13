# GALACTIC PORTFOLIO — UI/UX DESIGN SYSTEM & SCREENS

**Dirección aprobada:** galáctico cinematográfico original, no reproducción de Warhammer 40K.

## 1. Principios de experiencia
La estética debe reforzar el perfil profesional, no ocultar el contenido. Visitantes deben identificar en segundos quién desarrolla el software, qué proyectos existen y cómo acceder a GitHub/WhatsApp/contacto. El panel prioriza legibilidad y eficiencia sobre teatralidad.

## 2. Tokens propuestos (ajustables por contraste en prototipos)
- `space-950`: `#090D19` fondo.
- `space-900`: `#101725` superficie administrativa.
- `nebula-600`: `#713CBA` acentos y CTA.
- `holo-400`: `#29C8E5` acentos informativos.
- `imperial-400`: `#C49A51` acentos limitados.
- `text-primary`: `#F7F8FF`; `text-secondary`: `#B6C4D8`.
- Tipografía: sans legible para cuerpo, display temática limitada a títulos. Verificar licencias y legibilidad.
- Escala de espaciado: base 4/8 px; radios y bordes moderados, no saturar con glassmorphism ni glow.
- Estados: hover/focus/active/loading/disabled/error/success/empty; contraste medido, no asumido.

## 3. Mapa de pantallas
### Público
- `/`: hero cinematográfico, nombre/especialización, CTA "Explorar proyectos"/"Contactar", proyectos destacados, resumen sobre mí.
- `/proyectos`: buscador/filtros por tecnología y categoría, tarjetas (imagen, nombre, resumen, stack, enlaces), paginación si aplica.
- `/proyectos/ver?slug=`: galería, contexto, objetivos, tecnologías, explicación, estado, botón GitHub y demo opcional, CTA contacto. Un `slug` ausente/no publicado muestra 404/estado no encontrado sin revelar contenido.
- `/ideas`: ideas visibles con estado; enlaces a detalle si se decide mantener detalle en una ruta estática `/ideas/ver?slug=`.
- `/sobre-mi`: bio, capacidades, habilidades, CV si propietario lo añade legalmente, enlaces sociales.
- `/contacto`: formulario, enlace WhatsApp, confirmación y privacidad.
### Administración
- `/admin/login`: formulario de autenticación sin filtración de existencia de usuarios.
- `/admin`: atajos y contadores de proyectos/ideas/mensajes, sin métricas falsas.
- `/admin/proyectos`: tabla con estado, destacado, búsqueda, editar/archivar/publicar.
- `/admin/proyectos/nuevo` y `/admin/proyectos/editar?id=`: formulario y subida/orden de imágenes.
- `/admin/ideas`: listado/edición; control explícito de privacidad y estado, vista previa pública.
- `/admin/mensajes`: inbox con filtros, lectura, marcar leído/archivado.
- `/admin/configuracion`: bio, nombre sitio, links, WhatsApp, correo, imagen inicial.

## 4. Arquitectura de componentes
`SiteHeader`, `MobileNav`, `HeroSpaceScene`, `ReducedMotionFallback`, `PrimaryCTA`, `ProjectCard`, `ProjectFilters`, `ProjectDetail`, `TechnologyChip`, `IdeaCard`, `ContactForm`, `WhatsAppLink`, `AdminShell`, `DataTable`, `StatusBadge`, `ConfirmDialog`, `MediaUploader`, `EmptyState`, `ErrorState`, `Toast/StatusMessage`.
No crear un "design system" masivo antes de necesitar variantes reales.

## 5. Comportamientos clave
- Hero: una escena espacial limitada, carga diferida; imagen estática de respaldo; no bloquear LCP con WebGL.
- Con `prefers-reduced-motion: reduce`: evitar parallax/zoom/rotaciones y dar alternativa estática equivalente.
- Si no hay `WebGL`, se muestra portada estática, idénticos CTA.
- GitHub/demos/WhatsApp: enlaces reales, sin botones muertos ni enlaces ficticios; enlaces externos con atributos seguros (`rel="noopener noreferrer"`).
- Formularios: label real, feedback específico, foco al primer error, confirmación de envío sin detalles internos.
- Admin: confirmar publicaciones, archivados y eliminación física; cambios de borrador no deben autopublicarse.
- Idea: control visible `Privada/Pública`, pero publicar solo si estado permite regla vigente.
- Contadores del panel proceden de datos; si no hay datos muestran cero, no cifras de ejemplo.

## 6. Accesibilidad y responsive
- Mobile-first a 360 px, tablet ~768 px, desktop ~1280 px; validar con viewport real, no solo CSS.
- Objetivo WCAG 2.2 AA: contraste, foco visible, labels, alt, landmarks, encabezados en orden, tabs/menus usables por teclado, tamaño de targets y mensajes accesibles.
- Tamaños de tipografía y ancho de párrafo cómodos; no colocar texto esencial sobre planetas sin capa de contraste.
- No sonido automático, scroll-jacking, animaciones obligatorias ni interacciones exclusivamente mediante hover.

## 7. SEO y contenidos
- Metadatos para páginas estáticas: título, descripción, Open Graph, favicon y canonical; sitemap para rutas estáticas.
- Contenido dinámico leído del cliente puede limitar indexación por buscadores. **No prometer SEO per-project completo con exportación estática**; documentar compromiso y considerar Workers en evolución.
- Idioma MVP español; copy configurable por admin en las áreas previstas.

## 8. Validación visual obligatoria por Codex (tras aprobación de sprint)
- Capturas o revisión navegador de inicio, proyectos, detalle, login, CRUD, contacto y mensajes según alcance.
- Comprobar responsive a 360/768/1280 px, teclado y modo movimiento reducido.
- Medir LCP/INP/CLS cuando el entorno permita pruebas representativas; registrar condiciones y limitaciones.
- Corregir desbordamiento, contraste, fallos de interacción y contenido superpuesto antes de aceptar sprint.

## 9. Referencias visuales y copyright
Inspiración conceptual en ciencia ficción gótica/espacial, sin usar personajes, insignias, logos, texto narrativo, modelos 3D o ilustraciones protegidas de Warhammer 40K. Usar assets originales o autorizados y registrar su licencia.
