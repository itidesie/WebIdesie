-- =============================================================================
-- BACKFILL DE CONTACTOS DEL CRM  —  ARCHIVO DE DISEÑO, NO EJECUTADO NI PROBADO
-- =============================================================================
-- Crea crm.contactos / crm.contacto_emails / crm.entradas / crm.consentimientos
-- a partir de los datos históricos de la web, y genera un informe de duplicados.
--
-- REQUISITOS PREVIOS
--   · Migraciones del esquema del CRM aplicadas (ver docs/diseno-crm.md §4, §5, §11):
--     crm.normalizar_email(), crm.contactos, crm.contacto_emails, crm.entradas,
--     crm.consentimientos con sus restricciones únicas.
--   · Migraciones 034, 035 y 036 aplicadas (mensajes_contacto.telefono y
--     solicitudes_baja existen). Si alguna tabla de origen no existe, comenta
--     su bloque en el paso 1.
--   · Ejecutar con un rol con acceso a public.* y crm.* (postgres / crm_worker),
--     por ejemplo:  psql "$DATABASE_URL" -f docs/diseno-crm/backfill-contactos.sql
--
-- SEGURIDAD
--   · Todo va dentro de UNA transacción que termina en ROLLBACK (modo simulación).
--     El informe se imprime antes del rollback. Para aplicar de verdad, sustituye
--     la última línea por COMMIT tras revisar el informe.
--   · Es IDEMPOTENTE: se puede repetir. No duplica contactos (se salta los emails
--     que ya están en crm.contacto_emails) ni entradas/consentimientos (ON CONFLICT).
--   · No modifica NINGUNA tabla de public.* (solo lee).
--
-- ⚠️ POR VERIFICAR antes de ejecutar:
--   · El marcador real de las filas de prueba (aquí: 'PRUEBA-PREVIEW', buscado en
--     CUALQUIER columna de la fila). Añade más patrones en el paso 0 si hace falta.
--   · Los nombres de columna están tomados de las migraciones del repositorio
--     (scripts/020–036), no de la base de datos real.
-- =============================================================================

\set ON_ERROR_STOP on

begin;
set local statement_timeout = '5min';
set local lock_timeout = '5s';

-- -----------------------------------------------------------------------------
-- 0. Parámetros
-- -----------------------------------------------------------------------------
create temp table _patrones_prueba (patron text primary key);
insert into _patrones_prueba values ('PRUEBA-PREVIEW');
-- Ejemplos opcionales (descomentar si procede):
-- insert into _patrones_prueba values ('@example\.com');
-- insert into _patrones_prueba values ('^test@');

create temp table _rx as
select string_agg(patron, '|') as rx from _patrones_prueba;

-- Entradas más recientes que estos días entran en la bandeja como 'nueva';
-- el resto se marca 'gestionada' para no inundar la bandeja con histórico.
create temp table _params as select 30::int as dias_bandeja;

-- -----------------------------------------------------------------------------
-- 1. Staging: una fila por cada entrada histórica, todas las tablas unificadas
-- -----------------------------------------------------------------------------
create temp table _stg (
  fuente_tabla text not null,
  fuente_id    text not null,          -- text: orders.id es integer, el resto uuid
  tipo         text not null,
  email_orig   text,
  email_norm   text,
  nombre       text,
  telefono     text,
  programa     text,
  recibido_at  timestamptz,
  rgpd         boolean,
  es_baja      boolean not null default false,
  es_prueba    boolean not null default false,
  raw          jsonb not null,
  primary key (fuente_tabla, fuente_id)
);

-- leads (tabla heredada del calendario propio abandonado)
insert into _stg (fuente_tabla, fuente_id, tipo, email_orig, nombre, telefono, programa, recibido_at, rgpd, raw)
select 'leads', t.id::text, 'lead_legacy', t.email,
       nullif(btrim(concat_ws(' ', t.first_name, t.last_name)), ''),
       nullif(btrim(t.phone), ''), t.master_interes, t.created_at, null, to_jsonb(t)
from public.leads t;

insert into _stg (fuente_tabla, fuente_id, tipo, email_orig, nombre, telefono, programa, recibido_at, rgpd, raw)
select 'solicitudes_admision', t.id::text, 'solicitud_admision', t.email,
       nullif(btrim(t.nombre_completo), ''), nullif(btrim(t.telefono), ''),
       t.programa_solicitado, t.created_at, t.rgpd_aceptado, to_jsonb(t)
from public.solicitudes_admision t;

insert into _stg (fuente_tabla, fuente_id, tipo, email_orig, nombre, telefono, programa, recibido_at, rgpd, raw)
select 'mensajes_contacto', t.id::text, 'mensaje_contacto', t.email,
       nullif(btrim(t.nombre), ''), nullif(btrim(t.telefono), ''),
       t.programa, t.created_at, null, to_jsonb(t)
from public.mensajes_contacto t;

insert into _stg (fuente_tabla, fuente_id, tipo, email_orig, nombre, telefono, programa, recibido_at, rgpd, raw)
select 'descargas_catalogo', t.id::text, 'descarga_catalogo', t.email,
       nullif(btrim(t.nombre), ''), nullif(btrim(t.telefono), ''),
       t.programa, t.created_at, t.rgpd_aceptado, to_jsonb(t)
from public.descargas_catalogo t;

insert into _stg (fuente_tabla, fuente_id, tipo, email_orig, nombre, telefono, programa, recibido_at, rgpd, raw)
select 'candidaturas_empleo', t.id::text, 'candidatura', t.email,
       nullif(btrim(t.nombre), ''), nullif(btrim(t.telefono), ''),
       null, t.created_at, null, to_jsonb(t)
from public.candidaturas_empleo t;

insert into _stg (fuente_tabla, fuente_id, tipo, email_orig, nombre, telefono, programa, recibido_at, rgpd, raw)
select 'orders', t.id::text, 'pedido', t.customer_email,
       nullif(btrim(t.customer_name), ''), nullif(btrim(t.customer_phone), ''),
       null, t.created_at, null, to_jsonb(t)
from public.orders t;

-- Las bajas: se vinculan al contacto (si existe) y lo marcan "no contactar";
-- nunca deben generar por sí solas un contacto comercial "normal".
insert into _stg (fuente_tabla, fuente_id, tipo, email_orig, nombre, telefono, programa, recibido_at, rgpd, es_baja, raw)
select 'solicitudes_baja', t.id::text, 'baja', t.email,
       null, null, null, t.created_at, null, true, to_jsonb(t)
from public.solicitudes_baja t;

-- Normalización y detección de filas de prueba (cualquier columna de la fila)
update _stg
   set email_norm = crm.normalizar_email(email_orig),
       es_prueba  = (raw::text ~* (select rx from _rx));

-- -----------------------------------------------------------------------------
-- 2. Filas válidas: no de prueba y con un email con forma de email
-- -----------------------------------------------------------------------------
create temp table _validas as
select *
from _stg
where not es_prueba
  and email_norm ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';

create temp table _descartadas_sin_email as
select fuente_tabla, fuente_id, email_orig, recibido_at
from _stg
where not es_prueba
  and (email_norm is null or email_norm !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

-- -----------------------------------------------------------------------------
-- 3. Contactos NUEVOS (los emails que ya existen en el CRM se respetan y saltan)
--    Criterio de fusión: MISMO email normalizado (lower + trim). Cualquier otro
--    parecido (mismo teléfono, gmail con puntos, mismo nombre) NO se fusiona
--    solo: va al informe para decisión humana.
-- -----------------------------------------------------------------------------
create temp table _contactos_nuevos as
with ult as (      -- email tal como lo escribió la última vez
  select distinct on (email_norm) email_norm, email_orig
  from _validas order by email_norm, recibido_at desc
),
nom as (           -- el nombre más completo (más largo), a igualdad el más reciente
  select distinct on (email_norm) email_norm, nombre
  from _validas where nombre is not null
  order by email_norm, length(nombre) desc, recibido_at desc
),
tel as (           -- el teléfono más reciente
  select distinct on (email_norm) email_norm, telefono
  from _validas where telefono is not null
  order by email_norm, recibido_at desc
),
prim as (
  select email_norm,
         min(recibido_at) as primera_vez,
         (array_agg(tipo order by recibido_at))[1] as origen_primero,
         min(recibido_at) filter (where es_baja) as baja_at
  from _validas group by email_norm
)
select gen_random_uuid() as id,
       u.email_norm, u.email_orig, n.nombre, t.telefono,
       p.primera_vez, p.origen_primero, p.baja_at
from ult u
join prim p using (email_norm)
left join nom n using (email_norm)
left join tel t using (email_norm)
where not exists (select 1 from crm.contacto_emails ce where ce.email_normalizado = u.email_norm);

insert into crm.contactos (id, email_principal, nombre, telefono, origen_primero,
                           no_contactar, baja_solicitada_at, creado_at)
select id, email_orig, nombre, telefono, origen_primero,
       (baja_at is not null), baja_at, primera_vez
from _contactos_nuevos;

insert into crm.contacto_emails (email_normalizado, contacto_id, principal)
select email_norm, id, true from _contactos_nuevos;

-- Contactos que ya existían y ahora reciben una baja: se marcan igualmente.
update crm.contactos c
   set no_contactar = true,
       baja_solicitada_at = coalesce(c.baja_solicitada_at, b.baja_at)
  from (select email_norm, min(recibido_at) as baja_at from _validas where es_baja group by email_norm) b
  join crm.contacto_emails ce on ce.email_normalizado = b.email_norm
 where c.id = ce.contacto_id and not c.no_contactar;

-- -----------------------------------------------------------------------------
-- 4. Entradas (historial de todo lo que llegó por la web), idempotente
-- -----------------------------------------------------------------------------
insert into crm.entradas (contacto_id, fuente_tabla, fuente_id, tipo, programa,
                          recibido_at, estado, payload)
select ce.contacto_id, v.fuente_tabla, v.fuente_id, v.tipo, v.programa, v.recibido_at,
       case when v.recibido_at >= now() - make_interval(days => (select dias_bandeja from _params))
                 and not v.es_baja
            then 'nueva' else 'gestionada' end,
       v.raw
from _validas v
join crm.contacto_emails ce on ce.email_normalizado = v.email_norm
on conflict (fuente_tabla, fuente_id) do nothing;

-- -----------------------------------------------------------------------------
-- 5. Consentimientos que ya constaban como casilla RGPD marcada
--    (solo un booleano: no hay fecha propia ni versión del texto → 'desconocida')
-- -----------------------------------------------------------------------------
insert into crm.consentimientos (contacto_id, tipo, concedido, otorgado_at,
                                 texto_version, origen, fuente_tabla, fuente_id)
select ce.contacto_id, 'privacidad', true, v.recibido_at,
       'desconocida-anterior-al-crm', v.tipo, v.fuente_tabla, v.fuente_id
from _validas v
join crm.contacto_emails ce on ce.email_normalizado = v.email_norm
where v.rgpd is true
on conflict (fuente_tabla, fuente_id, tipo) do nothing;

-- =============================================================================
-- 6. INFORME (se imprime antes del ROLLBACK)
-- =============================================================================

-- 6.1 Resumen por tabla de origen
\echo '=== 6.1 RESUMEN POR TABLA ==='
select fuente_tabla,
       count(*)                                                    as filas_totales,
       count(*) filter (where es_prueba)                           as excluidas_prueba,
       count(*) filter (where not es_prueba and email_norm is null
                        or not es_prueba and email_norm !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') as sin_email_valido,
       count(*) filter (where not es_prueba
                        and email_norm ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') as cargadas
from _stg group by fuente_tabla order by fuente_tabla;

\echo '=== 6.2 CONTACTOS: nuevos creados / total tras el backfill ==='
select (select count(*) from _contactos_nuevos) as contactos_nuevos,
       (select count(*) from crm.contactos)      as contactos_total;

-- 6.3 Filas descartadas por no tener email válido (revisar a mano)
\echo '=== 6.3 FILAS SIN EMAIL VÁLIDO (no cargadas) ==='
select * from _descartadas_sin_email order by recibido_at desc limit 200;

-- 6.4 Duplicados EXACTOS: una misma persona (mismo email normalizado) en varias tablas
\echo '=== 6.4 MISMA PERSONA EN VARIAS TABLAS (fusionados en un solo contacto) ==='
select email_norm,
       count(*) as entradas,
       count(distinct fuente_tabla) as tablas,
       string_agg(distinct fuente_tabla, ', ' order by fuente_tabla) as en_tablas,
       min(recibido_at) as primera_vez, max(recibido_at) as ultima_vez
from _validas
group by email_norm
having count(distinct fuente_tabla) > 1
order by entradas desc, ultima_vez desc;

-- 6.5 Mismo email repetido dentro de UNA misma tabla (reenvíos, dobles envíos)
\echo '=== 6.5 REPETIDOS DENTRO DE LA MISMA TABLA ==='
select fuente_tabla, email_norm, count(*) as veces, min(recibido_at) as primera, max(recibido_at) as ultima
from _validas
group by fuente_tabla, email_norm
having count(*) > 1
order by veces desc
limit 200;

-- 6.6 POSIBLES duplicados que NO se han fusionado (decisión humana)
create temp table _ident as
select distinct email_norm,
       right(regexp_replace(coalesce(telefono, ''), '\D', '', 'g'), 9)           as tel9,
       case when split_part(email_norm, '@', 2) in ('gmail.com', 'googlemail.com')
            then replace(split_part(split_part(email_norm, '@', 1), '+', 1), '.', '') || '@gmail.com'
       end                                                                        as gmail_canon,
       lower(regexp_replace(coalesce(nombre, ''), '\s+', ' ', 'g'))              as nombre_norm
from _validas;

\echo '=== 6.6a MISMO TELÉFONO (últimos 9 dígitos), EMAILS DISTINTOS ==='
select tel9, count(distinct email_norm) as emails, array_agg(distinct email_norm) as emails_lista
from _ident where length(tel9) = 9
group by tel9 having count(distinct email_norm) > 1
order by emails desc;

\echo '=== 6.6b MISMO GMAIL (ignorando puntos y +alias), EMAILS DISTINTOS ==='
select gmail_canon, array_agg(distinct email_norm) as emails_lista
from _ident where gmail_canon is not null
group by gmail_canon having count(distinct email_norm) > 1;

\echo '=== 6.6c MISMO NOMBRE (≥ 8 caracteres), EMAILS DISTINTOS — revisar, puede ser homonimia ==='
select nombre_norm, array_agg(distinct email_norm) as emails_lista
from _ident where length(nombre_norm) >= 8
group by nombre_norm having count(distinct email_norm) > 1
order by nombre_norm limit 200;

-- 6.7 Bajas: contactos marcados "no contactar"
\echo '=== 6.7 CONTACTOS MARCADOS NO CONTACTAR POR BAJA ==='
select count(*) as no_contactar from crm.contactos where no_contactar;

-- -----------------------------------------------------------------------------
-- FIN. Por defecto NO se guarda nada. Revisa el informe y, si es correcto,
-- sustituye ROLLBACK por COMMIT y vuelve a ejecutar.
-- -----------------------------------------------------------------------------
rollback;
-- commit;
