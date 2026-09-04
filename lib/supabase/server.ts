import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { isMock, logMock } from "@/lib/mock-mode"

/**
 * Cliente de Supabase con la `service_role` key — bypassa Row Level Security
 * por diseño de Supabase. **Server-only** (el paquete `server-only` hace
 * fallar el build si algo intenta importar este archivo desde un Client
 * Component): esta clave nunca debe llegar al navegador.
 *
 * Inicialización perezosa (`client ??=` dentro de la función, nunca a nivel
 * de módulo): invocar un cliente lazy-singleton a nivel de módulo fue lo que
 * rompió `next build` más de una vez en este proyecto (ver CLAUDE.md §0).
 * Aquí `createClient()` ni se invoca hasta la primera llamada real dentro de
 * un handler.
 */

let client: SupabaseClient | undefined
let mockClient: SupabaseClient | undefined

function createMockClient(): SupabaseClient {
  // Proxy mínimo: cualquier `.from(tabla).insert(...)/.select(...)` que se le
  // haga se registra en el log de mock y devuelve una respuesta vacía y sin
  // error, en vez de intentar conectar de verdad. No pretende ser un motor de
  // consultas — solo evitar que el código de arriba (leads-db.ts) tenga que
  // ramificar entre "mock" y "real" en cada llamada.
  const builder: any = {
    insert: (rows: unknown) => {
      logMock("Supabase", `insert simulado, ${Array.isArray(rows) ? rows.length : 1} fila(s)`)
      return {
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }
    },
    select: () => builder,
    eq: () => builder,
    single: async () => ({ data: null, error: null }),
  }
  return {
    from: (table: string) => {
      logMock("Supabase", `tabla "${table}" — sin conexión, ver .env.local`)
      return builder
    },
  } as unknown as SupabaseClient
}

/** Cliente con privilegios de servicio. Úsalo solo en Route Handlers, Server Actions o Server Components — nunca en código que se envíe al navegador. */
export function getSupabaseServerClient(): SupabaseClient {
  if (isMock("SUPABASE_SERVICE_ROLE_KEY")) {
    mockClient ??= createMockClient()
    return mockClient
  }

  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return client
}
