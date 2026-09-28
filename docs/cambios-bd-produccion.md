# Registro de cambios en la base de datos de producción

Este archivo no contiene credenciales ni datos personales — solo SQL, motivo y fecha de cada
cambio aplicado directamente contra el proyecto de Supabase que comparten `WebIdesie` e
`idesie-crm`. Cada entrada corresponde a un cambio real, ya aplicado y verificado.

---

## 2026-09-28 — Panel de administración eliminado por completo (código + base de datos)

**Motivo**: encargo explícito del cliente de borrar cualquier rastro del panel `/admin/*` de
WebIdesie. Confirmado antes de tocar nada: (1) es el panel de la web pública (blog/tienda/empleo/
admisiones), no algo del CRM; (2) sí, incluir también las tablas de Supabase, aunque una de ellas
tenga la única cuenta de admin real que existía.

**Código eliminado** (repo `WebIdesie`, no es parte de este archivo por no ser SQL, pero se anota
aquí para tener el cambio completo en un solo sitio): `app/admin/` completo, `app/api/admin/`,
`app/blog/edit/` (una segunda página de edición huérfana, fuera de `/admin`, sin protección de
`middleware.ts` — hallazgo del propio barrido), `middleware.ts`, `lib/admin-auth.ts`,
`lib/admin-secret.ts`, `lib/admin-session.ts`, `lib/verify-origin.ts`,
`lib/producto-detalle-config.ts`, y los componentes/Server Actions exclusivos de admin en
blog/tienda/empleo/admisiones (con edición quirúrgica en `app/blog/actions.ts`,
`app/tienda/actions.ts`, `app/empleo/actions.ts` para conservar las funciones de LECTURA pública
que ya usaban `/blog`, `/tienda`, `/bolsa-de-empleo-page`, `/producto/[slug]`). `ADMIN_SESSION_SECRET`
retirado de `lib/env.ts`/`env.example`/`.env.local`; dependencia `bcryptjs` retirada de
`package.json` (sin ningún otro consumidor). Verificado con `tsc --noEmit` (0 errores) y contra el
propio servidor de desarrollo en caliente: `/admin/*` y `/api/admin/auth` → 404; `/blog`, `/tienda`,
`/bolsa-de-empleo-page`, un artículo real y una ficha de producto real → 200, sin el botón
"Editar Artículo".

**SQL pendiente de ejecutar por el cliente** (bloqueado para mí por el sistema de permisos, mismo
caso que 042/043/045 — ver más abajo): `scripts/038_drop_admin_panel_tables.sql`.

```sql
drop table if exists public.admin_sessions;
drop table if exists public.admin_users;
```

**Orden**: `admin_sessions` antes que `admin_users` (`admin_sessions.admin_id` referencia a
`admin_users.id`).

**Backup**: el `pg_dump` completo de la Fase 1 de la auditoría de seguridad de esta sesión
(tomado antes de cualquier cambio) incluye ambas tablas con sus datos — es la vía de recuperación
si algún día hiciera falta.

**Reversible**: solo recreando las tablas desde cero (`scripts/002_create_admin_table.sql` +
`scripts/030_admin_sessions.sql`, ambos conservados como registro histórico) y todo el código
borrado — no hay un camino de "deshacer" de un solo paso una vez ejecutado el `DROP`.

---

## 2026-09-28 — Aplicadas las migraciones 042, 043 y 045 (pendientes desde su creación)

**Motivo**: `042` y `043` (canal de origen del contacto + importación de leads desde Excel, del
CRM) y `045` (tarea automática para `lead_legacy` / solicitudes de información) se habían escrito
en sesiones anteriores pero nunca se ejecutaron contra producción — confirmado con una auditoría
completa de solo lectura antes de tocar nada (inventario de esquemas, tablas, RLS, grants,
funciones, `pg_cron`, extensiones). Ver el informe completo de esa auditoría en el propio
historial de la conversación con el cliente.

**Aplicado por**: el cliente, pegando el SQL en el SQL Editor de Supabase (la ejecución directa
desde aquí quedó bloqueada por el sistema de permisos del propio Claude Code, que no permite
modificar recursos compartidos sin aprobación explícita fuera del chat).

**Verificado después de aplicar** (consultas de solo lectura, sin modificar nada):
- `crm.contactos.canal_origen` existe, con su `CHECK` correcto.
- `crm.v_contactos` recreada — su definición ya incluye `canal_origen` (confirmado con
  `pg_get_viewdef`).
- `crm.importar_leads_excel(jsonb)` existe, `SECURITY DEFINER`, dueño `crm_owner`, `EXECUTE`
  concedido a `authenticated`. Cuerpo real comparado con el código fuente — idéntico.
- `crm.procesar_entradas()` contiene el bloque `lead_legacy` de la 045 (confirmado con
  `pg_get_functiondef`).
- Prueba de extremo a extremo con 5 escenarios (lead con llamada, lead sin llamada,
  solicitud_admision, mensaje_contacto, baja) insertados con emails `@test.idesie.invalid`,
  `crm.procesar_entradas()` invocada, tareas generadas revisadas, y datos de prueba borrados —
  0 filas restantes en las 9 tablas tocadas, confirmado por consulta directa.

**SQL exacto aplicado** — los tres scripts, tal cual, sin modificar:

<details>
<summary>042 — canal de origen del contacto</summary>

```sql
begin;

alter table crm.contactos add column canal_origen text
  check (canal_origen in ('web', 'instagram', 'facebook', 'otro'));

grant update (canal_origen) on crm.contactos to authenticated;

drop view crm.v_contactos;
create view crm.v_contactos with (security_invoker = true) as
select c.*,
       (select count(*) from crm.entradas e where e.contacto_id = c.id)                 as n_entradas,
       (select max(e.recibido_at) from crm.entradas e where e.contacto_id = c.id)       as ultima_entrada_at,
       lower(coalesce(c.nombre, '') || ' ' || c.email_principal || ' ' || coalesce(c.telefono, '')) as busqueda
from crm.contactos c
where c.fusionado_en is null;
alter view crm.v_contactos owner to crm_owner;
grant select on crm.v_contactos to authenticated;

commit;
```

</details>

<details>
<summary>043 — importación de leads desde Excel</summary>

```sql
begin;

create function crm.importar_leads_excel(p_filas jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_admision_id uuid;
  v_etapa_inicial_id uuid;
  v_fila jsonb;
  v_email text;
  v_contacto_id uuid;
  v_nuevos int := 0;
  v_actualizados int := 0;
  v_oportunidades int := 0;
  v_omitidos int := 0;
begin
  if (select crm.rol_actual()) not in ('admin', 'comercial') then
    raise exception 'No tienes permiso para importar contactos' using errcode = '42501';
  end if;

  select id into v_admision_id from crm.pipelines where codigo = 'admision';
  select id into v_etapa_inicial_id from crm.etapas where pipeline_id = v_admision_id order by orden limit 1;

  for v_fila in select * from jsonb_array_elements(coalesce(p_filas, '[]'::jsonb)) loop
    v_email := crm.normalizar_email(v_fila->>'email');
    if v_email is null or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      v_omitidos := v_omitidos + 1;
      continue;
    end if;

    select contacto_id into v_contacto_id from crm.contacto_emails where email_normalizado = v_email;

    if v_contacto_id is null then
      v_contacto_id := gen_random_uuid();
      insert into crm.contactos (id, email_principal, nombre, telefono, canal_origen, propietario_id, creado_at)
        values (v_contacto_id, btrim(v_fila->>'email'), coalesce(nullif(btrim(v_fila->>'nombre'), ''), 'Sin nombre'),
                nullif(btrim(v_fila->>'telefono'), ''), coalesce(v_fila->>'canal_origen', 'web'), (select crm.uid()), now());
      insert into crm.contacto_emails (email_normalizado, contacto_id, principal) values (v_email, v_contacto_id, true);
      v_nuevos := v_nuevos + 1;
    else
      update crm.contactos set
        nombre = coalesce(nombre, nullif(btrim(v_fila->>'nombre'), '')),
        telefono = coalesce(telefono, nullif(btrim(v_fila->>'telefono'), '')),
        canal_origen = coalesce(canal_origen, v_fila->>'canal_origen')
      where id = v_contacto_id;
      v_actualizados := v_actualizados + 1;
    end if;

    if (v_fila->>'programa') is not null and v_admision_id is not null and v_etapa_inicial_id is not null
       and not exists (
         select 1 from crm.oportunidades o join crm.etapas e on e.id = o.etapa_id
         where o.contacto_id = v_contacto_id and o.pipeline_id = v_admision_id and e.tipo = 'abierta'
       ) then
      insert into crm.oportunidades (contacto_id, pipeline_id, etapa_id, programa, titulo, propietario_id)
        values (v_contacto_id, v_admision_id, v_etapa_inicial_id, v_fila->>'programa',
                'Lead importado' || coalesce(' · ' || (v_fila->>'programa'), ''), (select crm.uid()));
      v_oportunidades := v_oportunidades + 1;
    end if;
  end loop;

  return jsonb_build_object('nuevos', v_nuevos, 'actualizados', v_actualizados,
                             'oportunidades', v_oportunidades, 'omitidos', v_omitidos);
end $$;

revoke execute on function crm.importar_leads_excel(jsonb) from public, anon;
grant  execute on function crm.importar_leads_excel(jsonb) to authenticated;
alter function crm.importar_leads_excel(jsonb) owner to crm_owner;

commit;
```

</details>

<details>
<summary>045 — tarea automática para lead_legacy (solicitud de información)</summary>

Ver el archivo completo en `idesie-crm/supabase/migrations/045_lead_legacy_tarea.sql` — es un
`CREATE OR REPLACE FUNCTION crm.procesar_entradas(...)` con el cuerpo completo (Postgres lo
exige para sustituir una función), cambiando solo el bloque "5e) Tareas" para sumar el tipo
`lead_legacy`: si el lead agendó llamada, la tarea vence en la fecha/hora exacta agendada; si no,
vence en 1 día (igual que `mensaje_contacto`).

</details>

**Cómo revertir cada uno, si hiciera falta**:

- **042**: no es un único comando — hay que quitar la vista antes de poder quitar la columna
  (la vista depende de ella):
  ```sql
  begin;
  drop view crm.v_contactos;
  alter table crm.contactos drop column canal_origen;
  create view crm.v_contactos with (security_invoker = true) as
  select c.*,
         (select count(*) from crm.entradas e where e.contacto_id = c.id)                 as n_entradas,
         (select max(e.recibido_at) from crm.entradas e where e.contacto_id = c.id)       as ultima_entrada_at,
         lower(coalesce(c.nombre, '') || ' ' || c.email_principal || ' ' || coalesce(c.telefono, '')) as busqueda
  from crm.contactos c
  where c.fusionado_en is null;
  alter view crm.v_contactos owner to crm_owner;
  grant select on crm.v_contactos to authenticated;
  commit;
  ```
- **043**: trivial y aislado, no toca ninguna tabla ni vista:
  ```sql
  drop function crm.importar_leads_excel(jsonb);
  ```
- **045**: volver a la versión anterior (la de la migración `041`) con otro
  `create or replace function crm.procesar_entradas(...)` que quite el `case` de `lead_legacy`
  del bloque "5e" — el cuerpo completo de esa versión anterior está en
  `idesie-crm/supabase/migrations/041_crm_procesar_entradas.sql`.

**Sin tocar en esta sesión, pendiente de decisión aparte**: el esquema `api_web` (vacío, sin
consumidores) y el `EXECUTE` de `graphql_public.graphql()` a `anon`/`authenticated` (sin
consumidor en ninguno de los dos repos) — señalados en el informe de la Fase 1, a la espera de
que el cliente decida si quiere tocarlos.
