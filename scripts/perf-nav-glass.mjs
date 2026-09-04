/**
 * Mide lo que cuesta el cristal del header durante el scroll.
 *
 * Compara la misma pagina consigo misma con y sin `backdrop-filter`, con la
 * CPU frenada 6x para acercarse a un movil de gama media. Lo que importa no es
 * el valor absoluto (headless en un Mac no es un Android) sino la DIFERENCIA.
 *
 *   node scripts/perf-nav-glass.mjs
 */
import puppeteer from "puppeteer-core"

const CHROME = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  linux: "/usr/bin/google-chrome",
}[process.platform]

const SIN_CRISTAL = `.glass-nav, .glass-panel {
  -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }`

const b = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] })
const sleep = ms => new Promise(r => setTimeout(r, ms))

// Desplaza durante ~3 s midiendo la duracion de cada fotograma.
const medir = () => new Promise(resolve => {
  const frames = []
  let last = performance.now()
  const t0 = last
  const step = now => {
    frames.push(now - last)
    last = now
    window.scrollBy(0, 14)
    if (now - t0 < 3000) requestAnimationFrame(step)
    else {
      const s = frames.slice(5).sort((a, b) => a - b)   // descarta el arranque
      const q = p => +s[Math.floor(s.length * p)].toFixed(2)
      resolve({ n: s.length, mediana: q(0.5), p95: q(0.95), peor: +s[s.length - 1].toFixed(2) })
    }
  }
  requestAnimationFrame(step)
})

for (const url of ["/", "/mbim-page"]) {
  const fila = []
  for (const cristal of [true, false]) {
    const p = await b.newPage()
    await p.setViewport({ width: 1440, height: 900 })
    const c = await p.target().createCDPSession()
    await c.send("Emulation.setCPUThrottlingRate", { rate: 6 })
    await p.goto("http://localhost:3000" + url, { waitUntil: "networkidle2", timeout: 120000 })
    if (!cristal) await p.addStyleTag({ content: SIN_CRISTAL })
    await sleep(2500)
    fila.push({ cristal, ...await p.evaluate(medir) })
    await p.close()
  }
  const [con, sin] = fila
  const delta = (con.mediana - sin.mediana).toFixed(2)
  console.log(`\n${url}  (CPU x6 mas lenta)`)
  console.log(`  con cristal : mediana ${con.mediana} ms · p95 ${con.p95} ms · peor ${con.peor} ms  (${con.n} fotogramas)`)
  console.log(`  sin cristal : mediana ${sin.mediana} ms · p95 ${sin.p95} ms · peor ${sin.peor} ms  (${sin.n} fotogramas)`)
  console.log(`  coste del backdrop-filter: ${delta > 0 ? "+" : ""}${delta} ms por fotograma`)
}
await b.close()
