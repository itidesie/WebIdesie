-- =========================================================
-- PROYECTO WEB (idesie.com) — trigger de notificación + job
-- de reconciliación con reintento
--
-- REQUISITOS PREVIOS (ejecutar antes de este archivo, fuera de
-- cualquier migración versionada en git — contienen el secreto
-- real en claro):
--
--   select vault.create_secret(
--     '<EL-SECRETO-COMPARTIDO-REAL>',
--     'crm_shared_secret',
--     'HMAC compartido con la Edge Function del proyecto CRM'
--   );
--
--   alter database postgres
--     set app.crm_webhook_url =
--       'https://<crm-project-ref>.supabase.co/functions/v1/crm-ingest';
--   -- (esto NO es un secreto, es solo la URL — está bien como
--   -- config de base de datos, a diferencia del secreto de arriba)
-- =========================================================

create extension if not exists pg_net;
create extension if not exists pg_cron;

-- Firma y envía el payload de una fila hacia el CRM. La reutilizan
-- tanto el trigger (inserción nueva) como el job de reconciliación
-- (reintento de una fila que falló antes) — una sola implementación
-- de "cómo se firma y se manda", nunca duplicada.
create or replace function public.crm_send_notification(
  p_source_table text,
  p_source_record_id uuid,
  p_record jsonb
) returns void
language plpgsql
security definer
set search_path = public, vault, extensions
as $$
declare
  v_secret text;
  v_payload jsonb;
  v_signature text;
  v_request_id bigint;
begin
  select decrypted_secret into v_secret
  from vault.decrypted_secrets
  where name = 'crm_shared_secret';

  if v_secret is null then
    raise exception 'crm_shared_secret no está configurado en Vault';
  end if;

  v_payload := jsonb_build_object(
    'source_id', 'idesie_web',
    'source_table', p_source_table,
    'source_record_id', p_source_record_id,
    'record', p_record
  );

  -- La Edge Function verifica esta firma sobre el TEXTO exacto de
  -- v_payload::text (JSON de Postgres) — ver functions/crm-ingest,
  -- que firma/verifica sobre el body crudo, nunca sobre un JSON
  -- reserializado por el otro lado (el orden de claves podría
  -- cambiar y romper la comparación).
  v_signature := encode(hmac(v_payload::text, v_secret, 'sha256'), 'hex');

  select net.http_post(
    url := current_setting('app.crm_webhook_url', true),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Signature', v_signature
    ),
    body := v_payload
  ) into v_request_id;

  update public.crm_sync_log
    set request_id = v_request_id,
        status = 'pending',
        last_attempt_at = now(),
        attempts = attempts + 1
    where source_table = p_source_table
      and source_record_id = p_source_record_id;
end;
$$;

-- Función de trigger genérica, reutilizada por las 5 tablas.
-- El bloque exception es la pieza crítica: un fallo de Vault, de
-- pg_net o de red NUNCA debe impedir que el INSERT original en
-- leads/mensajes_contacto/etc. se complete con éxito.
create or replace function public.crm_notify_on_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_sync_log (source_table, source_record_id, status)
  values (TG_TABLE_NAME, NEW.id, 'pending')
  on conflict (source_table, source_record_id) do nothing;

  begin
    perform public.crm_send_notification(TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
  exception when others then
    update public.crm_sync_log
      set status = 'failed',
          attempts = attempts + 1,
          last_attempt_at = now(),
          last_error = sqlerrm
      where source_table = TG_TABLE_NAME
        and source_record_id = NEW.id;
  end;

  return NEW; -- el INSERT original sigue su curso pase lo que pase arriba
end;
$$;

create trigger crm_notify_leads
  after insert on public.leads
  for each row execute function public.crm_notify_on_insert();

create trigger crm_notify_mensajes_contacto
  after insert on public.mensajes_contacto
  for each row execute function public.crm_notify_on_insert();

create trigger crm_notify_solicitudes_admision
  after insert on public.solicitudes_admision
  for each row execute function public.crm_notify_on_insert();

create trigger crm_notify_candidaturas_empleo
  after insert on public.candidaturas_empleo
  for each row execute function public.crm_notify_on_insert();

create trigger crm_notify_descargas_catalogo
  after insert on public.descargas_catalogo
  for each row execute function public.crm_notify_on_insert();

-- Job de reconciliación: resuelve 'pending' cuya respuesta real ya
-- llegó a pg_net, y reintenta 'failed' con backoff exponencial
-- (1, 2, 4, 8, 16 minutos), hasta 5 intentos.
create or replace function public.crm_retry_pending()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  v_row jsonb;
begin
  -- 1. Resolver pendientes cuya respuesta HTTP real ya está en pg_net
  for r in
    select * from public.crm_sync_log
    where status = 'pending' and request_id is not null
  loop
    if exists (
      select 1 from net._http_response
      where id = r.request_id and status_code between 200 and 299
    ) then
      update public.crm_sync_log set status = 'sent' where id = r.id;
    elsif exists (select 1 from net._http_response where id = r.request_id) then
      update public.crm_sync_log
        set status = 'failed', last_error = 'respuesta HTTP no exitosa o timeout'
        where id = r.id;
    end if;
    -- si aún no hay fila en net._http_response, se deja en 'pending'
    -- para revisarlo en el próximo ciclo (la petición sigue en vuelo)
  end loop;

  -- 2. Reintentar fallidos con backoff, releyendo la fila original
  --    de la tabla de origen (los nombres de columna difieren entre
  --    tablas, así que se usa SQL dinámico solo para el SELECT, no
  --    para nada que reciba input externo sin validar)
  for r in
    select * from public.crm_sync_log
    where status = 'failed'
      and attempts < 5
      and (last_attempt_at is null
           or last_attempt_at < now() - (interval '1 minute' * power(2, attempts)))
  loop
    execute format('select to_jsonb(t) from public.%I t where id = $1', r.source_table)
      into v_row
      using r.source_record_id;

    if v_row is not null then
      perform public.crm_send_notification(r.source_table, r.source_record_id, v_row);
    else
      -- la fila original ya no existe (borrada) — reintentar no tiene sentido
      update public.crm_sync_log
        set status = 'failed', last_error = 'fila original no encontrada, se descarta'
        where id = r.id;
    end if;
  end loop;
end;
$$;

select cron.schedule(
  'crm-reconcile',
  '*/5 * * * *',
  $$select public.crm_retry_pending();$$
);
