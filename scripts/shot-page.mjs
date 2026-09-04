import puppeteer from "puppeteer-core"
const b = await puppeteer.launch({ executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", headless:"new", args:["--no-sandbox"] })
const p = await b.newPage(); await p.setViewport({width:1440,height:900})
await p.goto(process.argv[2],{waitUntil:"networkidle2",timeout:60000})
await new Promise(r=>setTimeout(r,1500))
await p.screenshot({ path: process.argv[3] }); await b.close()
