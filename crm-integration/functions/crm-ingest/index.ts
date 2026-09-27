// Edge Function receptora — PROYECTO CRM
// Ruta desplegada: https://<crm-project-ref>.supabase.co/functions/v1/crm-ingest
//
// Verifica la firma HMAC del payload que manda el trigger de
// Postgres del proyecto web (ver sql/03_web_project_trigger_and_cron.sql),
// y hace upsert de contacto + insert idempotente de submission.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SHARED_SECRET = Deno.env.get("CRM_SHARED_SECRET")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface IncomingPayload {
  source_id: string;
  source_table: string;
  source_record_id: string;
  record: Record<string, unknown>;
}

// Comparación en tiempo constante — nunca comparar firmas con
// === directo, eso filtra información por temporización.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function computeHmacHex(rawBody: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody),
  );
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Nombres de columna reales, leídos de los scripts de migración del
// proyecto web (scripts/020, 027, 028, 029, 032, 034) — NO asumidos.
// Cada tabla tiene su propia forma de nombre/teléfono:
//   - leads: first_name + last_name (sin campo único de nombre), phone
//   - mensajes_contacto / candidaturas_empleo / descargas_catalogo: nombre, telefono
//     (telefono en mensajes_contacto añadida en scripts/034 — antes esa
//     tabla no lo recogía en ningún sitio, ni en el formulario)
//   - solicitudes_admision: nombre_completo, telefono
// Todas comparten `email` con ese nombre exacto.
const KNOWN_SOURCE_TABLES = [
  "leads",
  "mensajes_contacto",
  "solicitudes_admision",
  "candidaturas_empleo",
  "descargas_catalogo",
] as const;

function extractContactFields(
  sourceTable: string,
  record: Record<string, unknown>,
): { email: string | null; fullName: string | null; phone: string | null } {
  const email = (record.email as string | undefined)?.trim().toLowerCase() ?? null;

  switch (sourceTable) {
    case "leads": {
      const first = ((record.first_name as string | undefined) ?? "").trim();
      const last = ((record.last_name as string | undefined) ?? "").trim();
      return {
        email,
        fullName: [first, last].filter(Boolean).join(" ") || null,
        phone: (record.phone as string | undefined) ?? null,
      };
    }
    case "solicitudes_admision":
      return {
        email,
        fullName: (record.nombre_completo as string | undefined) ?? null,
        phone: (record.telefono as string | undefined) ?? null,
      };
    case "mensajes_contacto":
    case "candidaturas_empleo":
    case "descargas_catalogo":
      return {
        email,
        fullName: (record.nombre as string | undefined) ?? null,
        phone: (record.telefono as string | undefined) ?? null,
      };
    default:
      // No debería llegar aquí nunca si el trigger solo está en las 5
      // tablas conocidas — si aparece, es una tabla nueva conectada al
      // trigger sin actualizar este mapeo, mejor fallar alto que
      // adivinar con un coalesce silencioso.
      throw new Error(`source_table no reconocida: ${sourceTable}`);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Firmar/verificar SIEMPRE sobre el body crudo, no sobre un JSON
  // reserializado — el orden de claves de v_payload::text (Postgres)
  // debe coincidir byte a byte con lo que se verifica aquí.
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-signature");

  if (!signatureHeader) {
    return jsonResponse({ error: "Falta la cabecera X-Signature" }, 401);
  }

  const computedSignature = await computeHmacHex(rawBody, SHARED_SECRET);
  if (!timingSafeEqual(computedSignature, signatureHeader)) {
    return jsonResponse({ error: "Firma inválida" }, 401);
  }

  let body: IncomingPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "JSON inválido" }, 400);
  }

  const { source_id, source_table, source_record_id, record } = body;

  if (!source_id || !source_table || !source_record_id || !record) {
    return jsonResponse({ error: "Payload incompleto" }, 400);
  }

  if (!KNOWN_SOURCE_TABLES.includes(source_table as (typeof KNOWN_SOURCE_TABLES)[number])) {
    return jsonResponse({ error: `source_table desconocida: ${source_table}` }, 400);
  }

  // Un HMAC válido solo prueba que quien firmó conoce el secreto — no que
  // el source_id que declara el payload siga siendo uno real y activo.
  // Sin esto, desactivar un origen en `sources` (is_active = false) no
  // tendría ningún efecto real: los datos seguirían entrando igual.
  const { data: source, error: sourceError } = await supabase
    .from("sources")
    .select("is_active")
    .eq("id", source_id)
    .maybeSingle();

  if (sourceError) {
    return jsonResponse(
      { error: "No se pudo verificar el origen", detail: sourceError.message },
      500,
    );
  }

  if (!source || !source.is_active) {
    return jsonResponse({ error: `source_id desconocido o inactivo: ${source_id}` }, 403);
  }

  const { email, fullName, phone } = extractContactFields(source_table, record);
  if (!email) {
    return jsonResponse({ error: "El registro no trae email" }, 422);
  }

  const idempotencyKey = `${source_id}:${source_table}:${source_record_id}`;

  // Idempotencia explícita antes de escribir nada: si ya procesamos
  // esta fila (reintento del reconciliador, o doble entrega), no se
  // vuelve a tocar contacts ni a insertar una submission duplicada.
  const { data: existing } = await supabase
    .from("submissions")
    .select("id")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existing) {
    return jsonResponse({ status: "already_processed", submission_id: existing.id }, 200);
  }

  // RPC en vez de .upsert() directo sobre la tabla: upsert_contact()
  // hace COALESCE real (solo rellena full_name/phone si el contacto
  // existente los tenía vacíos) — un .upsert() ciego sobreescribiría
  // esos campos con null en cuanto llegara una submission que no los
  // trae (p. ej. mensajes_contacto, que no tiene teléfono).
  const { data: contact, error: contactError } = await supabase
    .rpc("upsert_contact", { p_email: email, p_full_name: fullName, p_phone: phone })
    .single();

  if (contactError || !contact) {
    return jsonResponse(
      { error: "No se pudo guardar el contacto", detail: contactError?.message },
      500,
    );
  }

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .insert({
      contact_id: contact.id,
      source_id,
      source_table,
      source_record_id,
      idempotency_key: idempotencyKey,
      payload: record,
      status: "received",
    })
    .select("id")
    .single();

  if (submissionError) {
    // 23505 = violación de unicidad — carrera con otro reintento
    // simultáneo del mismo evento, no es un error real.
    if (submissionError.code === "23505") {
      return jsonResponse({ status: "already_processed" }, 200);
    }
    return jsonResponse(
      { error: "No se pudo guardar la interacción", detail: submissionError.message },
      500,
    );
  }

  return jsonResponse({ status: "ok", submission_id: submission.id }, 201);
});
