export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Añade `id` a cada `<h2>`/`<h3>` del HTML (ya sanitizado) del artículo, para
 * que el mini-índice lateral (`ArticleToc`) pueda enlazar directamente a
 * cada sección. Se llama siempre DESPUÉS de `sanitizeHtml()` — no introduce
 * ningún atributo nuevo controlado por el usuario, el `id` sale de
 * `slugify()` sobre el propio texto de la cabecera.
 */
export function addHeadingIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = []
  const seen = new Map<string, number>()

  const withIds = html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag: string, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim()
    if (!text) return match

    let id = slugify(text) || "seccion"
    const count = seen.get(id) ?? 0
    seen.set(id, count + 1)
    if (count > 0) id = `${id}-${count}`

    toc.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 })

    const cleanedAttrs = attrs.replace(/\sid=["'][^"']*["']/gi, "")
    return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`
  })

  return { html: withIds, toc }
}
