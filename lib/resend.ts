import { Resend } from "resend"
import { isMock, logMock } from "./mock-mode"

type SendPayload = Parameters<Resend["emails"]["send"]>[0]

/** Subconjunto de la API de Resend que este proyecto usa. */
interface MailClient {
  emails: {
    send: (payload: SendPayload) => Promise<{ data: { id: string } | null; error: unknown }>
  }
}

function createMockResend(): MailClient {
  return {
    emails: {
      async send(payload) {
        const to = Array.isArray(payload.to) ? payload.to.join(", ") : payload.to
        logMock("Resend", `email no enviado → ${to} · asunto: "${payload.subject ?? ""}"`)
        return { data: { id: `mock_${Date.now()}` }, error: null }
      },
    },
  }
}

let client: MailClient | undefined

/**
 * Cliente de Resend. En modo mock devuelve un éxito simulado sin salir a la red;
 * con clave presente es el cliente real, sin diferencias de comportamiento.
 */
export function getResend(): MailClient {
  client ??= isMock("RESEND_API_KEY")
    ? createMockResend()
    : (new Resend(process.env.RESEND_API_KEY) as unknown as MailClient)
  return client
}

// --- Remitente ---------------------------------------------------------------

/** Remitente de PRUEBAS de Resend: solo entrega al email del propietario de la cuenta. */
const RESEND_TEST_SENDER = "onboarding@resend.dev"

let senderProblemLogged = false

function senderProblem(raw: string | undefined): string | null {
  if (!raw) return "RESEND_FROM_EMAIL no está definida"
  if (!raw.includes("@")) return `RESEND_FROM_EMAIL ("${raw}") no parece una dirección de email`
  if (raw.toLowerCase().includes(RESEND_TEST_SENDER)) return `RESEND_FROM_EMAIL usa el remitente de pruebas ${RESEND_TEST_SENDER}`
  return null
}

/**
 * 🔒 Registra (una sola vez por proceso) un error claro si, en PRODUCCIÓN, el
 * remitente no está configurado o sigue siendo el de pruebas de Resend. Con
 * `onboarding@resend.dev` Resend solo entrega al email del dueño de la cuenta:
 * los formularios responderían "éxito" y ningún usuario recibiría su
 * confirmación. No lanza: el aviso queda en el log, la app sigue funcionando.
 * Se llama al arrancar (instrumentation.ts) y en cada envío (barato).
 */
export function checkResendSender(): void {
  if (process.env.NODE_ENV !== "production" || senderProblemLogged) return
  const problem = senderProblem(process.env.RESEND_FROM_EMAIL?.trim())
  if (!problem) return
  senderProblemLogged = true
  console.error(
    `[resend] ⛔ ${problem}. Los emails a usuarios NO se entregarán (Resend solo permite el remitente de pruebas hacia el propietario de la cuenta).\n` +
      `         Verifica un dominio en Resend y define RESEND_FROM_EMAIL, p. ej.  IDESIE <info@tu-dominio-verificado.com>  (o solo la dirección).`,
  )
}

/**
 * Remitente ÚNICO de todos los emails del sitio (`from`). Lee `RESEND_FROM_EMAIL`,
 * que puede ser `info@dominio.com` o `Nombre <info@dominio.com>`; si es solo la
 * dirección se le antepone "IDESIE". Si falta, cae al remitente de pruebas (y en
 * producción `checkResendSender` deja el error en el log).
 */
export function getResendFrom(): string {
  checkResendSender()
  const raw = process.env.RESEND_FROM_EMAIL?.trim()
  const address = raw && raw.includes("@") ? raw : RESEND_TEST_SENDER
  return address.includes("<") ? address : `IDESIE <${address}>`
}
