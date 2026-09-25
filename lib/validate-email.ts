import { z } from "zod"

/**
 * 🔒 Validación ESTRICTA de email para formularios públicos.
 *
 * `z.string().email()` acepta cosas que no queremos que lleguen a Resend ni a
 * la base de datos (saltos de línea colados, puntos consecutivos, dominios sin
 * TLD real...). Esta versión exige la forma práctica `local@dominio.tld` con:
 *   - solo caracteres ASCII imprimibles permitidos (rechaza espacios, saltos
 *     de línea y cualquier carácter de control → sin inyección de cabeceras);
 *   - máximo 254 caracteres en total y 64 en la parte local (RFC 5321);
 *   - sin punto al principio/final ni dos seguidos en la parte local;
 *   - etiquetas de dominio de 1–63 caracteres, sin guion al borde, y un TLD de
 *     2 a 63 letras (rechaza `a@b`, `a@localhost` e IPs).
 * Es deliberadamente más restrictiva que la RFC (no admite direcciones con
 * caracteres no ASCII: los dominios internacionales deben venir en punycode).
 * El resultado se normaliza a minúsculas.
 */
const EMAIL_RE =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

export function isStrictEmail(value: string): boolean {
  if (value.length > 254) return false
  const at = value.lastIndexOf("@")
  if (at < 1 || at > 64) return false
  return EMAIL_RE.test(value)
}

export function strictEmail(message = "El email no es válido") {
  return z
    .string()
    .trim()
    .refine(isStrictEmail, message)
    .transform((value) => value.toLowerCase())
}
