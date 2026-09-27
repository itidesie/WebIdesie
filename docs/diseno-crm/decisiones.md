# Decisiones pendientes del diseño del CRM

Origen: `docs/diseno-crm.md` §13 (las mismas 20 decisiones, **con su número original** para poder cruzarlas), reordenadas por la **primera fase que bloquean**. Cada una lleva mi recomendación; rellena la línea **Decisión:** al decidir.

**Cómo leer «Bloquea»:** la fase en la que la decisión tiene que estar tomada *antes de empezar*. «Fase 0» = ya (antes de construir nada).
Fases del plan: 0 PR de seguridad y credenciales · 1 fundaciones de BD y backfill · 2 CRM MVP y RGPD base · 3 web con rol `web_app` · 4 blog a código · 5 catálogo, cupones y ofertas · 6 reservas propias · 7 eliminar el panel.

**Resumen de bloqueos**

| Fase | Decisiones |
|---|---|
| 1 | #2, #18, #6, #8, #20 |
| 2 | #7, #14, #15 |
| 3 | #1 |
| 4 | #16, #17 |
| 5 | #3, #4, #5 |
| 6 | #10, #9, #12, #13, #11 |
| 7 | #19 |

> Si adoptas el orden alternativo del punto 5 de la conversación (banner de cookies y casillas de consentimiento **antes** que nada), **#13 y #15 pasan a bloquear esa primera tarea** (ver sus notas).

---

## FASE 1 — Fundaciones de base de datos y backfill

### #2 · ¿Dónde viven las migraciones?
- **Opciones:** (a) repositorio propio `idesie-db` · (b) dentro del repositorio del CRM · (c) monorepo (`apps/web`, `apps/crm`, `db/`).
- **Recomendación: (a).** La base de datos es una sola y su historial de migraciones es lineal; si la web y el CRM empujan a la vez desde repos distintos, el historial diverge. Con un repo propio ni la web ni el CRM son «dueños», y se puede aplicar un único pipeline con prueba de contrato en CI. (c) es igual de válido si prefieres un solo repositorio.
- **Bloquea:** Fase 1 (hay que saber dónde se escribe la migración 037).
- **Decisión:** ____

### #18 · ¿Qué entorno de pruebas tendrá la base de datos?
- **Opciones:** (a) *branching* de Supabase · (b) un segundo proyecto Supabase de staging · (c) Postgres local (`supabase start`) solo.
- **Recomendación: (a) si tu plan lo permite; si no, (b).** Cada migración y la prueba de contrato del rol `web_app` deben ejecutarse contra una copia antes de producción. (c) sirve para CI pero no reproduce Auth/Realtime/pooler de verdad. Depende de la verificación manual «Supabase: plan y *branching*» (`verificaciones-manuales.md`).
- **Bloquea:** Fase 1 (es donde se prueba por primera vez el esquema `crm` y el backfill).
- **Decisión:** ____

### #6 · ¿Cómo se vinculan las entradas de la web con los contactos?
- **Opciones:** (a) trigger en cada tabla de la web · (b) solo una vista `UNION ALL` · (c) proceso del CRM (`procesar_entradas`) leyendo de una vista-contrato.
- **Recomendación: (c).** No puede romper la web (un fallo del CRM no afecta a los `INSERT` de formularios), guarda estado (contacto, fusión, estado de gestión), es idempotente y solo la vista conoce las columnas de la web. Un trigger acopla los dos sistemas; una vista sola no puede guardar nada.
- **Bloquea:** Fase 1 (migración 041 y backfill).
- **Decisión:** ____

### #8 · ¿Qué latencia debe tener la bandeja del CRM?
- **Opciones:** (a) cron cada 30 s + llamada al abrir/enfocar la bandeja · (b) cada minuto · (c) trigger instantáneo.
- **Recomendación: (a).** Casi instantáneo para quien tiene la bandeja abierta y sin acoplar tablas. Requiere que `pg_cron` admita intervalos en segundos (versión ≥ 1.5; lo comprueba el bloque A de `verificacion-produccion.sql`); si no, (b).
- **Bloquea:** Fase 1 (frecuencia del job en la migración 041).
- **Decisión:** ____

### #20 · ¿Qué hacer con `crm-integration/`?
- **Opciones:** (a) archivar fuera del repositorio · (b) borrar · (c) dejarlo.
- **Recomendación: (a).** Es un diseño de dos proyectos que queda descartado, pero contiene ideas útiles ya reaprovechadas (`upsert` con `COALESCE`, mapeo de columnas). Archivarlo evita confundir a quien lea el repositorio y no pierde nada. La verificación de producción comprueba que nada de él se aplicó.
- **Bloquea:** Fase 1 (limpieza previa; no bloquea el código).
- **Decisión:** ____

---

## FASE 2 — CRM MVP y RGPD base

### #7 · ¿Qué ve y edita el rol `comercial`?
- **Opciones:** (a) ve todos los contactos, edita los asignados a él · (b) ve y edita todo · (c) solo ve y edita los suyos.
- **Recomendación: (a).** Con un equipo pequeño, ocultar contactos hace que se pierdan oportunidades y duplica trabajo; limitar la edición a lo asignado mantiene la trazabilidad. Cambia las policies de RLS (migración 039), por eso hay que decidirlo antes de escribirlas.
- **Bloquea:** Fase 2 (RLS y pantallas del CRM).
- **Decisión:** ____

### #14 · Al suprimir a una persona, ¿qué pasa con sus pedidos?
- **Opciones:** (a) anonimizar y conservar importes y fechas · (b) borrar por completo.
- **Recomendación: (a).** Hay obligaciones contables/fiscales de conservar facturas y operaciones durante años. **Necesita validación de tu asesoría legal** (plazo exacto, 4–6 años) — está en `verificaciones-manuales.md`.
- **Bloquea:** Fase 2 (función `suprimir_contacto`, migración 046).
- **Decisión:** ____

### #15 · ¿Se guarda la IP como prueba del consentimiento?
- **Opciones:** (a) no; versión del texto + fecha bastan · (b) sí, con plazo de conservación corto.
- **Recomendación: (a).** Minimización de datos: la IP es otro dato personal y aporta poco frente a «versión del texto + marca de tiempo + origen». Solo cambiaría si tu asesoría lo exige.
- **Bloquea:** Fase 2 (migración 040 de consentimiento). **Con el orden alternativo, bloquea la primera tarea** (casillas de consentimiento).
- **Decisión:** ____

---

## FASE 3 — Web con rol `web_app`

### #1 · ¿Cómo accede la web a la base de datos?
- **Opciones:** (a) rol `web_app` por conexión Postgres (pooler) · (b) `anon` + RLS con `supabase-js`.
- **Recomendación: (a).** Permisos mínimos reales (`INSERT` por columnas) y la web deja de tener cualquier clave de Supabase; con (b) la `anon key` es pública y permitiría insertar directamente saltándose el rate limit y la validación. Coste: reescribir unas 10 consultas y añadir el driver `postgres`. Antes conviene confirmar la conectividad con el pooler (`verificaciones-manuales.md`).
- **Bloquea:** Fase 3 (y el alcance de la migración 042).
- **Decisión:** ____

---

## FASE 4 — Blog a código

### #16 · ¿Formato del blog?
- **Opciones:** (a) `.md` para los migrados y `.mdx` solo cuando haya componentes · (b) todo `.mdx`.
- **Recomendación: (a).** El HTML del editor convertido a Markdown puede contener `{` o `<` que MDX interpretaría como JSX y rompería el build; `.md` se renderiza igual con la misma tubería.
- **Bloquea:** Fase 4 (script de exportación y lector).
- **Decisión:** ____

### #17 · Posts con `published = false` que hoy se ven en la web, ¿qué hacer?
- **Opciones:** (a) mantener visibles (paridad) · (b) pasar a borrador · (c) decidir uno a uno.
- **Recomendación: (c).** Hoy `getBlogPosts` no filtra por `published`, así que esos posts están públicos e indexados; pasarlos a borrador les daría 404. `verificacion-produccion.sql` los lista con su URL; decide cuáles se quedan. Por defecto el script de exportación conserva la paridad.
- **Bloquea:** Fase 4 (ejecución de la exportación).
- **Decisión:** ____

---

## FASE 5 — Catálogo, cupones y ofertas

### #3 · ¿Dónde vive el catálogo (tienda)?
- **Opciones:** (A) en código (`content/productos/*.md`) · (B) gestionado desde el CRM en BD.
- **Recomendación: (A).** Son 6 productos que cambian poco; da versionado, revisión por PR, web estática sin depender de la BD y elimina ~2.000 líneas de editores y 8 tablas. Coste: cambiar un precio exige un despliegue (1–2 min). Elige (B) solo si una persona no técnica debe cambiar precios con frecuencia.
- **Bloquea:** Fase 5 (y qué tablas se eliminan en la 7).
- **Decisión:** ____

### #4 · ¿Dónde se gestionan las ofertas de empleo?
- **Opciones:** (a) módulo del CRM (`crm.ofertas_empleo`) · (b) archivos en el repositorio.
- **Recomendación: (a).** Cambian con frecuencia (altas, cierres, destacadas) y las gestionará quien ya use el CRM; la web las lee por una vista del contrato.
- **Bloquea:** Fase 5.
- **Decisión:** ____

### #5 · ¿Dónde se gestionan los cupones de descuento?
- **Opciones:** (a) módulo del CRM (`crm.cupones`) · (b) seguir con SQL manual.
- **Recomendación: (a).** Hoy no tienen ninguna pantalla y son datos que cambian (campañas). Es un módulo pequeño y el checkout los valida por una función del contrato.
- **Bloquea:** Fase 5.
- **Decisión:** ____

---

## FASE 6 — Reservas propias (sustituto de Calendly)

### #10 · ¿Cómo será el modelo de reservas?
- **Opciones:** un solo asesor o varios · duración y granularidad de los huecos · un tipo de cita o varios.
- **Recomendación:** empezar con **un tipo de cita (30 min, huecos cada 30 min)** y N asesores con reparto por menor carga ese día. Añadir tipos después no cambia el esquema. Depende de la verificación manual «Equipo y Calendly» (cuántos asesores hay y qué duración usan hoy).
- **Bloquea:** Fase 6 (diseño de `tipos_cita`, `disponibilidad_semanal` y `slots_libres`).
- **Decisión:** ____

### #9 · ¿Cómo se genera el enlace de videollamada?
- **Opciones:** (a) enlace fijo por asesor · (b) Google Meet/Zoom generado por reserva vía API del calendario.
- **Recomendación: (a) en la primera versión, (b) más adelante.** Es lo que más trabajo añadiría respecto a Calendly (integración por asesor); un enlace fijo cubre el 90 % y no bloquea el lanzamiento.
- **Bloquea:** Fase 6 (plantillas de email y campos de `asesores`).
- **Decisión:** ____

### #12 · ¿Cómo se mantiene la conversión de Meta (`Schedule` y `Lead`)?
- **Opciones:** (a) solo píxel en el navegador · (b) píxel + API de Conversiones (CAPI) con el mismo `event_id`.
- **Recomendación: (b).** Resiste bloqueadores y deduplica. Requiere un token de CAPI (Meta Business) y **consentimiento de cookies de marketing** (#13).
- **Bloquea:** Fase 6.
- **Decisión:** ____

### #13 · ¿Qué gestor de consentimiento de cookies (CMP) se usa?
- **Opciones:** (a) proveedor externo (Cookiebot, Iubenda, Osano…) · (b) desarrollo propio.
- **Recomendación: (a).** Cumplir bien (categorías, registro de consentimiento, actualización de listas de cookies) es más caro de mantener que de comprar. Es obligatorio antes de la reserva propia y **hoy el Meta Pixel de `/landing` ya carga sin consentimiento**.
- **Bloquea:** Fase 6 en el plan original. **Con el orden alternativo, bloquea la primera tarea** (banner de cookies): habría que decidirlo ya.
- **Decisión:** ____

### #11 · ¿Qué se importa del historial de Calendly?
- **Opciones:** (a) todo (contactos y citas) · (b) solo las citas futuras · (c) nada.
- **Recomendación: (a).** Es barato (`calendly_uri` único hace la importación idempotente) y da el historial completo de interacción con cada contacto. Las citas futuras se importan como `confirmada` para que reciban el recordatorio nuevo. Depende del formato de exportación (`verificaciones-manuales.md`).
- **Bloquea:** Fase 6 (script de importación).
- **Decisión:** ____

---

## FASE 7 — Eliminar el panel

### #19 · ¿Qué hacer con la tabla `leads`?
- **Opciones:** (a) congelar y borrar a los 6 meses · (b) borrar ya · (c) conservar.
- **Recomendación: (a).** No tiene consumidores, pero el backfill la vuelca a `crm.entradas`; esperar unos meses permite detectar cualquier hueco antes de borrarla. No bloquea nada hasta que llega el `DROP`.
- **Bloquea:** Fase 7 (migración de borrado).
- **Decisión:** ____
