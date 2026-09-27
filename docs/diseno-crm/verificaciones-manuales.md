# Verificaciones manuales (lo que NO se puede comprobar desde la base de datos)

Complementa a `verificacion-produccion.sql` (que responde a lo que sí está en la BD) y al apéndice «⚠️ POR VERIFICAR» de `docs/diseno-crm.md`. Cada punto indica **qué comprobar**, **dónde exactamente** y **qué respuesta necesito**.

> **Sobre las rutas de los paneles:** Supabase, Vercel, Resend, Calendly, Meta y Flywire reorganizan sus menús con frecuencia. Lo que pongo en «Dónde» es la ruta habitual a fecha de hoy; si no la encuentras, usa el buscador del panel con la palabra clave en **negrita**. Donde no estoy seguro del nombre exacto de una sección, lo digo.

**Índice**

| Bloque | Puntos del apéndice que cubre |
|---|---|
| A. Supabase (panel) | #5, #6 y parte de #9 |
| B. Vercel | #5 (Cron), doble proyecto, entornos |
| C. Calendly | #8 |
| D. Resend y DNS | #10 |
| E. Flywire | #14 |
| F. Meta y otros scripts de la web | #5 (medición), cookies |
| G. Equipo | #9 |
| H. Plazos legales y RGPD | #13 |
| I. Comprobaciones en el repositorio (sin BD) | #11, #12 |
| J. Lo que ya cubre el SQL (para no duplicar) | #1–#5, #7, #15 |

---

## A. Supabase (panel)

| # | Qué comprobar | Dónde | Respuesta que necesito |
|---|---|---|---|
| A1 | **Plan** del proyecto (Free/Pro/Team) y límites | Organización → **Billing** → *Subscription* (y *Usage* del proyecto) | Nombre del plan. Determina *branching*, PITR, cuota de Realtime y conexiones |
| A2 | **Región** del proyecto | Project Settings → **General** (campo *Region*) | Región exacta (p. ej. `eu-west-1`). Necesaria para la política de privacidad (transferencias internacionales) y para elegir la región de Vercel |
| A3 | **Copias de seguridad**: frecuencia, retención, ¿PITR activado? | **Database → Backups** (pestañas *Scheduled backups* y *Point in time*) | Cuántos días de retención y si hay PITR. Sirve para el procedimiento de supresión (los backups caducan) y para la regla «copia antes de un `DROP`» |
| A4 | **Realtime**: cuota de conexiones y mensajes del plan | Docs de Supabase → *Realtime → Limits* (por plan) y **Reports → Realtime** en el panel | Límite de conexiones concurrentes y mensajes/segundo de tu plan. Con un equipo pequeño casi seguro sobra; confírmalo |
| A5 | **Realtime: publicación** actual | Lo devuelve `verificacion-produccion.sql` (sección `10_realtime_publicacion`) | — (ya cubierto) |
| A6 | **Branching** disponible | **Branches** en el menú del proyecto (ó Project Settings → **Branching**) | Sí/No. Si no, hay que crear un segundo proyecto de staging (decisión #18) |
| A7 | **Pooler (Supavisor)**: cadena de conexión y formato de usuario | Botón **Connect** (arriba) → pestaña *ORMs*/*Connection string* → modo **Transaction pooler** (puerto **6543**). También **Project Settings → Database → Connection pooling** | Copia (sin contraseña) el formato de la cadena: host, puerto y formato del usuario (`postgres.<project-ref>`). Confirma que el modo *Transaction* está disponible y el *pool size* / máximo de clientes |
| A8 | **IPv4/IPv6**: ¿la conexión directa es solo IPv6? ¿hace falta el add-on IPv4? | Botón **Connect** (aviso «Not IPv4 compatible») y **Project Settings → Add-ons** | Si Vercel puede llegar por el pooler (el pooler sí es IPv4). Se prueba de verdad más abajo (A9) |
| A9 | **Prueba de conectividad del rol `web_app`** desde Vercel | Se puede probar **después** de crear el rol (fase 1) con un Preview de prueba o `psql` desde tu máquina | Que `select 1` funciona con `postgres://web_app.<ref>:<clave>@<host-pooler>:6543/postgres` y con `prepare: false`. Sin esto no se empieza la fase 3 |
| A10 | **Data API: esquemas expuestos** | Project Settings → **API** → *Exposed schemas* (o *Data API Settings*). El SQL también lo muestra (rol `authenticator`, sección `09_roles`, `config=pgrst.db_schemas`) | Lista de esquemas expuestos hoy. Objetivo del diseño: solo `crm` |
| A11 | **Auth: registro abierto** | **Authentication → Sign In / Providers** (opción *Allow new users to sign up*) | Debe estar **desactivado** antes de crear el primer usuario del CRM (si no, cualquiera puede registrarse; las policies del CRM lo bloquean, pero no se debe dejar abierto) |
| A12 | **Auth: MFA** | **Authentication → Multi-Factor** (TOTP) | Confirmar que TOTP está disponible/activado en tu plan |
| A13 | **Auth: correo saliente** | **Authentication → Emails → SMTP Settings** | ¿Hay SMTP propio? El de Supabase por defecto tiene límites muy bajos y sirve solo para pruebas; para invitaciones a usuarios del CRM conviene el mismo dominio verificado de Resend |
| A14 | **Auth: URL del sitio y redirecciones** | **Authentication → URL Configuration** | El dominio final del CRM (p. ej. `crm.idesie.com`) para *Site URL* y *Redirect URLs* |
| A15 | **Extensiones disponibles en tu plan** (`pg_cron`, `btree_gist`, `pg_net`) | Lo devuelve `verificacion-produccion.sql` (`08_extensiones_relevantes`). Si aparece `disponible=NO`, ver **Database → Extensions** | — (ya cubierto por el SQL; el panel solo confirma) |

---

## B. Vercel

| # | Qué comprobar | Dónde | Respuesta que necesito |
|---|---|---|---|
| B1 | **Hay dos proyectos** conectados al mismo repositorio (`web-idesie` y `web-idesie-q5vc`): ¿cuál es el real y para qué sirve el otro? | Vercel → **Team → Projects**; en cada proyecto: **Settings → Git** y **Settings → Domains** | Qué proyecto sirve `idesie.com` y qué hacer con el otro (borrarlo, o es un duplicado de pruebas). Las variables nuevas hay que ponerlas en el correcto |
| B2 | **Variables de entorno actuales** por entorno | Proyecto → **Settings → Environment Variables** | Qué existe en *Production* y *Preview* de: `SUPABASE_*`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_SESSION_SECRET`, `RATE_LIMIT_SECRET`, `NEXT_PUBLIC_META_PIXEL_ID`, `BLOB_READ_WRITE_TOKEN` |
| B3 | **Cron Jobs**: frecuencia máxima permitida por tu plan | Proyecto → **Settings → Cron Jobs** y docs de Vercel («Cron Jobs → Usage & Pricing») | Si tu plan permite ejecuciones **cada minuto** (Pro) o solo diarias (Hobby). El worker de emails del CRM lo necesita cada minuto |
| B4 | **Región de las funciones** | Proyecto → **Settings → Functions** (*Function Region*) | Región actual. Idealmente la misma que Supabase (A2) para reducir latencia |
| B5 | **Plan de Vercel** del segundo proyecto (CRM) | Team → **Settings → Billing** | Si hay un segundo proyecto en el mismo equipo/plan y qué dominio tendrá (`crm.…`) |
| B6 | **Almacén de Vercel Blob** (imágenes del blog) | **Storage → Blob** | Cuántos archivos hay y si son las imágenes del blog. **No borrarlo** hasta exportar el blog (fase 4). Cruza con la sección `06_blog` / `B4_storage` del SQL |
| B7 | **Protección de despliegues (SSO) en Preview** | Proyecto → **Settings → Deployment Protection** | Cómo se harán las pruebas automáticas (token de *Protection Bypass for Automation* si se quieren usar con `curl`) |

---

## C. Calendly (necesario para reservas propias, fase 6)

| # | Qué comprobar | Dónde | Respuesta que necesito |
|---|---|---|---|
| C1 | **Plan** de Calendly | **Account → Billing** (o *Upgrade*) | Plan actual. Determina si hay exportación/API y cuántos anfitriones |
| C2 | **Exportación del historial**: formato y campos | Menú **Scheduled Events** → botón **Export** (CSV); si no aparece, **Integrations → API & Webhooks → Personal Access Token** y la API `GET /scheduled_events` + `/invitees`. *No estoy seguro del nombre exacto del botón en tu plan* | Una exportación real (5–10 filas, **sin datos personales sensibles**, o con nombres cambiados) para ver las columnas: invitado, email, teléfono, tipo de evento, inicio/fin, estado (cancelado), anfitrión, respuestas a preguntas, UTM |
| C3 | **Citas futuras ya agendadas** el día del corte | **Scheduled Events → Upcoming** | Cuántas hay y hasta qué fecha llegan (define cuánto tiempo hay que mantener Calendly) |
| C4 | **Tipos de evento** en uso | **Event Types** | Nombre, duración, buffer, antelación mínima, ventana máxima y ubicación de cada uno (base de `tipos_cita`) |
| C5 | **Anfitriones y disponibilidad** | **Availability** (por usuario) y **Admin management → Users** | Quién atiende las llamadas, en qué horario semanal y zona horaria (se copia a `disponibilidad_semanal`) |
| C6 | **Preguntas personalizadas** del formulario de reserva | Cada evento → **Edit → Invitee Questions** | Lista de preguntas (¿se pide teléfono, programa de interés…?) y cuáles son obligatorias |
| C7 | **Recordatorios/flujos** que hace Calendly hoy | **Workflows** | Qué emails/SMS se envían y cuándo (hay que replicarlos: confirmación, recordatorio 24 h/1 h, cancelación) |
| C8 | **Integraciones** activas (Google/Outlook Calendar, Zoom/Meet, Zapier…) | **Integrations & apps** | Cuáles hay, sobre todo el enlace de videollamada y a qué calendario se escribe |
| C9 | **Webhooks o Zapier** que consuman Calendly | **Integrations → API & Webhooks** | Si algo externo depende de las reservas (se rompería al retirarlo) |
| C10 | **Política de cancelación/reprogramación** | Cada evento → **Cancellation policy** / **Confirmation page** | El texto actual, para mantener el mismo comportamiento |

---

## D. Resend y DNS

| # | Qué comprobar | Dónde | Respuesta que necesito |
|---|---|---|---|
| D1 | **Dominio verificado** | resend.com → **Domains** | Nombre del dominio y estado (*Verified*) de los registros SPF, DKIM y (recomendado) DMARC. Sin esto los usuarios **no reciben** ningún email (el remitente de pruebas solo llega al dueño de la cuenta) |
| D2 | **Dirección de remitente** que quieres usar | Decisión de negocio; se configura como `RESEND_FROM_EMAIL` | Ej. `IDESIE <info@…>` o una dirección `noreply@…` y qué buzón atiende las respuestas (`replyTo`) |
| D3 | **Clave de API** y permisos | **API Keys** | Que existe una clave con permiso de envío (*Sending access*) y que está en Vercel (Production y Preview) |
| D4 | **Límites del plan** | **Settings → Usage / Billing** | Emails/día y /mes permitidos. La agenda añade recordatorios; con muchas reservas podría hacer falta plan de pago |
| D5 | **Retención de logs y lista de supresión** | **Logs** y **Suppressions** | Cuántos días conserva Resend el contenido de los emails (importante para el derecho de supresión) |
| D6 | **Región de envío** | **Domains → (dominio) → Region** | Región del dominio (política de privacidad) |
| D7 | **Quién gestiona el DNS** y cómo se cambia | Registrador/DNS del dominio (fuera de estos paneles) | Nombre del proveedor de DNS y quién puede añadir registros (SPF/DKIM/DMARC y subdominio del CRM) |
| D8 | **Buzón `info@`** | Tu proveedor de correo | Que hoy recibe los avisos internos de todos los formularios (contienen datos personales: entra en el procedimiento de supresión) |

---

## E. Flywire (fase 5: el pedido nunca pasa de «pendiente» porque no hay notificación de pago)

*No conozco el panel exacto de tu portal de Flywire (código de destinatario `IBT`); estas rutas son orientativas. Si no encuentras la sección, la vía segura es escribir a tu gestor de cuenta con estas preguntas.*

| # | Qué comprobar | Dónde | Respuesta que necesito |
|---|---|---|---|
| E1 | ¿Se pueden recibir **notificaciones de estado de pago** (*Payment Status Notifications*)? | Portal de Flywire de IDESIE → sección de **configuración / notificaciones / API** (nombre variable) o gestor de cuenta | Sí/No, y si hay que solicitarlas |
| E2 | **Secreto compartido y URL de retorno** | Mismo lugar | Si se puede obtener el *Shared Secret* (firma `X-Flywire-Digest`, HMAC-SHA256) y registrar una `callback_url` |
| E3 | **Estados que equivalen a «pagado»** | Documentación de Flywire o gestor | Cuál de `guaranteed` / `delivered` considera Flywire cobro seguro para IDESIE |
| E4 | **Entorno de pruebas (sandbox)** | Gestor de cuenta | Si existe y cómo obtener credenciales, para probar sin cobrar |
| E5 | **Reembolsos y pagos parciales** | Gestor de cuenta | Si se gestionan por Flywire y si habrá que reflejarlos en el CRM |
| E6 | **Retención de datos del pagador** | Contrato / DPA de Flywire | Plazo (procedimiento de supresión y política de privacidad) |

---

## F. Meta y otros scripts que carga la web

| # | Qué comprobar | Dónde | Respuesta que necesito |
|---|---|---|---|
| F1 | **Píxel activo** y eventos recibidos | Meta **Events Manager → Data sources →** (tu píxel) → *Overview* y **Test events** | ID del píxel y qué eventos llegan hoy (`PageView`, `Lead`, `Schedule`) y desde qué URL |
| F2 | **Evento de optimización** de las campañas | **Ads Manager →** campaña → conjunto de anuncios → *Conversion event* | Qué evento usan realmente (`Lead`/`Schedule`); es el que hay que conservar tras retirar Calendly |
| F3 | **API de Conversiones**: token | Events Manager → tu píxel → **Settings → Conversions API → Generate access token** | Quién es el administrador de la cuenta de Meta Business que puede generarlo (se guarda como variable de servidor, nunca en el repositorio) |
| F4 | **Scripts externos que carga la web en producción** (Google Analytics, Ads, GTM, Hotjar, Clarity, chat…) | En el navegador, sobre **idesie.com** (producción): DevTools → **Network** (filtro `google|gtag|gtm|facebook|calendly|clarity|hotjar`) y **Application → Cookies** | Lista de dominios y cookies que aparecen **antes de aceptar nada**. El repositorio no incluye GA/Ads, pero la política de cookies los menciona: hay que saber si se inyectan por otra vía |
| F5 | **Cookies de terceros de Calendly** | Mismo método, en `/landing` y `/contact-page` | Qué cookies fija Calendly al cargar el iframe (decide si hay que bloquear el embed hasta el consentimiento) |

---

## G. Equipo (decisiones de organización que condicionan el diseño)

| # | Qué comprobar | Dónde | Respuesta que necesito |
|---|---|---|---|
| G1 | **Dominios y cuentas de correo del equipo** que usarán el CRM | Tu administración de correo | Lista de correos (p. ej. `@idesie.com`) y quién tendrá cada rol: `admin`, `comercial`, `lectura` |
| G2 | **Nº de asesores** que atienden llamadas informativas y su horario | Con el equipo de admisiones (y Calendly, C5) | Cuántas personas, horario semanal, vacaciones habituales, si hay reparto por programa o idioma |
| G3 | **Herramienta de videollamada** | Con el equipo | Google Meet, Zoom, Teams o teléfono (decisión #9) |
| G4 | **Quién recibe los avisos internos** (nueva solicitud, nueva cita) | Con el equipo | Buzón(es) o personas |
| G5 | **Quién ejecuta las supresiones RGPD** y en qué plazo interno | Con dirección/legal | Persona responsable (rol `admin` con MFA) |
| G6 | **Mínimo de funciones que necesitan para dejar el panel** | Con quien usa hoy `/admin` | Confirmar la matriz de paridad de `diseno-crm.md` §8.2 (¿alguien usa algo que no está en la lista?) |
| G7 | **Marcador de las filas de prueba** | Quien hizo las pruebas de Preview | Confirmar que era el texto **`PRUEBA-PREVIEW`** y en qué campos lo escribió (el SQL lo detecta, pero conviene confirmar que no hay otro marcador) |
| G8 | **Posts del blog de prueba** | Quien gestiona el blog | Cuáles de los posts listados por el SQL son de prueba (p. ej. `holapio`) y cuáles deben quedar |

---

## H. Plazos legales y RGPD (consulta a tu asesoría/legal)

| # | Qué comprobar | Dónde | Respuesta que necesito |
|---|---|---|---|
| H1 | **Plazo de conservación de pedidos** tras una solicitud de supresión | Asesoría legal/fiscal | Años exactos (4 fiscal / 6 mercantil, o el que corresponda). Decisión #14 |
| H2 | **Plazo para candidaturas** | Asesoría legal | Cuánto tiempo se pueden conservar CV/datos de candidatos sin proceso abierto |
| H3 | **Plazo para contactos comerciales sin actividad** | Asesoría legal | Tras cuánto tiempo hay que anonimizar/borrar (p. ej. leads sin respuesta) |
| H4 | **Base jurídica del marketing** | Asesoría legal | Si basta el interés legítimo para clientes/alumnos o hace falta consentimiento expreso (LSSI) |
| H5 | **Textos legales**: privacidad, cookies, condiciones de compra | Asesoría legal | Versión aprobada y **número de versión** que se guardará con cada consentimiento. Sin condiciones de compra no se puede añadir la casilla del checkout con contenido real |
| H6 | **Contratos de encargado del tratamiento (DPA)** | Cada proveedor (Supabase, Vercel, Resend, Flywire, Meta, proveedor de CMP, Calendly hasta la baja) — sección *Legal/DPA* de su panel o web | Cuáles están firmados/aceptados |
| H7 | **Transferencias internacionales** | Con la región de Supabase (A2), Vercel, Resend, Meta | Qué mecanismo se declara (p. ej. Marco de Privacidad UE-EE. UU. o cláusulas tipo) |
| H8 | **Registro de actividades de tratamiento (RAT)** y ¿DPO? | Documentación interna de RGPD | Si existe y hay que actualizarlo con el CRM, las reservas y las nuevas tablas |
| H9 | **Retención de copias de seguridad y logs** | Supabase (A3), Resend (D5), Vercel (Logs) | Días de retención de cada uno, para el procedimiento de supresión |

---

## I. Comprobaciones en el repositorio (no necesitan BD ni paneles)

**#11 — Componentes `ui/` que solo usa el panel** (comprobar antes de borrarlos). Ejecuta desde la raíz del repositorio; si un componente solo aparece en archivos del panel, puede eliminarse con él:

```bash
for c in form table alert-dialog alert switch badge; do
  echo "== ui/$c usado en:"; grep -rl "components/ui/$c\"" --include='*.tsx' app components | sort
done
```
Respuesta que necesito: la salida (o «solo lo usan archivos del panel» para cada uno).

**#12 — Compatibilidad de `next-mdx-remote/rsc` (o la alternativa) con Next 16.** Prueba en un proyecto de laboratorio, **no** en la web:

```bash
npx create-next-app@latest lab-mdx --ts --app --use-pnpm && cd lab-mdx
pnpm add next-mdx-remote gray-matter remark-gfm rehype-slug
# crea una página que compile un .md con format:"md" y renderice con <MDXRemote source=… />
pnpm build
```
Respuesta que necesito: si compila y renderiza con la versión de Next del proyecto (16.x); si no, probamos `@next/mdx`.

---

## J. Ya cubierto por `verificacion-produccion.sql` (no hay que hacer nada manual)

| Punto del apéndice | Sección del resultado |
|---|---|
| #1 Tablas, filas, migraciones aplicadas, `applications` | `01_tablas`, `03_migraciones*`, `04_applications` |
| #2 Filas de prueba (`PRUEBA-PREVIEW`) y columnas | `05_pruebas_por_tabla`, `05_pruebas_por_columna` |
| #3 Blog: nº de posts, publicados, dominios de imágenes | `06_blog`, `B4_storage` (bloque B) |
| #4 Ids de producto ↔ slug | `07_productos_id_slug`, `07_order_items_product_id` |
| #5 `pg_cron` (versión), `btree_gist`, Realtime, ajustes | `08_*`, `10_realtime_publicacion`, `B1_pg_cron_jobs` |
| #7 Rol creador de objetos y permisos por defecto | `09_roles`, `09_dueños_objetos_public`, `09_permisos_*` |
| #15 Nombres reales de columnas del backfill | `02_columnas`, `02_columnas_esperadas` (solo lista las que FALTAN) |
