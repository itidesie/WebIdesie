import puppeteer from "puppeteer-core"
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const url = process.argv[2], out = process.argv[3], idx = Number(process.argv[4] ?? 0)
const b = await puppeteer.launch({ executablePath: CHROME, headless:"new", args:["--no-sandbox"] })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto(url, { waitUntil:"networkidle2", timeout:60000 })
await new Promise(r=>setTimeout(r,1200))
// Igual que hace el usuario: llega por el ancla y luego usa los botones.
await p.evaluate((i)=>{
  document.querySelector("#programa").scrollIntoView({block:"start"})
  const c=document.querySelector("#programa .module-rail")
  const d=c?.children[i]
  if(c&&d) c.scrollTo({ left: d.offsetLeft + d.offsetWidth/2 - c.clientWidth/2, behavior:"instant" })
}, idx)
await new Promise(r=>setTimeout(r,700))
await p.screenshot({ path: out })
await b.close()
