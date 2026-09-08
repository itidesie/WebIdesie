# CLAUDE.md — Memoria del proyecto `web_idesie`

> **Regla de uso (para Claude):** lee este archivo **antes** de empezar cualquier
> trabajo en este proyecto, y **actualízalo al terminar** si el cambio afecta a
> algo que aquí se documenta: página nueva, botón conectado, dependencia nueva,
> patrón de diseño nuevo, variable de entorno, o cambio en el estado de la
> migración. Este archivo es la memoria entre sesiones.

**Stack:** Next.js 16.2 (App Router, Turbopack) · React 19 · TypeScript ·
Tailwind CSS v4 · shadcn/ui (Radix) · pnpm
**Última actualización:** 2026-09-07 (50)

---

## 0. Avisos que condicionan cualquier trabajo

### 🗑️ `/landing` borrada por completo (2026-09-07) — no busques esta página, ya no existe

Petición explícita del cliente, en la misma sesión que había construido y
rediseñado `/landing` varias veces seguidas ese mismo día (adopción
estructural de una referencia de diseño externa, pasada de fidelidad
visual, y una tercera pasada con contenido adicional confirmado por el
cliente — todo ese trabajo queda documentado más abajo tal cual se hizo,
como registro histórico, aunque la página ya no exista).

**Borrado**: `app/landing/` completo (`page.tsx`, `landing-client.tsx`,
`landing-content.ts`), `components/landing/` completo (14 componentes),
`lib/landing-modality.ts`, la regla `Disallow: /landing` de
`app/robots.txt`. La ruta responde `404` — verificado.

**Conservado, movido fuera de `components/landing/`**: `meta-pixel.tsx` →
`components/meta-pixel.tsx` — decisión explícita del cliente, porque
`components/admision-modal.tsx` (compartido por las 4 páginas de máster
reales) importa `trackMetaPixelEvent()` de ahí. Sin `/landing`, ninguna
página monta hoy `<MetaPixel/>`, así que esas llamadas son un no-op seguro
— si se retoma tráfico de campañas de pago en otra página, basta con
montar `<MetaPixel/>` ahí. `NEXT_PUBLIC_META_PIXEL_ID` se deja tal cual en
`.env.local`/`env.example`, sin tocar.

**No tocado, huérfano pero no borrado** (fuera del alcance de "borra la
página" — son infraestructura de backend, no la página en sí, y borrar una
tabla real de Supabase es una decisión distinta y mayor que no se pidió):
`/api/leads`, `/api/leads/disponibilidad`, `lib/leads-db.ts`,
`lib/leads-time-slots.ts`, la tabla `leads` en Supabase, y
`emails/lead-confirmation.tsx`. Sin ningún consumidor real hoy — quedan
disponibles por si se recupera un flujo de captación de leads en otra
página, o se borran en una sesión futura si se decide expresamente.

**Recuperación**: los archivos que ya estaban comprometidos en git antes de
esta sesión (`page.tsx`, y las versiones de `landing-client.tsx`/
`landing-content.ts`/componentes anteriores a esta sesión) son recuperables
con `git checkout` sobre su último commit. **Todo el trabajo nuevo hecho
dentro de esta misma sesión (las 3 pasadas de rediseño) nunca se llegó a
comprometer** — se ha perdido de forma permanente, incluido el archivo de
referencia del cliente (`ejemplo de landing sin optimizar.html`, nunca
subido a git).

### 🔴 URGENTE — bug real en producción, pendiente de desplegar (encontrado 2026-09-03)

**No es una tarea de este repositorio local, es un aviso para desplegar cuanto
antes**: la regla de `next.config.mjs` `redirects()` que enviaba
`/producto/:path*` → `/tienda` incondicionalmente **se identificó y se
corrigió en este código hace tiempo** (ver §2 "Corregidos al verificar la
migración con datos reales") — pero **la corrección nunca se desplegó a
producción**. Confirmado con `curl` contra el dominio real el 2026-09-03:

```
curl -sI https://www.idesie.com/producto/master-bim-full-time
→ 308 Permanent Redirect → https://www.idesie.com/tienda
```

**Efecto real, ahora mismo, para cualquier visitante**: ninguna ficha de
producto es accesible en producción — ni por URL directa ni haciendo clic
en "Ver más" desde el listado de la tienda (el clic también cae en el mismo
redirect). Cualquiera que intente ver el detalle de un máster para comprarlo
rebota a la home de la tienda sin explicación. Descubierto al intentar
migrar el catálogo real (ver §1, "Migración del catálogo real") — es un
hallazgo colateral de esa tarea, no el objetivo, pero es más urgente que
ella: bloquea ventas reales hoy.

**Acción pendiente, fuera del alcance de lo que se puede hacer desde aquí**:
desplegar a producción la versión ya corregida de `next.config.mjs` (y, ya
que se despliega, el resto del trabajo de esta sesión — header reorganizado,
rediseño de tienda/blog/consultoría, etc., todo sigue solo en local). El
propio dominio en producción corre además una versión visiblemente más
antigua del sitio (cabecera con el antiguo selector ES/EN, sin la
reorganización del header, con marca de agua "Built with [v0]") — confirma
que no ha habido ningún despliegue reciente.

### ✅ Migración a Supabase COMPLETADA (2026-09-03) — Neon retirado por completo
Decidido el 2026-09-01, empezado el 2026-09-02 (leads), terminado el
2026-09-03: **el proyecto ya no usa Neon en absoluto** — ni como servicio
activo, ni como fallback, ni como referencia en el código. Todo el acceso a
datos pasa por `@supabase/supabase-js`. Estado por área:

| Área | Estado |
|---|---|
| Leads (`/api/leads`, formulario de `/landing`) | ✅ Supabase, vía `lib/leads-db.ts` |
| Blog (`app/blog/actions.ts`, `/api/blog/latest`) | ✅ Supabase |
| Autenticación de `/admin` (`/api/admin/auth`) | ✅ Supabase |
| Tienda/productos (`/api/productos`, `/producto/[slug]`, 7 tablas de detalle) | ✅ Supabase |
| Solicitudes de admisión (`lib/applications-db.ts`) | ✅ Supabase |
| Pedidos/checkout (`lib/db-helpers.ts`) | 🗑️ **Borrado** — no tenía ningún consumidor real de **ese archivo** (ni `/checkout` ni `/pago-directo` llamaban a `lib/db-helpers.ts`/Postgres). ⚠️ Eso no significa que `/checkout` y `/pago-directo` no tengan lógica de pago: **sí la tienen**, ya integrada contra Flywire (Pay-by-Link) desde antes de este registro — ver §3 "Flywire — integración de pagos", descubierto el 2026-09-03 (13). Las tablas `orders`/`order_items` siguen creadas en Supabase por si se retoma la persistencia de pedidos |
| `@neondatabase/serverless` | 🗑️ Eliminado de `package.json` |
| `DATABASE_URL` / `POSTGRES_URL` | 🗑️ Eliminadas de `env.example` — ya no las necesita ningún código. Todo pasa por `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` |
| `lib/sql.ts` | 🗑️ Borrado — su única razón de ser era envolver `neon()` |

**Modo mock, ahora con una sola llave para todo lo anterior**
(`SUPABASE_SERVICE_ROLE_KEY`, ver §3) — antes `DATABASE_URL` y `POSTGRES_URL`
permitían mock parcial (blog configurado pero tienda no, por ejemplo); con
Supabase un solo proyecto cubre todo, así que una sola credencial decide si
se simula o no. Decisión explícita del cliente, no algo que se perdiera sin
querer.

**Detalle completo del esquema, RLS y cada archivo migrado** en §3 "Supabase
— esquema, RLS y datos (estado final)".

### ✅ Base de datos real conectada y verificada (2026-09-03)
El proyecto ya no corre solo contra datos mock: `.env.local` tiene la
`DATABASE_URL` real (contraseña de Postgres del proyecto) además de las
claves de API, y con ella se ejecutaron `scripts/020` a `023` contra el
proyecto real de Supabase — las 15 tablas existen, con RLS activo y
exactamente las 9 policies de solo lectura pública esperadas (`blog_posts`,
`productos` y las 6 tablas de detalle; el resto — `leads`, `admin_users`,
`applications`, `orders`, `order_items`, `coupons` — sin ninguna policy,
acceso exclusivo `service_role`, tal como se diseñó). Detalle completo en §3.

**Probado con datos reales de extremo a extremo** (fila de prueba insertada,
verificada por HTTP y borrada acto seguido en cada caso — no queda ningún
dato de prueba en las tablas): lead real vía `/api/leads` (el mismo endpoint
que usa el formulario de `/landing`), ficha de producto real en
`/producto/[slug]`, listado/detalle/tag de un post real de blog, login y
dashboard reales de `/admin`. Ver el detalle de qué se probó y qué bugs
salieron a la luz al hacerlo en §3.

### ⚠️ Nota de sesión (2026-09-03) — credenciales reales aparecidas sin intervención directa; rotación pospuesta a propósito
A media sesión anterior, con el proyecto todavía en modo mock, apareció un
`.env.local` con **credenciales reales de Supabase** (URL + anon key +
service_role key) que nadie pegó en el chat — la sesión anterior las había
recibido como placeholders sin rellenar. Lo más probable es aprovisionamiento
automático de la plataforma al detectar los nombres de variable en el
código, no una acción de ningún participante de la conversación.

🔴 Durante el diagnóstico de aquella sesión, un `grep` mostró **los valores
reales de las tres claves en la salida de una herramienta** — no se
imprimieron de nuevo a propósito una vez detectado, pero quedaron visibles
una vez en el transcript.

**Rotación de claves (anon + service_role): pospuesta a propósito por el
cliente, no olvidada.** Pasos entregados en la sesión del 2026-09-03 (2) —
hace falta entrar al panel de Supabase, no es algo que se pueda automatizar
desde aquí. Decisión explícita (2026-09-03 (5)): esperar a cerrar por
completo el trabajo de base de datos pendiente (insertar los productos
reales, verificar los slugs de compra — ver §2 — y cualquier otro ajuste en
Supabase) **antes** de rotar, para no generar credenciales nuevas a mitad
de un trabajo que todavía usa las actuales activamente. **No tratar esto
como una tarea olvidada ni insistir en completarla hasta que el trabajo de
base de datos esté cerrado.** `DATABASE_URL` (la contraseña de Postgres)
**no formaba parte de la exposición original** y no hace falta rotarla por
este motivo. Cuando las claves nuevas estén en `.env.local`, no debería
hacer falta tocar código: el
código solo lee las variables de entorno, nunca un valor hardcodeado.

### Si vuelves a ver un build roto por una conexión a nivel de módulo
El 2026-09-02 `next build` falló dos veces seguidas (Neon primero, Resend
después) porque siete archivos invocaban un cliente lazy-singleton
(`getSql()`, `getProductsSql()`, `getResend()`) **a nivel de módulo**, fuera
de cualquier función — eso se ejecuta al importar el archivo, no al recibir
una petición, y `next build` fuerza `NODE_ENV=production` donde el modo mock
no cubre la ausencia de credenciales. Arreglo aplicado en los siete: en vez
de `const sql = getSql()`, un wrapper como
`const sql: ReturnType<typeof getSql> = (...args) => getSql()(...args)` — el
identificador se sigue usando igual en el resto del archivo, pero la
conexión real no se crea hasta la primera petición de verdad. `lib/sql.ts`
ya no existe, pero **el mismo patrón aplica a `getSupabaseServerClient()`**:
nunca lo invoques a nivel de módulo en un archivo nuevo, siempre dentro de la
función que atiende la petición.

---

## 1. Mapa del sitio

### Páginas públicas
| Ruta | Qué hace |
|---|---|
| `/` | Home. Hero, programas destacados, metodología LBW, blog reciente |
| `/mbim-page` | **Máster BIM (MBIM)** presencial, 16 meses. Programa insignia. **Rediseñada como "recorrido de 7 movimientos"** (ver §5). Server Component; contenido en `mbim-content.ts` |
| `/mbim-online-page` | Máster BIM en modalidad online. **Rediseño propio "La Red"** (ver §5) — NO usa los 7 movimientos compartidos |
| `/mbbe-page` | MBBE — Máster BIM + Building Engineering, 16 meses, especialización MEP. **Usa los 7 movimientos** (ver §5). Contenido en `mbbe-content.ts` |
| `/embim-page` | EMBIM — Executive Máster BIM, 12 meses, formato ejecutivo de fin de semana. **Usa los 7 movimientos** (ver §5). Contenido en `embim-content.ts` |
| `/comparativa-masters-page` | Tabla comparativa entre los cuatro másteres |
| ~~`/landing`~~ | 🗑️ **Borrada por completo (2026-09-07)**, a petición explícita del cliente — ver §0. Todo el historial de esta tabla y del resto del documento sobre `/landing` describe una página que ya no existe |
| `/short-courses-page` | Catálogo de cursos cortos |
| `/in-company-page` | Formación a medida para empresas. **Rediseño propio "El Plano"** (ver §5) |
| `/bim-consulting-page` | Servicio de consultoría BIM. **Rediseño propio "El Expediente"** (ver §5) — deliberadamente NO comparte lenguaje visual con las páginas de máster |
| `/empresas-page` | Landing para empresas / colaboración |
| `/sobre-idesie-page` | Quiénes somos. **Rediseño propio "La Trayectoria"** (ver §5) — 2026-09-03 (24). ⚠️ La entrada anterior de este archivo decía que ya estaba "rediseñada con criterio menos-es-más", pero el código real no lo reflejaba (`#006cff` hardcodeado, tarjetas con icono genéricas, cero animación) — discrepancia detectada y corregida en la auditoría de (24), no repitas ese error de registro |
| `/nuestra-metodologia-page` | Metodología *Learning by Working* |
| `/profesores-page` | Claustro |
| `/alianzas-page` | Alianzas académicas. **Rediseño propio "El Convenio"** (ver §5) — 2026-09-03 (25) |
| `/alumni-page` | Alumnos y casos de éxito. **Rediseño propio "El Legado"** (ver §5) — 2026-09-03 (25) |
| `/opiniones-page` | Testimonios. **Rediseño propio "El Archivo de Voces"** (ver §5) — 2026-09-03 (25) |
| `/financiacion-y-becas-page` | Financiación, becas, ISA |
| `/bolsa-de-empleo-page` | Bolsa de empleo. **Rediseño propio "El Tablón"** (ver §5), datos reales desde `ofertas_empleo` vía `getPublicOfertas()`, candidatura vía `JobApplicationModal` → `ofertas_empleo`/`candidaturas_empleo` en Supabase (ver §3) |
| `/contact-page` | Contacto. **Dos pestañas:** mensaje y Calendly. Acepta `?motivo=` y `?programa=` |
| `/tienda` | Listado de productos |
| `/producto/[slug]` | Ficha de producto (dinámica, desde BD) |
| `/checkout` | Carrito → pago |
| `/pago-directo` | Pago directo sin carrito |
| `/blog` · `/blog/[year]/[month]/[day]/[slug]` · `/blog/tag/[tag]` | Blog |
| `/politica-cookies-page` · `/politica-privacidad-page` · `/aviso-legal-page` · `/solicitud-baja-page` | Legales |

### Páginas protegidas (requieren autenticación)
Todas bajo `/admin/*` (salvo `/admin/login`) están protegidas por
`middleware.ts` desde 2026-09-03 (6) — ver §4. Las de blog conservan además
su `checkAdminAuth()` propio como red redundante; las de tienda no lo
llaman, el middleware ya basta.
| Ruta | Protección |
|---|---|
| `/admin/login` | Pública (es el propio login) |
| `/admin/dashboard` | `middleware.ts` + `checkAdminAuth()` |
| `/admin/posts`, `/admin/posts/new`, `/admin/posts/edit/[slug]` | `middleware.ts` + `checkAdminAuth()` |
| `/admin/tienda`, `/admin/tienda/nuevo`, `/admin/tienda/[slug]/editar` | `middleware.ts` únicamente |
| `/admin/empleo`, `/admin/empleo/nueva`, `/admin/empleo/[id]/editar`, `/admin/empleo/candidaturas` | `middleware.ts` únicamente — mismo patrón que tienda |
| `/admin/admisiones` | `middleware.ts` únicamente — solo lectura + cambio de estado, sin crear/editar (las solicitudes solo llegan desde el sitio público, nunca se dan de alta a mano) |

### Rutas API
`/api/admin/auth` · `/api/blog/latest` · `/api/productos` ·
`/api/send-catalog` (persiste en `descargas_catalogo` antes de intentar el
email, ver §7 "(47)") · `/api/empleo/candidatura` · `/api/admision`
(pública, valida todo en servidor) · `/api/contact` (pública, valida todo
en servidor — sustituye al `<form>` sin `onSubmit` que tenía
`/contact-page`, ver §5 "Auditoría y rediseño de formularios")

🗑️ **`/api/coupons/validate` eliminado (2026-09-04 (41))** — ver §4 "Fase 1
(crítico)".

🗑️ **`/api/blog/upload-image`, `/api/productos/upload-image`,
`/api/empleo/upload-cv`, `/api/admision/upload-cv` eliminados por completo
(2026-09-05 (48))** — encargo explícito del cliente de retirar toda
subida de archivos (`BLOB_READ_WRITE_TOKEN`) del sitio. Ver §7 "(48)" para
el detalle completo: qué sustituye a cada uno (campo de URL de texto en
blog/tienda, CV directamente eliminado del formulario de bolsa de empleo,
sin sustituto), y qué código muerto se limpió de paso.

🗑️ **`/api/send-job-inquiry` eliminado (2026-09-03 (21))** — sustituido por
`/api/empleo/candidatura`, ver §3 "Bolsa de Empleo".

🗑️ **`/application`, `/application/thank-you` y `/api/application`
eliminados por completo (2026-09-04 (44))** — el formulario de admisión
antiguo se retira sin sustituir nada más: ya coexistía con el flujo nuevo
(`AdmisionModal` → `/api/admision` → `solicitudes_admision`) desde (38), y
el cliente decidió no unificarlos, retirar el antiguo directamente. Tabla
`applications` (vacía, confirmada antes de borrar) también eliminada — ver
§7 "(44)" para el detalle completo.

⚠️ **`app/admision/actions.tsx` — hallazgo, no relacionado con esta pieza,
código muerto sin tocar (2026-09-04 (38)):** al construir el nuevo flujo de
admisión se encontró un archivo preexistente (fechado 2 sept., anterior al
inicio de esta sesión, nunca documentado en ningún `CLAUDE.md`) con una
Server Action `submitAdmissionForm()` — envía 2 emails por Resend, sin
persistencia en Supabase, **sin ningún consumidor en todo el proyecto**
(verificado por grep exhaustivo: ni un componente ni una página la importa).
Un tercer intento de "solicitud de admisión" que nunca llegó a conectarse a
nada. Causó una colisión de nombres real con el `app/admision/actions.ts`
nuevo de esta pieza (mismo directorio, mismo nombre base, distinta
extensión) que rompía `next build` — resuelto renombrando el archivo nuevo a
`app/admision/solicitudes-actions.ts`, **sin tocar ni borrar el archivo
muerto preexistente** (no es una decisión que se pueda tomar sin
preguntar). Pendiente: confirmar con el cliente si se borra
`app/admision/actions.tsx` en otra sesión.

### ⚠️ `BreadcrumbNavigation` — huérfano desde 2026-09-02, no borrado
El breadcrumb ("Inicio > Programas > [Máster]") se retiró de las **18 páginas**
que lo usaban, a petición explícita del cliente. `components/breadcrumb-navigation.tsx`
**sigue en el proyecto pero ya no lo importa nada**. Se dejó así a propósito, no
lo borres sin preguntar — decisión pendiente entre borrarlo del todo o
conservarlo por si vuelve a hacer falta. Detalle completo en §5.

### Redirecciones SEO
`next.config.mjs` → `redirects()` mantiene ~20 URLs antiguas apuntando a las
nuevas. **Si renombras una ruta, añade su redirect ahí.**

### 🚧 Panel de administración — ampliación en curso (2026-09-03 (6)+)

Encargo del cliente: el panel de `/admin` pasa de gestionar solo el blog a
gestionar también la tienda (productos + las 7 tablas de detalle). Antes de
construir nada se hizo una auditoría de qué ya existía — resultado completo
abajo — y se aprobó una estructura y un orden de construcción. **Este
apartado es el tracker de progreso: actualízalo al terminar cada pieza para
que cualquier sesión futura sepa exactamente por dónde se quedó.**

**Auditoría (2026-09-03 (6)) — qué había antes de tocar nada:**
- `/admin` solo tenía blog: `dashboard`, `posts`, `posts/new`,
  `posts/edit/[slug]`. Cero rutas ni componentes de tienda/productos.
- El CRUD de blog (`createBlogPost`/`updateBlogPost`/`deleteBlogPost` en
  `app/blog/actions.ts`) ya estaba completo y reutilizable, pero con dos
  bugs reales encontrados en la propia auditoría — ambos corregidos en (6),
  detalle en §4 "Puntos a vigilar": `verifySecretKey()` seguía en texto
  plano tras la migración a bcrypt, y `blog-posts-table.tsx` llamaba a
  `deleteBlogPost` con argumentos posicionales en vez de `FormData`.
- CRUD de `productos` y sus 7 tablas de detalle: **cero**. Ninguna
  operación de escritura en todo el proyecto — solo lectura (`/tienda`,
  `/producto/[slug]`, `/api/productos`, el sitemap).
- Protección de `/admin`: manual, página por página, sin `middleware.ts`.
  Corregido también en (6) — ver §4.
- Las 6 de las 7 tablas de detalle (`producto_dirigido`, `producto_objetivos`,
  `producto_faqs`, `producto_requisitos`, `producto_testimonios`, y
  `producto_modulos` a nivel superior) comparten la misma forma:
  `producto_id`, 1-3 campos de texto, `orden`. Solo `producto_modulos` tiene
  un nivel extra (`modulo_temas` anidado). Por eso el plan usa un único
  componente genérico de "lista editable con orden" para 5 tablas, más un
  editor con anidación para módulos+temas — no 7 UIs distintas.

**Estructura aprobada:**
```
/admin/dashboard          — ampliar con resumen de tienda
/admin/blog (hoy /admin/posts) — reutilizado tal cual
/admin/tienda             — nuevo: listado de productos
  /admin/tienda/nuevo     — nuevo: crear producto (campos base)
  /admin/tienda/[slug]/editar — nuevo: producto base + pestañas para las 7 tablas de detalle
/api/productos/upload-image — nuevo, calco de /api/blog/upload-image
```

**Decisiones de la propuesta:**
- Formularios de producto con `react-hook-form` + `zod` (ya instalados, sin
  usar hasta ahora — el blog usa `useState` a mano). El componente `form.tsx`
  de shadcn está pensado exactamente para esto.
- Sin librerías de UI nuevas: shadcn/ui ya instalado (`table`, `dialog`,
  `sheet`, `tabs`, `select`, `switch`, `alert-dialog`, `pagination`,
  `sidebar`...) cubre todo lo necesario. `@tanstack/react-table` queda como
  opción futura solo si el catálogo crece mucho — hoy se replica el patrón
  simple de `blog-posts-table.tsx`.
- Orden de construcción: **tienda antes que blog** (el blog ya está hecho al
  90 %), y dentro de tienda: producto base → módulos → resto de tablas →
  testimonios al final (hoy ninguna ficha real tiene testimonios).
- El cliente revisa cada pieza grande en el navegador antes de aprobar la
  siguiente — no se construye todo de una vez.

**Progreso:**
| Pieza | Estado |
|---|---|
| Auditoría + estructura aprobada | ✅ (2026-09-03 (6)) |
| `verifySecretKey()` a bcrypt + fix de `deleteBlogPost` | ✅ (2026-09-03 (6)) — ver §4 |
| `middleware.ts` protegiendo `/admin/*` | ✅ (2026-09-03 (6)) — ver §4 |
| CRUD de producto base (`/admin/tienda`, listado, crear, editar) | ✅ (2026-09-03 (7)) — revisado y aprobado en el navegador |
| Editor de módulos + temas anidados | ✅ (2026-09-03 (18)) — ver detalle abajo |
| Editor genérico de lista con orden (dirigido/objetivos/FAQs/requisitos/testimonios) | ✅ (2026-09-03 (19)) — ver detalle abajo |
| Contenido real de MBIM/MBBE/EMBIM cargado (módulos+temas, requisitos, FAQs) | ✅ (2026-09-03 (19)) — ver detalle abajo |

### Editor de módulos + temas anidados — detalle (2026-09-03 (18))

Primer editor de las 7 tablas de detalle, y el único con anidación (un
módulo tiene varios temas) — construido antes que el editor genérico de
lista a petición explícita del cliente, para validar el patrón más
complejo primero.

**Archivos nuevos:**
- `app/tienda/modulos-actions.ts` — Server Actions independientes del resto
  de tienda: `getModulosConTemas` (lee `producto_modulos` con sus
  `modulo_temas` anidados en una sola consulta vía *nested embedding* de
  PostgREST, ambos niveles ordenados por `orden`), `saveModulo`/`deleteModulo`/
  `reorderModulo` y sus tres equivalentes `*Tema`. Reordenar es un
  intercambio de `orden` con el vecino inmediato (`swapOrden()`, compartida
  por módulos y temas) — no hace falta reescribir toda la lista, solo dos
  filas. Misma verificación de clave que el resto de tienda
  (`verifyAdminSecret`, nunca reimplementada).
- `components/tienda/modulos-editor.tsx` — cada módulo es una tarjeta con
  título/descripción editables y sus temas anidados debajo, con
  subir/bajar/guardar/eliminar en ambos niveles. Sin `react-hook-form`: al
  ser una lista dinámica (se añaden y quitan filas), cada campo es un input
  controlado directamente sobre el estado local, y cada fila se guarda por
  separado, no el formulario entero a la vez. Tras cada Server Action exitosa
  se vuelve a pedir la lista completa (`getModulosConTemas`) en vez de mutar
  el estado local a mano, para que el `orden` mostrado sea siempre el real.
- `components/tienda/detalle-tabs.tsx` — envoltorio con una única "Clave
  secreta" para toda la sección de contenido de detalle (no tiene sentido
  pedirla de nuevo al cambiar de pestaña dentro del mismo producto) y un
  `Tabs` de shadcn con la pestaña "Módulos" — las pestañas de las 5 tablas
  restantes se añaden aquí mismo cuando se construya el editor genérico.
- `app/admin/tienda/[slug]/editar/page.tsx`: ahora también llama a
  `getModulosConTemas(producto.id)` y renderiza `<DetalleTabs>` debajo de
  `<ProductoForm>`. Solo en la página de edición — un producto nuevo no
  tiene `id` todavía, así que el contenido de detalle solo tiene sentido
  una vez creado el producto base.

**Verificado con Chrome real** contra el producto real `master-bim-full-time`
(no un producto de prueba descartable — el cliente pidió explícitamente ver
el editor funcionando con un caso real del MBIM antes de replicar el
patrón): login con credencial temporal de admin (`migracion-editores-temp`,
borrada al terminar de todo el trabajo de esta sesión), añadido un primer
módulo de demostración con su tema, guardado correctamente (confirmado por
`psql` contra la tabla real) y visible en `/producto/master-bim-full-time`
sin recargar manualmente (Server Action + `revalidatePath`). Ese módulo de
demostración se corrigió después para que coincidiera exactamente con el
contenido real del módulo 01 del MBIM (ver siguiente entrada) — el objetivo
de esta primera prueba era validar que el patrón de guardado/anidación
funcionaba, no el contenido en sí.

**Verificado:** `npx tsc --noEmit` en 2 errores preexistentes (sin cambios).

### Editor genérico de lista con orden — detalle (2026-09-03 (19))

Segunda y última pieza de los editores de detalle: un único componente para
las 5 tablas que comparten la misma forma (`producto_id`, 1-3 campos de
texto, `orden`) — `producto_dirigido`, `producto_objetivos`,
`producto_requisitos`, `producto_faqs`, `producto_testimonios`. La
configuración de campos por tabla vive en un solo sitio para que ninguna de
las 5 necesite su propio componente.

**Archivos nuevos:**
- `lib/producto-detalle-config.ts` — un objeto `LISTAS_DETALLE` (sin
  `"use server"`, para poder exportar algo más que funciones async) que
  declara, por cada una de las 5 tablas, su nombre real, su etiqueta y sus
  campos (`key`, `label`, `tipo` input/textarea, `requerido`). Único lugar
  donde vive esta configuración — ni el componente ni las Server Actions la
  duplican.
- `app/tienda/detalle-actions.ts` — Server Actions genéricas
  (`getListaItems`, `saveListaItem`, `deleteListaItem`, `reorderListaItem`)
  que reciben el nombre de tabla como parámetro y lo validan contra un
  allowlist (`isTablaDetalleValida()`) antes de tocar Supabase — necesario
  porque el nombre de tabla llega desde un `FormData` que un cliente podría
  falsificar; sin esa validación, cualquier string llegaría intacto a
  `.from(tabla)`. Mismo patrón de reordenar por intercambio de `orden` que
  `modulos-actions.ts`.
- `components/tienda/lista-editor.tsx` — un único componente que renderiza
  los campos de cada fila según la configuración de la tabla que le pasen
  (`config: ListaConfig`), sin necesidad de 5 variantes.
- `components/tienda/detalle-tabs.tsx` ampliado: ahora itera
  `LISTAS_DETALLE` para generar las 5 pestañas restantes automáticamente
  (antes solo tenía "Módulos" a mano). Añadir una sexta tabla en el futuro
  solo requeriría una entrada nueva en `lib/producto-detalle-config.ts`, no
  tocar este componente.
- `app/admin/tienda/[slug]/editar/page.tsx`: pide en paralelo
  (`Promise.all`) los módulos y las 5 listas para el producto que se está
  editando.

**Verificado con Chrome real**, en el mismo flujo que el editor de módulos:
añadidos y guardados elementos reales en las pestañas Requisitos y FAQs del
producto real `master-bim-full-time`, confirmados por `psql` y visibles en
`/producto/master-bim-full-time`.

**Verificado:** `npx tsc --noEmit` en 2 errores preexistentes (sin cambios).

### Contenido real de MBIM/MBBE/EMBIM cargado a través de los editores (2026-09-03 (19))

Con los dos editores construidos y probados, se cargó el contenido real ya
extraído de `mbim-content.ts`, `mbbe-content.ts` y `embim-content.ts` — **a
través de la UI real de `/admin/tienda`, nunca por SQL directo**, tal como
se acordó explícitamente. Cada módulo, tema, requisito y FAQ se escribió
tecleándolo en el formulario real y pulsando el botón de guardar real, para
que el ciclo completo (Server Action → Supabase → `revalidatePath` →
página pública) quedara ejercitado con datos reales, no solo con las
pruebas puntuales de los pasos anteriores.

**Contenido cargado, verificado por consulta directa tras terminar:**

| Producto | Módulos | Temas | Requisitos | FAQs |
|---|---|---|---|---|
| `master-bim-full-time` (MBIM) | 9 | 22 | 6 | 9 |
| `master-bim-building-engineering` (MBBE) | 5 | 28 | 6 | 9 |
| `executive-master-bim` (EMBIM) | 10 | 56 | 6 | 9 |

Los recuentos de módulos y temas coinciden exactamente con los arrays
`modulos` de cada `*-content.ts` (incluidos los módulos sin temas de la
fase de "Ejecución" del MBIM, y el mapeo `subtitle → descripcion del
módulo` / `items → temas` usado en los tres). El campo `text` de cada
módulo (una frase de introducción antes de la lista de items) no se guardó
en ningún sitio — la tabla `producto_modulos` solo tiene `titulo` y
`descripcion`, y `subtitle` ya cubre ese hueco sin inventar contenido
nuevo.

**Deliberadamente sin contenido de detalle, tal como se acordó:**
`master-bim-online`, `titulo-profesional-cualificam` y `curso-revit-gratis`
— sus 7 tablas de detalle se quedan vacías hasta que haya contenido real
para ellas. Tampoco se cargó nada en `producto_dirigido`,
`producto_objetivos` ni `producto_testimonios` para ningún producto: los
tres archivos de contenido de origen no tienen datos para esas tablas (se
comprobó explícitamente antes de empezar, buscando `dirigido`/`objetivos`
en los tres ficheros) — dejar esas pestañas vacías es más correcto que
inventar contenido para rellenarlas.

**Verificado con Chrome real:** `/producto/executive-master-bim` renderiza
los 10 módulos reales con sus temas bajo "Módulos del programa", y el
precio nulo del EMBIM sigue mostrando correctamente "Precio no disponible,
contactar" en la barra lateral (confirma que el trabajo de (17) no se vio
afectado por este cambio).

**Verificado:** `npx tsc --noEmit` en 2 errores preexistentes (sin
cambios), `npx next build` exit 0. Credencial temporal de admin
(`migracion-editores-temp`) borrada de `admin_users` al terminar todo el
trabajo de contenido — no queda ningún dato de prueba salvo el contenido
real cargado a propósito.

**Con esto se cierra el encargo de los editores de detalle y la carga de
contenido real de los tres másteres presenciales/ejecutivo.** Pendiente,
fuera de este encargo: cargar contenido real de dirigido/objetivos/
testimonios cuando exista, y el contenido de detalle de los otros 3
productos cuando el cliente lo proporcione.

### CRUD de producto base — detalle (2026-09-03 (7))

Primera pieza grande de la ampliación de `/admin` a tienda. Solo cubre los
campos propios de `productos` (nombre, slug, tipo, precio, duración,
modalidad, certificación, imagen, destacado, activo) — **las 7 tablas de
detalle no tienen editor todavía**, son las siguientes piezas.

**Archivos nuevos:**
- `app/tienda/actions.ts` — Server Actions (`getAdminProductos`,
  `getAdminProductoBySlug`, `createProducto`, `updateProducto`,
  `deleteProducto`), mismo patrón que `app/blog/actions.ts`. La verificación
  de clave usa `verifyAdminSecret` de `lib/admin-secret.ts` — nunca
  reimplementada aquí, ver §4.
- `components/producto-form.tsx` — formulario con `react-hook-form` + `zod`
  (primer uso real de ambos en el proyecto; el blog usa `useState` a mano).
  Reutiliza `RichTextEditor` para la descripción larga y las clases CSS
  `admin-*` ya existentes para mantener el mismo aspecto que el editor de
  blog.
- `components/productos-table.tsx` — listado con búsqueda/filtro, mismo
  patrón que `blog-posts-table.tsx`.
- `app/admin/tienda/page.tsx`, `app/admin/tienda/nuevo/page.tsx`,
  `app/admin/tienda/[slug]/editar/page.tsx` — **ninguna llama a
  `checkAdminAuth()`**, a propósito: `middleware.ts` ya las protege.
- `app/api/productos/upload-image/route.ts` — calco de
  `/api/blog/upload-image`, mismo `isAdminAuthenticated()`.
- `AdminHeader` y `/admin/dashboard` ampliados con enlace y stats de tienda.

**2 bugs reales encontrados y corregidos durante la propia verificación en
navegador** (no en el código que se reutilizó, en el código nuevo de esta
pieza):
1. `z.union([z.coerce.number().min(0), z.literal("")])` para los campos
   numéricos opcionales (`precioOriginal`, `duracionMeses`, `duracionHoras`)
   no funciona: Zod prueba las ramas en orden, y `Number("")` es `0`, que
   pasa `.min(0)` — la unión se resolvía ahí y un campo vacío se guardaba
   como `0` en vez de `null`. Arreglado invirtiendo el orden
   (`z.union([z.literal(""), schema])`): solo si el valor no es exactamente
   `""` se intenta la coerción numérica.
2. Consecuencia visible del bug anterior: `components/productos-table.tsx`
   mostraba **"01234€"** en vez de "1234€" — el clásico problema de React
   `{0 && <span>...</span>}`, que renderiza el `0` literal en vez de nada
   (a diferencia de `null`/`undefined`/`false`, que no pintan nada). Corregido
   con `Boolean(producto.precio_original) && ...` en vez de la comprobación
   truthy directa sobre un número que puede ser `0`.

Ambos se detectaron creando un producto de prueba real en el navegador,
dejando el campo "Precio original" vacío — exactamente el caso de uso más
común (un producto sin descuento) — y viendo el "0" espurio en la tabla y
habría aparecido también en `/producto/[slug]` de haber tenido descuento.
Verificado el ciclo completo (crear → editar → ver en `/producto/[slug]` →
borrar) con Chrome real; fila de prueba borrada al terminar.

⚠️ **Encontrado pero NO corregido, fuera de esta pieza**: el mismo patrón
`precio_original && ...` (sin `Boolean()`) existe también en
`components/product-grid.tsx` y `app/producto/[slug]/page.tsx` (código del
storefront público, previo a esta sesión). Es inofensivo mientras
`precio_original` sea `null` para "sin descuento" (que es lo que ahora
garantiza el formulario) — solo se manifestaría si alguien introdujera
explícitamente `0` como precio original. No se tocó por no ser parte del
encargo de hoy; queda anotado para una pasada futura si se toca esa página.

**Verificado:** `pnpm build` exit 0, `npx tsc --noEmit` sin subir de 4
errores preexistentes, ciclo CRUD completo probado con Chrome real (no solo
`curl`, que no puede invocar Server Actions).

### 🚧 Rediseño de tienda y blog — en curso (2026-09-03 (8)+)

Encargo del cliente: `/tienda`, `/producto/[slug]`, el listado del blog y el
artículo individual se ven genéricos y poco funcionales — mismo nivel de
cuidado que ya se aplicó a las páginas de máster, pero sin copiar su
identidad literal. Auditoría completa hecha antes de tocar nada (misma
disciplina que "Sobre IDESIE" y el M4 del MBBE), direcciones de diseño
propuestas y aprobadas. **Este apartado es el tracker de progreso.**

**Hallazgos de la auditoría, más allá de lo estético:**
- `/tienda` **no tenía ningún encabezado ni `<main>` no por descuido de
  marcado, sino porque toda la página era un Client Component que arrancaba
  con un spinner** (`useEffect` + `fetch("/api/productos")`) — el HTML
  inicial no tenía contenido real en absoluto, lo que también explica el LCP
  alto que salió en Lighthouse. Corregido en (8): ver más abajo.
- `ProductoTabs` (`components/producto-tabs.tsx`) renderiza las 7 secciones
  de la ficha (`{activeTab === 'x' && (...)}`) — **6 de cada 7 nunca se
  montan en el DOM** salvo la pestaña activa. FAQs, requisitos, objetivos y
  testimonios son invisibles para quien no hace clic en cada pestaña, y para
  cualquier rastreador que no simule esos clics. **Resuelto en (9)** — ver
  más abajo.
- Lógica de precio de matrícula hardcodeada por slug
  (`slug === "master-bim-full-time" || ...`, con un importe fijo de 3.000 €
  en el código) — **corregida en (8)**, ver más abajo.
- Categorías del filtro de tienda (BIM/Programación/Energía) inferidas
  buscando substrings en el nombre del producto, duplicado en dos archivos
  — **corregido en (9)**, ver más abajo.
- Campos que la UI espera pero que las tablas reales nunca tienen —
  `testimonio.foto`/`empresa`/`valoracion`, `modulo.duracion`, y además
  `producto_dirigido`/`producto_objetivos` aliasaban la misma columna a la
  vez como `titulo` y `descripcion` (mismo texto mostrado dos veces), y
  `producto_requisitos.tipo` era una constante inventada
  (`'previos'`) — **corregido en (9)**, ver más abajo.
- Botón "Editar Artículo" expuesto a cualquier visitante público del
  artículo del blog, y botón "Administración" expuesto en el listado
  público — **corregidos en (8)**, ver más abajo.
- Enlace roto `/contacto` (real: `/contact-page`) y un `console.log` de
  depuración en la generación de URLs del blog — **corregidos en (8)**.
- 0 posts relacionados, 0 navegación anterior/siguiente en el artículo del
  blog — pendiente, lo resuelve la Dirección A del blog al construirse.

**Direcciones aprobadas:**
- **Tienda — "El Catálogo Técnico"**: Roboto Mono para datos (duración,
  modalidad, precio, certificación), panel de filtro explícito (no badges
  sueltas), ficha de producto en una sola página con scroll y navegación por
  anclas laterales en vez de tabs, precio/CTA en barra fija durante el
  scroll.
- **Blog — "Cuaderno de Bitácora Técnico"**: serif con carácter para
  titulares (a elegir al construir, no genérica tipo Georgia), Roboto Mono
  para fecha/autor/etiquetas, post más reciente destacado en el listado en
  vez de grid uniforme, mini-índice lateral en artículos largos, sección
  real de "Artículos relacionados" por etiquetas compartidas resuelta en el
  servidor.

**Progreso:**
| Pieza | Estado |
|---|---|
| Auditoría + 2 direcciones por sección, aprobadas | ✅ (2026-09-03 (8)) |
| Seguridad: botón "Editar Artículo" gateado a `isAdminAuthenticated()` | ✅ (2026-09-03 (8)) |
| Seguridad: botón "Administración" quitado del listado público del blog | ✅ (2026-09-03 (8)) |
| Campo `precio_matricula` real (sustituye el hack de 4 slugs hardcodeados) | ✅ (2026-09-03 (8)) — ver detalle abajo |
| `/tienda` convertida a Server Component (sin spinner, `<h1>`/`<main>` reales) | ✅ (2026-09-03 (8)) |
| Bugs menores: enlace `/contacto` roto, `console.log` de depuración | ✅ (2026-09-03 (8)) |
| Rediseño visual de tienda (Dirección A — "El Catálogo Técnico") | ✅ (2026-09-03 (9)) — revisado y aprobado en el navegador |
| Rediseño visual de blog (Dirección A — "Cuaderno de Bitácora Técnico") | ✅ (2026-09-03 (10)) — revisado y aprobado en el navegador |

**Con esto, el encargo completo de rediseño de tienda y blog está cerrado.**
Detalle de la pieza del blog justo debajo de la sección de tienda.

### Precio de matrícula — campo real (2026-09-03 (8))

`app/producto/[slug]/page.tsx` decidía si ofrecer la opción de "matrícula"
(pago fraccionado) comparando el slug contra una lista de 4 valores
hardcodeados (`master-bim-full-time`, `master-bim-online`,
`master-bim-building-engineering`, `executive-master-bim`), con un importe
fijo de **3.000 € escrito en el código**, sin relación con ningún dato de la
base de datos ni gestionable desde `/admin/tienda`.

- Nueva columna `productos.precio_matricula numeric(10,2) null`
  (`scripts/024_add_precio_matricula.sql`, ejecutado contra el proyecto
  real). `NULL` = el producto no ofrece esta opción.
- `app/tienda/actions.ts`, `components/producto-form.tsx`: campo añadido al
  tipo `Producto`, al esquema zod, al formulario (con su propio texto de
  ayuda) y a los payloads de `createProducto`/`updateProducto`.
- `app/producto/[slug]/page.tsx`: la condición pasa de comparar 4 slugs a
  comprobar `product.precio_matricula` — cualquier producto puede tener esta
  opción con solo rellenar el campo, sin tocar código.
- Migración de los 4 productos legado incluida en el mismo script
  (`UPDATE ... WHERE slug IN (...)`) — **inerte hoy** porque `productos`
  sigue vacía; se aplicará sola en cuanto existan filas con esos slugs
  exactos. ⚠️ Los slugs del formulario nuevo se autogeneran del nombre y
  pueden no coincidir — si al crear estos 4 másteres reales el slug
  generado es distinto, hay que rellenar `precio_matricula` a mano, la
  migración no lo hará por ellos.
- Verificado con Chrome real: producto de prueba con `precio_matricula=3000`
  → la ficha pública muestra "Máster completo" y "Reserva tu plaza - 3000€"
  correctamente, ambos importes leídos del campo real. Fila de prueba
  borrada al terminar.

### `/tienda` — Server Component (2026-09-03 (8))

`app/tienda/tienda-client.tsx` pasa de pedir los productos con
`useEffect` + `fetch("/api/productos")` (mostrando un spinner mientras
tanto) a recibirlos ya resueltos como prop desde `app/tienda/page.tsx`
(ahora `async`, llama a la nueva `getPublicProductos()` de
`app/tienda/actions.ts`). Añadido un `<main>` alrededor del contenido —
antes no existía ninguno. `app/api/productos/route.ts` se reescribe para
llamar a esa misma función en vez de duplicar la consulta.

De paso, las interfaces `Product` duplicadas en `tienda-client.tsx` y
`components/product-grid.tsx` se sustituyen por `import type { Producto }
from "@/app/tienda/actions"` — antes divergían del tipo real (`modalidad`
como `string` no nullable, sin `precio_matricula`), lo que habría dado
errores de tipos en cuanto se les pasaran datos reales.

**Verificado:** `curl` contra el HTML servido confirma `<h1>` real, `<main>`
presente, cero rastro del spinner (`animate-spin` / "Cargando productos") en
la respuesta inicial. `pnpm build` exit 0, `npx tsc --noEmit` en 2 errores
preexistentes (bajó de 4: dos de los cuatro eran del propio
`tienda-client.tsx`, corregidos de paso al arreglar el tipo `Producto`).

### Blog — 2 exposiciones públicas corregidas (2026-09-03 (8))

- `app/blog/[year]/[month]/[day]/[slug]/page.tsx`: el botón "Editar
  Artículo" (enlazaba a `/admin/posts/edit/[slug]`) se veía en cada artículo
  público, sin ninguna comprobación de sesión. Ahora se gatea con
  `await isAdminAuthenticated()` — solo aparece si hay una cookie de admin
  válida. Esto convierte la ruta en dinámica (antes usaba
  `generateStaticParams` y se servía como SSG): `cookies()` la hace
  depender de la petición, no se puede pre-renderizar en build. Es el
  comportamiento correcto, no una regresión.
- `app/blog/page.tsx`: quitada por completo la sección "Admin Access"
  (botón "Administracion" enlazando a `/admin/login`) del listado público —
  no aportaba nada a un visitante normal y anunciaba la ubicación del login.
- De paso, en el mismo archivo: enlace roto `/contacto` → `/contact-page`
  (`/contacto` no es ninguna ruta real del sitio), y quitado un
  `console.log("[v0] Generating URL for post:", ...)` que se ejecutaba en
  cada render del servidor.
- **Verificado con Chrome real** (necesario porque el gateo depende de una
  cookie de sesión, no visible con curl sin cabeceras): sin sesión, el botón
  "Editar Artículo" no aparece en el HTML; con sesión de admin real, sí
  aparece. Botón "Administración" y enlace `/contacto` confirmados ausentes
  del listado con `curl`.

### Tienda — rediseño visual completo, "El Catálogo Técnico" (2026-09-03 (9))

Cuarto vocabulario visual propio del sitio (`.catalogo-*` en `globals.css`,
junto a `.journey-*`, `.online-*` y `.blueprint-*`) — a diferencia de esos
tres, no es narrativo: la tienda deja comparar y elegir, no "vivir una
experiencia". Roboto Mono para todo dato objetivo, en la misma posición en
cada tarjeta, como una etiqueta nutricional.

**Listado (`/tienda`) — archivos nuevos en `components/tienda/`:**
- `producto-card.tsx` — ficha comparable: cada fila de dato (duración,
  modalidad, certificación) tiene una altura mínima fija y un guion cuando
  falta el valor, para que dos tarjetas queden alineadas entre sí como una
  tabla, no solo como cards independientes.
- `filtro-panel.tsx` — panel de filtro persistente y explícito (antes eran
  badges sueltas que flotaban entre secciones).
- `catalogo-grid.tsx` — orquesta el filtro de Tipo y el nuevo filtro de
  Categoría, sustituye por completo a `components/product-grid.tsx`
  (borrado) y a la función `getProductCategoria()` duplicada que inferís
  categorías buscando substrings en el nombre.
- `app/tienda/tienda-client.tsx` reescrito: hero simplificado (sin cifras
  de marketing sin verificar), sin la sección de "Programas Destacados"
  duplicada ni los 3 testimonios genéricos con estrellas — decisión de
  diseño alineada con la Dirección A ("más funcional, no una experiencia"),
  no un cambio de contenido de producto.

**Categoría real (sustituye el filtro por substring):**
- Nueva columna `productos.categoria text null`
  (`scripts/025_add_categoria.sql`, ejecutado contra el proyecto real).
- `app/tienda/actions.ts`, `components/producto-form.tsx`: campo añadido al
  tipo `Producto`, al formulario (`Select` con `CATEGORIAS = ["BIM",
  "Programación", "Energía"]` + "Sin categoría"), a los payloads de
  create/update.
- El filtro del catálogo ahora compara `producto.categoria === valor` en
  vez de buscar texto en el nombre — un producto sin ese campo relleno
  simplemente no aparece en ningún filtro de categoría salvo "Todas", en
  vez de aparecer o no según coincidencias de texto imprevisibles.

**Ficha de producto (`/producto/[slug]`) — sin tabs, una sola página:**
- Nuevo `components/producto/`: `ficha-content.tsx` (todas las secciones
  siempre montadas — Descripción, Programa, Perfil, Objetivos, Requisitos,
  Testimonios, FAQ, cada una solo si tiene datos), `anchor-nav.tsx`
  (navegación lateral con `IntersectionObserver` para resaltar la sección
  activa), `ficha-sidebar.tsx` (precio + CTA + `AnchorNav`, todo dentro de
  un único `<aside>` con `position: sticky`).
- `components/producto-tabs.tsx` **borrado** — sustituido por completo.
- `app/producto/[slug]/page.tsx`: las funciones `getDirigidoA`,
  `getObjetivos` y `getRequisitos` se simplifican a listas planas de texto
  (`string[]`) en vez de objetos con `titulo`/`descripcion` duplicando la
  misma columna, o un `tipo` inventado que siempre valía `'previos'`. Hero
  reducido a identidad + foto; precio, CTA y specs técnicas se mueven a la
  barra lateral, que ahora es la única fuente de esos datos en la página.
- 🔴 **Bug encontrado y corregido en la propia verificación**: la barra
  lateral (`.catalogo-sticky-cta`) no se quedaba fija de verdad — el grid
  estiraba el `<aside>` a la altura completa de la columna de contenido
  (varios miles de px en una ficha larga), y `position: sticky` no tiene
  margen para "flotar" dentro de una caja que ya mide lo mismo que todo el
  scroll. Arreglado añadiendo `align-self: start` tanto en la clase CSS
  como en el componente — verificado hacienda scroll con Chrome real hasta
  la sección de Testimonios y comprobando que el precio y el nav lateral
  seguían visibles, pegados justo debajo del header.

**Verificado con Chrome real, con un producto de prueba completo (7 tablas
de detalle rellenas) creado y borrado en la sesión:** filtro de tipo y de
categoría funcionando sobre el campo real; tarjetas alineadas entre sí;
descuento y matrícula mostrados correctamente; ficha con las 7 secciones
todas visibles sin clics, nav lateral resaltando la sección activa al
hacer scroll, barra de precio fija confirmada tras el fix. Fila de
producto y las 11 filas de detalle asociadas se borraron en cascada al
eliminar el producto (`on delete cascade`, scripts/023) — no quedó ningún
dato de prueba.

**Verificado:** `pnpm build` exit 0, `npx tsc --noEmit` en 2 errores
preexistentes (sin cambios).

### Blog — rediseño visual completo, "Cuaderno de Bitácora Técnico" (2026-09-03 (10))

Quinto vocabulario visual propio (`.bitacora-*` en `globals.css`). Giro
editorial: nueva fuente **Fraunces** (serif con eje óptico, cargada en
`app/layout.tsx` como `--font-fraunces`, **solo se usa en el blog**) para
titulares, Roboto Mono para fecha/autor/etiquetas — la misma voz técnica
que ya usan tienda y páginas de programa, aplicada a metadatos en vez de a
toda la tipografía.

**Listado (`app/blog/page.tsx`) reescrito:**
- Cabecera compacta (eyebrow + h1 serif + intro corta) en vez del hero de
  pantalla completa con imagen de fondo.
- El post más reciente se destaca a tamaño grande (imagen + serif +
  extracto); el resto vive en una lista compacta (`.bitacora-list-item`,
  fecha en una columna, título+extracto en otra) — no un grid uniforme
  donde todos los posts pesan igual.

**Artículo (`app/blog/[year]/[month]/[day]/[slug]/page.tsx`) — 2 piezas
nuevas que antes no existían en absoluto:**
- **Mini-índice lateral**: `lib/extract-toc.ts` (`addHeadingIds()`) añade un
  `id` a cada `<h2>`/`<h3>` del HTML ya sanitizado (nunca antes, no acepta
  ningún atributo controlado por el usuario) y devuelve la lista para el
  índice. `components/blog/article-toc.tsx` la muestra en una barra lateral
  fija con `IntersectionObserver` resaltando la sección visible — mismo
  patrón que `AnchorNav` de la ficha de producto. Si el artículo tiene
  menos de 2 encabezados, no se muestra ninguna barra y el artículo ocupa
  una sola columna centrada (verificado con un post corto de prueba).
- **Artículos relacionados**: nueva `getRelatedPosts()` en
  `app/blog/actions.ts` — puntúa todos los posts por número de etiquetas
  compartidas con el actual (reutiliza `getBlogPosts()`, sin consulta SQL
  aparte, mismo criterio que ya justifica `getAllTags()` en el propio
  archivo) y devuelve los 3 primeros. Se muestra al final del artículo.

🔴 **Bug de formato de fecha encontrado y corregido, no introducido por
esta pieza pero descubierto al construirla**: `getBlogPosts()` devuelve
`created_at` en ISO (`2026-09-03T01:23:27.473Z`) a diferencia de
`getBlogPostBySlug`/`getBlogPostsByTag`, que ya lo formatean a español —
inconsistencia que ya existía (el código anterior también imprimía el ISO
crudo en el listado, solo que con un grid genérico donde se notaba menos).
**No se cambió el contrato de `getBlogPosts()`** porque el sitemap y la
propia `getRelatedPosts()` necesitan ese ISO para aritmética de fechas —
se añadió un `formatDate()` local en `app/blog/page.tsx` y en la página de
artículo (para las fechas de "Artículos relacionados"), que formatean solo
en la presentación.

**Verificado con Chrome real**, con 3 posts de prueba (uno largo con 4
encabezados para probar el índice y el anidado h2/h3, uno corto sin
encabezados para probar el fallback a una columna, y un tercero para
probar relacionados por etiqueta compartida) creados y borrados en la
sesión — sin tocar el post real del cliente (`holapio`) que ya existía en
la tabla. Confirmado: índice con la subsección anidada correctamente,
resaltado de sección activa al hacer scroll, fallback a una columna sin
índice en el post corto, 2 relacionados mostrados por tag compartida
("BIM"), fechas en español en todos los sitios.

**Verificado:** `pnpm build` exit 0, `npx tsc --noEmit` en 2 errores
preexistentes (sin cambios).

### Migración del catálogo real de productos (2026-09-03 (17))

Encargo del cliente: migrar el catálogo real desde la tienda pública en
producción (`idesie.com`) a la tabla `productos` de Supabase, **usando el
formulario real de `/admin/tienda/nuevo`** (no SQL a mano), para verificar
de paso que el CRUD funciona con datos reales.

#### 🔴 Hallazgo previo, más urgente que la propia migración
Al intentar entrar a la ficha individual de cualquier producto en
producción (`https://www.idesie.com/producto/...`), tanto por URL directa
como haciendo clic en "Ver más" desde el listado, **todas las rutas
devuelven 308 → `/tienda`**. Es el mismo redirect `/producto/:path*` →
`/tienda` que este proyecto ya identificó y corrigió hace tiempo en local
(ver §2 "Corregidos al verificar la migración con datos reales") — **la
corrección nunca se desplegó**. Marcado como 🔴 urgente en §0, sección
aparte de esta migración: bloquea la compra de cualquier máster en
producción ahora mismo, no es solo un obstáculo para este encargo.

**Consecuencia práctica**: no se pudo extraer contenido de ninguna ficha
individual real (los datos de las 7 secciones de detalle). Se migraron los
datos básicos confirmables desde el listado público (`/tienda`, que sí
funciona), y para MBIM/MBBE/EMBIM se completó parte del detalle reutilizando
el contenido ya verificado en sesiones anteriores (`mbim-content.ts`,
`mbbe-content.ts`, `embim-content.ts`) — ver el apartado "7 secciones de
detalle" más abajo.

#### Los 6 productos reales, creados vía el formulario real de admin
Verificado uno por uno con Chrome real: login con una fila temporal en
`admin_users` (creada y borrada en la sesión, nunca se tocó la fila `admin`
real), formulario de `/admin/tienda/nuevo` relleno campo a campo, guardado,
y confirmado tanto en la tabla de admin como en `/tienda` pública.

| Slug (confirmado real) | Nombre | Precio | Duración | Categoría |
|---|---|---|---|---|
| `master-bim-full-time` | Master BIM Full Time | 15.000 € | 16 meses | BIM |
| `master-bim-building-engineering` | Master BIM & Building Engineering | 15.000 € | 16 meses | BIM |
| `executive-master-bim` | Executive Master BIM | **sin precio** (ver abajo) | 12 meses | BIM |
| `master-bim-online` | Master BIM Online | 4.500 € | 12 meses | BIM |
| `titulo-profesional-cualificam` | Título Profesional CUALIFICAM | 262,50 € | — | sin categoría |
| `curso-revit-gratis` | Curso de Revit Gratis - Iniciación | 0 € (gratuito) | 8 horas | Programación |

✅ **Los 3 nombres "Master..." se dejaron sin tilde** ("Master BIM Full
Time", no "Máster..."), fieles a como están publicados de verdad — un
primer intento los escribió con tilde por error y se corrigió editando los
2 ya creados antes de seguir con el resto, usando también el formulario de
edición real (`/admin/tienda/[slug]/editar`).

✅ **Categorías verificadas contra el propio filtro de la tienda real**: la
web en producción mostraba "BIM (4) · Programación (1)" sobre 6 productos
totales (2 sin categoría clara desde el listado). Se asignó BIM a los 4
másteres, Programación al curso de Revit, y "sin categoría" al título
CUALIFICAM — al terminar, `/tienda` en local reprodujo exactamente
"Todas 6 · BIM 4 · Programación 1", confirmando que la inferencia fue
correcta.

⚠️ **`precio_matricula` se dejó vacío en los 4 másteres**, a propósito: el
importe de 3.000 € que `scripts/024_add_precio_matricula.sql` dejó
preparado para estos slugs viene de un hack de código antiguo, nunca
verificado como cifra real (ver §1 "Precio de matrícula — campo real"). No
se reutilizó sin confirmación, siguiendo la instrucción explícita de no
inventar datos.

⚠️ **Descripciones cortas y algunos campos de certificación pueden estar
incompletos**: el listado público muestra el texto recortado con "…" (CSS
`line-clamp`, no necesariamente el texto real completo), y sin acceso a la
ficha individual (ver el bug del redirect) no se pudo confirmar el texto
íntegro. Se migró tal cual se veía, sin inventar el resto.

#### ✅ Executive Master BIM — precio "no disponible", implementado
Encargo aparte, aprobado antes de crear los productos: en vez de forzar un
precio numérico o dejarlo en `0` (que ya significa "gratuito", ver el Curso
de Revit), `productos.precio_actual` pasó a ser **nullable**
(`scripts/026_precio_actual_nullable.sql`, antes era `NOT NULL`):
- `app/tienda/actions.ts`: tipo `Producto.precio_actual: number | null`,
  `readProductoFields()` ya no fuerza `Number(...)` sobre un campo vacío.
- `components/producto-form.tsx`: `precioActual` pasa a opcional
  (`optionalNumber()`, el mismo helper ya usado para `precioOriginal`), sin
  el asterisco de obligatorio en el label.
- `components/tienda/producto-card.tsx` y `components/producto/ficha-sidebar.tsx`:
  si `precio_actual` es `null`, muestran **"Precio no disponible,
  contactar"** en vez de `€` o vacío, y el botón "Añadir al carrito" se
  sustituye por un enlace a `/contact-page?motivo=asesoria&programa=<nombre>`
  (reutiliza el patrón `?motivo=` que ya existía en el sitio) — no tiene
  sentido permitir comprar algo sin precio definido.
- `components/productos-table.tsx` (admin): muestra "Sin precio" en ámbar
  en vez de un `€` vacío o `0€`.
- `app/producto/[slug]/page.tsx`: el CTA final ("¿Listo para empezar?")
  tiene el mismo condicional contactar/comprar.

**Verificado con Chrome real, de extremo a extremo**: Executive Master BIM
creado sin precio → `/admin/tienda` lo muestra como "Sin precio" (ámbar) →
`/tienda` pública muestra "Precio no disponible, contactar" en la tarjeta →
`/producto/executive-master-bim` muestra el mismo texto en la barra lateral
con el botón "Contactar para más información" en vez de "Añadir al
carrito".

#### 🚧 Pendiente — 7 secciones de detalle, sin editor en el admin
Al ir a completar el contenido de detalle de MBIM/MBBE/EMBIM (módulos,
dirigido a, objetivos, requisitos, FAQs, testimonios) usando el contenido ya
verificado de `mbim-content.ts`/`mbbe-content.ts`/`embim-content.ts`, se
confirmó que **`/admin/tienda` no tiene ningún formulario para las 7 tablas
de detalle** (`producto_modulos`, `modulo_temas`, `producto_dirigido`,
`producto_objetivos`, `producto_requisitos`, `producto_faqs`,
`producto_testimonios`) — ni Server Actions, ni editor, nada (ver §1
"Panel de administración — ampliación en curso", esas piezas seguían
"⏳ pendiente" desde antes). La única forma de insertar ese contenido hoy
sería SQL directo, lo que **contradice la instrucción explícita del
cliente de usar siempre las Server Actions del admin**.

**No se insertó nada de esto** — ni por SQL ni de ninguna otra forma — a la
espera de que el cliente decida cómo seguir:
1. Construir los editores que faltan (nested módulos+temas, lista genérica
   reutilizable para dirigido/objetivos/requisitos/faqs, editor de
   testimonios) y entonces rellenar el contenido a través de ellos.
2. Autorizar una excepción puntual de SQL directo solo para esta carga
   inicial de contenido ya verificado (MBIM/MBBE/EMBIM), dejando los
   editores para más adelante.
3. Dejarlo así por ahora — los 6 productos ya tienen sus datos básicos
   reales y están publicados; el detalle se completa cuando se retome el
   panel de admin.

Contenido ya extraído y lista para usar en cuanto se decida el camino:
módulos con sus temas (9 para MBIM, 5 para MBBE, 10 para EMBIM),
requisitos (6 cada uno) y FAQs (9, 9 y 9 respectivamente) — **no existe
contenido de "dirigido a", "objetivos" ni "testimonios" en ninguno de los
tres archivos**, tampoco se puede inventar.

**Verificado**: `npx tsc --noEmit` en los mismos 2 errores preexistentes,
`npx next build` exit 0. Fila temporal de `admin_users` borrada al
terminar, tabla `productos` verificada por consulta directa (sin imprimir
ninguna credencial).

---

## 2. Estado de conexiones

### ✅ Resueltos (2026-09-01)
| Qué | Antes | Ahora |
|---|---|---|
| Breadcrumb "Programas" | `href="#"` en **5 páginas** | → `/comparativa-masters-page` |
| "Solicitar asesoría online" | `/asesoria-online` (404) | → `/contact-page?motivo=asesoria&programa=<X>` |
| "Solicitar clase online" | `/solicitar-clase-online` (404) | → `/contact-page?motivo=clase&programa=<X>` |
| Selector idioma ES/EN | 4× `href="#"` en header | **Oculto** (no hay i18n) |
| Enlace "Media" | `href="#"` en header | **Oculto** (no existe la página) |

**Cómo funciona `?motivo=`:** `app/contact-page/contact-client-page.tsx` lee
`motivo` (`asesoria` | `clase`) y `programa` (`MBIM` | `MBBE` | `EMBIM`). Si hay
motivo válido: muestra un banner contextual y **abre directamente la pestaña de
Calendly**, que es el único canal que hoy funciona de punta a punta. También
prerrellena el campo "Asunto" del formulario de mensaje.
Requiere `<Suspense>` en `app/contact-page/page.tsx` (por `useSearchParams`).

Los archivos tocados: `components/header.tsx`, `app/contact-page/page.tsx`,
`app/contact-page/contact-client-page.tsx`, `app/mbim-page/page.tsx`,
`app/mbbe-page/page.tsx`, `app/embim-page/page.tsx`,
`app/mbim-online-page/mbim-online-client.tsx`, `app/short-courses-page/page.tsx`.

### ✅ Slugs de producto — resueltos con la migración real (2026-09-03 (17))
**Ya no están en pausa.** El slug real y activo del MBIM (confirmado
extrayéndolo del propio HTML de la web en producción, ver §1 "Migración del
catálogo real") es **`master-bim-full-time`** — el mismo que ya usaba
`compraLink` en `app/mbim-page/page.tsx:501`. `/producto/master-bim-manager`
(el otro botón, `app/mbim-page/page.tsx:789`) **nunca fue el slug real**, era
el que estaba mal; sigue sin corregir en el código de la página (fuera del
alcance de la migración de catálogo, es una tarea de contenido de
`mbim-page`, no de la tienda). El slug del MBBE
(`master-bim-building-engineering`) también quedó confirmado, igual que
`executive-master-bim` y `master-bim-online`.

### ⏸️ Otros pendientes
| Qué | Estado |
|---|---|
| ~~**Catálogos PDF placeholders**~~ | ✅ **Parcialmente resuelto (2026-09-05)**: `public/catalogs/` ya tiene los catálogos reales de MBIM (`catalogoMBIM.pdf`, 8,1 MB) y MBBE (`catalogo_mbbe_2025.pdf`, 17,8 MB), conectados en (17)/catalog fix. EMBIM y Online siguen con placeholders de ~600 B a propósito — el cliente no ha subido esos dos todavía |
| ~~**Formulario de contacto sin `onSubmit`**~~ | ✅ **Resuelto (2026-09-04 (39))** — ver §5 "Fase 2 — Formulario de contacto: de roto a funcional". Esta fila quedó desactualizada, corregida ahora |
| ~~**Datos contradictorios en el contenido del MBIM**~~ | ✅ **Resuelto** — `/mbim-page` fue rediseñada por completo a los 7 movimientos (2026-09-01): el M6 usa 95 % empleo / 100 % prácticas garantizadas y 11.000 € de ingresos de forma consistente, sin la contradicción de la versión antigua (la cifra de 12.200 € no aparece en ningún sitio del contenido actual). Esta fila también quedó desactualizada |
| 🔴 **`app/mbim-page/page.tsx:789` sigue apuntando a `/producto/master-bim-manager`** | Slug incorrecto, no existe ningún producto con ese slug. Debería ser `master-bim-full-time`, igual que `compraLink`. No corregido — es un cambio de contenido de `mbim-page`, fuera del alcance de la migración de catálogo (ver arriba) |

### ✅ Corregidos al verificar la migración con datos reales (2026-09-03 (2))
Cuatro bugs que no se veían en modo mock porque el mock nunca ejercita una
petición HTTP real a una ruta dinámica ni el flujo completo de cookies. Salieron
a la luz exactamente al hacer lo que pedía este encargo — probar con datos
reales — y se corrigieron porque bloqueaban esa misma verificación:

| Bug | Dónde | Causa |
|---|---|---|
| `/producto/:path*` → `/tienda` incondicional | `next.config.mjs` | El comodín `:path*` (1+ segmentos) atrapaba también la ruta real `/producto/[slug]`. Quitada la regla entera — no hay ningún caso legítimo de URL antigua bajo `/producto/` que necesite redirigir |
| `/blog/:slug+` → `/blog` incondicional | `next.config.mjs` | Mismo fallo: `:slug+` (1+ segmentos) atrapaba `/blog/[year]/[month]/[day]/[slug]` (el post real, 4 segmentos) y `/blog/tag/[tag]` (2 segmentos). Cambiado a `:slug` (exactamente 1 segmento) — `app/blog/[slug]/` es una carpeta vacía (solo `.gitkeep`) heredada de una URL plana anterior al esquema year/month/day, así que un solo segmento sigue cubriendo el caso real sin atrapar las rutas de verdad |
| `params` sin `await` | `app/producto/[slug]/page.tsx`, `app/blog/[year]/[month]/[day]/[slug]/page.tsx`, `app/blog/tag/[tag]/page.tsx`, `app/admin/posts/edit/[slug]/page.tsx` | Next.js 16 exige `params: Promise<...>` + `await params`. Con el tipo síncrono antiguo, `params.slug` llegaba `undefined` en tiempo de ejecución (no solo un aviso de tipos) — por eso una ficha de producto real devolvía 404 pese a existir la fila. Arreglado en los cuatro archivos |
| `cookies()` sin `await` en `lib/admin-auth.ts` | `checkAdminAuth()` / `isAdminAuthenticated()` | Next.js 16: `cookies()` es async. Sin `await`, `cookieStore.get` no existe (`TypeError: cookieStore.get is not a function`) — **todo `/admin` estaba roto en tiempo de ejecución**, no solo con un aviso; ya estaba arreglado en `app/api/admin/auth/route.ts` pero no aquí. Ambas funciones son ahora `async`; los 4 sitios que llaman a `checkAdminAuth()` la esperan con `await` |
| `.contains("tags", [tag])` sobre columna `jsonb` | `app/blog/actions.ts` → `getBlogPostsByTag()` | `.contains()` con un array JS lo serializa como literal de array de Postgres (`{tag}`), válido para `text[]` pero no para `jsonb`: PostgREST intentaba parsear `tag` sin comillas como JSON y fallaba (`22P02 invalid input syntax for type json`). Cambiado a `.filter("tags", "cs", JSON.stringify([tag]))`, que sí envía JSON válido |

Los cuatro primeros compartían la misma causa raíz: el modo mock nunca pasa
por una petición HTTP real de Next.js (ni resuelve un `params` asíncrono, ni
lee una cookie de verdad), así que **ningún test contra mock puede detectar
estos bugs** — solo aparecen al probar contra un servidor real, que es
justo lo que no se había hecho hasta ahora.

### 🔍 SEO técnico — auditoría y correcciones (2026-09-03)

Auditoría completa pedida por el cliente sobre título/descripción, Open
Graph, jerarquía de encabezados, sitemap/robots, contenido duplicado, datos
estructurados, Lighthouse y enlazado interno. Metodología: HTML realmente
renderizado (`curl` contra el servidor, nunca solo el código fuente),
Lighthouse contra un **build de producción** (`next build` + `next start`,
nunca contra `next dev` — el dev server da cifras de rendimiento poco
fiables por no estar minificado).

**Corregido en esta sesión** (crítico y alto de la auditoría; medio/bajo
quedan para otra pasada — ver tabla al final):

| Problema | Antes | Ahora |
|---|---|---|
| Canonical de `/tienda` y `/producto/[slug]` | Apuntaba a la home (`https://idesie.com`) — heredado del layout raíz porque ninguna declaraba su propio `metadata`. Google podía desindexar ambas rutas a favor de la home | Cada una apunta a sí misma. `/tienda` se dividió en `page.tsx` (Server, con `metadata`) + `tienda-client.tsx` (mismo patrón ya usado en `mbim-online-page`/`in-company-page`); `/producto/[slug]` gana un `generateMetadata()` que lee el producto real (título, descripción, canonical y OG por ficha) |
| Canonical de `/mbim-online-page` | **También** apuntaba a la home — no declaraba `alternates.canonical` (hallazgo nuevo de esta auditoría, no visto en la sesión de Supabase) | `alternates: { canonical: "/mbim-online-page" }` |
| Open Graph de MBIM/MBBE/EMBIM/Online | Next.js no hace merge profundo de `openGraph`: al declarar su propio `title`/`description`/`url`, cada página **reemplazaba entero** el `openGraph` del layout raíz, perdiendo `og:image`, `og:type`, `og:locale`, `og:site_name`. Compartir un máster en WhatsApp/LinkedIn salía sin imagen | Cada página declara explícitamente los 4 campos que faltaban, con su propia imagen de hero ya existente (`mbim-hero-new.jpg`, `mbbe-hero-new.jpg`, `embim_hero_image.jpg`, `mbim_online_hero_image.jpg`). **El texto de título y descripción no se tocó**, a petición explícita del cliente |
| `/landing` sin Open Graph | Ninguno — la página de venta principal se compartía sin control de imagen/título social | `openGraph` completo añadido, reutilizando `hero-background.jpg` (misma imagen que ya usa la home) |
| `/images/og-image.jpg` y `/images/twitter-image.jpg` | Referenciadas en el layout raíz pero **no existían en disco** — cualquier página sin imagen OG propia (blog, secundarias) compartía con imagen rota | Creadas como copia de `hero-background.jpg` (elegida por ser la imagen de marca ya usada como OG de la home) |
| Sitemap: URLs de blog | `/blog/{slug}` (un segmento) — no es una ruta real; desde el redirect corregido en la sesión de Supabase, esa URL hace 308 a `/blog`. **Cada post que el sitemap le daba a Google era un redirect al listado genérico, nunca al artículo** | Usa `generatePostUrl()` (ya existía en `app/blog/actions.ts`, nunca se usaba aquí) → `/blog/{year}/{month}/{day}/{slug}`, la ruta real. Verificado con una fila de prueba insertada y borrada: la URL generada responde 200, no 308 |
| Sitemap: `/mdee-page` | Entrada de una página **que no existe** (`app/mdee-page` no existe en el proyecto) — Google recibía 404 al rastrearla | Entrada eliminada |
| Sitemap: fichas de producto | Ausentes — ninguna URL `/producto/[slug]` se enviaba a Google | Añadidas: consulta `productos` donde `activo = true` (mismo criterio que `/api/productos`), consciente de mock/real. Verificado con una fila de prueba |
| `/ejemplo` | Página de pruebas con metadata **real y específica** ("Master BIM Full Time...", cifras de 12.200 €, 100 % empleabilidad) que competía por las mismas keywords que `/mbim-page`. Sin `noindex`, sin disallow en robots.txt, sin ningún enlace entrante — pero rastreable igualmente si Google la encontraba | **Borrada por completo** (`app/ejemplo/`) — decisión explícita del cliente, era una página de pruebas, cero consumidores |
| Datos estructurados `Course`/`FAQPage` | `components/course-schema.tsx` y `components/faq-schema.tsx` existían, bien construidos, **sin usar en ninguna página** — 0 resultados enriquecidos en Google | Importados en las 4 páginas de máster (MBIM, MBBE, EMBIM, Online) con datos reales: nombre/descripción sin cambios, duración en ISO 8601 (`P16M`/`P12M`), `courseMode` (`onsite`/`online`), precio (15.000 €/15.000 €/18.000 €/3.800 €, **todos ya visibles en la FAQ de cada página** — el marcado no inventa nada que no esté ya en el contenido visible) y las `faqs` que cada página ya usa en su `<FaqList>` |
| `LocalBusiness` con `servesCuisine: "Education"` | Propiedad de `Restaurant` copiada por error a un `LocalBusiness` educativo, sin sentido | Eliminada. **`aggregateRating` (4,8 / 150 reseñas) se mantiene tal cual** — el cliente confirmó que son datos reales de encuestas internas, no inventados |
| Hreflang roto | `alternates.languages: { "en-US": "/en" }` en el layout raíz — `/en` da 404 (verificado), no existe versión en inglés del sitio | Bloque `languages` eliminado entero. Un sitio monolingüe no necesita hreflang |
| `google-site-verification` | Valor placeholder literal `"your-google-verification-code"` servido tal cual en el HTML de producción | Clave `verification.google` eliminada (mejor omitirla que servir un valor falso) con un comentario explicando cómo añadir la real cuando el cliente la tenga: **Google Search Console → Configuración → Verificación de la propiedad → método "Etiqueta HTML" → copiar el código del `content="..."` que da esa pantalla** |

### 🚫 `/landing` es noindex A PROPÓSITO — no la "arregles" para SEO orgánico

**Corrección de rumbo a media auditoría (2026-09-03):** la primera pasada de
esta auditoría trató la ausencia de enlaces internos hacia `/landing` como un
bug ("página huérfana") y llegó a enlazarla desde el footer para que Google
la descubriera. **El cliente paró esto explícitamente**: `/landing` es
solo para tráfico de campañas de pago (Google Ads, Meta Ads...) — captar
leads, no posicionar en búsqueda orgánica. El enlace del footer se revirtió
en la misma sesión, antes de llegar a publicarse.

**Estado final, deliberado, con las 4 piezas que lo sostienen — no toques
ninguna sin confirmar con el cliente:**
1. `app/landing/page.tsx` → `metadata.robots: { index: false, follow: false }`.
2. `app/robots.txt` → `Disallow: /landing`.
3. `app/sitemap.ts` → **no** incluye `/landing` (a diferencia de las fichas de
   producto y los posts de blog, que sí se añadieron en esta misma auditoría).
4. **Cero enlaces internos** hacia `/landing` en todo el proyecto (footer,
   header, páginas de máster, blog) — verificado por grep exhaustivo. Es
   accesible solo por URL directa, que es exactamente lo que se pondrá en
   los anuncios.

Si alguna vez se decide que `/landing` SÍ debe indexarse (cambio de
estrategia, no un descuido), hay que revertir las 4 piezas a la vez —
dejar solo alguna a medias (p. ej. quitar el `noindex` pero no enlazarla, o
enlazarla pero dejar el `Disallow`) no tiene sentido y probablemente es un
error.

**Verificado tras aplicar los cambios:**
- `pnpm build`: exit code 0, 47 rutas (48 menos `/ejemplo`).
- `npx tsc --noEmit`: 6 errores (antes 7 — ninguno de los 6 restantes relacionado con este trabajo; línea base sin subir).
- Los 4 componentes de schema inyectan su `<script type="application/ld+json">` correctamente — confirmado renderizando `/mbim-page` con Chrome headless real (no solo curl, que no ejecuta JS) y parseando el JSON resultante.
- Lighthouse contra producción en las 7 páginas tocadas: sin regresión de rendimiento/accesibilidad respecto a la medición previa a los cambios (diferencias dentro del ruido normal de ±5 puntos entre ejecuciones de Lighthouse).
- `/landing`: `<meta name="robots" content="noindex, nofollow">` renderizado de verdad, `Disallow: /landing` servido en `/robots.txt`, ausente de `/sitemap.xml`, cero `href="/landing"` en el HTML de la home — y sigue respondiendo 200 por URL directa (para los anuncios).

**Deliberadamente no verificado con datos reales de producto/blog en el
sitemap** más allá de filas de prueba insertadas y borradas: la tabla
`productos` sigue vacía a propósito (ver §0/§2) y `blog_posts` no tiene
posts reales todavía, así que hoy el sitemap solo lista páginas estáticas —
la lógica está lista para cuando haya contenido real.

**Pendiente — dejado explícitamente para otra pasada (medio/bajo de la
auditoría, no crítico):**
| Hallazgo | Prioridad |
|---|---|
| JSON-LD inyectado solo en cliente (`useEffect` + `document.head.appendChild`) en vez de en el HTML del servidor | Media |
| LCP alto en todas las páginas probadas (3,0–4,3 s en producción; el umbral "bueno" de Google es ≤2,5 s) | Media — **recomendación:** medir primero el impacto de estas correcciones (ya hecho arriba, sin cambios significativos) antes de atacar rendimiento; si se aborda, empezar por `/mbim-page` (4,0–4,3 s, el más alto) y revisar si el hero con GSAP/parallax retrasa el LCP, no asumirlo sin perfilar |
| `/tienda` sin ningún encabezado (`<h1>`–`<h6>`) ni `<main>` en el HTML | Media |
| Cross-linking pobre entre las 4 páginas de máster (solo comparten el menú) y del blog hacia páginas de máster (0 enlaces) | Media |
| Accesibilidad: botones icon-only sin nombre accesible, `<dl>/<dt>/<dd>` mal formados en `outcomes.tsx`/`stat-monolith.tsx`/`proof-panel.tsx`, contraste de `.journey-eyebrow` (ya documentado y aceptado a propósito, ver §5) | Baja |
| Título de `/mbim-online-page` sin tildes ("Formacion", "Conviertete") | Baja |
| `Crawl-delay: 1` en robots.txt — Google lo ignora | Baja |

---

## 3. Sincronización de datos y servicios externos

### Modo mock (`lib/mock-mode.ts`) — leer antes de tocar nada de datos
Un servicio entra en modo mock **solo si se cumplen las dos condiciones**:
1. `NODE_ENV !== "production"`
2. Falta su variable de entorno

En producción **nunca** se activa: si allí falta una clave, el código falla
ruidosamente en vez de servir datos falsos en silencio. Es deliberado.
`instrumentation.ts` imprime un banner al arrancar listando qué está simulado.

| Servicio | Variable | Si falta (en dev) | Si falla (en prod) |
|---|---|---|---|
| **Supabase** (blog, admin, tienda, `applications`, leads — todo) | `SUPABASE_SERVICE_ROLE_KEY` | Datos de ejemplo / nada se persiste, se loguea cada operación interceptada | Error. Todo lo anterior cae |
| Resend (email, incluido `/api/send-catalog` desde (46)) | `RESEND_API_KEY` | Emails no salen, se loguean | Envío falla |

🗑️ **Vercel Blob eliminado por completo (2026-09-05 (48))** — el sitio ya
no sube ningún archivo, ver §7 "(48)". `BLOB_READ_WRITE_TOKEN` ya no
aparece en `SERVICES` ni en ningún `.env*`.

Una sola llave de mock para blog/admin/tienda/`applications`/leads (antes
`DATABASE_URL` y `POSTGRES_URL` eran independientes, cuando eran dos bases de
Neon distintas) — decisión explícita del cliente al retirar Neon, no un
descuido: un proyecto de Supabase, una credencial, un interruptor.

**Datos mock disponibles:** 4 posts de blog (`demo-*`, `lib/mock-data.ts`), 4
productos (`demo-master-bim`, `demo-mbbe`, `demo-curso-corto`, ver
`MOCK_PRODUCTS`), tags. Ojo: los slugs mock **no coinciden** con los slugs que
usan los enlaces de las páginas de programa — por eso los botones de compra
dan 404 en local. Es esperado.

**Ya no existe `lib/sql.ts`.** Cada módulo de datos (`app/blog/actions.ts`,
`lib/leads-db.ts`, `lib/applications-db.ts`, `app/producto/[slug]/page.tsx`…)
tiene su propio bloque `if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {...}` que
devuelve directamente los datos de `lib/mock-data.ts` con la forma exacta que
esa función real devolvería — no hay ningún "motor" central que adivine la
consulta por su texto, cada función mockea su propia respuesta explícitamente.

### Flujo de un lead (dónde acaban los datos)
1. `CatalogDownloadDialog`/`ClosingCta` → `/api/send-catalog` → tabla `descargas_catalogo` en **Supabase** primero, **Resend** después (PDF adjunto, best-effort) — nombre+email+teléfono obligatorios + RGPD (migrado de Brevo en (46), persistencia añadida en (47), ver §7)
2. Bolsa de empleo → `JobApplicationModal` → `/api/empleo/candidatura` → tabla
   `candidaturas_empleo` en **Supabase** primero, **Resend** después (dos
   emails: aviso a `info@idesie.com` + confirmación al candidato) — ver §3
   "Bolsa de Empleo — ofertas y candidaturas". Antes usaba
   `/api/send-job-inquiry` (Brevo, sin persistencia); esa ruta ya no existe.
   🗑️ **La subida de CV se eliminó por completo (2026-09-05 (48))** — el
   campo ya era opcional, `cv_url` se queda `null` siempre, ver §7 "(48)"
3. Admisión → `AdmisionModal` → `/api/admision` → tabla
   `solicitudes_admision` en **Supabase** primero, **Resend** después.
   Sustituye al antiguo `/application` → `/api/application` →
   `applications`, **eliminado por completo en (44)**
4. Contacto → dos vías: pestaña Calendly
   (`calendly.com/idesie-info/30min`), o formulario de mensaje →
   `/api/contact` → tabla `mensajes_contacto` en **Supabase** primero,
   **Resend** después (arreglado en (39) — antes el `<form>` no tenía
   `onSubmit` y no enviaba nada)
5. `InfoRequestModal` (`/landing` y cualquier CTA de esa página) → `/api/leads` → tabla `leads` en **Supabase** + email de confirmación (Resend, en mock)

### Supabase — esquema, RLS y datos (estado final, 2026-09-03)

Única base de datos del proyecto — Neon retirado por completo (ver §0). Todo
el acceso pasa por `@supabase/supabase-js`, nunca por una cadena de conexión
Postgres directa (no hace falta `DATABASE_URL`/`POSTGRES_URL` para nada).

**Cliente** (`lib/supabase/`):
- `server.ts` — cliente con la `service_role` key (bypassa RLS). Marcado
  `"server-only"` (el paquete, no un comentario: si algo del navegador
  intenta importarlo, el build falla). Perezoso: `createClient()` no se
  invoca hasta la primera petición real dentro de un handler — invocarlo a
  nivel de módulo es justo lo que rompió `next build` dos veces (ver §0). En
  modo mock devuelve un cliente falso que registra en el log cualquier
  `.from(tabla).insert(...)` en vez de intentar conectar. **Es el único
  cliente que usa el proyecto** — blog, admin, tienda, `applications` y leads
  pasan todos por `getSupabaseServerClient()`, siempre en código de servidor.
- `browser.ts` — cliente con la `anon` key, para Client Components. **Nada lo
  usa todavía** — está preparado, no huérfano por error. Todo lo que hoy
  escribe datos lo hace desde un Route Handler o una Server Action con
  `service_role`, nunca insertando directamente desde el navegador con la
  `anon` key — con RLS cerrado a cal y canto en las tablas privadas, ese
  insert fallaría por diseño de todos modos.

**Esquema** (`scripts/020` a `023`, ejecutados en ese orden vía `psql` contra
el proyecto real el 2026-09-03 — **las 15 tablas existen de verdad**, con RLS
verificado directamente en `pg_class`/`pg_policies`: `relrowsecurity = true`
en las 15, y exactamente las 9 policies de solo lectura esperadas, ni una
más ni una menos):
| Script | Tablas | RLS |
|---|---|---|
| `020_create_leads_table.sql` | `leads` | Sin policies para `anon`/`authenticated` — acceso exclusivo `service_role` |
| `021_create_productos_table.sql` | `productos` | Lectura pública de `activo = true`; escritura solo `service_role` |
| `022_supabase_legacy_schema.sql` | `blog_posts`, `admin_users`, `applications`, `orders`, `order_items`, `coupons` | `blog_posts`: lectura pública de `published = true`. El resto: sin policies públicas, solo `service_role` |
| `023_producto_detalle_tables.sql` | `producto_modulos`, `modulo_temas`, `producto_dirigido`, `producto_objetivos`, `producto_faqs`, `producto_requisitos`, `producto_testimonios` | Lectura pública solo si el producto padre (`productos.activo`) lo es — subconsulta contra `productos` en cada policy. Escritura solo `service_role` |
| `027_ofertas_empleo.sql` (2026-09-03 (21)) | `ofertas_empleo`, `candidaturas_empleo` | `ofertas_empleo`: lectura pública de `activa = true`. `candidaturas_empleo`: sin policies públicas, acceso exclusivo `service_role` (datos personales de candidatos) — mismo patrón que `leads`. Detalle completo en "Bolsa de Empleo — ofertas y candidaturas", más abajo |

**Por qué esa RLS y no otra:** la clave `service_role` **bypassa Row Level
Security por completo** — no hace falta ninguna policy para que el backend
lea o escriba. "Nadie debe poder leer ni escribir leads de otros usuarios;
solo el backend con service_role" se consigue activando RLS y **no
añadiendo ninguna policy** para `anon`/`authenticated`: sin policy, esos dos
roles no pueden hacer nada, por diseño de Postgres. Es el patrón que
recomienda la propia documentación de Supabase para tablas de uso exclusivo
del servidor. `productos`/`blog_posts` y sus tablas de detalle sí llevan
policy de lectura pública porque son contenido pensado para verse sin pasar
por el backend (tienda, blog).

**Archivos migrados y qué sustituye a qué:**
| Antes (Neon) | Ahora (Supabase) | Notas |
|---|---|---|
| `lib/sql.ts` (`getSql`/`getProductsSql`, envolvía `neon()`) | 🗑️ Borrado | Cada consumidor llama a `getSupabaseServerClient()` directamente |
| `app/blog/actions.ts` | Reescrito sobre `blog_posts` | `getBlogPosts()` **sigue sin filtrar por `published`** a propósito — decisión explícita del cliente de preservar el comportamiento exacto de antes, no corregirlo de paso |
| `app/api/admin/auth/route.ts` | Reescrito sobre `admin_users` | De paso, arreglado `cookies()` sin `await` (Next 16 lo exige) — mismo archivo, cambio trivial y de bajo riesgo |
| `app/api/blog/latest/route.ts` | Reescrito sobre `blog_posts` | — |
| `app/api/productos/route.ts` | Reescrito sobre `productos` | — |
| `app/producto/[slug]/page.tsx` (7 consultas, una con `LEFT JOIN` + `json_agg`) | Reescrito sobre `productos` + las 6 tablas de `023` | El JOIN se resuelve con *nested embedding* de PostgREST (`.select("*, temas:modulo_temas(titulo, orden)")`) en una sola llamada, sin N+1 |
| `lib/applications-db.ts` (`Pool` de `@neondatabase/serverless` directo) | Reescrito sobre `applications` | Ya no usa el paquete de Neon en ningún punto |
| `lib/db-helpers.ts` (pedidos/checkout) | 🗑️ **Borrado** | Cero consumidores reales — decisión explícita del cliente de no migrar código muerto |

**Decisiones de compatibilidad tomadas al migrar (confirmadas explícitamente,
no asumidas):**
- `getBlogPosts()` sigue sin filtrar por `published` — mismo comportamiento
  exacto que contra Neon, no se corrige de paso.
- Los campos `duracion` (en módulos de producto) y `empresa`/`foto`/
  `valoracion` (en testimonios) que el componente `producto-tabs.tsx` espera
  **nunca fueron columnas reales**, ni contra Neon — se declaran
  explícitamente a `null` en vez de dejarlas `undefined`, sin cambiar nada
  visible.

**🔴 Resend en modo mock a propósito, a la espera de la clave real.** El
email de confirmación de leads usa `getResend()` (`lib/resend.ts`), que ya
decide solo entre mock y real según si `RESEND_API_KEY` está puesta. Cuando
llegue la clave real, **basta con añadirla a `.env.local`** — no hay que
tocar código. Pendiente de revisar en ese momento: el remitente
(`from: "IDESIE <onboarding@resend.dev>"` en `lib/leads-db.ts`, marcado con
TODO) es un dominio de prueba de Resend, no el dominio real de IDESIE.

**Verificado en modo mock (sesión anterior):** inserción de prueba vía la UI
real de `/landing` → `[MOCK] Leads — no persistido en Supabase → …` y `[MOCK]
Resend — email no enviado → …` en el log del servidor, blog/tienda/admin
sirviendo datos de ejemplo, `/api/admin/auth` devolviendo 503 (nunca simula
una sesión válida).

**Verificado contra el proyecto real de Supabase (2026-09-03 (2)), no solo
mock.** Para cada flujo: se insertó una fila de prueba directamente por SQL
(o, en el caso del lead, se envió por el propio endpoint HTTP), se comprobó
por HTTP que la página/API real la servía, y se borró la fila acto seguido —
**no queda ningún dato de prueba en ninguna tabla real**:
- `POST /api/leads` (el mismo endpoint que usa `InfoRequestModal` en
  `/landing`) → fila real verificada en `leads` con `id` UUID real generado
  por Postgres.
- `/producto/[slug]` con una fila real en `productos` → nombre, precio y
  modalidad renderizados correctamente. Bloqueado inicialmente por dos bugs
  (ver §2), corregidos.
- `/blog`, `/blog/[year]/[month]/[day]/[slug]` y `/blog/tag/[tag]` con un
  post real en `blog_posts` → título y contenido reales en la página de
  detalle, post correctamente listado por su tag real. Bloqueado
  inicialmente por tres bugs (ver §2), corregidos.
- `POST /api/admin/auth` con una fila real en `admin_users` → cookie de
  sesión real, `/admin/dashboard` autenticado sirviendo el panel de verdad
  (antes, sin cookie, redirige de verdad a `/admin/login` — confirmado por el
  digest `NEXT_REDIRECT` en la respuesta). Bloqueado inicialmente por un bug
  (ver §2), corregido.
- `pnpm build` con exit code 0 contra las credenciales reales (antes solo se
  había verificado en mock) — las 48 rutas generan sin error, incluidas las
  4 dinámicas que dependen de Supabase.

**✅ Productos reales migrados (2026-09-03 (17))** — ver §1 "Migración del
catálogo real de productos". La tabla `productos` ya no está vacía.
- Añadir la `RESEND_API_KEY` real y el remitente verificado.
- Rotar la `anon key` y la `service_role key` expuestas en una sesión
  anterior — ver el aviso de §0. **Pospuesto a propósito por decisión del
  cliente** hasta cerrar el trabajo de base de datos pendiente (productos
  reales, slugs de compra), no una tarea olvidada.

### 🚧 Flywire — integración de pagos (2026-09-03 (13)-(16))

**Estado resumido**: ✅ Pay-by-Link **funciona de verdad** — `recipient=IBT`
era el código de portal correcto (no `idesie`), verificado con Chrome real
en el flujo completo de `/checkout`. La parte de API completa/webhooks
sigue **preparada solo como plan, sin código creado**, pendiente de
API key + Shared Secret — ver (d) y (e).

Encargo del cliente: integrar **Flywire** (pasarela especializada en pagos
educativos, matrículas internacionales) en la tienda. El cliente todavía no
tiene la clave de API — la está pidiendo — así que este apartado es
**investigación y preparación del terreno, sin activar nada real**.

#### 🔴 Hallazgo antes de investigar nada: YA EXISTE una integración de Flywire, sin documentar
Auditando `/checkout` y `/pago-directo` para saber "dónde se conectaría
Flywire" (parte del encargo), apareció código **ya funcional, no un mock**,
que ningún `CLAUDE.md` anterior menciona:

| Dónde | Qué hace |
|---|---|
| `app/checkout/page.tsx` (flujo del carrito, `contexts/cart-context.tsx`) | `handlePayment()` construye una URL de **Flywire Pay-by-Link** con los datos del formulario (nombre, apellidos, email) y el total ya con cupón aplicado, y hace `window.open(paymentUrl, "_blank")` |
| `components/direct-payment-form.tsx` (usado por `/pago-directo`) | Misma lógica, duplicada, con un precio **hardcodeado** `BASE_PRICE = 15000` (15.000 €, no lee `productos` ni `precio_matricula`) |
| Ambos | Misma URL: `https://payment.flywire.com/pay/payment?provider=IBT&payment_destination=idesie&amount=...&currency=EUR&student_first_name=...&student_last_name=...&student_email=...` — `payment_destination=idesie` implica que **IDESIE ya tiene un portal/recipient de Flywire dado de alta**, de una sesión o encargo anterior no registrado aquí |

**En la sesión (13) no se probó nada** (instrucción explícita del cliente de
no procesar ningún pago, ni de prueba); en la sesión **(14)** el cliente
confirmó que los parámetros son intencionadamente propios del onboarding de
IDESIE con Flywire (no un error a corregir contra la doc genérica) y pidió
expresamente comprobar que el enlace funciona de verdad. Resultado de esa
comprobación — con evidencia, no solo teoría — justo debajo.

### ✅ Pay-by-Link: parámetro correcto encontrado, funciona de verdad (2026-09-03 (16))

**Resuelto.** El cliente pasó el enlace de referencia real:
```
https://payment.flywire.com/pay/payment?amount=110000&student_first_name=test&student_last_name=test&student_email=test%40flywire.com&recipient=IBT&read_only=amount,student_first_name,student_last_name,student_email
```
La pieza que faltaba: el código de portal no es `payment_destination=idesie`
(inventado/heredado de una versión anterior, nunca resolvió a nada — ver
más abajo), es **`recipient=IBT`** — un código de 3 letras, la forma exacta
que la documentación pública ya anticipaba para `recipient`. `provider` no
se usa en absoluto en el esquema real de este portal. `student_first_name`/
`student_last_name`/`student_email` sí eran correctos desde el principio,
tal como insistió el cliente — el vocabulario "educativo" del portal de
IDESIE, distinto del genérico `sender_*` de la doc pública. Nuevo, no
documentado antes: `read_only=amount,student_first_name,student_last_name,student_email`,
que bloquea esos campos en el formulario de Flywire para que el pagador no
pueda alterarlos.

**Verificado dos veces con Chrome real, sin enviar ningún dato de pago:**
1. La URL de referencia literal del cliente → página real
   "IDESIE Business & Tech School receives", importe 1.100,00 € precargado.
2. El flujo completo de `/checkout` (carrito con máster 15.000 € + matrícula
   3.000 €, formulario relleno, botón "Pagar") → misma página real, importe
   **18.000,00 €** precargado, coincidiendo exactamente con el subtotal del
   carrito.

**Código actualizado** en los dos sitios que construían esta URL:
`app/checkout/page.tsx` (`handlePayment`) y `components/direct-payment-form.tsx`
(`buildPaymentUrl`, usado por `/pago-directo`) — ambos ahora usan
`recipient=IBT` + `read_only=...`, sin `provider` ni `payment_destination`.
Sin `currency=EUR` tampoco (no estaba en el enlace de referencia del
cliente; el recipient `IBT` ya está fijado a EUR, confirmado por el propio
texto de la página: "Pay securely. IDESIE Business & Tech School receives
your payment in EUR").

`npx tsc --noEmit` en los mismos 2 errores preexistentes, `npx next build`
exit 0.

### 🔴 Pay-by-Link: primer intento de prueba, no llevaba a un formulario de pago (2026-09-03 (14)) — causa ya resuelta arriba

**Bug real encontrado y corregido, independiente de Flywire**: en
`components/producto/ficha-sidebar.tsx`, el botón "Reserva tu plaza"
(matrícula) añadía al carrito un `CartItem` con el **mismo `id`** que el
botón "Máster completo" del mismo producto. El carrito
(`contexts/cart-context.tsx`, `ADD_ITEM`) identifica cada línea por `id` —
con el mismo id, añadir ambos al carrito no sumaba una línea nueva sino que
incrementaba la cantidad de la primera, perdiendo el precio de matrícula
por completo (el total salía mal). Corregido dándole a la línea de
matrícula el id `-producto.id` (negativo — los id reales de `productos` son
siempre positivos, no puede colisionar nunca). Verificado con Chrome real:
carrito con master (15.000 €) + matrícula (3.000 €) → dos líneas
correctas, subtotal 18.000 €.

**El enlace de Flywire en sí — probado, sin enviar ningún dato de pago —
NO funciona.** Con el carrito de arriba y el formulario de `/checkout`
relleno, `handlePayment()` genera:
```
https://payment.flywire.com/pay/payment?provider=IBT&payment_destination=idesie&amount=1800000&currency=EUR&student_first_name=Prueba&student_last_name=Apellido&student_email=prueba%40idesie.com
```
Amount (1.800.000 = 18.000 € en céntimos) y los datos del formulario están
bien codificados — **ese cálculo es correcto**. El problema es el destino:
abrir esa URL real en Chrome **no lleva a un formulario de pago de IDESIE
con el importe y el nombre precargados** — redirige a
`pay.flywire.com`, la home pública genérica de Flywire ("Select the
country/region of the institution you want to pay"), como si
`payment_destination=idesie` no fuera reconocido.

Para descartar que fuera un problema de nombres de parámetro (no de que el
código en sí esté mal escrito), se probaron además, solo como diagnóstico
—sin tocar el código del proyecto, sin enviar ningún dato de pago—:
- El esquema documentado públicamente hoy (`recipient=idesie` +
  `sender_first_name`/...) → Flywire devuelve explícitamente **"Page Not
  Found — The link you are attempting to access is incorrect or no longer
  valid"**. Coherente con que `recipient` debe ser un código de 3 letras o
  5 alfanuméricos (documentado), y "idesie" no tiene esa forma.
- `payment_destination=IDESIE` en mayúsculas, sin `student_*` → mismo
  fallback genérico que el original.

**Conclusión de aquella sesión**: ni el esquema del proyecto (`payment_destination=idesie`)
ni el esquema público documentado (`recipient=idesie`) resolvían a un portal
válido. No se tocó el código a ciegas sin el dato real. **✅ Resuelto en la
sesión (16)** — el código de portal correcto es `recipient=IBT`, no
`idesie`. Ver la sección de arriba, "Pay-by-Link: parámetro correcto
encontrado, funciona de verdad".

#### a) Opciones de integración de Flywire (documentación oficial)
Cuatro vías, de menor a mayor control/esfuerzo — fuente:
[developers.flywire.com](https://developers.flywire.com/education/Content/home.htm):

| Opción | Cómo funciona | ¿Necesita API key? |
|---|---|---|
| **Pay-by-Link** | Se construye una URL con parámetros de consulta (`recipient`/`payment_destination`, `amount`, `sender_*`...) que lleva a una página alojada por Flywire. Es justo lo que el proyecto ya usa | **No**, para generar el enlace. Solo hace falta el código de portal (`payment_destination`), ya asignado |
| **Checkout (embed)** | Un `<script>` + objeto de configuración abre un formulario superpuesto sin salir del sitio | **No**, para la variante 100% cliente (existe también una variante servidor que sí la pide) |
| **Checkout (API)** | El servidor crea la sesión de pago vía API antes de mostrar el formulario — "a prueba de manipulación" | **Sí** |
| **Payer Elements** | Componentes React embebidos (inputs + lógica de cobro) para un checkout totalmente a medida, sin salir del sitio | Sí, normalmente (creación de sesión en servidor) |
| **Payments API completa** | Control total: crear cobros, consultar estado, reembolsos, todo server-to-server | **Sí** — cabecera `X-Authentication-Key: {api_key}` en cada petición |

La clave de API (`X-Authentication-Key`) y el "Shared Secret" para verificar
webhooks se piden **por email a Flywire** (`developer@flywire.com` en la
documentación pública), siendo ya cliente de Flywire con al menos un
recipient — que, por el hallazgo de arriba, IDESIE ya parece tener.

#### b) Evaluación para el flujo de precio + matrícula
El campo `productos.precio_matricula` (matrícula/reserva, separada del
precio completo del máster — ver §1 "Precio de matrícula") **no está
conectado a ningún lado del checkout hoy**: ni `CartItem`
(`contexts/cart-context.tsx`: solo `id, name, price, quantity, image?,
category?`) ni `direct-payment-form.tsx` (precio fijo hardcodeado) saben que
existe.

**Recomendación: seguir con Pay-by-Link** (la vía que ya está a medio
implementar), no saltar a la API completa:
- Ya no requiere esperar ninguna clave para la parte de cobro en sí — el
  bloqueo real es solo el **Shared Secret** para verificar webhooks (ver
  punto e), no una "clave API" completa. Merece la pena decírselo al
  cliente: puede que no haga falta esperar tanto como cree.
- Pay-by-Link soporta pagos parciales de forma nativa: parámetros
  `max_amount` (tope editable) e importes por artículo (`items[...]`). Eso
  encaja con "matrícula ahora, resto después" sin necesitar la API completa
  ni componentes de pago propios.
- La API completa (o Payer Elements) tendría sentido más adelante si se
  quisiera cobrar automáticamente desde el servidor (sin abrir una pestaña
  de Flywire) o gestionar reembolsos — no es necesario para el alcance de
  hoy.

#### c) Cómo está montado el checkout hoy (auditoría, sin cambios)
- **Carrito** (`contexts/cart-context.tsx`): estado en memoria/localStorage,
  `CartItem` sin ningún campo de matrícula ni referencia a la fila real de
  `productos` más allá de `id`/`name`/`price`.
- **`/checkout`**: formulario (nombre/apellidos/email) + cupón validado
  contra `/api/coupons/validate` (cupones **hardcodeados en el propio
  archivo**, no en Supabase) → botón "Pagar" construye la URL de Flywire y
  abre pestaña nueva. Sin `orders`/`order_items` en Supabase (esa tabla
  existe pero nada escribe en ella — ver arriba).
- **`/pago-directo`** (`components/direct-payment-form.tsx`): mismo patrón,
  pero **totalmente desacoplado de la tienda** — precio fijo de 15.000 €
  en el propio componente, no lee ningún producto real.
- **Ningún lado marca nada como "pagado"** hoy: no hay tabla de pedidos en
  uso, no hay webhook configurado, no hay página de confirmación post-pago
  (`return_cta` de Flywire no se usa) — el usuario simplemente abre una
  pestaña de Flywire y el sitio no vuelve a saber qué pasó.

#### d) Estructura de código propuesta — NO creada todavía
El encargo pedía explícitamente instalar el SDK, crear el archivo de
configuración y la variable de entorno ya — pero el propio mensaje termina
pidiendo esperar aprobación antes de escribir código. Ante la contradicción,
se optó por describir la estructura en vez de crearla, y confirmarlo con el
cliente. Si se aprueba, sería:
- Flywire **no tiene un SDK oficial de Node.js/Next.js** publicado en npm
  (a diferencia de Stripe) — la integración es HTTP directo (fetch a
  `api-platform.flywire.com`/`api-platform-sandbox.flywire.com`) o, para
  Pay-by-Link, construcción de URL sin ninguna librería. No hay nada que
  instalar para la vía recomendada (b).
- `lib/flywire.ts` — equivalente a `lib/resend.ts`: una función
  `buildPayByLinkUrl()` central (sustituye la lógica duplicada de
  `app/checkout/page.tsx` y `direct-payment-form.tsx`), y un cliente para el
  webhook (`verifyFlywireSignature()`) en modo mock mientras no exista
  `FLYWIRE_SHARED_SECRET`, mismo patrón que ya usa `isMock()` en
  `lib/mock-mode.ts`.
- `env.example` — nuevas variables **sin valores**: `FLYWIRE_API_KEY`
  (si algún día se usa la API completa) y `FLYWIRE_SHARED_SECRET` (para
  verificar el webhook, ver e). Ninguna con prefijo `NEXT_PUBLIC_`: son de
  servidor.
- `app/api/webhooks/flywire/route.ts` — receptor del callback (ver e), en
  modo mock (loguea y no marca nada como pagado) hasta tener el secreto.

#### e) Webhooks / notificaciones necesarias
Flywire llama a esto "Payment Status Notifications" (su versión de webhook),
no "webhooks" — mismo concepto:
- Se registra una URL pública (`callback_url`, parámetro del propio
  Pay-by-Link, o configurada a nivel de portal) que Flywire llama por
  `POST` cada vez que cambia el estado de un pago.
- **7 estados posibles**: `initiated`, `processed`, `guaranteed`,
  `delivered`, `failed`, `cancelled`, `reversed`. Para marcar un
  lead/pedido como pagado en Supabase, el estado relevante es
  `guaranteed` o `delivered` (según cuándo Flywire garantiza los fondos) —
  a confirmar con la documentación específica del portal de IDESIE.
- **Verificación de firma**: cada `POST` incluye una cabecera
  `X-Flywire-Digest` = HMAC-SHA256 (cuerpo del mensaje, Shared Secret) en
  base64. Sin verificarla, cualquiera podría simular un "pago completado"
  llamando a nuestro endpoint — **no marcar nada como pagado sin validar
  esta firma**.
- El Shared Secret para validar la firma **se pide por email a Flywire**,
  aparte de (o junto con) la clave de API — es la pieza que de verdad
  bloquea el webhook, más que la clave de API en sí si se opta por
  Pay-by-Link.

**Estado: esperando que el cliente consiga la clave de API/Shared Secret de
Flywire.** Mientras tanto, no se ha instalado nada, no se ha creado
`lib/flywire.ts` ni ninguna variable de entorno nueva, y **no se ha tocado
el código de Pay-by-Link ya existente** (ni siquiera para corregir la
posible discrepancia de parámetros) — a la espera de que el cliente
confirme si quiere que se implemente ya la estructura de (d) o prefiere
seguir solo investigando.

Fuentes consultadas: [Flywire Integrations for Education](https://developers.flywire.com/education/Content/home.htm),
[Pay-By-Link](https://developers.flywire.com/education/Content/pay-by-link-landing-page.htm),
[Intelligent Links](https://developers.flywire.com/education/Content/pay-by-link-intelligent-links.htm),
[Checkout](https://developers.flywire.com/education/Content/checkout-landing-page.htm),
[Flywire API Basics](https://developers.flywire.com/education/Content/api-basics.htm),
[Payment Status Notifications](https://developers.flywire.com/education/Content/notifications-payment-status.htm).

### ✅ Rediseño y reconstrucción del checkout — auditoría (15), construido en (26)

> ✅ **Construido en la sesión 2026-09-03 (26)** — ver "Carrito y Checkout —
> rediseño propio 'Pedido'" más abajo para el detalle completo de lo que se
> hizo. Esta entrada se conserva tal cual se escribió en (15) porque el
> hallazgo y la auditoría siguen siendo la referencia correcta de por qué se
> hizo cada cosa; no se reescribe la historia, solo se marca como cerrada.

Encargo del cliente: rehacer `/checkout` en diseño y funcionalidad
(cupones reales, importes validados en servidor, pedido real en Supabase,
gestión de cupones desde `/admin`). **Solo auditoría hecha, cero código
tocado** — el cliente pidió explícitamente la propuesta de estructura antes
de construir nada.

🔴 **Hallazgo importante de la auditoría**: `orders`, `order_items` y
`coupons` **ya existen en Supabase**, con el esquema completo y RLS activo
(sin policies públicas, exclusivo `service_role` — mismo patrón que
`leads`/`applications`), pero **ningún código del proyecto las usa hoy**.
No hace falta diseñar tablas nuevas, solo conectar:

| Tabla | Columnas relevantes ya existentes |
|---|---|
| `coupons` | `code` (único), `discount_type` (`percentage`/`fixed`, con `CHECK`), `discount_value`, `is_active`, `valid_from`/`valid_until`, `max_uses`/`current_uses` — cubre casi todo lo pedido salvo "a qué productos aplica" (no hay ninguna columna de alcance por producto hoy; a decidir si hace falta o si los cupones siguen siendo globales, como ahora) |
| `orders` | `customer_email`/`name`/`phone`, `payment_id` (pensado justo para el ID que devuelva Flywire), `status` (`pending` por defecto), `total_amount`, campos de envío (no aplican a másteres, se pueden dejar `null`) |
| `order_items` | `order_id` (FK), `product_id` (sin FK real a `productos`, es un entero libre), `product_name`, `quantity`, `price` |

**Resto de la auditoría** (qué falla hoy en `/checkout`):
- Cupones: `/api/coupons/validate` los compara contra
  `COUPONS_FALLBACK`, una lista **hardcodeada en el propio archivo** — cero
  relación con la tabla `coupons` real.
- 🔴 **Importe no verificado en servidor**: `handlePayment()` calcula
  `finalPrice` enteramente en el cliente (carrito en `localStorage`,
  editable por cualquiera con las devtools, + el cupón ya aplicado) y ese
  valor viaja tal cual al parámetro `amount` de la URL de Flywire. Nada
  vuelve a comprobar server-side que ese importe corresponde a los
  productos reales — es el hueco de seguridad más importante a cerrar,
  explícitamente pedido por el cliente.
- Ninguna compra crea fila en `orders`/`order_items` — no hay registro de
  qué se intentó comprar ni por cuánto, más allá del log de consola.
- `CartItem` (`contexts/cart-context.tsx`) no distingue "precio completo"
  de "matrícula" más que por el hack de id negativo aplicado en (14) — para
  poder recalcular el importe en servidor hace falta que cada línea lleve
  el id **real** del producto más un discriminador (`tipo: "completo" |
  "matricula"`), no un id sintético.
- ✅ Flywire (Pay-by-Link) ya funciona (`recipient=IBT`, resuelto en la
  sesión (16), ver arriba) — la reconstrucción del checkout solo necesita
  generar esa misma URL con el importe recalculado en servidor, no cambiar
  nada del esquema de parámetros.

**Estructura propuesta** (a la espera de aprobación, mismo patrón que
`/admin/tienda`/`/admin/blog`):
- `app/cupones/actions.ts` — Server Actions (`getAdminCupones`,
  `createCupon`, `updateCupon`, `deleteCupon`, `toggleCuponActivo`) +
  `validarCupon()` reutilizable desde el checkout.
- `components/cupon-form.tsx`, `components/cupones-table.tsx` — mismo
  patrón que `producto-form.tsx`/`productos-table.tsx`.
- `app/admin/cupones/page.tsx`, `.../nuevo/page.tsx`,
  `.../[id]/editar/page.tsx` — protegidas solo por `middleware.ts`, sin
  `checkAdminAuth()` explícito (igual que tienda).
- Un endpoint/Server Action nuevo (p. ej. `app/api/checkout/create-order`)
  que recibe ids de producto + cantidad + código de cupón + datos del
  comprador, **recalcula el total desde `productos` en servidor** (nunca
  desde lo que mande el cliente), valida el cupón contra la tabla real,
  inserta la fila en `orders`/`order_items`, y solo entonces genera la URL
  de Flywire con el importe ya verificado.

**Pendiente de decisión del cliente antes de construir**: si los cupones
deben poder limitarse a productos concretos (añadir esa columna a
`coupons`) o si se quedan globales como hoy.

**Lo que (26) construyó y lo que sigue pendiente, fuera de ese encargo**: se
cerró el hueco de seguridad (importe verificado en servidor) y se conectaron
los cupones a la tabla real — ver el detalle completo más abajo. **El panel
de administración de cupones (`/admin/cupones`) no se construyó** — seguía
sin ser parte de lo pedido en (26) (que era "rediseñar el carrito y el
checkout", no dar de alta un CRUD nuevo en el admin); hoy los cupones solo
se pueden insertar directamente en Supabase. Es la siguiente pieza natural
si se quiere gestionar cupones sin SQL directo.

### ✅ Bolsa de Empleo — ofertas y candidaturas, gestión desde /admin (2026-09-03 (21))

Encargo del cliente: además del rediseño visual (ver §5, "El Tablón"), la
bolsa de empleo pasa de 4 ofertas ficticias hardcodeadas
(`app/bolsa-de-empleo-page/page.tsx`, "Constructora Innova" y similares,
nunca datos reales) a un sistema completo gestionable desde `/admin/empleo`,
igual que blog y tienda.

**Auditoría previa, antes de tocar nada**: la página no tenía ningún
formulario que persistiera de verdad — el modal de candidatura
(`components/job-application-modal.tsx`) enviaba a `/api/send-job-inquiry`,
que solo mandaba un email por **Brevo** (inconsistente con el resto del
proyecto, que reserva Brevo para altas de CRM y usa **Resend** para email
transaccional — ver "Modo mock" más arriba) y **nunca guardaba nada en
Supabase**: cero candidaturas recuperables, y el CV solo viajaba como
nombre de fichero, nunca como archivo real. No había ninguna tabla
`ofertas_empleo`/`candidaturas_empleo` preexistente (a diferencia del
susto de `orders`/`coupons` en la auditoría de checkout) — aquí sí hacía
falta crear esquema nuevo.

**Esquema nuevo** (`scripts/027_ofertas_empleo.sql`, ejecutado contra el
proyecto real):
- `ofertas_empleo` — `puesto`, `empresa` (obligatorios), `ubicacion`,
  `salario` (texto libre a propósito: "35.000 - 45.000 €/año", "A
  convenir"... nunca un rango numérico rígido), `tipo_contrato`,
  `descripcion`, `enlace_externo` (para ofertas que gestiona la propia
  empresa fuera de IDESIE), `destacada`, `activa`. RLS: lectura pública
  solo de `activa = true`, escritura exclusiva `service_role`.
- `candidaturas_empleo` — `oferta_id` (FK a `ofertas_empleo`,
  `on delete set null`) + `oferta_puesto` (copia del puesto en el momento
  de aplicar, para que la candidatura siga siendo legible si la oferta se
  borra después — confirmado al borrar una oferta de prueba con
  candidaturas ya recibidas), `nombre`/`email`/`telefono` (obligatorios),
  `mensaje`, `cv_url`. RLS activo, **sin ninguna policy** — igual que
  `leads`, son datos personales de candidatos, acceso exclusivo
  `service_role`.

**Archivos nuevos:**
- `app/empleo/actions.ts` — Server Actions de ofertas (`getAdminOfertas`,
  `getAdminOfertaById`, `getPublicOfertas`, `createOferta`, `updateOferta`,
  `deleteOferta`), mismo patrón que `app/tienda/actions.ts` — clave secreta
  verificada siempre vía `verifyAdminSecret()` (`lib/admin-secret.ts`),
  nunca reimplementada. Incluye también `getAdminCandidaturas()` (solo
  lectura, sin gate de clave — es un listado, no una escritura).
- `lib/candidaturas-db.ts` — `createCandidatura()`, mismo patrón que
  `lib/leads-db.ts`: inserta en Supabase primero, envía los emails después
  (dos, por **Resend**: aviso a `info@idesie.com` con `replyTo` al email
  del candidato, y confirmación al propio candidato) — si el email falla,
  la candidatura ya quedó guardada.
- `app/api/empleo/upload-cv/route.ts` — **sin `isAdminAuthenticated()` a
  propósito** (a diferencia de `/api/blog/upload-image` y
  `/api/productos/upload-image`): lo llama un candidato anónimo, no un
  admin. La seguridad real es la validación de tipo (`pdf`/`doc`/`docx`) y
  tamaño (máx. 5 MB) en el propio servidor — el `accept` del `<input>` en
  el cliente no es una barrera de verdad. Sube a **Vercel Blob**
  (`lib/blob.ts`, ya existente).
- `app/api/empleo/candidatura/route.ts` — valida campos obligatorios,
  llama a `createCandidatura()`.
- 🗑️ **`app/api/send-job-inquiry/` eliminado por completo** — sin
  consumidores tras reescribir `job-application-modal.tsx`.
- `components/job-application-modal.tsx` reescrito: gana un `jobId?:
  number` opcional (candidatura sobre una oferta real vs. espontánea), sube
  el CV de verdad antes de enviar el formulario (antes solo viajaba el
  nombre del fichero), y sustituye el `alert()` bloqueante de error por un
  banner inline.
- `components/empleo/oferta-form.tsx` + `ofertas-table.tsx` — mismo patrón
  que `producto-form.tsx`/`productos-table.tsx` (react-hook-form + zod,
  estética `admin-*` compartida). El diálogo de borrado avisa
  explícitamente de que las candidaturas ya recibidas se conservan.
- `components/empleo/candidaturas-table.tsx` — tabla de solo lectura
  (buscar por nombre/email/oferta, botón de descarga del CV real desde su
  URL de Vercel Blob).
- `app/admin/empleo/` (`page.tsx`, `nueva/page.tsx`, `[id]/editar/page.tsx`,
  `candidaturas/page.tsx`) — protegidas solo por `middleware.ts`, sin
  `checkAdminAuth()` explícito, igual que tienda.
- `AdminHeader` y `/admin/dashboard` ampliados con una sección "Bolsa de
  Empleo" (ofertas publicadas, candidaturas recibidas + enlace, acceso
  directo a "Nueva Oferta").

**Verificado con Chrome real, de extremo a extremo, con 2 ofertas de
prueba** (`[TEST] BIM Manager Senior` / Madrid / Jornada completa /
destacada, y `[TEST] Ingeniero MEP` / Remoto / Freelance) creadas y
editadas a través del formulario real de `/admin/empleo/nueva` — nunca por
SQL directo, mismo criterio que tienda: el filtro real de `/bolsa-de-empleo-page`
(ver §5) reduce correctamente "2 de 2" a "1 de 2" al filtrar por Madrid; una
candidatura espontánea real enviada desde el modal (con CV omitido) quedó
insertada en `candidaturas_empleo` y visible de inmediato en
`/admin/empleo/candidaturas`. Las 2 ofertas de prueba, la candidatura de
prueba y la fila temporal de `admin_users` usada para el login se borraron
al terminar — no queda ningún dato de prueba en ninguna tabla real.

**Verificado:** `rm -rf .next/types` + `npx tsc --noEmit` en el mismo error
preexistente (`sobre-idesie-page`, sin relación con este trabajo — bajó de
2 a 1 tras el rediseño de Financiación, ver §5), `npx next build` exit 0
con las 4 rutas nuevas de `/admin/empleo` y las 2 de `/api/empleo/*`
listadas sin error.

### ✅ Solicitud de admisión — nuevo flujo en /landing y las 4 páginas de máster, en paralelo al antiguo /application (2026-09-04 (38))

Encargo del cliente: botón "Solicitud de admisión" visible en `/landing` y
en las 4 páginas de máster (MBIM, MBBE, EMBIM, Online), que abre un
formulario completo (datos personales, académicos, programa preseleccionado
pero editable, CV obligatorio vía Vercel Blob, mensaje opcional, checkbox
RGPD obligatorio enlazando a la política de privacidad real), validado en
servidor, con tabla nueva en Supabase y panel de gestión en
`/admin/admisiones`.

🔴 **Hallazgo antes de escribir código, que cambió el planteamiento**: el
sitio ya tenía un formulario de "solicitud de admisión" —
`/application` → `/application/thank-you`, tabla `applications`
(`scripts/015`) — sin CV, sin campo de programa, sin tracking de origen, con
un checkbox RGPD sin enlazar a la política real, y con un estilo que no
sigue el sistema de diseño del sitio (`bg-blue-600`, plantilla v0 sin tocar).
Solo tenía un enlace de entrada, enterrado dentro del acordeón
"Documentación requerida" de `AdmisionSection` (MBIM/MBBE/EMBIM
únicamente — Online y `/landing` no tenían ningún enlace a él).

**Decisión explícita del cliente, confirmada antes de tocar código**: nuevo
flujo **en paralelo**, sin tocar `/application` ni su tabla ni el enlace ya
existente dentro del acordeón (se deja intacto, apuntando a la página
antigua) — unificar o retirar `/application` queda como deuda para otra
sesión. Tres decisiones más confirmadas de la misma forma: modal (no página
dedicada), panel de admin ahora (no después), CV obligatorio (no opcional).

✅ **Resuelta en 2026-09-04 (44): `/application` retirada por completo**,
no unificada — decisión definitiva del cliente. Ver §7 "(44)" para el
detalle completo (código eliminado, tabla `applications` borrada, enlace
del acordeón reapuntado al modal nuevo).

**Esquema nuevo** (`scripts/028_solicitudes_admision.sql`, ejecutado contra
el proyecto real), modelado sobre `candidaturas_empleo` (el precedente más
cercano: datos personales, RLS sin ninguna policy pública):

```sql
create table public.solicitudes_admision (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  email text not null,
  telefono text not null,
  pais text, ciudad text, fecha_nacimiento date,
  titulacion_previa text, universidad_origen text,
  programa_solicitado text not null check (programa_solicitado in ('MBIM','MBBE','EMBIM','Online')),
  origen text not null check (origen in ('landing','mbim','mbbe','embim','online')),
  cv_url text,
  mensaje text,
  estado text not null default 'pendiente' check (estado in ('pendiente','revisado','aceptado','rechazado')),
  rgpd_aceptado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

`programa_solicitado`/`origen`/`estado` con `CHECK` en vez de texto libre
(a diferencia de `ofertas_empleo.salario`/`tipo_contrato`) — mismo criterio
que `coupons.discount_type`: un conjunto cerrado y conocido de valores se
protege contra errores de escritura, un texto realmente libre no. RLS
activo, **sin ninguna policy** — verificado directamente contra
`pg_class`/`pg_policies` tras ejecutar el script. Reutiliza
`public.set_updated_at()` (ya creada en `scripts/020`), no se redefine.

**Backend, mismo patrón que `candidaturas_empleo`:**
- `lib/admision-db.ts` → `createSolicitudAdmision()`: inserta en Supabase
  primero, envía 2 emails por Resend después (aviso a `info@idesie.com` con
  `replyTo` al solicitante, confirmación al solicitante) — un fallo de
  email nunca se lleva por delante el dato ya guardado. En modo mock
  (`SUPABASE_SERVICE_ROLE_KEY` ausente) no persiste pero sigue enviando los
  emails simulados, mismo criterio que el resto del proyecto.
- `POST /api/admision` — pública, sin auth (como `/api/leads`/`/api/empleo/candidatura`).
  **Toda la validación de campos obligatorios ocurre aquí, en servidor**
  (nombre/email/teléfono presentes, formato de email, `programaSolicitado`
  y `origen` dentro de su enum, `cvUrl` presente — el CV es obligatorio,
  `rgpdAceptado === true`) — mismo criterio ya aplicado a la verificación de
  importes en `app/checkout/actions.ts`: lo que manda el cliente no es de
  fiar hasta que el servidor lo confirma. Verificado con `curl` enviando 5
  payloads inválidos distintos (campos vacíos, email mal formado, programa
  fuera del enum, sin CV, RGPD sin aceptar) — los 5 devuelven 400 con el
  mensaje correcto.
- `POST /api/admision/upload-cv` — pública, calco exacto de
  `/api/empleo/upload-cv` (PDF/DOC/DOCX, máx. 5 MB, validado en servidor,
  no solo en el `accept` del input).

**`components/admision-modal.tsx`** (`AdmisionModal`) — modal compartido
entre las 5 ubicaciones, mismo patrón que `JobApplicationModal` (trigger
como `children`, CV subido de verdad antes de enviar el formulario) e
`InfoRequestModal` (un dato de contexto — aquí `origen` — que viaja con la
solicitud sin mostrarse). Prop `programaPreseleccionado` rellena el
`Select` de programa pero el usuario puede cambiarlo — en `/landing` se deja
sin preseleccionar (vende los 4 másteres a la vez, no tiene sentido
adivinar uno). Checkbox RGPD enlaza a `/politica-privacidad-page` real, no a
un texto genérico.

**Ubicación del botón, una por página, decidida antes de construir:**
| Página | Dónde |
|---|---|
| MBIM / MBBE / EMBIM | `AdmisionSection` (`components/admision-section.tsx`) gana un botón prominente propio arriba del acordeón — antes el único enlace estaba enterrado dentro de "Documentación requerida", apuntando al `/application` antiguo (se deja intacto ahí). Nueva prop `programa` obligatoria, pasada desde cada `page.tsx` |
| MBIM Online | `ClosingSection` (`components/mbim-online/closing-section.tsx`), como tercer botón (outline) junto a "Comprar el máster" y la descarga de catálogo, en la franja de precio |
| `/landing` | `HeroSection`, botón outline secundario junto al CTA principal "Solicitar información" — no compite con él, es explícitamente secundario |

**Panel de admin, `/admin/admisiones`** — sin crear/editar (las solicitudes
solo llegan desde el sitio público): `app/admision/solicitudes-actions.ts`
(`getAdminSolicitudes`, `updateEstadoSolicitud` con `verifyAdminSecret`,
nunca reimplementada), `components/admision/solicitudes-table.tsx` (mismo
patrón que `CandidaturasTable` + un `Select` de estado por fila con una
única "Clave secreta" compartida para toda la tabla, mismo criterio que
`detalle-tabs.tsx` en tienda). `AdminHeader` y `/admin/dashboard` ampliados
con la sección "Solicitudes de Admisión" (total + pendientes + acceso
directo), mismo patrón que las secciones de blog/tienda/empleo ya
existentes.

🔴 **Hallazgo colateral, no relacionado con el encargo**: al escribir
`app/admision/solicitudes-actions.ts`, `next build` falló con "Export
getAdminSolicitudes doesn't exist" apuntando a `app/admision/actions.tsx` —
un archivo **preexistente, fechado 2 sept. (antes de que empezara esta
sesión), nunca documentado en ningún `CLAUDE.md`**, con una Server Action
`submitAdmissionForm()` (envía 2 emails por Resend, sin persistencia) que
**ningún componente del proyecto importa** (verificado por grep). Un tercer
intento de "solicitud de admisión", completamente desconectado del resto
del sitio. La colisión de nombres (`actions.ts` nuevo vs. `actions.tsx`
preexistente, mismo directorio) rompía la resolución de módulos de
Next.js. Resuelto renombrando el archivo nuevo a
`app/admision/solicitudes-actions.ts` — **el archivo muerto preexistente no
se tocó ni se borró**, no es una decisión que se pueda tomar sin preguntar.
Detalle completo en §1, nota junto a "Rutas API".

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0 (rutas
nuevas: `/admin/admisiones`, `/api/admision`, `/api/admision/upload-cv`
listadas sin error). `curl` contra el dev server: las 5 páginas
(`/landing`, `/mbim-page`, `/mbbe-page`, `/embim-page`,
`/mbim-online-page`) sirven el botón "Solicitud de admisión" exactamente
una vez cada una; `/admin/admisiones` sin cookie responde 307 a
`/admin/login` (mismo comportamiento que el resto de `/admin/*`,
confirmando que `middleware.ts` ya la protege sin tocar nada). Flujo
completo probado de extremo a extremo con una solicitud de prueba real
(POST directo a `/api/admision` con CV, verificada por `psql` en la tabla
real y borrada acto seguido — no queda ningún dato de prueba). Subida real
de CV probada contra `/api/admision/upload-cv`: PDF aceptado (en modo mock
local, sin `BLOB_READ_WRITE_TOKEN`, devuelve la URL de marcador esperada),
`.txt` rechazado con 400. `/application` (el flujo antiguo) confirmado sin
tocar — sigue respondiendo 200. `next.config.mjs` sin tocar (mismo
timestamp), nada desplegado.

⚠️ **No verificado en vivo en Chrome** — la extensión de Claude in Chrome ha
seguido desconectada toda la sesión. No se pudo abrir el modal, rellenar el
formulario ni comprobar visualmente el `Select` de programa, la subida de
archivo desde la UI, ni el cambio de estado desde `/admin/admisiones` con
sesión real. La verificación se apoya en `curl`/`psql` contra los
endpoints reales y en que el componente replica exactamente la estructura
de `JobApplicationModal`/`InfoRequestModal`, ya probados en producción de
esta sesión — no en una prueba interactiva real. Pendiente de que el
cliente lo confirme en su navegador.

### 🎨 AdmisionModal — reescrito de cero, sin CV (2026-09-04 (40))

Tras la auditoría de formularios de (39), encargo aparte y explícito sobre
este componente en concreto: quitar el campo de CV (ya no se pide en la
solicitud) y **reescribir el formulario de cero**, no retocarlo — mismo
lenguaje visual que `PedidoCoupon`/`.pedido-card`/`journey-surface`: icono
por campo, tokens de marca, `--ease-spring`, radios y espaciado coherentes
con el resto del sitio. Nada de plantilla shadcn sin tocar (el componente
original de (38) copiaba fielmente la plantilla genérica de
`JobApplicationModal`, sin subir su nivel).

**Sin CV — decisión sobre el esquema, confirmada con el cliente**: la
columna `cv_url` de `solicitudes_admision` **ya era nullable** desde su
creación en (38) (`cv_url text,`, sin `not null`) — **no hizo falta ninguna
migración**. Se conserva la columna por si el CV se reactiva más adelante;
`createSolicitudAdmision()` simplemente la escribe como `null` mientras
tanto. `/api/admision/upload-cv` (el endpoint de subida) también se deja
tal cual, sin consumidores por ahora — mismo criterio de "conservar por si
se reactiva", no borrar infraestructura que puede volver a hacer falta.

**Rediseño visual**, reutilizando exclusivamente lo ya existente:
- Icono dentro de cada campo (mismo patrón que `PedidoCoupon`), con los
  iconos de Lucide más literales para cada dato (`User`, `Mail`, `Phone`,
  `MapPin`, `Globe`, `Calendar`, `GraduationCap`, `Landmark`,
  `MessageSquare`) — todos en `text-muted-foreground`, nunca hex.
  Automáticamente se benefician además de la subida de nivel de los
  primitivos de (39) (`rounded-xl`, foco `border-brand`/`ring-brand`, hover
  propio) sin tener que repetir nada aquí.
- Insignia circular de icono en la cabecera (`GraduationCap`) y en la
  pantalla de éxito (`CheckCircle2`), con una entrada `zoom-in-50` cuya
  curva es explícitamente `var(--ease-spring)` — la única vez que se pidió
  esa curva por nombre en el encargo, aplicada literalmente vía
  `[animation-timing-function:var(--ease-spring)]`, no una aproximación.
- Secciones ("Datos personales" / "Datos académicos") con el mismo eyebrow
  mono en mayúsculas que ya usa `pedido-eyebrow` (mismo `font-mono`,
  `tracking-[0.14em]`, `text-brand-strong`) — no se creó una clase nueva
  `pedido-eyebrow`-duplicada, se replicó su receta inline porque este
  componente no vive en el vocabulario `.pedido-*` (es de admisión, no de
  checkout) y no correspondía importar esa clase entre identidades.
- Checkbox de RGPD dentro de una tarjeta propia (`rounded-xl border
  bg-muted/40`, se tiñe de `destructive` si hay error) — deja de ser una
  línea suelta al final, ahora es un momento con peso visual propio, mismo
  criterio que ya usan otros formularios del sitio para el consentimiento.
- Botón de envío con `.btn-sweep` (relleno por barrido, genérico, ya
  documentado en "Sistema global de cursor + scroll suave") en vez de un
  `bg-brand hover:bg-brand-strong` plano.
- `autoComplete` en cada campo que tiene un token HTML estándar real
  (`name`, `email`, `tel`, `address-level2`, `country-name`, `bday`) —
  titulación/universidad no llevan, no existe un token estándar para ellos.
- `autoFocus` implementado vía `onOpenAutoFocus` del propio `DialogContent`
  de Radix (no un `autoFocus` plano en el `<input>`, que el propio manejo
  de foco de Radix podría pisar) — enfoca "Nombre completo", el primer
  campo de texto real que el usuario va a rellenar, no el primer elemento
  del DOM (el `Select` de programa, que normalmente ya llega preseleccionado).

**Verificación de los 4 puntos pedidos explícitamente por el cliente:**
1. **Persistencia en Supabase**: confirmada con una solicitud de prueba
   real (POST → 200 → verificada por `psql`, `cv_url` vacío como se
   esperaba → borrada). Sin ningún cambio de esquema, tal como se decidió.
2. **Programa preseleccionado por página**: sin cambios en el cableado
   externo del componente (`programaPreseleccionado`/`origen` como props,
   idénticos a (38)) — solo cambió el interior del modal, así que
   MBIM/MBBE/EMBIM (`AdmisionSection`, prop `programa`),
   Online (`ClosingSection`, `"Online"`) y `/landing`
   (`HeroSection`, sin preseleccionar) siguen exactamente igual.
   Confirmado con `curl` que el botón sigue presente una vez en cada una de
   las 5 páginas tras el cambio.
3. **Validación en servidor**: sigue siendo real y ahora sin el CV en la
   lista de obligatorios — verificado con `curl` con 5 payloads distintos:
   campos vacíos (400), email inválido (400), programa fuera de enum (400),
   RGPD sin aceptar (400, **no** el CV — confirma que el rechazo por RGPD
   sigue disparándose con normalidad aunque ya no haya CV en la petición),
   y un envío válido sin ningún campo de CV en el cuerpo (200, insertado de
   verdad).
4. **RGPD obligatorio**: sin cambios en la lógica — sigue bloqueando el
   envío en cliente y en servidor si no está marcado.

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0.
`next.config.mjs` sin tocar, nada desplegado. ⚠️ No verificado en vivo en
Chrome (extensión desconectada toda la sesión) — no se pudo confirmar
visualmente ningún efecto de `--ease-spring`, el hover de los campos, ni la
sensación real del rediseño. Pendiente de revisión visual del cliente antes
de dar esta pieza por cerrada (pedido explícito: "muéstrame el resultado
antes de darlo por cerrado").

---

## 4. Seguridad

### Variables sensibles
Viven **solo** en `.env.local` (en `.gitignore`, nunca al repositorio) y en las
variables de entorno de Vercel. `.env.example` documenta los nombres **sin valores**.

`SUPABASE_SERVICE_ROLE_KEY` · `RESEND_API_KEY` ·
`BLOB_READ_WRITE_TOKEN` — todas son **de servidor**. Ninguna lleva prefijo
`NEXT_PUBLIC_`, y **no debe llevarlo nunca**: eso las expondría en el bundle
del navegador. `SUPABASE_SERVICE_ROLE_KEY` en concreto es la más sensible de
todas — bypassa Row Level Security por completo, así que solo la importa
`lib/supabase/server.ts` (con el paquete `server-only`, que hace fallar el
build si algo del cliente la arrastra). Ya no existen `DATABASE_URL` ni
`POSTGRES_URL` (eran de Neon, retirado por completo el 2026-09-03 — ver §0).

Las únicas públicas son `NEXT_PUBLIC_BASE_URL` (una URL, no un secreto) y el
par `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` — pensadas
para ser públicas (la `anon` key solo puede hacer lo que Row Level Security
le deje, ver §3).

⚠️ **`.env.local` (con el punto) sí existe desde el 2026-09-03** y contiene
credenciales reales de Supabase — aparecieron solas a media sesión, ver el
aviso completo en §0. No confundir con `env.local`/`env.example` (sin punto,
en la raíz del repo): esas dos son las plantillas que sí se documentan y se
comparten, siempre sin valores. `.env.local` nunca debe llevar valores en
ningún archivo que se comparta o se suba a git.

### Autenticación de administrador
- Cookie `admin-auth` (`httpOnly`, `sameSite: strict`, `secure` en producción, 24 h).
- ✅ **`middleware.ts` (2026-09-03 (6)) protege `/admin/*` automáticamente**,
  salvo `/admin/login`. Antes la protección era manual página por página con
  `checkAdminAuth()` — el fallo más fácil de cometer al añadir una página
  nueva. Con el panel de tienda a punto de sumar varias rutas nuevas, ya no
  hace falta acordarse: el middleware corre en el edge antes de que el
  Server Component se ejecute. Las páginas de blog existentes conservan su
  `checkAdminAuth()` como red redundante (no hace daño); **las páginas
  nuevas de tienda no lo llaman — el middleware ya basta**.
  ⚠️ El middleware solo cubre páginas bajo `/admin/*`, no rutas de API: los
  endpoints de escritura (`/api/blog/upload-image`, y los que se añadan
  para la tienda) siguen necesitando su propio `isAdminAuthenticated()`
  explícito.
- En modo mock, `/api/admin/auth` devuelve **503 a propósito**: no simula sesión,
  porque un mock que dijera "ok" sería un bypass de autenticación.

### ✅ Logout de /admin — corregido (2026-09-03 (15))

El cliente reportó que, tras pulsar "Cerrar Sesión" y volver a `/admin/*`,
a veces parecía que la sesión seguía activa. **El servidor nunca estuvo mal**:
`DELETE /api/admin/auth` (borra la cookie `admin-auth`) y `middleware.ts`
(la comprueba en cada petición) se verificaron con `curl` y una cookie jar
real — login, `GET /admin/dashboard` (200), logout, `GET /admin/dashboard`
de nuevo (307 → `/admin/login`). Verificado también con Chrome real:
navegar por URL directa a `/admin/dashboard` tras cerrar sesión SIEMPRE
redirigía bien.

🔴 **La causa real era 100% de cliente**: `AdminHeader.handleLogout()`
llamaba a `router.push("/admin/login")` — una navegación de **cliente**
de Next.js, no una recarga completa. Al pulsar "atrás" en el navegador
justo después, Next.js repintaba desde su propio caché de cliente la
última versión en memoria de `/admin/posts` o `/admin/dashboard` **sin
volver a pasar por el servidor ni por `middleware.ts`** — la cookie ya
borrada no llegaba a comprobarse porque no había ninguna petición de red.
Confirmado reproduciendo el bug en Chrome real antes de arreglar nada
(pantalla completa de "Gestión de Posts" visible tras pulsar "atrás",
pese a que la sesión ya estaba cerrada de verdad).

**Arreglo, dos piezas:**
1. `components/admin-header.tsx`: `handleLogout()` pasa a
   `window.location.href = "/admin/login"` (navegación dura) en vez de
   `router.push()`. Al destruir el estado de cliente de Next.js al salir,
   ya no queda ningún caché de ruta en memoria que "atrás" pueda repintar
   sin red.
2. `app/admin/layout.tsx` (nuevo, no existía ningún layout compartido bajo
   `/admin`) + `components/admin-bfcache-guard.tsx` (nuevo): escucha
   `pageshow` y, si `event.persisted` es `true` (la página viene del
   **bfcache real del navegador**, no del router de Next.js — un caso
   distinto pero relacionado, p. ej. volver a una pestaña de admin dejada
   abierta con la cookie ya caducada), fuerza `window.location.reload()`.
   Cubre TODO `/admin/*` de una vez, mismo criterio que `middleware.ts`:
   una sola pieza en vez de acordarse de añadirla página por página.

**Verificado de extremo a extremo con Chrome real** (login → navegar a
Blog → Cerrar Sesión → pulsar "atrás"): antes del arreglo, se veía
"Gestión de Posts" completo; después del arreglo, redirige a
`/admin/login` sin dejar pasar. Probado con una fila temporal en
`admin_users` (creada y borrada en la sesión, `logout-test-temp`) — nunca
se tocó la fila real del cliente. `npx tsc --noEmit` en los mismos 2
errores preexistentes, `npx next build` exit 0.

### 🔍 Auditoría de seguridad del backend completa — informe entregado, nada arreglado todavía (2026-09-04 (40))

Encargo explícito del cliente: auditoría honesta de todo el backend
(rutas API, Server Actions, RLS de Supabase, autenticación, secretos, rate
limiting, sanitización, `console.log` con datos sensibles) **antes de tocar
nada** — "yo decido el orden de los arreglos". Cero cambios de código en
esta pieza, solo lectura y una verificación en vivo contra Supabase vía
`psql` (cadena de conexión siempre redactada de cualquier salida, mismo
criterio de siempre). Los números de RLS/policies del informe se
recontaron de forma independiente antes de darlos por buenos: 19/19 tablas
públicas con RLS activo, 10 policies en total — coincide exacto.

**🔴 Crítico:**
1. **`/pago-directo` — el importe que llega a Flywire no lo verifica el
   servidor en ningún punto.** Ya diagnosticado en detalle en la entrada
   de (39) ("Hueco de seguridad de /pago-directo") — este informe lo
   reconfirma con referencias de archivo:línea frescas
   (`direct-payment-form.tsx:7,142-148,166-172`,
   `api/coupons/validate/route.ts:14,30`). El esquema de parámetros de
   Flywire (`recipient=IBT`, sin firma) es público en el propio código
   fuente — cualquiera puede construir la URL de pago real a mano con el
   importe que quiera, sin tocar la UI del sitio en absoluto. Fix: mismo
   patrón que `calculateVerifiedTotal()`/`createOrderAndGetPaymentUrl()`
   de `app/checkout/actions.ts`, ya existente en el proyecto.

**🟠 Medio:**
2. **Sanitización de HTML del blog — un regex propio, no una librería
   real.** `lib/sanitize-html.tsx` lo admite en su propio comentario
   ("basic sanitizer, consider DOMPurify for production"). Bypasses reales
   confirmados: el filtro de manejadores de eventos exige un espacio antes
   de `on\w+` (`<svg/onload=...>` sin espacio no lo captura), y
   `href="javascript:..."` no se filtra en absoluto. Duplicado con lógica
   ligeramente distinta en `app/api/blog/latest/route.ts`. Solo explotable
   hoy por un admin autenticado (el HTML llega vía el editor, gateado por
   `verifyAdminSecret`), pero un admin pegando contenido de una fuente
   externa comprometida ya bastaría para XSS persistente contra cualquier
   visitante del blog. Fix: sustituir por `sanitize-html` con allowlist
   explícita, en los dos sitios.
3. **Emails transaccionales sin escapar HTML de usuario.**
   `lib/leads-db.ts`, `candidaturas-db.ts`, `admision-db.ts`,
   `contact-db.ts` interpolan campos de usuario (nombre, mensaje...)
   directamente en plantillas HTML enviadas por Resend, sin escapar. Un
   mensaje de contacto con `<img src=x onerror=...>` llega tal cual al
   email real de `info@idesie.com`. Fix: un `escapeHtml()` compartido en
   `lib/`, aplicado antes de interpolar en los 4 archivos.
4. **Subida de CV — el tipo de archivo se confía del propio cliente.**
   `/api/empleo/upload-cv` y `/api/admision/upload-cv` validan
   `file.type`, que el navegador declara tal cual se lo pidan — falsificable
   con un simple `curl -F`. Los archivos se sirven `access: "public"` en
   Vercel Blob. Fix: verificar los bytes reales del archivo (librería
   `file-type`), no solo el header declarado.
5. **Cookie de sesión de admin — un valor fijo, no un token.**
   `admin-auth` vale literalmente el string `"authenticated"` — no un token
   opaco ni firmado, sin registro de sesión en servidor.
   `httpOnly`/`secure`(prod)/`sameSite: strict` sí están puestos, pero no
   hay forma de invalidar una sesión concreta ni detectar sesiones
   concurrentes. Fix: token aleatorio único por sesión, verificado
   server-side o firmado con HMAC.
6. **Cero rate limiting en cualquier endpoint público — confirmado por
   grep, no solo asumido.** Más sensible en `/api/admin/auth`: bcrypt hace
   cada intento caro, pero nada limita *cuántos* intentos por IP/tiempo —
   fuerza bruta contra la clave de admin es viable sin ningún freno.
   También expuestos a spam/bots sin fricción: `/api/leads`,
   `/api/contact`, `/api/admision`, `/api/empleo/candidatura`. Fix:
   Upstash Ratelimit, mínimo en `/api/admin/auth`.

**🟢 Bajo:**
7. `console.log` con PII en texto plano en `app/api/send-catalog/route.ts:25`
   y `app/api/application/route.ts:268` (nombre/email completos en cada
   petición) — distinto de los logs `[MOCK]`/`[v0]` normales del proyecto,
   que no exponen datos reales.
8. CSRF: riesgo bajo, verificado — la cookie de admin ya lleva
   `sameSite: strict`, y las Server Actions de escritura piden la clave
   secreta explícitamente en cada envío (mitigación de facto). Sin cambio
   necesario.
9. Sin validación de esquema (zod) en endpoints públicos — comprobaciones
   manuales campo a campo, funcionalmente correctas hoy, más frágiles a
   futuro que un esquema declarativo. No es una vulnerabilidad actual.

**✅ Confirmado correcto, no solo lo malo** (verificado en vivo, no de
memoria): RLS activo en las 19 tablas públicas sin excepción, exactamente
10 policies, todas de solo lectura en tablas de contenido — cero policies
en las 9 tablas de datos personales/pago, acceso exclusivo `service_role`.
`middleware.ts` protege `/admin/:path*` salvo login, incluida
`/admin/admisiones` sin necesitar nada aparte. Los 2 endpoints de subida
que debían llevar `isAdminAuthenticated()` lo hacen de verdad.
`SUPABASE_SERVICE_ROLE_KEY` solo se lee en `lib/supabase/server.ts`
(`server-only`); cero claves hardcodeadas encontradas; las 3 variables
`NEXT_PUBLIC_*` son las esperadas, ninguna es un secreto real. `/checkout`
reconfirmado como el único flujo de pago que ya verifica el importe en
servidor de verdad.

**Nada de esto se ha arreglado** — es el informe pedido, no una
implementación. El cliente decide el orden de los arreglos.

### ✅ Fase 1 (crítico) de la auditoría de seguridad — /pago-directo cerrado (2026-09-04 (41))

Orden de arreglos aprobado por el cliente sobre el informe de (40): Fase 1
(crítico) antes que cualquier otra cosa, incluida la pausa explícita del
rediseño del formulario de admisión hasta cerrarla. Único hallazgo crítico:
`/pago-directo` sin verificación de importe en servidor — ver la
explicación completa en §5 "Hueco de seguridad de /pago-directo".

**Fix — reutiliza literalmente las funciones de checkout, no las
reimplementa.** `components/direct-payment-form.tsx` ya no calcula ni
construye nada por su cuenta: llama a `calculateVerifiedTotal()` (para
mostrar el precio, con o sin cupón) y `createOrderAndGetPaymentUrl()`
(al pulsar "Pagar Ahora") de `app/checkout/actions.ts`, pasándoles un
"carrito" de un solo artículo — el producto real que esta página siempre
representó: `master-bim-full-time` (id **8** en `productos`, confirmado por
consulta directa contra el proyecto real, 15.000€ — coincide exacto con lo
que era `BASE_PRICE`).

**Efecto, todo de regalo por reutilizar las funciones ya existentes de
checkout, no código nuevo escrito para esto:**
- El precio mostrado y el que llega a Flywire salen siempre de
  `productos.precio_actual` en servidor — nunca de un número en el
  cliente.
- Los cupones se validan contra la tabla real `coupons` (antes:
  `COUPONS_FALLBACK` hardcodeado en la API).
- Cada intento de pago queda registrado en `orders`/`order_items` — antes
  no quedaba ningún rastro. `current_uses` del cupón se incrementa
  correctamente si se usó uno.
- La URL de Flywire (`recipient=IBT`, `read_only=...`) se construye
  enteramente en servidor con el importe ya verificado — el cliente recibe
  la URL ya hecha, no los datos para construirla él mismo.

**`/api/coupons/validate` — eliminado por completo**, no solo dejado de
usar. Era el endpoint con la vulnerabilidad exacta (recibía `basePrice` del
propio cliente sin verificar nada) — su único consumidor era este
formulario (confirmado por grep antes de borrar); dejarlo vivo y sin usar
habría sido un riesgo residual real (cualquiera podía seguir invocándolo
directamente con `curl`).

**Deliberadamente NO tocado en esta pieza**: la estética/UX de
`/pago-directo` — sigue exactamente igual que antes (pendiente de la
decisión ya documentada de si se unifica con `/checkout` o se retira como
flujo aparte). Tampoco se añadió ningún selector de producto — la página
sigue representando un único producto fijo, ahora verificado de verdad en
vez de solo mostrado.

**Verificado con una ruta temporal de prueba** (creada, usada y borrada en
la misma sesión, no queda ningún rastro en el código): confirmado que
1) el precio real (15.000€) viene de Supabase, no de un literal; 2) un
cupón inventado se rechaza contra la tabla real; 3) **un id de producto
manipulado (999999) se rechaza** — la prueba directa de que el hueco está
cerrado: ni el precio ni el producto los decide el cliente; 4) el pedido
completo se genera correctamente, con `orders`/`order_items` reales
(insertados y borrados como fila de prueba) y una URL de Flywire con
`amount=1500000` (15.000€ en céntimos) coincidiendo exacto con el precio
real verificado.

**Verificado además:** `rm -rf .next/types && npx tsc --noEmit` 0 errores
(una comprobación intermedia mostró un error de tipos apuntando a
`/api/coupons/validate/route.js` — era caché estancado de `.next/types`
de antes de borrar la ruta, no un error real; desapareció al limpiar la
caché). `npx next build` exit 0, `/api/coupons/*` ya no aparece en las
rutas generadas, `/pago-directo` sigue listada y responde 200.
`next.config.mjs` sin tocar, nada desplegado.

### ✅ Fase 2 (medio) de la auditoría de seguridad — los 4 hallazgos cerrados (2026-09-04 (42))

Orden aprobado por el cliente, los 4 en secuencia, cada uno probado de
verdad antes de pasar al siguiente (mismo criterio que la Fase 1: "no solo
debería funcionar").

#### 1. Cookie de sesión de admin — token firmado, expira, revocable individualmente

Antes: `admin-auth` valía literalmente el string `"authenticated"` — sin
firma, sin fecha de caducidad propia más allá del `maxAge` de la cookie, y
sin ninguna forma de invalidar una sesión concreta sin afectar a las demás.

**Diseño nuevo** (`lib/admin-session.ts`, nuevo): cada login crea una fila
en `admin_sessions` (`scripts/030`, RLS sin ninguna policy pública, mismo
patrón que `admin_users`) — `id` (uuid), `admin_id`, `created_at`,
`expires_at` (24h, igual que antes), `revoked_at` (NULL = activa),
`user_agent`/`ip_address` para rastro. La cookie pasa a valer
`<id de la sesión>.<firma HMAC-SHA256>` — la firma prueba que el token lo
emitió el servidor (rechazo rápido de cookies inventadas, sin ni siquiera
consultar la base de datos); la fila en `admin_sessions` es la fuente de
verdad de si sigue activa, y se puede revocar una fila concreta sin tocar
el resto.

🔒 **Escrito con Web Crypto API (`crypto.subtle`), no el módulo `crypto` de
Node** (`createHmac`/`timingSafeEqual`) — `middleware.ts` corre en el
runtime Edge por defecto, donde el módulo `crypto` de Node no está
disponible pero `crypto.subtle` sí (tanto en Edge como en Node ≥15). Esto
evita tener que forzar el middleware a runtime `nodejs` solo para poder
firmar/verificar el token.

La clave de firma se deriva de `SUPABASE_SERVICE_ROLE_KEY` (ya obligatoria
en producción) — **no se introduce ninguna variable de entorno nueva** que
pudiera faltar en un despliegue real.

**`middleware.ts` pasa de comparar `cookie === "authenticated"` a llamar a
`verifyAdminSession()`** — la misma función que usa `lib/admin-auth.ts`
(`checkAdminAuth()`/`isAdminAuthenticated()`), nunca reimplementada dos
veces. Esto importa porque varias páginas de admin (tienda, empleo,
admisiones) **no llaman a `checkAdminAuth()`** y dependen solo del
middleware — si el middleware se hubiera quedado con una comprobación
simplificada (solo la firma, sin consultar si la sesión sigue activa), esas
páginas no habrían heredado la revocación real. `getSupabaseServerClient()`
(fetch-based, sin APIs de Node) funciona sin problema dentro de Edge
Middleware — confirmado con un build real, sin ningún error de
compatibilidad de runtime.

`app/api/admin/auth/route.ts`: login llama a `createAdminSession()` en vez
de fijar el string; logout llama a `revokeAdminSession(cookieValue)`
**antes** de borrar la cookie — revoca la fila real en `admin_sessions`, no
solo el valor en el navegador del cliente.

**Verificado de extremo a extremo con un admin de prueba temporal** (creado
y borrado en la sesión, `session-test-temp`, `on delete cascade` en
`admin_sessions` confirmado — al borrar el admin desaparecieron también sus
sesiones):
1. Login real → cookie con forma `<uuid>.<hex de 64>`, ya no `"authenticated"`.
2. Cookie válida → acceso 200 a `/admin/dashboard`; contraseña migrada a
   bcrypt en el mismo login, como ya hacía antes.
3. Cookie con firma inventada (UUID real + ceros) → 307 a login.
4. Cookie antigua literal `admin-auth=authenticated` → 307 a login (el
   propio hallazgo de la auditoría, confirmado cerrado).
5. Logout → `DELETE /api/admin/auth` 200 → **reenviar exactamente la misma
   cookie que antes era válida** → ahora 307, aunque la firma siga siendo
   correcta (la fila está revocada en servidor, no basta con tener un token
   bien firmado).
6. **La prueba central del requisito "invalidable individualmente"**: se
   crearon 2 sesiones simultáneas del mismo admin (2 logins reales, 2
   cookies distintas — simula 2 pestañas/dispositivos). Se cerró sesión en
   una → esa cookie deja de funcionar (307) y **la otra sigue funcionando
   con normalidad (200)**, sin verse afectada.
7. Páginas sin `checkAdminAuth()` propio (`/admin/tienda`, `/admin/empleo`,
   `/admin/admisiones`) siguen protegidas correctamente solo por
   middleware, y `/admin/login` sigue accesible sin cookie.

#### 2. Sanitización del blog — DOMPurify sustituye al regex propio

`lib/sanitize-html.tsx` reescrito sobre `isomorphic-dompurify` (nueva
dependencia — DOMPurify + jsdom para poder correr en servidor, no solo en
navegador). Allowlist explícita (`ALLOWED_TAGS`/`ALLOWED_ATTR`) acotada a lo
que el editor de blog (`components/rich-text-editor.tsx`,
`document.execCommand`) puede generar realmente. De regalo: un hook
(`afterSanitizeAttributes`) añade `rel="noopener noreferrer"` a cualquier
`target="_blank"` — mitiga tabnabbing en enlaces de contenido de usuario,
no pedido explícitamente pero de coste cero al estar ya tocando este
archivo.

Se separó en dos funciones: `sanitizeHtml()` (contenido enriquecido, para
`dangerouslySetInnerHTML` del cuerpo del post) y **`sanitizeToPlainText()`**
(nueva) para `title`/`excerpt` — campos que nunca debieron llevar HTML
"enriquecido" en absoluto, solo texto. Esta segunda función sustituye a
`sanitizeContent()` de `app/api/blog/latest/route.ts`, que era una
**segunda reimplementación con regex ligeramente distinto** del mismo
problema — ahora hay un único sanitizador real, no dos aproximaciones
distintas con sus propias lagunas cada una.

⚠️ **Hallazgo colateral, fuera del alcance de esta pieza (no se tocó)**:
`components/producto/ficha-content.tsx:64` también usa
`dangerouslySetInnerHTML` con `descripcionLarga` (del `RichTextEditor` de
`/admin/tienda`) — mismo perfil de riesgo que el blog (contenido
admin-autorado, mismo editor), sin ningún sanitizado de por medio. No
estaba en el alcance pedido ("sanitización del blog"); queda anotado para
una pasada futura si se decide.

**Verificado con un script temporal** (creado, ejecutado y borrado en la
sesión — no queda en el repo) que reproduce los bypasses EXACTOS de la
auditoría contra la implementación real:
- `<svg/onload=alert(1)>` (sin espacio antes de `onload`, el bypass exacto
  del regex viejo) → eliminado por completo.
- `<a href="javascript:alert(1)">` → el `href` peligroso se elimina, el
  enlace sobrevive sin él.
- `<img src=x onerror=alert(1)>` → `onerror` eliminado, `src` conservado.
- `<iframe src="javascript:...">` → eliminado por completo.
- Contenido legítimo (`<h2>`, `<p><b>`, `<a target="_blank">`, `<ul><li>`)
  **sobrevive intacto**, y el enlace gana `rel="noopener noreferrer"`
  automáticamente.
- `sanitizeToPlainText()` reduce ambos payloads de prueba a solo el texto
  real, sin ninguna etiqueta.

`curl` contra `/blog` en el dev server real: sigue sirviendo 200, el post
real (`holapio`) se sigue renderizando correctamente — sin regresión visual
para contenido legítimo ya publicado.

#### 3. Emails transaccionales — HTML de usuario escapado en los 4 flujos

`lib/escape-html.ts` (nuevo) — `escapeHtml()`, única implementación,
reutilizada en los 4 archivos que interpolaban campos de usuario sin
escapar en plantillas HTML de Resend: `lib/leads-db.ts`,
`lib/candidaturas-db.ts`, `lib/admision-db.ts`, `lib/contact-db.ts`. Cada
campo de texto libre del usuario (`nombre`, `email`, `telefono`,
`mensaje`, `asunto`, `ciudad`, `pais`, `titulacionPrevia`,
`universidadOrigen`...) pasa por `escapeHtml()` antes de entrar en la
plantilla; los saltos de línea se convierten a `<br>` **después** de
escapar, para que esos `<br>` que sí queremos no se escapen también.
Campos ya acotados a un enum validado en servidor (`programaSolicitado`,
`origen`) se escapan igualmente por consistencia, aunque su riesgo real ya
era bajo.

**Verificado de extremo a extremo, no solo revisado a ojo**: auditoría por
`grep` confirmando que **ningún** `${data.X}` dentro de una plantilla
`html:` de los 4 archivos quedó sin pasar por `escapeHtml()`. Envío real a
`POST /api/contact` con un payload malicioso
(`<img src=x onerror=alert(1)>Ataque`, `<script>alert(2)</script>Asunto`,
mensaje con `<svg/onload=alert(3)>`) — confirmado por `psql` que Supabase
almacena el dato **crudo, sin escapar** (correcto: el escape es solo para
la presentación en el email, no debe corromper el dato guardado) — y
reconstruida la plantilla real de `contact-db.ts` con esos datos exactos
para confirmar que el HTML final que llegaría a Resend no contiene ningún
`<img`, `<script>` ni `<svg` sin escapar. Fila de prueba borrada al
terminar.

#### 4. Subida de CV — validación por contenido real (magic bytes)

`lib/validate-cv-upload.ts` (nuevo) — `validateCvFile()`, única
implementación, usada por `/api/empleo/upload-cv` y
`/api/admision/upload-cv` (este último sin consumidor real hoy — el CV se
quitó de `AdmisionModal` en (40) — pero se mantiene funcional y seguro por
si se reactiva). Usa `file-type` (nueva dependencia) para leer la firma
real de bytes del archivo — ya no importa en absoluto lo que el cliente
declare en `file.type`.

⚠️ **Limitación conocida y documentada en el propio código**: el `.doc`
heredado (Word 97-2003) comparte la misma cabecera OLE Compound File
Binary que `.xls`/`.ppt` — `file-type` no puede distinguir entre ellos
solo por la firma de bytes sin parsear el directorio OLE completo. Se
acepta `application/x-cfb` como señal suficiente (prueba que es un
contenedor OLE real, no un script/ejecutable disfrazado), sabiendo que no
garantiza que sea específicamente un `.doc`.

**Verificado con el ataque EXACTO descrito en la auditoría**
(`curl -F "file=@malware.html;type=application/pdf"`): un archivo
HTML/JavaScript real, declarado como `application/pdf`, **ahora se
rechaza** (400, "el tipo de archivo no coincide con su contenido") en
ambos endpoints — antes se habría aceptado y subido a Vercel Blob en
público. Un PDF real con cabecera válida se acepta correctamente
**incluso cuando el cliente declara un `Content-Type` distinto y falso**
(`text/plain`) — prueba de que la validación ya no depende en absoluto de
lo que diga el cliente, solo del contenido real del archivo.

**Verificado en conjunto (las 4 piezas):** `rm -rf .next/types && npx tsc --noEmit`
0 errores, `npx next build` exit 0. `next.config.mjs` sin tocar
(mismo timestamp), servidor de desarrollo confirmado vivo en el puerto
3000, nada desplegado. Ningún archivo temporal de prueba quedó en el
repositorio (confirmado explícitamente al terminar cada punto).

### ✅ Hallazgo colateral cerrado — XSS en la ficha de producto (2026-09-04 (43))

Pedido explícito del cliente al aprobar la Fase 2: no dejarlo pendiente.
`components/producto/ficha-content.tsx:64` renderizaba `descripcionLarga`
(campo del `RichTextEditor` de `/admin/tienda`, mismo editor que el blog)
con `dangerouslySetInnerHTML` sin sanitizar — mismo perfil de riesgo
exacto que tenía el blog antes de (42). Se reutiliza `sanitizeHtml()` tal
cual, sin allowlist nueva (mismo editor, ya calibrada).

**Verificado con los mismos payloads usados para el blog, contra la página
real de un producto real** (`master-bim-full-time`, id 8): su
`descripcion_larga` estaba en `NULL` (confirmado antes de tocar nada), se
puso temporalmente a `<svg/onload=alert(1)>test</svg><p>Descripción real
<b>en negrita</b></p><a href="javascript:alert(2)">enlace malo</a>
<img src=x onerror=alert(3)>`, se comprobó por `curl` contra
`/producto/master-bim-full-time` que ninguno de los 3 vectores
(`onload=alert`, `href="javascript:alert`, `onerror=alert`) sobrevive sin
escapar, que el contenido legítimo (`<p>`, `<b>`) sí se renderiza, y se
**restauró el campo a `NULL`** inmediatamente después — confirmado por
consulta directa que quedó exactamente como estaba, sin ningún dato de
prueba persistente.

### ✅ Fase 3 (bajo) de la auditoría de seguridad — cerrada (2026-09-04 (43))

Los 2 hallazgos bajos, más CSRF y validación de esquema (zod) — el cliente
pidió abordar los 4 juntos en esta fase en vez de dejarlos como mejora
futura, dado que el coste de tocarlo ahora (ya con estos archivos abiertos)
es bajo comparado con dejarlo como deuda indefinida.

#### 1. `console.log` con PII eliminados

`app/api/send-catalog/route.ts`: se quitó **toda** la traza de depuración
`[v0]` (más de 15 líneas, no solo la que la auditoría señaló) — el resto
era ruido de generación sin valor operativo real, y varias de ellas también
exponían el email/nombre del solicitante de forma indirecta (`Body
recibido: {email, name,...}` era la más flagrante, pero no la única). Se
conservan los `console.error` genuinos (fallos reales de lectura de PDF o
de la API de Brevo), sin datos personales dentro — solo `catalogId`
(no es un dato personal) o el objeto de error de la propia API.

`app/api/application/route.ts`: quitadas las 2 líneas que la auditoría
señaló (`Request body received: {firstName, email,...}` y
`Sending confirmation email to ${email}...`), más el resto de trazas
`console.log` puramente informativas sin PII. `console.error`/`console.warn`
genuinos se conservan (fallos de guardado, fallos de envío de email), con
el prefijo normalizado de `[v0]` a `[application]`. **No se tocó nada más
de este archivo** — sigue siendo el flujo antiguo, pendiente de la
decisión de unificación aparte (ver §1/§5).

⚠️ **Hallazgo colateral anotado, no corregido — fuera del alcance de esta
petición** (instrucción vigente de no tocar `/application` salvo lo
explícitamente pedido): al revisar este archivo para quitar los
`console.log`, se confirmó que `generateAdminEmailHTML()`/
`generateConfirmationEmailHTML()` interpolan **todos** los campos del
formulario antiguo sin escapar — exactamente el mismo problema que se
cerró en (42) para los 4 flujos nuevos (leads/candidaturas/admisión/
contacto), pero en el flujo viejo. No se aplicó `escapeHtml()` aquí porque
el cliente pidió explícitamente no tocar `/application` hasta que se
decida su destino (unificar con el flujo nuevo o retirarlo) — mezclar ese
arreglo con esta pieza habría contradicho esa instrucción. Queda anotado
para cuando se resuelva esa decisión pendiente.

#### 2. CSRF — comprobación de origen en `/api/admin/auth`

`lib/verify-origin.ts` (nuevo) — `isSameOriginRequest()`, compara la
cabecera `Origin` (con `Referer` como respaldo) contra el `Host` real de
la petición. Aplicada a `POST` (login) y `DELETE` (logout) de
`/api/admin/auth`, con 403 si no coincide.

**Por qué solo aquí y no en los demás endpoints**: las Server Actions del
proyecto (tienda/empleo/admisión) ya llevan la protección CSRF automática
de Next.js (compara `Origin` contra `Host` de fábrica desde Next.js 14,
sin código propio) — `/api/admin/auth` es el único endpoint que
crea/destruye una sesión autenticada fuera de una Server Action (es un
Route Handler plano), así que es el único sitio donde de verdad hacía
falta añadir la comprobación a mano. Los endpoints públicos
(`/api/leads`, `/api/contact`, `/api/admision`, `/api/empleo/candidatura`)
no la necesitan: no hay ninguna sesión ni acción privilegiada que forjar,
son formularios que cualquiera puede enviar de todos modos — mismo
razonamiento que ya dio la propia auditoría en (40b).

**Verificado con un admin de prueba temporal** (creado y borrado en la
sesión): login sin cabecera `Origin`/`Referer` → 403; login con `Origin`
de un dominio ajeno (`https://evil-attacker.com`) → 403; login con
`Origin` correcto pero credenciales inválidas → pasa el filtro de CSRF y
falla por credenciales (401), confirmando que las dos comprobaciones son
independientes. **Flujo completo real**: login con `Origin` correcto y
credenciales válidas → sesión creada (200) → acceso a
`/admin/dashboard` (200) → intento de logout **sin** `Origin` → 403,
**la sesión sigue viva** (se confirmó volviendo a pedir el dashboard, 200)
— la petición forjada no llegó a revocar nada → logout con `Origin`
correcto → 200 → sesión ya inválida (307). Prueba de que el CSRF check
se ejecuta *antes* de cualquier mutación de estado, no como una capa
cosmética.

#### 3. Validación de esquema (zod) en los endpoints públicos

`lib/api-validation.ts` (nuevo) — `parseJsonBody()`, única implementación,
sustituye el `try { await request.json() } catch {...}` + comprobaciones
sueltas campo a campo que repetía cada endpoint. Aplicado a los 6 endpoints
públicos con cuerpo JSON: `/api/leads`, `/api/contact`, `/api/admision`,
`/api/empleo/candidatura`, `/api/send-catalog`, `/api/admin/auth` (login).
**`/api/application` deliberadamente excluido** — instrucción vigente de
no tocarlo salvo lo pedido explícitamente.

Cada esquema conserva los mensajes de error en español que ya tenía cada
ruta (no se sustituyeron por los genéricos de zod) — el objetivo era subir
la robustez de la validación, no cambiar el contrato que ya consume cada
formulario del cliente.

🔴 **Hallazgo real, no hipotético, encontrado probando el propio cambio**:
`z.string().min(1, "mensaje")` **solo** aplica ese mensaje cuando el campo
llega presente (aunque vacío) — si la clave falta por completo del JSON,
zod devuelve su "Required" genérico antes de llegar a evaluar `.min()`.
Se descubrió probando `/api/contact` sin el campo `mensaje` en el cuerpo:
devolvía `{"error":"Required"}` en vez del mensaje esperado. Corregido con
un helper nuevo, **`stringInput()`** (en `lib/api-validation.ts`), que
envuelve cualquier validador de texto con un `z.preprocess()` que
normaliza `undefined`/`null` a `""` antes de la validación — así un campo
ausente y uno vacío caen siempre en el mismo mensaje personalizado.
Aplicado en los 6 esquemas. Mismo tratamiento para el campo booleano
`rgpdAceptado` de `/api/admision` (con `.refine()` en vez de
`z.literal(true, {message})`, cuyo parámetro `message` no aplicaba el
texto personalizado en esta versión de zod — también descubierto
probando, no asumido).

**Valor real que añade sobre la validación manual anterior, probado, no
solo argumentado**: `/api/leads` con `phone` mandado como número JSON
(`600000000`) en vez de string — la validación manual anterior
(`String(body.phone ?? "").trim()`) lo habría **coaccionado
silenciosamente** a string y aceptado; el esquema zod lo rechaza con
`"Expected string, received number"`, porque ya no hay ninguna conversión
implícita de tipo antes de validar.

**Verificado en los 6 endpoints, cada uno con 3 casos reales**: envío
válido (200, insertado de verdad y borrado tras confirmar por `psql`),
campo obligatorio completamente ausente del JSON (400, mensaje
personalizado correcto — no el "Required" genérico), y un caso de tipo
incorrecto o formato inválido específico de cada endpoint (enum fuera de
rango, RGPD como string en vez de boolean, importe/teléfono con tipo
equivocado). Los 6 mensajes de error coinciden exactamente con los que ya
mostraba cada formulario antes del cambio.

**Verificado en conjunto (las 4 piezas de esta fase + el hallazgo
colateral):** `rm -rf .next/types && npx tsc --noEmit` 0 errores (tras
resolver un problema real de inferencia genérica de TypeScript con los
esquemas anidados de zod — `parseJsonBody<T>(schema: z.ZodType<T>)` no
propagaba bien los tipos a través de `z.preprocess()`; se cambió al patrón
estándar `parseJsonBody<S extends z.ZodTypeAny>(schema: S): z.infer<S>`,
que sí lo resuelve). `npx next build` exit 0. `next.config.mjs` sin tocar,
nada desplegado. Ningún archivo de prueba (ni la ruta temporal de
verificación de precios de la Fase 1, ni ningún script) quedó en el
repositorio.

**Con esto se cierran las 3 fases de la auditoría de seguridad de
(40b)** — crítico, medio y bajo, todos probados de verdad, no solo
argumentados. Retomar el rediseño del formulario de admisión (pausado
desde la Fase 1) es el siguiente encargo.

### Puntos a vigilar (deuda de seguridad conocida)
| Riesgo | Dónde | Nota |
|---|---|---|
| ~~**Contraseña de admin en claro**~~ | ~~`app/api/admin/auth/route.ts`~~ | ✅ **Corregido (2026-09-03 (4))** — ahora bcrypt (coste 12), con migración perezosa de las filas heredadas en texto plano. Detalle completo, incluida la estrategia de migración sin dejar a nadie fuera, más abajo en "Migración a bcrypt" |
| ~~**`/api/blog/upload-image` sin autenticación**~~ | ~~Cualquiera podía subir a Vercel Blob~~ | ✅ **Corregido (2026-09-03 (4))** — gated con `isAdminAuthenticated()`, devuelve 401 sin cookie de sesión válida. Verificado con `curl` sin cookie |
| ~~**`/api/migrate-blog` vacío**~~ | ~~Archivo de 0 bytes que rompía el type-check~~ | ✅ **Borrado (2026-09-03 (4))** |
| ~~`cookies()` sin `await`~~ | ~~`admin-auth/route.ts`, `lib/admin-auth.ts`~~ | ✅ **Corregido (2026-09-03 (2))** — `lib/admin-auth.ts` fallaba en runtime de verdad (`TypeError`), no solo un aviso de tipos; ver §2 |
| ~~**`verifySecretKey()` de `app/blog/actions.ts` seguía en texto plano**~~ | ~~`app/blog/actions.ts`~~ | ✅ **Corregido (2026-09-03 (6))** — la migración a bcrypt de (4) solo tocó el login (`/api/admin/auth`); esta segunda comparación, independiente y duplicada, se quedó comparando en claro contra un hash ya migrado. Efecto real: crear/editar/borrar posts empezaba a fallar con "Clave secreta inválida" en cuanto un admin iniciaba sesión, aunque tecleara la contraseña correcta. Detectado al auditar el CRUD de blog antes de construir el panel de tienda — la tabla `admin_users` estaba vacía en producción, así que no llegó a afectar a nadie real. Arreglado extrayendo la verificación a `lib/admin-secret.ts` (`verifyAdminSecret`), única implementación compartida por login y Server Actions — ver "Migración a bcrypt" más abajo |
| ~~**`deleteBlogPost(slug, secretKey)` con argumentos posicionales**~~ | ~~`components/blog-posts-table.tsx`~~ | ✅ **Corregido (2026-09-03 (6))** — la función espera un único `FormData`; era el `TS2554` que arrastrábamos como "preexistente" desde el principio de la sesión. No era solo un error de tipos: el botón de borrar del panel estaba roto en runtime. Verificado con Chrome real: crear y borrar un post de prueba a través de la UI |
| **Claves de Supabase expuestas, rotación pospuesta a propósito** | `anon` key y `service_role` key, ver §0 | Aparecieron en la salida de una herramienta durante una sesión anterior. Pasos de rotación entregados al cliente; **decisión explícita del cliente de esperar a cerrar el trabajo de base de datos pendiente antes de rotar** — no es una tarea olvidada, no insistir hasta entonces |

### Migración a bcrypt (2026-09-03 (4))

`app/api/admin/auth/route.ts` comparaba `password_hash` en texto plano
(`WHERE password_hash = secretKey`, sin hashing real). Corregido con
`bcryptjs` (coste 12) — **sin dejar a ningún admin fuera del panel durante
la transición**, sin script de migración aparte y sin ventana de
mantenimiento:

- El login no busca por usuario (el formulario solo pide una "clave
  secreta"), así que recorre las filas de `admin_users` y compara cada
  `password_hash` contra la clave introducida.
- Si el valor ya es un hash bcrypt (empieza por `$2a$`/`$2b$`/`$2y$`), se
  verifica con `bcrypt.compare()`.
- Si **no** lo es (fila heredada, todavía en texto plano), se acepta la
  comparación literal **una última vez** y esa misma fila se sustituye por
  su hash bcrypt en el mismo request, antes de responder. En la práctica:
  cada admin migra su propia contraseña la primera vez que vuelve a entrar
  después de este cambio, de forma transparente — no hace falta pedirle a
  nadie que cambie de clave ni ejecutar nada contra la base de datos.
- Verificado de extremo a extremo con una fila de prueba real (creada y
  borrada en la sesión): 1) login con la clave en texto plano → éxito y la
  columna pasa a `$2b$12$...`; 2) segundo login con la misma clave → éxito,
  esta vez por la ruta bcrypt; 3) clave incorrecta → rechazada.
- Dependencia añadida: `bcryptjs` (implementación en JS puro, sin bindings
  nativos — evita el tipo de problema de compilación que ya tuvo `sharp` en
  este proyecto, ver §6). No se instaló `@types/bcryptjs`: bcryptjs 3.x trae
  sus propios tipos, el paquete de types es un stub obsoleto.

🔴 **La comparación en sí vivía duplicada** en `/api/admin/auth/route.ts` y
en `verifySecretKey()` de `app/blog/actions.ts` (usada por
crear/editar/borrar posts). Esta migración (4) solo arregló la primera
copia — la segunda se quedó comparando en texto plano contra un hash ya
migrado, así que el CRUD de blog empezaba a fallar en cuanto un admin
iniciaba sesión. Detectado y corregido en (6), al auditar qué se podía
reutilizar antes de construir el panel de tienda. **Extraído a
`lib/admin-secret.ts` → `verifyAdminSecret(secretKey): Promise<number | null>`**,
la única implementación de esta comparación en todo el proyecto — tanto el
login como `verifySecretKey()` (blog) la llaman, y **cualquier Server
Action nueva de tienda debe hacer lo mismo, nunca reimplementar la
comparación**.

**Regla:** no metas secretos en componentes `"use client"`, ni en `NEXT_PUBLIC_*`,
ni en logs. `console.log` de este proyecto usa prefijo `[v0]`/`[MOCK]`; revisa que
no imprima cuerpos de petición con datos personales.

---

## 5. Consistencia de diseño

### Tokens de marca (`app/globals.css`)
```css
--color-brand:         #006cff;  /* azul IDESIE. NO cambia en modo oscuro */
--color-brand-strong:  #0052cc;  /* hover / degradados */
--color-paper:         #f2ede4;  /* neutro cálido. NO cambia en modo oscuro */
--color-paper-strong:  #e5dccd;
--primary:             #006cff;  /* sí cambia en modo oscuro */
```

**`--color-paper`** (añadido 2026-09-01) es un token de marca fijo, no un color
de tema. **Su función es dar respiro tonal entre bloques oscuros.** Nació en el
M4 del recorrido de programa pero es reutilizable en cualquier sección que
necesite alivio. Úsalo con `bg-paper` / `text-paper`; **no copies el hex**.

**Su par oscuro es `gray-950`**, el mismo que usan M3 y M6. **No introduzcas un
segundo negro** en las páginas de programa.

**Tokens del header de cristal** (`--nav-glass-*`, añadidos 2026-09-02): viven en
`:root` y `.dark` de `globals.css` y los consume `.glass-nav` / `.glass-panel`.
**La opacidad no es una preferencia estética, es una restricción de contraste** —
ver §5 «Header flotante de cristal».
**Usa `--color-brand` cuando el azul deba ser siempre el azul de marca**
(insignias, acentos, degradados de CTA). Usa `--primary` cuando deba adaptarse al
tema. Existe también `--admin-accent` para el panel de administración.

⚠️ **Deuda:** hay muchísimo `#006cff` **hardcodeado** por las páginas (sobre todo
en las de programa y en `admision-section.tsx`). Al tocar una página, sustituye
los literales por el token. No hagas un reemplazo masivo a ciegas.

### Patrones establecidos — reutilízalos, no reinventes
| Patrón | Dónde está | Uso |
|---|---|---|
| **Badge de marca** | `mbim-page` h1 | `bg-[#006cff] text-white px-3 py-1 rounded-lg` sobre una palabra del titular |
| **Card con borde izquierdo** | `admision-section.tsx`, FAQ | `border-l-4 border-[#006cff] bg-gray-50 rounded-r-lg` |
| **Card de módulo** | `ModuleCard` en `mbim-page` | `rounded-2xl` + `hover:-translate-y-2` + número gigante en marca al 20 % de opacidad |
| **Hero de página** | Todas las páginas de programa | Imagen `fill` + `bg-gradient-to-t from-black/70 to-black/40` + texto blanco centrado |
| **Banda de cifras** | `mbim-page` | Fondo `bg-primary`, grid 2/4 columnas, número `font-black` |
| **Acordeón** | FAQ y `admision-section` | `useState` + `<ChevronDown>` que rota 180° |
| **Sección CTA final** | Todas las páginas | `bg-primary`, texto centrado, un solo botón |

### /landing — página de venta de los 4 másteres, CON PLACEHOLDERS PENDIENTES (2026-09-02)

Página nueva, no un rediseño de una existente. Vende los 4 másteres a la vez
(a diferencia de las páginas de programa, que venden uno cada una). Estructura
pedida explícitamente por el cliente, 6 secciones:
1. Hero con vídeo · 2. Argumentos de fuerza · 3. Testimonios (vídeo) ·
4. Los 4 másteres (comparativo) · 5. Refuerzo (garantía + FAQ) ·
6. Los 4 másteres otra vez (cierre/conversión).

**Archivos:** `app/landing/page.tsx` (server, metadata) +
`landing-client.tsx` + `landing-content.ts` (contenido, con el resumen de
huecos pendientes en su cabecera). Componentes en `components/landing/`.

#### 🔴 Placeholders deliberados — instrucción explícita del cliente de NO inventar ni buscar contenido real
No es deuda técnica ni un olvido: el cliente pidió expresamente dejar estos
huecos señalizados en vez de rellenarlos con contenido inventado o sin
verificar. **Antes de dar la página por publicable, hay que resolver:**

| Hueco | Dónde | Qué hace falta |
|---|---|---|
| ~~Vídeo del hero~~ | ~~`components/landing/hero-section.tsx`~~ | ✅ **Resuelto en (27), reemplazado en 2026-09-04 (28)** — vídeo nativo de Cloudflare R2 (`<video>` HTML, sin iframe) vía `HeroVideo`, no YouTube (esa fue la versión de (27), retirada por completo — `hero-video-gate.tsx` y `lib/youtube-api.ts` ya no existen). Ver "Vídeo bloqueante del hero" más abajo |
| ~~3 vídeos de testimonios~~ | `components/landing/testimonials-section.tsx` | ✅ **Resuelto por completo (2026-09-04 (37))** — Carolina Larrahona (33, `RES1.mp4`), Omar Pérez Ruiz (36, `VID2.mp4`), Agustina Mingrone (37, `VID3.mp4`), los 3 vídeo real de Cloudflare R2, sin `VideoFacade` (es de Vimeo, no aplica) — ver "Primer/Segundo/Tercer testimonio real" más abajo. El aviso "⚠ Sección de ejemplo..." desaparece solo (era condicional a `pendingCount > 0` desde (33), nunca hizo falta tocar ese texto) |
| 3 citas de testimonios + nombres + programa cursado | `app/landing/landing-content.ts`, array `testimonials` | Texto real, ninguno existe hoy |
| Número de empresas de la red colaboradora | Se omitió a propósito en `strengths` | `mbim-content.ts` se contradice entre "+40 empresas líderes" y "+200 empresas" para lo que parece el mismo dato — pide la cifra correcta antes de afirmar ninguna |
| Conexión real del formulario de solicitud de información | `components/landing/info-request-modal.tsx` | Hoy solo simula el envío (`setTimeout` + éxito) y hace `console.log` — falta decidir destino real (email/CRM/BD) |

**El precio ya no aparece en esta página** (se retiró a petición del cliente en
la segunda pasada, ver más abajo), así que el hueco que hubo sobre el precio
sin confirmar del Máster BIM Online (3.800 €) dejó de aplicar aquí — sigue
pendiente en su propia página (`/mbim-online-page`), no en `/landing`.

`VideoPlaceholder` (`components/landing/video-placeholder.tsx`) reproduce a
propósito el mismo lenguaje visual que `VideoFacade` (botón de play, incluso
`fill-brand`) pero **inerte**, con una insignia "VÍDEO PENDIENTE" y borde
punteado — así se detecta a simple vista que no es contenido final, no solo
en el código. La sección de testimonios completa lleva además un aviso en
pantalla (no solo en comentarios) de que es una sección de ejemplo.

#### Ajustes tras la primera versión (2026-09-02, segunda pasada)
El cliente pidió 5 cambios sobre la primera versión de `/landing`:

1. **Hero reescrito**: mucho menos texto (solo eyebrow + titular + un CTA),
   titular nuevo *"Añade competencias a tu currículum"*, y el vídeo pasa a
   ir **debajo** del titular (apilado), no al lado ni de fondo. Animado con
   `SplitText` palabra a palabra — el único otro sitio del proyecto que usa
   SplitText es `components/programa/closing-cta.tsx`; aquí se usa también
   en el titular porque esta página tiene permiso explícito para animar más
   fuerte.
2. **Sin `Header` del sitio.** Es la única página del proyecto sin el menú
   compartido — en su lugar, una barra mínima con el logo (sin `Link`, no
   navega a ningún sitio). `FooterSection` se mantiene (no se pidió
   quitarlo; si se quiere una landing 100 % sin salidas, es lo siguiente a
   revisar). ✅ **Hecho en 2026-09-04 (32)** — `FooterSection` se quitó del
   todo, ver "Sin footer en /landing" más abajo.
3. **Más dinamismo en toda la página**, no solo el hero: entradas con
   `back.out()` y rotación alterna en vez de simples fundidos, botones
   magnéticos (`useMagnetic`, ya existente) en los CTA principales, un pulso
   continuo en el CTA final y en el icono de garantía. Añadido por iniciativa
   propia (no pedido explícitamente, fácil de quitar): una barra flotante de
   conversión (`components/landing/sticky-cta-bar.tsx`) que aparece tras
   pasar el hero.
4. **Precio retirado** de las tarjetas de máster en ambas secciones (4 y 6).
   `MasterCard` ya no tiene los campos `price`/`priceUnverified`/`href` —
   se eliminó el dato en vez de dejarlo sin usar.
5. **Todos los CTAs abren `InfoRequestModal`** en vez de enlazar a las
   páginas de programa: hero, las 8 tarjetas de máster (secciones 4 y 6), el
   cierre y la barra flotante. El modal es un único componente controlado
   desde `landing-client.tsx`, con un `context` (qué botón lo abrió) que
   viaja como campo oculto del formulario — así se puede saber el origen del
   lead sin que el formulario cambie según el máster.
   Formulario: nombre, apellidos, teléfono, correo, fecha (cualquier día,
   `min` en hoy) y hora (franja fija 10:00–19:00 en horas exactas, hora
   española — 10 opciones). Validación real en el cliente. **🔴 TODO: el
   envío no está conectado a nada real** — `handleSubmit` simula el envío
   (`setTimeout` + estado de éxito) y solo hace `console.log`. El comentario
   junto al TODO en `info-request-modal.tsx` apunta a `lib/sql.ts` y
   `app/api/send-catalog/route.ts` como referencia del patrón que ya usa el
   resto del proyecto para decidir el destino real (email/CRM/BD).
   Decisión no explícita en el encargo: los enlaces de texto pequeños que no
   son "botones principales" (*"Ver la comparativa completa"*, *"Ver todas
   las opciones"* de financiación) se dejaron como enlaces reales a sus
   páginas — no se interpretó que "todos los CTAs" incluyera enlaces
   informativos en línea.

#### Lo que sí es real (fuente indicada junto a cada dato en `landing-content.ts`)
Duración y precio de MBIM (15.000 €), MBBE (15.000 €) y EMBIM (18.000 €),
verificados contra el FAQ de precio de cada `*-content.ts`. Acreditación
Cualificam/Madri+d/ENQA/EQAR. "+500 profesionales formados desde 2012"
(metadata de `app/page.tsx` y `sobre-idesie-page`). Financiación real
(pago fraccionado, becas hasta 50 %, Banco Sabadell/CaixaBank) — de
`financiacion-y-becas-page`, verificado en cuerpo, no solo en metadata.

**Deliberadamente NO se usa como argumento universal:** "Learning by
Working" (el EMBIM no lo tiene) ni ninguna cifra de empleabilidad (varía:
MBIM 95 %, MBBE 100 % verificado, EMBIM y Online sin cifra) ni "100 %
empleabilidad" (esa frase aparece en el metadata de `app/page.tsx` y de
`nuestra-metodologia-page`, pero **contradice los datos reales por
programa** — es una imprecisión preexistente del sitio, no se propaga aquí).
El FAQ de la sección 5 responde con honestidad "depende del programa" en vez
de uniformar estas diferencias.

**Reutilizado tal cual, sin inventar un cuarto vocabulario CSS:** esta
página no tiene una identidad narrativa propia que proteger (es un
agregador de venta, no una página de programa), así que usa directamente
`.faq-panel` (el acordeón ya genérico) y los tokens de marca compartidos, en
vez de duplicar un vocabulario `.landing-*` como si fuera una cuarta familia
visual.

### 🎬 Vídeo bloqueante del hero de /landing (2026-09-04 (28) — reemplaza la versión de YouTube de (27))

(27) integró el vídeo del hero vía YouTube (IFrame Player API) con el resto
de la página deshabilitado casi por completo mientras no se veían 60s
reales. Un día después, nuevo encargo del cliente: el vídeo pasa a ser un
`<video>` HTML nativo servido desde **Cloudflare R2** (sin iframe, sin
librería), en autoplay silencioso y bucle, y el tratamiento del resto de la
página cambia de "casi invisible" a **visible mientras se ve, borrosa + con
un velo oscuro encima** — el usuario intuye que hay contenido real
esperando, en vez de una pantalla vacía. **Toda la infraestructura de (27)
específica de YouTube se retiró por completo** (`hero-video-gate.tsx` y
`lib/youtube-api.ts` ya no existen) — no queda como código muerto.

#### 🔴 Hallazgo antes de tocar nada: el vídeo pesa ~162 MB
`curl -I` contra la URL real (`.../VIDEO%20LANDING.mp4`) confirma
`Content-Length: 170217788` — unos **162 MB**, servidos con `Accept-Ranges:
bytes` (al menos permite descarga progresiva, no hay que bajarlo entero
antes de reproducir) pero aun así enorme para un vídeo de hero con
`autoPlay`: un vídeo bien comprimido para web de esta duración suele pesar
5-20 MB. Con autoplay, **cualquier visitante en móvil consume ese dato nada
más entrar**, y en conexiones lentas puede no reproducirse con fluidez. Se
integró tal cual pide el encargo (la URL es la que es, no se sustituyó nada
por iniciativa propia) pero quedó avisado explícitamente al cliente antes
de dar la pieza por terminada — **recomendación pendiente de decisión del
cliente**: volver a exportar el vídeo con una compresión razonable (H.264,
bitrate moderado, 1080p es más que suficiente para el tamaño que ocupa en
la página) antes de publicar esto de verdad.

#### ⚠️ Mismo aviso honesto que en (27), sigue aplicando: esto no puede ser 100% infalible
El encargo pedía que el tracking "no se pueda saltear (manipular
`localStorage`, dev tools, etc.)". Sigue sin ser alcanzable con una
solución puramente de cliente — sin sesión de servidor para un visitante
anónimo de una landing, no hay forma de verificarlo al 100% sin añadir
autenticación (fuera de alcance). Se mantiene la misma disciplina de (27):
el avance se mide a partir del propio `currentTime` real del elemento
`<video>` (evento `timeupdate`), no de un cronómetro de cliente ingenuo.

**Archivos:**
- `components/landing/hero-video.tsx` (nuevo, sustituye a
  `hero-video-gate.tsx`) — `<video autoPlay muted loop playsInline>` con
  los atributos en camelCase tal como pide React/JSX. **Necesita
  `"use client"`**: no por el `<video>` en sí, sino por el botón de
  pausa/reproducción manual y el seguimiento de progreso (refs, estado,
  manejadores de eventos) — sin un control de pausa, "si el usuario pausa
  se pausa el contador" no tendría ninguna forma de dispararse, así que se
  añadió un botón discreto de play/pausa en la esquina del vídeo.
  - El seguimiento usa el evento nativo `timeupdate`: en cada disparo se
    compara `currentTime` con el valor anterior y solo se contabiliza un
    delta positivo y ≤1s — un salto hacia atrás (el vídeo volviendo a 0 al
    hacer bucle) o hacia delante grande (adelantar manualmente) no cuenta
    como "visto". Al pausar, el navegador dejar de disparar `timeupdate`
    con avance real, así que el contador se congela sin lógica aparte.
  - También recibe `pulseSignal` (número que sube cada vez que
    `landing-client.tsx` detecta un intento de scroll estando bloqueado) y
    lo traduce en una clase CSS temporal (`.hero-video-pulse`, un
    escala+tilt sutil de 0,5s) sobre el marco — nunca remonta el
    `<video>`, eso reiniciaría la reproducción real.
- `components/landing/gated-content.tsx` (reescrito) — ya no atenúa casi
  hasta la invisibilidad: ahora `filter: blur(9px)` sobre el contenido real
  (sigue siendo `inert` + `pointer-events: none`, el bloqueo de verdad
  sigue siendo el scroll deshabilitado) más un velo `.gated-scrim` propio
  (`rgb(0 0 0 / 0.38)`) que se funde a `opacity: 0` al desbloquear —
  "fade-out suave" tal como pedía el encargo.
- `components/landing/video-gate-banner.tsx` (reescrito) — sigue siendo la
  única superficie con el mensaje ("Mira el vídeo para continuar" /
  "Dale al play para seguir viendo" si está en pausa) y el progreso
  (`Ns/60s` + barra), fija en la parte inferior — se mantiene separada del
  velo sobre las secciones (ver el comentario en `gated-content.tsx`): con
  el scroll bloqueado, el hero puede ocupar toda la ventana visible y dejar
  las secciones borrosas fuera de vista, así que un mensaje "encima" de
  ellas podría no llegar a verse nunca; la franja fija sí está garantizada.
- `app/landing/landing-client.tsx` — añade el detector de intentos de
  scroll estando bloqueado (`wheel`/`touchmove`/`keydown` de flechas,
  espacio, Page Up/Down, Home/End, con cooldown de 700ms para no disparar
  decenas de veces en un gesto continuo) que incrementa `pulseSignal`. El
  resto del cableado (scroll bloqueado con `overflow: hidden` +
  `lenis.stop()/.start()`, estado en `sessionStorage`, nunca
  `localStorage`) se conserva igual que en (27).

**`components/landing/hero-section.tsx`**: mismo contenedor ensanchado
(`max-w-5xl`, fuera del `max-w-4xl` del texto) que en (27), para que el
vídeo se lea "hero-sized".

**Verificado:** `npx tsc --noEmit` en 0 errores. `npx next build` exit 0,
`/landing` prerenderizada como estática. HTML servido verificado por
`curl`: el `<video>` real con sus 4 atributos (`autoPlay`, `muted`, `loop`,
`playsInline`) y el `src` de Cloudflare R2 están en el marcado servido,
`gated-content-locked`/`gated-scrim` presentes, cero referencias residuales
a YouTube en el HTML. URL del vídeo verificada con `curl -I` (200,
`video/mp4`, ~162 MB — ver el hallazgo de arriba). ⚠️ **No se pudo
verificar la interacción real con Chrome** (reproducción automática, pausa
manual, avance del contador, desbloqueo a los 60s, pulso al intentar hacer
scroll, persistencia en `sessionStorage`) — la extensión de Claude in
Chrome seguía sin conectarse en esta sesión. Pendiente de que el cliente lo
pruebe en `localhost:3000/landing` antes de darlo por definitivo, tal como
pidió explícitamente.

### 🔙 Rediseño de /landing con skills externas — probado y revertido (2026-09-04 (29))

Encargo del cliente: instalar dos skills externas de terceros
(`github.com/2389-research/landing-page-design` y `github.com/borghei/
Claude-Skills`), cambiar el vídeo del hero de `VIDEO LANDING.mp4` a
`VIDLAN1.mp4` (mismo archivo de 162 MB, solo renombrado — mismo `ETag`,
confirmado con `curl -I`), y usar ambas skills para mejorar el copy y la
estructura de la landing. **El cliente pidió revertir esta pieza en el
mismo turno**, antes de aprobarla — este apartado documenta qué se probó y
por qué se deshizo, no queda nada de ello en el código.

**Lo que se instaló:** el primer repo era una skill real y bien formada
(Vibe Discovery + estrategia de copy). El segundo **no era una sola skill,
sino un marketplace de 368 skills en 20 dominios** (legal, RRHH, finanzas,
ingeniería...) — la pieza relevante era solo
`marketing/landing-page-generator/SKILL.md` (frameworks PAS/AIDA/BAB +
checklist de conversión + 3 scripts Python de verificación). No se pudo
confirmar que el harness detectara ninguna de las dos como skill invocable
en la misma sesión donde se clonaron (añadir carpetas a `~/.claude/skills/`
en caliente no garantiza recarga sin reiniciar sesión) — se leyó y aplicó
su contenido directamente en su lugar.

**Lo que se cambió y se revirtió** (contenido exacto restaurado a mano, sin
`git` — **este proyecto no es un repositorio git**, confirmado desde el
inicio de la sesión, así que no hay `git revert` posible; se reconstruyó
cada archivo desde el registro de la propia conversación):
- `app/landing/landing-content.ts`: titular/subtítulo del hero reescritos
  aplicando el test de la skill 1 ("¿sabrías qué vendemos viendo solo el
  titular?"), CTA de cierre reformulado. Revertido al titular original
  ("Añade competencias a tu currículum").
- `components/landing/strength-points.tsx`: la tarjeta de "Acreditación
  oficial" destacada visualmente (más grande, `col-span-2`) sobre las otras
  3. Revertido a las 4 tarjetas con el mismo peso.
- `components/landing/masters-comparison.tsx`: el botón de cada máster
  pasaba de "Solicitar información" (genérico ×4) a "Más información del
  MBIM/MBBE/..." (personalizado). Revertido.
- `components/landing/how-it-works.tsx`: sección nueva de 3 pasos, añadida
  tras detectar con el script `conversion_checklist.py` de la skill 2 que
  faltaba explicar qué pasa después de pedir información. **Borrada por
  completo**, no queda como código muerto.
- `components/landing/info-request-modal.tsx`: botón de envío con
  `magnetic`, y un enlace a la política de privacidad añadido tras el mismo
  checklist (hallazgo real: el formulario pide datos personales sin enlazar
  la política cerca). Ambos revertidos.
- `app/landing/landing-client.tsx`: import/uso de `HowItWorks` y el paso de
  `subtitle` al hero. Revertido.

**Lo que SÍ se mantiene**, tal como pidió el cliente explícitamente:
- El vídeo apunta a `VIDLAN1.mp4` (`components/landing/hero-section.tsx`,
  constante `HERO_VIDEO_SRC`) — es el único cambio de esta sesión que
  sobrevive.
- Todo el sistema de bloqueo de (28) intacto: blur + velo sobre las
  secciones, franja de progreso, pulso al intentar hacer scroll,
  `sessionStorage`, verificado de nuevo por `curl` tras el revert
  (`gated-content-locked` y el mensaje de la franja siguen presentes en el
  HTML servido).

**Skills eliminadas del todo**: `rm -rf` sobre las dos carpetas en
`~/.claude/skills/` — confirmado que ninguna de las dos queda en disco. No
se puede confirmar desde aquí que "ya no aparecen en la lista de skills de
la próxima sesión" más allá de que, al no existir los archivos, no hay nada
que ningún mecanismo de escaneo pueda detectar.

**Verificado tras el revert:** `npx tsc --noEmit` 0 errores, `npx next
build` exit 0, `/landing` estática. HTML servido comparado explícitamente
contra el estado (28): titular original presente, titular de las skills
ausente, sección "Cómo funciona" ausente, texto de botón personalizado
ausente, sistema de bloqueo (vídeo, blur, franja de progreso) presente y
sin cambios.

### Secciones 3 (Testimonios) y 4 (Los 4 másteres) de /landing — rediseño visual (2026-09-04 (30))

Encargo del cliente, explícitamente **solo diseño/animación, cero cambios
de contenido o texto** — auditoría + 1 dirección propuesta por sección,
aprobada antes de construir. `frontend-design-anthropic` aplicada
directamente; `website-rebuild`/`theme-factory` no encajan mecánicamente en
este codebase (mismo motivo ya documentado en sesiones anteriores: uno
reconstruye sitios completos desde una URL a Astro, el otro tematiza
artifacts independientes) — se aplicó su espíritu (jerarquía/estructura,
tokens reutilizables) manualmente en su lugar.

**Sección 3 — Testimonios** (`testimonials-section.tsx`,
`video-placeholder.tsx`): seguía siendo, y sigue siendo, una sección
100% pendiente de contenido real — el aviso "⚠ Sección de ejemplo..." no se
tocó, ni una palabra. Lo que cambió es solo cómo se presenta el hueco:
- Una marca de comillas gigante decorativa de fondo (`data-quote-mark`,
  texto plano en `font-black`, nunca `font-serif` — no se introduce una
  fuente nueva solo para un glifo decorativo, se mantiene Inter) le da
  presencia a la sección sin depender de tener una cita real.
- `VideoPlaceholder` gana un barrido de brillo (`.video-placeholder-shimmer`,
  gated por completo dentro de `@media (prefers-reduced-motion: no-preference)`
  — con movimiento reducido no se crea ni el pseudo-elemento) que comunica
  "en preparación" en vez de "hueco vacío". Único consumidor del componente
  hoy (verificado por grep antes de tocarlo), así que el cambio no afecta a
  nada más.
- Las 3 tarjetas ganan numeración 01/02/03 en mono — antes eran fotocopias
  idénticas sin ningún elemento que las distinguiera entre sí.

**Sección 4 — Los 4 másteres** (`masters-comparison.tsx`): mismos datos
reales, mismo texto, mismo botón hacia `InfoRequestModal`. Cambios:
- Cada tarjeta gana `.journey-surface`/`.journey-surface-light` (esquina
  superior derecha cortada + sombra teñida de azul) — motivo genérico ya
  establecido en el sitio (páginas de programa), reutilizado aquí por
  primera vez en `/landing`, no inventado de nuevo.
- Número de programa (01-04) grande de fondo, semitransparente, recortado
  por el propio `overflow-hidden` de la tarjeta.
- Barra de acento a la izquierda que se dibuja (`scaleY` 0→1 con
  `ScrollTrigger`) al entrar en pantalla — mismo mecanismo de "carril que se
  dibuja" que ya usan otras piezas del sitio.
- Etiqueta de modalidad más prominente (`Presencial`/`Ejecutivo`/`100 %
  online`) — dato ya real en `m.modality`, solo extraído y mostrado con más
  peso visual, no un dato nuevo.
- Los 4 botones ganan `magnetic` — antes eran los únicos CTA de toda la
  página sin ese detalle.

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0,
`/landing` estática. HTML servido comprobado por `curl`: comilla decorativa
y numeración 01-03 presentes en Testimonios, aviso "Sección de ejemplo"
intacto, `.journey-surface` presente en las 4 tarjetas de máster, las 3
etiquetas de modalidad reales (Presencial ×2, Ejecutivo, 100% online),
`data-magnetic="on"` confirmado en los 4 botones de máster (recuento inicial
con `grep -c` engañoso por ser una sola línea de HTML — recontado con
`grep -o | wc -l`, correcto: 4). Texto de ambas secciones verificado
carácter por carácter idéntico al de antes del rediseño. Sistema de
bloqueo de vídeo (28) sin tocar, confirmado de nuevo por `curl`.

### Skill `web-design-guidelines` (Vercel) instalada — auditoría + implementación de hallazgos en Secciones 3-4 (2026-09-04 (31))

Encargo del cliente: instalar **solo la carpeta `03-web-design-guidelines`**
de `github.com/lotfb86/web-design-skills` (no el resto del paquete),
auditar las secciones 3 y 4 de `/landing` con ella, y — tras confirmación
explícita — implementar los hallazgos.

**Instalación**: `git clone --filter=blob:none --sparse` a un directorio de
scratch, `git sparse-checkout set 03-web-design-guidelines`, y solo esa
carpeta (un único `SKILL.md`) se copió a
`~/.claude/skills/web-design-guidelines/` — el clon temporal se borró
después. Nada más del paquete de origen se instaló.

**Qué es de verdad**: un envoltorio fino (autor: Vercel) que no trae reglas
embebidas — en cada uso hace `WebFetch` a
`raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
y aplica lo que encuentre ahí (accesibilidad, formularios, animación,
tipografía, rendimiento, i18n...). Compatible sin fricción con Next.js +
Tailwind + el sistema de tokens del proyecto — las reglas son de
comportamiento HTML/CSS, no asumen ninguna metodología CSS concreta.
**Fuera de su ámbito**: no dice nada sobre jerarquía visual ni sobre
patrones de composición tipo "grid de pricing SaaS" — esas preguntas se
respondieron con criterio propio, no con una regla del skill.

**Hallazgos aplicados** (auditoría completa con verdicto ✓/✗ por regla
entregada al cliente antes de escribir código, no repetida aquí):
- `components/landing/video-placeholder.tsx` — `aria-hidden="true"` en los
  iconos `Film`/`Play` (decorativos junto a texto visible).
- `app/globals.css`, `.video-placeholder-shimmer` — reescrito de animar
  `background-position` (no compositor-friendly, viola la regla de
  animación) a animar `transform: translateX()` sobre una banda de
  gradiente más estrecha que el contenedor. De paso, ralentizado (3.2s→6.5s)
  y con pausas al inicio/final del recorrido — un shimmer rápido y continuo
  es el lenguaje visual estándar de un skeleton-loader real ("cargando
  ahora mismo"), y aquí no hay ningún proceso cargando; el barrido debe
  leerse como textura ambiental, no como una promesa de carga que nunca se
  cumple. El aviso "Vídeo pendiente" y "Sección de ejemplo" no se tocaron.
- `components/landing/testimonials-section.tsx` — `text-balance` en el
  `<h2>`; entrada por scroll con más carácter (escala 0.82→1, rotación
  ±6° en vez de ±4°, `back.out(1.9)` en vez de `back.out(1.5)`).
- `components/landing/masters-comparison.tsx` — `text-balance` en el
  `<h2>`; `tabular-nums` en el `<dl>` de Duración/Modalidad (es
  exactamente el caso que la regla describe: "columnas de
  números/comparaciones").

**Variación de color por modalidad (Sección 4)** — la única pieza que
esperó confirmación explícita antes de escribirse. Se comprobó primero si
ya existía una convención en el sitio: sí, parcial —
`/comparativa-masters-page` ya usa verde para "Online" y azul para todo lo
demás (sin distinguir Ejecutivo, que ahí queda etiquetado "Presencial").
Paleta aprobada por el cliente:
| Modalidad | Color | Origen |
|---|---|---|
| Presencial (MBIM, MBBE) | `bg-brand` | Token de marca ya existente |
| Ejecutivo (EMBIM) | `bg-secondary` | Token `--secondary` (#ffba08) ya definido en `globals.css` desde el principio del proyecto, apenas usado hasta ahora — ningún color nuevo inventado. Se evitó el morado/violeta típico de "tier premium" en SaaS a propósito (el propio anti-patrón que `frontend-design-anthropic` pide evitar) |
| Online | `bg-green-600`/`green-100`/`green-700` | Mismo verde que ya usa `/comparativa-masters-page` para la misma modalidad — no un tono ligeramente distinto que generaría inconsistencia entre páginas |

`getModalityCategory()` deriva la categoría desde `m.modality` (dato ya
real, el mismo que ya usaba la etiqueta de la tarjeta) — no se añadió
ningún campo nuevo a `landing-content.ts`. Aplica a la barra de acento, la
etiqueta de modalidad y el número de fondo de cada tarjeta.

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0,
`/landing` estática. HTML servido comprobado por `curl`: `text-balance` ×2,
`tabular-nums` ×4 (una por tarjeta), `aria-hidden="true"` presente en los
iconos del placeholder, las 4 barras de acento con su color real (2 azul,
1 ámbar, 1 verde — coincide exactamente con MBIM/MBBE=Presencial,
EMBIM=Ejecutivo, Online=Online), texto de ambas secciones verificado
idéntico al de antes, sistema de bloqueo de vídeo (28) sin tocar.
`next.config.mjs` sin tocar, nada desplegado, ninguna otra skill instalada
o borrada.

### Sin footer en /landing — solo un enlace legal mínimo (2026-09-04 (32))

Encargo del cliente: `/landing` deja de llevar `<FooterSection />` (logo,
redes sociales, copyright, enlaces a todo el sitio) — coherente con que es
huérfana a propósito (noindex/nofollow, sin `Header`, exclusiva para
tráfico de campañas de pago). En su lugar, un único `<p>` centrado al
final del documento con un solo enlace legal, `target="_blank"
rel="noopener noreferrer"` para no sacar al visitante del flujo de
conversión — **nunca un `<footer>`**, es texto suelto sin bloque ni
estructura de navegación propia.

**Comprobado antes de escribir nada**: el sitio **no tiene una página de
"Términos" separada** — solo existen `/aviso-legal-page`,
`/politica-privacidad-page`, `/politica-cookies-page` y
`/solicitud-baja-page`. `/aviso-legal-page` ya incluye una sección "3.
CONDICIONES DE USO" con los términos de uso del sitio — es una sola página
que cubre ambos conceptos, así que basta un enlace ("Términos y aviso
legal" → `/aviso-legal-page`), sin separador — el encargo ya contemplaba
este caso y no hizo falta preguntar.

`app/landing/landing-client.tsx`: se quitó el `import FooterSection` y su
uso; nada más del archivo cambió — el vídeo bloqueante, el `GatedContent`,
el formulario y el resto de secciones siguen exactamente igual. El
metadata (`robots: { index: false, follow: false }`, canonical) vive en
`app/landing/page.tsx`, que no se tocó — el noindex/nofollow no cambia.

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0,
`/landing` estática. HTML servido comprobado por `curl`: cero `<footer` en
el marcado, el enlace a `/aviso-legal-page` presente con
`target="_blank" rel="noopener noreferrer"`, cero rastro de contenido
típico de footer (redes sociales, copyright), `<meta name="robots"
content="noindex, nofollow">` y el `canonical` intactos, vídeo y sistema
de bloqueo sin cambios. `next.config.mjs` sin tocar, nada desplegado.

### Primer testimonio real en /landing — Carolina Larrahona (2026-09-04 (33))

Encargo del cliente: la tarjeta 1 de `TestimonialsSection` (de las 3
actuales) sustituye su `VideoPlaceholder` por el primer vídeo real de
testimonios (Cloudflare R2, `RES1.mp4`, ~46,6 MB). Cita y nombre dados tal
cual; el programa ("Alumna del Máster BIM Full Time") se pidió explícito al
cliente antes de escribirlo — no se asumió ni se dejó como TODO disfrazado
de dato real.

**`app/landing/landing-content.ts`**: `Testimonial` pasa de interfaz local
duplicada en `testimonials-section.tsx` a interfaz exportada, con `role` y
`video` opcionales — así una tarjeta puede tener cita+nombre real sin rol
confirmado (no aplica aquí, pero deja el patrón listo para el próximo
testimonio si llega sin programa confirmado) y las tarjetas sin vídeo
siguen sin él. El comentario de cabecera del array se corrigió: ya no dice
"ninguna cita es real", dice explícitamente cuál de las 3 sí lo es.

**`components/landing/testimonial-video.tsx`** (nuevo) — deliberadamente
**no** reutiliza `hero-video.tsx`: ese vídeo es un fondo silencioso en
bucle atado al sistema de bloqueo de la página; este es un testimonio real
con voz, así que **sin autoplay**, controles nativos visibles, sin bucle,
`preload="metadata"` (no descarga el vídeo completo hasta que el usuario
pulsa play — mismo criterio de peso que el vídeo del hero) y `aria-label`
construido con la cita y el nombre reales. Sin `<track>` de subtítulos: un
track real necesitaría una transcripción verificada del audio, que no se
tiene — no se inventó uno. Como no hay autoplay, `prefers-reduced-motion`
no necesita gestión aparte: nada se mueve hasta que el usuario decide
reproducirlo.

**`components/landing/testimonials-section.tsx`**: cada tarjeta decide su
contenido según si `t.video` existe — real (`TestimonialVideo`) o pendiente
(`VideoPlaceholder`, exactamente igual que antes). El aviso de cabecera
("⚠ Sección de ejemplo...") pasa a contar de verdad cuántas de las 3 siguen
pendientes (`pendingCount`, hoy "2 de 3") en vez de una frase fija que ya
habría dejado de ser cierta. El borde punteado de la tarjeta (la señal
visual de "esto no es definitivo" que ya usa `video-placeholder.tsx`) se
quita solo de la tarjeta con contenido real — dejarlo habría hecho parecer
pendiente algo que ya no lo es. **Tarjetas 2 y 3 sin ningún cambio.**

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0,
`/landing` estática. HTML servido comprobado por `curl`: `<video>` real con
`src`/`controls`/`preload="metadata"`/`aria-label` correctos y **sin**
`autoPlay`, cita/nombre/programa reales presentes, insignia "Vídeo
pendiente" presente exactamente 2 veces (tarjetas 2 y 3, no la 1), aviso de
cabecera actualizado a "2 de 3", los 2 TODO de las tarjetas 2/3 intactos,
numeración 01/02/03 sin cambios. `next.config.mjs` sin tocar, nada
desplegado.

### 🔴 Bug real corregido: control de volumen del vídeo de testimonio no respondía (2026-09-04 (34))

El cliente reportó, tras probar el testimonio real de (33), que no podía
quitarle el mute al vídeo de Carolina Larrahona — el control de sonido no
respondía a los clics.

**Descartado por revisión de código, no era ninguna de estas causas**:
- `muted` en el JSX: nunca existió, ni en `TestimonialVideo` ni en ningún
  sitio de este componente.
- `controls`: presente y confirmado en el HTML servido (`controls=""`).
- JS interceptando el clic: `GlobalCursor` (el punto de cursor global del
  sitio) es `pointer-events: none` por diseño explícito — no puede
  interceptar nada. No hay ningún otro overlay ni listener sobre esta
  tarjeta.

**🔴 Causa real**: el `<video>` vivía dentro de un `<div>` con
`overflow-hidden` + `rounded-2xl` para darle esquinas redondeadas —
**problema conocido y documentado en varios navegadores**: un ancestro con
`overflow: hidden` recortando un vídeo con controles nativos puede dejar el
control de volumen/silencio visualmente presente pero sin responder a los
clics, mientras el resto de controles (como play) sigue funcionando con
normalidad. Es justo lo que pasaba desapercibido: el vídeo se veía y se
reproducía bien, solo el botón de sonido fallaba.

**Arreglo**: el redondeado pasa del `<div>` envolvente al propio `<video>`
(`components/landing/testimonial-video.tsx`) — los navegadores recortan el
contenido de un elemento reemplazado (como `<video>`) con su propio
`border-radius` sin necesitar un ancestro con `overflow: hidden`, que es lo
que rompía la interactividad de los controles nativos. El `<div>`
envolvente se queda solo con el tamaño (`aspect-[3/4] w-full`) y el fondo,
sin recortar nada.

⚠️ **No verificado en vivo en Chrome/Safari/Firefox** como pidió
explícitamente el cliente — la extensión de Claude in Chrome seguía sin
conectarse en esta sesión, y no hay forma de automatizar Safari/Firefox
desde aquí. El diagnóstico se apoya en un patrón de bug real y bien
documentado para esta combinación exacta de CSS (`overflow-hidden` +
`border-radius` en el ancestro de un `<video controls>`), no en una prueba
en vivo — pendiente de que el cliente lo confirme en su navegador antes de
darlo por definitivo.

**Verificado por código:** `npx tsc --noEmit` 0 errores, `npx next build`
exit 0, `/landing` estática. HTML servido comprobado por `curl`: el
`<video>` de `RES1.mp4` sigue sin `muted`, con `controls` presente, y
ahora con `rounded-2xl` en su propia clase en vez de en el `<div>`
envolvente. El vídeo del hero (`VIDLAN1.mp4`) confirmado sin tocar —
sigue con `autoPlay muted loop`. `next.config.mjs` sin tocar, nada
desplegado.

### Segundo testimonio real en /landing — Omar Pérez Ruiz (2026-09-04 (36))

Mismo encargo que (33), segundo de los 3 huecos. La tarjeta 2 de
`TestimonialsSection` sustituye su `VideoPlaceholder` por el segundo vídeo
real (Cloudflare R2, `VID2.mp4`). Cita, nombre y programa ("Alumno del
Máster BIM Full Time (MBIM)") dados tal cual por el cliente en el propio
encargo — no hizo falta pedir el programa aparte, a diferencia de (33).

**Conflicto detectado antes de escribir código, resuelto con el cliente**:
el encargo pedía "el mismo patrón ya usado en la tarjeta 1: controles
nativos + botón explícito de mute/unmute con icono de altavoz" — pero
`TestimonialVideo` (el componente que usa la tarjeta 1) **nunca tuvo ese
botón explícito**, solo controles nativos (el control de volumen nativo se
arregló en (34), no se le añadió ningún botón propio). Ese botón explícito
con icono de altavoz existe únicamente en `HeroVideo` (`VIDLAN1.mp4`,
añadido en (35)) — un componente distinto. Como `TestimonialVideo` es
compartido entre las tarjetas 1 y 2, añadirle un botón nuevo habría
afectado también a la tarjeta 1, en conflicto directo con la instrucción
explícita de no tocarla. Consultado con el cliente: **se reutiliza
`TestimonialVideo` tal cual está hoy** (controles nativos, ya con el
volumen funcionando desde (34)) — la tarjeta 1 queda cien por cien intacta.

**`app/landing/landing-content.ts`**: el testimonio 2 del array pasa de
placeholder `TODO` a los datos reales de Omar Pérez Ruiz, con
`video: "https://pub-.../VID2.mp4"`. Cero cambios de componente: como
`testimonials-section.tsx` ya decide `TestimonialVideo` vs
`VideoPlaceholder` según si `t.video` existe (mecanismo construido en
(33)), la tarjeta cambia de placeholder a vídeo real solo con el dato —
insignia "Vídeo pendiente" y borde punteado desaparecen solos de esta
tarjeta, sin tocar `testimonials-section.tsx`. El comentario de cabecera
del array y el de la interfaz `Testimonial` se actualizaron para reflejar
"2 de 3 reales" (antes decían "1 de 3").

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0,
`/landing` estática. HTML servido comprobado por `curl`: `<video>` real de
`VID2.mp4` con `controls`/`preload="metadata"`/`playsInline`/`aria-label`
correctos y **sin** `autoPlay` ni `muted`, cita/nombre/programa reales
presentes, insignia "Vídeo pendiente" presente exactamente 1 vez (solo
tarjeta 3), aviso de cabecera actualizado a "1 de 3", `RES1.mp4` (tarjeta
1) confirmado presente y sin cambios, TODO de la tarjeta 3 intacto.
`next.config.mjs` sin tocar (mismo timestamp), servidor de desarrollo vivo
en el puerto 3000, nada desplegado.

### Tercer y último testimonio real en /landing — Agustina Mingrone (2026-09-04 (37))

Cierra el hueco de las 3 tarjetas de testimonios: la tarjeta 3 sustituye su
`VideoPlaceholder` por el tercer vídeo real (Cloudflare R2, `VID3.mp4`).
Cita, nombre y programa ("Alumna del Máster BIM Full Time (MBIM)") dados
tal cual por el cliente en el propio encargo.

**Mismo patrón que (36), sin necesidad de volver a preguntar**: el encargo
repitió la descripción de "controles nativos + botón explícito de
mute/unmute con icono de altavoz, igual que en las tarjetas 1 y 2" — la
misma premisa ya aclarada y resuelta en (36) (ese botón explícito solo
existe en `HeroVideo`, no en `TestimonialVideo`). Como la decisión de
reutilizar `TestimonialVideo` tal cual ya quedó fijada explícitamente por
el cliente en (36) para el mismo componente compartido, no hizo falta
volver a preguntar — se aplicó el mismo criterio ya acordado.

**`app/landing/landing-content.ts`**: testimonio 3 pasa de `TODO` a los
datos reales de Agustina Mingrone, con `video: ".../VID3.mp4"`. El
resumen de huecos pendientes de la cabecera del archivo pierde la línea
sobre vídeos de testimonios (ya no queda ninguno) y el comentario de la
interfaz `Testimonial` pasa a confirmar que las 3 tarjetas son reales.

**Aviso de cabecera de la sección — recomendación entregada antes de tocar
nada, tal como pidió el cliente**: el `<p>` de aviso
(`⚠ N de 3 testimonios son de ejemplo...`) en
`components/landing/testimonials-section.tsx` ya estaba condicionado a
`pendingCount > 0` desde que se construyó en (33) — con las 3 tarjetas
reales, `pendingCount` vale `0` y ese párrafo deja de renderizar nada,
automáticamente, sin necesidad de tocar ningún texto ni ese JSX. Se
recomendó dejarlo exactamente así (el componente ya estaba construido para
este momento) y el cliente no pidió ningún cambio adicional. Solo se
actualizó el comentario de documentación interna al inicio del componente
(no visible para el visitante) para dejar de describir un estado
"pendiente" que ya no existe.

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0,
`/landing` estática. HTML servido comprobado por `curl`: `<video>` real de
`VID3.mp4` con `controls`/`preload="metadata"`/`playsInline`/`aria-label`
correctos y sin `autoPlay`/`muted`, cita/nombre/programa reales presentes,
insignia "Vídeo pendiente" ausente por completo (0 apariciones), aviso
"Sección de ejemplo" ausente por completo, cero tarjetas con
`border-dashed` (las 3 llevan ya el borde de contenido real), `RES1.mp4`
(tarjeta 1) y `VID2.mp4` (tarjeta 2) confirmados presentes y sin cambios.
`next.config.mjs` sin tocar, servidor de desarrollo vivo en el puerto
3000, nada desplegado.

### 📎 Referencia — los 4 vídeos de /landing en Cloudflare R2 (2026-09-07)

Pointer rápido para no tener que rebuscar en el historial de sesiones
anteriores cada vez que se necesite una de estas URLs. Las 4 están en el
mismo bucket público de Cloudflare R2.

⚠️ **Historial del mismo día (2026-09-07), en 3 pasadas de la misma sesión:**
1ª pasada: adopta la estructura del ejemplo, mantiene los 4 vídeos.
2ª pasada: fidelidad estructural exacta — retira los 4 vídeos (hero +
3 testimonios), réplica literal de que la referencia es 100% texto;
`hero-video.tsx`/`testimonial-video.tsx`/`video-placeholder.tsx` se
borraron por quedar sin consumidores. 3ª pasada: el cliente pidió
explícitamente mantener los 3 vídeos de testimonios (mejor prueba social
que texto) — `testimonial-video.tsx` se reconstruyó y vuelve a estar en
uso. **El vídeo del hero (`VIDLAN1.mp4`) sigue sin usarse** — esa parte de
la decisión de la 2ª pasada no cambió.

| Vídeo | Estado actual | URL |
|---|---|---|
| `VIDLAN1.mp4` | Sin usar (hero sin vídeo) | `https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VIDLAN1.mp4` |
| `RES1.mp4` | **En uso** — Testimonio 1, Carolina Larrahona | `https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/RES1.mp4` |
| `VID2.mp4` | **En uso** — Testimonio 2, Omar Pérez Ruiz | `https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VID2.mp4` |
| `VID3.mp4` | **En uso** — Testimonio 3, Agustina Mingrone | `https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VID3.mp4` |

Los 4 comparten el mismo host (`pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev`)
— mismo bucket público de R2, solo cambia el nombre de archivo.

### ⚠️ Contenido nuevo confirmado por el cliente en sesión (2026-09-07) — no verificado de forma independiente

Al pedir replicar el contenido literal de la referencia de diseño externa
(no solo su estructura), tres afirmaciones concretas del ejemplo no tenían
ningún equivalente en las 49+ sesiones ya documentadas de este proyecto. Se
preguntó explícitamente antes de publicar nada — respuestas del cliente,
textuales, y la decisión tomada en cada caso:

| Punto | Respuesta del cliente | Decisión aplicada |
|---|---|---|
| Nombrar al colaborador (persona + L35) | "no pongas ningun nombre no quiero salir pero es todo cierto" | **Sin nombre de persona**, en ningún sitio. Se mantiene "L35" como nombre de empresa (ya usado en `DifferentialSection` como parte del claustro real, aprobado en sesión anterior), sin atribuirle el diseño de ningún módulo concreto |
| Certificación "AECOMI" | "Sí, es real y vigente" | **Publicada** como 3ª capa de `certificationLayers` (`landing-content.ts`), con nota explícita de que es una confirmación directa del cliente, sin verificación independiente — mismo criterio que otros datos de este proyecto confirmados solo por el cliente (p. ej. `aggregateRating` de Opiniones) |
| "Contrato laboral garantizado" vs. prácticas | "las dos cosas son reales nueva forma de entender bim y que trabajas" (respuesta que no resuelve cuál de las dos framings es la correcta) | **No se publicó "contrato laboral"** — se usó la versión ya extensamente verificada y documentada en el resto del proyecto: prácticas remuneradas garantizadas al 100% (`fasesInsercion`, las mismas 3 fases reales de `/mbim-page`). Si el cliente confirma en una sesión futura, con más detalle, que existe un contrato laboral real distinto de las prácticas ya documentadas, esto se puede revisar |

**Por qué se preguntó en vez de publicar directamente**: el propio cliente,
en los 3 turnos anteriores de esta misma sesión, había calificado
explícitamente este mismo contenido como "inventado"/"ficticio" antes de
pedir de pronto que se tratara como real — ese giro, sin nueva evidencia
aportada, junto con que una de las afirmaciones nombra a una persona
identificable de un tercero (no de IDESIE), justificaba confirmar en vez de
asumir. La respuesta sobre el nombre de la persona fue clara y se aplicó
tal cual; las otras dos quedan documentadas aquí con el nivel de confianza
real que tienen — una confirmación directa del cliente sobre su propia
institución, no un hecho verificado de forma independiente por fuera de esa
conversación.

**Contenido real reutilizado para dar cuerpo a "la IA ya está en el
programa"**, sin inventar nada nuevo: el módulo 08 "Innovation" del MBIM
(`app/mbim-page/mbim-content.ts`, ya existente desde antes de esta sesión)
incluye literalmente "IA y machine learning aplicados a procesos BIM" —
esto por sí solo ya confirmaba, con datos independientes del proyecto, que
la IA aplicada al BIM no es un concepto nuevo para IDESIE. Se reutiliza ese
contenido real en `DifferentialSection`, y los 9 módulos reales del MBIM se
reutilizan en el nuevo acordeón `ProgramModulesSection` — ninguno de los
dos ECTS/horas/nombres de herramientas específicas de la referencia
(Adarcus, Pele AI, WiseBIM, Glyph, el calendario del "Innovation Summit",
el desglose 40/40/20 de evaluación) se publicó, por no tener ningún
equivalente confirmado ni en el proyecto ni en la conversación con el
cliente — quedan fuera, no como un olvido, sino como una decisión explícita
de no inventar el nivel de detalle que el cliente no confirmó.

### Botón explícito de silenciar/activar sonido en el vídeo del hero (2026-09-04 (35))

Encargo del cliente: `VIDLAN1.mp4` (el vídeo del hero de `/landing`, el que
arranca `autoPlay muted` y alimenta el bloqueo de 1 minuto) necesitaba un
botón explícito de sonido, sin depender solo de controles nativos (el
`<video>` del hero no lleva `controls` — es un fondo silencioso atado al
sistema de bloqueo, a diferencia del testimonio de (33)/(34)). Explícitamente
**fuera de alcance**: `RES1.mp4`/`TestimonialVideo` (ya resuelto en (34)) y
`next.config.mjs`.

**`components/landing/hero-video.tsx`**: `muted` pasa de atributo estático
(`muted`) a prop controlada (`muted={isMuted}`, nuevo estado
`useState(true)` — arranca silenciado, igual que antes). Nuevo botón
circular en `bottom-4 left-4` (el de play/pausa ya existente ocupa
`bottom-4 right-4`, mismo estilo `bg-gray-950/70` + `backdrop-blur-sm`),
icono `Volume2`/`VolumeX` de `lucide-react` según estado, `aria-label`
dinámico ("Activar sonido" / "Silenciar vídeo").

**Por qué no afecta a `autoPlay` ni al contador de "visto"**: React trata
`muted` como una propiedad DOM viva, no solo un atributo HTML inicial —
`muted={isMuted}` hace que React escriba `.muted` sobre el elemento real en
cada commit, sin desmontar ni remontar el `<video>`. `autoPlay`/`loop`/
`playsInline` se quedan exactamente como estaban (atributos estáticos, sin
tocar). `handleTimeUpdate`/`onProgressDelta` (el contador de segundos
vistos que desbloquea el resto de `/landing`) leen `video.currentTime`,
ajeno por completo al estado de silencio — activar el sonido no reinicia
la reproducción ni resetea el contador, mismo criterio ya aplicado al pulso
de scroll-bloqueado (`hero-video-pulse`), que tampoco remonta el `<video>`.

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0,
`/landing` estática. HTML servido comprobado por `curl`: `<video>` del hero
con `autoPlay=""`/`muted=""`/`loop=""`/`playsInline=""` intactos (estado
inicial `isMuted=true`, coherente con SSR), `aria-label="Activar sonido"`
presente. `RES1.mp4`/`TestimonialVideo` confirmados sin tocar (sin `muted`
en su JSX, como ya era el caso). `next.config.mjs` sin tocar (mismo
timestamp `3 sept. 00:38`), nada desplegado, servidor de desarrollo
verificado vivo en el puerto 3000.

⚠️ **No verificado en vivo en Chrome/Safari/Firefox** — la extensión de
Claude in Chrome ha permanecido desconectada durante toda la sesión, sin
alternativa de automatización para Safari/Firefox. No se pudo confirmar
visualmente el cambio de icono al hacer clic ni el comportamiento real del
audio tras desmutear — la verificación se apoya en el HTML servido, el
build y el razonamiento sobre cómo React gestiona la propiedad `muted`
(documentado arriba), no en una prueba interactiva real. Pendiente de que
el cliente lo confirme en su navegador.

### In Company — rediseño propio "El Plano" (2026-09-02)

Mismo encargo que el Máster BIM Online, aplicado a un servicio B2B: In
Company **nunca perteneció a la familia de másteres** (no tenía movimientos
que abandonar), pero su versión anterior era genérica en sí misma — rejillas
de tarjetas con icono ilustrativo (Sparkles/Atom/Lightbulb, que no comunican
nada de BIM), dos secciones distintas diciendo lo mismo, texto centrado.

**Concepto: "El Plano"** — el público es un responsable de formación
corporativa, no un estudiante. La metáfora es el plano técnico acotado: líneas
de cota punteadas, ticks de medida, crucetas de registro de esquina. La
formación se presenta literalmente *medida* para la empresa, en el lenguaje
visual que un despacho AEC usa para acotar un edificio — coherente con el
argumento comercial ya existente ("no hay dos empresas iguales") pero sin los
iconos genéricos que no lo comunicaban.

**Componentes propios en `components/in-company/`** (blueprint-hero,
blueprint-glyph, measure-stat, process-steps, delivery-modes, reasons-list,
trust-bar, closing-cta), contenido en `app/in-company-page/in-company-content.ts`.
Vocabulario CSS propio (`.blueprint-*`), tercer bloque de este tipo junto a
"RECORRIDO DE PROGRAMA" y "MÁSTER BIM ONLINE". Único momento con dinamismo
fuerte: el proceso de 4 pasos (`process-steps.tsx`), mismo criterio de "un
solo ★ por página".

**La página pasó de un único archivo a server+client** (`page.tsx` con
`metadata` + `in-company-client.tsx`), igual que ya hace `mbim-online-page`:
los componentes nuevos necesitan `useGsapEffect`, que exige `"use client"`, y
Next.js no permite exportar `metadata` desde un client component.

**Auditoría de contenido, hecha antes de tocar código:**
- 🔴 El CTA principal del hero apuntaba a `/contact` (404 verificado) en vez
  de `/contact-page`, que es lo que usa el resto de la página. Corregido.
- Las secciones "Cuatro razones" (4 tarjetas) y "¿Por qué elegir...?" (6
  bullets) decían lo mismo con palabras distintas — 10 bullets para 3-4
  ideas reales. Consolidadas en una sola lista de 4 razones
  (`reasons-list.tsx`).
- **La única prueba social real de la página vivía solo en el `metadata`**
  ("+50 empresas confían en IDESIE") y nunca se mostraba en el cuerpo. Se
  rescata como cifra ancla (`measure-stat.tsx`).
- No existía ninguna narrativa de proceso — la página vendía "a medida" sin
  explicar cómo se llega a esa medida. Añadido (`process-steps.tsx`).
- Descartado a propósito: no hay logos de empresas cliente reales en el
  proyecto (`LogoCarousel` existe pero sin datos) ni casos de éxito de
  in-company (el único caso real, "Paso Superior A67" en
  `bim-consulting-page`, es de consultoría, un servicio distinto). No se
  inventó ninguno de los dos.

**Contraste verificado por cómputo**: todas las combinaciones nuevas pasan
AA salvo el eyebrow `text-brand` sobre `gray-950` (4,40:1) — mismo patrón
preexistente y compartido por `outcomes.tsx`/`module-journey.tsx`/
`experience-band.tsx`, se deja igual que en el Máster Online por el mismo
motivo: consistencia con el resto del sitio.

### Consultoría BIM — rediseño propio "El Expediente" (2026-09-03 (12))

Encargo explícito del cliente, con una restricción clara desde el principio:
**esta página NO debe parecerse a las de máster** — nada de storytelling de
"recorrido", nada de Roboto Mono + numeración de módulos, nada de scroll
horizontal anclado. El público es una empresa evaluando un servicio de
consultoría, no un estudiante decidiendo un máster: el tono debe ser
corporativo y directo, apoyado en prueba concreta (casos reales, cifras) en
vez de narrativa.

**Auditoría previa (sin tocar código)** — 5 secciones identificadas
(`hero`, `services`, `featured-projects`, `why-choose-us`, `contact`).
Hallazgos:
- Cero vocabulario visual propio (a diferencia de `.journey-*`, `.online-*`,
  `.blueprint-*`, `.catalogo-*`, `.bitacora-*`) y cero animación en toda la
  página — la única del sitio ya auditado sin ningún revelado al scroll.
- Azul de marca hardcodeado en hex (`#006cff`, `#0052cc`, `#003d99`) en vez
  de los tokens `--color-brand`/`bg-brand`.
- Sección "Servicios" y mitad de "Por qué elegirnos": el mismo patrón
  "AI slop" de rejilla de tarjetas con icono grande ya identificado y
  corregido en In Company.
- 🔴 **Enlace roto**: el CTA final apuntaba a `/contacto` (404 confirmado con
  curl) — la ruta real es `/contact-page`, mismo bug ya visto y corregido en
  su día en In Company y en el blog.
- 🔴 **Imagen rota**: el proyecto "Senado" del carrusel listaba 8 fotos en el
  código pero solo existen 7 en disco — `senado-8.jpg` daba 404 confirmado.
  Corregido retirando esa entrada del array (el proyecto se queda con sus 7
  fotos reales).
- **Sin `metadata` propia**: todo el archivo era `"use client"` solo por el
  carrusel de proyectos, así que la página no podía exportar `metadata` y
  heredaba título/canonical de la home — confirmado con curl antes de tocar
  nada. Mismo patrón de bug ya corregido en `/tienda` y `/mbim-online-page`.

**Dirección aprobada: "El Expediente"** — la página se lee como el dossier
que un consultor entrega a un cliente potencial, no como una experiencia
inmersiva. Se ofrecieron 2 variantes (A "El Expediente", más fría/charcoal;
B "Panel de Resultados", más luminosa/SaaS); el cliente eligió la **A**.

- **Server Component**: `app/bim-consulting-page/page.tsx` deja de ser
  `"use client"` y gana `metadata` propia (título, descripción, canonical
  `/bim-consulting-page`, OG con la foto real del hero). El carrusel se
  extrae a `components/bim-consulting/projects-carousel.tsx`, único trozo
  que sigue siendo Client Component (necesita `useState`). Verificado:
  `next build` pasa a listar la ruta como `○` (estática) en vez de forzarla
  dinámica.
- **Hero** comprimido (de casi 100vh a un bloque compacto `gray-950`), texto
  a la izquierda en vez de centrado sobre una foto a sangre con velo — la
  foto pasa a ser una columna propia, no el fondo. Las cifras clave
  (100+ proyectos / 15+ años / 50+ clientes) se muestran ya aquí, en texto,
  sin esperar a la sección 4.
- **Servicios**: la rejilla de 6 tarjetas con icono grande pasa a una lista
  de capacidades en dos columnas con borde izquierdo azul — el mismo patrón
  "card con borde izquierdo" que ya usan `admision-section.tsx` y el FAQ en
  todo el sitio (genérico, no importado de las páginas de máster).
- **Por qué elegirnos + cifras**: los tres tratamientos apilados que había
  antes (tarjetas + banner degradado con círculos difuminados + píldora
  flotante) se funden en dos: una lista ligera de las 4 razones (separador
  superior fino, sin tarjetas) y una única franja `gray-950` que integra las
  4 cifras (con `StatCounter`, cuenta hacia arriba al entrar en pantalla,
  reutilizado tal cual de `components/home/`) y el mensaje de compromiso —
  mismo texto que antes, ya no fragmentado en una píldora aparte.
  Los labels de las cifras usan `text-white/60` (no `text-brand`, que sobre
  `gray-950` da 4,40:1 — aquí no había ningún patrón preexistente que
  igualar, así que se eligió directamente un contraste que pasa AA).
- **CTA final**: `gray-950` en vez de azul sólido — el azul de marca queda
  reservado como acento del botón, coherente con el resto de la página.
  Enlaza a `/contact-page` (bug corregido).
- **Sección 3 (Proyectos Destacados)**: mantenida en contenido y estructura
  exactos — sigue siendo el carrusel manual de los 4 casos reales (Metro
  Sevilla, Senado, Paso Superior A67, Edificio Treviso), sin pin ni scroll
  horizontal. Solo se le aplicó el mismo lenguaje visual (bordes finos en
  vez de sombra pesada, esquinas menos redondeadas, azul vía token) y un
  revelado discreto al entrar en pantalla.
- **Animación**: `Reveal` (`components/home/reveal.tsx`, Zona A — CSS/JS
  mínimo, ya usado en la home) en cada bloque, con pequeños retardos
  escalonados. Deliberadamente **no se usó GSAP**: la propia dirección pedía
  "sin espectáculo", y GSAP es carga diferida pensada para páginas que
  justifican su coste (programa, In Company) — esta no necesita un momento
  de dinamismo fuerte, solo apariciones discretas y repetidas.
- Sin cambios de contenido/texto en ninguna sección (incluidas las erratas
  ya existentes como "Consultoria" sin tilde — no se tocaron, no se pidió
  corregir texto, solo diseño).

**Verificado**: `npx tsc --noEmit` en los mismos 2 errores preexistentes,
`npx next build` exit 0 con `/bim-consulting-page` listada como estática,
`curl` confirma título/canonical propios y ambos enlaces corregidos
(`/contact-page`, sin referencia a `senado-8.jpg`), revisión visual completa
en Chrome real de las 5 secciones.

### Financiación y Becas — rediseño propio "El Balance" (2026-09-03 (20))

Séptimo vocabulario visual propio del sitio (`.balance-*` en `globals.css`,
junto a `.journey-*`, `.online-*`, `.blueprint-*`, `.catalogo-*` y
`.bitacora-*`). El propósito de esta página no es narrar una experiencia ni
vender un programa: es generar confianza para el paso económico. La
metáfora es el documento financiero serio — un estado de cuenta, un sello
de aprobación — no un espacio físico ni una red de nodos.

**Auditoría previa, sin tocar código:**
- 🔴 Imagen rota: `public/images/asesoramiento-personalizado.png` **nunca
  existió en disco** — 404 confirmado contra el HTML servido y contra la
  ruta directa. Era la imagen de la sección "Apoyo Adicional".
- 🔴 Prop inválida en `next/image`: `query="..."` en esa misma imagen — es
  el segundo de los 2 errores preexistentes de `npx tsc --noEmit` que se
  arrastraban desde hacía sesiones. Desaparece al reconstruir la sección
  sin esa imagen.
- Cero vocabulario visual propio, cero GSAP — la única página "secundaria"
  del sitio (junto a Bolsa de Empleo) sin su propio tratamiento.
- 5 erratas de acentuación en el hero y en el CTA de becas ("Financiacion",
  "Realidad", "economicos", "ayudaran", "informacion sobre becas") —
  **confirmadas explícitamente con el cliente antes de corregirlas**, igual
  que el resto de datos (precios, becas, TAE) se dejaron intactos por no
  ser errores objetivos.

**Dirección de diseño aprobada: "El Balance"** — fondo `bg-paper` en las
secciones de respiro, cifras protagonistas con contador animado, tarjetas
con borde izquierdo (patrón genérico ya usado en `admision-section.tsx`/FAQ,
no importado de ninguna otra identidad), tabla resumen rediseñada como un
estado de cuenta real. Variante alternativa ("Vía Libre", metáfora de
camino) propuesta y no elegida.

**Densidad de animación — pedida explícitamente al mismo nivel que "La
Red"**, no solo el momento único de estadística que se había planteado al
principio: cada sección de contenido real tiene su propio scroll-reveal
(`useGsapEffect` + ScrollTrigger, `once: true`), replicando la gradación
real de "La Red" (hero en CSS puro, 4 secciones con GSAP de intensidad
creciente, cierre estático) en vez de animar todo por igual.

**Componentes nuevos en `components/financiacion/`:**
- `balance-hero.tsx` — conserva la foto real existente (a diferencia de "La
  Red", que usa `gray-950` sólido: aquí no hay motivo para sustituir una
  foto correcta por un motivo abstracto). Titular en CSS puro
  (`.hero-line`/`.hero-fade`, mecanismo genérico reutilizado, nunca GSAP —
  regla de LCP del hero, sin excepciones).
- `balance-stat.tsx` — cifra protagonista (**50 %**, la única cifra que
  aparece dos veces de forma independiente en el contenido real: Excelentia
  para Full Time y Alumni para Executive), mismo mecanismo que
  `network-stat.tsx` de "La Red" (escala+opacidad de entrada, contador a
  cero, tira de 3 datos de apoyo escalonada) — infraestructura de
  scroll-reveal genérica, no una identidad prestada.
- `balance-financing-cards.tsx` — las 3 opciones de financiación,
  escalonadas al entrar en pantalla.
- `balance-ledger.tsx` — **el único momento con dinamismo fuerte de la
  página** (equivalente al M3 de programa / grafo de "La Red"), con un
  motivo propio: cada beca es un "sello aprobado" que se estampa
  (`back.out`, escala+rotación) sobre un carril que se dibuja con `scaleY`
  scrubbed al hacer scroll. El cambio de pestaña Full Time / Executive es
  una transición CSS instantánea (mismo `grid-template-rows` que el
  acordeón de FAQ) — el "wow" ya ocurrió al entrar por scroll, no tenía
  sentido repetirlo en cada clic.
- `balance-advisory.tsx` — sustituye la imagen rota por un motivo circular
  propio en CSS (anillo punteado con rotación lenta, contenido
  contrarrotado para que el texto no gire) en vez de salir a buscar o
  generar una foto de stock nueva.
- `balance-statement.tsx` — la tabla HTML original, rediseñada como un
  "estado de cuenta" con separador punteado entre filas (perforación de
  recibo) y escalonado de entrada.
- `balance-closing.tsx` — cierre estático, sin GSAP, mismo criterio que el
  cierre de "La Red": después del clímax de la sección de becas, una salida
  en calma se lee mejor que otro efecto compitiendo por atención.

**Contenido** extraído a `app/financiacion-y-becas-page/financiacion-content.ts`
— ningún dato nuevo, todo viene de la página anterior.

**De paso**, `metadata` gana `alternates.canonical` (la página heredaba el
canonical de la home, mismo bug ya corregido en tienda/mbim-online/producto
en la auditoría SEO — no se había tocado esta página en aquella pasada).

**Verificado con Chrome real**: las 4 secciones GSAP revelan correctamente
al hacer scroll (contador de la cifra, tarjetas de financiación, sellos de
becas con el carril dibujándose, pasos de asesoramiento), el cambio de
pestaña Full Time/Executive funciona, la tabla-estado de cuenta se revela
por filas, cierre final sin animación como estaba previsto.

**Verificado:** `npx tsc --noEmit` baja a 1 error preexistente (el de esta
página desaparece), `npx next build` exit 0.

### Bolsa de Empleo — rediseño propio "El Tablón" (2026-09-03 (21))

Octavo vocabulario visual propio (`.tablon-*` en `globals.css`, tras
`.balance-*`). Encargo doble (ver también §3, "Bolsa de Empleo — ofertas y
candidaturas"): esta sección cubre solo el rediseño visual de la página
pública, ya con datos reales en vez de las 4 ofertas ficticias hardcodeadas
que tenía antes.

**Concepto: "El Tablón"** — fondo `gray-950` (mismo negro que ya usan los
M3/M6 de las páginas de programa, no un segundo negro nuevo), cada oferta es
una ficha de anuncio con esquina doblada (`::after` con degradado diagonal,
sin ninguna imagen) y una "chincheta" circular en la parte superior — la
metáfora es literal, un tablón de anuncios de empresa, en vez de una foto de
stock de gente sonriendo en una oficina genérica.

**Filtro real, sustituye al decorativo**: la versión anterior tenía un
input de búsqueda y un botón "Filtrar" que no hacían nada. `TablonBoard`
(`components/empleo/tablon-board.tsx`) filtra de verdad por `ubicacion` y
`tipo_contrato` reales (los `<select>` solo listan los valores que existen
de verdad entre las ofertas activas, nunca una lista fija) — mismo patrón
de filtro real ya aplicado a `/tienda` (categoría) y a la propia migración
de esta pieza.

**★ Momento de mayor dinamismo — el propio filtrado**: a diferencia de "El
Balance", donde el filtro (cambio de pestaña de becas) es una transición
CSS instantánea porque el "wow" ya había ocurrido al entrar en la sección,
aquí el filtro **es** la interacción principal de la sección, así que cada
vez que cambia la selección las tarjetas resultantes se "clavan" de nuevo en
el tablón (`back.out`, rotación aleatoria pequeña + escala, mismo mecanismo
de "sello" que el `balance-ledger.tsx` de Financiación pero aplicado a un
conjunto que cambia de verdad, no a una pestaña fija). Técnica: un
componente hijo (`PinnedGrid`) remontado por `key={ubicación|tipo}` — es lo
que permite que `useGsapEffect` (que solo corre una vez por montaje) se
re-dispare en cada cambio de filtro sin tener que gestionar el ciclo de vida
de ScrollTrigger a mano.

**Resto de secciones, misma densidad que "El Balance" (pedida explícitamente
al mismo nivel para ambos encargos de esta sesión):**
- `tablon-hero.tsx` — titular en CSS puro (`.hero-line`/`.hero-fade`, regla
  de LCP sin excepciones), CTA a `#ofertas`.
- `tablon-steps.tsx` — "Cómo funciona" en 3 pasos, sección **completamente
  nueva** (la versión anterior no explicaba el proceso en ningún sitio),
  `bg-paper` para el respiro tonal entre los dos bloques oscuros del hero y
  del tablón, con reveal escalonado.
- `tablon-cv-cta.tsx` — cierre con una única entrada suave, sin GSAP
  adicional, mismo criterio que `balance-closing.tsx`/el cierre de "La Red":
  el final de la página no necesita otro momento de movimiento.

**Contenido**: `app/bolsa-de-empleo-page/bolsa-content.ts` — hero y CV-CTA
reutilizan el texto real ya existente; los 3 pasos son contenido nuevo (no
existía ninguna sección de "cómo funciona"); las 4 ofertas ficticias de la
versión anterior **no se migran a ningún sitio** — nunca fueron datos
reales, así que no hay nada que preservar.

**Verificado con Chrome real**, con 2 ofertas de prueba creadas a través del
formulario real de `/admin/empleo/nueva` (ver §3): grid con las 2 fichas
renderizando esquina doblada + chincheta + badge "Destacada" en la que
correspondía; filtro por ubicación (Madrid) reduce correctamente "2 de 2" a
"1 de 2" y vuelve a disparar la animación de clavado sobre la tarjeta
restante; modal de candidatura abierto desde una ficha real, candidatura
espontánea (sin `jobId`) enviada de extremo a extremo y confirmada en
`/admin/empleo/candidaturas`; estado vacío (`ofertas.length === 0`)
comprobado tras borrar las 2 ofertas de prueba — muestra el aviso sin
renderizar el panel de filtro (que no tendría sentido con cero opciones).

**Verificado:** `npx tsc --noEmit` en el mismo 1 error preexistente,
`npx next build` exit 0 con `/bolsa-de-empleo-page` listada como estática.

### Máster BIM Online — rediseño propio "La Red" (2026-09-02)

A petición explícita del cliente: **no todas las páginas de máster deben
leerse como la misma plantilla con datos distintos.** MBIM, MBBE y EMBIM
comparten a propósito `components/programa/*` para leerse como una familia,
pero `mbim-online-page` iba a ser su cuarta consumidora y el cliente lo paró —
quiere personalidad propia dentro de la misma familia de marca, no una copia
de los 7 movimientos con "Online" en el titular.

**Concepto: "La Red"** — en vez de un espacio físico (aula, obra, campus, que
es lo que usan las otras tres), esta página vive en la conexión misma: nodos
dispersos que convergen en un modelo compartido. Es el concepto BIM real
(Módulo 01 = *"Trabajo colaborativo en entornos de datos comunes (CDE)"*) y la
promesa comercial real (misma bolsa de +200 empresas, estés donde estés) al
mismo tiempo — no un patrón decorativo importado de fuera.

**Componentes propios en `components/mbim-online/`** (network-hero,
network-glyph, network-stat, weekly-patterns, module-graph, trust-bar,
outcomes-list, closing-section) — **deliberadamente fuera de**
`components/programa/`, porque esa carpeta es compartida a propósito por las
otras tres y estas piezas no están pensadas para que ellas las reutilicen.
Contenido propio en `app/mbim-online-page/mbim-online-content.ts` (forma
distinta a los `*-content.ts` de las otras tres).

**Vocabulario CSS propio** (`.online-*`, bloque "MÁSTER BIM ONLINE — LA RED"
al final de `globals.css`), mismo mecanismo que `.journey-*` pero sin
compartir sus clases — solo se reutilizan literalmente las curvas de easing
de `:root` y `.hero-line`/`.hero-fade` (el revelado del hero, genérico de
verdad). El único momento con dinamismo fuerte de la página es el grafo de
módulos (`module-graph.tsx`), equivalente al M3 de las otras tres — mismo
criterio de "un solo ★ por página".

**Sustituye "el día partido"** (el M4 presencial, mañana obra/tarde aula, que
no tenía sentido para un máster sin horario fijo) por `weekly-patterns.tsx`:
tres mapas de calor semanales de alumnos reales conviviendo a la vez — la idea
es "no hay un día correcto", lo opuesto al díptico del presencial.

**Auditoría de contenido, hecha antes de tocar código** (siguiendo el proceso
de las skills `frontend-design-anthropic`/`website-rebuild` recién instaladas,
solo como disciplina de fases — no su stack, que asume Astro desde cero):
- 🔴 La página tenía **tres precios distintos para el mismo máster**
  (8.500 € en la FAQ; 4.500→3.800 € en la sección de compra). Resuelto con
  4.500→3.800 €, el par más completo. **Pendiente de confirmación del
  cliente.**
- La banda de cifras decía "certificación Cualificam (opcional)" mientras la
  FAQ la daba por incluida. Resuelto como incluida.
- Faltaba mostrar la acreditación Cualificam/Madri+d/ENQA/EQAR que la FAQ ya
  prometía (la sección "Reconocimientos" solo tenía AEEN + EUPHE, que son
  reales y exclusivos de esta página — se mantienen, añadidos junto a
  Cualificam en `trust-bar.tsx`).
- La página **nunca recibió** el enrutado `?motivo=asesoria&programa=X` hacia
  `/contact-page` que sí tienen MBIM/MBBE/EMBIM desde el 2026-09-01, pese a
  que el registro de cambios de ese día dice que se tocó este archivo —
  discrepancia real entre `CLAUDE.md` y el código, cerrada ahora.
- ⚠️ **Sin resolver, fuera de alcance de este rediseño:** los roles de salida
  de este máster en `app/comparativa-masters-page/page.tsx` ("Information
  Delivery Management, BIM Design Manager, BIM Coordination Manager") no
  coinciden con los de esta página ni con `mbim-content.ts` (BIM Modeler, BIM
  Coordinator, Especialista MEP, Project Manager Junior). Mismo programa,
  descrito de dos formas incompatibles en dos páginas distintas.

**Contraste verificado por cómputo antes de dar nada por bueno** (no a ojo):
se detectaron y corrigieron dos combinaciones por debajo de AA — la insignia
de descuento (`bg-brand/20 text-brand` daba 3,70:1 sobre `gray-950`; ahora
`bg-brand text-white`, 4,58:1) y el texto de reclamo de la cifra (`white/45`
daba 4,47:1; ahora `white/55`, 5,3:1). El eyebrow `text-brand` sobre
`gray-950` da 4,40:1, por debajo del mínimo técnico — **se dejó así a
propósito** porque es el mismo patrón que ya usan `outcomes.tsx`,
`module-journey.tsx` y `experience-band.tsx` en las otras tres páginas: es
una imprecisión preexistente y compartida por todo el sitio, no algo nuevo de
esta página, y corregirla solo aquí la haría inconsistente con el resto.

### Header flotante de cristal (2026-09-02)

`components/header.tsx` dejó de ser una barra opaca a ancho completo pegada al
borde. Ahora las **mismas dos filas de siempre** (utilidades arriba, navegación
principal debajo) viven dentro de **una sola pastilla** `.glass-nav` que flota
con margen. **No cambió ni un enlace, ni un desplegable, ni el carrito**: solo el
tratamiento visual. Aplica a las 26 páginas públicas, porque `Header` es
compartido (se importa en cada página, no en el layout).

| Pieza | Dónde | Qué hace |
|---|---|---|
| `.glass-nav-shell` | `globals.css` | `fixed` + margen. `pointer-events: none` para que el hueco de los lados deje pasar el ratón |
| `.glass-nav` | `globals.css` | La pastilla: tinte, `backdrop-filter`, borde de 1px, radio y sombra |
| `.glass-nav-hairline` | `globals.css` | Línea de pelo entre las dos filas |
| `.glass-panel` | `globals.css` | Desplegables y cajón móvil: mismo material, más opaco |
| `data-scrolled` | `header.tsx` | `true` a partir de 12px de scroll → más cuerpo y más sombra |
| `data-menu-open` | `header.tsx` | Oculta la pastilla mientras el cajón móvil está abierto |

#### 🔴 La opacidad NO es libre — es una restricción de contraste
El header flota sobre el contenido, así que al hacer scroll le pasan por detrás
las bandas `gray-950` del M3 y el M6 y los heroes con velo negro. Con el texto
del menú en `--foreground` (#374151), medido sobre negro:

| tinte | contraste | |
|---|---|---|
| 0,55 | 3,08:1 | ✗ |
| 0,65 | 4,22:1 | ✗ |
| **0,72** | **5,17:1** | ✓ en reposo |
| **0,85** | **7,28:1** | ✓ con scroll |

Un cristal «de catálogo» al 10-20 % deja el menú **ilegible** sobre esas
secciones. **0,72 es el mínimo exacto, no un número redondo**: a 0,70 el hover
ya cae a 4,46:1. Recalcúlalo antes de tocarlo (`node scripts/contrast-nav.mjs`).

**El menú ya no se pone azul al pasar por encima, y es deliberado.** Sobre el
cristal en reposo ni `--color-brand` (2,3:1) ni `--color-brand-strong` (3,4:1)
llegan a AA; mantener el azul obligaría a subir el tinte a **0,84** y perder
casi toda la transparencia. El hover se expresa con un **lavado `bg-brand/10`**,
que sube el fondo sin tocar el texto y deja 4,70:1. Si algún día se prefiere
recuperar el azul, el precio es exactamente ese: tinte 0,84.

#### 🚀 Rendimiento — las cuatro reglas que sostienen el coste
`backdrop-filter` obliga al compositor a re-desenfocar su región en cada
fotograma de scroll. Medido con `node scripts/perf-nav-glass.mjs` (CPU frenada
6×): **mediana de 16,7 ms por fotograma con y sin cristal — 60 fps, coste 0 ms**.
Eso se sostiene sobre cuatro decisiones; si rompes alguna, vuelve a medir:

1. **UNA capa de blur para todo el header**, no una por fila. Por eso las dos
   filas se envuelven en una sola pastilla en vez de flotar por separado.
2. **El radio del blur nunca se anima.** Al hacer scroll solo cambian
   `background-color`, `border-color` y `box-shadow`.
3. **Radio contenido (18px).** Por encima de ~30px el coste crece rápido en
   GPU integradas.
4. **La pastilla se oculta (`visibility: hidden`) mientras el cajón móvil está
   abierto**, para no desenfocar dos capas a pantalla completa en el peor
   dispositivo posible.

⚠️ La medición es headless sobre un Mac, no un Android de gama media: sirve para
comparar, no como cifra absoluta. Lo que garantiza el coste son las cuatro
reglas, no el número.

#### Accesibilidad — tres salidas, todas verificadas
`prefers-reduced-transparency`, `prefers-contrast: more` y los navegadores sin
`backdrop-filter` reciben **superficie opaca y cero blur**. `prefers-reduced-motion`
quita la transición del cambio de estado. Comprobado en los cuatro modos.

#### El logo tenía un 63 % de relleno vacío
`logo_idesie_azul.png` es un lienzo de **464×315 donde la marca ocupa 337×117**.
Encima se declaraba `width={150} height={30}`, un 5:1 que no existe, así que el
`height:auto` del preflight de Tailwind lo estiraba a **102px de alto** — y eso,
no el relleno de la barra, era lo que la inflaba a 146px.

Para la barra se usa **`logo_idesie_azul_trim.png` (343×123)**, generado con
`sharp().trim()`. **El original sigue en uso en el footer y el resto de páginas**;
si algún día se unifica, ese es el archivo a mirar.

### Reorganización del header: sin barra secundaria, submenús con más carácter (2026-09-03 (11))

Dos encargos seguidos del cliente sobre `components/header.tsx`, documentados
juntos porque el segundo continúa directamente sobre el primero.

**Primero — eliminar la barra secundaria de escritorio.** El header tenía dos
filas visibles en escritorio: una fila de utilidades (Empresas / Tienda /
Contacto / carrito) encima de la fila con los desplegables. El cliente pidió
que esa fila secundaria desapareciera del todo:
- **Contacto** → dentro del desplegable **CONOCE IDESIE**, como fila propia al
  pie ("¿Tienes alguna pregunta? → Contacto"), no metido en "Nuestra
  Institución" ni "Comunidad" (ambas son contenido informativo, Contacto es
  una acción).
- **Tienda** y **Empresas** → dentro de **RECURSOS Y SERVICIOS**, que pasó de
  una columna de 4 enlaces a dos columnas ("Recursos" / "Servicios") para no
  alargar demasiado la lista.
- La `<header id="top-nav-bar">` (Fila 1) gana `lg:hidden`: a partir de `lg`
  desaparece por completo (antes se quedaba como una tira vacía encima de la
  Fila 2). Por debajo de `lg` se conserva tal cual — sigue siendo la única
  forma de abrir el menú en móvil/tablet (logo + carrito + hamburguesa).
- El carrito se queda siempre en la fila principal: a la derecha del todo en
  escritorio grande (`main-nav-bar`) y junto al botón de hamburguesa por
  debajo de `lg` — nunca dentro de un desplegable.
- `.glass-nav-hairline` (la línea entre las dos filas) se retira a partir de
  `lg` (nueva regla `@media (min-width: 1024px)`): sin Fila 1 encima, esa
  línea se quedaba suelta arriba de la pastilla.

**Segundo — rediseño visual de los desplegables + reubicar Campus Virtual.**
Encargo explícito de más cuidado visual y animación en los tres submenús
(PROGRAMAS, RECURSOS Y SERVICIOS, CONOCE IDESIE), más sacar **Campus Virtual**
de dentro de un desplegable a elemento propio del menú principal.

- **Campus Virtual** (`campusvirtual.idesie.com`) ya no vive dentro de
  RECURSOS Y SERVICIOS: es un `<Link>` de primer nivel más, al mismo peso que
  PROGRAMAS/CONSULTORIA BIM/etc., con `target="_blank"` (es un portal externo)
  y un icono `ArrowUpRight` que avisa de que abandona el sitio. Aplicado igual
  en el cajón móvil, como enlace propio tras el acordeón de CONOCE IDESIE, no
  dentro de ningún acordeón.
- **Animación de apertura/cierre nueva**, bloque `SUBMENÚS DEL HEADER — MISMO
  CRISTAL, MÁS CARÁCTER` en `globals.css` (justo después del bloque "HEADER
  FLOTANTE DE CRISTAL"): fade y escala por separado (la escala usa
  `--ease-spring`, el mismo cubic-bezier con rebote que ya usan los CTA de
  programa; el fade usa `--ease-out-quart`, sin rebote, para que la opacidad no
  tironee). El origen del crecimiento lo resuelve Radix solo
  (`origin-(--radix-dropdown-menu-content-transform-origin)`, ya en la clase
  por defecto de `DropdownMenuContent`) — no fue necesario tocar
  `components/ui/dropdown-menu.tsx`.
  🔧 **Cómo le gana al fade+zoom por defecto de `tw-animate-css` sin tocar el
  componente compartido**: las reglas nuevas no llevan `@layer`, y una regla
  sin layer tiene siempre prioridad sobre cualquier regla dentro de una layer
  (así es como funcionan las cascade layers en CSS), sin importar
  especificidad. Como `DropdownMenu` no lo usa nadie más que este header hoy,
  esto es seguro; si algún día lo usa otra pantalla sin querer este estilo,
  reconsiderar.
- **Micro-interacción por opción** (`.nav-dropdown-link` + `.nav-dropdown-icon`
  + reutilización de `.link-draw`, ya existente): pastilla `bg-brand/10` al
  pasar el cursor (mismo lavado que ya usan los disparadores del menú
  principal), la flecha se desplaza hacia la izquierda y el texto dibuja su
  subrayado.
- **Entrada escalonada de las opciones** (`.nav-dropdown-item`, delays por
  `nth-child` de hasta 6 posiciones): se reinicia en cada `<ul>`, así que cada
  grupo (Presencial / Online / ¿Qué máster es para mí?...) tiene su propio
  escalonado corto en vez de uno larguísimo para todo el panel.
- **Jerarquía nueva en PROGRAMAS**: las etiquetas de categoría, que antes
  eran un `<span>` en negrita metido como si fuera un elemento más de la
  `<ul>`, pasan a ser un eyebrow en Roboto Mono (`.nav-dropdown-eyebrow`, la
  misma "voz técnica" que ya usan las páginas de programa). Además, "Cursos
  cortos" e "In Company" (Executive Education) quedan dentro de una tarjeta
  propia con fondo azulado (`.nav-dropdown-subcard`) para distinguirlos
  visualmente de los másteres de postgrado — pedido explícito del cliente.
- **`prefers-reduced-motion: reduce`**: bloque dedicado al final de la nueva
  sección de `globals.css` — los paneles se abren y cierran igual, solo sin
  animar (`animation: none`, nunca `transform: none`, que borraría el
  `rotate-180` de reposo de los iconos de lista).
- 🔴 **Bug encontrado y corregido durante la propia verificación, no
  introducido por este encargo**: los tres `<DropdownMenu>` de escritorio son
  independientes en Radix por defecto — sin coordinarlos, al abrir uno el
  anterior se quedaba abierto (dos paneles de cristal superpuestos a la vez).
  Pasaron a compartir un único estado (`openDesktopMenu`, controlado vía
  `open`/`onOpenChange` en los tres) para que abrir uno cierre los demás.
  Verificado con Chrome real, con esperas explícitas entre clics para
  descartar que fuera un artefacto de automatización: sin el fix, PROGRAMAS
  seguía visible al abrir RECURSOS Y SERVICIOS; con el fix, solo queda abierto
  el último que se pulsó.

**Verificado con Chrome real:** los tres desplegables abren con la animación
nueva, jerarquía de PROGRAMAS (eyebrows + tarjeta de Executive Education)
correcta, hover con pastilla+subrayado+flecha en varias opciones, Campus
Virtual visible como elemento propio en escritorio y en el cajón móvil, y
solo un desplegable abierto a la vez tras el fix de estado compartido.
`npx tsc --noEmit` en los mismos 2 errores preexistentes (sin cambios),
`npx next build` exit 0.

### Breadcrumb retirado de las 18 páginas que lo usaban (2026-09-02)

`components/breadcrumb-navigation.tsx` ("Inicio > Programas > [Máster]") dejó de
renderizarse en las 18 páginas donde aparecía — **por petición explícita del
cliente**, no por el rediseño del header. Se quitaron el `<BreadcrumbNavigation
.../>` y su `import` en cada archivo; en `blog/page.tsx`, `blog/tag/[tag]/page.tsx`
y `profesores-page/page.tsx` también se quitó el `const breadcrumbItems = [...]`
que solo existía para alimentarlo. **El componente sigue en el proyecto, sin
usarse en ningún sitio** — no se borró, a la espera de decidir si hace falta más
adelante.

Páginas afectadas: `mbim-page` · `mbbe-page` · `embim-page` · `mbim-online-page`
· `alianzas-page` · `alumni-page` · `bim-consulting-page` · `blog` ·
`blog/tag/[tag]` · `bolsa-de-empleo-page` · `contact-page` · `ejemplo` ·
`empresas-page` · `financiacion-y-becas-page` · `in-company-page` ·
`profesores-page` · `short-courses-page` · `sobre-idesie-page`.

**Efecto colateral bueno:** en `/ejemplo` el breadcrumb se llamaba con props
`currentPage` / `breadcrumbs`, que **no existen** en la interfaz real del
componente (`items`, `className`, `variant`) — un error de tipos preexistente
que React ignoraba en silencio. Al quitar ese uso, `npx tsc --noEmit` bajó de
22 a **21 errores**.

**Sobre el espaciado — no hacía falta tocar nada.** El breadcrumb vivía en el
flujo normal del documento justo después de `<Header/>`, pero como el header es
`position: fixed` no reserva espacio en ese flujo: estas 18 páginas **no usan
`MainContentWrapper`** ni ningún `pt-[var(--header-height)]`, así que el
`<main>` ya empezaba en `y:0` con el breadcrumb metido debajo del header
flotante — de ahí el hallazgo del cambio anterior ("el breadcrumb queda
parcialmente tapado"). Quitarlo no cambia esa geometría: `<main>` seguía
empezando en `y:0` antes y sigue empezando en `y:0` ahora. Lo único que
cambia es que ya no hay una tira de texto asomando por el hueco superior del
header. Verificado con Puppeteer en las 18 rutas.

### ⚠️ Sistema de animación — hay DOS, más una capa global de cursor+scroll

El proyecto convive con dos motores de animación ligada al scroll. **Antes de
animar algo, mira en qué zona estás.** Desde 2026-09-03 (22) existe además una
**tercera pieza, pero no es un tercer motor**: una capa global de cursor +
scroll suave que no anima ninguna sección — ver "Sistema global de cursor +
scroll suave", justo debajo de esta tabla.

| | **Zona A — la home y el resto** | **Zona B — páginas de programa** |
|---|---|---|
| Motor | `animation-timeline: view()` (CSS nativo) | **GSAP + ScrollTrigger** |
| Dónde | `app/page.tsx`, `components/home/*` | `/mbim-page`, `components/programa/*` |
| CSS | bloque *"Dinamismo de la home"* (`globals.css` ~563) | bloque *"RECORRIDO DE PROGRAMA"* (~717) |
| Coste | 0 KB | ~41 KB gz, **carga diferida** |

**🚨 NUNCA pongas una regla `animation-timeline` sobre un elemento que GSAP anime.**
Una animación CSS en curso gana a los estilos inline, así que las dos se pelean
por el mismo `transform` y el resultado son saltos. Por eso los componentes de
`programa/` usan atributos `data-*` como diana y **no** las clases
`.hero-parallax` / `.section-parallax`, que pertenecen a la home.

**Por qué la capa global no es un tercer motor y no rompe esta regla:** ni el
punto del cursor (`.site-cursor`, un `<div>` fijo que no existe en ninguna
Zona) ni Lenis (que solo cambia CUÁNDO se actualiza el `scrollTop` real del
documento, con easing — nunca CÓMO se pinta cada Zona) tocan ningún elemento
que Zona A o Zona B ya animen. `animation-timeline: view()` lee la posición de
scroll nativa del documento; Lenis, sin `wrapper`/`content` propios, sigue
escribiendo esa misma posición nativa (solo que suavizada) — por eso los
reveals de la home siguen funcionando exactamente igual con Lenis montado
encima, verificado con Chrome real (ver más abajo).

#### Por qué se añadió GSAP (sept. 2026)
`animation-timeline` solo lo soporta **~84 %** del parque de navegadores: Safari
anterior a 26 y Firefox anterior a 132 veían la página **completamente quieta**.
Uno de cada seis visitantes se perdía todo el trabajo de dinamismo. GSAP funciona
en todos. Ese fue el motivo principal, no "más efectos".

Además, [desde 2025 GSAP es gratuito al 100 %, plugins incluidos](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/)
tras la compra por Webflow — **SplitText incluido**, que antes costaba 99 $/año.

#### Qué hace cada pieza
| Librería | Peso gz | Dónde se usa |
|---|---|---|
| `gsap` core | ~23 KB | Tweens y curvas (`expo.out`, `back.out`) |
| `ScrollTrigger` | ~11 KB | Pin del M3, parallax, contadores, barra de progreso |
| `SplitText` | ~7 KB | **Solo** el titular del cierre (`closing-cta.tsx`). Si se usa en todos los titulares deja de significar nada |
| `lenis` | ~10 KB | Scroll suave, **sincronizado con ScrollTrigger** |
| **Descartado: Motion** | — | Sería un segundo motor para lo que GSAP ya hace. Dos vocabularios de easing y +34 KB sin capacidad nueva |

#### Infraestructura (reutilízala, no la dupliques)
| Pieza | Qué hace |
|---|---|
| `lib/gsap.ts` | Carga diferida y memoizada de `gsap` + `ScrollTrigger` + `SplitText`. Registra los plugins **una sola vez** |
| `lib/gsap-core.ts` | Carga diferida de **solo** `gsap` (sin plugins) — la usa la capa global de cursor, no la dupliques con `lib/gsap.ts` |
| `hooks/use-gsap-effect.ts` | `useGsapEffect` acota las animaciones a una sección con `gsap.context` (se revierte sola al desmontar) |
| `hooks/use-magnetic.ts` | CTA magnético con `gsap.quickTo` — genérico desde el principio, no exclusivo de programa (ya lo usaban también `components/landing/*`) |
| `components/programa/motion-root.tsx` | Ya NO crea Lenis ni el cursor (ver más abajo) — solo la barra de progreso de lectura y la sincronía de la Lenis global con ScrollTrigger |
| `components/site-motion/` | La Lenis global y el cursor — ver "Sistema global de cursor + scroll suave" |

**La sincronía Lenis↔ScrollTrigger sigue sin ser opcional**, pero desde
2026-09-03 (22) `MotionRoot` no crea su propia Lenis — usa `useLenis()` de
`lenis/react` para engancharse a la instancia única que monta
`SiteMotionProvider` en `app/layout.tsx`. Sin esa sincronía, Lenis interpola
por su cuenta y ScrollTrigger lee la posición nativa: el parallax va a
destiempo.

#### 🔒 `prefers-reduced-motion` — TRES capas, no negociable
1. **GSAP ni siquiera se descarga** si la preferencia está activa (`use-gsap-effect.ts`)
2. **`gsap.matchMedia()`** dentro de cada sección revierte lo que hubiera
3. **Bloque CSS de anulación** al final de `globals.css` (uno por zona)

Reacciona **en caliente**: si el usuario cambia la preferencia, se monta o
desmonta sin recargar. **Si añades una animación, añádela también a la lista de
anulación del bloque CSS de su zona.**

#### 🔒 Reglas de rendimiento del hero
- La imagen conserva `priority` → su `<link rel="preload">`.
- **El titular del hero se anima con CSS puro** (`.hero-line`), que arranca en el
  primer pintado. **Nunca lo animes con GSAP ni le pongas `Reveal`**: dependería
  de la hidratación y hundiría el LCP.
- Verificado: **GSAP aparece 0 veces en el HTML inicial.**
- Animar solo `opacity` y `transform` → sin reflow ni CLS.

#### Primitivas de la zona A (siguen vigentes en la home)
`Reveal` · `StatCounter` · `TiltCard` · `useInView`.
El estado oculto de `Reveal` solo se aplica bajo `[data-reveal="on"]`, que pone
un script inline de `app/layout.tsx`: **sin JS no se oculta nada**.

🗑️ **`components/home/smooth-scroll.tsx` (`SmoothScroll`) borrado en
2026-09-03 (22)** — la home tenía su PROPIA Lenis, independiente de la de
programa, con la misma sintonía (`duration: 1.05, wheelMultiplier: 0.9`) pero
sin compartir instancia con nadie. Al montar la Lenis global
(`SiteMotionProvider`), mantener `SmoothScroll` habría creado una segunda
Lenis en la home — el mismo bug que se evitó en programa, encontrado en la
propia auditoría previa a este trabajo. Ver "Sistema global de cursor +
scroll suave".

### 🖱️ Sistema global de cursor + scroll suave (2026-09-03 (22))

Encargo del cliente: llevar tres piezas de `/mbim-page` a **todo el sitio** —
el punto de cursor que crece cerca de los CTA, el relleno-por-barrido +
magnetismo de los botones, y el scroll suave (Lenis). Antes de tocar página
por página se hizo la auditoría que el propio cliente pidió, con un hallazgo
que cambió el plan de raíz.

#### Auditoría: NINGUNA de las tres piezas era reutilizable "tal cual" — y una tercera Lenis ni se sabía que existía
- **Lenis** vivía duplicada, no una vez sino **dos**: `MotionRoot`
  (`components/programa/`) creaba su propia instancia en cada una de las 4
  páginas de programa, y **la home tenía la suya propia e independiente** en
  `components/home/smooth-scroll.tsx` (`SmoothScroll`, con la misma sintonía
  `duration:1.05`/`wheelMultiplier:0.9` — nadie lo documentó como parte del
  "sistema Lenis" hasta esta auditoría). Si se hubiera montado una Lenis
  global sin más, la home habría acabado con **dos Lenis simultáneas**
  peleando por el mismo scroll — el mismo bug que la propia globalización
  pretendía evitar en programa, pero en un sitio donde nadie lo esperaba.
- **El cursor** vivía cableado dentro de `MotionRoot`, sin componente propio
  — copiar su JSX y su `useEffect` a un layout global sin extraerlo primero
  habría duplicado ~50 líneas de lógica en dos sitios.
- **El botón de relleno-por-barrido** (`.btn-journey`) **no era una clase
  compartida**: existía literalmente **copiada 5 veces** con nombres
  distintos (`.btn-journey`, `.btn-online`, `.btn-blueprint`, `.btn-balance`,
  `.btn-tablon`), una por cada vocabulario visual de página, mecánica CSS
  idéntica letra por letra en las cinco.
- El magnetismo (`hooks/use-magnetic.ts`) **sí era ya reutilizable tal cual**
  — genérico desde el principio, sin nada de programa en su implementación,
  y ya usado incluso fuera de programa (`components/landing/*`). No hizo
  falta tocarlo, solo aplicarlo donde faltaba.

#### Cómo se resolvió cada pieza
| Pieza | Antes | Ahora |
|---|---|---|
| Lenis | 3 instancias independientes (programa ×1 por página, home ×1) | **1 sola**, `<ReactLenis root>` de `lenis/react` en `app/layout.tsx` (`SiteMotionProvider`). Cualquier componente se engancha con `useLenis()` sin crear otra |
| Cursor | Cableado dentro de `MotionRoot`, sin componente propio | `components/site-motion/global-cursor.tsx` — un componente, montado una vez |
| Botón (barrido) | 5 clases CSS idénticas, una por vocabulario | + `.btn-sweep`, la versión sin vocabulario propio, para cualquier CTA nuevo. Las 5 existentes **no se tocaron** — ya aprobadas, cambiarles el nombre no aportaba nada y arriesgaba romper algo revisado |
| Botón (magnetismo) | `useMagnetic()`, ya reutilizable | Sin cambios — solo se aplicó en los CTA de las páginas demo |

#### 🔒 `data-lenis-prevent` — el escape hatch para contenedores con scroll propio
Lenis, sin `prevent`/`allowNestedScroll` configurados (ver arriba, opciones
de `SiteMotionProvider`), captura la rueda del ratón de **todo** el
documento por defecto — incluida cualquier `overflow-y-auto` anidada, salvo
que ese nodo (o un ancestro) lleve el atributo `data-lenis-prevent`, que la
propia librería respeta al construir su `composedPath` de intercepción. El
touch no necesita este atributo: `syncTouch` nunca se activa en este
proyecto, así que Lenis ya cede el control al scroll táctil nativo por
defecto — el problema es solo de rueda de ratón en escritorio. Primer
consumidor real: `components/admision-modal.tsx` (`DialogContent`, ver
CLAUDE.md §7 "(45)") — cualquier otro modal o panel con su propio scroll
interno que se añada en el futuro necesita el mismo atributo o sufrirá el
mismo bug.

#### Por qué no choca con Zona A ni con Zona B
Ver la nota en "Sistema de animación — hay DOS" más arriba. En una frase: el
cursor es un `<div>` nuevo que ninguna animación existente toca, y Lenis
(sin `wrapper`/`content` propios) sigue escribiendo el `scrollTop` real del
documento — solo lo suaviza, no lo virtualiza — así que `animation-timeline:
view()` (Zona A) sigue leyendo la posición real y funciona exactamente igual
que antes de esta pieza. Verificado con Chrome real en la home: los reveals
de `[data-reveal="on"]`/`StatCounter` disparan correctamente con Lenis
montado.

Para Zona B (GSAP + ScrollTrigger, programa), el cambio es más profundo:
`MotionRoot` **ya no crea su propia Lenis**. En su lugar usa `useLenis()` de
`lenis/react` para engancharse a la Lenis única de `SiteMotionProvider`, y
sigue llamando a `ScrollTrigger.update()` en cada tick de scroll — la misma
garantía de sincronía que antes (sin ella, el parallax del M3 iría a
destiempo), solo que ahora contra una instancia compartida en vez de una
propia. El punto del cursor **se quitó por completo** de `MotionRoot` — ya lo
pinta `GlobalCursor`, y tener los dos habría significado dos puntos
superpuestos. Verificado con Chrome real en `/mbim-page`: la barra de
progreso de lectura avanza con el scroll, el carril de módulos (M3, pin +
scroll horizontal) funciona sin recortes, y solo hay **un** `.site-cursor` en
el HTML (antes `.journey-cursor`, retirado del CSS — ya no lo usa nadie).

#### Archivos nuevos
- `lib/gsap-core.ts` — carga diferida de **solo** `gsap` (sin ScrollTrigger
  ni SplitText). El cursor y el magnetismo no necesitan esos dos plugins
  (~18 KB gz), así que una página sin ningún otro uso de GSAP (home, blog,
  tienda) nunca paga ese peso de más — solo el núcleo. Si la misma página
  también usa `lib/gsap.ts` (páginas de programa), el navegador comparte el
  mismo chunk de `gsap` entre ambos loaders, no lo descarga dos veces.
- `components/site-motion/global-cursor.tsx` — el punto de cursor, extraído
  de `MotionRoot`. Autogestionado: si el usuario pide `prefers-reduced-motion`
  o el puntero es táctil, no llega a descargar `gsap-core.ts`.
  **Adaptación nueva, pedida explícitamente por el encargo**: sobre
  `input`/`textarea`/`select` el punto se apaga del todo (no solo deja de
  crecer) — en un formulario largo (`/checkout`, `/contact-page`,
  `/application`) un punto azul creciendo sobre cada campo es ruido, el
  cursor de texto nativo ya comunica "aquí se escribe" mejor. Verificado con
  Chrome real en `/contact-page`: el punto se ve sobre las etiquetas del
  formulario y desaparece exactamente al entrar en un campo de texto.
- `components/site-motion/site-motion-provider.tsx` — monta `<ReactLenis
  root>` (de `lenis/react`, **no** una Lenis hecha a mano) y `<GlobalCursor>`.
  Un solo componente, montado una sola vez en `app/layout.tsx`. Gatea Lenis
  por `prefers-reduced-motion` (reactivo, se desmonta en caliente si el
  usuario cambia la preferencia) y por `pointer: fine` (en táctil, el scroll
  nativo ya es mejor que cualquier interpolación).
- `components/home/hero-primary-cta.tsx`, `components/financiacion/balance-hero-cta.tsx`
  — el CTA principal de home y de Financiación, extraídos a un Client
  Component mínimo **solo** por `useMagnetic` (necesita ref + efectos de
  cliente). El resto de esas dos páginas sigue siendo Server Component —
  el LCP (imagen + título del hero, en CSS puro) no se ve afectado.

#### Archivos modificados
- `app/layout.tsx` — `<SiteMotionProvider />` montado una vez, sibling de
  `<ScrollToTop>`, dentro de `<body>`.
- `components/scroll-to-top.tsx` — con Lenis global persistente entre
  navegaciones (a diferencia de antes, cuando cada página de programa creaba
  y destruía su propia Lenis), un `window.scrollTo(0,0)` a pelo al cambiar de
  ruta ya no bastaba: Lenis no se entera y seguiría animando hacia su último
  objetivo recordado, revirtiendo el salto a 0 en el siguiente tick. Ahora
  usa `useLenis()` y, si hay una instancia activa, le pide `lenis.scrollTo(0,
  {immediate:true})`; si no la hay (táctil, reduced-motion), cae al
  `scrollTo` nativo de siempre.
- `components/programa/motion-root.tsx` — ver la tabla de arriba. Ya no crea
  Lenis ni el cursor; solo la barra de progreso y la sincronía con
  ScrollTrigger vía `useLenis()`.
- `app/page.tsx` — quitado `<SmoothScroll />` (Lenis local de la home, ahora
  redundante) y su import; CTA principal del hero sustituido por
  `<HeroPrimaryCta />`.
- `app/tienda/tienda-client.tsx` — CTA de cierre ("Contactar con un asesor")
  con `.btn-sweep` + `useMagnetic` — ya era Client Component, no hizo falta
  extraer nada.
- `components/financiacion/balance-hero.tsx` — CTA sustituido por
  `<BalanceHeroCta />`.
- `app/globals.css` — nuevo bloque "SISTEMA GLOBAL DE MOVIMIENTO — CURSOR +
  BOTÓN, TODO EL SITIO" (antes del bloque "Dinamismo de la home"): `.site-cursor`
  (antes `.journey-cursor`, movido aquí) y `.btn-sweep` (versión sin
  vocabulario propio del patrón de barrido), con su propio bloque
  `prefers-reduced-motion`. El bloque de anulación de "RECORRIDO DE
  PROGRAMA" perdió las dos referencias a `.journey-cursor` (ya no existe).

#### 🎯 Demo aprobada en 3 páginas, pendiente de extender al resto
Por petición explícita del cliente, el botón (`.btn-sweep` + `useMagnetic`)
se aplicó primero solo a **un CTA por página** en 3 páginas de muestra —
**home** (hero, "Solicitar información"), **tienda** (cierre, "Contactar con
un asesor") y **Financiación** (hero, "Explorar opciones", que ya tenía
`.btn-balance` y solo ganó el magnetismo) — para que el cliente lo apruebe
antes de extenderlo al resto de CTAs del sitio. El cursor y Lenis, en
cambio, **ya están activos en las 47+ páginas** desde que se montó
`SiteMotionProvider` en el layout raíz — no necesitan aprobación por página,
son ambiente puro y no cambian ningún botón existente.

**Deliberadamente NO se tocó** (a la espera de esa aprobación): ningún botón
de `/admin/*`, ningún botón de formularios transaccionales (`/checkout`,
`/contact-page`, `/application`), ni el componente compartido `Button`
(`components/ui/button.tsx`) — este último a propósito: inyectar `.btn-sweep`
ahí habría cambiado de golpe el aspecto de todos los botones del sitio
(incluidos los del panel de admin y el checkout) sin que nadie lo hubiera
revisado. Extender el botón al resto del sitio, cuando se apruebe, debe
hacerse CTA por CTA (como en la demo), no baked-in al componente compartido.

**Extendido en (23)** (ver la sección siguiente): el *magnetismo* — no el
`.btn-sweep`, que sigue siendo opt-in CTA por CTA por el mismo motivo de
arriba — pasó de "un CTA por página" a "todos los botones reales" de estas
3 páginas más el header/footer compartidos, a través de un motor
centralizado nuevo y sí baked-in en `<Button>` (pero detrás de una prop
`magnetic` que hay que pasar explícitamente, nunca por defecto).

### 🧲 Magnetismo de botones — motor centralizado y rollout a las 3 páginas de prueba (2026-09-03 (23))

Encargo del cliente, extensión explícita de (22): lo que hoy pull del cursor
en solo 3 CTA debe aplicarse a **todos** los botones del sitio — navegación
(header/footer/submenús), CTAs de héroes/ventas/carrusel, botones de
formulario, acciones del panel de admin, e iconos pequeños (con el tirón más
sutil). Pedido explícito: un mecanismo centralizado (no copiar lógica en
cada botón) y probarlo primero en las mismas 3 páginas de muestra antes de
extenderlo al resto del sitio.

**Por qué `hooks/use-magnetic.ts` no escalaba tal cual**: cada botón que lo
usaba montaba su propio `window.addEventListener("pointermove", ...)` —
sostenible para 8 usos puntuales (el MBIM, landing, y los 3 de la demo de
(22)), pero no para "todos los botones del sitio": decenas de listeners de
scroll/puntero idénticos compitiendo por el mismo evento. El hook **no se
tocó ni se borró** — sigue usándose tal cual donde ya estaba (MBIM, MBBE,
EMBIM, `/landing`), cero regresión ahí.

**Motor nuevo, un solo listener para todo el sitio**:
`components/site-motion/global-magnetic.tsx` (`GlobalMagnetic`, montado una
vez en `SiteMotionProvider`, mismo patrón que `GlobalCursor`: un único
`pointermove` delegado en `window`, no uno por botón). En cada frame
(`requestAnimationFrame`, no en cada evento bruto) recorre una lista
cacheada de elementos candidatos, calcula cuál está más cerca del cursor
dentro de su propio radio de influencia, y anima solo ese con
`gsap.quickTo` — el mismo cálculo de radio/caída que ya usaba
`use-magnetic.ts` (media diagonal × 0,9 + 60px), para que el tirón se
sienta idéntico al de los CTA que ya estaban aprobados. La lista de
candidatos se refresca con un `MutationObserver` (menú móvil, paneles de
Radix montados por portal, filas añadidas dinámicamente) y en cada resize —
nunca con un `querySelectorAll` en cada movimiento de ratón.

**Cómo se marca un botón — dos vías, nunca lógica copiada:**
1. `<Button magnetic>` — prop nueva en `components/ui/button.tsx`, opt-in
   (por defecto `false`), pone `data-magnetic="on"` en el elemento real
   (funciona igual con `asChild` envolviendo un `<Link>`). Cubre de un
   plumazo cualquier botón que ya pase por el componente compartido —
   formularios, admin, la mayoría de CTAs — sin tocar su lógica interna.
2. `data-magnetic` a pelo en cualquier `<a>`/`<button>` que no pase por
   `<Button>` (triggers de `DropdownMenuTrigger`, links `.btn-sweep`/
   `.btn-balance`/etc. de cada vocabulario visual, iconos del footer).
   `data-magnetic-strength="0.2"` suaviza el tirón donde el atenuado
   automático por tamaño (ver abajo) no basta; `data-magnetic="off"` es la
   vía de escape explícita.

**Botones pequeños, más sutil, automático**: si el lado menor del elemento
mide menos de 48px (el tamaño de `size="icon"` de `Button`), el motor reduce
la fuerza a la mitad por su cuenta — no hace falta anotarlo a mano salvo que
se quiera afinar más (`data-magnetic-strength` siempre gana si está
presente).

**Migrados del hook manual al motor centralizado** (los 3 CTA de la demo de
(22), que si se hubieran dejado con `useMagnetic` habrían quedado
compitiendo con el motor nuevo por el mismo elemento):
`components/home/hero-primary-cta.tsx` y
`components/financiacion/balance-hero-cta.tsx` pierden `"use client"` y el
hook — ya no necesitan ningún JS de cliente propio, `<Button asChild
magnetic>` basta y ambos vuelven a ser renderizables en el servidor
(el LCP del hero, ya en CSS puro, no dependía de ellos de todos modos). El
CTA de cierre de `app/tienda/tienda-client.tsx` (que sigue siendo Client
Component por otros motivos) cambia su `ref={ctaRef}` por `data-magnetic`
directamente en el `<Link>`.

**Rollout de esta pieza — qué quedó marcado `data-magnetic`:**
| Dónde | Qué |
|---|---|
| `components/header.tsx` (compartido, sale en las 47+ páginas) | Los 3 `DropdownMenuTrigger` (PROGRAMAS/RECURSOS Y SERVICIOS/CONOCE IDESIE), el link CONSULTORIA BIM, CAMPUS VIRTUAL (escritorio y móvil), el botón de hamburguesa, el botón de cerrar del cajón móvil, los 3 acordeones del cajón móvil, y los 4 "Quick Links" + Contacto del cajón móvil. **Deliberadamente sin marcar**: los ítems individuales de cada desplegable (`.nav-dropdown-link`, p. ej. "MBIM"/"Blog"/"Sobre IDESIE") — son filas de una lista, no botones, mismo criterio que el resto del sitio |
| `components/cart-icon.tsx` | El icono del carrito (usa `<Button magnetic>`) |
| `components/footer-section.tsx` (el footer real — ver nota abajo) | Los 3 iconos de redes sociales (Instagram/Facebook/LinkedIn), fuerza reducida. Las columnas de enlaces de texto (Programas/Enlaces Rápidos/Legal) **no** se tocaron — son listas de texto, no botones |
| `app/page.tsx` (home) | Los 5 `<Button>` restantes de la página (héroe secundario, consultoría, blog, y los 2 del CTA final), todos con `magnetic` |
| `components/tienda/filtro-panel.tsx` | Los botones-píldora de filtro (Tipo/Categoría), fuerza reducida — son pequeños y van en fila |
| `components/financiacion/balance-closing.tsx`, `components/financiacion/balance-ledger.tsx` | El CTA de cierre, el CTA dentro del panel de becas, y las 2 pestañas Full Time/Executive (fuerza reducida) |

🔴 **Hallazgo en el propio footer, no relacionado con el magnetismo**:
`components/footer.tsx` (un segundo componente `Footer`, distinto de
`FooterSection`) **no lo importa ningún archivo del proyecto** — es código
muerto, el footer real de las 47+ páginas es siempre
`components/footer-section.tsx` (`FooterSection`). Se marcó primero por
error el archivo muerto (revertido) antes de encontrar el real — anotado
aquí por si algún día se decide borrar `components/footer.tsx` de una vez
(no se borró en esta sesión, fuera del encargo).

**Deliberadamente sin tocar en esta pieza** (fuera de las 3 páginas de
prueba, a la espera de que el cliente las revise antes de seguir): ningún
botón de `/admin/*`, de `/checkout`, `/pago-directo`, `/contact-page`,
`/application`, ni de las 4 páginas de máster / demás páginas públicas.
`producto-card.tsx` (la ficha completa de producto en `/tienda` es un único
`<Link>` gigante) tampoco se marcó a propósito: magnetizar una tarjeta
entera se sentiría como un bug, no como un CTA — el magnetismo es para
botones, no para superficies de contenido completas.

**Verificado con Chrome real (Puppeteer, dev server local)**: en las 3
páginas de prueba, cada botón marcado se desplaza hacia el cursor al
acercarse y vuelve a 0 al alejarse (confirmado leyendo `transform`
calculado, no solo visualmente); un clic sobre un CTA magnético sigue
navegando a su destino real (probado con el CTA del hero de home →
`/contact-page`); el trigger PROGRAMAS del header sigue abriendo su
desplegable con normalidad tras el hover; con
`prefers-reduced-motion: reduce` emulado, el CTA del hero **no se mueve en
absoluto** (ni siquiera se llega a descargar `gsap-core`). Sin errores de
consola en ninguna página probada.

**Verificado:** `rm -rf .next/types && npx tsc --noEmit` en el mismo 1
error preexistente (`sobre-idesie-page`, sin relación), `npx next build`
exit 0 con las mismas rutas que antes (home/tienda/financiación siguen
prerenderizadas como estáticas — quitar `useMagnetic` de los 2 CTA que lo
tenían no las volvió dinámicas, al contrario, las simplificó).

**Pendiente, explícito**: extender `data-magnetic`/`<Button magnetic>` al
resto de páginas públicas, a los formularios transaccionales y al panel de
`/admin/*` cuando el cliente apruebe lo visto en estas 3 páginas — el motor
centralizado ya soporta ese rollout sin cambios (solo hay que marcar los
elementos), así que la siguiente pieza es puramente de alcance, no de
infraestructura.

**Verificado con Chrome real:**
- Home, tienda y Financiación: el punto de cursor crece sobre los tres CTA
  demo, el relleno sube desde abajo al hover, y el botón se desplaza hacia
  el cursor al acercarse (magnetismo).
- `/mbim-page`: sin regresión — barra de progreso, carril de módulos (M3) y
  el resto de animaciones GSAP siguen funcionando idénticas a antes del
  refactor de `MotionRoot`.
- `/contact-page`: el punto de cursor se apaga sobre los campos de texto del
  formulario largo, tal como pide la restricción de usabilidad.
- Sin errores de consola en ninguna de las páginas probadas.

**Verificado:** `rm -rf .next/types && npx tsc --noEmit` en el mismo 1 error
preexistente (`sobre-idesie-page`, sin relación), `npx next build` exit 0
con las 55 rutas generadas, home/tienda/financiacion siguen prerenderizadas
como estáticas (la extracción de los CTA a Client Components no las volvió
dinámicas).

### 🚧 Rediseño premium de 3 páginas institucionales — en curso (2026-09-03 (24)+)

Encargo del cliente: rediseño completo de **Sobre IDESIE**, **Nuestra
Metodología** y **Profesores** con identidad "super premium" — atención
obsesiva a tipografía/espaciado, animación GSAP al nivel de las páginas de
máster, `prefers-reduced-motion` respetado en todo momento. Las tres
comparten tono institucional/corporativo dirigido a decisores (directores de
talento, CIOs, alumnos evaluando en serio) — no es marketing de
"experiencia", es confianza y credibilidad profesional. Deben sentirse
familia (misma pareja tipográfica Inter+Roboto Mono, mismo ritmo de
animación) pero cada una con su propia identidad — **decisión explícita: no
se introduce una tercera familia tipográfica solo para estas tres páginas**,
se diferencian por composición/escala/motivo animado, no por fuente (así se
mantiene la disciplina tipográfica que ya sostiene los otros ocho
vocabularios visuales del sitio).

Proceso seguido, pedido explícitamente por el cliente: auditoría de las 3
páginas actuales antes de tocar código, 2 direcciones de diseño propuestas
por página, aprobación del cliente antes de construir. Cargada la skill
`frontend-design-anthropic` para la fase de dirección (`website-rebuild` y
`theme-factory` no aplican a este proyecto: son para reconstrucciones
completas desde una URL a Astro o para aplicar temas a artifacts, no para
editar páginas dentro de un Next.js existente con su propio sistema de
diseño).

**Hallazgos de la auditoría, antes de tocar nada:**
- `/sobre-idesie-page`: `<SEOStructuredData type="organization" data={...}>`
  pasaba una prop `type` que el componente no acepta — era el único error
  preexistente de `npx tsc --noEmit` del proyecto. Importaba `Card`/
  `CardDescription`/`CardTitle` sin usarlos. El propio CLAUDE.md decía que
  esta página "ya se rediseñó con criterio menos-es-más" — **no era cierto**,
  el código real era el patrón genérico de tarjeta+icono con `#006cff`
  hardcodeado, igual que las otras dos. Corregido el registro.
- `/nuestra-metodologia-page`: enlace roto `href="/contacto-page"` en el CTA
  del hero (ruta real: `/contact-page`).
- 🔴 **`/profesores-page` — hallazgo crítico**: **las 17 fotos de profesores
  están rotas en producción ahora mismo** — ninguno de los 17 archivos
  referenciados (`martin-murphy.jpeg`, `fernando-igual.png`, etc.) existe en
  `public/images/`, verificado por listado exhaustivo y búsqueda difusa por
  apellido. Además, **los 17 enlaces de LinkedIn eran inventados** (slugs
  generados del nombre, `linkedin.com/in/nombre-apellido`, nunca verificados
  contra un perfil real) y el CTA final enlazaba a `/contacto` (ruta rota).
  Nombres/cargos/bios sí son datos reales.
- Los 35 logos de empresas colaboradoras de Metodología sí existen todos en
  disco (nombres de archivo heredados feos, pero reales) — no hacía falta
  tocarlos.

**Direcciones aprobadas por el cliente** (cada página, sección propia más
abajo con el detalle de construcción):
| Página | Dirección elegida |
|---|---|
| Sobre IDESIE | "La Trayectoria" — timeline de hitos reales, ver detalle abajo. ✅ Construida (24) |
| Nuestra Metodología | "El Ciclo Práctico" — reestructura el contenido real ya existente (3 pilares + 3 pasos de implementación) en un ciclo, sin inventar contenido nuevo. ✅ Construida (24) |
| Profesores | "El Índice de Expertos" — directorio editorial tipo masthead, monogramas en vez de las fotos rotas, **sin los 17 LinkedIn inventados**. Se deja preparada con los 17 profesores actuales (nombres/bios/cargos reales) mientras no lleguen fotos/LinkedIn reales — decisión explícita del cliente. ✅ Construida (24) |

**Con esto se cierra el encargo de las 3 páginas institucionales.** Pendiente,
fuera de este encargo: verificación visual con Chrome real de las 3 (la
extensión no estaba conectada en esta sesión), y — cuando el cliente las
tenga — cargar fotos y LinkedIn reales de los 17 profesores (ver
`profesores-content.ts`, preparado para ese cambio sin rediseñar nada).

### Sobre IDESIE — rediseño propio "La Trayectoria" (2026-09-03 (24))

Noveno vocabulario visual propio del sitio (`.trayectoria-*` en
`globals.css`, junto a `.balance-*`/`.tablon-*`/etc.). El hero plantea la
pregunta central ("¿Quiénes somos?", pedido explícito del cliente) en vez de
una declaración de venta; el resto de la página la responde con datos
reales, no con storytelling inventado.

**El único momento ★ es el carril de trayectoria**
(`components/sobre-idesie/trayectoria-timeline.tsx`): un carril que se
dibuja con `scaleY` scrubbed al hacer scroll (mismo mecanismo genérico que
`balance-ledger.tsx`, reutilizado como infraestructura, no como identidad
prestada) con **solo 3 hitos**, deliberadamente — son los únicos anclas con
algún grado de certeza que existen en el proyecto (2012 fundación,
acreditación Cualificam/Madri+d/ENQA/EQAR sin año conocido, estado actual
con las 4 cifras reales). No se inventaron años intermedios que no constan
en ningún sitio del proyecto — la auditoría confirmó que no hay más hitos
con fecha documentados.

**Misión/Visión/Valores** (`trayectoria-principles.tsx`) pasan de 3 tarjetas
con icono desconectadas a una narrativa conectada por un único hilo vertical
estático — mismo espíritu que el carril de hitos pero sin scrub (no son
hechos cronológicos). **"Por qué elegir IDESIE"** (`trayectoria-reasons.tsx`)
reutiliza el patrón de tarjeta con borde izquierdo ya genérico del sitio
(Consultoría, Financiación, FAQ) — no un motivo nuevo.

**Botón**: usa `.btn-sweep` (el genérico de "SISTEMA GLOBAL DE MOVIMIENTO"),
no un `.btn-trayectoria` propio — estas 3 páginas institucionales no tienen
la densidad de CTAs de una página de venta, así que no se justifica un
vocabulario de botón dedicado por cada una.

**Se eliminó la sección de "cifras en banda"** que tenía la versión
anterior (12+/500+/100%/200+ aisladas en una franja azul): las mismas
cuatro cifras ya viven de forma más persuasiva dentro de la prosa del hito
"Hoy" del carril — mantenerlas también como banda aparte habría sido
redundante, contrario al criterio "menos elementos, mejor ejecutados" ya
acordado con el cliente para esta página.

**Corregido de paso**: el bug real de `SEOStructuredData` (prop `type`
inexistente) — ahora construye el objeto JSON-LD `EducationalOrganization`
completo inline, mismo patrón que el resto de componentes de schema del
proyecto (inyección client-side vía `useEffect`, la limitación ya conocida
y documentada de "JSON-LD solo en cliente" — pendiente de resolver a nivel
de sitio, no se ataca aquí). Import no usado de `Card`/`CardDescription`/
`CardTitle` eliminado.

**Verificado:** `npx tsc --noEmit` baja de 1 a **0 errores** (el único
error preexistente del proyecto era justo el bug de `SEOStructuredData` de
esta página). `npx next build` exit 0, `/sobre-idesie-page` prerenderizada
como estática. HTML servido verificado por `curl`: `<h1>` real, jerarquía
`<h2>`/`<h3>` correcta, canonical propio, cero referencias a imágenes rotas.
⚠️ No se pudo verificar visualmente con Chrome real en esta sesión (la
extensión de Claude in Chrome no estaba conectada) — pendiente de que el
cliente confirme visualmente el resultado en el navegador.

### Profesores — rediseño propio "El Índice de Expertos" (2026-09-03 (24))

Undécimo vocabulario visual propio (`.indice-*`). Tercera y última pieza del
encargo institucional. Directorio editorial tipo masthead de revista —
`components/profesores/indice-list.tsx` — en vez de la galería de tarjetas
"meet the team" de la versión anterior, a propósito: la auditoría encontró
que **las 17 fotos de profesores están rotas en producción** (ningún
archivo existe en `public/images/`, verificado uno por uno) y que **los 17
enlaces de LinkedIn eran inventados** (slugs generados del nombre, nunca
verificados). Ambos se retiraron de `profesores-content.ts` — no se publicó
ninguna foto rota ni ningún enlace potencialmente erróneo.

**`IndiceMonogram`** (`components/profesores/indice-monogram.tsx`) sustituye
la foto por las iniciales sobre un degradado en tonos de marca (3
combinaciones fijas cicladas por índice, nunca un color fuera de la paleta
de IDESIE) — mismo criterio que `balance-advisory.tsx` sustituyendo una
imagen rota por un motivo propio en vez de salir a buscar una foto de
stock. Es una mejora que se sustituye sola por `<Image>` el día que existan
fotos reales, sin tocar el resto del componente.

**Agrupación real, no inventada**: "Dirección" (Fernando Igual, Marcos
Luengo Sanchez — los dos únicos con IDESIE como organización en sus propios
datos, no una empresa colaboradora externa) y "Cuerpo docente" (el resto,
15 profesionales de Hill International/Ionetree/ISG/L35/Sir Robert
McAlpine/etc.). No se inventó ninguna taxonomía de especialidades (BIM
Management/MEP/Arquitectura...) para poder filtrar — el campo
`specialization` de los datos originales mezcla empresa y área de forma
inconsistente y no da pie a una categorización limpia sin inventar
criterio, así que se descartó el filtro para esta primera versión.

**Interacción principal**: cada fila se expande al clic para revelar la bio
completa (mismo mecanismo `grid-template-rows` que `.faq-panel`/
`.balance-ledger-panel`) — invita a explorar el claustro nombre a nombre en
vez de mostrar 17 párrafos de golpe. Entrada escalonada de las filas al
hacer scroll (`ScrollTrigger`, `once: true`).

**Corregido de paso**: el CTA final enlazaba a `/contacto` (ruta rota; real:
`/contact-page`).

**Verificado:** `npx tsc --noEmit` en 0 errores (sin cambios). `npx next
build` exit 0, `/profesores-page` prerenderizada como estática. HTML
servido verificado por `curl`: cero referencias a las 17 imágenes rotas
(`martin-murphy.jpeg` y similares, confirmado ausentes), cero enlaces
`linkedin.com/in/*` de profesor (los 2 `linkedin.com` que sí aparecen en la
página son el enlace real de la empresa IDESIE en el footer, no de ningún
profesor), monogramas con iniciales correctas para los 17 nombres, cero
`href="/contacto"`. ⚠️ No verificado visualmente con Chrome real en esta
sesión (extensión no conectada) — pendiente de confirmación visual del
cliente, igual que las otras dos páginas.

### Nuestra Metodología — rediseño propio "El Ciclo Práctico" (2026-09-03 (24))

Décimo vocabulario visual propio (`.ciclo-*`). Dirección aprobada por el
cliente: reestructurar el contenido real ya existente — los 3 "pilares"
(Prácticas remuneradas inmediatas / Proyectos reales para clientes reales /
Integración profesional inmediata) y los 3 pasos de "implementación"
(Módulos / Tutela / Práctica) de la versión anterior describían el mismo
proceso en dos formatos redundantes (el porqué y el cómo) — fusionados en
**3 fases de un ciclo** (`components/metodologia/ciclo-diagram.tsx`,
`app/nuestra-metodologia-page/metodologia-content.ts`): **Aplicar desde el
primer día → Tutelar con profesionales en activo → Consolidar la
integración profesional**, que vuelve a empezar con el siguiente proyecto
real. Ningún hecho nuevo, solo reorganización — aprobado explícitamente por
el cliente en vez de pedir contenido nuevo de fases.

**Diferenciación deliberada frente al "día partido"** que ya usan las 4
páginas de máster para Learning by Working a nivel de programa: aquí no hay
dos mitades (mañana/tarde), hay un proceso continuo — el diagrama conecta
las 3 fases con conectores escalados y cierra el ciclo con un arco
(`stroke-dashoffset` scrubbed, mismo mecanismo que el carril de "La
Trayectoria" aplicado a una curva) que vuelve de la fase 3 a la fase 1, con
la etiqueta "El ciclo se repite con cada proyecto real". Es el único
momento ★ de la página.

**Otros cambios sobre la versión anterior:**
- 🔴 Corregido el enlace roto `href="/contacto-page"` del CTA del hero (ruta
  real: `/contact-page`).
- Los anillos SVG genéricos de las estadísticas de empleo por sector
  (40/30/20/10%) se sustituyen por barras horizontales que se dibujan al
  scroll (`ciclo-resultados.tsx`) — mismos datos reales, sin el motivo
  circular decorativo sin propósito.
- Los **35 logos reales** de empresas colaboradoras dejan de ser un grid
  estático y pasan a un **marquee infinito en CSS puro** (`ciclo-empresas.tsx`,
  se pausa al hover/foco, respeta `prefers-reduced-motion` con una regla de
  anulación dedicada) — `LogoCarousel` (carrusel de clic manual, sin usar en
  ningún sitio del proyecto) no se tocó ni se reutilizó, era el patrón
  equivocado para "premium animado".
- La banda de 4 cifras (100% empleabilidad, +200 empresas, 11.000€, 9.2/10)
  se mantiene pero sin `#006cff` hardcodeado (usa los tokens de marca) y con
  entrada escalonada en vez de estática.

**Verificado:** `npx tsc --noEmit` en 0 errores (sin cambios). `npx next
build` exit 0, `/nuestra-metodologia-page` prerenderizada como estática.
HTML servido verificado por `curl`: jerarquía de encabezados correcta, cero
`href="/contacto*"`, los 35 logos duplicados a 70 en el marquee (confirmado
contando cada `alt` real). ⚠️ No verificado visualmente con Chrome real en
esta sesión (extensión no conectada) — pendiente de confirmación visual del
cliente, igual que Sobre IDESIE.

### 🚧 Rediseño premium de 3 páginas de prueba social — completado (2026-09-03 (25))

Segunda tanda del mismo encargo que las 3 páginas institucionales (ver
arriba): **Alumnos**, **Alianzas Académicas** y **Opiniones**, mismo nivel
premium/GSAP, pero con un tono distinto — aquí la confianza viene de
terceros (alumnos, instituciones, reseñas) hablando de IDESIE, no de la
institución hablando de sí misma. Mismo proceso pedido explícitamente:
auditoría antes de tocar código, confirmación de qué contenido es real
antes de proponer dirección, 2 direcciones por página, aprobación del
cliente.

**Hallazgos de la auditoría, antes de tocar nada** (más mixtos que en la
tanda institucional — ninguna de las tres estaba vacía, pero cada una tenía
su propia mezcla de dato real/sospechoso/roto):
- `/alumni-page`: la sección "Proyectos Destacados de Alumnos"
  (`StudentProjectsCarousel`) tenía 3 proyectos **ficticios** con imágenes
  en `/images/projects/student-project-*.jpg` que **nunca existieron en
  disco** (esa carpeta solo tiene las fotos reales del carrusel de
  Consultoría BIM) — el propio código ya la tenía comentada con un TODO
  reconociéndolo. Enlace roto `href="/masters"` (ruta inexistente). Los 3
  testimonios (Laura Pérez/Ferrovial, David Moreno/ACCIONA, Elena
  García/TYPSA) y las cifras de la banda (2.500+ alumnos, 45+ países, 95%
  empleabilidad, 200+ empresas) no aparecían verificados en ningún otro
  sitio del proyecto y contradecían las cifras oficiales usadas en el resto
  del sitio (500+/100%) — **confirmados como reales por el cliente**
  explícitamente antes de construir, no asumidos.
- `/alianzas-page`: 3 alianzas reales y específicas, cada una con un modelo
  de colaboración distinto (Universidad Panamericana — intercambio; UFV —
  orientación profesional; Blackwell Global University — licencia de
  contenido) — **confirmadas como reales**. Pero las fotos de campus de
  Panamericana y UFV **no existen en disco** (404 confirmado); solo la de
  Blackwell existe. Enlace roto `href="/contacto"`.
- `/opiniones-page`: 3 testimonios, 2 con señales fuertes de ser reales
  (Federico Tabasco cruza con un profesor real de `profesores-content.ts`,
  progresión de carrera coherente 2015→hoy; Chengye Xu con cita específica
  y año de programa) y uno más genérico (María González, sin empresa) —
  **confirmado como real, se mantiene**. La sección "Empresas que confían
  en nosotros" tenía 5 empresas con `logo: null` explícito en el código
  (placeholder nunca completado) — 4 de las 5 (L35, C95 Creative, Daikin,
  LKS) ya tienen logo real reutilizable de las 35 empresas colaboradoras de
  Metodología; **Siemens no tiene ningún logo en el proyecto y se retiró**
  (decisión del cliente) en vez de dejarlo sin verificar o inventar un logo.

**Direcciones aprobadas por el cliente:**
| Página | Dirección elegida |
|---|---|
| Alumnos | "El Legado" — cada alumno como panel a página completa con arco real "Programa → Hoy", en vez de rejilla de tarjetas. ✅ Construida |
| Alianzas Académicas | "El Convenio" — cada alianza con su propio tipo de colaboración legible, no un grid de logos idénticos. ✅ Construida |
| Opiniones | "El Archivo de Voces" — tratamiento editorial y contenido de las citas, sin tarjetas de degradado ni marquee. ✅ Construida |

### Alumnos — rediseño propio "El Legado" (2026-09-03 (25))

Duodécimo vocabulario visual propio (`.legado-*`). Sustituye el
`StudentProjectsCarousel` ficticio (eliminado por completo, no solo
comentado) por 3 paneles a página completa
(`components/alumni/legado-spotlights.tsx`), uno por alumno, alternando
fondo `gray-950`/`paper` para dar ritmo tonal. **El único momento ★**: cada
panel revela un monograma (mismo lenguaje que Profesores, sin foto real
disponible), la cita en tipografía grande, y un **arco real de solo 2
nodos** — "Programa (MBIM 20XX)" → "Hoy: rol en empresa" — con un carril
que se dibuja al hacer scroll, mismo mecanismo que "La Trayectoria" (Sobre
IDESIE) pero a escala de una persona en vez de la institución: eco
deliberado de familia visual, no una copia.

Corregido de paso: el CTA final apuntaba a `/masters` (ruta inexistente) →
ahora a `/comparativa-masters-page`, la ruta real que compara los 4
másteres.

**Verificado:** `npx tsc --noEmit` en 0 errores (sin cambios). `npx next
build` exit 0, `/alumni-page` prerenderizada como estática. HTML servido
verificado por `curl`: cero referencias a `student-project-*` (las
imágenes ficticias), cero `href="/masters"`, enlace real a
`/comparativa-masters-page` presente, título del hero renderizado
correctamente. ⚠️ No verificado visualmente con Chrome real en esta sesión
(extensión no conectada).

### Alianzas Académicas — rediseño propio "El Convenio" (2026-09-03 (25))

Decimotercer vocabulario visual propio (`.convenio-*`). El mensaje central
del rediseño: las 3 alianzas reales tienen 3 modelos de colaboración
distintos, así que cada una lleva su propia etiqueta de tipo
("Programa de intercambio" / "Orientación profesional" / "Licencia de
contenido") en vez de presentarse como 3 tarjetas de "partner" idénticas —
es lo que las diferencia de una página de logos genérica.

**El único momento ★**: los puntos reales de cada acuerdo se "sellan" al
entrar en pantalla (`components/alianzas/convenio-card.tsx`, mismo
mecanismo `back.out` + stagger que ya usa el sitio para hitos/becas,
aplicado aquí a una lista de acuerdo). Para Panamericana y UFV, sin foto de
campus real, un **emblema circular con las iniciales de la institución** en
un anillo punteado con rotación lenta (mismo mecanismo genérico que
`.balance-motif` de Financiación — girar el anillo, contrarrotar el
contenido central para que el texto no gire — reutilizado como técnica, con
su propio contenido) en vez de esperar a una foto o usar una de stock.
Blackwell Global University sí conserva su foto real.

Los 3 "beneficios" con icono en círculo azul de la versión anterior pasan a
una franja delgada con numeración en mono (01/02/03) — mismo criterio ya
aplicado en otras páginas para evitar el patrón de tarjeta+icono genérico.
Corregido de paso el CTA final, que apuntaba a `/contacto` (ruta rota; real
`/contact-page`).

**Verificado:** `npx tsc --noEmit` en 0 errores. `npx next build` exit 0,
`/alianzas-page` prerenderizada como estática. HTML servido verificado por
`curl`: cero `href="/contacto"`, cero referencias a las 2 fotos de campus
rotas, foto real de Blackwell presente, las 3 alianzas con su `<h3>` propio.
⚠️ No verificado visualmente con Chrome real en esta sesión.

### Opiniones — rediseño propio "El Archivo de Voces" (2026-09-03 (25))

Decimocuarto vocabulario visual propio (`.voces-*`), y deliberadamente el
más contenido de las 6 páginas de prueba social construidas en esta sesión
(institucionales + prueba social): sin tarjetas de degradado azul (se leían
como marketing producido), sin marquee, sin motivo decorativo — la
autenticidad se comunica con tipografía grande y restricción, no con
producción visual. Es la pieza donde "premium" significa contención, no
más movimiento.

El bloque "#TalentoIDESIE" pierde su recuadro azul grande y pasa a texto
plano con eyebrow (`components/opiniones/voces-intro.tsx`) — mismo texto
real, sin el tratamiento de autopromoción. Los 3 testimonios reales
(incluido el de María González, más genérico pero confirmado real) se
presentan como un **archivo editorial** (`voces-testimonials.tsx`): cita
grande, atribución en mono, sin tarjeta ni fondo de color — es el único
momento ★ de la página, deliberadamente sobrio.

"Empresas que confían en nosotros" pasa de 5 nombres sin logo (`logo:
null` explícito en el código) a **4 logos reales** (L35, C95 Creative,
Daikin, LKS — reutilizados de las 35 empresas colaboradoras reales de
Metodología) en una tira de confianza discreta y estática — sin marquee: con
solo 4 elementos, un bucle infinito se habría sentido apresurado, lo
contrario del criterio de esta página. Siemens se retiró por no tener
ningún logo verificable en el proyecto, decisión del cliente.

**Diferenciación explícita frente a "El Legado" (Alumnos)**: allí la cita
viene acompañada de un arco de carrera (programa → rol actual); aquí la
cita es la única protagonista, sin más aparato — cada página de prueba
social prueba un tipo de confianza distinto (individuo con trayectoria vs.
voz sola), no la misma sección repetida con otro nombre.

**Verificado:** `npx tsc --noEmit` en 0 errores. `npx next build` exit 0,
`/opiniones-page` prerenderizada como estática. HTML servido verificado por
`curl`: cero referencias a "Siemens", los 4 logos reales presentes con su
`alt` correcto. ⚠️ No verificado visualmente con Chrome real en esta
sesión.

### Carrito y Checkout — rediseño propio "Pedido" (2026-09-03 (26))

Decimoquinto vocabulario visual propio (`.pedido-*`), y el primero que no
es una página de contenido, sino el momento real de conversión — de ahí que
no lleve un nombre-concepto narrativo (a diferencia de "El Balance"/"La
Trayectoria"/etc.): en un flujo de pago la claridad pesa más que una
metáfora. Encargo con dos partes explícitamente aprobadas por el cliente
antes de construir nada: identidad visual propia para el carrito (no
hereda "El Catálogo Técnico" de tienda) y checkout como página única con
secciones (no un stepper de pantallas separadas).

#### 🔴 Hallazgo antes de diseñar nada: la validación en servidor y los cupones reales no existían

Auditando el checkout actual antes de proponer dirección, se confirmó que
dos cosas que el propio encargo pedía "mantener" **no existían en
absoluto**, tal como ya había quedado documentado (sin construir) en la
auditoría de (15) — ver la entrada de arriba:
- `handlePayment()` calculaba el importe final **enteramente en el
  cliente** y lo mandaba tal cual a Flywire, sin ninguna verificación
  server-side.
- `/api/coupons/validate` comparaba contra `COUPONS_FALLBACK`, una lista de
  5 códigos **escrita en el propio archivo** — la tabla real `coupons`
  nunca se tocaba, y encima ese endpoint recibía `basePrice` del cliente
  sin verificarlo contra nada.

Se confirmó explícitamente con el cliente antes de construir: sí, cerrar
ese hueco entra en el encargo (no era "solo rediseño visual"). Detalle de
lo construido:

#### Servidor: `app/checkout/actions.ts`, la única fuente de verdad del importe

Tres Server Actions, ninguna confía nunca en un precio que llegue del
cliente:
- **`calculateVerifiedTotal(cartItems, couponCode?)`** — por cada línea del
  carrito, recupera el precio real de `productos` (`precio_actual`, o
  `precio_matricula` si `category === "matricula"`, reutilizando el mismo
  truco de id negativo que ya usa `ficha-sidebar.tsx` desde (14): el
  producto real de una línea de matrícula es `-item.id`). Si un producto ya
  no existe o está inactivo, el pedido entero se rechaza con un error
  explícito en vez de calcular con lo que haya. Si se pasa un cupón, se
  valida contra la tabla `coupons` real (activo, dentro de
  `valid_from`/`valid_until`, `current_uses < max_uses`) antes de aplicar
  el descuento.
- **`createOrderAndGetPaymentUrl(cartItems, couponCode?, buyer)`** — vuelve
  a llamar a `calculateVerifiedTotal()` (nunca reutiliza un total ya
  calculado antes, por si el carrito cambió entre medias), inserta la fila
  en `orders` + sus líneas en `order_items` (**primer código del proyecto
  que escribe en esas tablas** — existían desde 2026-09-01 sin ningún
  consumidor real), incrementa `current_uses` del cupón si se usó uno
  (incremento simple, no atómico — volumen esperado bajo, una condición de
  carrera dejaría como mucho un uso de más, no un fallo de pedido) y **solo
  entonces** construye la URL de Flywire con el importe ya verificado. El
  cliente nunca decide el `amount` que llega a Flywire.
- Ambas con rama de modo mock (`isMock("SUPABASE_SERVICE_ROLE_KEY")`,
  mismo patrón que el resto del proyecto) contra `MOCK_PRODUCTS`.

⚠️ **`/pago-directo` (`components/direct-payment-form.tsx`) sigue sin
tocar** — no era parte de este encargo ("carrito y checkout", no la vía de
pago directo sin carrito) y sigue llamando al `/api/coupons/validate`
antiguo (cupón hardcodeado, sin verificación en servidor). Mismo hueco de
seguridad, pendiente para una sesión futura si se decide unificar los dos
flujos de pago.

#### Carrito (`CartDrawer`) — 3 bugs reales corregidos, no solo estética

- El overlay era literalmente transparente (`bg-[rgba(255,255,255,0)]`) →
  ahora un fondo real.
- Las clases de transición nunca se ejecutaban: el componente hacía
  `return null` en vez de desplazarse fuera de pantalla, así que se
  montaba/desmontaba de golpe sin animar nada pese a que el CSS sugería que
  debía deslizarse → ahora siempre está montado, se anima con `data-state`
  (`transform: translateX`) e `inert` cuando está cerrado.
- Ningún producto llevaba imagen real (📚 fijo) → se hiló `producto.imagen`
  desde `app/producto/[slug]/page.tsx` → `FichaSidebar` → `AddToCartButton`
  (los tres `CartItem` que puede generar esa página, incluida la línea de
  matrícula, ya lo llevan) hasta `PedidoItemRow`, que pinta la imagen real
  si existe.

`components/checkout/pedido-item-row.tsx` es la fila de artículo
**compartida** entre el drawer y el checkout — mismo marcado en los dos
sitios donde se lista el carrito. Quitar un artículo anima su salida
(fundido + desplazamiento) antes de llamar a `removeItem()` de verdad,
respetando `prefers-reduced-motion` (quita al instante si está activo).

#### Checkout (`/checkout`) — página única, 4 secciones numeradas

`app/checkout/page.tsx` orquesta el estado (carrito vía `useCart()`, datos
del comprador, cupón, y el resultado de verificación) y reparte el trabajo
en componentes de `components/checkout/`: `PedidoCartSection` (Paso 1),
`PedidoBuyerForm` (Paso 2), `PedidoCoupon` (Paso 3), `PedidoSummary` (Paso
4, columna fija en escritorio). Sin stepper: todo visible a la vez, pero
con la etiqueta "Paso N" como guía de lectura — se reconcilian así los dos
requisitos del cliente (página única, pero con la estructura de 4 pasos que
pedía originalmente).

**El momento ★**: el importe en `PedidoSummary` tiene 3 estados reales, no
decorativos — `verifying` (el total baja de opacidad mientras
`calculateVerifiedTotal()` está en vuelo), `verified` (se asienta con un
pequeño rebote y aparece "Importe verificado por el servidor" con icono de
escudo) y `error`. El botón de pago está **deshabilitado hasta que el
estado es `verified`** — no es un adorno, es la única puerta real hacia
Flywire. Se reverifica automáticamente (con 400ms de debounce) cada vez que
cambia el carrito o el cupón aplicado.

El cupón se aplica con un botón "Aplicar" explícito (`PedidoCoupon`), no al
teclear como antes — al aplicar, llama a la misma
`calculateVerifiedTotal()` que la verificación final, así que el descuento
que se ve es exactamente el que llegará a Flywire.

**Móvil**: `PedidoMobileBar` es una franja fija con el total y el estado de
verificación siempre visible mientras se recorren las 4 secciones — sin
botón propio (el real vive al final, en `PedidoSummary`) para no tener dos
botones de pagar en pantalla.

**Verificado:** `npx tsc --noEmit` en 0 errores. `npx next build` exit 0,
`/checkout` listada. HTML servido verificado por `curl`: estado de carrito
vacío renderiza correctamente (el carrito real vive en `localStorage`,
inaccesible por `curl`, así que la verificación interactiva completa —
añadir producto, aplicar un cupón real, confirmar el estado "verificado",
abrir Flywire — no se pudo hacer en esta sesión por no tener la extensión
de Claude in Chrome conectada). Revisión de código exhaustiva del truco de
id negativo (matrícula) en ambas direcciones para confirmar que
`calculateVerifiedTotal()` recupera el producto real correcto.

### 🚧 Auditoría y rediseño de formularios — en curso (2026-09-04 (39)+)

Encargo del cliente: los formularios del sitio (leads de landing, checkout,
admisión, contacto, baja de datos, catálogo, pago directo) se veían y
funcionaban muy por debajo del resto del sitio. Pedido explícito: auditoría
honesta primero (estética + funcionamiento + comparación con el resto del
sitio), plan de rediseño después, aprobación antes de tocar código. **Este
apartado es el tracker de progreso — actualízalo al terminar cada fase.**

**Auditoría entregada (2026-09-04, antes de tocar nada)** — 9 formularios
revisados uno a uno. Hallazgo raíz: `components/ui/input.tsx`,
`textarea.tsx`, `select.tsx`, `checkbox.tsx` — los primitivos que usan los 9
— **nunca se habían tocado en toda la sesión**, mientras el resto del sitio
acumuló 15+ vocabularios visuales propios. Por eso todos "se sentían
pegados de otro proyecto" a la vez: no es que cada formulario estuviera mal
por separado, es que la pieza compartida más pequeña nunca entró en el
sistema de diseño. Hallazgos específicos por formulario (los más graves):
- 🔴 **Contacto** (`/contact-page`, pestaña "Escribir Mensaje") — el
  `<form>` no tenía `onSubmit`. El botón no enviaba nada a ningún sitio.
  Único formulario roto de verdad, no solo pobre.
- 🔴 **`/pago-directo`** — inconsistente visualmente con `/checkout` (dos
  identidades distintas para el mismo tipo de compra) y con el mismo hueco
  de seguridad que ya se cerró en checkout en (26): precio hardcodeado
  (`BASE_PRICE = 15000`) y cupón que confía en el `basePrice` que manda el
  cliente, sin recalcular nada en servidor.
- `/solicitud-baja-page` y el diálogo de catálogo: funcionan bien, pero
  usan HTML crudo (`<select>` nativo, `<input>` sin pasar por el sistema)
  con hex hardcodeado en vez de tokens.
- Checkout, `AdmisionModal`, `InfoRequestModal`, `JobApplicationModal`:
  funcionan correctamente, la brecha es puramente de personalidad visual —
  primitivos genéricos de shadcn sin ningún toque de marca.

**Plan aprobado por el cliente, con checkpoints explícitos:**
1. ✅ Fase 2 — arreglar el contacto (lo único roto de verdad, va primero).
2. ✅ Fase 1 — subir los 4 primitivos compartidos (sube los 9 formularios
   a la vez sin tocar cada uno).
3. ⏳ Fase 3 — retoque puntual por formulario (iconos, `autoComplete`,
   tokens en vez de hex), en el orden ya acordado, **excepto
   `/pago-directo`**, que queda pendiente de una explicación aparte sobre
   qué implica cerrar su hueco de seguridad antes de invertir en su
   estética (pedido explícito del cliente, entregada en el mismo turno que
   esta pieza — ver "Hueco de seguridad de /pago-directo" más abajo).

**`/application`** (el formulario de admisión antiguo) queda fuera de este
rediseño — su destino (unificar con el flujo nuevo o retirarlo) sigue
pendiente de una decisión aparte, ver §1. ✅ **Resuelto en (44): retirada
por completo**, no unificada.

### Fase 2 — Formulario de contacto: de roto a funcional (2026-09-04 (39))

`ContactClientPage` (pestaña "Escribir Mensaje") no tenía `onSubmit` — el
botón "Enviar Mensaje" no hacía nada. Arreglado con el mismo patrón que
`leads`/`candidaturas_empleo`/`solicitudes_admision`: persistir primero en
Supabase, notificar por email después (Resend, en modo mock hasta tener
`RESEND_API_KEY` real — decisión explícita del cliente de seguir "el mismo
patrón que el resto del sitio", leído como el patrón completo —
persistencia + email — no solo el envío de email).

**Esquema nuevo** (`scripts/029_mensajes_contacto.sql`, ejecutado contra el
proyecto real): `mensajes_contacto` — `nombre`/`email`/`mensaje`
obligatorios, `asunto` opcional, `motivo`/`programa` opcionales (contexto de
`?motivo=&programa=` si llegó desde un CTA de página de programa, mismo
espíritu que `origen` en `leads`). RLS activo, sin ninguna policy pública —
mismo patrón que el resto de tablas de datos personales.

**Backend**: `lib/contact-db.ts` (`createMensajeContacto()`, inserta
primero, 2 emails después — aviso a `info@idesie.com` con `replyTo` al
remitente + confirmación al remitente, mismo patrón que
`candidaturas-db.ts`/`admision-db.ts`), `POST /api/contact` (valida
nombre/email/mensaje obligatorios y formato de email **en servidor**).

**🔴 Subida de archivos — eliminada, no desactivada.** El formulario tenía
una UI completa de adjuntar archivos (selector, lista, tamaño formateado)
que no subía a ningún sitio — no existe ningún endpoint que la reciba. El
cliente pidió elegir entre quitarla del todo o dejarla visualmente
desactivada con un aviso de "próximamente", con preferencia explícita por
la simplicidad ("prefiero un formulario simple que funcione, a uno completo
que engañe"). **Decisión: quitarla por completo** — un aviso de
"próximamente" sin fecha ni backend previsto habría añadido ruido visual
por una promesa sin plan real; más simple y honesto no mostrar la opción en
absoluto hasta que exista de verdad. Si se retoma en el futuro, el patrón a
seguir es el mismo que ya usan `/api/empleo/upload-cv`/`/api/admision/upload-cv`
(Vercel Blob, validación de tipo/tamaño en servidor).

`contact-client-page.tsx`: `onSubmit` real con estado de envío
(`Loader2` en el botón), banner de éxito/error (mismo patrón visual que
`solicitud-baja-client.tsx`), campos con `name`/`required`/`autoComplete`
añadidos (antes ninguno los tenía). El resto de la página (pestaña
Calendly, banner de contexto `?motivo=`) no se tocó.

**De paso**, eliminados los `console.log("[v0] ...")` de depuración en
`components/catalog-download-dialog.tsx` (pedido explícito del cliente,
"ya que estás ahí") — se mantuvo el único `console.error` real, que sí es
un manejador de error legítimo.

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0.
`curl` contra `/api/contact`: 3 payloads probados (campos vacíos → 400,
email inválido → 400, envío válido → 200 con inserción real verificada por
`psql` y borrada acto seguido — no queda ningún dato de prueba). HTML
servido de `/contact-page`: cero rastro de la UI de adjuntar archivos, los
4 campos (`name`, `email`, `subject`, `message`) presentes con sus atributos
nuevos. `next.config.mjs` sin tocar, nada desplegado.

### Fase 1 — Primitivos de formulario subidos al nivel del resto del sitio (2026-09-04 (39))

`components/ui/input.tsx`, `textarea.tsx`, `select.tsx` (`SelectTrigger`),
`checkbox.tsx` — los 4 átomos que usan los 9 formularios del sitio, tocados
por primera vez en toda la sesión. Reutiliza exclusivamente tokens y curvas
ya existentes, cero vocabulario nuevo:

| Antes | Ahora |
|---|---|
| `rounded-lg`, `h-9` (Input/Select) | `rounded-xl` (mismo sistema — `--radius-xl` ya definida), `h-11` — más presencia, mejor objetivo táctil |
| `focus-visible:border-ring focus-visible:ring-ring/50` | `focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/20` — `--color-brand` explícito en vez de `--ring` (que en `.dark` es gris neutro, no azul: el foco perdía la marca fuera de modo claro) |
| Sin estado de hover distinto del reposo | `hover:border-brand/40` — ya hay vida antes de hacer foco |
| `transition-[color,box-shadow]` (curva por defecto de Tailwind) | `transition-[...,border-color] duration-200 [transition-timing-function:var(--ease-out-quart)]` — la misma curva que ya usan `.pedido-*`/`.journey-*`, no una nueva |
| Checkbox: `data-[state=checked]:bg-primary`, `size-4` | `data-[state=checked]:bg-brand`, `size-5` — mismo criterio de marca explícita, tamaño más cómodo en móvil |

🔴 **Hallazgo al revisar `--ring` antes de tocar nada**: en modo claro
`--ring` ya valía `rgba(0, 103, 255, 0.5)` — prácticamente el azul de marca
por coincidencia histórica, no por diseño consciente (nadie lo documentó
como intencional). En `.dark` es `oklch(0.439 0 0)`, gris neutro puro — así
que el mismo componente perdía la marca por completo fuera de modo claro.
Usar `--color-brand` de forma explícita (en vez de heredar `--ring`) lo
hace consistente en cualquier contexto de color, no solo por casualidad en
el que ya se probó.

**Blast radius controlado a propósito**: no se tocó `--ring` en `globals.css`
(habría afectado también a botones, diálogos, dropdowns en todo el sitio,
fuera del alcance de "formularios") — el cambio vive solo en los 4 archivos
de primitivos, y solo se manifiesta donde `<Input>`/`<Textarea>`/`<Select>`/
`<Checkbox>` se usan sin una clase que ya gane la cascada.

⚠️ **Efecto colateral verificado y aceptado, no una regresión**: `/admin/*`
usa el mismo `<Input>` con una clase `admin-input` añadida encima. Como
`admin-input` está escrita como CSS plano sin `@layer` (mismo mecanismo ya
documentado en "Submenús del header" — una regla sin layer gana siempre a
una utilidad de Tailwind, que sí vive en una layer), su color/borde/radio
propios **no cambian**: solo la altura (36px→44px, ya que `admin-input`
nunca definía `height`) se hereda del nuevo `h-11`. Efecto menor y
uniforme, no una regresión visual del panel de admin.

**Verificado:** `npx tsc --noEmit` 0 errores, `npx next build` exit 0.
`curl`: `rounded-xl` y `h-11` confirmados en `/contact-page` y
`/solicitud-baja-page` (los dos formularios visibles sin sesión de
navegador ni carrito en `localStorage`) — checkout/modales no se pudieron
verificar por `curl` al depender de estado de cliente (carrito vacío por
defecto, diálogos cerrados por defecto), pero comparten el mismo import, así
que heredan el cambio automáticamente. `next.config.mjs` sin tocar, nada
desplegado.

⚠️ **No verificado en vivo en Chrome** — la extensión de Claude in Chrome ha
seguido desconectada toda la sesión. No se pudo confirmar visualmente el
anillo de foco, el hover, ni la sensación real del tamaño/radio nuevos en
ningún formulario. Pendiente de que el cliente lo revise en su navegador
antes de aprobar la Fase 3 — **checkpoint explícito pedido por el cliente**:
esta fase se entrega para revisión antes de tocar cada formulario
individual.

### ✅ Hueco de seguridad de /pago-directo — CERRADO (2026-09-04 (41))

**Resuelto** — ver el detalle completo de la explicación original justo
debajo, y el fix aplicado en §4, "Fase 1 (crítico) de la auditoría de
seguridad — /pago-directo cerrado".

### 🔒 Hueco de seguridad de /pago-directo — qué implica cerrarlo (explicación, sin código, 2026-09-04 (39))

Pedido explícito del cliente antes de decidir si se aborda: entender el
alcance real de "cerrar el hueco de seguridad" en
`components/direct-payment-form.tsx` antes de invertir tiempo en su
estética. Mismo problema que tenía `/checkout` antes de (26), pero más
grave — `/checkout` al menos usaba productos reales del carrito, aquí no
hay ningún producto real de por medio:

- `BASE_PRICE = 15000` está escrito literalmente en el componente — no lee
  `productos` en ningún momento. La página ni siquiera muestra qué máster
  se está pagando.
- `/api/coupons/validate` recibe `basePrice` **del propio cliente** en el
  cuerpo de la petición y calcula el descuento sobre ese número tal cual —
  cualquiera con las devtools abiertas puede mandar el `basePrice` que
  quiera y el endpoint se lo cree.
- `buildPaymentUrl()` construye la URL de Flywire directamente desde
  `finalPrice` (estado de cliente) — ninguna verificación de servidor
  interviene en ningún punto antes de que el importe llegue a Flywire.
- Los cupones (`COUPONS_FALLBACK`) siguen hardcodeados en el propio archivo
  de la API, no en la tabla real `coupons` — mismo problema que tenía
  `/checkout` antes de (26).

**Qué haría falta para cerrarlo de verdad, mismo patrón que `app/checkout/actions.ts`:**
1. **Decidir qué representa `/pago-directo`** — hoy es ambiguo: ¿un único
   producto fijo (¿cuál, de los 6 reales en `productos`?), o debería aceptar
   un parámetro de producto (`?producto=slug`) y mostrar su nombre/precio
   real en la página? Sin esto no hay nada que verificar en servidor.
2. Una función de recálculo en servidor (equivalente a
   `calculateVerifiedTotal()`) que lea el precio real del producto elegido
   desde `productos`, valide el cupón contra la tabla real `coupons` (no
   `COUPONS_FALLBACK`), y devuelva el importe verificado — nunca confiar en
   ningún número que mande el formulario.
3. Generar la URL de Flywire solo a partir de ese importe ya verificado en
   servidor, mismo criterio que `createOrderAndGetPaymentUrl()`.
4. Decidir si también escribe en `orders`/`order_items` (como ya hace
   checkout desde (26)) para que quede registro del intento de pago, o si
   se queda más ligero a propósito.
5. **Pregunta de fondo, más barata que arreglarlo**: `/checkout` ya cubre
   "pagar un producto" con un carrito de 1 solo artículo — ¿sigue haciendo
   falta `/pago-directo` como flujo aparte, o el hueco de seguridad más
   barato de cerrar es dejar de mantener dos caminos de pago duplicados y
   redirigir a checkout? No es una decisión de diseño visual, es de
   alcance de producto — vale la pena resolverla antes de decidir si se
   invierte en arreglar el `/pago-directo` actual o en retirarlo.

**Nada de esto se ha tocado** — es la explicación pedida, no una
implementación. `/pago-directo` sigue exactamente igual que antes de esta
sesión, estética incluida, a la espera de que el cliente decida cómo
seguir.

### Patrón de página de programa — `components/programa/`
**`/mbim-page` y `/mbbe-page`** están montadas como **7 movimientos** en lugar de
13 secciones apiladas. Los componentes son genéricos: cada página solo aporta su
archivo `*-content.ts` y sus textos.

Migradas: **MBIM · MBBE · EMBIM**.
**Falta migrar: `/mbim-online-page`**, la única que sigue con la estructura
antigua. Migrarla es copiar el patrón de `app/embim-page/page.tsx` y crear su
`*-content.ts` — **no toques los componentes** salvo que aparezca una
particularidad nueva de contenido.

⚠️ Al quedar solo una página sin migrar, **`mbim-online-page` pasa a ser la
única referencia viva de la estructura antigua.** Antes de migrarla, úsala para
auditar qué contenido pudo perderse en las otras tres (ver la lección de más
abajo).

| Movimiento | Componente | Notas |
|---|---|---|
| 1 · Apertura | `journey-hero.tsx` | Titular animado en **CSS puro** (LCP). GSAP solo el parallax |
| 2 · La cifra | `stat-monolith.tsx` | Una cifra manda. Contador GSAP + degradado sobre texto |
| 3 · El recorrido ★ | `module-journey.tsx` | **Escritorio: pin + scroll horizontal.** Móvil: swipe nativo |
| 4 · El día partido ★ | `split-day.tsx` | **«El reloj partido»**: díptico asimétrico 58/42, contraste tonal papel/gris-950 |
| 5 · La prueba | `proof-panel.tsx` | Acreditación real: logo Cualificam + sellos ENQA/EQAR. **Sin foto decorativa** |
| 6 · La salida ★ | `outcomes.tsx` | Contadores + carril de salidas |
| 7a · Vivirlo | `experience-band.tsx` | Los 2 CTA de clase/asesoría |
| 7b-d · Entrar | `AdmisionSection` + `faq-list.tsx` + `closing-cta.tsx` | Un solo cierre. SplitText aquí |

**Sobre el pin del M3** (`module-journey.tsx`), ajustado con el cliente en dos
iteraciones hasta `0.5`:
- `end: +=distancia * 0.5` y `scrub: 0.35`. **No lo subas sin motivo**: por
  encima de ~1 vuelve a sentirse como un atasco. Por debajo de `0.3` los módulos
  pasan tan rápido que el gesto deja de leerse.
- **Pin condicional:** si `distance() <= 120` no se ancla nada y se añade la
  clase `.journey-track-free` (scroll horizontal normal). Es lo que evita que
  los 5 módulos del MBBE fuercen un anclaje absurdo en pantallas anchas.
- **Exento en móvil**: swipe nativo.
- Para revertirlo del todo, se borra el bloque `mm.add("(min-width: 1024px)…")`.

#### 🚨 LECCIÓN: reestructurar puede PERDER contenido real — audítalo siempre

Al migrar MBIM y MBBE a los 7 movimientos **se perdió contenido de acreditación
sin que nadie lo notara**: el logo de Cualificam, el organismo certificador
(Fundación para el Conocimiento Madri+d), el sello de pertenencia a **ENQA/EQAR**
y los tres badges (EEES Compliance / ENQA Member / EQAR Registered). Solo
sobrevivieron los tres puntos de garantía. Lo detectó el cliente, no el proceso.

Se recuperó de la versión antigua de `app/embim-page/page.tsx`, que entonces aún
no se había migrado. **Ya no existe esa copia de seguridad**: el EMBIM también
usa hoy los 7 movimientos. La única referencia viva de la estructura antigua es
ahora **`app/mbim-online-page/mbim-online-client.tsx`**.

**⚠️ PENDIENTE DE AUDITAR — antes de migrar EMBIM o MBIM Online, y como repaso
de las ya migradas:** comparar sección por sección la versión antigua con la
nueva y comprobar que **ningún dato, logo, sello o nota al pie se ha quedado por
el camino**. El riesgo no es solo el M5: cualquier movimiento que condense varias
secciones antiguas puede haber soltado contenido. Concretamente, sigue sin
verificar si se perdió algo en:
- M2 (absorbió la banda de cifras + parte del "about")
- M3 (absorbió "Programa" + "4 motivos")
- M7 (absorbió admisión + compra + FAQ + CTA final)

**Método:** este proyecto **no es un repositorio git**, así que no hay historial.
La comparación hay que hacerla contra `mbim-online-page` (la única sin migrar) o
pidiendo al cliente la versión publicada. **Haz esa auditoría ANTES de migrar
`mbim-online-page`**, o se pierde la última referencia.

#### Logos reales disponibles (NO recrear ni buscar fuera)
| Archivo | Qué es | Dónde se usa |
|---|---|---|
| `public/images/logo_cualificam.png` | Cualificam + Madri+d (uno solo cubre ambos) | M5 de MBIM/MBBE, EMBIM, MBIM Online, home |
| `public/images/euphe-logo.webp` | EUPHE — sección de reconocimientos, **no** es certificación | EMBIM, home |

**No existe un logo separado de Madri+d, ENQA ni EQAR.** ENQA/EQAR se expresan
como texto y sellos, que es como estaban en el original.

**Los logotipos van siempre con `object-contain`.** Un logo recortado es un logo
mal usado, y `object-cover` lo recorta siempre.

#### Por qué el M5 no lleva fotografía
Se usaba `hero-certificacion-iso.jpg` a sangre con `object-cover` en un panel
alto y estrecho: salía irremediablemente recortada y pesaba **1,77 MB** sin
aportar nada. En una sección sobre acreditación, **el logo del certificador ES la
imagen**. No reintroduzcas una foto decorativa aquí sin un motivo mejor.

#### 🎨 El M4 y el ritmo tonal de la página — no lo rompas
La secuencia de fondos está pensada como alternancia, **no es casual**:

```
M3 recorrido      ██ gray-950
M4 día partido    ░░ papel  +  ██ gray-950   ← díptico asimétrico
M5 certificación  ░░ claro
M6 salida         ██ gray-950
```

La primera versión del M4 eran **dos paneles oscuros simétricos**, y falló por
dos motivos que conviene no repetir:
1. Era **simétrico donde la idea es contraste**: dos paneles idénticos decían
   "dos cosas parecidas" mientras el texto decía "dos mundos distintos".
2. Añadía **un segundo muro oscuro pegado al M3**, creando un tramo oscuro
   larguísimo (peor en móvil, donde los paneles se apilan).

**La sorpresa del M4 es cromática, no cinética.** Se descartó a propósito la
alternativa con barrido scrubbed: habría puesto **dos espectáculos de scroll
seguidos** (M3 y M4), y el segundo anula al primero. Si alguna vez añades
movimiento fuerte aquí, quita el del M3 antes.

Detalles del componente: mañana = `bg-paper`, foto **contenida** con aire y
`duotone-warm`; tarde = `gray-950`, foto **a sangre** con `duotone-cool` +
capa `duotone-cool-tint` (`mix-blend-mode: color`, requiere `isolate` en el
panel). Las horas `08:00` / `15:00` son el ancla visual, en `journey-display
journey-mono`; son props opcionales (`Half.hour`) con esos valores por defecto.
**Parallax contenido a ±4 %**: con el velo casi eliminado, un recorrido mayor
delata el recorte de la foto. Las 3 fases son paradas de una línea de tiempo
(`.timeline-rail`) que se dibuja con `scaleY` al scroll.

**Vocabulario visual establecido** (`globals.css`, bloque del recorrido):
`.journey-display` / `.journey-title` / `.journey-eyebrow` (mono) / `.journey-mono`
· `.btn-journey` (relleno por barrido) · `.link-draw` (subrayado que se dibuja)
· `.journey-surface` (esquina sup. dcha. cortada + sombra teñida de azul)
· `.journey-surface-dark` (borde con degradado) · `.journey-spotlight` (foco que
sigue al cursor) · `.faq-panel` (`grid-template-rows: 0fr→1fr`).
Curvas: `--ease-out-expo`, `--ease-out-quart`, `--ease-spring`, `--ease-in-out-quint`.

**Roboto Mono ya estaba cargada y sin usar.** Se emplea como voz técnica en
eyebrows, números de módulo y cifras salariales: da carácter de documentación
AEC. Coste 0.

★ = los tres únicos momentos con dinamismo fuerte. **El contraste es
intencionado: si se anima todo, no destaca nada.** No añadas movimiento a los
movimientos 1, 2, 5 y 7 sin una razón.

**Criterio editorial aplicado:** el contenido vive en `app/<pagina>/*-content.ts`,
separado del layout. **Ninguna cifra está inventada** — todas salen del contenido
previo de la página o de sus FAQ. En ambos másteres, los salarios estaban
enterrados dentro de una respuesta del acordeón, que es el peor sitio para el
argumento más comercial del programa.

#### ⚠️ Cada máster tiene sus propias cifras — NO las copies entre páginas
| | **MBIM** | **MBBE** | **EMBIM** |
|---|---|---|---|
| Duración | 16 meses | 16 meses | **12 meses** |
| Precio | 15.000 € | 15.000 € | **18.000 €** |
| Módulos | 9 | 5 | **10** |
| Fases del carril | Fundamentos / Ejecución / Liderazgo | Técnica / Gestión / Cierre | Fundamentos / Ejecución / Liderazgo |
| Salidas | 4 roles, 28.000–50.000 € | 3 roles, 30.000–70.000 € | **4 roles, 50.000–110.000 € + tarifa/día** |
| Empleabilidad | 95 % a 6 meses (su FAQ) | **100 %** ✅ verificada por el cliente | **NO EXISTE** — ver abajo |
| Prácticas | 100 % garantizadas | 100 % garantizadas | **No hay prácticas** |
| Ingresos mientras estudias | 11.000 € | 11.000 € | **No aplica** |

**🔴 El EMBIM es el que más se aparta. Dos particularidades que NO se pueden
resolver copiando de los otros:**

1. **No tiene Learning by Working ni prácticas.** El alumno es un profesional
   sénior (5+ años exigidos) que conserva su empleo; las clases son viernes de
   15:30 a 20:30 y sábados de 9:00 a 14:00. Por eso su **M4 va reencuadrado**
   como "Entre semana lideras / El fin de semana te formas", y las tres paradas
   de la línea de tiempo son las ventajas del formato (`ventajasFormato` en
   `embim-content.ts`), no fases de inserción laboral.
2. **No hay ninguna cifra de empleabilidad** en su contenido — se buscó
   "empleabilidad", "%" y "prácticas" y no aparece nada. **No inventes una ni
   copies el 95 % del MBIM.** Sus cifras ancla del M6 son el techo salarial
   (110.000 €) y el número de módulos.

**Sobre la tarifa diaria:** el perfil "Consultor BIM Senior" del EMBIM cobra
**500-800 € por día** en régimen freelance, no un salario anual. `Outcomes`
acepta un campo opcional `unidad` justo para etiquetarlo distinto. Mostrarlo bajo
"Bruto anual" junto a los otros sería engañoso.

La especialización MEP del MBBE está mejor pagada que el BIM generalista (70.000 €
frente a 50.000 €), y el EMBIM está por encima de ambos (110.000 €). Cada M6 se
titula en consecuencia.

### Componentes compartidos
`Header` · `FooterSection` · `BreadcrumbNavigation` · `AdmisionSection`
· `CatalogDownloadButton` · `CartDrawer` / `CartIcon` · `LatestBlogPosts`
· `LogoCarousel` · `ScrollToTop`
UI base: `components/ui/*` (shadcn). **Añade variantes ahí, no estilos sueltos.**

`BreadcrumbNavigation` renderiza el **último** elemento como `<span aria-current="page">`,
no como enlace. Correcto — no lo "arregles".

### Criterio de diseño acordado con el cliente
> **"Menos elementos, mejor ejecutados."** Aplicado ya en `/sobre-idesie-page`.
> Preferir aire, jerarquía tipográfica clara y protagonismo de la imagen antes
> que acumular tarjetas, iconos y bloques de texto.

Animación: `lenis` (scroll suave) ya está instalado. `tailwindcss-animate` y
`tw-animate-css` disponibles. Clases propias `animate-fade-in-up` + `delay-*`.

---

## 6. Cómo verificar cambios

```bash
pnpm dev            # http://localhost:3000 — con .env.local real conecta a Supabase de verdad
npx tsc --noEmit    # OJO: 2 errores preexistentes en otros archivos (línea base 2026-09-03 (8)).
                    # Compara antes/después; no intentes dejarlo a cero de golpe.
npx next build      # ✅ Compila con exit code 0 desde que se retiró Neon y se
                    # conectaron credenciales reales de Supabase (2026-09-03)
```

**Scripts de verificación** (todos con el servidor de desarrollo levantado):

```bash
node scripts/measure-header.mjs        # ¿coincide --header-height con la realidad?
node scripts/contrast-nav.mjs          # contraste del menú sobre el cristal (no necesita servidor)
node scripts/perf-nav-glass.mjs        # coste del backdrop-filter, con y sin, CPU x6
node scripts/shot-header.mjs <prefijo> <dir>   # capturas de la franja del header
```

⚠️ `shot-header.mjs` usa `captureBeyondViewport: false` **a propósito**. Con
`clip` y sin esa opción, Chrome pinta los elementos `position: fixed` donde
caerían en el documento y no en la ventana: **el header desaparece de toda
captura con scroll** y parece un fallo del sitio cuando es del script.

⚠️ Los scripts de Puppeteer se escribieron en Windows. Ya resuelven la ruta de
Chrome por plataforma (`process.platform`); si añades otro, copia ese patrón.

**Instalación:** el proyecto usa **pnpm** (`npm i -g pnpm`). En pnpm 11 el campo
`pnpm.onlyBuiltDependencies` de `package.json` **ya no se lee**: la autorización
para compilar `sharp` vive ahora en **`pnpm-workspace.yaml`** (`allowBuilds`).
Sin eso, `pnpm dev` aborta con `ERR_PNPM_IGNORED_BUILDS`.
`next.config.mjs` tiene `typescript.ignoreBuildErrors: true`, así que los errores
de tipos no bloquean el despliegue. Eso **no** significa que puedas ignorarlos en
los archivos que toques.

---

## 7. Registro de cambios

### 2026-09-05 (49) — Decisiones del cliente sobre los 3 hallazgos de (48): vercelignore borrado, rotación de contraseña en curso, fila de orders en espera
Respuesta del cliente a los 3 hallazgos entregados en (48):
- **`vercelignore` borrado por completo** (decisión del cliente: preferir
  simplicidad — Vercel ya ignora lo razonable por defecto — a mantener un
  archivo que casi rompió el catálogo por un problema de nombre). Sin
  ningún importador en el código, confirmado por grep antes de borrar.
- **Rotación de la contraseña de admin expuesta en `BLOG_ADMIN_README.md`
  (borrado en (48))**: en curso por el cliente. Procedimiento entregado
  (sin ejecutarlo yo, ni ver la contraseña nueva en ningún momento): 1)
  generar el hash bcrypt localmente con `node -e "require('bcryptjs').hash('NUEVA_CLAVE', 12).then(console.log)"`
  (mismo coste, 12, que usa `lib/admin-secret.ts`); 2) `UPDATE admin_users
  SET password_hash = '<hash>' WHERE id = 5 AND username = 'admin';` en el
  SQL Editor de Supabase — la única fila real hoy. Deliberadamente **no**
  se usa el login con la clave en texto plano (el mecanismo heredado que
  `verifyAdminSecret()` acepta "una última vez" y reescribe solo) — es
  justo esa vía la que dejó la contraseña anterior expuesta; con este
  procedimiento el valor en texto plano nunca llega a la base de datos ni
  pasa por esta conversación, solo el hash ya calculado.
- **Fila de `orders` (id `1`, `miguel.luengo@idesie.com`, "Master BIM Full
  Time", 15.000 €, `pending`, creada 2026-09-03 20:27:10) — sin borrar a
  propósito.** El cliente va a preguntar a su equipo antes de decidir; no
  es una fila de prueba de ninguna verificación de esta sesión.

**Verificado:** `grep` confirma cero referencias a `vercelignore` en
código tras borrarlo. `next.config.mjs` sin tocar, ningún comando de git
ejecutado — el cliente confirma cuándo hacer `git init`/commit/push él
mismo.

### 2026-09-05 (48) — Toda subida de archivos eliminada del sitio; bug 🔴 del enlace de MBIM corregido; repositorio dejado listo para el primer commit a GitHub
Encargo del cliente en tres partes, cierre de la sesión de pre-despliegue:
(1) eliminar cualquier dependencia de `BLOB_READ_WRITE_TOKEN` del sitio,
con una recomendación por cada uno de los 3 usos antes de tocar código;
(2) arreglar ya el bug 🔴 confirmado del enlace `/producto/master-bim-manager`;
(3) dejar el repositorio completamente listo para el primer `git init` +
commit + push a GitHub — sin secretos, sin archivos de prueba, con
`CLAUDE.md` al día y la lista exacta de variables de entorno para Vercel.

#### 1) Subida de archivos eliminada por completo — las 3 piezas + limpieza

Investigación previa (sin tocar código) entregada primero, con recomendación
por caso, aprobada explícitamente antes de implementar:

- **Bolsa de empleo** (`components/job-application-modal.tsx`): el CV ya
  era opcional (`cv_url` nullable desde su creación) — se quitó el
  `<input type="file">`, el estado `cv`, `handleFileChange` y la llamada a
  `/api/empleo/upload-cv` del modal. El resto del formulario (nombre,
  email, teléfono, mensaje) sigue exactamente igual. `cvUrl` se queda como
  campo opcional inerte en el esquema/Server Action — nunca poblado hoy,
  sin romper nada de lo que ya lee la columna (`candidaturas-table.tsx` ya
  sabía mostrar "Sin CV").
- **Blog** (`components/blog-post-form.tsx`): ya existían **dos vías**
  simultáneas para la imagen destacada — el botón "Subir Imagen" y, con un
  separador "o pega una URL", un campo de texto atado al mismo estado
  (`featured_image_url`, columna `text` nullable de siempre). Se quitó
  solo el botón de subida, `handleImageUpload` y el estado `uploadingImage`
  — el campo de URL, ya construido, es ahora la única vía. Cero pérdida
  funcional.
- **Tienda** (`components/producto-form.tsx`): aquí no existía la
  alternativa de URL, solo el `<input type="file">`. Se sustituyó por un
  `FormField` de texto (mismo patrón `react-hook-form` que ya usan todos
  los demás campos del formulario) atado a `imagen` — el campo subyacente
  ya era `z.string().optional()` / columna `text`, ningún cambio de
  esquema. Se quitó `handleImageUpload` y el estado `uploadingImage`.
- **Rutas eliminadas por completo**: `app/api/empleo/upload-cv/route.ts`,
  `app/api/admision/upload-cv/route.ts` (este último ya era código muerto
  desde (40) — cero consumidores, confirmado por grep antes de borrar),
  `app/api/blog/upload-image/route.ts`, `app/api/productos/upload-image/route.ts`.
- **Limpieza que arrastraba**: `lib/blob.ts` y `lib/validate-cv-upload.ts`
  borrados (confirmado por grep exhaustivo: cero importadores de ninguno de
  los dos tras quitar las 4 rutas). `@vercel/blob` y `file-type` eliminados
  de `package.json` vía `pnpm remove` (mantiene `pnpm-lock.yaml`
  sincronizado, no una edición manual). `BLOB_READ_WRITE_TOKEN` retirado de
  `lib/mock-mode.ts` (`SERVICES`), `env.example` y `env.local` — mismo
  patrón que la retirada de `BREVO_API_KEY` en (46). La línea
  `BLOB_READ_WRITE_TOKEN=` (vacía) se deja tal cual en `.env.local` (datos
  reales, gitignored) — ya inerte, no se edita un archivo de credenciales
  sin necesidad.
- **Verificado de extremo a extremo**: `rm -rf .next/types && npx tsc --noEmit`
  0 errores, `rm -rf .next && npx next build` exit 0 (las 4 rutas de
  subida confirmadas ausentes del listado de rutas generadas). Servidor
  reiniciado en limpio — el banner de modo mock al arrancar ya **solo**
  menciona Resend (Vercel Blob ha desaparecido de la lista). Grep final
  confirma **cero** referencias a `BLOB_READ_WRITE_TOKEN`/`@vercel/blob` en
  código (`.ts`/`.tsx`), salvo la línea inerte de `.env.local`. Candidatura
  real probada de extremo a extremo contra el proyecto real de Supabase:
  `POST /api/empleo/candidatura` sin campo de CV → 200, fila real insertada
  con `cv_url` en blanco, confirmada por `psql` y borrada tras verificar.
  Los patrones de guardado de `imagen`/`featured_image_url` en las Server
  Actions de tienda/blog (`app/tienda/actions.ts`,
  `app/blog/actions.ts`) se confirmaron sin cambios — siempre leyeron el
  campo como texto plano desde `FormData`, nunca dependieron de que la
  URL viniera de una subida — así que el nuevo campo de texto en tienda
  usa exactamente el mismo camino ya probado que la URL de blog. ⚠️ No se
  pudo hacer clic real en los dos formularios de admin (Chrome
  desconectado toda la sesión) — verificación por trazado de código
  exacto del mismo contrato de datos, no por interacción en vivo.

#### 2) Bug 🔴 corregido: enlace roto en /mbim-page

`app/mbim-page/page.tsx` — el enlace "Ver precios y matrícula en la tienda
online" apuntaba a `/producto/master-bim-manager`, un slug que nunca
existió (404 real, confirmado en la auditoría pre-despliegue de la sesión
anterior). Corregido a `/producto/master-bim-full-time`, el mismo slug
real que ya usa `compraLink` en la misma página. Verificado con
`tsc`/`build`.

#### 3) Repositorio dejado listo para el primer commit — 3 hallazgos reales, no esperados

Auditando el proyecto para confirmar que estaba listo para subir a GitHub
(pedido explícito del cliente: confirmar `.gitignore`, `env.example`, cero
archivos/datos de prueba), aparecieron **tres problemas reales que nadie
había detectado hasta ahora**, ninguno relacionado con el encargo de hoy:

🔴 **`.gitignore` no existía — el archivo real se llamaba `gitignore.txt`.**
Git **solo** respeta un archivo llamado exactamente `.gitignore` (o
`.git/info/exclude`) — con el nombre sin el punto inicial, todas las
reglas que llevaba (incluida `.env*.local`, la que protege las
credenciales reales) **nunca se aplicaron**. De haber hecho `git init &&
git add .` tal como estaba, `.env.local` con las claves reales de
Supabase se habría subido a GitHub. **Renombrado a `.gitignore`** — el
proyecto seguía sin ser un repositorio git en ningún momento de la sesión
(confirmado con `git status` antes de tocar nada), así que no había ningún
historial que arreglar, el renombrado es limpio. No se ejecutó `git init`
ni ningún otro comando de git — eso lo hace el cliente, tal como pidió.

🔴 **`BLOG_ADMIN_README.md` (raíz del proyecto) contenía una contraseña de
admin real en texto plano**, dentro de un documento de una versión muy
anterior del sistema de autenticación (`BLOG_EDIT_SECRET_KEY`, un
mecanismo por variable de entorno que ya no existe en el código —
confirmado por grep, cero referencias hoy). Como la migración a bcrypt de
(4) acepta "una última vez" el valor en texto plano de una fila heredada y
lo sustituye por su hash en el mismo momento, existe la posibilidad real
de que esa contraseña **siga siendo la clave viva** de `admin_users` hoy —
el mecanismo cambió, el valor pudo sobrevivir. Archivo **borrado por
completo** (documentación obsolete y además incorrecta sobre cómo funciona
hoy la autenticación). **Recomendación entregada al cliente, no ejecutada
por mí**: rotar la contraseña del admin real en Supabase si existe alguna
posibilidad de que sea la misma, ya que ha quedado expuesta en este
archivo (y ahora también en el historial de esta conversación).

⚠️ **`vercelignore` (raíz, sin el punto inicial) — hallazgo real, dejado
sin tocar a propósito.** Mismo problema de nombre que `.gitignore` tenía,
pero aquí **NO se corrige**: su contenido incluye la línea
`app/api/send-catalog` junto al comentario "Ignora archivos que causaron
problemas en el pasado" — si se renombrara a `.vercelignore` tal cual
está, Vercel **excluiría la ruta `/api/send-catalog` del despliegue por
completo**, rompiendo la descarga de catálogo en producción (justo la
pieza que se acaba de arreglar en (46)/(47)). A diferencia del caso de
`.gitignore` (una corrección inequívoca), aquí "arreglar el nombre" habría
introducido un bug nuevo, así que se deja el archivo como está —
inactivo, sin efecto real hoy — y se informa al cliente para que decida:
borrar la línea de `send-catalog` y renombrar a `.vercelignore` de verdad,
o borrar el archivo entero (Vercel ya excluye por defecto lo razonable —
`.next/cache`, `node_modules`, etc. — sin necesidad de este archivo).

**Limpieza adicional, sin relación con lo anterior:**
- `puente-a67-1.jpg` (raíz) — duplicado huérfano; el archivo real y
  correctamente referenciado ya vive en
  `public/images/projects/puente-a67-1.jpg` (confirmado por grep del
  componente que lo usa, `components/bim-consulting/projects-carousel.tsx`).
  Borrado.
- `node_modules-20260902T140806Z-1-001.zip` (raíz, 92 MB) — backup del
  incidente de `node_modules` corrupto documentado en §6 del 2026-09-02,
  ya resuelto (node_modules reinstalado y funcionando desde entonces). No
  se borró directamente (es un archivo grande que ya existía antes de esta
  sesión, no algo creado en ninguna verificación) — se añadió a
  `.gitignore` para que sea imposible que se suba por accidente, y se
  recomienda al cliente borrarlo manualmente si ya no lo necesita.
- `.gitignore` ganó además `*.tsbuildinfo` (caché incremental de
  TypeScript, se regenera solo, nunca debe subirse — no estaba cubierto
  antes).
- `env.example`: corregida una referencia obsoleta a `gitignore.txt` (ya
  no existe con ese nombre).

🟡 **Hallazgo sin resolver, entregado al cliente para que decida — no es un
archivo, es un dato**: la tabla `orders` tiene **1 fila real**
(`miguel.luengo@idesie.com`, "Master BIM Full Time", 15.000 €, estado
`pending`, creada 2026-09-03 20:27) que **no es una fila de prueba de
ninguna verificación de esta sesión** — ningún email usado en ningún test
de esta sesión coincide con ese. No se borró: podría ser una prueba real
del propio cliente o de alguien de su equipo probando el checkout nuevo de
(26). Queda a la espera de que el cliente confirme si se borra o se deja.

**Verificado en conjunto (código + repositorio)**: `rm -rf .next/types &&
npx tsc --noEmit` 0 errores, `rm -rf .next && npx next build` exit 0 (51
rutas, sin las 4 de subida ni `/api/coupons/validate`, ya eliminada en
(41)). Barrido exhaustivo por `psql` de las 12 tablas tocadas en toda la
sesión (`leads`, `productos`, `blog_posts`, `admin_users`,
`candidaturas_empleo`, `solicitudes_admision`, `mensajes_contacto`,
`admin_sessions`, `descargas_catalogo`, `ofertas_empleo`, `coupons`,
`orders`) buscando patrones `test`/`prueba`/`temp`/`e2e` — **limpio en las
11 primeras**, con el único hallazgo real en `orders` ya reportado arriba.
`next.config.mjs` sin tocar (mismo timestamp de toda la sesión), nada
desplegado — el cliente confirma y hace el `git init`/commit/push y la
configuración de Vercel él mismo.

**Variables de entorno finales para Vercel** (nombre exacto, sin valores —
las pondrá el cliente directamente en Vercel):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_BASE_URL   (opcional — si falta, usa https://idesie.com por defecto)
```
`BLOB_READ_WRITE_TOKEN` ya no aparece en esta lista — eliminado por
completo en esta misma pieza. `BREVO_API_KEY` tampoco — eliminado en (46).

### 2026-09-05 (47) — Persistencia real de las descargas de catálogo: tabla `descargas_catalogo`, /api/send-catalog guarda antes de enviar
- Encargo del cliente, cierre explícito de un pendiente antes de desplegar:
  la pregunta (3) de (46) ("¿se persiste el teléfono?") se dejó sin
  implementar a propósito, a la espera de esta decisión. Ahora sí: tabla
  nueva `descargas_catalogo` (`scripts/032`), mismo patrón RLS que
  `leads`/`candidaturas_empleo`/`solicitudes_admision`/`mensajes_contacto`
  — RLS activo, **sin ninguna policy pública**, acceso exclusivo
  `service_role`. Ejecutado y verificado contra el proyecto real de
  Supabase (no solo en local): `relrowsecurity = true`, 0 filas en
  `pg_policies` para la tabla, confirmado por consulta directa antes de dar
  la pieza por cerrada.
- Columnas: `nombre`/`email`/`telefono` (obligatorios), `catalogo_id`
  (el identificador interno que ya usa el frontend —
  `mbim-fulltime`/`mbim-building-engineering`/`mbim-online`/
  `executive-master-bim`), `catalogo_nombre`, `programa` (`CHECK` cerrado a
  `MBIM`/`MBBE`/`EMBIM`/`Online`, mismo criterio que `programa_solicitado`/
  `origen` de `solicitudes_admision` — un conjunto conocido de valores se
  protege con `CHECK`, no se deja como texto libre), `rgpd_aceptado`,
  `created_at`. Nuevo `programaMapping` en
  `app/api/send-catalog/route.ts` traduce el `catalogId` real a esa
  etiqueta homogénea, para poder filtrar por programa después — mismo
  propósito que "origen" en las otras tablas.
- **`lib/catalogo-db.ts`** (nuevo) — `createDescargaCatalogo()`, mismo
  patrón exacto que `lib/contact-db.ts`: inserta en Supabase primero
  (bloqueante — si falla, se propaga como error real al usuario, es el
  único registro de que alguien lo pidió) y **solo entonces** intenta el
  email con el PDF adjunto, en un `try/catch` que registra pero nunca
  relanza (best-effort, mismo criterio que
  leads/contacto/candidaturas/admisión). Esto **revierte deliberadamente**
  la decisión tomada en (46) de propagar el fallo de email como error —
  aquella decisión tenía sentido cuando el email era la única entrega real;
  con persistencia de por medio, ya no lo es, y el cliente pidió
  explícitamente alinear el criterio con el resto del sitio.
  `app/api/send-catalog/route.ts` se simplifica: ya no construye la
  plantilla HTML ni llama a Resend directamente, delega todo en
  `createDescargaCatalogo()` (que recibe el `pdfBuffer`/`pdfFileName` ya
  leídos del disco, sin duplicar esa lectura).
- **Verificado de extremo a extremo contra el proyecto real de Supabase**
  (no en mock — `SUPABASE_SERVICE_ROLE_KEY` está puesta en `.env.local`,
  solo `RESEND_API_KEY` sigue en mock): `POST /api/send-catalog` con un
  payload real → fila real insertada, confirmada por `psql` con los 8
  campos exactos (`nombre`, `email`, `telefono`, `catalogo_id`,
  `catalogo_nombre`, `programa="MBIM"`, `rgpd_aceptado=true`, `id` UUID
  real) y `[MOCK] Resend — email no enviado → ...` en el log del
  servidor (best-effort confirmado: la fila ya estaba guardada antes de
  ese intento). Un segundo envío con `catalogId="mbim-building-engineering"`
  confirma `programa="MBBE"` — el mapeo funciona para más de un programa,
  no solo el probado por defecto. RGPD sin aceptar y `catalogId`
  inexistente confirmados **sin insertar ninguna fila** (la validación zod
  y el `404` de catálogo corren antes de tocar Supabase). Las 2 filas de
  prueba borradas al terminar — `select count(*)` confirma la tabla vacía
  de nuevo.
- `rm -rf .next/types && npx tsc --noEmit` 0 errores, `npx next build`
  exit 0 con `/api/send-catalog` listada. `next.config.mjs` sin tocar,
  nada desplegado.
- **Con esto se cierra el último pendiente identificado en (46)** antes del
  despliegue — ver el checklist final de pre-despliegue entregado en el
  mismo turno.

### 2026-09-05 (46) — Brevo eliminado por completo; /api/send-catalog migrado a Resend; teléfono + RGPD obligatorios en la descarga de catálogo
- Encargo del cliente: "Quiero eliminar Brevo por completo y unificar el
  envío de catálogos (/api/send-catalog) para que use Resend, igual que el
  resto del sitio (leads, contacto, candidaturas, admisión)". Además,
  añadir el campo de teléfono como obligatorio (junto a nombre y email) al
  formulario de descarga de catálogo, y el checkbox de consentimiento RGPD.
- **3 preguntas respondidas con evidencia, antes de tocar código** (pedido
  explícito): (1) grep exhaustivo confirmó que `lib/brevo.ts` y
  `app/api/send-catalog/route.ts` eran los únicos consumidores reales de
  Brevo en todo el proyecto — el resto de menciones de "Brevo" en el repo
  son comentarios históricos sobre el ya eliminado `/api/send-job-inquiry`;
  (2) Resend (`resend@6.2.2`) soporta adjuntos de forma nativa
  (`attachments: [{content, filename}]`, confirmado leyendo el `.d.ts` del
  paquete), con un límite documentado de 40MB tras codificar en base64 —
  el catálogo real más pesado (MBBE, ~17,9MB en bruto) computa a ~22,7MB
  codificado, dentro del límite con margen; (3) recomendado NO persistir el
  teléfono en Supabase todavía — la tabla `leads` tiene `session_date`/
  `session_time` como `not null`, específicos del flujo de reserva de cita,
  así que no es reutilizable sin inventar datos o una migración nueva.
  **No implementado** — decisión del cliente pendiente, ver más abajo.
- `app/api/send-catalog/route.ts` reescrito: `brevoFetch()` sustituido por
  `getResend()` (mismo patrón que `leads-db.ts`/`contact-db.ts`/
  `candidaturas-db.ts`/`admision-db.ts`), el bloque de "alta de contacto en
  la lista de Brevo" eliminado sin sustituto (no pedido). Esquema zod
  ampliado con `telefono` (regex ya establecida en el sitio,
  `/^[+\d][\d\s]{7,}$/`, la misma de `/api/leads`) y `rgpdAceptado`
  (`z.preprocess` + `.refine()`, mismo patrón que `/api/admision` desde
  que se descubrió en (43) que `z.literal(true, {message})` no aplica el
  mensaje personalizado en esta versión de zod). `name`/`catalogName` se
  escapan con `escapeHtml()` (mismo helper de (42)) antes de interpolarse
  en la plantilla HTML del email — el flujo de catálogo nunca lo tuvo.
  A diferencia de los otros 4 flujos con Resend, el envío **no** se traga
  en un try/catch silencioso: no hay ninguna persistencia en Supabase
  detrás que ya haya "salvado" el dato, el email con el PDF adjunto es la
  única entrega real, así que un fallo se sigue propagando como error al
  usuario — mismo comportamiento que ya tenía la versión con Brevo.
- `components/catalog-download-dialog.tsx`: añadido el campo `telefono`
  (`type="tel"`, obligatorio, mismo estilo de `<input>` plano que ya tenía
  el diálogo — no se subió a un `<Input>` de shadcn, fuera de alcance) y
  un checkbox de RGPD con enlace a `/politica-privacidad-page` real
  (`target="_blank"`), validado en cliente antes de disparar el `fetch`
  (bloquea el envío con un mensaje si no está marcado, redundante con la
  validación real del servidor — nunca la sustituye).
- Limpieza, parte explícita de "eliminar Brevo por completo":
  `BREVO_API_KEY` retirado de `SERVICES` en `lib/mock-mode.ts` (ya no
  aparece en el banner de modo mock al arrancar, confirmado); bloque de
  Brevo retirado de `env.example` y de `env.local` (plantillas, sin
  valores); `lib/brevo.ts` **borrado** — confirmado por grep que no
  quedaba ningún importador antes de borrarlo. `.env.local` (con datos
  reales, gitignored) conserva su línea de `BREVO_API_KEY` sin tocar — ya
  inerte (ningún código la lee), no se edita un archivo de credenciales
  reales sin necesidad.
- **Verificado**: `rm -rf .next/types && npx tsc --noEmit` 0 errores,
  `npx next build` exit 0 con `/api/send-catalog` listada. Servidor
  reiniciado en limpio (`pkill` + `rm -rf .next` + `pnpm dev`) — el banner
  de modo mock al arrancar ya no menciona Brevo, solo Resend y Vercel
  Blob. `curl` contra el endpoint real: teléfono ausente/con formato
  inválido → 400 "Teléfono no válido"; RGPD sin aceptar → 400 "Debes
  aceptar la política de privacidad para continuar"; envío válido → 200,
  con `[MOCK] Resend — email no enviado → test@example.com` en el log del
  servidor (RESEND_API_KEY sigue sin clave real, en modo mock a
  propósito). Grep final confirma cero referencias vivas a Brevo — solo
  comentarios históricos ya documentados en `app/api/empleo/candidatura/route.ts`
  y `lib/candidaturas-db.ts`. `next.config.mjs` sin tocar, nada
  desplegado.
- **Deferido, explícito, a la espera de decisión del cliente**: persistir
  el teléfono (y el resto de la solicitud de descarga de catálogo) en
  Supabase — no implementado, ver la pregunta (3) de arriba. Si se
  aprueba, el patrón sería una tabla nueva (p. ej. `descargas_catalogo`),
  no reutilizar `leads` por sus columnas de sesión obligatorias.
  ✅ **Resuelto en (47)**: tabla `descargas_catalogo` creada exactamente así,
  persistencia añadida antes del envío. Ver §7 "(47)".

### 2026-09-04 (45) — Bug real corregido: el scroll interno de AdmisionModal no se activaba en desktop (Lenis interceptaba la rueda)
- Encargo del cliente: diagnosticar y arreglar el scroll dentro de
  `AdmisionModal` (el formulario de admisión rediseñado en (40)) — pedido
  explícito de diagnóstico primero, con el motivo exacto, antes de tocar
  nada, y de probarlo en desktop y móvil por separado.
- **Diagnóstico, confirmado leyendo el código fuente real de `lenis`
  (v1.3.26) instalado en `node_modules`, no por suposición**: la Lenis
  global (`SiteMotionProvider`, modo `root`, sin `prevent` ni
  `allowNestedScroll`, ver §5 "Sistema global de cursor + scroll suave")
  intercepta **todos** los eventos de rueda del documento — incluidos los
  que ocurren dentro del `overflow-y-auto` del propio `AdmisionModal` — y
  les llama `preventDefault()` para animar su propio scroll virtual del
  documento completo (`lenis.mjs`, rama `smoothWheel && isWheel`, sin
  excepción para contenedores anidados salvo que lleven
  `data-lenis-prevent`, atributo que no se usaba en ningún sitio del
  proyecto — confirmado por grep). Como Radix Dialog bloquea el scroll del
  `<body>` mientras el modal está abierto, ese scroll virtual del documento
  no tiene ningún efecto visible: la rueda del ratón sobre el modal no
  hacía nada, y el contenido que no cabía en `max-h-[90vh]` quedaba
  inaccesible — el primero de los cuatro síntomas que planteó el cliente
  ("el scroll interno no se activa y el modal se corta").
- **Diagnóstico de móvil, también confirmado por código, no supuesto**: la
  Lenis del sitio nunca configura `syncTouch` (queda en su valor por
  defecto, `false`), y el propio código de `lenis.mjs` hace que, con
  `syncTouch: false`, cualquier evento táctil ceda el control al scroll
  nativo del navegador (`isScrolling = "native"`) sin llamar a
  `preventDefault()` — el bug es específico de escritorio (rueda de ratón),
  el scroll táctil del modal en móvil no debería estar afectado por Lenis.
- **Arreglo**: `data-lenis-prevent` añadido al `DialogContent` de
  `components/admision-modal.tsx` — el propio contenedor con
  `overflow-y-auto`. Es el escape hatch que la propia librería Lenis expone
  para esto (confirmado leyendo `lenis.mjs`: el `composedPath` de
  intercepción excluye cualquier nodo con este atributo), no usado hasta
  ahora en ningún sitio del proyecto — el primer caso real de un
  contenedor con scroll propio dentro de la zona que cubre la Lenis global
  (ver "Sistema global de cursor + scroll suave" más abajo). Con el
  atributo, Lenis deja ese nodo fuera de su intercepción y el scroll nativo
  del navegador se encarga del `overflow-y-auto` del modal con normalidad.
- ⚠️ **No verificado interactivamente en un navegador real** (clic para
  abrir el modal, rellenar campos, confirmar visualmente que la rueda
  desplaza el contenido) — la extensión de Claude in Chrome ha seguido
  desconectada toda la sesión, misma limitación que el resto de piezas
  interactivas de hoy. El diagnóstico y el arreglo se basan en la lectura
  directa del código fuente de la librería instalada (no en documentación
  genérica ni en suposición) y en cómo Radix Dialog gestiona el bloqueo de
  scroll — no en una prueba en vivo. Pendiente de que el cliente lo abra
  en `localhost:3000` y confirme que la rueda del ratón ya desplaza el
  contenido del formulario con normalidad, en desktop y en móvil.
- `rm -rf .next/types && npx tsc --noEmit`: 0 errores. `rm -rf .next/types
  && npx next build`: exit 0, mismas rutas que antes (el cambio es un solo
  atributo HTML, sin efecto en el build). `next.config.mjs` sin tocar
  (mismo timestamp), servidor de desarrollo confirmado vivo, nada
  desplegado.

### 2026-09-04 (44) — /application retirada por completo (código + tabla); pendiente el diagnóstico del scroll de AdmisionModal
- Encargo del cliente: `/application` ya no se va a unificar con el flujo
  nuevo de admisión (`AdmisionModal` → `/api/admision` →
  `solicitudes_admision`, ver (38)) — se retira directamente, decisión
  definitiva. Pedido explícito: confirmar antes de borrar si tiene algún
  enlace entrante que quedaría roto.
- Único enlace entrante encontrado: el botón "formulario de admision"
  dentro del acordeón "Documentación requerida" de `AdmisionSection`
  (`components/admision-section.tsx`), usado por MBIM/MBBE/EMBIM/Online —
  antes apuntaba a `/application` con un `<Link>`. Reapuntado para abrir el
  mismo `AdmisionModal` que ya usa el botón prominente de la propia
  sección, en vez de dejar un enlace roto. Comentario de cabecera del
  archivo actualizado explicando el cambio.
- Eliminados por completo: `app/application/` (`page.tsx` +
  `thank-you/page.tsx`), `app/api/application/` (`route.ts`),
  `lib/applications-db.ts`. Tabla `applications` (`scripts/015`) borrada de
  Supabase vía `scripts/031_drop_applications_table.sql`, confirmada vacía
  (0 filas) antes de ejecutar el `DROP` — `scripts/015` se deja intacto
  como registro histórico, mismo criterio que el resto de migraciones del
  proyecto.
- CLAUDE.md actualizado en los 4 sitios que aún describían `/application`
  como vigente: mapa de sitio (§1), rutas API (§1), la entrada de (38) que
  la dejaba "en paralelo, deuda pendiente", y la entrada del rediseño de
  formularios que la dejaba explícitamente "fuera de alcance" — las
  entradas antiguas se conservan tal cual se escribieron (son historial),
  con una nota de resolución añadida encima.
- **Verificado:** `rm -rf .next/types && npx tsc --noEmit` 0 errores,
  `rm -rf .next/types && npx next build` exit 0 (`/application` y
  `/api/application` ausentes del listado de rutas). `curl`: `/application`
  → 404, `/application/thank-you` → 404, `POST /api/application` → 404,
  `curl http://localhost:3000/mbim-page | grep -o 'href="/application"'`
  → 0 coincidencias. `next.config.mjs` sin tocar, nada desplegado.
- Segunda parte del encargo (bug de scroll en `AdmisionModal`): diagnóstico
  en curso, se documentará en una entrada aparte una vez completado.

### 2026-09-04 (40) — AdmisionModal reescrito de cero (sin CV); auditoría de seguridad del backend lanzada en paralelo
- Encargo doble, tratado por separado: (1) rediseño completo del
  formulario de admisión, sin campo de CV; (2) auditoría de seguridad del
  backend completo, solo informe, sin tocar código — cubierta en una
  entrada aparte cuando el informe esté listo.
- `components/admision-modal.tsx` reescrito de cero (no un retoque):
  icono por campo (mismo patrón que `PedidoCoupon`), insignias circulares
  con entrada `--ease-spring` explícita, eyebrows mono estilo
  `pedido-eyebrow`, checkbox de RGPD en tarjeta propia, botón de envío con
  `.btn-sweep`, `autoComplete` en cada campo con token HTML estándar,
  `autoFocus` en "Nombre completo" vía `onOpenAutoFocus` de Radix Dialog
  (no un `autoFocus` plano, que el propio manejo de foco de Radix podría
  pisar). Detalle completo en §3 "AdmisionModal — reescrito de cero, sin
  CV".
- CV quitado del formulario y de la validación (`POST /api/admision`,
  `lib/admision-db.ts`). **Sin migración de esquema** — `cv_url` ya era
  nullable desde (38). Columna y endpoint de subida (`/api/admision/upload-cv`)
  se conservan sin usar, por si se reactiva.
- Verificados los 4 puntos pedidos explícitamente: persistencia en
  Supabase (solicitud de prueba real insertada y borrada), programa
  preseleccionado por página (cableado externo sin cambios, confirmado con
  `curl` en las 5 páginas), validación en servidor real (5 payloads
  probados, incluido uno sin CV que ahora sí se acepta), RGPD sigue
  bloqueando el envío si no se marca.
- `npx tsc --noEmit` 0 errores, `npx next build` exit 0. `next.config.mjs`
  sin tocar, nada desplegado. ⚠️ No verificado en vivo en Chrome (extensión
  desconectada toda la sesión) — pendiente de revisión visual del cliente
  antes de cerrar esta pieza, tal como pidió explícitamente.
- Auditoría de seguridad (2) lanzada en paralelo como investigación pura,
  sin cambios de código — informe entregado, ver la entrada siguiente.

### 2026-09-04 (43) — Hallazgo colateral (XSS en ficha de producto) cerrado; Fase 3 (bajo) de la auditoría de seguridad cerrada — las 3 fases completas
- Al aprobar la Fase 2, el cliente pidió cerrar ya el hallazgo colateral
  anotado (no dejarlo pendiente) y abordar los 4 puntos de la Fase 3 juntos
  (console.log con PII, CSRF, validación de esquema zod) en vez de dejar
  CSRF/zod como mejora futura, dado el coste bajo de hacerlo ahora.
- **Hallazgo colateral cerrado**: `ficha-content.tsx` (descripción de
  producto en `/producto/[slug]`) reutiliza `sanitizeHtml()` (mismo
  DOMPurify de (42), mismo editor que el blog). Probado con los mismos
  payloads exactos usados para el blog, contra un producto real
  (`master-bim-full-time`) — campo temporalmente puesto a un payload
  malicioso, confirmado neutralizado por `curl`, **restaurado a `NULL`**
  (su valor original) inmediatamente después.
- **1. `console.log` con PII eliminados**: no solo las 2 líneas señaladas
  por la auditoría — se limpió toda la traza `[v0]` de depuración de
  `app/api/send-catalog/route.ts` (15+ líneas, varias exponían PII de
  forma indirecta) y las líneas equivalentes de `app/api/application/route.ts`.
  ⚠️ Hallazgo colateral anotado sin corregir: los emails de
  `/api/application` también interpolan HTML sin escapar (mismo problema
  que se cerró en (42) para los 4 flujos nuevos) — no se tocó, sigue
  vigente la instrucción de no tocar `/application` salvo lo pedido.
- **2. CSRF**: `lib/verify-origin.ts` nuevo, aplicado solo a
  `/api/admin/auth` (login/logout) — el único Route Handler plano que
  crea/destruye una sesión autenticada; las Server Actions ya llevan la
  protección de Next.js de fábrica, y los endpoints públicos no tienen
  ninguna sesión que forjar. Probado con un admin temporal: origen ajeno
  o ausente → 403 antes de tocar credenciales; flujo completo real
  (login → dashboard → intento de logout forjado sin Origin, rechazado,
  sesión sigue viva → logout real con Origin correcto, sesión revocada).
- **3. Validación de esquema (zod)**: `lib/api-validation.ts` nuevo
  (`parseJsonBody()`), aplicado a los 6 endpoints públicos con cuerpo JSON
  (`leads`, `contact`, `admision`, `empleo/candidatura`, `send-catalog`,
  `admin/auth` login) — `/api/application` excluido a propósito. 🔴
  Hallazgo real descubierto probando el propio cambio: un campo ausente
  del JSON caía en el "Required" genérico de zod en vez del mensaje
  personalizado — corregido con `stringInput()`, helper nuevo que
  normaliza ausente/vacío al mismo mensaje. Valor demostrado, no solo
  argumentado: `phone` como número JSON, que la validación manual antigua
  habría coaccionado en silencio a string, ahora se rechaza explícitamente.
- Los 6 endpoints probados con 3 casos cada uno (válido, campo ausente,
  tipo/formato incorrecto) — mensajes de error idénticos a los que ya
  mostraba cada formulario antes del cambio.
- `rm -rf .next/types && npx tsc --noEmit` 0 errores (tras resolver un
  problema real de inferencia genérica de TypeScript con zod, documentado
  en §4), `npx next build` exit 0. `next.config.mjs` sin tocar, nada
  desplegado, ningún archivo de prueba quedó en el repositorio. Detalle
  completo de las 4 piezas en §4.
- **Con esto se cierran las 3 fases completas de la auditoría de
  seguridad de (40b)**. Siguiente encargo: retomar el rediseño del
  formulario de admisión, pausado desde la Fase 1.

### 2026-09-04 (42) — Fase 2 (medio) cerrada: sesión de admin real, DOMPurify, HTML de emails escapado, CV validado por contenido
- Los 4 hallazgos MEDIO de la auditoría de (40b), en el orden aprobado por
  el cliente, cada uno probado de verdad antes de pasar al siguiente.
  Detalle completo de los 4 en §4 "Fase 2 (medio) de la auditoría de
  seguridad".
- **1. Cookie de sesión de admin**: de un string fijo `"authenticated"` a
  un token firmado (HMAC-SHA256 vía Web Crypto API, Edge-compatible sin
  forzar runtime `nodejs`) que apunta a una fila real en la tabla nueva
  `admin_sessions` (`scripts/030`) — expira sola, y se puede revocar una
  sesión concreta sin afectar a otras del mismo admin.
  `middleware.ts`/`lib/admin-auth.ts` comparten un único verificador
  (`lib/admin-session.ts`), nunca reimplementado dos veces. Probado con 2
  sesiones simultáneas del mismo admin: cerrar una deja la otra
  funcionando con normalidad — la prueba central del requisito.
- **2. Sanitización del blog**: `lib/sanitize-html.tsx` reescrito sobre
  `isomorphic-dompurify` (nueva dependencia), con allowlist explícita y
  un hook que añade `rel="noopener noreferrer"` a `target="_blank"`. Los
  bypasses exactos de la auditoría (`<svg/onload=...>` sin espacio,
  `href="javascript:..."`) confirmados bloqueados con un script de
  prueba; contenido legítimo sobrevive intacto. `sanitizeContent()`
  duplicado en `app/api/blog/latest/route.ts` sustituido por la nueva
  `sanitizeToPlainText()` — ya no hay dos sanitizadores distintos con sus
  propias lagunas cada uno.
- **3. Emails transaccionales**: `lib/escape-html.ts` nuevo
  (`escapeHtml()`), aplicado a todos los campos de usuario en los 4
  flujos (`leads-db.ts`, `candidaturas-db.ts`, `admision-db.ts`,
  `contact-db.ts`). Verificado con un envío real malicioso a
  `/api/contact`: el dato se guarda crudo en Supabase (correcto), y la
  plantilla real reconstruida con esos datos exactos confirma que el HTML
  que llegaría a Resend queda neutralizado.
- **4. Subida de CV**: `lib/validate-cv-upload.ts` nuevo, usa `file-type`
  (nueva dependencia) para leer la firma real de bytes — ya no importa lo
  que declare `file.type`. Probado con el ataque exacto de la auditoría
  (`curl -F "file=@malware.html;type=application/pdf"`): ahora se
  rechaza; un PDF real se acepta incluso con un `Content-Type` declarado
  falso, prueba de que la validación es 100% por contenido.
- ⚠️ Hallazgo colateral anotado, fuera de alcance: `ficha-content.tsx`
  (descripción de producto) usa `dangerouslySetInnerHTML` sin sanitizar,
  mismo perfil de riesgo que el blog — no se tocó, no era parte del
  encargo ("sanitización del blog").
- `rm -rf .next/types && npx tsc --noEmit` 0 errores, `npx next build`
  exit 0. `next.config.mjs` sin tocar, nada desplegado. Ningún archivo
  temporal de prueba quedó en el repositorio.
- **Fase 3 (bajo) pendiente**: `console.log` con PII en 2 rutas; decisión
  del cliente pendiente sobre CSRF/zod (junto con esta fase o mejora
  futura no urgente).

### 2026-09-04 (41) — Fase 1 (crítico) cerrada: /pago-directo ya verifica el importe en servidor
- Orden de arreglos de la auditoría de (40b) aprobado por el cliente:
  Fase 1 (crítico) primero, incluida la pausa explícita del rediseño de
  formularios en curso hasta cerrarla.
- `components/direct-payment-form.tsx` reescrito para dejar de calcular
  nada por su cuenta: reutiliza literalmente
  `calculateVerifiedTotal()`/`createOrderAndGetPaymentUrl()` de
  `app/checkout/actions.ts` (mismo patrón exacto ya probado en checkout,
  no una reimplementación), pasándoles un carrito de un solo artículo — el
  producto real que la página siempre representó
  (`master-bim-full-time`, id 8, 15.000€, confirmado contra el proyecto
  real). De regalo: cupones validados contra la tabla real `coupons`,
  registro real en `orders`/`order_items`, URL de Flywire construida
  enteramente en servidor con el importe ya verificado.
- `app/api/coupons/validate/route.ts` **eliminado por completo** — era el
  endpoint con la vulnerabilidad exacta, su único consumidor era este
  formulario (confirmado por grep), dejarlo vivo sin usar habría sido un
  riesgo residual real.
- Verificado con una ruta temporal de prueba (creada, usada y borrada en
  la sesión): precio real desde Supabase confirmado, cupón inventado
  rechazado, **id de producto manipulado (999999) rechazado** — la prueba
  directa de que ni el precio ni el producto los decide el cliente.
  Pedido de prueba real generado con `orders`/`order_items` (verificado
  por `psql` y borrado) y URL de Flywire con el importe exacto verificado.
- Deliberadamente sin tocar: la estética/UX de `/pago-directo` (pendiente
  de la decisión de unificar con checkout o retirarlo, ya documentada).
- `rm -rf .next/types && npx tsc --noEmit` 0 errores, `npx next build`
  exit 0, `/api/coupons/*` ya no aparece en las rutas.
  `next.config.mjs` sin tocar, nada desplegado. Detalle completo en §4
  "Fase 1 (crítico) de la auditoría de seguridad — /pago-directo cerrado".
- **Fases 2 y 3 pendientes**, en el orden ya aprobado por el cliente:
  cookie de sesión de admin → sanitización del blog (DOMPurify) → escapado
  de HTML en emails → validación de CV por contenido real; después
  `console.log` con PII. El rediseño del formulario de admisión sigue en
  pausa hasta que el cliente confirme que puede retomarse.

### 2026-09-04 (40b) — Informe de auditoría de seguridad del backend entregado
- Informe completo, sin ningún cambio de código, cubriendo los 7 puntos
  pedidos por el cliente + CSRF + validación de esquema. Detalle completo
  en §4 "Auditoría de seguridad del backend completa".
- 🔴 Crítico (1): `/pago-directo` sin verificación de importe en servidor
  — ya diagnosticado en (39), reconfirmado con referencias frescas.
- 🟠 Medio (4): sanitización de HTML del blog con un regex propio con
  bypasses reales (no una librería como DOMPurify); emails transaccionales
  interpolando HTML de usuario sin escapar; subida de CV confiando en el
  `file.type` declarado por el cliente; cookie de sesión de admin con un
  valor fijo en vez de un token.
- 🟢 Bajo (3): `console.log` con PII en 2 rutas; CSRF de riesgo bajo ya
  mitigado de facto; sin validación de esquema (zod) en endpoints
  públicos, no es una vulnerabilidad hoy.
- ✅ Confirmado correcto, verificado en vivo (no de memoria): RLS activo
  en las 19 tablas públicas, exactamente 10 policies (recontado de forma
  independiente antes de dar el informe por bueno, coincide exacto);
  `middleware.ts` protege todo `/admin/*` sin excepción; secretos nunca
  expuestos; `/checkout` sigue siendo el único flujo de pago con
  verificación de importe real en servidor.
- El cliente decide el orden de los arreglos — nada se ha tocado.

### 2026-09-04 (39) — Auditoría de formularios; Fase 2 (contacto arreglado) + Fase 1 (primitivos) implementadas; explicación del hueco de seguridad de /pago-directo
- Encargo: los formularios del sitio (leads, checkout, admisión, contacto,
  baja, catálogo, pago directo) muy por debajo del resto del sitio.
  Auditoría honesta entregada primero (9 formularios, estética +
  funcionamiento + comparación), plan de 3 fases con checkpoints aprobado
  por el cliente. Detalle completo en §5 "Auditoría y rediseño de
  formularios".
- 🔴 Hallazgo raíz: los 4 primitivos compartidos (`components/ui/input.tsx`,
  `textarea.tsx`, `select.tsx`, `checkbox.tsx`) nunca se habían tocado en
  toda la sesión — de ahí que los 9 formularios se sintieran "pegados de
  otro proyecto" a la vez.
- 🔴 Hallazgo más grave: el `<form>` de `/contact-page` (pestaña "Escribir
  Mensaje") **no tenía `onSubmit`** — el único formulario del sitio
  realmente roto, no solo pobre.
- **Fase 2 implementada**: nueva tabla `mensajes_contacto`
  (`scripts/029`), `lib/contact-db.ts` + `POST /api/contact` (persiste
  primero, 2 emails por Resend después, mismo patrón que
  leads/candidaturas/solicitudes_admision), `contact-client-page.tsx` con
  `onSubmit` real, estado de envío, banner de éxito/error. La UI de
  adjuntar archivos (sin backend real detrás) se **eliminó por completo**,
  no se dejó desactivada — decisión del cliente de preferir simple-y-
  funcional sobre completo-y-engañoso. De paso, eliminados los
  `console.log("[v0]...")` de `catalog-download-dialog.tsx`.
- **Fase 1 implementada**: los 4 primitivos suben a `rounded-xl`/`h-11`,
  foco explícito con `--color-brand` (en vez de heredar `--ring`, que en
  `.dark` es gris neutro — el foco perdía la marca fuera de modo claro),
  hover propio, y la misma curva `--ease-out-quart` que ya usan
  `.pedido-*`/`.journey-*`. Blast radius contenido a propósito: no se tocó
  `--ring` global, solo los 4 archivos de primitivos. Efecto colateral
  menor y aceptado: los inputs de `/admin/*` (protegidos por su propia
  clase `admin-input`, que gana la cascada en color/borde) ganan 8px de
  alto, ya que `admin-input` nunca definía `height`.
- **Explicación entregada, sin código**, sobre qué implica cerrar el hueco
  de seguridad de `/pago-directo` (precio hardcodeado + cupón sin
  verificar en servidor) — pedida explícitamente antes de decidir si se
  invierte en su estética. Incluye la pregunta de fondo de si sigue
  haciendo falta como flujo aparte de `/checkout`. Detalle completo en §5
  "Hueco de seguridad de /pago-directo".
- **Sin tocar, tal como se pidió**: `/application` (destino pendiente de
  decisión aparte), la estética de `/pago-directo` (pendiente de la
  decisión de arriba), y cualquier formulario individual de Fase 3 (a la
  espera de que el cliente revise el resultado de la Fase 1).
- Verificado: `npx tsc --noEmit` 0 errores, `npx next build` exit 0 en
  ambas fases. `curl` contra `/api/contact`: 3 payloads (dos rechazados con
  400, uno insertado de verdad y borrado tras verificar por `psql`).
  `rounded-xl`/`h-11` confirmados en `/contact-page` y
  `/solicitud-baja-page`. `next.config.mjs` sin tocar, nada desplegado.
  ⚠️ No verificado en vivo en Chrome (extensión desconectada toda la
  sesión) — pendiente de revisión visual del cliente antes de la Fase 3.

### 2026-09-04 (38) — Solicitud de admisión: nuevo flujo en /landing y las 4 páginas de máster, tabla nueva, panel /admin/admisiones
- Encargo grande, con plan y confirmación explícita del cliente antes de
  escribir código (4 decisiones clave preguntadas y confirmadas con la
  opción recomendada): botón "Solicitud de admisión" en `/landing` + MBIM +
  MBBE + EMBIM + Online, abre un modal con datos personales, académicos,
  programa preseleccionado pero editable, CV obligatorio (Vercel Blob),
  mensaje opcional, checkbox RGPD obligatorio enlazando a la política de
  privacidad real, validación completa en servidor.
- 🔴 Hallazgo antes de construir: ya existía `/application` →
  `/application/thank-you` (tabla `applications`), sin CV/programa/origen,
  con estilo desalineado del resto del sitio, con un único enlace de
  entrada enterrado en un acordeón de MBIM/MBBE/EMBIM. **Decisión explícita
  del cliente: flujo nuevo en paralelo, `/application` intacta** — deuda de
  unificación para otra sesión.
- Tabla nueva `solicitudes_admision` (`scripts/028`), modelada sobre
  `candidaturas_empleo`: RLS sin ninguna policy pública, `CHECK` en
  programa/origen/estado (mismo criterio que `coupons.discount_type`).
  Ejecutada y verificada contra el proyecto real.
- Backend: `lib/admision-db.ts` (inserta primero, 2 emails por Resend
  después, mismo patrón que `candidaturas-db.ts`), `POST /api/admision`
  (toda la validación de obligatorios en servidor — probado con 5 payloads
  inválidos distintos, los 5 devuelven 400), `POST /api/admision/upload-cv`
  (calco de `/api/empleo/upload-cv`).
- `components/admision-modal.tsx` (`AdmisionModal`) — modal compartido
  entre las 5 ubicaciones, mismo patrón que `JobApplicationModal`/
  `InfoRequestModal`. Botón añadido en `AdmisionSection` (MBIM/MBBE/EMBIM,
  nueva prop `programa`), `ClosingSection` (Online), `HeroSection` (landing,
  secundario junto al CTA principal).
- Panel `/admin/admisiones` (solo lectura + cambio de estado, sin
  crear/editar): `app/admision/solicitudes-actions.ts`,
  `components/admision/solicitudes-table.tsx`. `AdminHeader`/dashboard
  ampliados.
- 🔴 Hallazgo colateral: un archivo preexistente sin documentar,
  `app/admision/actions.tsx` (anterior al inicio de esta sesión), con una
  Server Action `submitAdmissionForm()` sin ningún consumidor en el
  proyecto (verificado por grep) — colisionaba de nombre con el archivo
  nuevo y rompía `next build`. Resuelto renombrando el archivo nuevo a
  `solicitudes-actions.ts`; **el archivo muerto no se tocó ni se borró**,
  pendiente de confirmación del cliente para una sesión futura. Detalle
  completo en §1 y §3.
- Verificado: `npx tsc --noEmit` 0 errores, `npx next build` exit 0. `curl`
  contra el dev server: botón presente 1 vez en cada una de las 5 páginas,
  `/admin/admisiones` protegida por middleware (307 sin cookie),
  `/application` sin tocar (200). Solicitud de prueba real de extremo a
  extremo (POST → Supabase → verificada por `psql` → borrada), subida real
  de CV probada (PDF aceptado, `.txt` rechazado). `next.config.mjs` sin
  tocar, nada desplegado. ⚠️ No verificado en vivo en Chrome (extensión
  desconectada toda la sesión) — pendiente de confirmación visual del
  cliente. Detalle completo en §3 "Solicitud de admisión".

### 2026-09-04 (37) — Tercer y último testimonio real en /landing: Agustina Mingrone — las 3 tarjetas ya son reales
- La tarjeta 3 de `TestimonialsSection` (la última pendiente) sustituye su
  `VideoPlaceholder` por el tercer y último vídeo real de testimonios
  (Cloudflare R2, `VID3.mp4`). Cita, nombre y programa dados tal cual por
  el cliente. Detalle completo en §5 "Tercer y último testimonio real en
  /landing — Agustina Mingrone".
- El encargo repitió la misma premisa de (36) sobre un botón explícito de
  mute/unmute en `TestimonialVideo` — ya aclarada y resuelta con el
  cliente en (36) para el mismo componente compartido (ese botón solo
  existe en `HeroVideo`). No hizo falta volver a preguntar: se reutilizó
  `TestimonialVideo` tal cual, mismo criterio ya fijado.
- `app/landing/landing-content.ts`: testimonio 3 pasa de `TODO` a los
  datos reales, con `video: ".../VID3.mp4"`. Resumen de huecos pendientes
  de la cabecera del archivo pierde la línea de vídeos de testimonios (ya
  no queda ninguno).
- **Aviso de cabecera de la sección** (`⚠ N de 3 testimonios son de
  ejemplo...`): recomendación entregada antes de tocar nada, tal como
  pidió el cliente — el `<p>` ya estaba condicionado a `pendingCount > 0`
  desde (33), así que con las 3 tarjetas reales deja de renderizar nada
  automáticamente, sin tocar ningún texto. El cliente no pidió ningún
  cambio adicional sobre esa recomendación. Solo se actualizó el
  comentario de documentación interna (no visible) del componente.
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. `curl` confirma `<video>` de `VID3.mp4` correcto y accesible,
  insignia "Vídeo pendiente" y aviso "Sección de ejemplo" ausentes por
  completo, cero bordes punteados en las tarjetas, `RES1.mp4`/`VID2.mp4`
  (tarjetas 1 y 2) sin cambios. `next.config.mjs` sin tocar, nada
  desplegado.
- **Con esto se cierra el encargo de los 3 testimonios reales de
  `/landing`** (33, 36, 37).

### 2026-09-04 (36) — Segundo testimonio real en /landing: Omar Pérez Ruiz
- La tarjeta 2 de `TestimonialsSection` (de las 3 actuales) sustituye su
  `VideoPlaceholder` por el segundo vídeo real de testimonios (Cloudflare
  R2, `VID2.mp4`). Cita, nombre y programa dados tal cual por el cliente en
  el propio encargo. Detalle completo en §5 "Segundo testimonio real en
  /landing — Omar Pérez Ruiz".
- ⚠️ Conflicto detectado antes de escribir código: el encargo pedía el
  "mismo patrón que la tarjeta 1: controles nativos + botón explícito de
  mute/unmute con icono de altavoz" — pero la tarjeta 1
  (`TestimonialVideo`) nunca tuvo ese botón explícito, solo controles
  nativos (el volumen se arregló en (34), no se le añadió ningún botón
  propio; el botón con icono de altavoz existe solo en `HeroVideo`,
  añadido en (35), un componente distinto). Como `TestimonialVideo` es
  compartido por las tarjetas 1 y 2, añadir un botón nuevo habría afectado
  también a la tarjeta 1 — en conflicto directo con la instrucción de no
  tocarla. Resuelto con el cliente vía pregunta explícita: se reutiliza
  `TestimonialVideo` tal cual está (controles nativos), tarjeta 1 sin
  ningún cambio.
- `app/landing/landing-content.ts`: testimonio 2 pasa de `TODO` a los
  datos reales, con `video: ".../VID2.mp4"`. Cero cambios de componente —
  `testimonials-section.tsx` ya decidía `TestimonialVideo` vs
  `VideoPlaceholder` según `t.video` desde (33), así que la insignia
  "Vídeo pendiente" y el borde punteado desaparecen solos de esta tarjeta.
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. `curl` confirma `<video>` de `VID2.mp4` con
  `controls`/`preload="metadata"`/`playsInline`/`aria-label` correctos y
  sin `autoPlay`/`muted`, aviso de cabecera actualizado a "1 de 3",
  `RES1.mp4` (tarjeta 1) y el TODO de la tarjeta 3 confirmados sin cambios.
  `next.config.mjs` sin tocar, nada desplegado.

### 2026-09-04 (35) — Botón explícito de silenciar/activar sonido en el vídeo del hero de /landing
- `VIDLAN1.mp4` (el vídeo de fondo del hero, `autoPlay muted` atado al
  bloqueo de 1 minuto) gana un botón circular propio de sonido — antes no
  tenía ningún control visible, ni nativo ni propio. Pedido explícito:
  icono que cambia según estado (`Volume2`/`VolumeX`), `aria-label`
  dinámico ("Activar sonido"/"Silenciar vídeo"), sin afectar a `autoPlay`
  ni al contador de segundos vistos que desbloquea el resto de la página.
- `components/landing/hero-video.tsx`: `muted` pasa de atributo estático a
  prop controlada (`muted={isMuted}`, arranca en `true`); nuevo botón en
  `bottom-4 left-4` (el de play/pausa ya existente sigue en
  `bottom-4 right-4`), mismo estilo visual que el botón existente.
- Confirmado por código y por cómo React gestiona `muted` como propiedad
  DOM viva (no solo atributo inicial): el `<video>` nunca se remonta al
  alternar el estado, así que `autoPlay`/`loop`/`playsInline` no se ven
  afectados y `handleTimeUpdate`/`onProgressDelta` (el contador de
  "visto") siguen leyendo `currentTime` con normalidad. Detalle completo
  en §5 "Botón explícito de silenciar/activar sonido en el vídeo del hero".
- Explícitamente fuera de alcance, confirmado sin tocar: `RES1.mp4`/
  `TestimonialVideo` (ya resuelto en (34)) y `next.config.mjs`.
- ⚠️ No verificado en vivo en Chrome/Safari/Firefox — la extensión de
  Claude in Chrome ha seguido desconectada toda la sesión, sin alternativa
  de automatización para Safari/Firefox. Verificación por código: `npx tsc
  --noEmit` 0 errores, `npx next build` exit 0, `curl` contra `/landing`
  confirma `autoPlay`/`muted`/`loop`/`playsInline` intactos y
  `aria-label="Activar sonido"` presente en el HTML servido (estado
  inicial). `next.config.mjs` sin tocar (mismo timestamp), servidor de
  desarrollo confirmado vivo en el puerto 3000, nada desplegado.

### 2026-09-04 (34) — Bug real corregido: control de volumen del vídeo de testimonio no respondía
- El cliente reportó que en el vídeo real de la tarjeta 1 de Testimonios
  (Carolina Larrahona, `RES1.mp4`, añadido en (33)) no se podía quitar el
  mute — el usuario no conseguía activar el sonido.
- Confirmado por código: nunca hubo un atributo `muted` en el JSX (no era
  eso), `controls` sí estaba presente y visible, y no había ningún overlay
  ni listener de JS interceptando clics (`GlobalCursor`, revisado, es
  `pointer-events: none` por diseño).
- 🔴 **Causa real, encontrada y corregida**: el `<video>` vivía dentro de un
  `<div>` con `overflow-hidden` + `rounded-2xl` para darle esquinas
  redondeadas. Es un problema conocido y documentado en varios navegadores:
  un ancestro con `overflow: hidden` recortando un vídeo con controles
  nativos puede dejar el control de volumen/silencio visualmente presente
  pero sin responder a los clics, mientras el resto de controles (como
  play) siguen funcionando con normalidad — por eso no se detectó hasta
  probarlo de verdad.
- Arreglo: el redondeado pasa del `<div>` envolvente al propio `<video>`
  (`components/landing/testimonial-video.tsx`) — los navegadores recortan
  el contenido de un elemento reemplazado con su propio `border-radius`,
  sin necesitar un ancestro con `overflow: hidden` que rompa la
  interactividad de los controles nativos.
- ⚠️ **No se pudo verificar en vivo en Chrome/Safari/Firefox** como pidió
  el cliente — la extensión de Claude in Chrome seguía sin conectarse en
  esta sesión, y no hay forma de automatizar Safari/Firefox desde aquí. El
  diagnóstico y el arreglo se basan en un problema real y bien documentado
  de esta combinación exacta de CSS, no en una prueba en vivo — pendiente
  de que el cliente lo confirme en el navegador.
- Vídeo del hero (`VIDLAN1.mp4`, `hero-video.tsx`) sin tocar — sigue con
  `autoPlay muted loop`, confirmado por `curl` tras el cambio.
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. `next.config.mjs` sin tocar, nada desplegado.

### 2026-09-04 (33) — Primer testimonio real en /landing: Carolina Larrahona
- La tarjeta 1 de `TestimonialsSection` (de las 3 actuales) sustituye su
  `VideoPlaceholder` por el primer vídeo real de testimonios (Cloudflare
  R2, `RES1.mp4`). Cita y nombre dados tal cual; el programa ("Alumna del
  Máster BIM Full Time") se pidió explícito al cliente antes de escribirlo.
  Detalle completo en §5 "Primer testimonio real en /landing".
- `Testimonial` (`landing-content.ts`) pasa a interfaz exportada con `role`
  y `video` opcionales. Nuevo `components/landing/testimonial-video.tsx` —
  deliberadamente sin autoplay ni bucle (a diferencia del vídeo del hero):
  sonido real, controles nativos, el usuario decide reproducirlo.
- `testimonials-section.tsx`: cada tarjeta decide su contenido según si
  `t.video` existe; el aviso de cabecera pasa a contar de verdad cuántas
  siguen pendientes ("2 de 3" en vez de una frase fija). **Tarjetas 2 y 3
  sin ningún cambio.**
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática.

### 2026-09-04 (32) — /landing sin footer completo, solo un enlace legal mínimo
- Encargo: quitar `<FooterSection />` de `/landing` (logo, redes, copyright,
  enlaces a todo el sitio) y sustituirlo por un único `<p>` centrado con un
  solo enlace legal en pestaña nueva — nunca un `<footer>`, coherente con
  que la página es huérfana a propósito. Detalle completo en §5 "Sin footer
  en /landing — solo un enlace legal mínimo".
- Comprobado antes de escribir código: el sitio no tiene una página de
  "Términos" separada de "Aviso Legal" — `/aviso-legal-page` ya cubre
  ambos (incluye una sección "CONDICIONES DE USO") — un solo enlace basta,
  sin separador.
- `app/landing/landing-client.tsx`: se quitó el import y uso de
  `FooterSection`; nada más cambió — vídeo bloqueante, `GatedContent`,
  formulario y resto de secciones intactos. `app/landing/page.tsx`
  (noindex/nofollow, canonical) no se tocó.
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. Verificado por `curl`: cero `<footer` en el HTML, enlace con
  `target="_blank" rel="noopener noreferrer"` presente, cero contenido de
  footer filtrado, robots/canonical intactos. `next.config.mjs` sin tocar,
  nada desplegado.

### 2026-09-04 (31) — Skill `web-design-guidelines` (Vercel) instalada; auditoría e implementación en Secciones 3-4 de /landing
- Encargo: instalar solo `03-web-design-guidelines` de
  `github.com/lotfb86/web-design-skills` (sparse-checkout, nada más del
  paquete), auditar secciones 3/4 con ella, e implementar los hallazgos
  tras confirmación. Detalle completo en §5 "Skill `web-design-guidelines`
  (Vercel) instalada".
- Es un envoltorio que trae en vivo las Web Interface Guidelines de Vercel
  vía `WebFetch` — compatible con Next.js/Tailwind sin fricción (reglas de
  comportamiento HTML/CSS, no de metodología CSS). No cubre jerarquía
  visual/composición ("grid de pricing SaaS") — eso se respondió con
  criterio propio, no con una regla del skill.
- Hallazgos aplicados: `aria-hidden` en iconos decorativos del placeholder
  de vídeo; el shimmer del placeholder pasó de animar `background-position`
  a `transform: translateX()` (compositor-friendly) y se ralentizó a
  propósito para no leerse como un skeleton-loader real; `text-balance` en
  los 2 `<h2>`; `tabular-nums` en la comparación Duración/Modalidad;
  entrada por scroll de los testimonios con más carácter.
- Variación de color de acento por modalidad en la Sección 4 (única pieza
  que esperó aprobación antes de escribirse): Presencial = `--color-brand`,
  Ejecutivo = `--secondary` (token ya existente, apenas usado — ningún
  color nuevo), Online = el mismo verde que ya usa
  `/comparativa-masters-page` para esa modalidad. Derivado de `m.modality`
  ya real, sin campos nuevos en `landing-content.ts`.
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. Verificado por `curl` que el texto de ambas secciones sigue
  idéntico y el sistema de bloqueo de vídeo de (28) no se tocó.
  `next.config.mjs` sin tocar, nada desplegado, ninguna otra skill
  instalada o borrada.

### 2026-09-04 (30) — Rediseño visual de las secciones 3 (Testimonios) y 4 (Los 4 másteres) de /landing
- Encargo explícito de solo diseño/animación, cero cambios de contenido —
  auditoría + 1 dirección por sección, aprobada antes de construir con
  `frontend-design-anthropic`. Detalle completo en §5 "Secciones 3 y 4 de
  /landing — rediseño visual".
- Testimonios (sigue 100% pendiente de contenido real, aviso intacto):
  comilla decorativa gigante de fondo + numeración 01/02/03 en las 3
  tarjetas + barrido de brillo en `VideoPlaceholder` (gated bajo
  `prefers-reduced-motion`).
- Los 4 másteres (mismos datos reales): esquina cortada + sombra teñida
  (`.journey-surface`, reutilizado por primera vez en `/landing`), número
  de programa grande de fondo, barra de acento que se dibuja al entrar,
  etiqueta de modalidad más prominente, botones con `magnetic`.
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. Verificado por `curl` que el texto de ambas secciones es
  idéntico al de antes del rediseño, y que el sistema de bloqueo de vídeo
  de (28) sigue sin tocar.

### 2026-09-04 (29) — Skills externas de landing page probadas y revertidas; solo queda el cambio de nombre del vídeo
- Encargo: instalar 2 skills externas de terceros (`2389-research/landing-page-design`
  y `borghei/Claude-Skills`), cambiar el vídeo del hero a `VIDLAN1.mp4`
  (mismo archivo de 162 MB de (28), solo renombrado), y usar ambas skills
  para mejorar copy/estructura de `/landing`. El cliente pidió revertir la
  mejora de copy/estructura en el mismo turno, antes de aprobarla, y borrar
  las skills instaladas. Detalle completo en §5 "Rediseño de /landing con
  skills externas — probado y revertido".
- El segundo repo resultó ser un marketplace de 368 skills en 20 dominios,
  no una sola skill de landing pages como sugería el encargo — la pieza
  relevante era `marketing/landing-page-generator/SKILL.md`, dentro de él.
- Cambios de copy/estructura probados y luego revertidos a mano (proyecto
  sin `git`, reconstruido desde el registro de la conversación): titular y
  subtítulo del hero, tarjeta de acreditación destacada, botones de máster
  personalizados, sección nueva "Cómo funciona", enlace a política de
  privacidad + `magnetic` en el formulario. Ninguno queda en el código.
- Se mantiene, tal como pidió el cliente: el vídeo apunta a `VIDLAN1.mp4`,
  y todo el sistema de bloqueo de (28) (blur, velo, franja de progreso,
  pulso al intentar hacer scroll, `sessionStorage`) intacto.
- Las 2 carpetas de skills se eliminaron por completo de
  `~/.claude/skills/` (`rm -rf`), confirmado que no queda ninguna en disco.
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. HTML servido verificado por `curl` contra el estado (28): sin
  diferencias salvo el nombre del archivo de vídeo.

### 2026-09-04 (28) — Vídeo del hero de /landing: de YouTube a Cloudflare R2 nativo
- Un día después de (27), nuevo encargo: sustituir el vídeo de YouTube por
  un `<video>` HTML nativo servido desde Cloudflare R2 (sin iframe, sin
  librería), autoplay silencioso en bucle. Toda la infraestructura
  específica de YouTube de (27) se retiró por completo (`hero-video-gate.tsx`,
  `lib/youtube-api.ts`) — no quedó como código muerto. Detalle completo en
  §5 "Vídeo bloqueante del hero de /landing".
- 🔴 Hallazgo antes de tocar nada: el vídeo de la URL dada pesa **~162 MB**
  (`curl -I` confirma `Content-Length: 170217788`) — enorme para un vídeo
  de hero con autoplay (lo habitual son 5-20 MB). Se integró tal cual pide
  el encargo, pero se avisó explícitamente al cliente: recomendable
  recomprimir el archivo antes de publicar esto de verdad.
- El tratamiento del resto de la página cambia respecto a (27): de "casi
  invisible" a **visible pero borrosa** (`filter: blur(9px)`) con un velo
  oscuro semi-transparente (`.gated-scrim`) que se funde al desbloquear —
  el usuario intuye que hay contenido real esperando.
- Nuevo: botón de pausa/reproducción manual sobre el vídeo (sin él, "si el
  usuario pausa se pausa el contador" no tendría forma de dispararse) y un
  pulso/tilt sutil en el vídeo cuando se detecta un intento de hacer scroll
  estando bloqueado (rueda, gesto táctil, teclas de navegación, con
  cooldown de 700ms).
- El seguimiento de avance usa el evento nativo `timeupdate` del `<video>`
  (no un cronómetro de cliente ingenuo): solo cuenta avance positivo y
  pequeño, un salto del bucle o un adelanto manual no puntúa como "visto".
  Mismo aviso honesto que en (27): esto no puede ser 100% infalible frente
  a alguien con la consola abierta, sin sesión de servidor para un
  visitante anónimo.
- Se mantiene igual que en (27): estado en `sessionStorage` (nunca
  `localStorage`), scroll bloqueado con `overflow: hidden` +
  `lenis.stop()/.start()`.
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. No se pudo probar la interacción real con Chrome en esta
  sesión (extensión no conectada). **Pendiente de que el cliente lo pruebe
  en local antes de darlo por definitivo**, tal como pidió explícitamente.

### 2026-09-03 (27) — Vídeo bloqueante en el hero de /landing
- Encargo: el vídeo real de YouTube (`YQ0SOO-2O7I`) rellena el hueco
  pendiente del hero de `/landing` y además bloquea el resto de la página
  (scroll deshabilitado, secciones 2-6 atenuadas) hasta acumular 60s de
  reproducción real — no 60s de reloj, se pausa si el vídeo se pausa.
  Detalle completo en §5 "Vídeo bloqueante del hero de /landing".
- ⚠️ Aviso dado explícitamente antes de construir: el encargo pedía que el
  sistema "no se pueda trucar ni con devtools" — eso no es alcanzable con
  una solución puramente de cliente (sin sesión de servidor para un
  visitante anónimo de una landing). Se construyó la versión más resistente
  a manipulación *casual* que tiene sentido (avance medido por
  `player.getCurrentTime()` real del reproductor de YouTube, no un
  cronómetro de cliente; adelantar el vídeo no cuenta como visto), sin
  venderla como infalible.
- **Archivos nuevos**: `lib/youtube-api.ts` (carga perezosa del IFrame
  Player API real, solo tras el clic — LCP intacto), `hero-video-gate.tsx`
  (miniatura de YouTube hasta el clic, reproductor real después, sondeo de
  avance cada 500ms), `gated-content.tsx` (secciones 2-6 atenuadas + inert
  mientras está bloqueado), `video-gate-banner.tsx` (franja fija con
  progreso, única superficie alcanzable durante el bloqueo).
- `landing-client.tsx`: estado en `sessionStorage` (no `localStorage` —
  nueva pestaña vuelve a bloquear, recarga en la misma no), bloqueo de
  scroll con `overflow: hidden` + `lenis.stop()/.start()` (mismo patrón que
  `motion-root.tsx`).
- `npx tsc --noEmit`: 0 errores. `npx next build`: exit 0, `/landing`
  estática. No se pudo probar la interacción real (clic, contador,
  desbloqueo, persistencia) con Chrome real en esta sesión — extensión no
  conectada. **Pendiente de que el cliente lo pruebe en local antes de
  darlo por definitivo**, tal como pidió explícitamente.

### 2026-09-03 (26) — Carrito y checkout rediseñados por completo, con el hueco de seguridad cerrado por fin
- Encargo: rediseño premium del carrito (`CartDrawer`) y `/checkout`,
  estética + funcionalidad + UX. Proceso pedido explícitamente: auditoría
  primero, 2 direcciones de diseño por pieza, aprobación antes de construir.
  Detalle completo en §5 "Carrito y Checkout — rediseño propio 'Pedido'".
- 🔴 Hallazgo bloqueante de la auditoría: el encargo pedía "mantener" la
  validación del importe en servidor y la conexión de cupones a la tabla
  real de Supabase — **ninguna de las dos existía**. `handlePayment()`
  calculaba el precio final enteramente en cliente y lo mandaba tal cual a
  Flywire; `/api/coupons/validate` comparaba contra una lista hardcodeada
  en el propio archivo. Ya estaba documentado sin construir desde la
  auditoría de (15). Confirmado explícitamente con el cliente: sí, cerrar
  ese hueco entra en el alcance de este encargo.
- **Servidor construido** — `app/checkout/actions.ts`, 3 Server Actions
  nuevas: `calculateVerifiedTotal()` (recalcula cada línea desde
  `productos` real, valida el cupón contra `coupons` real, única fuente de
  verdad del importe) y `createOrderAndGetPaymentUrl()` (reverifica todo,
  **primer código del proyecto que escribe en `orders`/`order_items`** —
  existían desde 2026-09-01 sin consumidor real — y solo entonces genera la
  URL de Flywire con el importe ya verificado; el cliente nunca decide el
  `amount`).
- **Carrito reconstruido** — 3 bugs reales corregidos (overlay
  transparente, animación de deslizamiento que nunca se ejecutaba, imagen
  de producto siempre 📚 en vez de la real) además del rediseño visual con
  identidad propia (`.pedido-*`, decimoquinto vocabulario del sitio).
- **Checkout reconstruido** — página única con 4 secciones numeradas ("Paso
  1" a "Paso 4"), no un stepper de pantallas separadas (dirección elegida
  por el cliente). El botón de pago permanece deshabilitado hasta que el
  importe pasa por un estado real de "verificando con el servidor" →
  "verificado" — el momento ★ de la página, no decorativo: es la única
  puerta hacia Flywire. Cupón con botón "Aplicar" explícito en vez de
  validar al teclear. Barra fija en móvil con el total siempre visible.
- ⚠️ `/pago-directo` queda fuera de este encargo — sigue con el mismo hueco
  de seguridad (cupón hardcodeado, sin verificación server-side) y con el
  endpoint antiguo `/api/coupons/validate`, que se conserva vivo solo por
  ese consumidor. El panel de admin de cupones (`/admin/cupones`) tampoco
  se construyó — sigue pendiente de una sesión futura.
- `npx tsc --noEmit`: se mantiene en 0 errores. `npx next build`: exit 0,
  `/checkout` estática. No se pudo verificar la interacción completa con
  Chrome real en esta sesión (extensión no conectada) — pendiente de
  confirmación visual del cliente, incluida la prueba de un cupón real
  contra la tabla de Supabase.

### 2026-09-03 (25) — Rediseño premium de prueba social completo: Alumnos, Alianzas Académicas y Opiniones
- Segunda tanda del encargo de rediseño premium/GSAP (tras las 3 páginas
  institucionales de (24)): Alumnos, Alianzas Académicas y Opiniones —
  tono de prueba social, confianza de terceros en vez de la institución
  hablando de sí misma. Mismo proceso: auditoría, confirmación explícita
  del cliente sobre qué contenido es real antes de proponer dirección, 2
  direcciones por página, aprobación antes de construir. Detalle completo
  en §5 "Rediseño premium de 3 páginas de prueba social".
- 🔴 Hallazgos de auditoría: `/alumni-page` tenía una sección de "Proyectos
  Destacados" con 3 proyectos **ficticios** (imágenes que nunca existieron
  en disco, ya desactivada en el código con un TODO) y un enlace roto a
  `/masters`; `/alianzas-page` tenía 2 de 3 fotos de campus rotas;
  `/opiniones-page` tenía una sección de empresas con `logo: null`
  explícito (placeholder nunca completado) para las 5 empresas listadas.
- **Alumnos construida** — duodécimo vocabulario visual propio,
  `.legado-*`. Dirección "El Legado": carrusel ficticio eliminado por
  completo; 3 alumnos reales (testimonios y cifras confirmados reales por
  el cliente) presentados como paneles a página completa con un arco real
  de 2 nodos "Programa → Hoy", reutilizando el carril de "La Trayectoria" a
  escala individual. Corregido el enlace roto a `/comparativa-masters-page`.
- **Alianzas Académicas construida** — decimotercer vocabulario propio,
  `.convenio-*`. Dirección "El Convenio": las 3 alianzas reales (confirmadas
  por el cliente), cada una con su propio tipo de colaboración legible
  (intercambio / orientación profesional / licencia de contenido) y sus
  puntos del acuerdo "sellándose" al entrar en pantalla. Para las 2 fotos de
  campus rotas, un emblema circular con iniciales en vez de esperar a una
  foto o usar stock. Corregido el enlace roto a `/contact-page`.
- **Opiniones construida** — decimocuarto vocabulario propio, `.voces-*`,
  deliberadamente el más contenido de los seis rediseñados en esta sesión:
  sin tarjetas de degradado ni marquee, solo tipografía y restricción para
  máxima sensación de autenticidad. 3 testimonios reales (confirmados,
  incluido uno genérico) como archivo editorial de citas; 4 logos reales
  reutilizados de Metodología para "Empresas que confían" (Siemens
  retirado, sin logo verificable).
- **Con esto se cierra el encargo completo de las 6 páginas rediseñadas en
  esta sesión** (3 institucionales de (24) + 3 de prueba social de (25)).
- `npx tsc --noEmit`: se mantiene en 0 errores. `npx next build`: exit 0,
  las 3 rutas prerenderizadas como estáticas. No se pudo verificar
  visualmente con Chrome real en ninguna de las 3 (extensión no conectada
  en esta sesión) — pendiente de confirmación visual del cliente, igual que
  las 3 de (24).

### 2026-09-03 (24) — Rediseño premium institucional completo: Sobre IDESIE, Nuestra Metodología y Profesores
- Encargo: rediseño completo de Sobre IDESIE, Nuestra Metodología y
  Profesores con identidad premium/institucional dirigida a decisores.
  Proceso pedido explícitamente: auditoría de las 3 páginas actuales, 2
  direcciones por página, aprobación del cliente antes de construir.
  Detalle completo en §5 "Rediseño premium de 3 páginas institucionales".
- 🔴 Hallazgo crítico de la auditoría: **las 17 fotos de profesores están
  rotas en producción** (ningún archivo existe en `public/images/`) y los
  17 enlaces de LinkedIn eran inventados (slugs generados del nombre, nunca
  verificados). Se descartó publicar esos LinkedIn; la página de Profesores
  se construirá con monogramas en vez de fotos hasta que existan reales.
- **Sobre IDESIE construida** — noveno vocabulario visual propio,
  `.trayectoria-*`. Dirección "La Trayectoria": hero con la pregunta central
  ("¿Quiénes somos?"), un carril de 3 hitos reales con fecha/certeza real
  (2012 fundación, acreditación, hoy) que se dibuja al scroll — sin inventar
  años intermedios que no existen en ningún sitio del proyecto — y
  Misión/Visión/Valores como narrativa conectada en vez de tarjetas sueltas.
  De paso, corregido el único error preexistente de `npx tsc --noEmit` de
  todo el proyecto (`SEOStructuredData` con una prop `type` inexistente) y
  quitado un import sin usar. Detalle completo en §5.
- **Nuestra Metodología construida** — décimo vocabulario visual propio,
  `.ciclo-*`. Dirección "El Ciclo Práctico": fusiona los 3 pilares + 3 pasos
  de implementación reales de la versión anterior (mismo contenido, sin
  inventar nada nuevo) en 3 fases de un ciclo cerrado — Aplicar → Tutelar →
  Consolidar → vuelve a Aplicar — deliberadamente distinto del "día
  partido" de las páginas de máster. Corregido de paso el enlace roto
  `/contacto-page` del hero, los anillos SVG genéricos de empleo por sector
  sustituidos por barras, y los 35 logos reales de empresas pasan de grid
  estático a marquee infinito. Detalle completo en §5.
- **Profesores construida** — undécimo vocabulario visual propio,
  `.indice-*`. Dirección "El Índice de Expertos": directorio editorial tipo
  masthead en vez de galería de tarjetas, con monogramas de iniciales en
  tonos de marca sustituyendo las 17 fotos rotas y **sin publicar los 17
  LinkedIn inventados**. Agrupación real Dirección/Cuerpo docente (no una
  taxonomía inventada), bio de cada profesor revelada al clic. Corregido de
  paso el enlace roto `/contacto` del CTA final. Detalle completo en §5.
- **Con esto se cierra el encargo completo de las 3 páginas
  institucionales** (Sobre IDESIE, Nuestra Metodología, Profesores).
- `npx tsc --noEmit`: 1→0 errores (se mantiene en 0 tras las 3 páginas).
  `npx next build`: exit 0, las 3 rutas prerenderizadas como estáticas. No
  se pudo verificar visualmente con Chrome real en ninguna de las 3
  (extensión de Claude in Chrome no conectada en esta sesión) — pendiente
  de confirmación visual del cliente en el navegador.

### 2026-09-03 (23) — Magnetismo de botones: motor centralizado, todos los botones de home/tienda/financiación + header/footer
- Extensión explícita del encargo de (22): el tirón hacia el cursor pasa de
  "un CTA por página" a "todos los botones reales" de las 3 páginas de
  prueba (home, tienda, financiación) más el header y el footer
  compartidos (47+ páginas, por ser componentes comunes) — navegación,
  CTAs, filtros, pestañas, iconos. Pedido explícito de un mecanismo
  centralizado en vez de copiar lógica en cada botón, y de probarlo en las
  3 páginas antes de extenderlo al resto del sitio.
- **Motor nuevo**: `components/site-motion/global-magnetic.tsx`
  (`GlobalMagnetic`), un único `pointermove` delegado en `window` (montado
  una vez en `SiteMotionProvider`, mismo patrón que `GlobalCursor`) que
  anima con `gsap.quickTo` el botón más cercano al cursor de una lista
  cacheada de candidatos — sustituye a que cada botón monte su propio
  listener (lo que hacía `hooks/use-magnetic.ts`, insostenible para
  "todos los botones del sitio"). `use-magnetic.ts` no se tocó, sigue
  usándose donde ya estaba (MBIM, MBBE, EMBIM, `/landing`).
- **Cómo se marca un botón**: `<Button magnetic>` (prop nueva, opt-in, en
  `components/ui/button.tsx`) para lo que ya pasa por el componente
  compartido, o `data-magnetic` a pelo para triggers de Radix y links
  `.btn-*` de cada vocabulario visual que no usan `<Button>`. Los botones
  pequeños (<48px de lado) se atenúan automáticamente a la mitad de fuerza.
- Los 2 CTA de la demo de (22) que usaban `useMagnetic` manual
  (`hero-primary-cta.tsx`, `balance-hero-cta.tsx`) se migraron al motor
  centralizado y de paso perdieron el `"use client"` que solo existía por
  el hook — vuelven a ser Server Components.
- 🔴 Hallazgo de paso: `components/footer.tsx` es un segundo componente
  `Footer` que **ningún archivo importa** — código muerto, el footer real
  de todo el sitio es `components/footer-section.tsx`. No se borró (fuera
  de este encargo), solo anotado.
- Deliberadamente sin tocar: `/admin/*`, `/checkout`, `/pago-directo`,
  `/contact-page`, `/application`, el resto de páginas públicas, y la
  ficha de producto completa de `/tienda` (es un único `<Link>` gigante —
  magnetizar toda la tarjeta se sentiría como un bug). Detalle completo,
  tabla de qué se marcó exactamente, y verificación en §5 "Magnetismo de
  botones — motor centralizado".
- Verificado con Chrome real vía Puppeteer contra el dev server: cada botón
  marcado se desplaza y vuelve a 0, un clic en un CTA magnético sigue
  navegando, el trigger PROGRAMAS del header sigue abriendo su desplegable,
  y con `prefers-reduced-motion: reduce` el efecto queda completamente
  inerte (ni se descarga GSAP). `rm -rf .next/types && npx tsc --noEmit`:
  mismo 1 error preexistente. `npx next build`: exit 0, mismas rutas
  estáticas que antes.

### 2026-09-03 (22) — Cursor + botón + scroll suave, sistema global (demo en 3 páginas)
- Encargo: llevar tres piezas de `/mbim-page` a todo el sitio — cursor
  personalizado, micro-interacciones de botón (barrido + magnetismo con
  `gsap.quickTo`) y scroll suave (Lenis) — sin romper Zona A
  (`animation-timeline`, home) ni Zona B (GSAP, programa), respetando
  `prefers-reduced-motion` en todo el sitio y sin afectar al LCP de páginas
  rápidas (home, blog, tienda).
- 🔴 **Hallazgo de la auditoría previa, no sabido hasta ahora**: la home
  tenía su PROPIA Lenis independiente (`components/home/smooth-scroll.tsx`),
  además de la que cada página de programa creaba por su cuenta —
  **3 instancias de Lenis en el proyecto, ninguna compartida**. Montar una
  Lenis global sin verlo antes habría dejado la home con dos Lenis
  simultáneas peleando por el mismo scroll. `SmoothScroll` se borró, ya
  redundante.
- El botón de relleno-por-barrido tampoco era reutilizable: existía
  **copiado 5 veces** (`.btn-journey`/`.btn-online`/`.btn-blueprint`/
  `.btn-balance`/`.btn-tablon`), una por vocabulario visual, mecánica CSS
  idéntica. Se añadió `.btn-sweep` (la versión sin vocabulario propio) sin
  tocar las 5 existentes, ya aprobadas. El magnetismo (`useMagnetic`) SÍ era
  ya reutilizable tal cual — no se tocó, solo se aplicó donde faltaba.
- **Sistema centralizado nuevo**: `components/site-motion/`
  (`SiteMotionProvider` + `GlobalCursor`) montado una sola vez en
  `app/layout.tsx`, usando `lenis/react` (`<ReactLenis root>` + `useLenis()`)
  en vez de una Lenis hecha a mano — cualquier componente se engancha a la
  MISMA instancia sin crear otra. `components/programa/motion-root.tsx` ya
  no crea Lenis ni el cursor: usa `useLenis()` para sincronizar ScrollTrigger
  con la Lenis global, y deja el cursor por completo a `GlobalCursor`.
- **Adaptación de usabilidad pedida explícitamente**: el punto de cursor se
  apaga del todo sobre `input`/`textarea`/`select` (no solo deja de crecer)
  — en formularios largos (`/checkout`, `/contact-page`, `/application`) un
  punto azul sobre cada campo es ruido, el cursor de texto nativo ya
  comunica "aquí se escribe".
- **Demo aprobada solo en 3 páginas** antes de extender el botón al resto:
  home (hero), tienda (cierre), Financiación (hero). El cursor y Lenis, al
  ser puramente ambiente y no cambiar ningún botón existente, sí se
  activaron ya en las 47+ páginas. Deliberadamente sin tocar: botones de
  `/admin/*`, de formularios transaccionales, ni el componente compartido
  `Button` (habría cambiado todos los botones del sitio sin revisión).
  Detalle completo, archivos nuevos/modificados y verificación en §5
  "Sistema global de cursor + scroll suave".
- Verificado con Chrome real: cursor+barrido+magnetismo en las 3 páginas
  demo, `/mbim-page` sin regresión (progreso de lectura, carril de módulos
  M3, un solo `.site-cursor` en el HTML), `/contact-page` con el cursor
  apagándose sobre los campos de texto, sin errores de consola.
- `rm -rf .next/types && npx tsc --noEmit`: mismo 1 error preexistente
  (`sobre-idesie-page`, sin relación). `npx next build`: exit 0, 55 rutas,
  home/tienda/financiación siguen estáticas.

### 2026-09-03 (21) — Bolsa de Empleo: ofertas y candidaturas reales + gestión desde /admin + rediseño "El Tablón"
- Encargo doble, trabajado en paralelo: (a) las 4 ofertas ficticias
  hardcodeadas pasan a un sistema real con datos en Supabase y gestión
  completa desde `/admin/empleo` (como blog y tienda); (b) rediseño visual
  propio de la página pública, "El Tablón".
- **Esquema nuevo** (`scripts/027_ofertas_empleo.sql`, ejecutado contra el
  proyecto real): `ofertas_empleo` (lectura pública si `activa`) y
  `candidaturas_empleo` (sin policies públicas, exclusivo `service_role` —
  datos personales, mismo patrón que `leads`). Detalle completo en §3
  "Bolsa de Empleo — ofertas y candidaturas".
- CV real subido a **Vercel Blob** antes de enviar la candidatura (antes
  solo viajaba el nombre del fichero); inserción en Supabase primero, dos
  emails por **Resend** después (aviso interno + confirmación al
  candidato) — sustituye a `/api/send-job-inquiry` (Brevo, sin
  persistencia), **eliminado por completo**.
- Nuevo `/admin/empleo` (listado, crear, editar, candidaturas recibidas de
  solo lectura con descarga de CV), mismo patrón CRUD que
  `/admin/tienda` — Server Actions en `app/empleo/actions.ts`, clave
  secreta siempre vía `verifyAdminSecret()`, nunca reimplementada.
  `AdminHeader`/`/admin/dashboard` ampliados con sus stats.
- **Rediseño visual "El Tablón"** (octavo vocabulario propio, `.tablon-*`):
  fondo `gray-950`, fichas con esquina doblada + chincheta en vez de foto de
  stock, filtro real por ubicación/tipo de contrato (sustituye al
  decorativo de antes), sección nueva "Cómo funciona" (3 pasos). ★ Momento
  fuerte: la propia rejilla de ofertas, cada tarjeta "clavándose" de nuevo
  cada vez que el filtro cambia de verdad. Detalle completo en §5 "Bolsa de
  Empleo — rediseño propio 'El Tablón'".
- Verificado con Chrome real, extremo a extremo: 2 ofertas de prueba creadas
  vía el formulario real de `/admin/empleo/nueva` (nunca SQL directo),
  filtro reduciendo "2 de 2" a "1 de 2" con la animación repitiéndose,
  candidatura espontánea real completada y visible en
  `/admin/empleo/candidaturas`, estado vacío correcto tras borrar las
  ofertas de prueba. Las 2 ofertas, la candidatura y la fila temporal de
  `admin_users` usada para el login se borraron al terminar.
- Verificado: `rm -rf .next/types` + `npx tsc --noEmit` en el mismo 1 error
  preexistente (sin relación con este trabajo), `npx next build` exit 0 con
  las rutas nuevas de `/admin/empleo/*` y `/api/empleo/*` listadas sin
  error.

### 2026-09-03 (20) — Financiación y Becas: rediseño propio "El Balance"
- Séptimo vocabulario visual propio (`.balance-*`). Auditoría previa
  encontró una imagen rota (`asesoramiento-personalizado.png`, nunca
  existió en disco) y la prop inválida `query` en ese `next/image` — el
  segundo de los 2 errores preexistentes de `tsc`, ahora resuelto. 5
  erratas de acentuación corregidas con confirmación explícita del cliente,
  sin tocar ningún dato (precios, becas, TAE).
- Densidad de animación al mismo nivel que "La Red", a petición explícita:
  4 secciones con su propio scroll-reveal (`useGsapEffect`), no solo un
  contador aislado. Único momento fuerte: el carril de becas
  (`balance-ledger.tsx`), con cada beca "estampándose" como un sello
  aprobado sobre un carril que se dibuja al hacer scroll. Detalle completo,
  componentes nuevos y verificación en §5 "Financiación y Becas — rediseño
  propio 'El Balance'".
- De paso: `alternates.canonical` añadido (heredaba el de la home, mismo
  bug ya corregido en otras páginas en la auditoría SEO).
- Verificado con Chrome real: las 4 animaciones, el cambio de pestaña
  Full Time/Executive, y la tabla-estado de cuenta. `npx tsc --noEmit` baja
  a 1 error preexistente, `npx next build` exit 0.

### 2026-09-03 (19) — Editor genérico de lista; contenido real de MBIM/MBBE/EMBIM cargado
- Segunda y última pieza de los editores de detalle: un componente
  genérico (`components/tienda/lista-editor.tsx`) más Server Actions
  genéricas (`app/tienda/detalle-actions.ts`, con allowlist de tabla) que
  cubren las 5 tablas restantes (`producto_dirigido`, `producto_objetivos`,
  `producto_requisitos`, `producto_faqs`, `producto_testimonios`) desde una
  única configuración (`lib/producto-detalle-config.ts`). `detalle-tabs.tsx`
  genera las 5 pestañas automáticamente a partir de esa configuración.
  Detalle completo en §1 "Editor genérico de lista con orden — detalle".
- Con los dos editores (módulos+temas del (18), lista genérica de esta
  entrada) probados, se cargó **todo el contenido real ya extraído** de
  `mbim-content.ts`/`mbbe-content.ts`/`embim-content.ts` — módulos, temas,
  requisitos y FAQs de los tres másteres — **a través de la UI real de
  `/admin/tienda`, nunca por SQL directo**, como se acordó explícitamente.
  Recuentos finales verificados: MBIM 9 módulos/22 temas/6 requisitos/9
  FAQs, MBBE 5/28/6/9, EMBIM 10/56/6/9. Detalle completo, incluida la
  decisión de no guardar el campo `text` de cada módulo (no hay columna
  para él, `subtitle` ya cubre ese hueco), en §1 "Contenido real de
  MBIM/MBBE/EMBIM cargado a través de los editores".
- Deliberadamente sin tocar: `producto_dirigido`/`producto_objetivos`/
  `producto_testimonios` (los tres `*-content.ts` no tienen datos para
  esas tablas) y el contenido de detalle de `master-bim-online`/
  `titulo-profesional-cualificam`/`curso-revit-gratis` (tal como se
  acordó, se quedan vacíos hasta que haya contenido real).
- Credencial temporal de admin (`migracion-editores-temp`, creada en (18))
  borrada de `admin_users` al terminar todo el trabajo de esta sesión.
- Verificado: `npx tsc --noEmit` en 2 errores preexistentes (sin cambios),
  `npx next build` exit 0, `/producto/executive-master-bim` renderizando
  los 10 módulos reales con Chrome real.

### 2026-09-03 (18) — Editor de módulos + temas anidados en /admin/tienda
- Primera pieza de los editores de detalle que faltaban (identificados como
  pendientes al cerrar (17)): módulos + temas, el único de los 7 con
  anidación, construido primero a petición explícita del cliente para
  validar el patrón más complejo antes del editor genérico de lista.
  Detalle completo, archivos nuevos y verificación en §1 "Editor de módulos
  + temas anidados — detalle".
- Nuevo `app/tienda/modulos-actions.ts` (Server Actions independientes,
  reordenar por intercambio de `orden` con el vecino), 
  `components/tienda/modulos-editor.tsx` (editor con anidación) y
  `components/tienda/detalle-tabs.tsx` (envoltorio de pestañas para las 7
  tablas de detalle, con una única clave secreta compartida). Enganchado en
  `app/admin/tienda/[slug]/editar/page.tsx`, debajo del formulario de datos
  básicos.
- Verificado con Chrome real contra el producto real `master-bim-full-time`:
  módulo y tema reales del MBIM añadidos a través del editor (no SQL
  directo), confirmados por `psql` y visibles en `/producto/master-bim-full-time`
  sin recargar manualmente.
- Siguiente pieza: editor genérico de lista con orden para
  `producto_dirigido`/`producto_objetivos`/`producto_requisitos`/
  `producto_faqs`/`producto_testimonios`, y después cargar a través de
  ambos editores el contenido real ya extraído de MBIM/MBBE/EMBIM
  (requisitos, FAQs, y los módulos de MBBE/EMBIM).
- Verificado: `npx tsc --noEmit` en 2 errores preexistentes (sin cambios).

### 2026-09-03 (17) — Catálogo real migrado (6 productos); precio "no disponible" para el EMBIM
- 🔴 Hallazgo urgente (marcado en §0, separado de esta tarea): el redirect
  `/producto/:path*` → `/tienda`, ya corregido en local hace tiempo, **nunca
  se desplegó a producción** — confirmado con curl, `308` en cualquier
  ficha de producto real. Bloquea la compra de cualquier máster ahora mismo.
- Migrados los 6 productos reales de la tienda pública (`master-bim-full-time`,
  `master-bim-building-engineering`, `executive-master-bim`,
  `master-bim-online`, `titulo-profesional-cualificam`, `curso-revit-gratis`)
  usando el formulario real de `/admin/tienda/nuevo` (no SQL a mano) —
  verifica de paso que el CRUD funciona con datos reales. Slugs confirmados
  extrayéndolos del HTML real de producción, resolviendo la duda pendiente
  desde hace tiempo sobre `master-bim-manager` (nunca fue el slug real).
- `productos.precio_actual` pasa a ser **nullable**
  (`scripts/026_precio_actual_nullable.sql`) — el Executive Master BIM se
  crea sin precio y la interfaz (listado, ficha, CTA final, tabla de admin)
  muestra "Precio no disponible, contactar" con un enlace a contacto en vez
  de "Añadir al carrito". Verificado de extremo a extremo con Chrome real.
- 🚧 Pendiente, explícito: las 7 tablas de detalle de producto (módulos,
  dirigido, objetivos, requisitos, FAQs, testimonios) siguen sin ningún
  editor en `/admin/tienda` — no se insertó nada por SQL para no contradecir
  la instrucción de usar solo Server Actions. Contenido de MBIM/MBBE/EMBIM
  ya extraído de sus `*-content.ts` y listo para cuando se decida cómo
  cargarlo (construir los editores, autorizar una excepción de SQL, o
  dejarlo para más adelante).
- Detalle completo en §1 "Migración del catálogo real de productos".
- `npx tsc --noEmit` en los mismos 2 errores preexistentes, `npx next build`
  exit 0.

### 2026-09-03 (16) — Flywire Pay-by-Link: encontrado el parámetro correcto, funciona de verdad
- El cliente pasó un enlace de referencia real. La pieza que faltaba:
  `recipient=IBT` (código de portal de 3 letras), no `payment_destination=idesie`
  ni `provider=IBT` como tenía el código heredado. `student_first_name`/
  `student_last_name`/`student_email` eran correctos desde el principio.
  Nuevo: `read_only=amount,student_first_name,student_last_name,student_email`,
  bloquea esos campos en el formulario de Flywire.
- Actualizado en los dos sitios que construyen esta URL:
  `app/checkout/page.tsx` y `components/direct-payment-form.tsx`.
- **Verificado dos veces con Chrome real, sin enviar ningún dato de pago**:
  el enlace de referencia del cliente y el flujo completo de `/checkout`
  (carrito máster + matrícula, 18.000 €) llegan a la página real "IDESIE
  Business & Tech School receives" con el importe correcto precargado.
- Detalle completo en §3 "Pay-by-Link: parámetro correcto encontrado".
- `npx tsc --noEmit` en los mismos 2 errores preexistentes, `npx next build`
  exit 0.

### 2026-09-03 (15) — Bug de logout de /admin corregido; auditoría del rediseño de checkout entregada
- 🔴 Bug real corregido: cerrar sesión en `/admin` y pulsar "atrás" en el
  navegador mostraba la página protegida tal cual estaba, sin redirigir a
  login — causado por `router.push()` (navegación de cliente) dejando un
  caché de ruta en memoria que "atrás" repintaba sin pasar por el servidor.
  El servidor (cookie + middleware) nunca estuvo mal, verificado con curl.
- Arreglo en dos piezas: `handleLogout()` pasa a navegación dura
  (`window.location.href`), y nuevo `app/admin/layout.tsx` +
  `components/admin-bfcache-guard.tsx` fuerzan recarga si la página vuelve
  del bfcache real del navegador. Verificado de extremo a extremo con
  Chrome real (login → navegar → logout → "atrás" → login, sin dejar pasar).
- Detalle completo en §4 "Logout de /admin — corregido".
- Auditoría entregada (sin código nuevo, a la espera de aprobación) para el
  encargo de rediseñar `/checkout`: hallazgo clave, `orders`/`order_items`/
  `coupons` ya existen en Supabase sin usar por ningún código. Detalle,
  esquema de las 3 tablas y estructura propuesta en §3 "Rediseño y
  reconstrucción del checkout".
- `npx tsc --noEmit` en los mismos 2 errores preexistentes, `npx next build`
  exit 0.

### 2026-09-03 (14) — Flywire Pay-by-Link probado con Chrome real: bug de carrito corregido, el enlace en sí no funciona
- Cliente confirmó que los parámetros existentes (`student_first_name`,
  `provider=IBT`) son propios del onboarding de IDESIE con Flywire, no un
  error — pidió dejar el Pay-by-Link funcionando de verdad y probarlo.
- 🔴 Bug real corregido en `components/producto/ficha-sidebar.tsx`: el
  botón de matrícula reutilizaba el mismo `id` que "Máster completo", así
  que añadir ambos al carrito incrementaba cantidad en vez de sumar una
  línea — se perdía el precio de matrícula. Corregido con `id: -producto.id`.
  Verificado con Chrome real: carrito con master + matrícula, dos líneas,
  subtotal correcto (18.000 €).
- 🔴 **El enlace de Flywire probado con Chrome real (sin enviar ningún dato
  de pago) NO lleva a un formulario de pago de IDESIE** — redirige a la
  home pública genérica de Flywire. Se probaron también, solo como
  diagnóstico, el esquema documentado públicamente (`recipient=idesie`) →
  error explícito "Page Not Found" de Flywire, y `payment_destination`
  en mayúsculas → mismo fallback genérico. Ninguna de las tres pruebas
  resuelve "idesie" a un portal real. No se tocó el código de generación
  de la URL (el cliente pidió no inventar/cambiar sus parámetros) —
  siguiente paso: confirmar con Flywire el código de recipient/destino
  correcto.
- Detalle completo, con las URLs exactas probadas, en §3 "Flywire —
  integración de pagos".
- `npx tsc --noEmit` en los mismos 2 errores preexistentes.

### 2026-09-03 (13) — Campus Virtual → aula.idesie.com; investigación de Flywire (sin activar nada)
- `components/header.tsx`: el enlace "CAMPUS VIRTUAL" (escritorio y menú
  móvil) pasa de `campusvirtual.idesie.com` a `https://aula.idesie.com/`.
  ⚠️ El mismo enlace antiguo sigue en `components/footer.tsx` — no se tocó,
  no formaba parte del encargo; si se quiere el mismo destino ahí, pedirlo.
- **Investigación de la integración de pagos Flywire**, a petición del
  cliente mientras consigue su clave de API — sin instalar nada, sin tocar
  código de pago, sin procesar ningún pago de prueba.
- 🔴 **Hallazgo no documentado hasta ahora**: `/checkout` y `/pago-directo`
  YA implementan Flywire Pay-by-Link (URL con `payment_destination=idesie`,
  ya con un portal/recipient dado de alta) — no es una integración desde
  cero. Detalle completo, incluida una discrepancia de parámetros sin
  verificar (`student_*` en el código vs. `sender_*` en la doc pública
  actual de Flywire), en §3 "Flywire — integración de pagos".
- Documentadas las 4 opciones de integración de Flywire (Pay-by-Link,
  Checkout, Payer Elements, API completa), evaluación para el flujo
  precio+matrícula (recomendación: seguir con Pay-by-Link, ya soporta
  pagos parciales vía `max_amount`/`items[...]`), auditoría del checkout
  actual, estructura de código propuesta (no creada) y qué webhooks hacen
  falta (Payment Status Notifications de Flywire, 7 estados, firma
  `X-Flywire-Digest` con un Shared Secret que se pide a Flywire por email).
- **Estado: pendiente, esperando que el cliente consiga la clave de
  API/Shared Secret de Flywire.** Nada activado, nada instalado.

### 2026-09-03 (12) — Consultoría BIM: rediseño propio "El Expediente"
- Encargo explícito de que esta página NO se pareciera a las de máster
  (nada de recorrido/movimientos, Roboto Mono+módulos, ni scroll horizontal
  anclado) — el público es empresa evaluando un servicio, no un estudiante.
  Auditoría previa, 2 variantes propuestas, cliente eligió Variante A.
- `page.tsx` deja de ser `"use client"` entero y gana `metadata` propia
  (título/canonical/OG) — antes heredaba los de la home. El carrusel de
  proyectos se aísla en `components/bim-consulting/projects-carousel.tsx`
  como único Client Component.
- Hero comprimido y asimétrico (texto izquierda sobre `gray-950`, foto en
  columna, cifras clave ya visibles); Servicios pasa de tarjetas con icono a
  lista con borde izquierdo (patrón ya existente en el sitio); "Por qué
  elegirnos" + cifras + mensaje de compromiso se funden en una sola franja
  `gray-950` con `StatCounter`; CTA final en `gray-950` con acento azul.
- Sección 3 (Proyectos Destacados, los 4 casos reales) mantenida en
  contenido y estructura — solo reskinada al mismo lenguaje visual.
- 🔴 2 bugs corregidos: enlace `/contacto` → `/contact-page` (404 real,
  confirmado con curl), imagen `senado-8.jpg` referenciada pero inexistente
  en disco (retirada del array, el proyecto se queda con sus 7 fotos reales).
- Animación con `Reveal`/`StatCounter` (Zona A, ya existentes en
  `components/home/`) — deliberadamente sin GSAP, la dirección pedía "sin
  espectáculo".
- Detalle completo en §5 "Consultoría BIM — rediseño propio 'El Expediente'".
- `npx tsc --noEmit` en los mismos 2 errores preexistentes, `npx next build`
  exit 0 con la ruta ahora estática (antes forzada dinámica por el
  `"use client"` de página completa).

### 2026-09-03 (11) — Header: sin barra secundaria, submenús con más carácter, Campus Virtual reubicado
- Fila de utilidades de escritorio (Empresas/Tienda/Contacto/carrito)
  eliminada por completo a partir de `lg`. Contacto pasó a CONOCE IDESIE,
  Tienda y Empresas a RECURSOS Y SERVICIOS (ahora en dos columnas). El
  carrito se queda siempre en la fila principal, nunca en un desplegable.
- Campus Virtual salió de dentro de un desplegable y pasó a ser un enlace de
  primer nivel (con `target="_blank"` + icono de salida), igual en escritorio
  y en el cajón móvil.
- Los tres desplegables (PROGRAMAS, RECURSOS Y SERVICIOS, CONOCE IDESIE)
  ganan una animación de apertura/cierre propia (fade + escala con rebote,
  `globals.css`, bloque "SUBMENÚS DEL HEADER"), pastilla+subrayado+flecha por
  opción al pasar el cursor, entrada escalonada, y en PROGRAMAS una jerarquía
  nueva (eyebrows en mono + tarjeta propia para Executive Education).
- 🔴 Bug encontrado y corregido en la propia verificación (no introducido por
  este encargo): los tres `<DropdownMenu>` no se cerraban entre sí — ahora
  comparten un único estado controlado.
- Detalle completo, decisiones y verificación en §5 "Reorganización del
  header: sin barra secundaria, submenús con más carácter".
- `npx tsc --noEmit` en los mismos 2 errores preexistentes, `npx next build`
  exit 0.

### 2026-09-03 (10) — Rediseño visual completo del blog: "Cuaderno de Bitácora Técnico"
- Listado (`/blog`) reconstruido: post más reciente destacado a tamaño
  grande, resto en lista compacta (`.bitacora-list-item`) en vez de un grid
  uniforme. Nueva fuente **Fraunces** (`app/layout.tsx`, `--font-fraunces`,
  solo se usa en el blog) para titulares, Roboto Mono para fecha/autor/tags.
- Artículo individual reconstruido con dos piezas nuevas: mini-índice
  lateral (`lib/extract-toc.ts` + `components/blog/article-toc.tsx`, extrae
  y enlaza los `<h2>`/`<h3>` del contenido ya sanitizado, con resaltado de
  sección activa por `IntersectionObserver` — mismo patrón que `AnchorNav`
  de la ficha de producto) y "Artículos relacionados" por etiquetas
  compartidas (`getRelatedPosts()` en `app/blog/actions.ts`). Si el
  artículo tiene menos de 2 encabezados no se muestra índice y el artículo
  ocupa una sola columna.
- Quinto vocabulario CSS propio: `.bitacora-*` en `globals.css`.
- 🔴 Bug de formato de fecha detectado (no introducido aquí): `getBlogPosts()`
  devuelve `created_at` en ISO crudo, a diferencia de sus funciones hermanas.
  No se cambió el contrato de la función (el sitemap y `getRelatedPosts()`
  necesitan el ISO) — se formatea solo en la presentación, con un
  `formatDate()` local en cada página. Detalle completo en §5.
- Verificado con 3 posts de prueba (largo con subsecciones anidadas, corto
  sin encabezados, y uno para relacionados por tag) creados y borrados en
  la sesión, sin tocar el post real del cliente (`holapio`). `pnpm build`
  exit 0, `npx tsc --noEmit` en 2 errores preexistentes (sin cambios).
- **Con esto se cierra el encargo completo de rediseño de tienda y blog**
  (ver también la entrada (9) y §5 "Tienda — rediseño visual completo").

### 2026-09-03 (9) — Rediseño visual completo de la tienda: "El Catálogo Técnico"
- Listado (`/tienda`) reconstruido: nuevos `components/tienda/producto-card.tsx`
  (ficha comparable, filas de dato con altura fija), `filtro-panel.tsx`
  (panel persistente, ya no badges flotantes), `catalogo-grid.tsx`
  (sustituye a `components/product-grid.tsx`, borrado). Hero simplificado,
  quitada la sección "Programas Destacados" duplicada y los 3 testimonios
  genéricos — decisión de diseño de la Dirección A aprobada, no un cambio
  de contenido de producto.
- Categoría real: nueva columna `productos.categoria`
  (`scripts/025_add_categoria.sql`), campo en el formulario de admin, filtro
  del catálogo comparando el campo real en vez de buscar substrings en el
  nombre del producto (lógica duplicada en dos archivos, ahora eliminada).
- Ficha de producto (`/producto/[slug]`) sin tabs: `components/producto-tabs.tsx`
  borrado, sustituido por `components/producto/` (`ficha-content.tsx` con
  las 7 secciones siempre montadas, `anchor-nav.tsx` con
  `IntersectionObserver`, `ficha-sidebar.tsx` con precio+CTA+nav en un único
  `<aside>` fijo). De paso, `getDirigidoA`/`getObjetivos`/`getRequisitos` en
  `app/producto/[slug]/page.tsx` se simplifican a listas planas de texto —
  antes aliasaban la misma columna como `titulo` y `descripcion` a la vez
  (mismo texto duplicado) o inyectaban un `tipo` inventado.
- 🔴 Bug encontrado y corregido en la propia verificación: la barra lateral
  no se quedaba fija — el grid estiraba el `<aside>` a la altura de toda la
  columna de contenido, dejando a `position: sticky` sin margen para
  flotar. Arreglado con `align-self: start`.
- Verificado con Chrome real, producto de prueba con las 7 tablas de
  detalle rellenas, creado y borrado en la sesión (cascada automática al
  borrar el producto). `pnpm build` exit 0, `npx tsc --noEmit` en 2 errores
  preexistentes, sin cambios.
- Siguiente paso: rediseño visual del blog (Dirección A — "Cuaderno de
  Bitácora Técnico"), mismo encargo, sin esperar aprobación aparte.

### 2026-09-03 (8) — Rediseño de tienda/blog: auditoría + prerrequisitos (seguridad, arquitectura, dato real de matrícula)
- Auditoría completa de `/tienda`, `/producto/[slug]`, listado y artículo
  del blog antes de tocar nada, con las mismas dos direcciones de diseño
  por sección que en rediseños anteriores. Aprobadas: "El Catálogo Técnico"
  para tienda, "Cuaderno de Bitácora Técnico" para blog. Detalle completo,
  con tracker de progreso, en §1 "Rediseño de tienda y blog — en curso".
- **2 exposiciones públicas de seguridad corregidas**, independientes del
  rediseño visual: el botón "Editar Artículo" del artículo de blog ahora
  exige `isAdminAuthenticated()` (antes lo veía cualquier visitante); el
  botón "Administración" del listado público del blog, eliminado por
  completo. Verificado con Chrome real que el gateo funciona en ambos
  sentidos (sin sesión no aparece, con sesión sí).
- **Sustituido el hack de precio de matrícula hardcodeado por slug** (4
  slugs fijos, importe de 3.000 € escrito en el código) por una columna
  real `productos.precio_matricula` — gestionable desde `/admin/tienda`,
  cualquier producto puede tenerla. Migración `scripts/024` incluye también
  el `UPDATE` para los 4 productos legado (inerte hoy, tabla vacía).
  Verificado con Chrome real creando un producto de prueba con el campo
  relleno.
- **`/tienda` convertida a Server Component**: antes pedía los productos con
  `useEffect` + `fetch`, sirviendo un spinner como único HTML inicial — sin
  `<h1>`, sin `<main>`, sin contenido real, invisible para cualquier
  rastreador. Ahora `app/tienda/page.tsx` es `async` y pasa los productos ya
  resueltos como prop. De paso, dos interfaces `Product` duplicadas y
  desincronizadas del tipo real se sustituyen por un único `import type`.
- Bugs menores corregidos de paso: enlace roto `/contacto` → `/contact-page`,
  `console.log` de depuración en la generación de URLs del blog.
- Verificado: `pnpm build` exit 0, `npx tsc --noEmit` baja de 4 a 2 errores
  preexistentes (dos de los cuatro eran del propio `tienda-client.tsx`,
  corregidos al arreglar el tipo `Producto`).
- **Nada del rediseño visual construido todavía** — este cambio es
  auditoría + los prerrequisitos de seguridad/arquitectura/datos pedidos
  explícitamente antes de tocar el diseño. Siguiente paso: rediseño visual
  de tienda (Dirección A), después blog.

### 2026-09-03 (7) — Primera pieza del panel de tienda: CRUD de producto base
- Construida la primera pieza grande de la ampliación de `/admin` aprobada
  en (6): CRUD completo de los campos base de `productos` (sin las 7 tablas
  de detalle todavía — son las siguientes piezas). Detalle completo,
  archivos nuevos y bugs encontrados en §1 "CRUD de producto base — detalle".
- Nuevo: `app/tienda/actions.ts` (Server Actions), `components/producto-form.tsx`
  (primer uso real de `react-hook-form` + `zod` en el proyecto),
  `components/productos-table.tsx`, `app/admin/tienda/` (listado, crear,
  editar), `app/api/productos/upload-image/route.ts`. `AdminHeader` y
  `/admin/dashboard` ampliados con tienda.
- Las páginas nuevas de tienda no llaman a `checkAdminAuth()` — dependen
  solo de `middleware.ts` (6), demostrando en la práctica que la protección
  automática funciona.
- **2 bugs reales encontrados y corregidos durante la propia verificación
  en navegador** (código nuevo de esta pieza, no reutilizado): un `z.union`
  mal ordenado convertía un precio original vacío en `0` en vez de `null`
  (Zod prueba las ramas en orden, y `Number("")` es `0`, válido para
  `.min(0)`); y la tabla de productos mostraba ese `0` como texto literal
  ("01234€") por el clásico problema de React con `{0 && <jsx>}`. Ambos
  arreglados y verificados creando, editando y borrando un producto de
  prueba real con Chrome (no solo `curl`, que no puede invocar Server
  Actions) — incluida la vista pública en `/producto/[slug]`.
- Anotado, no corregido por no ser parte de esta pieza: el mismo patrón sin
  `Boolean()` existe en `components/product-grid.tsx` y
  `app/producto/[slug]/page.tsx` (código previo a esta sesión) — inofensivo
  mientras "sin descuento" siga guardándose como `null`, que es lo que ahora
  garantiza el formulario nuevo.
- Verificado: `pnpm build` exit 0, `npx tsc --noEmit` sin subir de 4 errores
  preexistentes.
- Siguiente pieza, a construir tras revisión del cliente: editor de módulos
  + temas anidados.

### 2026-09-03 (6) — Auditoría del panel de admin para ampliarlo a tienda; middleware; 2 bugs de blog corregidos
- Encargo: ampliar `/admin` para gestionar también la tienda (productos +
  7 tablas de detalle), no solo el blog. Auditoría completa antes de tocar
  nada, estructura propuesta y aprobada. Detalle completo, con tracker de
  progreso, en §1 "Panel de administración — ampliación en curso".
- **2 bugs reales encontrados al auditar el CRUD de blog existente**, ambos
  corregidos como paso previo aislado (pedido explícito del cliente antes de
  construir nada nuevo):
  - `verifySecretKey()` en `app/blog/actions.ts` seguía comparando
    `password_hash` en texto plano — la migración a bcrypt de la sesión
    anterior (4) solo tocó el login, no esta segunda copia duplicada de la
    misma comparación. Efecto: crear/editar/borrar posts habría empezado a
    fallar en cuanto un admin real iniciara sesión. Extraído a
    `lib/admin-secret.ts` (`verifyAdminSecret`), única implementación
    compartida ahora por login y Server Actions.
  - `components/blog-posts-table.tsx` llamaba a
    `deleteBlogPost(slug, secretKey)` con dos argumentos posicionales; la
    función espera un único `FormData`. Era el error `TS2554` que se venía
    arrastrando como "preexistente" desde el principio de la sesión — no
    era solo un aviso de tipos, el botón de borrar del panel estaba roto de
    verdad. Corregido construyendo el `FormData` y manejando el
    `ActionResult` devuelto (la función no lanza excepción, devuelve
    `{success, message}`).
  - Verificado de extremo a extremo con Chrome real (no solo curl, que no
    puede invocar Server Actions): login con una fila de prueba → crear un
    post de prueba → aparece publicado en `/admin/posts` → borrarlo desde la
    UI → confirmado que desaparece. Fila de admin y post de prueba borrados
    al terminar.
- **Añadido `middleware.ts`** protegiendo `/admin/*` automáticamente (salvo
  `/admin/login`) — antes la protección era manual con `checkAdminAuth()`
  en cada `page.tsx`, el fallo más fácil de cometer al añadir una página
  nueva. Verificado que no rompe nada existente: `/admin/login` sigue
  accesible sin cookie (200), `/admin/dashboard` y `/admin/posts` sin cookie
  redirigen 307 a `/admin/login` (antes de que el Server Component llegue a
  ejecutarse), y con cookie válida responden 200 igual que antes. Las
  páginas de blog conservan su `checkAdminAuth()` como red redundante; las
  páginas nuevas de tienda no lo necesitan.
- Verificado: `pnpm build` exit 0 (con el middleware listado en el output),
  `npx tsc --noEmit` baja de 5 a 4 errores preexistentes (el `TS2554` era
  uno de ellos).
- **Nada de tienda construido todavía** — este cambio es solo la auditoría,
  la estructura aprobada, y los dos arreglos aislados pedidos antes de
  construir. La primera pieza grande (CRUD de producto base) es el
  siguiente paso, a revisar en el navegador antes de continuar con las
  tablas de detalle.

### 2026-09-03 (5) — Rotación de claves de Supabase pospuesta a propósito
- Decisión explícita del cliente: **no rotar todavía** la `anon key` ni la
  `service_role key` expuestas en una sesión anterior (ver §0). Se espera a
  cerrar por completo el trabajo de base de datos pendiente (insertar los
  productos reales, verificar los slugs de compra de §2, cualquier otro
  ajuste en Supabase) para no generar credenciales nuevas a mitad de un
  trabajo que todavía usa las actuales activamente.
- **No es una tarea olvidada** — marcado así explícitamente en §0, §3 y §4
  para que ninguna sesión futura la trate como un pendiente sin explicación
  ni insista en completarla antes de tiempo.
- Reconfirmados items 1-5 de la sesión anterior (bcrypt en `admin_users`,
  auth en `/api/blog/upload-image`, borrado de `/api/migrate-blog`, icono de
  `admision-section.tsx`, limpieza de la nota obsoleta de EMBIM/Online) —
  todos seguían aplicados, sin regresión.
- Verificado de nuevo: `pnpm build` exit 0, `npx tsc --noEmit` 5 errores
  preexistentes (sin cambios).

### 2026-09-03 (4) — Contraseñas de admin a bcrypt; `/api/blog/upload-image` protegido; limpieza
- **Seguridad, prioridad crítica pedida explícitamente por el cliente:**
  - `app/api/admin/auth/route.ts` deja de comparar `password_hash` en texto
    plano y pasa a `bcryptjs` (coste 12), con migración perezosa de las filas
    heredadas — cada admin migra su propia contraseña la próxima vez que
    inicia sesión, sin script aparte ni dejar a nadie fuera del panel.
    Detalle completo de la estrategia y la verificación en §4, "Migración a
    bcrypt".
  - `app/api/blog/upload-image/route.ts` ahora exige `isAdminAuthenticated()`
    — antes cualquiera podía subir archivos a Vercel Blob sin autenticarse.
    Verificado con `curl` sin cookie → 401.
- **Limpieza sin bloqueo:**
  - Borrado `app/api/migrate-blog/` (archivo de 0 bytes que rompía
    `npx tsc --noEmit`).
  - `components/admision-section.tsx:93` — el botón "formulario de admision"
    (enlaza a `/application`, una página) usaba el icono `<Download/>`;
    cambiado a `<ArrowRight/>`, coherente con "ir a una página" en vez de
    "descargar un archivo".
  - Limpiada la fila desactualizada de §2 "EMBIM y MBIM Online sin
    rediseñar" — ambos ya se rediseñaron en sesiones anteriores (7
    movimientos y "La Red" respectivamente); era un residuo del documento.
- Verificado: `pnpm build` exit 0 (46 rutas, una menos por
  `/api/migrate-blog`), `npx tsc --noEmit` baja de 6 a 5 errores
  preexistentes (ninguno de este trabajo).
- Dependencia añadida: `bcryptjs` (JS puro, sin compilación nativa).

### 2026-09-03 (3) — Auditoría SEO técnica completa; corregidos los hallazgos críticos y altos
- Auditoría en dos fases: primero un listado de hallazgos con prioridad
  (sin tocar código), después aplicación de lo aprobado por el cliente.
  Detalle completo, con tabla antes/después de cada corrección, en §2
  "SEO técnico".
- **Canonical roto** en `/tienda`, `/producto/[slug]` y `/mbim-online-page`
  (apuntaban a la home) — corregido en los tres. `/tienda` pasó de un único
  Client Component a `page.tsx` (Server, con `metadata`) +
  `tienda-client.tsx`, mismo patrón que ya usan `mbim-online-page`/
  `in-company-page`. `/producto/[slug]` gana `generateMetadata()`.
- **Open Graph de MBIM/MBBE/EMBIM/Online** completado (`og:image`,
  `og:type`, `og:locale`, `og:site_name`, que Next.js no hereda del layout
  raíz cuando una página declara su propio `openGraph`) — **sin tocar el
  texto de título ni descripción**, a petición explícita del cliente.
  Añadido también a `/landing`.
- Creadas `public/images/og-image.jpg` y `twitter-image.jpg` (no existían
  en disco pese a estar referenciadas en el layout raíz) — copia de
  `hero-background.jpg`, la misma imagen que ya usa la home como OG.
- **Sitemap reescrito**: URLs de blog ahora usan `generatePostUrl()` (antes
  generaban `/blog/{slug}`, una ruta que no existe y que desde el fix del
  redirect de la sesión anterior hace 308 a `/blog` — cada post enviado a
  Google era un enlace roto); quitada la entrada `/mdee-page` (página que no
  existe); añadidas las fichas de producto activas.
- Activados `components/course-schema.tsx` y `components/faq-schema.tsx`
  (existían, bien construidos, pero no los importaba ninguna página) en las
  4 páginas de máster — precio y duración tomados de lo que cada FAQ ya
  muestra, sin inventar ningún dato nuevo.
- `LocalBusiness`: quitado `servesCuisine: "Education"` (propiedad de
  `Restaurant` copiada por error). `aggregateRating` (4,8/150) se mantiene:
  el cliente confirmó que son datos reales de encuestas internas.
- Quitado el hreflang roto (`en-US: /en`, 404 — no hay versión en inglés) y
  el placeholder `google-site-verification: "your-google-verification-code"`
  que se servía tal cual en producción.
- **Borrada `/ejemplo`** por completo — página de pruebas sin consumidores
  que además competía por las mismas keywords que `/mbim-page`.
- 🔴 **`/landing` — corrección de rumbo a media sesión**: la primera pasada
  trató la falta de enlaces internos hacia `/landing` como un bug y llegó a
  enlazarla desde el footer. El cliente paró esto explícitamente: es una
  página **solo para tráfico de campañas de pago**, debe quedar fuera de
  todo rastreo. Revertido el enlace del footer; añadidos `noindex`/`nofollow`
  en su metadata, `Disallow: /landing` en `robots.txt`, y confirmado que
  sigue sin estar en el sitemap ni tener ningún enlace interno. Las 4 piezas
  documentadas juntas en §2 para que nadie la "arregle" por error en el futuro.
- Verificado: `pnpm build` exit 0 (47 rutas), `npx tsc --noEmit` 6 errores
  (antes 7, ninguno de este trabajo), los 4 JSON-LD renderizan correctamente
  (Chrome headless real, no solo curl), Lighthouse contra producción sin
  regresión en las 7 páginas tocadas.
- Pendiente para otra pasada (medio/bajo de la auditoría, no crítico): LCP
  alto (3–4,3 s en todas las páginas, umbral bueno ≤2,5 s — recomendación:
  ya se remidió tras estas correcciones sin cambio significativo, así que no
  hay urgencia añadida por este trabajo; si se aborda, empezar por
  `/mbim-page`), JSON-LD inyectado solo en cliente en vez de en el servidor,
  `/tienda` sin encabezados ni `<main>`, cross-linking pobre entre páginas
  de máster y del blog hacia ellas, accesibilidad menor.

### 2026-09-03 (2) — Esquema real ejecutado en Supabase; verificado con datos reales; 4 bugs de runtime corregidos
- Instalado `psql` (`brew install libpq`, keg-only en
  `/opt/homebrew/opt/libpq/bin`) para poder ejecutar DDL — `@supabase/supabase-js`
  no puede correr `CREATE TABLE` por su API REST. No se añadió `pg` como
  dependencia del proyecto, sigue siendo una herramienta externa.
- Ejecutados `scripts/020` a `023` contra el proyecto real de Supabase (leyendo
  `DATABASE_URL` de `.env.local`, nunca impresa). Las 15 tablas existen.
  Verificado por consulta directa a `pg_class`/`pg_policies`: RLS activo en
  las 15, exactamente 9 policies de solo lectura pública, todas donde debían
  estar. Detalle en §3.
- **Probado con datos reales de extremo a extremo** (fila de prueba →
  verificación por HTTP → borrado inmediato, en los cuatro flujos): lead vía
  `/api/leads`, ficha de producto en `/producto/[slug]`, listado/detalle/tag
  del blog, login + dashboard de `/admin`. No queda ningún dato de prueba en
  ninguna tabla.
- **4 bugs de runtime descubiertos y corregidos al hacer esa verificación**
  (invisibles en modo mock porque el mock nunca pasa por una petición HTTP
  real): el redirect `/producto/:path*` → `/tienda` y su gemelo
  `/blog/:slug+` → `/blog` atrapaban rutas reales de varios segmentos;
  `params` sin `await` en cuatro páginas dinámicas (`producto/[slug]`,
  `blog/[year]/[month]/[day]/[slug]`, `blog/tag/[tag]`,
  `admin/posts/edit/[slug]`); `cookies()` sin `await` en `lib/admin-auth.ts`
  (dejaba **todo `/admin` roto en runtime**, no solo un aviso de tipos); y
  `.contains()` sobre la columna `jsonb` de tags del blog, que generaba SQL
  inválido. Detalle completo, causa de cada uno y por qué el mock no los
  detectaba, en §2.
- `pnpm build` verificado con credenciales reales de Supabase — exit code 0,
  48 rutas generadas sin error (antes solo se había verificado en mock).
- ⚠️ **Rotación de la `anon key` y `service_role key` expuestas en la sesión
  anterior: pasos entregados al cliente, pendiente de completar en el panel
  de Supabase** — no se puede automatizar desde aquí. `DATABASE_URL` no
  formaba parte de la exposición original.
- En ningún momento se imprimió ni se guardó en ningún archivo la connection
  string ni ninguna clave real — toda inspección de `psql` pasó por variables
  de entorno cargadas en el shell (`source .env.local`, nunca en un comando
  visible) y por un filtro `sed` de redundancia sobre cualquier salida.

### 2026-09-03 (1) — Neon retirado por completo; migración a Supabase terminada
- **Cero referencias a Neon en el código** (verificado con `grep -rniI neon`
  sobre todo `app/`, `components/`, `lib/`, `scripts/`, `package.json`).
  Detalle completo, tabla de qué sustituye a qué, y las decisiones de
  compatibilidad confirmadas antes de migrar, en §0 y §3.
- Migrados a Supabase: `app/blog/actions.ts`, `app/api/admin/auth/route.ts`,
  `app/api/blog/latest/route.ts`, `app/api/productos/route.ts`,
  `app/producto/[slug]/page.tsx` (incluidas 6 tablas de detalle que no
  estaban en el primer paso de la migración), `lib/applications-db.ts`.
  Borrados por no tener consumidores reales: `lib/db-helpers.ts` (pedidos),
  `lib/sql.ts` (ya no envolvía nada), 5 scripts de diagnóstico manual contra
  Neon (`scripts/002` a `007`, salvo los ya numerados de otras cosas).
- Nuevo esquema `scripts/023_producto_detalle_tables.sql` (7 tablas que la
  ficha de producto necesitaba y no se habían creado en el primer paso).
- `@neondatabase/serverless` eliminado de `package.json`. `DATABASE_URL` y
  `POSTGRES_URL` eliminadas de `env.example` — ya no las necesita nada.
  `lib/mock-mode.ts` simplificado a una sola llave de mock
  (`SUPABASE_SERVICE_ROLE_KEY`) para blog/admin/tienda/`applications`/leads,
  a petición explícita del cliente.
- Verificado en modo mock: blog, tienda, `/api/admin/auth` (503, nunca
  simula sesión válida), `applications`, leads — los cinco con el mismo
  comportamiento que antes de migrar. `pnpm build`: exit code 0, sin ninguna
  mención a Neon en la salida.
- Efecto colateral: 12 de los ~20 errores preexistentes de `npx tsc --noEmit`
  desaparecieron (el tipado más estricto de Supabase frente al `Record<string,
  any>` de la vieja `sql.ts` obligó a corregir mapeos de tipo que antes
  pasaban desapercibidos). Quedan 8, ninguno relacionado con esta migración.
- ⚠️ **Hallazgo no relacionado con Neon, no corregido:** a media sesión
  aparecieron credenciales reales de Supabase en `.env.local` sin que nadie
  las pegara — probablemente aprovisionamiento automático de la plataforma.
  Permitió confirmar que la conexión llega a un proyecto real, pero ese
  proyecto no tiene ninguna tabla creada todavía. Detalle completo,
  incluida una exposición accidental de las claves en la salida de una
  herramienta durante el diagnóstico, en el aviso de sesión de §0.
- ⚠️ **Hallazgo no relacionado con Neon, no corregido:** `next.config.mjs`
  tiene un redirect `/producto/:path*` → `/tienda` que deja la página de
  producto real inalcanzable por navegación normal. Ver §2.

### 2026-09-02 (7) — Supabase montado; leads reales; build de producción arreglado
- **Primer servicio del proyecto migrado de Neon a Supabase de verdad**:
  los leads (`/api/leads`, formulario de `/landing`). Detalle completo en
  §3 "Supabase — esquema, RLS y leads" y en §0 (estado de la migración).
- Instalado `@supabase/supabase-js` y `server-only`. Nuevos:
  `lib/supabase/server.ts` (cliente `service_role`, perezoso, marcado
  server-only), `lib/supabase/browser.ts` (cliente `anon`, sin consumidores
  todavía), `lib/leads-db.ts`, `app/api/leads/route.ts`.
- Esquema completo creado en Supabase para el resto del proyecto
  (`scripts/020` a `022`): `leads` (nueva), `productos` (pendiente desde la
  decisión de migrar), y el puerto de `blog_posts`/`admin_users`/
  `applications`/`orders`/`order_items`/`coupons` que ya existían en Neon.
  RLS activado en las siete: sin policies públicas salvo lectura de
  `productos` activos y `blog_posts` publicados — todo lo demás, exclusivo
  de `service_role`. **El código de esas seis tablas heredadas sigue
  leyendo de Neon** — crear el esquema no migró el código, es un paso
  siguiente, deliberadamente fuera de esta sesión.
- Resend para el email de confirmación de leads **queda en modo mock a
  propósito** (no hay `RESEND_API_KEY` todavía) — reutiliza el cliente que
  ya existía (`lib/resend.ts`), sin mecanismo nuevo. Activar el envío real
  cuando llegue la clave no requiere tocar código, solo añadir la variable.
- ⚠️ Las credenciales de Supabase de esa sesión llegaron como placeholders
  sin rellenar (`[pega aquí...]` literal), no como valores reales — todo se
  verificó en modo mock; **la inserción real contra un proyecto Supabase
  nunca se ha probado**. Ver el aviso completo en §0.
- **Arreglado, como efecto colateral necesario para poder verificar con
  `pnpm build`, el bug de build ya documentado en §0**: siete sitios
  invocaban `getSql()`/`getProductsSql()`/`getResend()` a nivel de módulo
  (cuatro con Neon, tres con Resend — los tres de Resend no estaban
  documentados antes porque el build fallaba primero en Neon y nunca
  llegaba a ese punto). `pnpm build` termina ahora con exit code 0.
- `env.example`/`env.local` actualizados con las tres variables de Supabase,
  documentadas y sin valores. Confirmado: no existe ningún `.env.local` con
  credenciales reales en el proyecto.

### 2026-09-02 (6) — Ajustes a /landing: hero, sin header, más dinamismo, sin precio, CTAs a formulario
- Resumen de los 5 cambios pedidos sobre la primera versión de `/landing`:
  hero reescrito y apilado (vídeo debajo del titular), página sin el
  `Header` del sitio, animaciones más intensas en toda la página, precio
  retirado de las tarjetas de máster, y todos los CTAs abriendo
  `InfoRequestModal` (el formulario que en la entrada siguiente se conecta a
  Supabase). Detalle completo, incluidas las dos decisiones de criterio
  propio (footer conservado, enlaces informativos en línea no convertidos a
  CTA), en §5 "Ajustes tras la primera versión".

### 2026-09-02 (5) — Nueva página /landing, venta de los 4 másteres
- Página nueva (no un rediseño), pedida explícitamente en `/landing`.
  Estructura de 6 secciones fijada por el cliente. Detalle completo,
  incluida la tabla de huecos pendientes, en §5.
- **Contiene contenido placeholder a propósito** (vídeo del hero, 3 vídeos +
  citas + nombres de testimonios, precio del Máster BIM Online sin
  confirmar) — instrucción explícita del cliente de no inventar ni buscar
  contenido real todavía. Ver la tabla de huecos en §5 antes de publicar.
- Todo lo demás (precios/duraciones de MBIM/MBBE/EMBIM, acreditación,
  financiación) es real, verificado contra el contenido ya existente del
  proyecto — fuente anotada junto a cada dato en `landing-content.ts`.
- Detectada y evitada una imprecisión ya existente en el sitio: el metadata
  de `app/page.tsx` y `nuestra-metodologia-page` dice "100 % empleabilidad",
  pero contradice las cifras reales por programa (MBIM 95 %, MBBE 100 %
  verificado, EMBIM y Online sin cifra). No se propaga esa frase aquí.
- `npx tsc --noEmit`: se mantiene en 21 errores preexistentes, ninguno nuevo.

### 2026-09-02 (4) — In Company, rediseño propio "El Plano"
- Nueva identidad para `/in-company-page` (servicio B2B, nunca perteneció a
  la familia de másteres). Detalle completo en §5. Componentes en
  `components/in-company/`, contenido en `in-company-content.ts`, CSS en el
  bloque "IN COMPANY — EL PLANO" de `globals.css`. Página dividida en
  `page.tsx` (server, metadata) + `in-company-client.tsx`.
- Auditoría previa detectó y resolvió: CTA del hero roto (`/contact` → 404),
  dos secciones con contenido duplicado consolidadas en una, y una cifra real
  ("+50 empresas") que solo vivía en el `metadata` y nunca se mostraba al
  visitante. Se descartó explícitamente inventar logos de clientes o casos de
  éxito, al no existir ninguno real para este servicio en el proyecto.
- `npx tsc --noEmit`: se mantiene en 21 errores preexistentes, ninguno nuevo.

### 2026-09-02 (3) — Máster BIM Online, rediseño propio "La Red"
- Nueva identidad visual y narrativa para `/mbim-online-page`, a petición
  explícita del cliente de que las 4 páginas de máster no compartan un mismo
  molde. Detalle completo en §5. Componentes en `components/mbim-online/`,
  contenido en `mbim-online-content.ts`, CSS en el bloque "MÁSTER BIM ONLINE
  — LA RED" de `globals.css`.
- Auditoría previa detectó y resolvió: tres precios contradictorios (FAQ vs.
  compra), estado ambiguo de la certificación Cualificam, acreditación
  Cualificam/ENQA/EQAR ausente pese a estar prometida en la FAQ, y el enrutado
  `?motivo=` que nunca llegó a esta página pese a estar documentado como
  hecho. Queda señalado y sin resolver: los roles de salida de este máster no
  coinciden entre esta página y `comparativa-masters-page`.
- `npx tsc --noEmit`: se mantiene en 21 errores preexistentes, ninguno nuevo.

### 2026-09-02 (2) — retirado el breadcrumb
- **`BreadcrumbNavigation` quitado de las 18 páginas que lo usaban**, a petición
  del cliente. El componente se conserva sin usarse (ver §5, «Rutas API»).
  `npx tsc --noEmit`: 22→21 errores (uno menos, por un uso con props que no
  existían en `/ejemplo`).

### 2026-09-02 — header rediseñado
- **Header rediseñado como pastilla flotante de cristal** (§5). Las dos filas de
  siempre pasan a vivir dentro de una sola superficie `.glass-nav` con margen,
  esquinas redondeadas, `backdrop-filter` y borde de 1px. **Cero cambios de
  navegación**: mismos enlaces, mismos desplegables, mismo carrito. Afecta a las
  **26 páginas públicas** de una vez, porque `Header` es compartido.
- **La opacidad se fijó midiendo, no a ojo.** El encargo pedía 10-20 %; a esa
  transparencia el menú da 3,1:1 sobre las bandas `gray-950` del M3/M6. Se usa
  **0,72 en reposo y 0,85 con scroll**, que es el mínimo que cumple AA.
- **El menú deja de ponerse azul en `:hover`** y pasa a un lavado `bg-brand/10`.
  Ni el azul de marca ni el fuerte llegan a AA sobre el cristal en reposo, y
  mantenerlos habría obligado a subir el tinte a 0,84.
- Nuevos scripts: `contrast-nav.mjs`, `perf-nav-glass.mjs`, `shot-header.mjs`.
  `measure-header.mjs` adaptado para macOS/Linux (tenía la ruta de Chrome de
  Windows fija) y ahora mide la pastilla, no las filas.
- **`--header-height` recalibrado: 101→70px en móvil y 146→127px en escritorio.**
  No es solo por el rediseño: **el logo declaraba `150×30` cuando el PNG es
  `464×315`**, y el `height:auto` del preflight lo estiraba a 102px de alto. Se
  añade `logo_idesie_azul_trim.png` (343×123, sin el 63 % de lienzo vacío) **solo
  para el header**; el resto del sitio sigue con el original.
- Rendimiento medido, no supuesto: **mediana de 16,7 ms por fotograma con y sin
  cristal** (CPU frenada 6×). Verificados también los cuatro modos de
  accesibilidad (`prefers-reduced-transparency`, `prefers-contrast`,
  `prefers-reduced-motion` y navegadores sin `backdrop-filter`).
- El listener de scroll pasa a **pasivo** y el umbral baja de 100px a 12px.
- **Entorno:** `node_modules` estaba a medias (árbol `.pnpm` presente pero sin
  los enlaces de nivel superior, típico de un zip que pierde symlinks) y pnpm no
  estaba instalado. Reinstalado desde el lockfile. Añadido `pnpm-workspace.yaml`
  para autorizar la compilación de `sharp` (ver §6).
- ⚠️ **Detectado, no arreglado:** en las páginas de programa el `<main>` no
  reserva hueco bajo el header, así que el breadcrumb queda parcialmente tapado.
  Es previo al rediseño — antes quedaba oculto del todo; ahora asoma por el
  hueco superior. Se deja como está para no tocar el layout de esas páginas sin
  encargo.

### 2026-09-01
- **Auditoría completa de enlaces de `/mbim-page`** (10 rotos: 5 propios, 5 del header).
- **Decidido migrar de Neon a Supabase.** Todo lo que dependa de datos reales
  queda en pausa.
- Arreglado: breadcrumb "Programas" (5 páginas); `/asesoria-online` y
  `/solicitar-clase-online` → `/contact-page?motivo=…`; ocultos ES/EN y "Media".
- Añadido soporte de `?motivo=` y `?programa=` en la página de contacto.
- Verificado en `pnpm dev`: las 9 rutas afectadas responden 200 y el HTML
  renderiza los destinos correctos.
- **Rediseño de `/mbim-page`**: de 13 secciones apiladas a 7 movimientos.
  Nuevos `components/programa/` (8 componentes reutilizables), contenido
  extraído a `app/mbim-page/mbim-content.ts`, bloque de CSS "Recorrido de
  programa" al final de `globals.css`. **Cero dependencias nuevas.**
- La página pasa de Client a **Server Component** → ahora exporta `metadata`
  propia, que antes no tenía (heredaba la del layout).
- Corregido: el hero usaba `mbim_online_hero.jpg` (la foto del máster online)
  en la página del presencial. Ahora usa `mbim-hero-new.jpg`.
- **Segunda pasada de acabado sobre `/mbim-page`.** Se levanta la restricción de
  0 KB y se instala **`gsap` 3.15.0** (core + ScrollTrigger + SplitText).
  Motivo principal: `animation-timeline` dejaba sin animación a ~16 % de los
  visitantes. Nueva infraestructura: `lib/gsap.ts`, `hooks/use-gsap-effect.ts`,
  `hooks/use-magnetic.ts`, `components/programa/motion-root.tsx`,
  `components/programa/experience-band.tsx`.
  Añadidos: pin + scroll horizontal en el M3, barra de progreso de lectura,
  cursor personalizado, CTA magnéticos, botones con relleno por barrido,
  acordeón con apertura real, superficies con esquina cortada y sombra teñida.
  **Pendiente de validar en navegador con el cliente:** si el pin del M3 o el
  cursor no encajan, ambos son reversibles borrando un bloque.
- Pin del M3 acortado en dos pasos a petición del cliente: `1.5` → `0.8` → `0.5`,
  con `scrub` de `1` → `0.35`. Rediseño del MBIM **aprobado**.
- **`/mbbe-page` migrada a los 7 movimientos**, reutilizando los componentes sin
  crear ninguno nuevo. Añadido `app/mbbe-page/mbbe-content.ts`.
  Dos cambios en componentes compartidos, ambos retrocompatibles:
  `ModuleJourney` gana **pin condicional** (5 módulos caben en pantalla ancha) y
  `ExperienceBand` pasa a recibir `programa` por prop en vez de tener MBIM fijo.
  Auditoría previa: **el MBBE no tenía ningún enlace roto** — los arreglos de la
  Parte 1 ya lo cubrían.
- El cliente **confirma que el 100 % de empleabilidad del MBBE está verificado**
  con su base de datos de convenios. Usable como cifra grande sin reservas.
- **M4 rediseñado** («El reloj partido»), a petición del cliente tras revisar el
  MBBE: el díptico simétrico oscuro se sustituye por uno **asimétrico 58/42 con
  contraste tonal**. Nuevo token de marca **`--color-paper`**, documentado como
  reutilizable (no local al componente). Solo se tocaron `split-day.tsx` y su
  CSS; **ningún texto cambió**. Afecta también al MBIM, que comparte componente
  — comprobado que renderiza bien en ambos.
- M4 compactado en una segunda iteración y **eliminadas las horas 08:00/15:00**
  (el cliente las consideró decorativas). El ancla de cada mitad pasa a ser su
  rótulo. Clases nuevas reutilizables: `.journey-title-sm` y `.journey-label`.
- **M5 reconstruido**: se recupera la acreditación completa que la migración
  había perdido (logo Cualificam, Madri+d, ENQA/EQAR, 3 sellos), se elimina la
  foto recortada de 1,77 MB y se compacta la sección. Aplicado a MBIM y MBBE a
  la vez, por ser componente compartido.
  ⚠️ El cliente reportó esto como un fallo del EMBIM, pero en ese momento **el
  EMBIM aún no se había migrado**: el contenido perdido estaba en MBIM y MBBE.
  Conviene confirmar los nombres de página antes de dar por buena una incidencia.
- M1 y M5 compactados (altura del hero de `100vh` a `38rem` máx.; nueva clase
  `.journey-hero-title` para no encoger las cifras del M2/M6).
- **`/embim-page` migrada a los 7 movimientos.** Añadido `embim-content.ts`.
  `Outcomes` gana el campo opcional `unidad` (retrocompatible) para la tarifa
  diaria del consultor freelance. M4 reencuadrado y M6 sin cifra de
  empleabilidad, ambos por decisión explícita del cliente.
- **Arreglado un logo roto en toda la web:** `components/header.tsx`,
  `components/footer.tsx`, `embim-page` y `mbim-online-client` apuntaban a
  `/images/design-mode/logo_idesie_azul%281%29…png`. El nombre del archivo
  contiene literalmente los caracteres `%28`, que el navegador reinterpreta como
  codificación URL: la petición devolvía **HTTP 400** y el logo del header no se
  veía en ninguna página. Ahora usan `/images/logo_idesie_azul.png`.
  ⚠️ **`public/images/design-mode/` contiene 90 archivos, 74 con `%28` en el
  nombre. Ninguno es servible por HTTP.** Ya no hay código que los referencie,
  pero conviene borrar la carpeta cuando el cliente lo confirme.
