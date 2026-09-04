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
