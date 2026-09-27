-- =========================================================
-- PROYECTO WEB (idesie.com) — migración ADITIVA
-- No modifica leads, mensajes_contacto, solicitudes_admision,
-- candidaturas_empleo ni descargas_catalogo en absoluto: solo
-- añade esta tabla nueva de auditoría/reintento.
-- =========================================================

create table public.crm_sync_log (
  id uuid primary key default gen_random_uuid(),
  source_table text not null,
  source_record_id uuid not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed')),
  attempts int not null default 0,
  -- id de la petición async que devuelve pg_net.http_post — el
  -- trigger nunca conoce el resultado real de la petición HTTP
  -- (pg_net es asíncrono); este id es lo que permite al job de
  -- reconciliación (sql/03) buscar la respuesta real más tarde en
  -- net._http_response.
  request_id bigint,
  last_attempt_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  constraint crm_sync_log_unique unique (source_table, source_record_id)
);

alter table public.crm_sync_log enable row level security; -- sin policies públicas, solo service_role
