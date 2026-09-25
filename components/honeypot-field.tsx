import { HONEYPOT_FIELD } from "@/lib/honeypot"

/**
 * Campo trampa anti-bots (ver `lib/honeypot.ts`). Se saca de pantalla con CSS
 * en vez de `display:none`, que los bots más simples ya saben ignorar; queda
 * fuera del orden de tabulación, oculto a lectores de pantalla y con el
 * autocompletado desactivado para que un navegador o gestor de contraseñas
 * no lo rellene por error.
 *
 * Con `name` (formularios sin estado, p. ej. la baja) el valor viaja en el
 * FormData. Los formularios que arman el JSON a mano deben incluir
 * `[HONEYPOT_FIELD]: formData.get(HONEYPOT_FIELD)` en el cuerpo.
 */
export function HoneypotField() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor={`hp-${HONEYPOT_FIELD}`}>No rellenar este campo</label>
      <input
        id={`hp-${HONEYPOT_FIELD}`}
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  )
}
