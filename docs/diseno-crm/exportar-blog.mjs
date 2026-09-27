#!/usr/bin/env node
/**
 * EXPORTACIÓN DEL BLOG (Supabase → archivos del repositorio)
 * ARCHIVO DE DISEÑO — NO EJECUTADO NI PROBADO.
 *
 * Lee `blog_posts` (SOLO LECTURA: únicamente hace GET) y genera:
 *   content/blog/<YYYY-MM-DD>-<slug>.md       un archivo por post, con frontmatter
 *   public/blog/<slug>/<imagen>               imágenes descargadas (destacada + las del contenido)
 *   docs/diseno-crm/blog-urls.json            mapa URL actual → archivo, para las pruebas de SEO
 *
 * Por defecto es una SIMULACIÓN (dry-run): no escribe nada y solo imprime el plan.
 * Para escribir de verdad:  node docs/diseno-crm/exportar-blog.mjs --write
 *
 * Requisitos (solo para ejecutar este script, no forman parte de la web):
 *   npm i --no-save turndown gray-matter        (Node ≥ 20)
 *   export SUPABASE_URL=...          (misma URL del proyecto)
 *   export SUPABASE_READ_KEY=...     (una clave con permiso de lectura de blog_posts;
 *                                     el script NO escribe, pero no la dejes en el historial)
 *
 * Decisiones de diseño:
 *  · Formato .md (CommonMark) y no .mdx: el contenido actual es HTML del editor
 *    de texto enriquecido; convertido a Markdown puede contener `{` o `<` que MDX
 *    interpretaría como JSX y rompería el build. Se renderiza igualmente con la
 *    pipeline MDX/remark (format: "md"). Un post que necesite componentes se
 *    renombra a .mdx a mano.
 *  · La URL pública actual es /blog/YYYY/MM/DD/<slug>, con la fecha de created_at en
 *    UTC (así la calcula app/blog/actions.ts → generatePostUrl en Vercel). El campo
 *    `date` del frontmatter conserva el created_at ORIGINAL completo para que las URLs
 *    no cambien ni un día.
 *  · Paridad primero: hoy la web muestra TODAS las filas aunque `published` sea false
 *    (getBlogPosts no filtra). Por eso se exporta `draft: false` a todas y se AVISA de
 *    las que tienen published=false para que decidas. Usa --respect-published para
 *    marcarlas como draft:true (dejarían de estar visibles → 404 si estaban indexadas).
 *  · Las imágenes se DESCARGAN: pueden estar en Vercel Blob (BLOB_READ_WRITE_TOKEN
 *    ya se eliminó del código, pero el almacén sigue existiendo). NO borres el almacén
 *    hasta verificar que todas están en public/blog/.
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const WRITE = process.argv.includes("--write")
const RESPECT_PUBLISHED = process.argv.includes("--respect-published")
const { SUPABASE_URL, SUPABASE_READ_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_READ_KEY) {
  console.error("Faltan SUPABASE_URL y/o SUPABASE_READ_KEY.")
  process.exit(1)
}

// Dependencias del script (instaladas con --no-save). Import dinámico para fallar con mensaje claro.
let TurndownService, matter
try {
  TurndownService = (await import("turndown")).default
  matter = (await import("gray-matter")).default
} catch {
  console.error("Instala las dependencias del script:  npm i --no-save turndown gray-matter")
  process.exit(1)
}

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" })

async function fetchPosts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=id,slug,title,excerpt,content,author,published,tags,featured_image_url,created_at,updated_at&order=created_at.asc`,
    { headers: { apikey: SUPABASE_READ_KEY, Authorization: `Bearer ${SUPABASE_READ_KEY}` } },
  )
  if (!res.ok) throw new Error(`Supabase respondió ${res.status}: ${await res.text()}`)
  return res.json()
}

/** Misma derivación que generatePostUrl, pero explícitamente en UTC. */
function urlFor(post) {
  const d = new Date(post.created_at)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return { url: `/blog/${y}/${m}/${day}/${post.slug}`, ymd: `${y}-${m}-${day}` }
}

function imageUrlsIn(html) {
  return [...(html ?? "").matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1])
}

function localImagePath(slug, remoteUrl) {
  const ext = path.extname(new URL(remoteUrl, "https://x.invalid").pathname).slice(0, 6) || ".jpg"
  const base = path.basename(new URL(remoteUrl, "https://x.invalid").pathname, ext).replace(/[^a-z0-9-_]/gi, "-").slice(0, 60)
  return `/blog/${slug}/${base || "imagen"}${ext}`
}

async function downloadImage(remoteUrl, publicPath) {
  const res = await fetch(remoteUrl)
  if (!res.ok) throw new Error(`No se pudo descargar ${remoteUrl}: ${res.status}`)
  const target = path.join("public", publicPath)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, Buffer.from(await res.arrayBuffer()))
}

const posts = await fetchPosts()
console.log(`${posts.length} posts en blog_posts (${WRITE ? "MODO ESCRITURA" : "simulación, no se escribe nada"})\n`)

const seen = new Map()
const report = { sinSlug: [], duplicados: [], noPublicados: [], imagenesFallidas: [] }
const urlMap = []

for (const post of posts) {
  if (!post.slug) { report.sinSlug.push(post.id); continue }
  const { url, ymd } = urlFor(post)
  if (seen.has(url)) { report.duplicados.push(url); continue }
  seen.set(url, post.id)
  if (!post.published) report.noPublicados.push(url)

  // 1) Imágenes: destacada + las del contenido → public/blog/<slug>/
  const remote = new Set(imageUrlsIn(post.content))
  if (post.featured_image_url) remote.add(post.featured_image_url)
  const rewrite = new Map()
  for (const src of remote) {
    if (!/^https?:\/\//i.test(src)) continue // rutas locales (/images/...) se dejan igual
    const local = localImagePath(post.slug, src)
    rewrite.set(src, local)
    if (WRITE) {
      try { await downloadImage(src, local) } catch (e) { report.imagenesFallidas.push(`${url} → ${src} (${e.message})`) }
    }
  }

  // 2) HTML → Markdown, con las URLs de imagen ya reescritas
  let html = post.content ?? ""
  for (const [remoteSrc, local] of rewrite) html = html.split(remoteSrc).join(local)
  const markdown = turndown.turndown(html).trim() + "\n"

  // 3) Frontmatter
  const frontmatter = {
    title: post.title,
    slug: post.slug,
    date: new Date(post.created_at).toISOString(),      // ← fija la URL; NO tocar
    updated: new Date(post.updated_at ?? post.created_at).toISOString(),
    author: post.author || "IDESIE Team",
    excerpt: post.excerpt || "",
    tags: Array.isArray(post.tags) ? post.tags : [],
    image: post.featured_image_url ? (rewrite.get(post.featured_image_url) ?? post.featured_image_url) : null,
    draft: RESPECT_PUBLISHED ? !post.published : false,
  }
  const file = path.join("content", "blog", `${ymd}-${post.slug}.md`)
  urlMap.push({ url, file, published: post.published })
  console.log(`${WRITE ? "escribe" : "escribiría"}  ${file}   ← ${url}   (${remote.size} imágenes)`)

  if (WRITE) {
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, matter.stringify(markdown, frontmatter))
  }
}

if (WRITE) await writeFile("docs/diseno-crm/blog-urls.json", JSON.stringify(urlMap, null, 2) + "\n")

console.log("\n=== INFORME ===")
console.log(`Posts exportables: ${urlMap.length}`)
if (report.sinSlug.length) console.log(`⚠️ Sin slug (no exportados), ids: ${report.sinSlug.join(", ")}`)
if (report.duplicados.length) console.log(`⚠️ URLs duplicadas (segundo post ignorado):\n  ${report.duplicados.join("\n  ")}`)
if (report.noPublicados.length)
  console.log(`⚠️ published=false pero VISIBLES hoy en la web (decide si quedan públicos):\n  ${report.noPublicados.join("\n  ")}`)
if (report.imagenesFallidas.length) console.log(`⚠️ Imágenes no descargadas:\n  ${report.imagenesFallidas.join("\n  ")}`)
console.log(WRITE ? "\nHecho. Revisa los .md generados antes de commitear." : "\nSimulación terminada. Añade --write para escribir los archivos.")
