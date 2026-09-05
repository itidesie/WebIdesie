/**
 * Tokens de marca para los emails transaccionales — NO importan de
 * app/globals.css a propósito: los clientes de correo (Gmail, Outlook) no
 * cargan hojas de estilo externas ni leen `var(--color-brand)`, así que los
 * mismos valores viven aquí duplicados en hex plano. Si algún día cambia el
 * azul de marca en globals.css, actualiza también este archivo.
 */
export const emailColors = {
  brand: "#006cff",
  brandStrong: "#0052cc",
  paper: "#f2ede4",
  paperStrong: "#e5dccd",
  ink: "#111827",
  muted: "#6b7280",
  line: "#e5e7eb",
  white: "#ffffff",
} as const

/** Tema de Tailwind-para-email — mismos nombres de utilidad que ya produce
 * el Tailwind v4 del sitio a partir de `--color-brand` (bg-brand, text-brand,
 * border-brand...), aunque aquí compilan a un motor de Tailwind aparte. */
export const emailTailwindTheme = {
  theme: {
    extend: {
      colors: emailColors,
    },
  },
}

const siteUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://idesie.com").replace(/\/$/, "")

/**
 * `logo_idesie_azul.png` (el original) es un lienzo de 464×315 con mucho
 * margen transparente alrededor de la marca — el mismo motivo por el que
 * `components/header.tsx` usa la versión recortada. Un `<Img>` de email con
 * width/height que no respeten el ratio real de la imagen la deforma (a
 * diferencia de una `<img>` de navegador con `object-fit`, que los clientes
 * de correo no soportan) — por eso aquí se usa `logo_idesie_azul_trim.png`
 * (343×123, ratio real 2.7886:1, verificado leyendo el chunk IHDR del PNG),
 * el mismo archivo que ya usa el header del sitio, con width/height en
 * píxeles fijados como atributos HTML (no solo en `style`) para que Outlook
 * también respete la proporción.
 */
export const emailAssets = {
  siteUrl,
  logo: `${siteUrl}/images/logo_idesie_azul_trim.png`,
  logoWidth: 134,
  logoHeight: 48,
}

export const emailFonts = {
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
}
