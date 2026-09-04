/**
 * Verificación real en navegador del M3 (carril de módulos).
 *
 * Mide en Chrome, a varias resoluciones:
 *  1. Que el titular de la sección no quede tapado por el header fijo.
 *  2. Que CADA tarjeta, al quedar centrada por scroll-snap, esté completa
 *     dentro del viewport (bordes izquierdo y derecho incluidos).
 *  3. Que el contenido de la tarjeta no se recorte verticalmente.
 */
import puppeteer from "puppeteer-core"

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const URL = process.argv[2] ?? "http://localhost:3000/embim-page"
const RESOLUCIONES = [
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 390, height: 844 },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})

let fallos = 0

for (const vp of RESOLUCIONES) {
  const page = await browser.newPage()
  await page.setViewport(vp)
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 })
  await new Promise((r) => setTimeout(r, 900))

  const etiqueta = `${vp.width}x${vp.height}`

  // ---- 1. El titular no debe quedar bajo el header fijo -------------------
  const cabecera = await page.evaluate(() => {
    const seccion = document.querySelector("#programa")
    if (!seccion) return null
    const h2 = seccion.querySelector("h2")
    const top = document.getElementById("top-nav-bar")
    const main = document.getElementById("main-nav-bar")
    const altoHeader =
      (top?.getBoundingClientRect().height ?? 0) +
      (main && getComputedStyle(main).display !== "none"
        ? main.getBoundingClientRect().bottom - main.getBoundingClientRect().top + 44
        : 0)
    // Llevamos la sección a la parte alta de la ventana.
    seccion.scrollIntoView({ block: "start" })
    return { altoHeader }
  })

  await new Promise((r) => setTimeout(r, 500))

  const solape = await page.evaluate(() => {
    const seccion = document.querySelector("#programa")
    const h2 = seccion.querySelector("h2")
    const barras = ["top-nav-bar", "main-nav-bar"]
      .map((id) => document.getElementById(id))
      .filter((el) => el && getComputedStyle(el).display !== "none")
    const bordeHeader = Math.max(...barras.map((el) => el.getBoundingClientRect().bottom), 0)
    const r = h2.getBoundingClientRect()
    return { tituloTop: Math.round(r.top), bordeHeader: Math.round(bordeHeader) }
  })

  const okTitulo = solape.tituloTop >= solape.bordeHeader
  if (!okTitulo) fallos++
  console.log(
    `\n[${etiqueta}] titular: top=${solape.tituloTop}px  header acaba en ${solape.bordeHeader}px  ` +
      (okTitulo ? "✓ libre" : `✗ TAPADO por ${solape.bordeHeader - solape.tituloTop}px`),
  )

  // ---- 2. Cada tarjeta centrada debe caber entera -------------------------
  const total = await page.evaluate(
    () => document.querySelectorAll("#programa .module-card").length,
  )
  console.log(`[${etiqueta}] tarjetas encontradas: ${total}`)

  let recortadas = 0
  for (let i = 0; i < total; i++) {
    const medida = await page.evaluate((idx) => {
      const carril = document.querySelector("#programa .module-rail")
      const card = carril.children[idx]
      card.scrollIntoView({ block: "nearest", inline: "center", behavior: "instant" })
      return new Promise((resolve) =>
        requestAnimationFrame(() => {
          const r = card.getBoundingClientRect()
          const cr = carril.getBoundingClientRect()
          resolve({
            left: Math.round(r.left),
            right: Math.round(r.right),
            top: Math.round(r.top),
            bottom: Math.round(r.bottom),
            ancho: Math.round(r.width),
            vw: window.innerWidth,
            vh: window.innerHeight,
            // ¿se recorta el contenido dentro de la tarjeta?
            cuerpoDesbordado: (() => {
              const b = card.querySelector(".module-card-body")
              return b ? b.scrollHeight - b.clientHeight : 0
            })(),
          })
        }),
      )
    }, i)

    const dentro = medida.left >= -1 && medida.right <= medida.vw + 1
    if (!dentro) {
      recortadas++
      console.log(
        `   ✗ módulo ${String(i + 1).padStart(2)}: izq ${medida.left} der ${medida.right} (vw ${medida.vw}) RECORTADA`,
      )
    }
    if (medida.cuerpoDesbordado > 2) {
      console.log(
        `   ⚠ módulo ${String(i + 1).padStart(2)}: cuerpo desborda ${medida.cuerpoDesbordado}px (scroll interno activo)`,
      )
    }
  }

  if (recortadas === 0) {
    console.log(`[${etiqueta}] ✓ las ${total} tarjetas caben completas al centrarse`)
  } else {
    fallos += recortadas
    console.log(`[${etiqueta}] ✗ ${recortadas} tarjetas recortadas`)
  }

  await page.close()
}

await browser.close()
console.log(`\n${fallos === 0 ? "✅ TODO CORRECTO" : `❌ ${fallos} FALLOS`}`)
process.exit(fallos === 0 ? 0 : 1)
