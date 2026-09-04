import puppeteer from "puppeteer-core"
const b = await puppeteer.launch({ executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", headless:"new", args:["--no-sandbox"] })
const p = await b.newPage(); await p.setViewport({width:1440,height:900})
await p.goto("http://localhost:3000/embim-page",{waitUntil:"networkidle2"})
await new Promise(r=>setTimeout(r,1500))
await p.evaluate(()=>{
  window.__wheel = { vistos:0, prevenidos:0 }
  const c=document.querySelector("#programa .module-rail")
  c.addEventListener("wheel", (e)=>{ window.__wheel.vistos++; if(e.defaultPrevented) window.__wheel.prevenidos++ }, { passive:true })
  document.querySelector("#programa").scrollIntoView({block:"start"})
})
await new Promise(r=>setTimeout(r,400))
const caja = await p.evaluate(()=>{ const r=document.querySelector("#programa .module-rail").getBoundingClientRect(); return {x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2), top:Math.round(r.top), bottom:Math.round(r.bottom)} })
console.log("carril en pantalla:", caja)
await p.mouse.move(caja.x, caja.y)
for (let i=0;i<5;i++){ await p.mouse.wheel({deltaY:100}); await new Promise(r=>setTimeout(r,60)) }
const r = await p.evaluate(()=>({ ...window.__wheel, pos: Math.round(document.querySelector("#programa .module-rail").scrollLeft) }))
console.log("eventos wheel vistos:", r.vistos, "| con preventDefault:", r.prevenidos, "| scrollLeft:", r.pos)
await b.close()
