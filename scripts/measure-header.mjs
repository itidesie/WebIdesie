import puppeteer from "puppeteer-core"
// El script se escribio en Windows. Resuelto por plataforma para que se
// pueda ejecutar tambien en macOS y Linux, que es donde vive el proyecto ahora.
const CHROME = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  linux: "/usr/bin/google-chrome",
}[process.platform]
const b = await puppeteer.launch({ executablePath: CHROME, headless:"new", args:["--no-sandbox"] })
for (const vp of [{width:1440,height:900},{width:1280,height:800},{width:390,height:844}]) {
  const p = await b.newPage(); await p.setViewport(vp)
  await p.goto("http://localhost:3000/embim-page",{waitUntil:"networkidle2"})
  await new Promise(r=>setTimeout(r,700))
  const m = await p.evaluate(()=>{
    const t=document.getElementById("top-nav-bar"), n=document.getElementById("main-nav-bar")
    const vis = el => el && getComputedStyle(el).display!=="none"
    const declarado = getComputedStyle(document.documentElement).getPropertyValue("--header-height").trim()
    return {
      topNav: vis(t)? Math.round(t.getBoundingClientRect().height):0,
      mainNav: vis(n)? Math.round(n.getBoundingClientRect().height):0,
      mainNavTop: vis(n)? Math.round(n.getBoundingClientRect().top):0,
      bordeReal: Math.round(document.querySelector(".glass-nav")?.getBoundingClientRect().bottom ?? Math.max(vis(t)?t.getBoundingClientRect().bottom:0, vis(n)?n.getBoundingClientRect().bottom:0)),
      declarado,
    }
  })
  console.log(`${vp.width}px → top-nav ${m.topNav}px | main-nav ${m.mainNav}px @top:${m.mainNavTop} | BORDE REAL ${m.bordeReal}px | declarado ${m.declarado}  ${String(m.bordeReal)+"px"===m.declarado?"✓":"✗ DESAJUSTE de "+(m.bordeReal-parseInt(m.declarado))+"px"}`)
  await p.close()
}
await b.close()
