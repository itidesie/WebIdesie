import puppeteer from "puppeteer-core"
const b = await puppeteer.launch({ executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", headless:"new", args:["--no-sandbox"] })

async function medir(pausa, etiqueta){
  const p = await b.newPage(); await p.setViewport({width:1440,height:900})
  await p.goto("http://localhost:3000/embim-page",{waitUntil:"networkidle2",timeout:60000})
  await new Promise(r=>setTimeout(r,1400))
  await p.evaluate(()=>document.querySelector("#programa").scrollIntoView({block:"start"}))
  await new Promise(r=>setTimeout(r,500))
  const caja = await p.evaluate(()=>{const r=document.querySelector("#programa .module-rail").getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.top+120)}})
  await p.mouse.move(caja.x, caja.y)
  const antes = await p.evaluate(()=>({ y: Math.round(window.scrollY), x: Math.round(document.querySelector("#programa .module-rail").scrollLeft) }))
  let n=0
  for(let i=0;i<40;i++){
    await p.mouse.wheel({deltaY:100}); n++
    await new Promise(r=>setTimeout(r,pausa))
    const fin = await p.evaluate(()=>{const c=document.querySelector("#programa .module-rail");return c.scrollLeft>=c.scrollWidth-c.clientWidth-3})
    if(fin) break
  }
  await new Promise(r=>setTimeout(r,450))
  const st = await p.evaluate(()=>{const c=document.querySelector("#programa .module-rail");return {x:Math.round(c.scrollLeft),max:Math.round(c.scrollWidth-c.clientWidth),y:Math.round(window.scrollY)}})
  const avance = st.x - antes.x
  const derivaY = st.y - antes.y
  console.log(`${etiqueta.padEnd(26)} ${String(n).padStart(2)} muescas → ${avance}px lateral (${Math.round(avance/n)}px/muesca) | deriva vertical: ${derivaY}px ${derivaY===0?"✓ puro horizontal":"✗"} | ${st.x>=st.max-3?"llegó al final ✓":"a "+(st.max-st.x)+"px del final"}`)
  await p.close()
}
await medir(50,"rapido (50ms)")
await medir(250,"pausado (250ms)")
await medir(600,"muy lento (600ms)")

// Uniformidad de tarjetas
const p = await b.newPage(); await p.setViewport({width:1440,height:900})
await p.goto("http://localhost:3000/embim-page",{waitUntil:"networkidle2"})
await new Promise(r=>setTimeout(r,1400))
const u = await p.evaluate(()=>{
  const cards=[...document.querySelectorAll("#programa .module-card")]
  const s=cards.map(c=>{const cs=getComputedStyle(c);return `${cs.opacity}|${cs.transform}|${cs.borderColor}|${cs.boxShadow}`})
  return { total:cards.length, distintos:new Set(s).size, muestra:s[0] }
})
console.log(`\ntarjetas: ${u.total} | tratamientos distintos: ${u.distintos} ${u.distintos===1?"✓ TODAS IGUALES":"✗ hay diferencias"}`)
await b.close()
