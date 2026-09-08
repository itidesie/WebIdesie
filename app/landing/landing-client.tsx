"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { StatCounter } from "@/components/home/stat-counter"

/**
 * Réplica fiel de `mbim-landing.html` (mockup "MBIM 2.0" aportado por el
 * cliente) — mismo estilo, contenido e información, ver comentario de
 * cabecera en `page.tsx`. Todo el CSS vive scopeado bajo `.mbim2-landing`
 * (en vez de `:root`/`body`/selectores de elemento sueltos como en el
 * archivo original) para no filtrar reglas al resto del sitio, que
 * comparte el mismo documento — la única adaptación real respecto al
 * archivo fuente, el resto es una traducción directa a JSX.
 *
 * El acordeón de módulos (vainilla JS + manipulación de clases en el
 * original) se reimplementa con `useState`, mismo comportamiento: el
 * primer módulo abierto por defecto, un clic en uno cerrado cierra el
 * resto y abre ese, un clic en el ya abierto lo cierra sin abrir otro.
 *
 * 2026-09-07 — Rediseño de motion/estética (contenido sin tocar): capa de
 * interacción reutilizada tal cual del resto del sitio — `useGsapEffect`
 * (gsap.context + ScrollTrigger, gated por prefers-reduced-motion en 3
 * capas: no se descarga GSAP, el propio `setup` no se ejecuta, y el estado
 * "from" de cada `gsap.from()` nunca llega a aplicarse porque el setup no
 * corre — no hace falta una cuarta capa de anulación CSS para casi nada de
 * lo añadido aquí), `StatCounter` (contadores), el mismo `back.out(1.6-1.8)`
 * de "sello" que usan `balance-ledger.tsx`/`convenio-card.tsx`, y el cursor
 * global + magnetismo + `.btn-sweep` que ya vienen de `SiteMotionProvider`
 * (`data-magnetic` en los CTA reales). Tipografía (Space Grotesk/IBM Plex)
 * y paleta se mantienen intactas — decisión explícita del cliente de
 * conservar la identidad propia de esta página. El `<h1>` del hero sigue
 * animándose solo en CSS puro (protege el LCP) — nunca con GSAP.
 */

const LANDING_STYLES = `
.mbim2-landing{
  /* Paleta remapeada a los tokens reales de la marca IDESIE (2026-09-07) —
     ya no es la paleta "blueprint" propia del mockup. --blueprint pasa a
     ser el azul de marca (--color-brand), --signal (antes un naranja
     inventado) pasa a --color-brand-strong para quedarse dentro de la
     misma familia de azules que usa el resto del sitio, --paper/--line
     reutilizan los tokens de papel/borde ya existentes. --ink reutiliza el
     mismo gray-950 que ya usan las secciones oscuras del resto del sitio
     (M3/M6 de las páginas de programa) — "no introduzcas un segundo
     negro", ver CLAUDE.md. */
  --ink:var(--color-gray-950, #030712);
  --paper:var(--color-paper, #f2ede4);
  --paper-2:var(--color-paper-strong, #e5dccd);
  --blueprint:var(--color-brand, #006cff);
  --blueprint-light:color-mix(in oklab, var(--color-brand, #006cff) 55%, white 45%);
  --signal:var(--color-brand-strong, #0052cc);
  --line:var(--border, #d1d5db);
  --line-soft:color-mix(in oklab, var(--border, #d1d5db) 55%, white 45%);
  --white:var(--background, #ffffff);
  --maxw:1120px;
  margin:0;
  background:var(--paper);
  color:var(--ink);
  font-family:var(--font-ibm-plex-sans), sans-serif;
  font-size:17px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.mbim2-landing, .mbim2-landing *{box-sizing:border-box;}
.mbim2-landing h1, .mbim2-landing h2, .mbim2-landing h3{
  font-family:var(--font-space-grotesk), sans-serif;
  font-weight:600;
  margin:0;
  letter-spacing:-0.01em;
}
.mbim2-landing .mono{
  font-family:var(--font-ibm-plex-mono), monospace;
}
.mbim2-landing .wrap{
  max-width:var(--maxw);
  margin:0 auto;
  padding:0 32px;
}
.mbim2-landing a{color:inherit;text-decoration:none;}
.mbim2-landing ul{margin:0;padding:0;list-style:none;}
.mbim2-landing p{margin:0;}

/* ---------- background drafting grid ---------- */
.mbim2-landing .grid-bg{
  position:absolute;
  inset:0;
  background-image:
    linear-gradient(var(--line-soft) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-soft) 1px, transparent 1px);
  background-size:40px 40px;
  opacity:0.5;
  pointer-events:none;
}

/* ---------- nav ---------- */
.mbim2-landing .nav{
  position:sticky;
  top:0;
  z-index:50;
  background:rgba(237,239,239,0.92);
  backdrop-filter:blur(6px);
  border-bottom:1px solid var(--line);
}
.mbim2-landing .nav-inner{
  max-width:var(--maxw);
  margin:0 auto;
  padding:18px 32px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.mbim2-landing .nav-brand{
  display:flex;
  align-items:baseline;
  gap:10px;
}
.mbim2-landing .nav-brand .school{
  font-size:12px;
  color:var(--ink);
  opacity:0.55;
  font-family:var(--font-ibm-plex-mono), monospace;
}
.mbim2-landing .nav-brand .name{
  font-family:var(--font-space-grotesk), sans-serif;
  font-weight:700;
  font-size:20px;
}
.mbim2-landing .nav-links{
  display:flex;
  align-items:center;
  gap:28px;
  font-size:14.5px;
}
.mbim2-landing .nav-links a{
  color:var(--ink);
  opacity:0.75;
  border-bottom:1px solid transparent;
  padding-bottom:2px;
  transition:opacity .15s, border-color .15s;
}
.mbim2-landing .nav-links a:hover{opacity:1;border-color:var(--blueprint-light);}
.mbim2-landing .btn{
  display:inline-flex;
  align-items:center;
  gap:8px;
  font-family:var(--font-ibm-plex-sans), sans-serif;
  font-weight:600;
  font-size:14.5px;
  padding:11px 20px;
  border-radius:2px;
  cursor:pointer;
  border:1.5px solid transparent;
  transition:transform .12s, background .15s, border-color .15s;
}
.mbim2-landing .btn:hover{transform:translateY(-1px);}
.mbim2-landing .btn-signal{
  background:var(--signal);
  color:var(--white);
}
.mbim2-landing .btn-signal:hover{background:color-mix(in oklab, var(--signal) 85%, black 15%);}
.mbim2-landing .btn-ghost{
  background:transparent;
  color:var(--ink);
  border-color:var(--ink);
}
.mbim2-landing .btn-ghost:hover{border-color:var(--blueprint);color:var(--blueprint);}
.mbim2-landing .btn-ghost-light{
  background:transparent;
  color:var(--white);
  border-color:rgba(255,255,255,0.4);
}
.mbim2-landing .btn-ghost-light:hover{border-color:var(--white);}
.mbim2-landing .nav-cta{display:none;}
@media(min-width:720px){.mbim2-landing .nav-cta{display:inline-flex;}}
@media(max-width:719px){.mbim2-landing .nav-links{display:none;}}

/* ---------- eyebrow / dimension label ---------- */
.mbim2-landing .kicker{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12.5px;
  letter-spacing:0.08em;
  color:var(--blueprint);
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:18px;
}
.mbim2-landing .kicker::before{
  content:"";
  width:22px;
  height:1px;
  background:var(--blueprint);
}

/* ---------- hero ---------- */
.mbim2-landing .hero{
  position:relative;
  overflow:hidden;
  padding:96px 0 72px;
  border-bottom:1px solid var(--line);
}
.mbim2-landing .hero-inner{
  position:relative;
  z-index:2;
}
.mbim2-landing .hero h1{
  font-size:clamp(38px, 5.4vw, 62px);
  line-height:1.06;
  max-width:820px;
}
.mbim2-landing .hero h1 .accent{color:var(--blueprint);}
.mbim2-landing .hero-sub{
  max-width:560px;
  margin-top:26px;
  font-size:18px;
  color:#3A424B;
}
.mbim2-landing .hero-actions{
  display:flex;
  gap:16px;
  margin-top:36px;
  flex-wrap:wrap;
}

/* dimension stat row */
.mbim2-landing .dims{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:0;
  margin-top:72px;
  border-top:1px solid var(--line);
}
.mbim2-landing .dim{
  padding:22px 20px 6px;
  border-right:1px solid var(--line);
}
.mbim2-landing .dim:last-child{border-right:none;}
.mbim2-landing .dim-line{
  position:relative;
  height:1px;
  background:var(--ink);
  margin-bottom:14px;
}
.mbim2-landing .dim-line::before,.mbim2-landing .dim-line::after{
  content:"";
  position:absolute;
  top:-5px;
  width:1px;
  height:11px;
  background:var(--ink);
}
.mbim2-landing .dim-line::before{left:0;}
.mbim2-landing .dim-line::after{right:0;}
.mbim2-landing .dim-value{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-weight:600;
  font-size:30px;
  color:var(--blueprint);
  line-height:1;
}
.mbim2-landing .dim-label{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11.5px;
  letter-spacing:0.06em;
  text-transform:uppercase;
  color:#5B6470;
  margin-top:8px;
  display:block;
}
@media(max-width:760px){
  .mbim2-landing .dims{grid-template-columns:repeat(2,1fr);}
  .mbim2-landing .dim:nth-child(2n){border-right:none;}
}

/* ---------- section shell ---------- */
.mbim2-landing section{
  padding:88px 0;
  border-bottom:1px solid var(--line);
  position:relative;
}
.mbim2-landing .section-head{
  max-width:640px;
  margin-bottom:52px;
}
.mbim2-landing .section-head h2{
  font-size:clamp(28px,3.4vw,38px);
  line-height:1.12;
}
.mbim2-landing .section-head p{
  margin-top:16px;
  font-size:16.5px;
  color:#3A424B;
}
.mbim2-landing .corner-mark{
  position:absolute;
  width:14px;
  height:14px;
  border-top:1.5px solid var(--line);
  border-left:1.5px solid var(--line);
  top:24px;
  left:32px;
}

/* ---------- comparison (problema) ---------- */
.mbim2-landing .compare{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:0;
  border:1px solid var(--line);
}
.mbim2-landing .compare > div{padding:36px 32px;}
.mbim2-landing .compare .old{
  background:var(--paper-2);
  color:#5B6470;
}
.mbim2-landing .compare .new{
  background:var(--white);
  border-left:1px solid var(--line);
}
.mbim2-landing .compare h3{
  font-size:15px;
  font-family:var(--font-ibm-plex-mono), monospace;
  letter-spacing:0.04em;
  margin-bottom:20px;
  text-transform:uppercase;
}
.mbim2-landing .compare .old h3{color:#7A828C;}
.mbim2-landing .compare .new h3{color:var(--blueprint);}
.mbim2-landing .compare li{
  display:flex;
  gap:12px;
  padding:10px 0;
  border-top:1px solid var(--line-soft);
  font-size:15.5px;
}
.mbim2-landing .compare li:first-of-type{border-top:none;}
.mbim2-landing .compare .old li::before{content:"—";color:#9AA1A9;}
.mbim2-landing .compare .new li::before{content:"—";color:var(--signal);}
@media(max-width:720px){
  .mbim2-landing .compare{grid-template-columns:1fr;}
  .mbim2-landing .compare .new{border-left:none;border-top:1px solid var(--line);}
}

/* ---------- methodology timeline ---------- */
.mbim2-landing .day-split{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:28px;
  margin-bottom:56px;
}
.mbim2-landing .day-card{
  border:1px solid var(--line);
  background:var(--white);
  padding:28px;
}
.mbim2-landing .day-card .time{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:13px;
  color:var(--blueprint);
  letter-spacing:0.04em;
}
.mbim2-landing .day-card h3{
  font-size:22px;
  margin-top:10px;
}
.mbim2-landing .day-card p{
  margin-top:12px;
  color:#3A424B;
  font-size:15px;
}
@media(max-width:720px){.mbim2-landing .day-split{grid-template-columns:1fr;}}

.mbim2-landing .contract-bar{
  border:1px solid var(--ink);
  background:var(--white);
  padding:36px 32px 28px;
}
.mbim2-landing .contract-bar .label-top{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12.5px;
  letter-spacing:0.06em;
  color:#5B6470;
  text-transform:uppercase;
  margin-bottom:22px;
}
.mbim2-landing .contract-track{
  position:relative;
  height:56px;
}
.mbim2-landing .track-base{
  position:absolute;
  top:26px;left:0;right:0;
  height:1px;
  background:var(--line);
}
.mbim2-landing .seg{
  position:absolute;
  top:14px;
  height:24px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12.5px;
  color:var(--white);
  border-radius:1px;
}
.mbim2-landing .seg-master{left:0;width:62.5%;background:var(--blueprint);}
.mbim2-landing .seg-practicas{left:62.5%;width:37.5%;background:var(--blueprint-light);}
.mbim2-landing .contract-caption{
  display:flex;
  justify-content:space-between;
  margin-top:26px;
  font-size:14px;
  color:#3A424B;
  flex-wrap:wrap;
  gap:12px;
}
.mbim2-landing .contract-caption b{color:var(--ink);font-family:var(--font-ibm-plex-mono), monospace;}
.mbim2-landing .contract-note{
  margin-top:24px;
  padding-top:20px;
  border-top:1px solid var(--line-soft);
  font-size:15px;
}
.mbim2-landing .contract-note .num{color:var(--signal);font-family:var(--font-ibm-plex-mono), monospace;font-weight:600;}

/* ---------- AI dark section ---------- */
.mbim2-landing .ai-section{
  background:var(--ink);
  color:var(--white);
  border-bottom:1px solid var(--ink);
}
.mbim2-landing .ai-section .kicker{color:var(--blueprint-light);}
.mbim2-landing .ai-section .kicker::before{background:var(--blueprint-light);}
.mbim2-landing .ai-section .section-head h2{color:var(--white);}
.mbim2-landing .ai-section .section-head p{color:#B7BEC7;}
.mbim2-landing .ai-lede{
  max-width:720px;
  font-size:19px;
  color:#D8DDE3;
  margin-bottom:56px;
  line-height:1.55;
}
.mbim2-landing .ai-lede b{color:var(--white);}
.mbim2-landing .toolwall{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1px;
  background:rgba(255,255,255,0.12);
  border:1px solid rgba(255,255,255,0.12);
}
.mbim2-landing .toolgroup{
  background:var(--ink);
  padding:26px 22px;
}
.mbim2-landing .toolgroup h4{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11.5px;
  letter-spacing:0.06em;
  text-transform:uppercase;
  color:#7C8AA6;
  margin-bottom:16px;
}
.mbim2-landing .toolgroup ul li{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:14px;
  padding:6px 0;
  color:#E7EAEE;
  border-top:1px solid rgba(255,255,255,0.08);
}
.mbim2-landing .toolgroup ul li:first-child{border-top:none;}
@media(max-width:900px){.mbim2-landing .toolwall{grid-template-columns:repeat(2,1fr);}}
@media(max-width:520px){.mbim2-landing .toolwall{grid-template-columns:1fr;}}

.mbim2-landing .ai-eval{
  margin-top:56px;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:24px;
}
.mbim2-landing .ai-eval .card{
  border:1px solid rgba(255,255,255,0.18);
  padding:22px;
}
.mbim2-landing .ai-eval .pct{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:26px;
  /* --signal (azul oscuro) no se lee bien sobre este fondo casi negro —
     se usa --blueprint-light aquí, igual que el resto de acentos de esta
     sección oscura (kicker, punto del carril de módulos). */
  color:var(--blueprint-light);
}
.mbim2-landing .ai-eval .card p{
  margin-top:10px;
  font-size:14px;
  color:#C3C9D1;
}
@media(max-width:760px){.mbim2-landing .ai-eval{grid-template-columns:1fr;}}

/* ---------- programa accordion ---------- */
.mbim2-landing .module{
  border:1px solid var(--line);
  border-top:none;
  background:var(--white);
}
.mbim2-landing .module:first-child{border-top:1px solid var(--line);}
.mbim2-landing .module-head{
  display:flex;
  align-items:center;
  gap:20px;
  padding:22px 26px;
  cursor:pointer;
  user-select:none;
}
.mbim2-landing .module-head .idx{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:13px;
  color:var(--blueprint);
  width:28px;
  flex-shrink:0;
}
.mbim2-landing .module-head .title{
  flex:1;
  font-family:var(--font-space-grotesk), sans-serif;
  font-weight:600;
  font-size:17.5px;
}
.mbim2-landing .module-head .title .suffix{
  color:#5B6470;
  font-weight:400;
}
.mbim2-landing .module-head .meta{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12.5px;
  color:#5B6470;
  white-space:nowrap;
}
.mbim2-landing .module-head .plus{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:18px;
  color:var(--ink);
  width:16px;
  text-align:center;
  transition:transform .18s;
}
.mbim2-landing .module.open .plus{transform:rotate(45deg);}
.mbim2-landing .module-body{
  display:grid;
  grid-template-rows:0fr;
  overflow:hidden;
  opacity:0;
  transition:
    grid-template-rows .55s var(--ease-out-expo, ease),
    opacity .4s var(--ease-out-quart, ease);
}
.mbim2-landing .module.open .module-body{
  grid-template-rows:1fr;
  opacity:1;
}
.mbim2-landing .module-body-inner{
  min-height:0;
  padding:0 26px 26px 74px;
}
.mbim2-landing .module-body-inner p{
  font-size:15px;
  color:#3A424B;
  margin-bottom:14px;
}
.mbim2-landing .module-body-inner li{
  font-size:14.5px;
  color:#3A424B;
  padding:5px 0;
  padding-left:16px;
  position:relative;
}
.mbim2-landing .module-body-inner li::before{
  content:"";
  position:absolute;left:0;top:12px;
  width:6px;height:1px;
  background:var(--blueprint);
}
.mbim2-landing .module.flagship .module-head{background:color-mix(in oklab, var(--signal) 6%, transparent);}
.mbim2-landing .module.flagship .idx{color:var(--signal);}
.mbim2-landing .module.flagship .title .flagship-badge{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:10.5px;
  color:var(--signal);
  text-transform:uppercase;
  margin-left:12px;
  border:1px solid var(--signal);
  padding:2px 6px;
  border-radius:2px;
  letter-spacing:0.04em;
}
@media(max-width:640px){
  .mbim2-landing .module-head{flex-wrap:wrap;}
  .mbim2-landing .module-head .meta{order:3;width:100%;padding-left:48px;}
  .mbim2-landing .module-body-inner{padding-left:26px;}
}

/* ---------- credentials ---------- */
.mbim2-landing .cred-stack{
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:0;
  border:1px solid var(--line);
}
.mbim2-landing .cred-card{
  padding:32px 26px;
  border-right:1px solid var(--line);
  background:var(--white);
}
.mbim2-landing .cred-card:last-child{border-right:none;}
.mbim2-landing .cred-card .layer{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11.5px;
  color:var(--blueprint);
  letter-spacing:0.05em;
  text-transform:uppercase;
}
.mbim2-landing .cred-card h3{
  font-size:20px;
  margin-top:10px;
  margin-bottom:14px;
}
.mbim2-landing .cred-card p{
  font-size:14.5px;
  color:#3A424B;
}
@media(max-width:820px){
  .mbim2-landing .cred-stack{grid-template-columns:1fr;}
  .mbim2-landing .cred-card{border-right:none;border-bottom:1px solid var(--line);}
  .mbim2-landing .cred-card:last-child{border-bottom:none;}
}

.mbim2-landing .profiles{
  margin-top:44px;
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:1px;
  background:var(--line);
  border:1px solid var(--line);
}
.mbim2-landing .profile{
  background:var(--white);
  padding:18px 14px;
  font-size:13px;
  text-align:center;
}
.mbim2-landing .profile .tag{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:10.5px;
  color:var(--signal);
  margin-bottom:8px;
  display:block;
}
@media(max-width:900px){.mbim2-landing .profiles{grid-template-columns:repeat(2,1fr);}}

/* ---------- innovation summit timeline ---------- */
.mbim2-landing .summit-line{
  position:relative;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:24px;
}
.mbim2-landing .summit-line::before{
  content:"";
  position:absolute;
  top:11px;left:0;right:0;
  height:1px;
  background:var(--line);
}
.mbim2-landing .summit-card{position:relative;padding-top:34px;}
.mbim2-landing .summit-card .dot{
  position:absolute;top:6px;left:0;
  width:11px;height:11px;
  border-radius:50%;
  background:var(--signal);
  border:2px solid var(--paper);
}
.mbim2-landing .summit-card .month{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12px;
  color:#5B6470;
}
.mbim2-landing .summit-card h4{
  font-size:16.5px;
  margin-top:8px;
  margin-bottom:8px;
}
.mbim2-landing .summit-card p{font-size:13.5px;color:#3A424B;}
@media(max-width:820px){
  .mbim2-landing .summit-line{grid-template-columns:1fr;gap:34px;}
  .mbim2-landing .summit-line::before{display:none;}
}

/* ---------- talent / outcomes ---------- */
.mbim2-landing .outcomes{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:24px;
}
.mbim2-landing .outcome{
  border-top:2px solid var(--blueprint);
  padding-top:16px;
}
.mbim2-landing .outcome .n{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:26px;
  color:var(--ink);
}
.mbim2-landing .outcome p{font-size:14px;color:#3A424B;margin-top:6px;}
@media(max-width:760px){.mbim2-landing .outcomes{grid-template-columns:repeat(2,1fr);}}

/* ---------- testimonials ---------- */
.mbim2-landing .testimonials{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1px;
  background:var(--line);
  border:1px solid var(--line);
}
.mbim2-landing .testimonial{
  background:var(--white);
  padding:30px 26px;
  display:flex;
  flex-direction:column;
}
.mbim2-landing .testimonial .quote-mark{
  font-family:var(--font-space-grotesk), sans-serif;
  font-size:38px;
  color:var(--blueprint-light);
  line-height:1;
  margin-bottom:14px;
}
.mbim2-landing .testimonial .quote{
  font-size:15px;
  color:var(--ink);
  flex:1;
  line-height:1.55;
}
.mbim2-landing .testimonial .who{
  margin-top:22px;
  padding-top:16px;
  border-top:1px solid var(--line-soft);
}
.mbim2-landing .testimonial .who .name{
  font-family:var(--font-space-grotesk), sans-serif;
  font-weight:600;
  font-size:15px;
}
.mbim2-landing .testimonial .who .meta{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11.5px;
  color:#5B6470;
  margin-top:4px;
  letter-spacing:0.02em;
}
@media(max-width:900px){
  .mbim2-landing .testimonials{grid-template-columns:1fr;}
}

/* ---------- admission ---------- */
.mbim2-landing .steps{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:0;
  border:1px solid var(--line);
  margin-bottom:48px;
}
.mbim2-landing .step{
  padding:28px 24px;
  border-right:1px solid var(--line);
}
.mbim2-landing .step:last-child{border-right:none;}
.mbim2-landing .step .n{
  font-family:var(--font-ibm-plex-mono), monospace;
  color:var(--blueprint);
  font-size:13px;
}
.mbim2-landing .step h4{font-size:17px;margin-top:10px;margin-bottom:8px;}
.mbim2-landing .step p{font-size:14px;color:#3A424B;}
@media(max-width:760px){
  .mbim2-landing .steps{grid-template-columns:1fr;}
  .mbim2-landing .step{border-right:none;border-bottom:1px solid var(--line);}
}

.mbim2-landing .cta-final{
  background:var(--blueprint);
  color:var(--white);
  padding:80px 0;
  text-align:left;
}
.mbim2-landing .cta-final h2{
  color:var(--white);
  font-size:clamp(30px,4vw,44px);
  max-width:640px;
}
.mbim2-landing .cta-final p{
  color:#C9D3F5;
  margin-top:16px;
  max-width:520px;
  font-size:16.5px;
}
.mbim2-landing .cta-final .hero-actions{margin-top:34px;}

/* ---------- footer ---------- */
.mbim2-landing footer{
  background:var(--ink);
  color:#9AA1A9;
  padding:56px 0 36px;
}
.mbim2-landing .footer-grid{
  display:grid;
  grid-template-columns:2fr 1fr 1fr;
  gap:40px;
}
.mbim2-landing .footer-grid h5{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11.5px;
  letter-spacing:0.06em;
  text-transform:uppercase;
  color:#5B6470;
  margin-bottom:14px;
}
.mbim2-landing .footer-grid .brand{
  font-family:var(--font-space-grotesk), sans-serif;
  color:var(--white);
  font-size:20px;
  font-weight:700;
}
.mbim2-landing .footer-grid p, .mbim2-landing .footer-grid li{font-size:14px;line-height:1.9;}
.mbim2-landing .footer-bottom{
  margin-top:48px;
  padding-top:20px;
  border-top:1px solid rgba(255,255,255,0.1);
  font-size:12.5px;
  display:flex;
  justify-content:space-between;
  flex-wrap:wrap;
  gap:10px;
}
@media(max-width:760px){.mbim2-landing .footer-grid{grid-template-columns:1fr;}}

/* ===========================================================================
   REDISEÑO DE MOTION (2026-09-07) — capa añadida sobre el mockup original,
   sin tocar ningún texto. Reutiliza tokens/curvas ya definidos arriba
   (--ease-out-expo, --ease-out-quart, --ease-spring, --blueprint) y las
   clases globales del sitio (.journey-spotlight, .btn-sweep, .site-cursor,
   data-magnetic), nunca inventa un segundo sistema de curvas.
   =========================================================================== */

/* --- Hero: foco que sigue al cursor, reutiliza .journey-spotlight (global) -
   Esa clase ya trae su propia anulación por prefers-reduced-motion en
   globals.css — no hace falta duplicarla aquí. */
.mbim2-landing .hero-spotlight-host{position:relative;}

/* --- Flecha de los CTA: funciona con cualquier variante de .btn, no solo
   con .btn-sweep — .btn-signal conserva su propio hover de color-mix y
   solo gana el desplazamiento de la flecha. */
.mbim2-landing .btn-arrow-icon{
  display:inline-flex;
  transition:transform .45s var(--ease-out-expo, ease);
}
.mbim2-landing .btn:hover .btn-arrow-icon,
.mbim2-landing .btn:focus-visible .btn-arrow-icon{
  transform:translateX(0.3rem);
}

/* --- Anillo de pulso del CTA final — infinito, por eso vive por completo
   dentro de prefers-reduced-motion:no-preference (nunca una anulación
   aparte: fuera de esa media query, la animación simplemente no existe). */
.mbim2-landing .cta-pulse-wrap{
  position:relative;
  display:inline-flex;
  border-radius:2px;
}
.mbim2-landing .cta-pulse-wrap::before{
  content:"";
  position:absolute;
  inset:-6px;
  border-radius:4px;
  border:1.5px solid rgba(255,255,255,0.55);
  opacity:0;
  pointer-events:none;
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .cta-pulse-wrap::before{
    animation:mbim2-cta-pulse 2.6s var(--ease-in-out-quint) infinite;
  }
}
@keyframes mbim2-cta-pulse{
  0%{opacity:0.65;transform:scale(1);}
  70%{opacity:0;transform:scale(1.16);}
  100%{opacity:0;transform:scale(1.16);}
}
.mbim2-landing .cta-date{
  font-family:var(--font-ibm-plex-mono), monospace;
  letter-spacing:0.01em;
  color:var(--white);
}
.mbim2-landing .cta-lede-muted{
  color:rgba(255,255,255,0.62);
}

/* --- "El Problema": el año 2019 se tiñe (skill web-designer, patrón #25
   Two-Tone Split Headings) para que el titular no dependa solo del texto
   para marcar el contraste con/sin el máster. */
.mbim2-landing .year-tint{
  color:var(--signal);
}

/* --- "El Problema": revelado por líneas del párrafo de entrada (skill
   web-designer, patrón #19 — adaptado a SplitText/GSAP, ya en uso en el
   resto de la página, en vez del IntersectionObserver+toggle de clase del
   patrón original: mismo efecto visual, sin introducir un segundo
   mecanismo de reveal). Nunca en el mismo párrafo que ya usa SplitText
   (.ai-lede, revelado carácter a carácter) — es un texto distinto, para no
   duplicar tratamiento sobre el mismo elemento. */
.mbim2-landing .problema-lede-line{
  overflow:hidden;
}

/* --- Innovation Summit: carril de progreso real (elemento propio, no un
   ::before — hace falta un nodo real para poder escalarlo desde GSAP).
   Por defecto ya dibujado (scaleX:1): si GSAP no llega a cargar (movimiento
   reducido), el carril se ve completo desde el primer render, nunca oculto. */
.mbim2-landing .summit-progress{
  position:absolute;
  top:11px;left:0;right:0;
  height:1px;
  background:var(--blueprint);
  transform-origin:left center;
  transform:scaleX(1);
  pointer-events:none;
}

/* --- Admisión: acento lateral por paso, mismo "carril que se dibuja" que
   la línea de tiempo de Sobre IDESIE, aplicado en vertical. Visible al
   100% por defecto por el mismo motivo que el carril del summit. */
.mbim2-landing .step{position:relative;}
.mbim2-landing .step-accent{
  position:absolute;
  left:0;top:0;bottom:0;
  width:3px;
  background:var(--blueprint);
  transform:scaleY(1);
  transform-origin:top center;
  pointer-events:none;
}

/* --- Testimonios: comilla gigante decorativa de fondo, pura estética, sin
   animación — no compite con la comilla pequeña real (.quote-mark). */
.mbim2-landing .testimonial{position:relative;overflow:hidden;}
.mbim2-landing .testimonial::before{
  content:"\\201C";
  position:absolute;
  top:-0.3em;right:0.06em;
  font-family:var(--font-space-grotesk), sans-serif;
  font-size:9rem;
  font-weight:800;
  color:var(--blueprint);
  opacity:0.05;
  line-height:1;
  pointer-events:none;
}

/* --- Tercera capa de defensa (solo donde hace falta): el acordeón de
   Programa es una transición CSS pura ligada a estado de React, no pasa
   por useGsapEffect — se neutraliza aquí explícitamente, mismo criterio
   que .faq-panel en globals.css. Todo lo demás de este bloque vive dentro
   de gsap.from()/fromTo() en useGsapEffect: si el usuario pide menos
   movimiento, ese setup no llega a ejecutarse y el "from" oculto nunca se
   aplica — no hace falta anularlo aquí también. */
@media(prefers-reduced-motion:reduce){
  .mbim2-landing .module-body{
    transition:none !important;
  }
  .mbim2-landing .module.open .module-body{
    grid-template-rows:1fr !important;
  }
  .mbim2-landing .btn-arrow-icon{
    transition:none !important;
    transform:none !important;
  }
}
`

type Module = {
  idx: string
  title: string
  titleSuffix?: string
  meta: string
  flagship?: boolean
  intro: string
  items: string[]
}

const MODULES: Module[] = [
  {
    idx: "01",
    title: "Fundamentos BIM y Entornos Colaborativos",
    meta: "2 ECTS · 50h",
    intro:
      "Lo imprescindible para trabajar desde el primer día en un entorno de datos común real, sin teoría de relleno. Al terminar sabrás moverte en un CDE profesional y aplicar ISO 19650 sin memorizar la norma.",
    items: ["Metodología BIM aplicada", "Trabajo colaborativo en CDE", "ISO 19650 en la práctica"],
  },
  {
    idx: "02",
    title: "BIM Design",
    meta: "5 ECTS · 125h",
    intro:
      "El módulo con más peso del máster: aquí se construye la competencia técnica sobre la que se apoya todo lo demás. Modelarás y coordinarás como se hace en un estudio real, con mediciones que salen del propio modelo.",
    items: [
      "Arquitectura y estructuras en Revit",
      "Modelado de instalaciones (MEP)",
      "Coordinación multidisciplinar en Navisworks",
      "Mediciones y presupuestos automatizados",
    ],
  },
  {
    idx: "03",
    title: "BIM Construction",
    meta: "4 ECTS · 100h",
    intro:
      "Llevas el modelo a la obra: planificación y control de ejecución con datos, no con hojas de cálculo desconectadas de la realidad del proyecto.",
    items: ["Modelos 4D/5D", "Optimización de recursos, tiempos y costes", "Coordinación digital en obra"],
  },
  {
    idx: "04",
    title: "BIM Civil",
    titleSuffix: "(itinerario de especialización)",
    meta: "3 ECTS · 75h",
    intro:
      "Para quien se orienta a infraestructuras: la misma lógica BIM aplicada a carreteras, puentes y entornos urbanos complejos.",
    items: ["Civil 3D e InfraWorks", "Diseño de infraestructuras lineales"],
  },
  {
    idx: "05",
    title: "BIM Facility Management",
    meta: "3 ECTS · 75h",
    intro:
      "Qué pasa con el modelo BIM una vez entregada la obra: explotación en tiempo real durante toda la vida útil del edificio.",
    items: ["Mantenimiento preventivo y predictivo", "Explotación de modelos digitales"],
  },
  {
    idx: "06",
    title: "BIM Project Management + Analítica de datos",
    meta: "4 ECTS · 100h",
    intro:
      "Pasas de ejecutar dentro de un proyecto a dirigirlo: planes de gerencia, control de costes y cuadros de mando en Power BI que convierten datos en decisiones.",
    items: ["Planes de gerencia y cronogramas", "Control de costes y contratos", "Power BI aplicado a proyecto"],
  },
  {
    idx: "07",
    title: "IA Aplicada al Sector AEC",
    meta: "6 ECTS · 150h",
    flagship: true,
    intro:
      "Ver sección dedicada arriba ↑ — agentes de IA, MCP, generación de imagen y vídeo, copilotos en Revit (Adarcus, Pele AI, WiseBIM, Glyph). Diseñado con L35.",
    items: [
      "Fundamentos de IA generativa",
      "Prompting profesional y asistentes documentales",
      "Generación de imagen y vídeo",
      "Agentes, MCP y copilotos en Revit",
    ],
  },
  {
    idx: "08",
    title: "Talent",
    titleSuffix: "(transversal a todo el curso)",
    meta: "3 ECTS · 75h",
    intro:
      "La técnica no basta para liderar: comunicación, negociación y gestión de equipos multidisciplinares, con preparación específica para defender tu proyecto ante empresas.",
    items: [
      "Comunicación y liderazgo en entornos digitales",
      "Gestión de equipos y resolución de conflictos",
      "Pitch y presentación de proyecto",
    ],
  },
  {
    idx: "09",
    title: "Proyecto Fin de Máster",
    meta: "6 ECTS · 150h",
    intro:
      "La prueba de que todo se integra: modelado BIM, gestión de proyecto e IA aplicada sobre un caso real, defendido ante un tribunal profesional.",
    items: [
      "Modelado integral y coordinación multidisciplinar",
      "Flujo de IA documentado",
      "Defensa ante tribunal en el Demo Day",
    ],
  },
]

const TOOLGROUPS = [
  {
    title: "Modelos y prompting",
    items: ["Claude / ChatGPT / Gemini", "Prompt engineering profesional", "Skills y asistentes RAG", "ChatCTE, ChatNORMAD (casos L35)"],
  },
  {
    title: "Imagen y vídeo",
    items: ["Midjourney / ControlNet", "Nano Banana / GPT Imagen", "Runway / Veo / Kling", "Proceso L35: render → LLM → vídeo"],
  },
  {
    title: "Agentes + Revit",
    items: ["Adarcus — habla con tu modelo", "Pele AI — comandos en lenguaje natural", "WiseBIM — de plano 2D a BIM", "Glyph — scripting con IA (Dynamo)"],
  },
  {
    title: "Ecosistema BIM+IA",
    items: ["MCP — Model Context Protocol", "Autodesk Forma / Assistant", "Spacio / Architechtures", "Snaptrude / TestFit"],
  },
]

const AI_EVAL = [
  { pct: "40%", text: "Ejercicios prácticos entregados cada semana con herramientas reales, no exámenes teóricos." },
  { pct: "40%", text: "Proyecto integrador: aplicas el flujo completo de IA a un proyecto real de tu propio estudio." },
  { pct: "20%", text: "Tu hoja de ruta personal de adopción de IA: qué cambiar esta semana, este mes y en 3 meses." },
]

const CRED_STACK = [
  { layer: "01 · Universidad", title: "Sello universitario", text: "Validez académica y reconocimiento formal del programa como estudio de posgrado, en acuerdo con universidad partner." },
  { layer: "02 · AECOMI", title: "Certificación profesional", text: "Competencias evaluadas de forma independiente por perfil profesional — la credencial que mira un responsable técnico al contratar." },
  { layer: "03 · Cualificam", title: "Sello de calidad", text: "Certificación de la Fundación para el Conocimiento Madri+d que avala la calidad del máster como programa profesional." },
]

const PROFILES = ["BIM Coordinator", "Construction Manager", "Infrastructure BIM Specialist", "AEC AI Specialist", "BIM+AI Professional"]

const SUMMIT = [
  { month: "MES 2", title: "Kickoff Innovation Day", text: "Diseño generativo e IA en fases iniciales de proyecto." },
  { month: "MES 4", title: "Construction Tech Day", text: "Gemelos digitales de obra, control de ejecución 4D/5D." },
  { month: "MES 7", title: "Data & AI Day", text: "Agentes de IA, MCP y analítica aplicada a proyecto." },
  { month: "MES 10", title: "Demo Day", text: "Defensa de proyectos + feria de empleo con empresas partner." },
]

const OUTCOMES = [
  { n: "16 m.", text: "de contrato laboral garantizado desde el primer día" },
  { n: "36", text: "ECTS de contenido técnico, de gestión y de liderazgo" },
  { n: "3", text: "credenciales reconocibles por el sector al terminar" },
  { n: "1", text: "proyecto real defendido ante empresas, no ante un aula" },
]

const TESTIMONIALS = [
  {
    quote:
      "Firmé contrato la primera semana. Llegar al máster sabiendo que tenía 16 meses de nómina por delante cambió completamente cómo estudié: sin la presión de buscar trabajo en paralelo.",
    name: "[Nombre apellido]",
    meta: "Arquitecta técnica · Promoción [año] · [Empresa partner]",
  },
  {
    quote:
      "Antes usaba ChatGPT para redactar memorias. Ahora tengo un agente que revisa clashes en Revit antes de que yo abra el modelo. El módulo de IA no se parece a nada que hubiera visto en otro máster BIM.",
    name: "[Nombre apellido]",
    meta: "Ingeniero de caminos · Promoción [año] · [Empresa partner]",
  },
  {
    quote:
      "La certificación AECOMI pesó en la entrevista más que el propio título. El responsable técnico sabía exactamente qué significaba, porque el perfil está definido por competencias, no por un temario genérico.",
    name: "[Nombre apellido]",
    meta: "BIM Manager · Promoción [año] · [Empresa partner]",
  },
]

const STEPS = [
  { n: "01", title: "Solicita información", text: "Rellena el formulario y te contactamos en menos de 48h laborables." },
  { n: "02", title: "Entrevista personal", text: "Valoramos tu perfil y te asignamos empresa partner según tu especialidad." },
  { n: "03", title: "Reserva tu plaza", text: "Formalizas la matrícula y firmas el contrato laboral antes del inicio." },
]

export function LandingClient({ fontVariables }: { fontVariables: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Hero: foco que sigue al cursor sobre el fondo de retícula técnica, más
  // un parallax sutil de esa misma retícula. El <h1> no se toca aquí — su
  // revelado sigue siendo 100% CSS (.hero-line/.hero-fade), fuera de este
  // hook, para no comprometer el LCP.
  const heroRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const spotlight = scope.querySelector<HTMLElement>("[data-spotlight]")
    let removeSpotlight: (() => void) | undefined
    if (spotlight) {
      const onMove = (e: PointerEvent) => {
        const rect = scope.getBoundingClientRect()
        spotlight.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`)
        spotlight.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`)
      }
      scope.addEventListener("pointermove", onMove)
      removeSpotlight = () => scope.removeEventListener("pointermove", onMove)
    }

    const grid = scope.querySelector(".grid-bg")
    if (grid) {
      gsap.to(grid, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
      })
    }

    gsap.from(scope.querySelectorAll(".dim"), {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.6,
      delay: 0.6,
    })

    return () => removeSpotlight?.()
  })

  // El Problema: la columna antigua pierde nitidez a medida que se hace
  // scroll, la nueva se realza; cada bullet entra con un pequeño stagger;
  // el párrafo de entrada se revela línea a línea (deslizándose desde
  // abajo dentro de su propia máscara) al llegar a la sección.
  const problemaRef = useGsapEffect<HTMLElement>(({ gsap, SplitText }, scope) => {
    const lede = scope.querySelector<HTMLElement>(".problema-lede")
    let split: InstanceType<typeof SplitText> | undefined
    if (lede) {
      split = new SplitText(lede, { type: "lines", linesClass: "problema-lede-line" })
      gsap.from(split.lines, {
        yPercent: 100,
        duration: 0.7,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: lede, start: "top 85%", once: true },
      })
    }

    const oldCol = scope.querySelector(".old")
    if (oldCol) {
      gsap.fromTo(
        oldCol,
        { opacity: 1, filter: "saturate(1)" },
        {
          opacity: 0.55,
          filter: "saturate(0.35)",
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top 75%", end: "top 30%", scrub: 0.6 },
        },
      )
    }
    gsap.from(scope.querySelectorAll(".old li"), {
      opacity: 0,
      x: -12,
      stagger: 0.06,
      duration: 0.5,
      scrollTrigger: { trigger: scope, start: "top 70%", once: true },
    })
    gsap.from(scope.querySelectorAll(".new li"), {
      opacity: 0,
      x: -12,
      stagger: 0.08,
      duration: 0.5,
      delay: 0.15,
      scrollTrigger: { trigger: scope, start: "top 70%", once: true },
    })

    return () => split?.revert()
  })

  // Metodología: entrada de las dos tarjetas de jornada, y los dos segmentos
  // de la barra de contrato se dibujan de izquierda a derecha al llegar.
  const metodologiaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".day-card"), {
      opacity: 0,
      y: 28,
      stagger: 0.15,
      duration: 0.7,
      scrollTrigger: { trigger: scope.querySelector(".day-split"), start: "top 78%", once: true },
    })

    const bar = scope.querySelector(".contract-bar")
    const master = scope.querySelector(".seg-master")
    const practicas = scope.querySelector(".seg-practicas")
    if (bar && master) {
      gsap.fromTo(
        master,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: bar, start: "top 75%", once: true },
        },
      )
    }
    if (bar && practicas) {
      gsap.fromTo(
        practicas,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.8,
          delay: 0.35,
          ease: "power2.out",
          scrollTrigger: { trigger: bar, start: "top 75%", once: true },
        },
      )
    }
    gsap.from(scope.querySelector(".contract-note"), {
      opacity: 0,
      y: 12,
      duration: 0.6,
      delay: 0.7,
      scrollTrigger: { trigger: bar, start: "top 60%", once: true },
    })
  })

  // IA — ★ momento de bandera: el párrafo diferencial se revela carácter a
  // carácter mientras se hace scroll (efecto "generándose", coherente con
  // que la sección trata justo de IA generativa), y el muro de herramientas
  // + las 3 tarjetas de evaluación entran escalonadas.
  const iaRef = useGsapEffect<HTMLElement>(({ gsap, SplitText }, scope) => {
    const lede = scope.querySelector<HTMLElement>(".ai-lede")
    let split: InstanceType<typeof SplitText> | undefined
    if (lede) {
      split = new SplitText(lede, { type: "chars" })
      gsap.set(split.chars, { opacity: 0.16 })
      gsap.to(split.chars, {
        opacity: 1,
        stagger: 0.012,
        ease: "none",
        scrollTrigger: { trigger: lede, start: "top 85%", end: "bottom 55%", scrub: 0.4 },
      })
    }

    gsap.from(scope.querySelectorAll(".toolgroup"), {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.6,
      scrollTrigger: { trigger: scope.querySelector(".toolwall"), start: "top 80%", once: true },
    })

    gsap.from(scope.querySelectorAll(".ai-eval .card"), {
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.6,
      scrollTrigger: { trigger: scope.querySelector(".ai-eval"), start: "top 82%", once: true },
    })

    return () => split?.revert()
  })

  // Programa: entrada escalonada de los 9 módulos. La apertura/cierre del
  // acordeón ya la resuelve la CSS de arriba (grid-template-rows), sin JS.
  const programaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".module"), {
      opacity: 0,
      y: 18,
      stagger: 0.06,
      duration: 0.55,
      scrollTrigger: { trigger: scope.querySelector(".modules"), start: "top 82%", once: true },
    })
  })

  // Certificación — ★ momento de bandera: las 3 credenciales se "sellan" al
  // entrar en pantalla, mismo mecanismo exacto que balance-ledger.tsx /
  // convenio-card.tsx (back.out + stagger) — encaja de forma literal porque
  // el contenido son certificaciones reales.
  const certificacionRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".cred-card"), {
      opacity: 0,
      scale: 0.85,
      rotate: -4,
      stagger: 0.15,
      duration: 0.55,
      ease: "back.out(1.7)",
      scrollTrigger: { trigger: scope.querySelector(".cred-stack"), start: "top 75%", once: true },
    })
    gsap.from(scope.querySelectorAll(".profile"), {
      opacity: 0,
      y: 14,
      stagger: 0.06,
      duration: 0.5,
      scrollTrigger: { trigger: scope.querySelector(".profiles"), start: "top 85%", once: true },
    })
  })

  // Innovation Summit: el carril de progreso se dibuja de izquierda a
  // derecha, y cada punto "aparece" justo cuando el carril llega a él.
  const summitRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const line = scope.querySelector(".summit-line")
    const progress = scope.querySelector(".summit-progress")
    if (line && progress) {
      gsap.set(progress, { scaleX: 0 })
      gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: line, start: "top 75%", end: "bottom 60%", scrub: 0.5 },
      })
    }
    gsap.from(scope.querySelectorAll(".summit-card"), {
      opacity: 0,
      y: 16,
      stagger: 0.15,
      duration: 0.5,
      scrollTrigger: { trigger: line, start: "top 80%", once: true },
    })
    gsap.from(scope.querySelectorAll(".summit-card .dot"), {
      scale: 0,
      stagger: 0.15,
      duration: 0.4,
      ease: "back.out(1.8)",
      scrollTrigger: { trigger: line, start: "top 80%", once: true },
    })
  })

  // Resultados: entrada escalonada de las 4 cifras (el conteo en sí lo hace
  // StatCounter, sin depender de GSAP).
  const resultadosRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".outcome"), {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      scrollTrigger: { trigger: scope.querySelector(".outcomes"), start: "top 82%", once: true },
    })
  })

  // Testimonios: entrada con rotación alterna, mismo lenguaje que ya usó
  // esta misma sección en la versión anterior de /landing.
  const testimoniosRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    scope.querySelectorAll(".testimonial").forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 24,
        scale: 0.96,
        rotate: i % 2 === 0 ? -3 : 3,
        duration: 0.6,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: card, start: "top 85%", once: true },
      })
    })
  })

  // Admisión: entrada de los 3 pasos + el acento lateral de cada uno se
  // dibuja de arriba a abajo, escalonado — refuerza la sensación de
  // progreso hacia la reserva de plaza.
  const admisionRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".step"), {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.6,
      scrollTrigger: { trigger: scope.querySelector(".steps"), start: "top 80%", once: true },
    })
    gsap.fromTo(
      scope.querySelectorAll(".step-accent"),
      { scaleY: 0 },
      {
        scaleY: 1,
        stagger: 0.15,
        duration: 0.5,
        scrollTrigger: { trigger: scope.querySelector(".steps"), start: "top 78%", once: true },
      },
    )
  })

  // CTA final — ★ momento de bandera: entrada del titular/cuerpo y el CTA
  // primario con un pulso continuo discreto que nunca deja de señalarlo.
  const ctaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".cta-final h2, .cta-final p"), {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.7,
    })
  })

  return (
    <div className={`mbim2-landing ${fontVariables}`}>
      <style>{LANDING_STYLES}</style>

      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <span className="school mono">IDESIE</span>
            <span className="name">MBIM 2.0</span>
          </div>
          <div className="nav-links">
            <a href="#metodologia">Metodología</a>
            <a href="#ia">IA</a>
            <a href="#programa">Programa</a>
            <a href="#certificacion">Certificación</a>
            <a href="#testimonios">Testimonios</a>
            <a href="#admision">Admisión</a>
          </div>
          <a href="#admision" className="btn btn-signal nav-cta" data-magnetic data-magnetic-strength="0.35">
            Reservar plaza
            <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="hero" style={{ paddingTop: 96 }} ref={heroRef}>
        <div className="grid-bg" />
        <div className="wrap hero-inner journey-spotlight hero-spotlight-host" data-spotlight>
          <div className="kicker">MÁSTER PROPIO · IDESIE BUSINESS &amp; TECHNOLOGY SCHOOL</div>
          <h1>
            <span className="hero-line">El máster que te paga</span>
            <br />
            <span className="hero-line hero-line-2">mientras te convierte en el</span>
            <br />
            <span className="accent hero-line" style={{ animationDelay: "0.24s" }}>
              profesional que la IA no sustituye.
            </span>
          </h1>
          <p className="hero-sub hero-fade">
            BIM e Inteligencia Artificial de nivel profesional para arquitectos, ingenieros y técnicos AEC. Trabajas
            por las mañanas con contrato desde el primer día; te formamos por las tardes con las herramientas que ya
            están cambiando los estudios y las constructoras.
          </p>
          <div className="hero-actions hero-fade hero-fade-late">
            <span className="cta-pulse-wrap">
              <a href="#admision" className="btn btn-signal" data-magnetic>
                Reservar tu plaza
                <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
              </a>
            </span>
            <a
              href="#programa"
              className="btn btn-ghost btn-sweep"
              data-magnetic
              style={{ ["--btn-fill" as string]: "rgba(0,108,255,0.08)" }}
            >
              Ver el programa completo
              <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="dims">
            <div className="dim">
              <div className="dim-line" />
              <StatCounter value="16" className="dim-value mono" />
              <span className="dim-label">Meses de contrato mínimo garantizado</span>
            </div>
            <div className="dim">
              <div className="dim-line" />
              <StatCounter value="6" className="dim-value mono" />
              <span className="dim-label">ECTS dedicados solo a IA aplicada</span>
            </div>
            <div className="dim">
              <div className="dim-line" />
              <StatCounter value="3" className="dim-value mono" />
              <span className="dim-label">Credenciales: universidad + AECOMI + Cualificam</span>
            </div>
            <div className="dim">
              <div className="dim-line" />
              <StatCounter value="4" className="dim-value mono" />
              <span className="dim-label">Innovation Summits con empresas líderes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EL PROBLEMA ============ */}
      <section ref={problemaRef}>
        <div className="corner-mark" />
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">POR QUÉ ESTE MÁSTER ES DISTINTO</div>
            <h2>
              La mayoría de másteres BIM te preparan para <span className="year-tint mono">2019</span>.
            </h2>
            <p className="problema-lede">
              El sector AEC ya no contrata solo por saber modelar. Contrata a quien sabe modelar, gestionar y usar IA
              generativa para hacerlo en la mitad de tiempo — y quiere verlo aplicado a proyectos reales, no en un
              examen.
            </p>
          </div>
          <div className="compare">
            <div className="old">
              <h3>El máster BIM de siempre</h3>
              <ul>
                <li>100% presencial, 4,5 horas cada tarde, sin margen para trabajar</li>
                <li>La IA aparece en una sesión suelta, casi como curiosidad</li>
                <li>Título propio de la escuela, sin certificación externa</li>
                <li>Inserción laboral &quot;al terminar&quot;, si hay suerte</li>
              </ul>
            </div>
            <div className="new">
              <h3>MBIM 2.0</h3>
              <ul>
                <li>Metodología blended: 80% online, 20% presencial en casos reales</li>
                <li>6 ECTS íntegros de IA aplicada al AEC: agentes, MCP, copilotos en Revit</li>
                <li>Título + certificación profesional AECOMI + sello Cualificam</li>
                <li>Contrato laboral desde el día 1, mínimo 16 meses garantizados</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ METODOLOGÍA ============ */}
      <section id="metodologia" ref={metodologiaRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">METODOLOGÍA DUAL</div>
            <h2>Trabajas mientras estudias. No al revés.</h2>
            <p>
              Cada alumno firma contrato laboral con una empresa partner desde el inicio del máster. No es una beca
              ni unas prácticas simbólicas: es un puesto real, remunerado, con una duración mínima garantizada de 16
              meses.
            </p>
          </div>

          <div className="day-split">
            <div className="day-card">
              <div className="time mono">10:00 — 14:00</div>
              <h3>Trabajo remunerado</h3>
              <p>
                Proyectos reales en empresas partner del sector AEC. Aplicas cada semana lo que aprendes la tarde
                anterior, con contrato laboral desde el primer mes.
              </p>
            </div>
            <div className="day-card">
              <div className="time mono">16:00 — 20:00</div>
              <h3>Formación blended</h3>
              <p>
                80% online en directo — no vídeos grabados y ya — y 20% presencial concentrado en laboratorio,
                coordinación de equipos y resolución de casos reales.
              </p>
            </div>
          </div>

          <div className="contract-bar">
            <div className="label-top">Duración del contrato garantizado</div>
            <div className="contract-track">
              <div className="track-base" />
              <div className="seg seg-master">MÁSTER · MEDIA JORNADA</div>
              <div className="seg seg-practicas">PRÁCTICAS REMUNERADAS</div>
            </div>
            <div className="contract-caption">
              <span>
                <b>Meses 1–10</b> — formación + trabajo a media jornada
              </span>
              <span>
                <b>Meses 11–16</b> — prácticas remuneradas, ampliables
              </span>
            </div>
            <div className="contract-note">
              Al finalizar, posibilidad real de incorporación permanente en la empresa colaboradora.{" "}
              <span className="num">+16</span> meses de ingresos y experiencia antes de plantearte buscar trabajo.
            </div>
          </div>
        </div>
      </section>

      {/* ============ IA (dark section) ============ */}
      <section className="ai-section" id="ia" ref={iaRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">EL MÓDULO DIFERENCIAL</div>
            <h2>IA aplicada al AEC, sin filtros de nivel principiante.</h2>
            <p>
              Construido con José Carlos Martín Mateos, responsable de IA en el estudio L35. No es &quot;cómo usar
              ChatGPT&quot;: es cómo conectar agentes de IA directamente a tu modelo de Revit.
            </p>
          </div>

          <p className="ai-lede">
            Aprenderás a configurar <b>asistentes documentales propios</b> con la normativa de tu estudio, generar{" "}
            <b>imagen y vídeo fotorrealista</b> de tus proyectos, y operar <b>agentes que modifican tu modelo BIM</b>{" "}
            por lenguaje natural — el mismo flujo que ya usan los estudios que van un paso por delante.
          </p>

          <div className="toolwall">
            {TOOLGROUPS.map((group) => (
              <div className="toolgroup" key={group.title}>
                <h4>{group.title}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="ai-eval">
            {AI_EVAL.map((card) => (
              <div className="card" key={card.text}>
                <StatCounter value={card.pct} className="pct" />
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROGRAMA ============ */}
      <section id="programa" ref={programaRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">PROGRAMA COMPLETO · 36 ECTS</div>
            <h2>Todo el ciclo de vida de un proyecto AEC, más IA en cada fase.</h2>
            <p>
              Diseño, construcción, project management y explotación — con la Inteligencia Artificial integrada como
              capa transversal, no como módulo aislado. Pulsa cada módulo para ver el contenido y el objetivo.
            </p>
          </div>

          <div className="modules">
            {MODULES.map((mod, i) => {
              const isOpen = openIndex === i
              return (
                <div
                  className={`module${isOpen ? " open" : ""}${mod.flagship ? " flagship" : ""}`}
                  key={mod.idx}
                >
                  <div
                    className="module-head"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className="idx mono">{mod.idx}</span>
                    <span className="title">
                      {mod.title}
                      {mod.titleSuffix ? <span className="suffix"> {mod.titleSuffix}</span> : null}
                      {mod.flagship ? <span className="flagship-badge">módulo diferencial</span> : null}
                    </span>
                    <span className="meta">{mod.meta}</span>
                    <span className="plus">+</span>
                  </div>
                  <div className="module-body">
                    <div className="module-body-inner">
                      <p>{mod.intro}</p>
                      <ul>
                        {mod.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ CERTIFICACIÓN ============ */}
      <section id="certificacion" ref={certificacionRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">TRES CREDENCIALES, NO UNA</div>
            <h2>Sales con algo más que un diploma.</h2>
            <p>
              Cada credencial convence a un interlocutor distinto: la universidad da validez académica, AECOMI
              certifica competencias concretas ante el sector, y Cualificam avala la calidad del programa.
            </p>
          </div>

          <div className="cred-stack">
            {CRED_STACK.map((cred) => (
              <div className="cred-card" key={cred.layer}>
                <div className="layer mono">{cred.layer}</div>
                <h3>{cred.title}</h3>
                <p>{cred.text}</p>
              </div>
            ))}
          </div>

          <div className="profiles">
            {PROFILES.map((profile) => (
              <div className="profile" key={profile}>
                <span className="tag mono">AECOMI</span>
                {profile}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INNOVATION SUMMIT ============ */}
      <section ref={summitRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">CONEXIÓN DIRECTA CON EMPRESAS</div>
            <h2>IDESIE AEC Innovation Summit</h2>
            <p>
              Cuatro veces al año, empresas líderes del sector vienen a exponer casos reales delante de tu promoción
              — y a fichar.
            </p>
          </div>
          <div className="summit-line">
            <div className="summit-progress" aria-hidden="true" />
            {SUMMIT.map((item) => (
              <div className="summit-card" key={item.month}>
                <div className="dot" />
                <div className="month mono">{item.month}</div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RESULTADOS ============ */}
      <section ref={resultadosRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">LO QUE TE LLEVAS</div>
            <h2>Formación técnica y de liderazgo, no solo software.</h2>
          </div>
          <div className="outcomes">
            {OUTCOMES.map((item) => (
              <div className="outcome" key={item.text}>
                <StatCounter value={item.n} className="n mono" />
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIOS ============ */}
      {/* NOTA IDESIE: textos de ejemplo — sustituir por citas reales de antiguos alumnos, con su consentimiento, antes de publicar. */}
      <section id="testimonios" ref={testimoniosRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">LO QUE DICEN QUIENES YA LO HAN HECHO</div>
            <h2>No te lo contamos solo nosotros.</h2>
            <p>Testimonios de ejemplo — a sustituir por citas reales de antiguos alumnos antes de publicar la página.</p>
          </div>
          <div className="testimonials">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial" key={t.name + t.meta}>
                <div className="quote-mark">&ldquo;</div>
                <p className="quote">{t.quote}</p>
                <div className="who">
                  <div className="name">{t.name}</div>
                  <div className="meta">{t.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ADMISIÓN ============ */}
      <section id="admision" ref={admisionRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">PROCESO DE ADMISIÓN</div>
            <h2>Plazas limitadas — grupos reducidos por diseño.</h2>
            <p>
              El número reducido de alumnos por promoción es lo que permite garantizar contrato a todos desde el
              inicio. Empieza el proceso cuanto antes.
            </p>
          </div>
          <div className="steps">
            {STEPS.map((step) => (
              <div className="step" key={step.n}>
                <span className="step-accent" aria-hidden="true" />
                <div className="n mono">{step.n}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="cta-final" style={{ borderBottom: "none" }} ref={ctaRef}>
        <div className="wrap">
          <h2>
            <span className="cta-lede-muted">Empieza el </span>
            <span className="cta-date">24 de octubre de 2026</span>
            <span className="cta-lede-muted">.</span>
          </h2>
          <p>Grupo reducido, contrato desde el primer día y el módulo de IA más avanzado del mercado BIM en español.</p>
          <div className="hero-actions">
            <span className="cta-pulse-wrap">
              <a href="#admision" className="btn btn-signal" data-magnetic>
                Reservar tu plaza
                <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
              </a>
            </span>
            <a
              href="#"
              className="btn btn-ghost-light btn-sweep"
              data-magnetic
              style={{ ["--btn-fill" as string]: "rgba(255,255,255,0.16)" }}
            >
              Descargar el programa (PDF)
              <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="brand">IDESIE</div>
              <p style={{ marginTop: 10, maxWidth: 320 }}>
                Business &amp; Technology School. Formación de alto rendimiento para profesionales AEC.
              </p>
            </div>
            <div>
              <h5>Contacto</h5>
              <p>
                Calle San Aquilino, 13
                <br />
                28029 Madrid
              </p>
              <p style={{ marginTop: 8 }}>
                +34 914 859 132
                <br />
                info@idesie.com
              </p>
            </div>
            <div>
              <h5>Programa</h5>
              <ul>
                <li>
                  <a href="#metodologia">Metodología</a>
                </li>
                <li>
                  <a href="#ia">Módulo de IA</a>
                </li>
                <li>
                  <a href="#certificacion">Certificación</a>
                </li>
                <li>
                  <a href="#admision">Admisión</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 IDESIE Business &amp; Technology School</span>
            <span>MBIM 2.0 — Máster en BIM e Inteligencia Artificial</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
