-- =============================================================================
-- VERIFICACIÓN DE PRODUCCIÓN (SOLO LECTURA)  —  docs/diseno-crm.md, apéndice "POR VERIFICAR"
-- =============================================================================
-- Qué es: dos sentencias SELECT que se pegan en Supabase → SQL Editor. No contienen
-- CREATE, ALTER, INSERT, UPDATE, DELETE ni ninguna función que escriba. Las
-- consultas "dinámicas" (contar filas de todas las tablas, leer el blog…) usan
-- query_to_xml(), que ejecuta un SELECT generado: sigue siendo solo lectura.
--
-- Cómo usarlo (IMPORTANTE: el SQL Editor solo muestra el resultado de la ÚLTIMA sentencia):
--   1) Selecciona SOLO el BLOQUE A (desde "-- ===== BLOQUE A" hasta su punto y coma final)
--      y pulsa Run. Exporta el resultado ("Download CSV" o copiar) y envíamelo.
--   2) Después selecciona SOLO el BLOQUE B y repite. El bloque B toca esquemas internos de
--      Supabase (cron, vault, auth, storage): está separado porque, si tu rol no tuviera
--      permiso sobre alguno, solo falla el B y el A ya lo tienes.
--
-- Qué devuelve: UNA tabla con columnas  seccion | punto | objeto | valor | detalle
--   · seccion → bloque temático (01_…, 02_…) para filtrar/ordenar.
--   · punto   → a qué "⚠️ POR VERIFICAR" (apéndice de docs/diseno-crm.md) responde.
--   · Los valores "FALTA" / "NO" / "OFF" son los que hay que mirar primero.
--
-- Privacidad: NO se devuelve ningún dato personal, contraseña, hash ni token. Solo
-- nombres de tablas/columnas/objetos, recuentos, dominios de imágenes y (del blog y
-- de productos) slugs y títulos. Del cron se muestra el comando truncado a 200
-- caracteres: revísalo antes de compartirlo. De Vault solo NOMBRES de secretos.
--
-- Robustez: cada objeto que pueda no existir se protege con to_regclass()/CASE, y las
-- consultas sobre blog/productos/pedidos comprueban además que existan las columnas que
-- usan (o no las nombran), de modo que un objeto o columna ausente produce una fila
-- "no existe"/"faltan columnas" en vez de un error. Probado en un Postgres local (BD vacía,
-- BD con las migraciones del repositorio y dentro de una transacción READ ONLY).
-- Nota: usa las funciones XML de Postgres (query_to_xml/xpath). Si el editor respondiera
-- "unsupported XML feature", avísame: hay una variante sin XML.
-- =============================================================================


-- ===== BLOQUE A =============================================================
with
-- Esquemas internos de Supabase/Postgres que NO cuentan como "esquemas de la aplicación".
esquemas_internos(s) as (
  values ('auth'), ('storage'), ('realtime'), ('vault'), ('extensions'), ('graphql'),
         ('graphql_public'), ('pgsodium'), ('pgsodium_masks'), ('supabase_functions'),
         ('supabase_migrations'), ('net'), ('cron'), ('pgbouncer'), ('_realtime'),
         ('_analytics'), ('_supavisor'), ('pgtle'), ('repack'), ('information_schema')
),

-- Tablas de la aplicación (todas, de todos los esquemas no internos).
tablas as (
  select n.nspname::text                                   as esquema,
         c.relname::text                                   as tabla,
         c.oid                                             as oid,
         c.relrowsecurity                                  as rls,
         greatest(coalesce(st.n_live_tup, 0), greatest(c.reltuples, 0))::bigint as filas_aprox,
         pg_get_userbyid(c.relowner)::text                 as dueno
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  left join pg_stat_all_tables st on st.relid = c.oid
  where c.relkind in ('r', 'p')
    and n.nspname !~ '^pg_'
    and n.nspname not in (select s from esquemas_internos)
),

-- ---------------------------------------------------------------------------------
-- 01 · TABLAS
-- Responde a: Apéndice #1 (lista de tablas de producción y nº de filas; existencia real
--             de `applications`, `leads`, etc.). Filas: exactas (BD pequeña) y aproximadas.
-- ---------------------------------------------------------------------------------
s01 as (
  select '01_tablas'::text as seccion, 'Apéndice #1'::text as punto,
         t.esquema || '.' || t.tabla as objeto,
         ex.filas_exactas::text as valor,
         'aprox=' || t.filas_aprox
           || ' | RLS=' || case when t.rls then 'on' else 'OFF' end
           || ' | dueño=' || t.dueno
           || ' | tamaño=' || pg_size_pretty(pg_total_relation_size(t.oid)) as detalle,
         t.esquema || '.' || t.tabla as k
  from tablas t
  cross join lateral (
    select (xpath('/row/c/text()',
             query_to_xml(format('select count(*) as c from %I.%I', t.esquema, t.tabla), false, true, '')))[1]::text::bigint
           as filas_exactas
  ) ex
),

-- Vistas y vistas materializadas de la aplicación.
-- Responde a: Apéndice #1.
s01b as (
  select '01_tablas', 'Apéndice #1',
         n.nspname || '.' || c.relname,
         case c.relkind when 'v' then 'vista' else 'vista materializada' end,
         'dueño=' || pg_get_userbyid(c.relowner),
         n.nspname || '.' || c.relname
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where c.relkind in ('v', 'm')
    and n.nspname !~ '^pg_'
    and n.nspname not in (select s from esquemas_internos)
),

-- Esquemas de la aplicación (¿existe ya `crm` o `api_web`?).
-- Responde a: Apéndice #1 / #7.
s01c as (
  select '01_tablas', 'Apéndice #1',
         'esquema ' || n.nspname, 'existe', 'dueño=' || pg_get_userbyid(n.nspowner), 'esquema ' || n.nspname
  from pg_namespace n
  where n.nspname !~ '^pg_' and n.nspname not in (select s from esquemas_internos)
),

-- ---------------------------------------------------------------------------------
-- 02 · COLUMNAS de todas las tablas de `public`
-- Responde a: Apéndice #15 (los nombres de columna del backfill y de los bocetos SQL
--             proceden de las migraciones del repositorio, no de la BD real).
-- ---------------------------------------------------------------------------------
s02 as (
  select '02_columnas', 'Apéndice #15',
         t.esquema || '.' || t.tabla || '.' || a.attname,
         format_type(a.atttypid, a.atttypmod),
         'nullable=' || case when a.attnotnull then 'NO' else 'SI' end
           || coalesce(' | default=' || pg_get_expr(d.adbin, d.adrelid), '')
           || case when a.attgenerated <> '' then ' | generada' else '' end,
         t.esquema || '.' || t.tabla || '.' || lpad(a.attnum::text, 4, '0')
  from tablas t
  join pg_attribute a on a.attrelid = t.oid and a.attnum > 0 and not a.attisdropped
  left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
  where t.esquema = 'public'
),

-- Columnas que el diseño y el backfill DAN POR HECHAS: solo se muestran las que FALTAN.
-- Responde a: Apéndice #15.
esperadas(tabla, columna) as (
  values
   ('leads','id'),('leads','first_name'),('leads','last_name'),('leads','email'),('leads','phone'),
   ('leads','master_interes'),('leads','origen'),('leads','status'),('leads','session_date'),('leads','session_time'),('leads','created_at'),
   ('solicitudes_admision','id'),('solicitudes_admision','nombre_completo'),('solicitudes_admision','email'),
   ('solicitudes_admision','telefono'),('solicitudes_admision','pais'),('solicitudes_admision','ciudad'),
   ('solicitudes_admision','fecha_nacimiento'),('solicitudes_admision','titulacion_previa'),
   ('solicitudes_admision','universidad_origen'),('solicitudes_admision','programa_solicitado'),
   ('solicitudes_admision','origen'),('solicitudes_admision','mensaje'),('solicitudes_admision','rgpd_aceptado'),
   ('solicitudes_admision','estado'),('solicitudes_admision','cv_url'),('solicitudes_admision','created_at'),
   ('mensajes_contacto','id'),('mensajes_contacto','nombre'),('mensajes_contacto','email'),('mensajes_contacto','telefono'),
   ('mensajes_contacto','asunto'),('mensajes_contacto','mensaje'),('mensajes_contacto','motivo'),
   ('mensajes_contacto','programa'),('mensajes_contacto','created_at'),
   ('descargas_catalogo','id'),('descargas_catalogo','nombre'),('descargas_catalogo','email'),
   ('descargas_catalogo','telefono'),('descargas_catalogo','catalogo_id'),('descargas_catalogo','catalogo_nombre'),
   ('descargas_catalogo','programa'),('descargas_catalogo','rgpd_aceptado'),('descargas_catalogo','created_at'),
   ('candidaturas_empleo','id'),('candidaturas_empleo','oferta_id'),('candidaturas_empleo','oferta_puesto'),
   ('candidaturas_empleo','nombre'),('candidaturas_empleo','email'),('candidaturas_empleo','telefono'),
   ('candidaturas_empleo','mensaje'),('candidaturas_empleo','cv_url'),('candidaturas_empleo','created_at'),
   ('solicitudes_baja','id'),('solicitudes_baja','email'),('solicitudes_baja','motivo'),
   ('solicitudes_baja','estado'),('solicitudes_baja','created_at'),
   ('orders','id'),('orders','customer_email'),('orders','customer_name'),('orders','customer_phone'),
   ('orders','payment_id'),('orders','status'),('orders','total_amount'),('orders','created_at'),
   ('order_items','id'),('order_items','order_id'),('order_items','product_id'),('order_items','product_name'),
   ('order_items','quantity'),('order_items','price'),
   ('coupons','id'),('coupons','code'),('coupons','discount_type'),('coupons','discount_value'),
   ('coupons','is_active'),('coupons','valid_from'),('coupons','valid_until'),('coupons','max_uses'),('coupons','current_uses'),
   ('rate_limits','bucket'),('rate_limits','key_hash'),('rate_limits','window_start'),('rate_limits','hits'),
   ('productos','id'),('productos','slug'),('productos','tipo'),('productos','nombre'),('productos','precio_actual'),
   ('productos','precio_original'),('productos','precio_matricula'),('productos','categoria'),('productos','activo'),
   ('productos','imagen'),('productos','descripcion_larga'),
   ('ofertas_empleo','id'),('ofertas_empleo','puesto'),('ofertas_empleo','empresa'),('ofertas_empleo','activa'),
   ('blog_posts','id'),('blog_posts','slug'),('blog_posts','title'),('blog_posts','content'),('blog_posts','excerpt'),
   ('blog_posts','author'),('blog_posts','published'),('blog_posts','tags'),('blog_posts','featured_image_url'),
   ('blog_posts','created_at'),('blog_posts','updated_at')
),
s02b as (
  select '02_columnas_esperadas', 'Apéndice #15',
         'public.' || e.tabla || '.' || e.columna,
         'FALTA',
         case when to_regclass('public.' || e.tabla) is null then 'la TABLA no existe' else 'la tabla existe pero no la columna' end,
         'public.' || e.tabla || '.' || e.columna
  from esperadas e
  where not exists (
    select 1 from pg_attribute a
    where a.attrelid = to_regclass('public.' || e.tabla) and a.attname = e.columna and not a.attisdropped
  )
),

-- ---------------------------------------------------------------------------------
-- 03 · MIGRACIONES del repositorio (scripts/*.sql y crm-integration/sql/*.sql):
--      se comprueba la EXISTENCIA de objetos concretos de cada una.
-- Responde a: Apéndice #1 (qué scripts están aplicados) y #7 (¿se aplicó algo de crm-integration?).
-- ---------------------------------------------------------------------------------
comprobaciones(script, comprobacion, ok) as (
  values
   ('001', 'tabla blog_posts',                       to_regclass('public.blog_posts') is not null),
   ('002', 'tabla admin_users',                      to_regclass('public.admin_users') is not null),
   ('007/010', 'tabla coupons',                      to_regclass('public.coupons') is not null),
   ('007/010', 'índice único sobre coupons(code)',   exists (select 1 from pg_indexes where schemaname = 'public' and tablename = 'coupons' and indexdef ilike '%unique%(code)%')),
   ('015', 'tabla applications (existió)',           true),   -- ver 031 y la sección 04: aquí solo se documenta
   ('020', 'tabla leads',                            to_regclass('public.leads') is not null),
   ('020', 'función public.set_updated_at',          exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'set_updated_at')),
   ('020', 'trigger set_leads_updated_at',           exists (select 1 from pg_trigger where tgname = 'set_leads_updated_at' and not tgisinternal)),
   ('020', 'RLS activado en leads',                  coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.leads')), false)),
   ('021', 'tabla productos',                        to_regclass('public.productos') is not null),
   ('021', 'policy productos_select_activos',        exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'productos' and policyname = 'productos_select_activos')),
   ('022', 'tabla orders',                           to_regclass('public.orders') is not null),
   ('022', 'tabla order_items',                      to_regclass('public.order_items') is not null),
   ('022', 'RLS activado en blog_posts',             coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.blog_posts')), false)),
   ('022', 'RLS activado en admin_users',            coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.admin_users')), false)),
   ('023', 'tabla producto_modulos',                 to_regclass('public.producto_modulos') is not null),
   ('023', 'tabla modulo_temas',                     to_regclass('public.modulo_temas') is not null),
   ('023', 'tabla producto_dirigido',                to_regclass('public.producto_dirigido') is not null),
   ('023', 'tabla producto_objetivos',               to_regclass('public.producto_objetivos') is not null),
   ('023', 'tabla producto_faqs',                    to_regclass('public.producto_faqs') is not null),
   ('023', 'tabla producto_requisitos',              to_regclass('public.producto_requisitos') is not null),
   ('023', 'tabla producto_testimonios',             to_regclass('public.producto_testimonios') is not null),
   ('024', 'columna productos.precio_matricula',     exists (select 1 from pg_attribute where attrelid = to_regclass('public.productos') and attname = 'precio_matricula' and not attisdropped)),
   ('025', 'columna productos.categoria',            exists (select 1 from pg_attribute where attrelid = to_regclass('public.productos') and attname = 'categoria' and not attisdropped)),
   ('026', 'productos.precio_actual admite NULL',    exists (select 1 from pg_attribute where attrelid = to_regclass('public.productos') and attname = 'precio_actual' and not attnotnull and not attisdropped)),
   ('027', 'tabla ofertas_empleo',                   to_regclass('public.ofertas_empleo') is not null),
   ('027', 'tabla candidaturas_empleo',              to_regclass('public.candidaturas_empleo') is not null),
   ('028', 'tabla solicitudes_admision',             to_regclass('public.solicitudes_admision') is not null),
   ('029', 'tabla mensajes_contacto',                to_regclass('public.mensajes_contacto') is not null),
   ('030', 'tabla admin_sessions',                   to_regclass('public.admin_sessions') is not null),
   ('031', 'tabla applications ELIMINADA',           to_regclass('public.applications') is null),
   ('032', 'tabla descargas_catalogo',               to_regclass('public.descargas_catalogo') is not null),
   ('033', 'índice único leads_slot_unico',          exists (select 1 from pg_indexes where schemaname = 'public' and indexname = 'leads_slot_unico')),
   ('034', 'columna mensajes_contacto.telefono',     exists (select 1 from pg_attribute where attrelid = to_regclass('public.mensajes_contacto') and attname = 'telefono' and not attisdropped)),
   ('035', 'tabla rate_limits',                      to_regclass('public.rate_limits') is not null),
   ('035', 'función public.rate_limit_hit',          exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'rate_limit_hit')),
   ('036', 'tabla solicitudes_baja',                 to_regclass('public.solicitudes_baja') is not null),
   -- crm-integration/ (diseño DESCARTADO): comprobar que NO se aplicó nada en este proyecto.
   ('crm-integration/02', 'tabla crm_sync_log (NO debería existir)', to_regclass('public.crm_sync_log') is null),
   ('crm-integration/03', 'función crm_send_notification (NO debería existir)', not exists (select 1 from pg_proc where proname = 'crm_send_notification')),
   ('crm-integration/03', 'triggers crm_notify_* (NO deberían existir)', not exists (select 1 from pg_trigger where tgname like 'crm\_notify\_%' and not tgisinternal)),
   ('crm-integration/01', 'tablas contacts/submissions/sources en public (NO deberían existir)',
        to_regclass('public.contacts') is null and to_regclass('public.submissions') is null and to_regclass('public.sources') is null)
),
s03 as (
  select '03_migraciones', 'Apéndice #1', 'scripts/' || c.script || ' · ' || c.comprobacion,
         case when c.ok then 'OK' else 'FALTA' end,
         case when c.script like 'crm-integration%' then 'aquí OK = no está aplicado (correcto)' else '' end,
         c.script || ' ' || c.comprobacion
  from comprobaciones c
),
s03b as (
  select '03_migraciones_resumen', 'Apéndice #1', 'scripts/' || c.script,
         case when c.script like 'crm-integration%'
              then case when bool_and(c.ok) then 'NO aplicado (correcto)' else 'APLICADO O A MEDIAS (revisar)' end
              else case when bool_and(c.ok) then 'APLICADA' else 'INCOMPLETA/NO APLICADA' end end,
         coalesce(string_agg(c.comprobacion, '; ') filter (where not c.ok), ''),
         c.script
  from comprobaciones c
  where c.script <> '015'
  group by c.script
),

-- ---------------------------------------------------------------------------------
-- 04 · ¿EXISTE `applications`?
-- Responde a: Apéndice #1 (¿se ejecutó el DROP de la migración 031?).
-- ---------------------------------------------------------------------------------
s04 as (
  select '04_applications', 'Apéndice #1', 'public.applications',
         case when to_regclass('public.applications') is null then 'NO existe (correcto: 031 aplicada)' else 'EXISTE (031 NO aplicada)' end,
         coalesce((select 'filas_aprox=' || greatest(reltuples, 0)::bigint from pg_class where oid = to_regclass('public.applications')), ''),
         'public.applications'
),

-- ---------------------------------------------------------------------------------
-- 05 · FILAS DE PRUEBA
-- Responde a: Apéndice #2 (marcador real de las filas de prueba y dónde aparece).
--   05a: por TABLA (busca el patrón en TODA la fila, como hace el backfill).
--   05b: por COLUMNA de texto (solo el patrón PRUEBA-PREVIEW): dice en qué campos aparece.
--   Se excluyen admin_users, admin_sessions y rate_limits (credenciales / contadores).
-- ---------------------------------------------------------------------------------
patrones(p) as (
  values ('PRUEBA-PREVIEW'), ('prueba'), ('@example.'), ('test@')
),
tablas_datos as (
  select * from tablas
  where esquema = 'public' and tabla not in ('admin_users', 'admin_sessions', 'rate_limits')
),
s05a as (
  select '05_pruebas_por_tabla', 'Apéndice #2',
         t.esquema || '.' || t.tabla, q.n::text, 'patrón: ' || p.p,
         t.esquema || '.' || t.tabla || '.' || p.p
  from tablas_datos t
  cross join patrones p
  cross join lateral (
    select (xpath('/row/c/text()',
             query_to_xml(format('select count(*) as c from %I.%I x where to_jsonb(x)::text ilike %L',
                                 t.esquema, t.tabla, '%' || p.p || '%'), false, true, '')))[1]::text::bigint as n
  ) q
  where q.n > 0
),
cols_texto as (
  select t.esquema, t.tabla, a.attname::text as columna
  from tablas_datos t
  join pg_attribute a on a.attrelid = t.oid and a.attnum > 0 and not a.attisdropped
  where a.atttypid::regtype::text in ('text', 'character varying', 'character', 'jsonb', 'json')
),
s05b as (
  select '05_pruebas_por_columna', 'Apéndice #2',
         c.esquema || '.' || c.tabla || '.' || c.columna, q.n::text, 'patrón: PRUEBA-PREVIEW',
         c.esquema || '.' || c.tabla || '.' || c.columna
  from cols_texto c
  cross join lateral (
    select (xpath('/row/c/text()',
             query_to_xml(format('select count(*) as c from %I.%I x where x.%I::text ilike %L',
                                 c.esquema, c.tabla, c.columna, '%PRUEBA-PREVIEW%'), false, true, '')))[1]::text::bigint as n
  ) q
  where q.n > 0
),

-- ---------------------------------------------------------------------------------
-- Consultas dinámicas protegidas: cada una devuelve UN jsonb (array de filas). Si la
-- tabla no existe se ejecuta un SELECT vacío en su lugar (no hay error).
-- ---------------------------------------------------------------------------------
dinamicas(clave, consulta) as (
  values
   -- 06 · blog: resumen. Responde a: Apéndice #3.
   ('blog_resumen',
    case when (select count(*) from pg_attribute where attrelid = to_regclass('public.blog_posts') and not attisdropped and attname in ('published','created_at','slug','title','content','featured_image_url')) < 6 then 'select 1 where false' else
     $q$select count(*) as total_posts,
               count(*) filter (where published is true)  as publicados,
               count(*) filter (where published is false) as no_publicados,
               count(*) filter (where published is null)  as sin_dato,
               min(created_at) as primer_post, max(created_at) as ultimo_post
        from public.blog_posts$q$ end),
   -- 06 · blog: dominios de las imágenes (destacada + <img> del contenido). Responde a: Apéndice #3.
   ('blog_dominios',
    case when (select count(*) from pg_attribute where attrelid = to_regclass('public.blog_posts') and not attisdropped and attname in ('published','created_at','slug','title','content','featured_image_url')) < 6 then 'select 1 where false' else
     $q$select coalesce(substring(u from 'https?://([^/ ?#]+)'), '(ruta relativa o vacía)') as dominio, count(*) as n
        from (
          select featured_image_url as u from public.blog_posts
           where featured_image_url is not null and featured_image_url <> ''
          union all
          select (regexp_matches(content, '<img[^>]+src=[\x22\x27]([^\x22\x27]+)[\x22\x27]', 'gi'))[1]
            from public.blog_posts
        ) x group by 1 order by 2 desc$q$ end),
   -- 06 · blog: lista de posts con la URL pública que tienen hoy (fecha en UTC). Responde a: Apéndice #3.
   ('blog_lista',
    case when (select count(*) from pg_attribute where attrelid = to_regclass('public.blog_posts') and not attisdropped and attname in ('published','created_at','slug','title','content','featured_image_url')) < 6 then 'select 1 where false' else
     $q$select slug, published as publicado,
               '/blog/' || to_char(created_at at time zone 'UTC', 'YYYY/MM/DD') || '/' || slug as url_actual,
               to_char(created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI') as creado_utc,
               length(content) as caracteres, left(title, 70) as titulo
        from public.blog_posts order by created_at limit 200$q$ end),
   -- 07 · productos: id → slug. Responde a: Apéndice #4.
   ('productos_ids',
    case when to_regclass('public.productos') is null then 'select 1 where false' else
     -- to_jsonb(p) evita nombrar columnas: funciona aunque falten precio_matricula, categoria… (024–026).
     $q$select to_jsonb(p) - 'descripcion_larga' - 'descripcion_corta' as f
        from public.productos p order by (to_jsonb(p) ->> 'id')::bigint$q$ end),
   -- 07 · ids de producto realmente usados en pedidos. Responde a: Apéndice #4.
   ('order_items_ids',
    case when (select count(*) from pg_attribute where attrelid = to_regclass('public.order_items') and not attisdropped and attname in ('product_id','product_name','quantity')) < 3 then 'select 1 where false' else
     $q$select product_id, left(product_name, 60) as product_name, count(*) as lineas, sum(quantity) as unidades
        from public.order_items group by 1, 2 order by 1$q$ end)
),
dinamicas_res as (
  select d.clave,
         coalesce(nullif(
           replace(replace(replace(
             (xpath('/row/j/text()',
               query_to_xml(format('select coalesce(jsonb_agg(to_jsonb(x)), ''[]''::jsonb) as j from (%s) x', d.consulta),
                            false, true, '')))[1]::text,
             '&lt;', '<'), '&gt;', '>'), '&amp;', '&'), ''), '[]')::jsonb as j
  from dinamicas d
),

s06_estado as (   -- Responde a: Apéndice #3
  select '06_blog', 'Apéndice #3', 'blog_posts · estado',
         case
           when to_regclass('public.blog_posts') is null then 'la tabla blog_posts NO existe'
           when (select count(*) from pg_attribute where attrelid = to_regclass('public.blog_posts') and not attisdropped
                   and attname in ('published','created_at','slug','title','content','featured_image_url')) < 6
             then 'existe pero FALTAN COLUMNAS (ver 02_columnas_esperadas)'
           else 'OK' end,
         '', '0 estado'
),
s06a as (      -- Responde a: Apéndice #3
  select '06_blog', 'Apéndice #3', 'blog_posts · resumen', kv.key, coalesce(kv.value, ''), 'a ' || kv.key
  from dinamicas_res r, lateral jsonb_each_text(r.j -> 0) kv
  where r.clave = 'blog_resumen'
),
s06b as (      -- Responde a: Apéndice #3
  select '06_blog', 'Apéndice #3', 'imágenes · dominio', e ->> 'dominio', 'n=' || (e ->> 'n'), 'b ' || (e ->> 'dominio')
  from dinamicas_res r, jsonb_array_elements(r.j) e where r.clave = 'blog_dominios'
),
s06c as (      -- Responde a: Apéndice #3
  select '06_blog', 'Apéndice #3', 'post · ' || (e ->> 'slug'),
         'publicado=' || coalesce(e ->> 'publicado', 'null'),
         (e ->> 'url_actual') || ' | ' || (e ->> 'creado_utc') || ' UTC | ' || (e ->> 'caracteres') || ' car. | ' || coalesce(e ->> 'titulo', ''),
         'c ' || (e ->> 'creado_utc')
  from dinamicas_res r, jsonb_array_elements(r.j) e where r.clave = 'blog_lista'
),

s07a as (      -- Responde a: Apéndice #4
  select '07_productos_id_slug', 'Apéndice #4', 'productos.id = ' || (e -> 'f' ->> 'id'), coalesce(e -> 'f' ->> 'slug', '(sin slug)'),
         coalesce(e -> 'f' ->> 'tipo', '') || ' | activo=' || coalesce(e -> 'f' ->> 'activo', 'null')
           || ' | precio=' || coalesce(e -> 'f' ->> 'precio_actual', 'null')
           || ' | matrícula=' || case when jsonb_exists(e -> 'f', 'precio_matricula')
                                      then coalesce(e -> 'f' ->> 'precio_matricula', 'null') else '(columna no existe)' end
           || ' | ' || left(coalesce(e -> 'f' ->> 'nombre', ''), 60),
         'a ' || lpad(e -> 'f' ->> 'id', 8, '0')
  from dinamicas_res r, jsonb_array_elements(r.j) e where r.clave = 'productos_ids'
),
s07b as (      -- Responde a: Apéndice #4
  select '07_order_items_product_id', 'Apéndice #4', 'order_items.product_id = ' || coalesce(e ->> 'product_id', 'null'),
         'líneas=' || (e ->> 'lineas'),
         'unidades=' || coalesce(e ->> 'unidades', '0') || ' | ' || coalesce(e ->> 'product_name', ''),
         'b ' || lpad(coalesce(e ->> 'product_id', ''), 8, '0')
  from dinamicas_res r, jsonb_array_elements(r.j) e where r.clave = 'order_items_ids'
),

-- ---------------------------------------------------------------------------------
-- 08 · EXTENSIONES, VERSIÓN Y AJUSTES DEL SERVIDOR
-- Responde a: Apéndice #5 (versión de pg_cron —¿admite segundos, ≥1.5?—, btree_gist
--             disponible, conexiones máximas) y #6 (límites de conexión).
-- ---------------------------------------------------------------------------------
s08a as (
  select '08_extensiones_instaladas', 'Apéndice #5', e.extname::text, e.extversion::text, 'esquema=' || n.nspname, e.extname::text
  from pg_extension e join pg_namespace n on n.oid = e.extnamespace
),
s08b as (
  select '08_extensiones_relevantes', 'Apéndice #5', x.name, 'instalada=' || coalesce(x.installed_version, 'NO'),
         'disponible=' || case when x.default_version is null then 'NO' else 'sí (v' || x.default_version || ')' end,
         x.name
  from (
    select w.name, ae.default_version, ae.installed_version
    from (values ('pg_cron'), ('pg_net'), ('btree_gist'), ('pgcrypto'), ('uuid-ossp'), ('pg_stat_statements'),
                 ('supabase_vault'), ('pg_trgm'), ('unaccent'), ('citext'), ('pgjwt'), ('pg_graphql')) w(name)
    left join pg_available_extensions ae on ae.name = w.name
  ) x
),
s08c as (
  select '08_servidor', 'Apéndice #5', s.k, s.v, s.d, s.k
  from (
    values ('version', version(), ''),
           ('server_version_num', current_setting('server_version_num'), ''),
           ('max_connections', current_setting('max_connections'), 'límite global; el pooler tiene los suyos'),
           ('timezone', current_setting('TimeZone'), ''),
           ('shared_preload_libraries', coalesce(nullif(current_setting('shared_preload_libraries', true), ''), '(vacío)'), 'pg_cron debe aparecer aquí para funcionar'),
           ('cron.database_name', coalesce(current_setting('cron.database_name', true), '(no definido)'), 'solo si pg_cron está cargado'),
           ('current_user', current_user::text, 'rol con el que se ha ejecutado esta consulta'),
           ('current_database', current_database()::text, '')
  ) s(k, v, d)
),

-- ---------------------------------------------------------------------------------
-- 09 · ROLES, DUEÑOS Y PERMISOS
-- Responde a: Apéndice #7 (rol creador de objetos para ALTER DEFAULT PRIVILEGES) y
--             #6 (roles existentes; esquemas expuestos por la Data API en `authenticator`).
-- ---------------------------------------------------------------------------------
s09a as (
  select '09_roles', 'Apéndice #7', r.rolname::text,
         'login=' || r.rolcanlogin || ' | super=' || r.rolsuper || ' | bypassrls=' || r.rolbypassrls,
         'connlimit=' || r.rolconnlimit || coalesce(' | config=' || array_to_string(r.rolconfig, ', '), ''),
         r.rolname::text
  from pg_roles r where r.rolname !~ '^pg_'
),
s09b as (
  select '09_dueños_objetos_public', 'Apéndice #7', 'dueño ' || x.dueno, x.tipo || ': ' || x.n, '', x.dueno || x.tipo
  from (
    select pg_get_userbyid(c.relowner)::text as dueno,
           case c.relkind when 'r' then 'tablas' when 'p' then 'tablas' when 'v' then 'vistas' when 'm' then 'vistas' when 'S' then 'secuencias' else 'otros' end as tipo,
           count(*) as n
    from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'p', 'v', 'm', 'S')
    group by 1, 2
    union all
    select pg_get_userbyid(p.proowner)::text, 'funciones', count(*)
    from pg_proc p where p.pronamespace = 'public'::regnamespace
      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
    group by 1
  ) x
),
s09c as (
  -- Permisos actuales sobre las tablas de public (¿siguen los permisos por defecto de Supabase a anon/authenticated?).
  select '09_permisos_tablas_public', 'Apéndice #7',
         case when a.grantee = 0 then 'PUBLIC' else a.grantee::regrole::text end,
         a.privilege_type || ' en ' || count(*) || ' tablas', '',
         (case when a.grantee = 0 then 'PUBLIC' else a.grantee::regrole::text end) || a.privilege_type
  from pg_class c, lateral aclexplode(c.relacl) a
  where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'p')
  group by a.grantee, a.privilege_type
),
s09d as (
  select '09_permisos_por_defecto', 'Apéndice #7',
         'para objetos creados por ' || d.defaclrole::regrole::text,
         'esquema=' || coalesce(n.nspname, '(todos)') || ' tipo=' || d.defaclobjtype::text, d.defaclacl::text,
         d.defaclrole::regrole::text || coalesce(n.nspname, '') || d.defaclobjtype::text
  from pg_default_acl d left join pg_namespace n on n.oid = d.defaclnamespace
),

-- ---------------------------------------------------------------------------------
-- 10 · TRIGGERS, FUNCIONES, POLÍTICAS, REALTIME
-- Responde a: Apéndice #1 y #7 (¿existe algo de crm-integration?), #5 (¿qué tablas ya están
--             en la publicación de Realtime?).
-- ---------------------------------------------------------------------------------
s10a as (
  select '10_triggers', 'Apéndice #1', n.nspname || '.' || c.relname || ' · ' || t.tgname,
         case t.tgenabled when 'O' then 'activo' when 'D' then 'DESACTIVADO' else t.tgenabled::text end,
         pg_get_triggerdef(t.oid), n.nspname || c.relname || t.tgname
  from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  join pg_namespace n on n.oid = c.relnamespace
  where not t.tgisinternal and n.nspname !~ '^pg_' and n.nspname not in (select s from esquemas_internos)
),
s10b as (
  select '10_funciones', 'Apéndice #1', n.nspname || '.' || p.proname,
         'security_definer=' || p.prosecdef,
         'dueño=' || pg_get_userbyid(p.proowner) || ' | args=(' || pg_get_function_identity_arguments(p.oid) || ')',
         n.nspname || p.proname || p.oid::text
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname !~ '^pg_' and n.nspname not in (select s from esquemas_internos)
    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
),
s10c as (
  select '10_politicas_rls', 'Apéndice #1', p.schemaname || '.' || p.tablename || ' · ' || p.policyname,
         p.cmd, 'roles=' || array_to_string(p.roles, ','), p.schemaname || p.tablename || p.policyname
  from pg_policies p
  where p.schemaname !~ '^pg_' and p.schemaname not in (select s from esquemas_internos)
),
s10d as (
  select '10_realtime_publicacion', 'Apéndice #5', pt.schemaname || '.' || pt.tablename, 'en supabase_realtime', '', pt.schemaname || pt.tablename
  from pg_publication_tables pt where pt.pubname = 'supabase_realtime'
)

select seccion, punto, objeto, valor, detalle
from (
  select * from s01  union all select * from s01b union all select * from s01c union all
  select * from s02  union all select * from s02b union all
  select * from s03  union all select * from s03b union all
  select * from s04  union all
  select * from s05a union all select * from s05b union all
  select * from s06_estado union all select * from s06a union all select * from s06b union all select * from s06c union all
  select * from s07a union all select * from s07b union all
  select * from s08a union all select * from s08b union all select * from s08c union all
  select * from s09a union all select * from s09b union all select * from s09c union all select * from s09d union all
  select * from s10a union all select * from s10b union all select * from s10c union all select * from s10d
) todo
order by seccion, k;
-- ===== FIN BLOQUE A =========================================================


-- ===== BLOQUE B (ejecutar APARTE) ==========================================
-- Toca esquemas internos de Supabase (cron, vault, auth, storage). Cada objeto está
-- protegido con to_regclass(): si no existe (p. ej. pg_cron no instalado) devuelve una
-- fila "no existe". Si tu rol no tuviera permiso sobre alguno de esos esquemas,
-- solo fallaría ESTE bloque (el A ya está completo).
with
dinamicas(clave, consulta) as (
  values
   -- Jobs de pg_cron. Responde a: Apéndice #5 (¿hay jobs?, ¿qué versión y qué frecuencia?)
   -- y #1 (¿se aplicó `crm-integration/03`, job 'crm-reconcile'?). Comando truncado a 200 car.
   ('cron_jobs',
    case when to_regclass('cron.job') is null then 'select 1 where false' else
     $q$select jobid, jobname, schedule, active, left(command, 200) as command from cron.job order by jobid$q$ end),
   -- Nombres (NUNCA valores) de secretos de Vault. Responde a: Apéndice #1 (¿existe `crm_shared_secret`?).
   ('vault_secretos',
    case when to_regclass('vault.secrets') is null then 'select 1 where false' else
     $q$select name, left(coalesce(description, ''), 80) as description, created_at from vault.secrets order by name$q$ end),
   -- Usuarios de Supabase Auth (solo recuento). Responde a: Apéndice #9 (¿se usa Auth ya?; base del CRM).
   ('auth_resumen',
    case when to_regclass('auth.users') is null then 'select 1 where false' else
     $q$select count(*) as usuarios, count(*) filter (where last_sign_in_at is not null) as con_sesion_alguna_vez from auth.users$q$ end),
   -- Buckets de Storage y nº de objetos. Responde a: Apéndice #3 (¿hay imágenes del blog en Supabase Storage?).
   ('storage_buckets',
    case when to_regclass('storage.buckets') is null or to_regclass('storage.objects') is null then 'select 1 where false' else
     $q$select b.name as bucket, b.public as publico, count(o.id) as objetos
        from storage.buckets b left join storage.objects o on o.bucket_id = b.id
        group by b.name, b.public order by b.name$q$ end)
),
dinamicas_res as (
  select d.clave,
         coalesce(nullif(
           replace(replace(replace(
             (xpath('/row/j/text()',
               query_to_xml(format('select coalesce(jsonb_agg(to_jsonb(x)), ''[]''::jsonb) as j from (%s) x', d.consulta),
                            false, true, '')))[1]::text,
             '&lt;', '<'), '&gt;', '>'), '&amp;', '&'), ''), '[]')::jsonb as j
  from dinamicas d
),
b1 as (
  select 'B1_pg_cron_jobs' as seccion, 'Apéndice #5 / #1' as punto,
         'job ' || (e ->> 'jobid') || ' · ' || coalesce(e ->> 'jobname', '(sin nombre)') as objeto,
         (e ->> 'schedule') || ' | activo=' || coalesce(e ->> 'active', 'null') as valor,
         coalesce(e ->> 'command', '') as detalle, lpad(e ->> 'jobid', 8, '0') as k
  from dinamicas_res r, jsonb_array_elements(r.j) e where r.clave = 'cron_jobs'
  union all
  select 'B1_pg_cron_jobs', 'Apéndice #5 / #1', 'pg_cron',
         case when to_regclass('cron.job') is null then 'cron.job NO existe (pg_cron no instalado)' else 'instalado' end, '', '0'
),
b2 as (
  select 'B2_vault_nombres_de_secretos', 'Apéndice #1', 'secreto ' || (e ->> 'name'), 'existe',
         coalesce(e ->> 'description', '') || ' | creado=' || coalesce(e ->> 'created_at', ''), e ->> 'name'
  from dinamicas_res r, jsonb_array_elements(r.j) e where r.clave = 'vault_secretos'
  union all
  select 'B2_vault_nombres_de_secretos', 'Apéndice #1', 'vault.secrets',
         case when to_regclass('vault.secrets') is null then 'no existe' else 'accesible' end, '', '0'
),
b3 as (
  select 'B3_auth', 'Apéndice #9', 'auth.users', 'usuarios=' || (e ->> 'usuarios'),
         'con_sesion_alguna_vez=' || (e ->> 'con_sesion_alguna_vez'), '0'
  from dinamicas_res r, jsonb_array_elements(r.j) e where r.clave = 'auth_resumen'
  union all
  select 'B3_auth', 'Apéndice #9', 'auth.users', case when to_regclass('auth.users') is null then 'no existe' else 'accesible' end, '', '1'
),
b4 as (
  select 'B4_storage', 'Apéndice #3', 'bucket ' || (e ->> 'bucket'), 'objetos=' || (e ->> 'objetos'),
         'público=' || coalesce(e ->> 'publico', 'null'), e ->> 'bucket'
  from dinamicas_res r, jsonb_array_elements(r.j) e where r.clave = 'storage_buckets'
  union all
  select 'B4_storage', 'Apéndice #3', 'storage', case when to_regclass('storage.buckets') is null then 'no existe' else 'accesible' end, '', '0'
)
select seccion, punto, objeto, valor, detalle
from (select * from b1 union all select * from b2 union all select * from b3 union all select * from b4) todo
order by seccion, k;
-- ===== FIN BLOQUE B =========================================================
