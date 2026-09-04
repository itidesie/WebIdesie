import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { z } from 'zod'
import { parseJsonBody, stringInput } from '@/lib/api-validation'
import { createDescargaCatalogo, type DescargaCatalogoData } from '@/lib/catalogo-db'

/**
 * 2026-09-05 — migrado de Brevo a Resend (46), y persistencia en Supabase
 * añadida (47) — pendiente dejado explícitamente sin resolver en (46), donde
 * se preguntó y se recomendó no reutilizar `leads` (sus columnas de sesión
 * son `not null` y no aplican aquí). Mismo patrón que el resto del sitio
 * (`leads`, `contact`, `candidaturas`, `admision`): persistir primero en
 * Supabase, el email es best-effort — ver `lib/catalogo-db.ts`.
 *
 * Teléfono y RGPD en el esquema — mismo criterio que `AdmisionModal`:
 * `rgpdAceptado` con `.refine()` en vez de `z.literal(true, {message})`,
 * que en esta versión de zod no aplica el mensaje personalizado (ya
 * descubierto en (43)). Regex de teléfono reutilizada tal cual de
 * `/api/leads` — no se inventa una nueva.
 */
const catalogSchema = z.object({
  email: stringInput(z.string().trim().email('Email inválido')),
  name: stringInput(z.string().trim().min(1, 'Nombre, email y teléfono son obligatorios')),
  telefono: stringInput(z.string().trim().regex(/^[+\d][\d\s]{7,}$/, 'Teléfono no válido')),
  catalogId: stringInput(z.string().trim().min(1, 'Email y catalogoId son requeridos')),
  catalogName: z.string().trim().optional(),
  rgpdAceptado: z.preprocess(
    (v) => v ?? false,
    z.boolean().refine((v) => v === true, { message: 'Debes aceptar la política de privacidad para continuar' }),
  ),
})

// 2026-09-05 — bug real encontrado y corregido en la auditoría pre-despliegue:
// 'mbim-fulltime' y 'mbim-building-engineering' apuntaban a nombres de
// archivo que NUNCA existieron en public/catalogs/ ('catalogo_master_bim.pdf',
// 'catalogo_master_bim_building_engineering.pdf') — el envío fallaba con 500
// ("Error al procesar el catálogo") en cuanto `fs.readFileSync` no encontraba
// el fichero, independientemente de qué proveedor de email se usara.
// Mientras tanto, el cliente ya había subido los catálogos REALES de MBIM
// (`catalogoMBIM.pdf`, 8,1 MB, 1.7) y MBBE (`catalogo_mbbe_2025.pdf`, 17,8 MB,
// 18 páginas) a esa misma carpeta, con otro nombre, sin que el código llegara
// a conectarlos nunca. EMBIM y Online siguen con los PDF de 1 página
// (~600 B) que ya documentaba CLAUDE.md como placeholders a propósito — no
// hay catálogo real todavía para esos dos, no se inventa ninguno.
const catalogMapping: Record<string, string> = {
  'mbim-fulltime': 'catalogoMBIM.pdf',
  'mbim-building-engineering': 'catalogo_mbbe_2025.pdf',
  'mbim-online': 'catalogo_master_bim_online.pdf',
  'executive-master-bim': 'catalogo_executive_master_bim.pdf',
}

// Mismo catalogId que ya usa el frontend (ver ClosingCta/AdmisionSection en
// las páginas de programa) — se traduce a la etiqueta homogénea que exige
// el CHECK de `descargas_catalogo.programa`, mismo criterio que "origen" en
// `solicitudes_admision`.
const programaMapping: Record<string, DescargaCatalogoData['programa']> = {
  'mbim-fulltime': 'MBIM',
  'mbim-building-engineering': 'MBBE',
  'mbim-online': 'Online',
  'executive-master-bim': 'EMBIM',
}

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJsonBody(request, catalogSchema)
    if (!parsed.success) return parsed.response
    const { email, name, telefono, catalogId, catalogName, rgpdAceptado } = parsed.data

    const pdfFileName = catalogMapping[catalogId]
    if (!pdfFileName) {
      return NextResponse.json({ error: 'Catálogo no encontrado' }, { status: 404 })
    }

    const pdfPath = path.join(process.cwd(), 'public', 'catalogs', pdfFileName)
    let pdfBuffer: Buffer

    try {
      pdfBuffer = fs.readFileSync(pdfPath)
    } catch (err) {
      // Nunca se registra el email/nombre/teléfono del solicitante en el
      // log de errores — solo el catalogId, que no es un dato personal.
      console.error('[send-catalog] Error leyendo PDF:', catalogId, err)
      return NextResponse.json({ error: 'Error al procesar el catálogo' }, { status: 500 })
    }

    const programa = programaMapping[catalogId]

    try {
      await createDescargaCatalogo({
        nombre: name,
        email,
        telefono,
        catalogoId: catalogId,
        catalogoNombre: catalogName ?? null,
        programa,
        rgpdAceptado,
        pdfBuffer,
        pdfFileName,
      })
    } catch (err) {
      // A diferencia del email (best-effort, ver lib/catalogo-db.ts), un
      // fallo al persistir SÍ se propaga: es el único registro real de que
      // alguien lo pidió, mismo criterio que leads/contacto/candidaturas.
      console.error('[send-catalog] Error al guardar la solicitud:', err)
      return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Catálogo enviado correctamente',
    })
  } catch (error) {
    console.error('[send-catalog] Error al procesar la solicitud:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
