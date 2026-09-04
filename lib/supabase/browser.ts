"use client"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Cliente de Supabase para Client Components, con la `anon` key (segura para
 * el navegador: cualquier acceso pasa por Row Level Security).
 *
 * ⚠️ Nada del proyecto lo usa todavía. El formulario de la landing envía sus
 * datos a `/api/leads` (Route Handler) en vez de insertar directamente desde
 * el navegador — con RLS cerrado a cal y canto en `leads` (ver
 * `scripts/020_create_leads_table.sql`), un insert con la anon key ahí
 * fallaría por diseño. Este cliente queda preparado para el día en que algo
 * sí necesite Supabase desde el navegador (Auth, Realtime, una tabla con
 * policy pública) — no lo borres pensando que está huérfano por error.
 */

let client: SupabaseClient | undefined

export function getSupabaseBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      "Supabase (cliente de navegador): faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
    )
  }

  client ??= createClient(url, anonKey)
  return client
}
