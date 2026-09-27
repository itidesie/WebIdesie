-- =========================================================
-- PROYECTO CRM — esquema inicial completo
-- Ejecutar en el SQL Editor del proyecto Supabase del CRM.
-- =========================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Orígenes que pueden enviar datos al CRM. NO almacena ningún
-- secreto (ver sql/03 y el setup de Edge Function secrets) —
-- solo identifica de dónde viene cada submission.
create table public.sources (
  id text primary key,               -- 'idesie_web'
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.sources (id, description)
values ('idesie_web', 'Web pública de IDESIE (idesie.com)')
on conflict (id) do nothing; -- re-ejecutar este script no debe fallar ni duplicar

-- Identidad de la persona, deduplicada por email
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_normalized text generated always as (lower(trim(email))) stored,
  phone text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_email_normalized_unique unique (email_normalized)
);

create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

-- Upsert de contacto con COALESCE real, no un upsert ciego.
-- Un .upsert() de PostgREST normal (ON CONFLICT DO UPDATE SET col = excluded.col)
-- sobreescribiría full_name/phone con NULL si una submission posterior
-- no los trae — p. ej. alguien rellena "admisión" (con teléfono) y
-- luego "contacto" (sin teléfono, esa tabla no lo recoge): un upsert
-- ciego borraría el teléfono ya guardado. Esta función solo actualiza
-- un campo si el contacto existente lo tenía vacío.
create or replace function public.upsert_contact(
  p_email text,
  p_full_name text,
  p_phone text
) returns public.contacts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contact public.contacts;
begin
  insert into public.contacts (email, full_name, phone)
  values (p_email, p_full_name, p_phone)
  on conflict (email_normalized) do update
    set full_name = coalesce(public.contacts.full_name, excluded.full_name),
        phone = coalesce(public.contacts.phone, excluded.phone),
        updated_at = now()
  returning * into v_contact;

  return v_contact;
end;
$$;

-- Cada interacción real (N:1 con contacts) — nunca se sobreescribe,
-- solo se acumula. idempotency_key garantiza que un reintento del
-- webhook nunca duplique una fila.
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  source_id text not null references public.sources(id),
  source_table text not null,             -- 'leads' | 'mensajes_contacto' | 'solicitudes_admision' | 'candidaturas_empleo' | 'descargas_catalogo'
  source_record_id uuid not null,         -- id de la fila original en el proyecto web
  idempotency_key text not null,          -- source_id || ':' || source_table || ':' || source_record_id
  payload jsonb not null,                 -- la fila completa tal como llegó, sin normalizar
  status text not null default 'received'
    check (status in ('received', 'processing', 'failed')),
  received_at timestamptz not null default now(),
  constraint submissions_idempotency_unique unique (idempotency_key)
);

create index submissions_contact_id_idx on public.submissions (contact_id);
create index submissions_source_table_idx on public.submissions (source_table);
create index submissions_payload_gin_idx on public.submissions using gin (payload);

-- RLS: activo, sin ninguna policy pública — acceso exclusivo
-- service_role (la Edge Function usa la service_role key, nunca
-- la anon key, para escribir aquí).
alter table public.sources enable row level security;
alter table public.contacts enable row level security;
alter table public.submissions enable row level security;
