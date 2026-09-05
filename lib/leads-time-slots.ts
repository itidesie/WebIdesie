/**
 * 10:00, 11:00 … 19:00 — última sesión empieza a las 19:00 y termina a las
 * 20:00. Única fuente de esta lista: antes vivía duplicada en
 * `app/api/leads/route.ts` y `components/landing/info-request-modal.tsx`.
 * Sin `"use server"` ni `"server-only"` a propósito — es una constante pura,
 * la consume tanto el endpoint (servidor) como el selector (cliente).
 */
export const LEAD_TIME_SLOTS = Array.from({ length: 10 }, (_, i) => `${String(i + 10).padStart(2, "0")}:00`) as [
  string,
  ...string[],
]
