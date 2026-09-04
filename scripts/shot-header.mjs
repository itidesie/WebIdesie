/**
 * Capturas de la franja superior para revisar el header de cristal.
 *
 * ⚠️ `captureBeyondViewport: false` no es opcional. Con `clip`, Chrome captura
 * por defecto "mas alla del viewport": rerenderiza desde el origen del
 * documento y los elementos `position: fixed` se pintan donde caerian en el
 * documento, no en la ventana. El header desaparecia de todas las capturas con
 * scroll y parecia un fallo del rediseno cuando era del propio script.
 *
 *   node scripts/shot-header.mjs <prefijo>
 */
import puppeteer from "puppeteer-core"

const CHROME = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  linux: "/usr/bin/google-chrome",
}[process.platform]

const OUT = process.argv[2] || "shot"
const DIR = process.argv[3] || "/tmp/shots"

const b = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--force-device-scale-factor=2"] })
const sleep = ms => new Promise(r => setTimeout(r, ms))

// Coloca el elemento indicado JUSTO DEBAJO del header: su borde superior
// queda `into` pixeles por encima del viewport, asi que el cristal se dibuja
// sobre el. Es la unica forma de probar el contraste en el peor caso, que es
// una seccion gray-950 pasando por detras de la barra.
const scrollUnderHeader = (p, sel, into = 200) => p.evaluate((s, i) => {
  const el = document.querySelector(s)
  if (!el) return -1
  window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY + i))
  return Math.round(window.scrollY)
}, sel, into)

const jobs = [
  { name: "home-top",      url: "/",          vp: { width: 1440, height: 900 } },
  { name: "home-scrolled", url: "/",          vp: { width: 1440, height: 900 }, scroll: 900 },
  { name: "mbim-top",      url: "/mbim-page", vp: { width: 1440, height: 900 } },
  // M3 y M6 son las dos secciones gray-950: el peor caso de contraste.
  { name: "mbim-m3-dark",  url: "/mbim-page", vp: { width: 1440, height: 900 }, sel: "#programa .bg-gray-950, #programa", into: 400 },
  { name: "mbim-m6-dark",  url: "/mbim-page", vp: { width: 1440, height: 900 }, sel: "section.bg-gray-950", into: 400 },
  { name: "mobile-top",    url: "/",          vp: { width: 390, height: 844 },  h: 200 },
  { name: "mobile-dark",   url: "/mbim-page", vp: { width: 390, height: 844 },  sel: "section.bg-gray-950", into: 400, h: 200 },
]

for (const j of jobs) {
  const p = await b.newPage()
  await p.setViewport(j.vp)
  await p.goto("http://localhost:3000" + j.url, { waitUntil: "networkidle2", timeout: 90000 })
  await sleep(1200)
  if (j.sel) {
    const y = await scrollUnderHeader(p, j.sel, j.into)
    if (y < 0) console.warn("  ⚠ selector no encontrado:", j.sel)
    await sleep(1400)
  } else if (j.scroll) {
    await p.evaluate(y => window.scrollTo(0, y), j.scroll)
    await sleep(1400)
  }
  // El `clip` va en coordenadas del documento aunque no se capture mas alla
  // del viewport, asi que hay que desplazarlo por el scroll actual.
  const top = await p.evaluate(() => Math.round(window.scrollY))
  await p.screenshot({
    path: `${DIR}/${OUT}-${j.name}.png`,
    clip: { x: 0, y: top, width: j.vp.width, height: j.h ?? 260 },
    captureBeyondViewport: false,
  })
  console.log("✓", j.name, "@", top)
  await p.close()
}

// Cajon movil abierto, sobre una seccion oscura.
{
  const p = await b.newPage()
  await p.setViewport({ width: 390, height: 844 })
  await p.goto("http://localhost:3000/mbim-page", { waitUntil: "networkidle2", timeout: 90000 })
  await sleep(1200)
  await scrollUnderHeader(p, "#programa", 400)
  await sleep(1000)
  await p.click('button[aria-label="Toggle navigation"]')
  await sleep(900)
  await p.screenshot({ path: `${DIR}/${OUT}-mobile-drawer.png`, captureBeyondViewport: false })
  console.log("✓ mobile-drawer")
  await p.close()
}

await b.close()
