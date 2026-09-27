"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, CalendarCheck, Play, Volume2, VolumeX } from "lucide-react"
import { useGsapEffect } from "@/hooks/use-gsap-effect"
import { StatCounter } from "@/components/home/stat-counter"
import { MetaPixel, trackMetaPixelEvent } from "@/components/meta-pixel"
import { AdmisionModal } from "@/components/admision-modal"
import { CatalogDownloadDialog } from "@/components/catalog-download-dialog"
import { LeadCaptureForm } from "@/components/lead-capture-form"

/**
 * 2026-09-27 — Rediseño visual completo ("Premium SaaS moderno"), pedido
 * explícito del cliente: "súper enfocado en vender, moderno, estilo limpio".
 * Dirección elegida entre 3 propuestas (ver CLAUDE.md) sobre la versión
 * anterior ("MBIM 2.0", réplica fiel de un mockup de blueprint técnico:
 * retículas de dibujo técnico, edificio 3D animado, chips mono con bordes
 * cuadrados, degradados azul→violeta). Esta pasada NO toca ni un carácter
 * de contenido real (textos, cifras, testimonios, programa, precios,
 * fechas) — solo el sistema visual: fondo blanco predominante, tarjetas con
 * sombra suave y esquinas redondeadas, un único azul de marca + ámbar como
 * acento puntual (sin violeta), botones tipo píldora, sin retículas de
 * dibujo técnico ni el edificio 3D del hero (sustituido por una pila de
 * tarjetas limpias con la misma información real: plazas, testimonio,
 * contrato). Toda la coreografía GSAP (`use*Ref` más abajo) seguía
 * intacta: los elementos puramente decorativos que se retiran del JSX
 * (`.grid-bg`, `.corner-mark`, el edificio `.b3d-*`) no los anima ningún
 * otro flujo de negocio — sus `querySelectorAll` sencillamente no
 * encuentran nada y no hacen nada, sin errores.
 *
 * Igual que en la versión anterior, el `<h1>` del hero se sigue animando
 * solo con CSS (`.hero-line`/`.hero-fade`) para no comprometer el LCP.
 */

const LANDING_STYLES = `
.mbim2-landing{
  --ink:var(--color-gray-950, #0b0f19);
  --white:#ffffff;
  --bg:#ffffff;
  --bg-soft:#f6f8fb;
  --blueprint:var(--color-brand, #006cff);
  --blueprint-strong:var(--color-brand-strong, #0052cc);
  --blueprint-soft:color-mix(in oklab, var(--color-brand, #006cff) 8%, white 92%);
  --blueprint-line:color-mix(in oklab, var(--color-brand, #006cff) 24%, white 76%);
  --blueprint-light:color-mix(in oklab, var(--color-brand, #006cff) 55%, white 45%);
  --amber:var(--secondary, #ffba08);
  --amber-strong:#c97d05;
  --line:#e7eaf0;
  --muted:#5b6472;
  --dim:#98a2b3;
  --maxw:1160px;
  --radius-lg:28px;
  --radius-md:18px;
  --radius-sm:12px;
  --shadow-soft:0 24px 48px -28px rgba(16,24,40,0.18);
  --shadow-soft-sm:0 12px 28px -18px rgba(16,24,40,0.16);
  --shadow-brand:0 24px 48px -20px rgba(0,108,255,0.38);
  margin:0;
  background:var(--bg);
  color:var(--ink);
  font-family:var(--font-ibm-plex-sans), sans-serif;
  font-size:17px;
  line-height:1.65;
  -webkit-font-smoothing:antialiased;
}
.mbim2-landing, .mbim2-landing *{box-sizing:border-box;}
.mbim2-landing h1, .mbim2-landing h2, .mbim2-landing h3{
  font-family:var(--font-space-grotesk), sans-serif;
  font-weight:600;
  margin:0;
  letter-spacing:-0.015em;
}
.mbim2-landing .mono{font-family:var(--font-ibm-plex-mono), monospace;}
.mbim2-landing .wrap{max-width:var(--maxw);margin:0 auto;padding:0 32px;}
.mbim2-landing a{color:inherit;text-decoration:none;}
.mbim2-landing ul{margin:0;padding:0;list-style:none;}
.mbim2-landing p{margin:0;}

/* ---------- nav ---------- */
.mbim2-landing .nav{
  position:sticky;top:0;z-index:50;
  background:rgba(255,255,255,0.88);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
}
.mbim2-landing .nav-inner{max-width:var(--maxw);margin:0 auto;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;}
.mbim2-landing .nav-brand{display:flex;align-items:baseline;gap:10px;}
.mbim2-landing .nav-brand .school{font-size:11.5px;color:var(--muted);font-family:var(--font-ibm-plex-mono), monospace;letter-spacing:0.04em;}
.mbim2-landing .nav-brand .name{font-family:var(--font-space-grotesk), sans-serif;font-weight:700;font-size:19px;}
.mbim2-landing .nav-links{display:flex;align-items:center;gap:30px;font-size:14.5px;}
.mbim2-landing .nav-links a{color:var(--muted);border-bottom:1px solid transparent;padding-bottom:2px;transition:color .15s, border-color .15s;}
.mbim2-landing .nav-links a:hover{color:var(--ink);border-color:var(--blueprint-line);}
.mbim2-landing .btn{
  display:inline-flex;align-items:center;gap:8px;
  font-family:var(--font-ibm-plex-sans), sans-serif;font-weight:600;font-size:14.5px;
  padding:12px 22px;border-radius:999px;cursor:pointer;border:1.5px solid transparent;
  transition:transform .16s var(--ease-out-quart, ease), background .18s, border-color .18s, box-shadow .18s, color .18s;
}
.mbim2-landing .btn:hover{transform:translateY(-2px);}
.mbim2-landing .btn-signal{background:var(--blueprint);color:var(--white);box-shadow:var(--shadow-brand);}
.mbim2-landing .btn-signal:hover{background:var(--blueprint-strong);}
.mbim2-landing .btn-ghost{background:var(--white);color:var(--ink);border-color:var(--line);}
.mbim2-landing .btn-ghost:hover{border-color:var(--blueprint);color:var(--blueprint);}
.mbim2-landing .btn-ghost-light{background:rgba(255,255,255,0.08);color:var(--white);border-color:rgba(255,255,255,0.4);}
.mbim2-landing .btn-ghost-light:hover{border-color:var(--white);background:rgba(255,255,255,0.16);}
.mbim2-landing .nav-cta{display:none;}
@media(min-width:1000px){.mbim2-landing .nav-cta{display:inline-flex;}}
@media(max-width:999px){.mbim2-landing .nav-links{display:none;}}

/* ---------- eyebrow / kicker ---------- */
.mbim2-landing .kicker{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12px;letter-spacing:0.06em;color:var(--blueprint);
  display:flex;align-items:center;gap:10px;margin-bottom:18px;
}
.mbim2-landing .kicker-pill{
  display:inline-flex;align-items:center;gap:9px;
  padding:8px 16px 8px 12px;border-radius:999px;
  background:var(--blueprint-soft);border:1px solid var(--blueprint-line);
  color:var(--blueprint-strong);
}
.mbim2-landing .kicker-dot{position:relative;width:7px;height:7px;border-radius:50%;background:var(--blueprint);flex-shrink:0;box-shadow:0 0 0 0 rgba(0,108,255,0.55);}
@media(prefers-reduced-motion:no-preference){.mbim2-landing .kicker-dot{animation:mbim2-dot-pulse 2.2s var(--ease-in-out-quint, cubic-bezier(0.83,0,0.17,1)) infinite;}}
@keyframes mbim2-dot-pulse{0%{box-shadow:0 0 0 0 rgba(0,108,255,0.55);}70%{box-shadow:0 0 0 8px rgba(0,108,255,0);}100%{box-shadow:0 0 0 8px rgba(0,108,255,0);}}

/* ---------- barra de urgencia ---------- */
.mbim2-landing .urgency-bar{
  background:var(--blueprint-soft);
  border-bottom:1px solid var(--blueprint-line);
  color:var(--ink);
  text-align:center;padding:9px 20px;
  font-family:var(--font-ibm-plex-mono), monospace;font-size:12px;letter-spacing:0.01em;
}
.mbim2-landing .urgency-bar b{font-weight:600;}
.mbim2-landing .urgency-bar .amber{color:var(--amber-strong);font-weight:600;}
.mbim2-landing .urgency-bar .sep{margin:0 10px;opacity:0.4;}

/* ---------- hero ---------- */
.mbim2-landing .hero{position:relative;overflow:hidden;border-bottom:1px solid var(--line);padding:0;}
.mbim2-landing .hero-inner{position:relative;z-index:2;}
.mbim2-landing .hero-grid{
  position:relative;display:grid;
  grid-template-columns:minmax(0,1.05fr) minmax(0,0.95fr);
  align-items:stretch;min-height:640px;max-width:1560px;margin:0 auto;
}
@media(max-width:960px){.mbim2-landing .hero-grid{grid-template-columns:1fr;min-height:0;}}

.mbim2-landing .hero-copy-col{position:relative;padding:64px 48px;display:flex;flex-direction:column;justify-content:center;}
.mbim2-landing .hero-copy-inner{position:relative;z-index:2;max-width:600px;}

.mbim2-landing .hero-social-proof{display:flex;align-items:center;gap:12px;margin-bottom:18px;}
.mbim2-landing .avatar-stack{display:flex;}
.mbim2-landing .avatar-stack span{width:28px;height:28px;border-radius:50%;border:2px solid var(--white);margin-left:-8px;background:linear-gradient(135deg, var(--blueprint), var(--blueprint-strong));box-shadow:var(--shadow-soft-sm);}
.mbim2-landing .avatar-stack span:first-child{margin-left:0;}
.mbim2-landing .hero-social-proof p{font-size:13.5px;color:var(--muted);}
.mbim2-landing .hero-social-proof p b{color:var(--ink);font-weight:600;}

.mbim2-landing .hero h1{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;
  font-weight:700;font-size:clamp(32px, 3.4vw, 46px);line-height:1.08;letter-spacing:-0.03em;
}
.mbim2-landing .hero h1 .accent{color:var(--blueprint);}
.mbim2-landing .hero-cursor{display:inline-block;width:3px;height:0.78em;margin-left:4px;background:var(--blueprint);vertical-align:-0.1em;}
@media(prefers-reduced-motion:no-preference){.mbim2-landing .hero-cursor{animation:mbim2-cursor-blink 1.05s steps(1) infinite;}}
@keyframes mbim2-cursor-blink{0%,50%{opacity:1;}50.01%,100%{opacity:0;}}

.mbim2-landing .hero-line{display:block;}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .hero-line{animation:mbim2-hero-line-in 1.1s var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)) both;}
  .mbim2-landing .hero-fade{animation:mbim2-hero-fade-in 1s var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)) both;animation-delay:0.3s;}
  .mbim2-landing .hero-fade-late{animation-delay:0.45s;}
}
@keyframes mbim2-hero-line-in{from{opacity:0;transform:translate3d(0,0.5em,0);}to{opacity:1;transform:none;}}
@keyframes mbim2-hero-fade-in{from{opacity:0;transform:translate3d(0,1.25rem,0);}to{opacity:1;transform:none;}}

.mbim2-landing .hero-sub{max-width:520px;margin-top:18px;font-size:16px;color:var(--muted);}

.mbim2-landing .hero-chips{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px;}
.mbim2-landing .hero-chip{
  display:flex;flex-direction:column;gap:2px;padding:14px 18px;border-radius:var(--radius-sm);
  background:var(--white);border:1px solid var(--line);box-shadow:var(--shadow-soft-sm);
  transition:transform .2s var(--ease-out-quart, ease), box-shadow .2s var(--ease-out-quart, ease);
}
.mbim2-landing .hero-chip:hover{transform:translateY(-3px);box-shadow:var(--shadow-soft);}
.mbim2-landing .hero-chip .chip-value{font-family:var(--font-ibm-plex-mono), monospace;font-weight:600;font-size:21px;color:var(--blueprint);line-height:1;}
.mbim2-landing .hero-chip .chip-label{font-size:12px;color:var(--muted);}
@media(prefers-reduced-motion:reduce){.mbim2-landing .hero-chip{transition:none;}}

.mbim2-landing .hero-actions{display:flex;gap:14px;margin-top:28px;flex-wrap:wrap;align-items:center;}
.mbim2-landing .hero-trust-note{
  display:inline-flex;align-items:center;gap:6px;font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12px;color:var(--muted);margin-top:16px;text-decoration:none;border-bottom:1px solid transparent;padding-bottom:1px;
  transition:color .2s var(--ease-out-quart, ease), border-color .2s var(--ease-out-quart, ease);
}
.mbim2-landing .hero-trust-note:hover{color:var(--blueprint);border-color:currentColor;}
.mbim2-landing .hero-trust-note svg{flex-shrink:0;}

.mbim2-landing .hero-cta-gradient{background:linear-gradient(120deg, var(--blueprint), var(--blueprint-strong));color:var(--white);box-shadow:var(--shadow-brand);}

/* ---------- hero: panel visual (sin edificio 3D, tarjetas reales apiladas) ---------- */
.mbim2-landing .hero-visual-col{
  position:relative;overflow:hidden;
  background:radial-gradient(120% 100% at 20% 0%, color-mix(in oklab, var(--blueprint) 22%, var(--ink)) 0%, var(--ink) 60%);
  display:flex;align-items:center;justify-content:center;padding:56px 40px;
}
.mbim2-landing .hero-visual-glow{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;}
.mbim2-landing .hero-visual-glow--1{width:420px;height:420px;top:-120px;right:-100px;background:color-mix(in oklab, var(--blueprint) 45%, transparent);}
.mbim2-landing .hero-visual-glow--2{width:340px;height:340px;bottom:-140px;left:-90px;background:color-mix(in oklab, var(--amber) 32%, transparent);}
.mbim2-landing .hero-visual-stack{position:relative;z-index:1;display:flex;flex-direction:column;gap:16px;width:100%;max-width:340px;}

.mbim2-landing .hero-float-card{
  position:relative;padding:20px 22px;border-radius:var(--radius-md);
  background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.14);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  color:var(--white);box-shadow:0 20px 45px -22px rgba(0,0,0,0.55);
  transition:transform .25s var(--ease-out-quart, ease), box-shadow .25s var(--ease-out-quart, ease);
}
.mbim2-landing .hero-float-card:hover{transform:translateY(-4px);box-shadow:0 28px 54px -20px rgba(0,0,0,0.6);}
.mbim2-landing .hero-card-testimonial{background:rgba(0,108,255,0.16);border-color:rgba(0,108,255,0.3);}
@media(prefers-reduced-motion:reduce){.mbim2-landing .hero-float-card{transition:none;}}

.mbim2-landing .card-badge{
  display:inline-flex;align-items:center;gap:6px;
  font-family:var(--font-ibm-plex-mono), monospace;font-size:10.5px;letter-spacing:0.05em;text-transform:uppercase;
  color:var(--amber);margin-bottom:10px;
}
.mbim2-landing .card-badge--white{color:rgba(255,255,255,0.75);}
.mbim2-landing .seat-bar-track{position:relative;height:6px;border-radius:999px;background:rgba(255,255,255,0.16);overflow:hidden;margin-bottom:10px;}
.mbim2-landing .seat-bar-fill{position:absolute;inset:0;border-radius:999px;background:linear-gradient(90deg, var(--amber), #ff7a45);transform-origin:left center;transform:scaleX(0.7667);}
.mbim2-landing .hero-card-caption{font-size:12.5px;color:rgba(255,255,255,0.72);}
.mbim2-landing .hero-card-caption b{color:var(--white);font-weight:600;}
.mbim2-landing .hero-card-testimonial .quote{font-size:14px;line-height:1.45;color:rgba(255,255,255,0.95);margin-bottom:12px;}
.mbim2-landing .hero-card-testimonial .who{display:flex;align-items:center;gap:9px;}
.mbim2-landing .hero-card-testimonial .who-avatar{width:26px;height:26px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg, var(--blueprint), var(--blueprint-strong));}
.mbim2-landing .hero-card-testimonial .who-meta{font-family:var(--font-ibm-plex-mono), monospace;font-size:11.5px;color:rgba(255,255,255,0.72);}
.mbim2-landing .hero-card-contract p{font-size:13.5px;line-height:1.4;color:rgba(255,255,255,0.85);margin:2px 0 0;}
.mbim2-landing .hero-card-contract b{color:var(--white);}

/* ---------- section shell ---------- */
.mbim2-landing section{padding:100px 0;border-bottom:1px solid var(--line);position:relative;}
.mbim2-landing .section-head{max-width:640px;margin-bottom:52px;}
.mbim2-landing .section-head h2{font-size:clamp(28px,3.2vw,38px);line-height:1.15;}
.mbim2-landing .section-head p{margin-top:16px;font-size:16.5px;color:var(--muted);}

/* ---------- El Problema ---------- */
.mbim2-landing .problema-head{max-width:880px;margin:0 auto 56px;text-align:center;}
.mbim2-landing .problema-eyebrow{
  display:flex;align-items:center;justify-content:center;gap:14px;
  font-family:var(--font-ibm-plex-mono), monospace;font-size:11.5px;letter-spacing:0.08em;text-transform:uppercase;
  color:var(--blueprint);margin-bottom:20px;
}
.mbim2-landing .problema-eyebrow::before,.mbim2-landing .problema-eyebrow::after{content:"";width:26px;height:1px;background:var(--blueprint-line);}
.mbim2-landing .problema-head h2{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;font-weight:800;
  font-size:clamp(30px, 3.6vw, 44px);line-height:1.1;letter-spacing:-0.02em;
}
.mbim2-landing .problema-strike{position:relative;color:var(--dim);display:inline-block;}
.mbim2-landing .problema-strike-line{position:absolute;left:0;right:0;top:52%;height:2px;background:var(--dim);transform-origin:left center;transform:scaleX(1);pointer-events:none;}
.mbim2-landing .problema-grad{color:var(--blueprint);}
.mbim2-landing .problema-lede{margin:18px auto 0;max-width:600px;font-size:16.5px;line-height:1.65;color:var(--muted);text-align:center;}
.mbim2-landing .problema-lede-line{overflow:hidden;}
.mbim2-landing .problema-aura{position:absolute;top:-100px;right:-100px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle, var(--blueprint-soft) 0%, transparent 70%);filter:blur(30px);pointer-events:none;}

/* ---------- comparativa ---------- */
.mbim2-landing .compare{display:grid;grid-template-columns:1fr auto 1fr;align-items:stretch;gap:0;}
.mbim2-landing .compare-divider{position:relative;width:1px;margin:0 34px;background:var(--line);}
.mbim2-landing .compare-divider-pill{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);white-space:nowrap;
  background:var(--white);border:1px solid var(--line);border-radius:100px;padding:7px 16px;
  font-family:var(--font-ibm-plex-mono), monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--muted);box-shadow:var(--shadow-soft-sm);
}
.mbim2-landing .compare-panel{border-radius:var(--radius-lg);padding:36px;}
.mbim2-landing .compare-tag{display:flex;align-items:center;gap:8px;font-family:var(--font-ibm-plex-mono), monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px;}
.mbim2-landing .compare-tag-sq{width:7px;height:7px;border-radius:2px;flex-shrink:0;}
.mbim2-landing .compare-panel h3{font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;font-size:22px;font-weight:700;margin-bottom:24px;}
.mbim2-landing .compare-row{position:relative;display:flex;align-items:flex-start;gap:12px;padding:13px 0;font-size:14.5px;transition:transform .25s var(--ease-out-quart, ease);}
.mbim2-landing .compare-row:hover{transform:translateX(4px);}
.mbim2-landing .compare-row-text{flex:1;min-width:0;}
.mbim2-landing .compare-icon{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;line-height:1;flex-shrink:0;margin-top:1px;}

.mbim2-landing .compare-old{background:var(--bg-soft);border:1px solid var(--line);}
.mbim2-landing .compare-old .compare-tag{color:var(--dim);}
.mbim2-landing .compare-old .compare-tag-sq{background:#c3c9d3;}
.mbim2-landing .compare-old h3{color:var(--dim);}
.mbim2-landing .compare-old .compare-row{color:var(--muted);border-bottom:1px solid var(--line);}
.mbim2-landing .compare-old .compare-row:last-child{border-bottom:none;}
.mbim2-landing .compare-old .compare-icon{background:#e3e6ec;color:#8b93a1;}

.mbim2-landing .compare-new{
  position:relative;overflow:hidden;
  background:linear-gradient(160deg, var(--ink), color-mix(in oklab, var(--ink) 82%, var(--blueprint) 18%));
  border:1px solid rgba(0,108,255,0.25);box-shadow:var(--shadow-brand);color:rgba(255,255,255,0.85);
}
.mbim2-landing .compare-new::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg, var(--blueprint), var(--amber));}
.mbim2-landing .compare-new .compare-tag{color:var(--blueprint-light);}
.mbim2-landing .compare-new .compare-tag-sq{background:var(--blueprint);}
.mbim2-landing .compare-new .compare-panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
.mbim2-landing .compare-new h3{color:var(--white);margin-bottom:0;}
.mbim2-landing .compare-new-badge{font-family:var(--font-ibm-plex-mono), monospace;font-size:9.5px;letter-spacing:0.08em;text-transform:uppercase;color:var(--white);background:var(--blueprint);border-radius:100px;padding:6px 12px;}
.mbim2-landing .compare-new .compare-row{border-bottom:1px solid rgba(255,255,255,0.08);}
.mbim2-landing .compare-new .compare-row:last-child{border-bottom:none;}
.mbim2-landing .compare-new .compare-row b{color:var(--white);font-weight:600;}
.mbim2-landing .compare-new .compare-icon{background:rgba(0,108,255,0.25);border:1px solid rgba(0,108,255,0.4);color:var(--white);}
.mbim2-landing .compare-row-accent{position:absolute;left:-30px;top:2px;bottom:2px;width:2px;background:var(--blueprint);transform-origin:top center;transform:scaleY(1);}

@media(max-width:900px){
  .mbim2-landing .compare{grid-template-columns:1fr;}
  .mbim2-landing .compare-divider{display:none;}
  .mbim2-landing .compare-old{margin-bottom:20px;}
}

/* ---------- Metodología ---------- */
.mbim2-landing .metodologia-head{max-width:980px;margin-bottom:48px;}
.mbim2-landing .metodologia-eyebrow{
  display:flex;align-items:center;gap:14px;font-family:var(--font-ibm-plex-mono), monospace;font-size:11.5px;
  letter-spacing:0.1em;text-transform:uppercase;color:var(--blueprint);margin-bottom:18px;
}
.mbim2-landing .metodologia-eyebrow::before{content:"";width:26px;height:1px;background:var(--blueprint-line);}
.mbim2-landing .metodologia-head h2{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;font-weight:800;
  font-size:clamp(28px, 3.6vw, 43px);line-height:1.08;letter-spacing:-0.02em;max-width:680px;
}
.mbim2-landing .metodologia-grad{position:relative;display:inline-block;color:var(--blueprint);}
.mbim2-landing .metodologia-grad-underline{position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--blueprint-line);transform-origin:left center;transform:scaleX(1);pointer-events:none;}
.mbim2-landing .metodologia-lede{margin-top:16px;max-width:620px;font-size:16.5px;line-height:1.68;color:var(--muted);}
.mbim2-landing .metodologia-lede b{color:var(--ink);font-weight:600;}

.mbim2-landing .contract-block{
  position:relative;overflow:hidden;border-radius:var(--radius-lg);
  background:linear-gradient(150deg, var(--blueprint), var(--blueprint-strong));
  color:var(--white);padding:44px 48px 40px;box-shadow:var(--shadow-brand);
}
.mbim2-landing .contract-block::after{
  content:"";position:absolute;top:-140px;right:-120px;width:380px;height:380px;border-radius:50%;
  background:radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%);pointer-events:none;
}
.mbim2-landing .contract-block-inner{position:relative;z-index:1;}
.mbim2-landing .contract-block-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;margin-bottom:38px;}
.mbim2-landing .contract-tag{display:flex;align-items:center;gap:8px;font-family:var(--font-ibm-plex-mono), monospace;font-size:10.5px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.78);margin-bottom:14px;}
.mbim2-landing .contract-tag-sq{width:7px;height:7px;border-radius:2px;background:var(--white);flex-shrink:0;}
.mbim2-landing .contract-block-title{font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;font-weight:700;font-size:27px;line-height:1.2;max-width:480px;color:var(--white);}
.mbim2-landing .contract-figure{text-align:right;flex-shrink:0;}
.mbim2-landing .contract-figure-num{font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;font-weight:800;font-size:58px;line-height:1;color:var(--white);}
.mbim2-landing .contract-figure-label{margin-top:6px;font-family:var(--font-ibm-plex-mono), monospace;font-size:10.5px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.68);}
.mbim2-landing .contract-timeline{display:flex;height:8px;border-radius:4px;background:rgba(255,255,255,0.2);overflow:hidden;}
.mbim2-landing .contract-timeline-seg{transform-origin:left center;transform:scaleX(1);}
.mbim2-landing .contract-timeline-seg--work{flex:10;background:rgba(255,255,255,0.9);}
.mbim2-landing .contract-timeline-seg--intern{flex:6;background:var(--amber);}
.mbim2-landing .contract-timeline-labels{display:flex;justify-content:space-between;gap:24px;margin-top:20px;flex-wrap:wrap;}
.mbim2-landing .contract-timeline-label{max-width:340px;}
.mbim2-landing .contract-timeline-label .phase{display:block;font-family:var(--font-ibm-plex-mono), monospace;font-size:11px;letter-spacing:0.06em;margin-bottom:6px;color:rgba(255,255,255,0.72);}
.mbim2-landing .contract-timeline-label p{font-size:14px;line-height:1.5;color:rgba(255,255,255,0.85);}
.mbim2-landing .contract-timeline-label p b{color:var(--white);font-weight:600;}

.mbim2-landing .day-rows{margin-top:48px;border-top:1px solid var(--line);}
.mbim2-landing .day-row{display:grid;grid-template-columns:120px 1fr;gap:28px;padding:28px 0;border-bottom:1px solid var(--line);transition:padding-left .3s ease;}
.mbim2-landing .day-row:hover{padding-left:10px;}
.mbim2-landing .day-row-time{font-family:var(--font-ibm-plex-mono), monospace;font-size:13px;color:var(--blueprint);}
.mbim2-landing .day-row-body h3{font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;font-weight:700;font-size:21px;}
.mbim2-landing .day-row-body p{margin-top:8px;max-width:600px;font-size:14.6px;line-height:1.6;color:var(--muted);}
.mbim2-landing .day-row-body p b{color:var(--ink);font-weight:600;}

@media(max-width:820px){
  .mbim2-landing .metodologia-head h2{font-size:31px;}
  .mbim2-landing .contract-block-head{flex-direction:column;}
  .mbim2-landing .contract-figure{text-align:left;}
  .mbim2-landing .day-row{grid-template-columns:1fr;gap:8px;}
}

/* ---------- CTA de cierre de sección ---------- */
.mbim2-landing .section-cta-row{margin-top:34px;padding-top:24px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;}
.mbim2-landing .section-cta-row p{font-size:14px;color:var(--muted);}
.mbim2-landing .programa-cta-row{margin-top:28px;padding-top:22px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;text-align:center;}
.mbim2-landing .programa-cta-row p{font-size:14px;color:var(--muted);}
.mbim2-landing .programa-cta-link{
  display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:600;color:var(--blueprint);
  border-bottom:1px solid var(--blueprint-line);padding-bottom:2px;
  transition:color .2s var(--ease-out-quart, ease), border-color .2s var(--ease-out-quart, ease), gap .2s var(--ease-out-quart, ease);
}
.mbim2-landing .programa-cta-link:hover{color:var(--blueprint-strong);border-color:var(--blueprint-strong);gap:10px;}

/* ---------- IA — editorial ---------- */
.mbim2-landing .ai-section{position:relative;overflow:hidden;padding:96px 0;background:var(--bg-soft);color:var(--ink);border-bottom:1px solid var(--line);}
.mbim2-landing .ai-blob{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;z-index:0;opacity:0.6;}
.mbim2-landing .ai-blob--1{width:480px;height:480px;right:-160px;top:-180px;background:color-mix(in oklab, var(--blueprint) 22%, transparent);}
.mbim2-landing .ai-blob--2{width:420px;height:420px;left:-160px;bottom:-160px;background:color-mix(in oklab, var(--amber) 20%, transparent);}
.mbim2-landing .ai-blob--3{display:none;}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .ai-blob--1{animation:mbim2-ai-float-a 19s ease-in-out infinite alternate;}
  .mbim2-landing .ai-blob--2{animation:mbim2-ai-float-b 22s ease-in-out infinite alternate;}
}
@keyframes mbim2-ai-float-a{0%{transform:translate(0,0);}100%{transform:translate(-24px,20px);}}
@keyframes mbim2-ai-float-b{0%{transform:translate(0,0);}100%{transform:translate(24px,-20px);}}

.mbim2-landing .ai-section .wrap{position:relative;z-index:1;}
.mbim2-landing .ai-eyebrow{display:flex;align-items:center;gap:12px;font-size:12.5px;letter-spacing:0.14em;text-transform:uppercase;font-weight:500;color:var(--blueprint-strong);margin-bottom:20px;}
.mbim2-landing .ai-eyebrow::before{content:"";width:30px;height:1px;background:var(--blueprint-line);}
.mbim2-landing .ai-title{font-weight:700;font-size:clamp(32px,4vw,48px);line-height:1.1;letter-spacing:-0.02em;max-width:740px;color:var(--ink);}
.mbim2-landing .ai-title em{font-style:normal;font-weight:600;color:var(--blueprint);}
.mbim2-landing .ai-lede{margin-top:22px;max-width:620px;font-size:18px;line-height:1.7;color:var(--muted);}
.mbim2-landing .ai-lede b{color:var(--ink);font-weight:600;}
.mbim2-landing .ai-quote{margin-top:22px;margin-bottom:68px;max-width:560px;padding-left:18px;border-left:2px solid var(--blueprint-line);font-size:14px;font-style:italic;color:var(--dim);}

.mbim2-landing .ai-capabilities{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-bottom:80px;}
.mbim2-landing .ai-cap{position:relative;padding:0 34px;}
.mbim2-landing .ai-cap:first-child{padding-left:0;}
.mbim2-landing .ai-cap:last-child{padding-right:0;}
.mbim2-landing .ai-cap:not(:first-child)::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:1px;background:var(--line);}
.mbim2-landing .ai-cap-num{font-family:var(--font-space-grotesk), sans-serif;font-size:44px;font-weight:700;line-height:1;margin-bottom:16px;color:var(--blueprint);opacity:0.85;}
.mbim2-landing .ai-cap h3{font-size:20px;font-weight:700;line-height:1.3;margin-bottom:10px;color:var(--ink);}
.mbim2-landing .ai-cap p{font-size:14.6px;line-height:1.65;color:var(--muted);}

.mbim2-landing .ai-toolkit-head{display:flex;align-items:baseline;gap:16px;margin-bottom:36px;}
.mbim2-landing .ai-toolkit-head h3{font-size:23px;font-weight:700;white-space:nowrap;color:var(--ink);}
.mbim2-landing .ai-toolkit-line{flex:1;height:1px;background:var(--line);}
.mbim2-landing .ai-toolwall{display:grid;grid-template-columns:repeat(4,1fr);gap:40px 34px;}
.mbim2-landing .ai-toolcol-label{position:relative;display:block;padding-bottom:12px;margin-bottom:16px;font-size:11.5px;letter-spacing:0.12em;text-transform:uppercase;font-weight:500;color:var(--blueprint-strong);}
.mbim2-landing .ai-toolcol-underline{position:absolute;left:0;bottom:0;width:100%;height:2px;background:var(--blueprint-line);transform:scaleX(1);transform-origin:left center;}
.mbim2-landing .ai-toolcol ul{list-style:none;margin:0;padding:0;}
.mbim2-landing .ai-toolcol li{font-size:14.4px;line-height:1.55;padding:11px 0;border-bottom:1px solid var(--line);color:var(--muted);transition:color .25s ease, padding-left .25s ease;}
.mbim2-landing .ai-toolcol li:last-child{border-bottom:none;}
.mbim2-landing .ai-toolcol li:hover{color:var(--blueprint-strong);padding-left:6px;}
.mbim2-landing .ai-toolcol li b{color:var(--ink);font-weight:600;}

@media(max-width:980px){
  .mbim2-landing .ai-capabilities{grid-template-columns:1fr;gap:38px;}
  .mbim2-landing .ai-cap{padding:0;}
  .mbim2-landing .ai-cap::before{display:none;}
  .mbim2-landing .ai-toolwall{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:640px){
  .mbim2-landing .ai-section{padding:64px 0;}
  .mbim2-landing .ai-title{font-size:32px;}
  .mbim2-landing .ai-toolwall{grid-template-columns:1fr;}
}

/* ---------- Programa ---------- */
.mbim2-landing .programa-eyebrow{display:flex;align-items:center;gap:12px;font-size:12.5px;letter-spacing:0.14em;text-transform:uppercase;font-weight:500;color:var(--blueprint-strong);margin-bottom:20px;}
.mbim2-landing .programa-eyebrow::before{content:"";width:30px;height:1px;background:var(--blueprint-line);}
.mbim2-landing .programa-title{font-weight:700;font-size:clamp(30px,3.6vw,44px);line-height:1.12;letter-spacing:-0.022em;max-width:720px;color:var(--ink);}
.mbim2-landing .programa-title-accent{color:var(--blueprint);}
.mbim2-landing .programa-lede{margin-top:20px;margin-bottom:46px;max-width:600px;font-size:16.5px;line-height:1.68;color:var(--muted);}

.mbim2-landing .programa-rail{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-bottom:16px;}
.mbim2-landing .programa-phase{padding-right:20px;}
.mbim2-landing .programa-phase-label{font-size:11px;letter-spacing:0.11em;text-transform:uppercase;font-weight:500;color:var(--dim);margin-bottom:10px;}
.mbim2-landing .programa-phase-bar{height:3px;border-radius:2px;transform:scaleX(1);transform-origin:left center;background:var(--blueprint-line);}
.mbim2-landing .programa-rail .programa-phase:nth-child(1) .programa-phase-bar,
.mbim2-landing .programa-rail .programa-phase:nth-child(2) .programa-phase-bar,
.mbim2-landing .programa-rail .programa-phase:nth-child(3) .programa-phase-bar{background:var(--blueprint);}
.mbim2-landing .programa-rail .programa-phase:nth-child(4) .programa-phase-bar{background:var(--amber);}

.mbim2-landing .programa-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.mbim2-landing .programa-card{
  position:relative;overflow:hidden;display:flex;flex-direction:column;min-height:150px;padding:22px 22px 20px;
  border-radius:var(--radius-md);background:var(--white);border:1px solid var(--line);box-shadow:var(--shadow-soft-sm);
  transition:transform .3s var(--ease-out-quart, ease), box-shadow .3s var(--ease-out-quart, ease), border-color .3s var(--ease-out-quart, ease);
}
.mbim2-landing .programa-card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.mbim2-landing .programa-card-idx{font-family:var(--font-ibm-plex-mono), monospace;font-size:11px;color:var(--blueprint);}
.mbim2-landing .programa-card-ects{font-family:var(--font-ibm-plex-mono), monospace;font-size:10.5px;color:var(--blueprint-strong);background:var(--blueprint-soft);border:1px solid var(--blueprint-line);padding:3px 9px;border-radius:6px;}
.mbim2-landing .programa-card h3{font-family:var(--font-space-grotesk), sans-serif;font-weight:700;font-size:16px;line-height:1.32;}
.mbim2-landing .programa-card-subtitle{margin-top:4px;font-size:12.5px;color:var(--dim);}
.mbim2-landing .programa-card-hours{margin-top:auto;padding-top:12px;font-family:var(--font-ibm-plex-mono), monospace;font-size:11px;color:var(--dim);}
.mbim2-landing .programa-card-num{
  position:absolute;right:14px;bottom:0;font-family:var(--font-space-grotesk), sans-serif;font-size:60px;font-weight:800;line-height:1;
  color:var(--blueprint-soft);pointer-events:none;transition:transform .3s var(--ease-out-quart, ease);
}
.mbim2-landing .programa-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-soft);border-color:var(--blueprint-line);}
.mbim2-landing .programa-card:hover .programa-card-num{transform:translateY(-3px);}

.mbim2-landing .programa-card--flagship{grid-column:span 2;background:linear-gradient(150deg, var(--blueprint), var(--blueprint-strong));color:var(--white);border-color:transparent;box-shadow:var(--shadow-brand);}
.mbim2-landing .programa-flagship-badge{align-self:flex-start;font-family:var(--font-ibm-plex-mono), monospace;font-size:9px;letter-spacing:0.09em;text-transform:uppercase;padding:5px 10px;border-radius:6px;background:rgba(255,255,255,0.16);color:var(--white);margin-bottom:12px;}
.mbim2-landing .programa-card--flagship .programa-card-idx,
.mbim2-landing .programa-card--flagship .programa-card-hours{color:rgba(255,255,255,0.65);}
.mbim2-landing .programa-card--flagship .programa-card-ects{color:var(--white);background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.28);}
.mbim2-landing .programa-card--flagship h3{font-size:20px;color:var(--white);}
.mbim2-landing .programa-card--flagship .programa-card-subtitle{color:rgba(255,255,255,0.75);}
.mbim2-landing .programa-card--flagship .programa-card-num{color:rgba(255,255,255,0.14);}
.mbim2-landing .programa-card--flagship:hover{box-shadow:0 30px 60px -20px rgba(0,108,255,0.5);}

.mbim2-landing .programa-summary{margin-top:22px;padding-top:20px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;}
.mbim2-landing .programa-summary-total{font-family:var(--font-space-grotesk), sans-serif;font-size:15px;color:var(--ink);}
.mbim2-landing .programa-summary-total b{font-size:26px;font-weight:700;}
.mbim2-landing .programa-summary-breakdown{display:flex;flex-wrap:wrap;gap:22px;}
.mbim2-landing .programa-summary-item{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--muted);}
.mbim2-landing .programa-summary-dot{width:9px;height:9px;border-radius:3px;flex-shrink:0;}

@media(max-width:980px){
  .mbim2-landing .programa-grid{grid-template-columns:repeat(2,1fr);}
  .mbim2-landing .programa-rail{grid-template-columns:repeat(2,1fr);gap:14px;}
}
@media(max-width:600px){
  .mbim2-landing .programa-title{font-size:31px;}
  .mbim2-landing .programa-grid{grid-template-columns:1fr;}
  .mbim2-landing .programa-card--flagship{grid-column:span 1;}
  .mbim2-landing .programa-rail{grid-template-columns:1fr;}
}

/* ---------- Secciones 6-11: base compartida ---------- */
.mbim2-landing .editorial-eyebrow{display:flex;align-items:center;gap:12px;font-size:12.5px;letter-spacing:0.14em;text-transform:uppercase;font-weight:500;color:var(--blueprint-strong);margin-bottom:18px;}
.mbim2-landing .editorial-eyebrow::before{content:"";width:30px;height:1px;background:var(--blueprint-line);}

.mbim2-landing .glass-card{
  position:relative;overflow:hidden;border-radius:var(--radius-md);background:var(--white);border:1px solid var(--line);box-shadow:var(--shadow-soft-sm);
  transition:transform .3s var(--ease-out-quart, ease), box-shadow .3s var(--ease-out-quart, ease), border-color .3s var(--ease-out-quart, ease);
}
.mbim2-landing .glass-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-soft);border-color:var(--blueprint-line);}

/* ---------- certificación ---------- */
.mbim2-landing .cred-stack{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.mbim2-landing .cred-card{padding:30px 28px 28px;}
.mbim2-landing .cred-card .layer{font-family:var(--font-ibm-plex-mono), monospace;font-size:11.5px;color:var(--blueprint);letter-spacing:0.05em;text-transform:uppercase;}
.mbim2-landing .cred-card h3{font-size:20px;margin-top:10px;margin-bottom:14px;}
.mbim2-landing .cred-card p{font-size:14.5px;color:var(--muted);}
.mbim2-landing .cred-card-num{position:absolute;right:16px;bottom:4px;font-family:var(--font-space-grotesk), sans-serif;font-size:56px;font-weight:800;line-height:1;color:var(--blueprint-soft);pointer-events:none;}
@media(max-width:820px){.mbim2-landing .cred-stack{grid-template-columns:1fr;}}

.mbim2-landing .profiles{margin-top:36px;display:flex;flex-wrap:wrap;gap:10px;}
.mbim2-landing .profile{
  display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:var(--white);border:1px solid var(--line);
  font-size:13px;color:var(--ink);transition:border-color .25s var(--ease-out-quart, ease), background .25s var(--ease-out-quart, ease), transform .25s var(--ease-out-quart, ease);
}
.mbim2-landing .profile:hover{border-color:var(--blueprint-line);background:var(--blueprint-soft);transform:translateY(-2px);}
.mbim2-landing .profile .tag{font-family:var(--font-ibm-plex-mono), monospace;font-size:10px;color:var(--blueprint-strong);letter-spacing:0.03em;}

/* ---------- innovation summit ---------- */
.mbim2-landing .summit-line{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.mbim2-landing .summit-line::before{content:"";position:absolute;top:11px;left:0;right:0;height:1px;background:var(--line);}
.mbim2-landing .summit-card{position:relative;padding:38px 22px 26px;}
.mbim2-landing .summit-card .dot{position:absolute;top:6px;left:22px;width:11px;height:11px;border-radius:50%;background:var(--blueprint);border:2px solid var(--white);box-shadow:0 0 0 1px var(--line);}
.mbim2-landing .summit-card .month{font-family:var(--font-ibm-plex-mono), monospace;font-size:12px;color:var(--muted);}
.mbim2-landing .summit-card h4{font-size:16.5px;margin-top:8px;margin-bottom:8px;}
.mbim2-landing .summit-card p{font-size:13.5px;color:var(--muted);}
.mbim2-landing .summit-progress{position:absolute;top:11px;left:0;right:0;height:1px;background:var(--blueprint);transform-origin:left center;transform:scaleX(1);pointer-events:none;}
@media(max-width:820px){
  .mbim2-landing .summit-line{grid-template-columns:1fr;gap:16px;}
  .mbim2-landing .summit-line::before,.mbim2-landing .summit-progress{display:none;}
}

/* ---------- resultados ---------- */
.mbim2-landing .outcomes{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.mbim2-landing .outcome{padding:26px 24px 24px;}
.mbim2-landing .outcome .n{font-family:var(--font-space-grotesk), sans-serif;font-size:32px;font-weight:700;color:var(--blueprint);}
.mbim2-landing .outcome p{font-size:14px;color:var(--muted);margin-top:8px;}
@media(max-width:760px){.mbim2-landing .outcomes{grid-template-columns:repeat(2,1fr);}}

/* ---------- testimonios ---------- */
#testimonios{position:relative;overflow:hidden;}
.mbim2-landing #testimonios .wrap{position:relative;z-index:1;}
.mbim2-landing .testimonials-quote-mark{
  position:absolute;top:-0.12em;left:50%;transform:translateX(-50%);
  font-family:var(--font-space-grotesk), sans-serif;font-size:clamp(220px,26vw,340px);font-weight:800;line-height:1;
  color:var(--blueprint);opacity:0.05;pointer-events:none;user-select:none;z-index:0;
}
.mbim2-landing .testimonials{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;position:relative;z-index:1;}
.mbim2-landing .testimonial{display:flex;flex-direction:column;padding:0;}
.mbim2-landing .testimonial-video-frame{position:relative;width:100%;aspect-ratio:9/16;background:var(--ink);overflow:hidden;}
.mbim2-landing .testimonial-video{display:block;width:100%;height:100%;object-fit:cover;}
.mbim2-landing .testimonial-mute-btn,.mbim2-landing .testimonial-play-btn{
  position:absolute;display:flex;align-items:center;justify-content:center;border:none;padding:0;cursor:pointer;color:var(--white);
  background:rgba(10,14,20,0.6);backdrop-filter:blur(6px);border-radius:50%;transition:background .2s var(--ease-out-quart, ease), transform .2s var(--ease-out-quart, ease);
}
.mbim2-landing .testimonial-mute-btn{top:12px;right:12px;width:32px;height:32px;}
.mbim2-landing .testimonial-mute-btn:hover{background:rgba(10,14,20,0.82);}
.mbim2-landing .testimonial-play-btn{inset:0;margin:auto;width:56px;height:56px;}
.mbim2-landing .testimonial-play-btn:hover{background:rgba(0,108,255,0.85);transform:scale(1.06);}
.mbim2-landing .testimonial-play-btn svg{margin-left:2px;}
.mbim2-landing .testimonial-body{padding:22px 24px 26px;display:flex;flex-direction:column;flex:1;}
.mbim2-landing .testimonial-n{font-family:var(--font-ibm-plex-mono), monospace;font-size:11.5px;color:var(--blueprint);letter-spacing:0.04em;margin-bottom:12px;}
.mbim2-landing .testimonial .quote{font-family:var(--font-space-grotesk), sans-serif;font-weight:700;font-size:17px;line-height:1.35;color:var(--ink);flex:1;}
.mbim2-landing .testimonial .who{margin-top:22px;padding-top:16px;border-top:1px solid var(--line);}
.mbim2-landing .testimonial .who .name{font-family:var(--font-space-grotesk), sans-serif;font-weight:600;font-size:13.5px;}
.mbim2-landing .testimonial .who .meta{font-family:var(--font-ibm-plex-mono), monospace;font-size:12.5px;color:var(--muted);margin-top:4px;letter-spacing:0.02em;}
@media(max-width:900px){
  .mbim2-landing .testimonials{grid-template-columns:1fr;}
  .mbim2-landing .testimonials-quote-mark{font-size:200px;}
}
@media(prefers-reduced-motion:reduce){
  .mbim2-landing .testimonial-mute-btn,.mbim2-landing .testimonial-play-btn{transition:none !important;}
}

/* ---------- admisión ---------- */
.mbim2-landing .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px;}
.mbim2-landing .step{position:relative;padding:30px 26px;}
.mbim2-landing .step .n{font-family:var(--font-ibm-plex-mono), monospace;color:var(--blueprint);font-size:13px;}
.mbim2-landing .step h4{font-size:17px;margin-top:10px;margin-bottom:8px;}
.mbim2-landing .step p{font-size:14px;color:var(--muted);}
.mbim2-landing .step-accent{position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--blueprint);transform:scaleY(1);transform-origin:top center;pointer-events:none;}
@media(max-width:760px){.mbim2-landing .steps{grid-template-columns:1fr;}}

.mbim2-landing .admision-alt-cta{margin-top:28px;padding-top:24px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;text-align:center;}
.mbim2-landing .admision-alt-cta p{font-size:14.5px;color:var(--muted);}

/* ---------- agenda ---------- */
.mbim2-landing .agenda-form-wrap{max-width:640px;margin:0 auto;}

/* ---------- CTA final ---------- */
.mbim2-landing .cta-final{padding:56px 0 100px;background:var(--bg);border-bottom:none;text-align:left;}
.mbim2-landing .cta-final-card{position:relative;overflow:hidden;border-radius:var(--radius-lg);background:linear-gradient(135deg, var(--blueprint), var(--blueprint-strong));color:var(--white);padding:72px 64px;box-shadow:var(--shadow-brand);}
.mbim2-landing .cta-final-card::after{content:"";position:absolute;top:-160px;right:-120px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%);pointer-events:none;}
.mbim2-landing .cta-final-card > *{position:relative;z-index:1;}
.mbim2-landing .cta-final h2{color:var(--white);font-size:clamp(28px,3.6vw,40px);max-width:640px;}
.mbim2-landing .cta-final p{color:rgba(255,255,255,0.82);margin-top:16px;max-width:520px;font-size:16.5px;}
.mbim2-landing .cta-final .hero-actions{margin-top:36px;}
@media(max-width:640px){.mbim2-landing .cta-final-card{padding:48px 28px;}}

/* ---------- footer ---------- */
.mbim2-landing footer{background:var(--ink);color:#8b93a1;padding:60px 0 36px;}
.mbim2-landing .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;}
.mbim2-landing .footer-grid h5{font-family:var(--font-ibm-plex-mono), monospace;font-size:11.5px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;margin-bottom:14px;}
.mbim2-landing .footer-grid .brand{font-family:var(--font-space-grotesk), sans-serif;color:var(--white);font-size:20px;font-weight:700;}
.mbim2-landing .footer-grid p, .mbim2-landing .footer-grid li{font-size:14px;line-height:1.9;}
.mbim2-landing .footer-grid a:hover{color:var(--white);}
.mbim2-landing .footer-bottom{margin-top:48px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);font-size:12.5px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;}
@media(max-width:760px){.mbim2-landing .footer-grid{grid-template-columns:1fr;}}

/* ---------- flecha de los CTA ---------- */
.mbim2-landing .btn-arrow-icon{display:inline-flex;transition:transform .45s var(--ease-out-expo, ease);}
.mbim2-landing .btn:hover .btn-arrow-icon,.mbim2-landing .btn:focus-visible .btn-arrow-icon{transform:translateX(0.3rem);}
@media(prefers-reduced-motion:reduce){.mbim2-landing .btn-arrow-icon{transition:none !important;transform:none !important;}}

/* ---------- pulso del CTA ---------- */
.mbim2-landing .cta-pulse-wrap{position:relative;display:inline-flex;border-radius:999px;}
.mbim2-landing .cta-pulse-wrap::before{content:"";position:absolute;inset:0;border-radius:999px;box-shadow:0 0 0 0 rgba(0,108,255,0.35);pointer-events:none;}
@media(prefers-reduced-motion:no-preference){.mbim2-landing .cta-pulse-wrap::before{animation:mbim2-cta-pulse 2.6s var(--ease-in-out-quint, ease) infinite;}}
@keyframes mbim2-cta-pulse{0%{box-shadow:0 0 0 0 rgba(0,108,255,0.35);}70%{box-shadow:0 0 0 14px rgba(0,108,255,0);}100%{box-shadow:0 0 0 14px rgba(0,108,255,0);}}
.mbim2-landing .cta-date{font-family:var(--font-ibm-plex-mono), monospace;letter-spacing:0.01em;color:var(--white);}
.mbim2-landing .cta-lede-muted{color:rgba(255,255,255,0.65);}

/* ---------- barra flotante de CTA ---------- */
.mbim2-landing .landing-sticky-cta{
  position:fixed;left:0;right:0;bottom:0;z-index:60;padding:14px 24px;padding-bottom:calc(14px + env(safe-area-inset-bottom));
  background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-top:1px solid var(--line);
  box-shadow:0 -16px 44px -28px rgba(16,24,40,0.3);transform:translateY(120%);transition:transform .35s var(--ease-out-quart, ease);pointer-events:none;
}
.mbim2-landing .landing-sticky-cta.is-visible{transform:translateY(0);pointer-events:auto;}
.mbim2-landing .landing-sticky-cta-inner{max-width:var(--maxw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.mbim2-landing .landing-sticky-cta-text{font-size:14px;font-weight:600;color:var(--ink);}
.mbim2-landing .landing-sticky-cta .btn{flex-shrink:0;}
@media(max-width:640px){
  .mbim2-landing .landing-sticky-cta{padding-left:16px;padding-right:16px;}
  .mbim2-landing .landing-sticky-cta-inner{gap:0;}
  .mbim2-landing .landing-sticky-cta-text{display:none;}
  .mbim2-landing .landing-sticky-cta .btn{width:100%;justify-content:center;}
}
@media(prefers-reduced-motion:reduce){
  .mbim2-landing .landing-sticky-cta{transform:none;opacity:0;transition:opacity .2s ease;}
  .mbim2-landing .landing-sticky-cta.is-visible{opacity:1;}
}

/* ---------- responsive general ---------- */
@media(max-width:960px){
  .mbim2-landing .hero-copy-col{padding:48px 28px 32px;}
  .mbim2-landing .hero-visual-col{padding:40px 28px;}
}
@media(max-width:600px){
  .mbim2-landing .compare-panel{padding:26px;}
  .mbim2-landing .metodologia-head h2{font-size:30px;}
  .mbim2-landing .problema-head h2{font-size:30px;}
}
`

// Rediseño 2026-09-09: el acordeón (intro larga + lista de items por
// módulo) se retira — el mapa visual solo necesita índice, título,
// ECTS y horas, más un subtítulo corto donde ya existía (titleSuffix
// antes) y una descripción breve solo para la tarjeta destacada (07).
// Ningún dato de ECTS/horas/nombre cambia respecto a lo ya publicado.
type Module = {
  idx: string
  title: string
  subtitle?: string
  ects: number
  hours: number
  flagship?: boolean
  description?: string
}

const MODULES: Module[] = [
  { idx: "01", title: "Fundamentos BIM y Entornos Colaborativos", ects: 2, hours: 50 },
  { idx: "02", title: "BIM Design", ects: 5, hours: 125 },
  { idx: "03", title: "BIM Construction", ects: 4, hours: 100 },
  { idx: "04", title: "BIM Civil", subtitle: "Itinerario de especialización", ects: 3, hours: 75 },
  { idx: "05", title: "BIM Facility Management", ects: 3, hours: 75 },
  { idx: "06", title: "BIM Project Management + Analítica de datos", ects: 4, hours: 100 },
  {
    idx: "07",
    title: "IA Aplicada al Sector AEC",
    ects: 6,
    hours: 150,
    flagship: true,
    description:
      "Conecta agentes de IA a tu modelo de Revit, genera imagen y vídeo fotorrealista, y configura asistentes documentales propios entrenados con la normativa de tu estudio.",
  },
  { idx: "08", title: "Talent", subtitle: "Transversal a todo el curso", ects: 3, hours: 75 },
  { idx: "09", title: "Proyecto Fin de Máster", ects: 6, hours: 150 },
]

// Rail de 4 fases — agrupación puramente visual de los 9 módulos de
// arriba, sin dato nuevo: 01-03 Fundamentos, 04-05 Diseño y obra,
// 06 Gestión y datos, 07-09 IA y cierre.
const PROGRAMA_PHASES = ["Fundamentos", "Diseño y obra", "Gestión y datos", "IA y cierre"]

// Las 3 capacidades — sustituyen al párrafo largo (~45 palabras) que
// llevaba antes .ai-lede, repartido aquí en 3 columnas editoriales.
const AI_CAPABILITIES = [
  {
    num: "01",
    title: "Asistentes documentales propios",
    text: "Entrenados con la normativa y los criterios internos de tu propio estudio.",
  },
  {
    num: "02",
    title: "Imagen y vídeo fotorrealista",
    text: "Genera visuales de tus proyectos sin pasar por un render tradicional.",
  },
  {
    num: "03",
    title: "Agentes sobre tu modelo BIM",
    text: "Modifica el modelo por lenguaje natural, directamente sobre Revit.",
  },
]

// Nombres comerciales no confirmados (Adarcus, Pele AI, WiseBIM, Glyph,
// Spacio, Snaptrude, TestFit, ChatCTE/ChatNORMAD) sustituidos por la
// capacidad que describen — ver el aviso al cliente en CLAUDE.md/el chat.
const TOOLGROUPS = [
  {
    title: "Modelos y prompting",
    items: ["Claude / ChatGPT / Gemini", "Prompt engineering profesional", "Skills y asistentes RAG"],
  },
  {
    title: "Imagen y vídeo",
    items: ["Midjourney / ControlNet", "Modelos de imagen generativa", "Runway / Veo / Kling"],
  },
  {
    title: "Agentes + Revit",
    items: ["Habla con tu modelo", "Comandos en lenguaje natural", "Scripting con IA en Dynamo"],
  },
  {
    title: "Ecosistema BIM + IA",
    items: ["MCP — Model Context Protocol", "Autodesk Forma / Assistant", "Generación 2D → BIM"],
  },
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

// Los 3 testimonios son reales, de alumnos del Máster BIM Full Time (el
// programa tal como era antes del enfoque "MBIM 2.0" con IA) — no hablan del
// módulo de IA porque no lo cursaron, y se muestran tal cual, sin adaptar la
// cita para que encaje con el nuevo enfoque. Vídeos en Cloudflare R2, mismo
// bucket que documenta CLAUDE.md ("los 4 vídeos de /landing en Cloudflare
// R2") — RES1/VID2/VID3, el cuarto (VIDLAN1, hero) sigue sin usarse aquí.
const TESTIMONIALS = [
  {
    video: "https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/RES1.mp4",
    quote: "Es la mejor decisión que pude tomar.",
    name: "Carolina Larrahona",
    meta: "Máster BIM Full Time",
  },
  {
    video: "https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VID2.mp4",
    quote: "Lo que más destaco del máster es la metodología learning by working.",
    name: "Omar Pérez Ruiz",
    meta: "Máster BIM Full Time",
  },
  {
    video: "https://pub-5178d59aea414c55b9ff83a226ef28f6.r2.dev/VID3.mp4",
    quote: "El BIM me abrió muchísimas puertas.",
    name: "Agustina Mingrone",
    meta: "Máster BIM Full Time",
  },
]

const STEPS = [
  { n: "01", title: "Solicita información", text: "Rellena el formulario y te contactamos en menos de 48h laborables." },
  { n: "02", title: "Entrevista personal", text: "Valoramos tu perfil y te asignamos empresa partner según tu especialidad." },
  { n: "03", title: "Reserva tu plaza", text: "Formalizas la matrícula y firmas el contrato laboral antes del inicio." },
]

export function LandingClient({ fontVariables }: { fontVariables: string }) {
  // Hero: foco que sigue al cursor sobre la columna izquierda, más el
  // parallax de fondo (si existiera algún `.grid-bg`, hoy no queda ninguno
  // en el hero tras el rediseño — `querySelectorAll` simplemente no
  // encuentra nada y el tween no hace nada, sin errores). El <h1> no se
  // toca aquí — su revelado sigue siendo 100% CSS, fuera de este hook.
  const heroRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const spotlight = scope.querySelector<HTMLElement>("[data-spotlight]")
    let removeSpotlight: (() => void) | undefined
    if (spotlight) {
      const onMove = (e: PointerEvent) => {
        const rect = spotlight.getBoundingClientRect()
        spotlight.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`)
        spotlight.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`)
      }
      spotlight.addEventListener("pointermove", onMove)
      removeSpotlight = () => spotlight.removeEventListener("pointermove", onMove)
    }

    gsap.from(scope.querySelectorAll(".hero-chip"), {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.6,
      delay: 0.6,
    })

    // Las 3 tarjetas de la columna derecha entran con un fundido escalonado.
    gsap.from(scope.querySelectorAll(".hero-float-card"), {
      opacity: 0,
      y: 16,
      stagger: 0.15,
      duration: 0.6,
      delay: 0.5,
      clearProps: "transform",
    })

    // Barra de plazas: por defecto ya dibujada hasta el ratio real
    // (23/30 → 77%, confirmado por el cliente) para que se vea completa si
    // GSAP no llega a correr; aquí se reinicia a 0 y se redibuja al montar.
    const seatFill = scope.querySelector(".seat-bar-fill")
    if (seatFill) {
      gsap.set(seatFill, { scaleX: 0 })
      gsap.to(seatFill, {
        scaleX: 23 / 30,
        duration: 1,
        ease: "power2.out",
        delay: 1.1,
      })
    }

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

    const compareTrigger = { trigger: scope.querySelector(".compare"), start: "top 78%", once: true }

    gsap.from(scope.querySelectorAll(".compare-old"), {
      opacity: 0,
      duration: 0.8,
      delay: 0.15,
      scrollTrigger: compareTrigger,
    })
    gsap.from(scope.querySelectorAll(".compare-new"), {
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      scrollTrigger: compareTrigger,
    })

    const strikeLine = scope.querySelector(".problema-strike-line")
    if (strikeLine) {
      gsap.set(strikeLine, { scaleX: 0 })
      gsap.to(strikeLine, {
        scaleX: 1,
        duration: 1,
        ease: "expo.out",
        delay: 0.5,
        scrollTrigger: compareTrigger,
      })
    }

    gsap.from(scope.querySelectorAll(".compare-old .compare-row"), {
      opacity: 0,
      y: 10,
      stagger: 0.1,
      duration: 0.5,
      delay: 0.35,
      clearProps: "transform",
      scrollTrigger: compareTrigger,
    })

    gsap.from(scope.querySelectorAll(".compare-new .compare-row"), {
      opacity: 0,
      y: 10,
      stagger: 0.12,
      duration: 0.5,
      delay: 0.5,
      clearProps: "transform",
      scrollTrigger: compareTrigger,
    })

    const accents = scope.querySelectorAll(".compare-row-accent")
    if (accents.length) {
      gsap.set(accents, { scaleY: 0 })
      gsap.to(accents, {
        scaleY: 1,
        stagger: 0.12,
        duration: 0.5,
        delay: 0.7,
        scrollTrigger: compareTrigger,
      })
    }

    return () => split?.revert()
  })

  // Metodología: entrada de las dos tarjetas de jornada, y los dos segmentos
  // de la barra de contrato se dibujan de izquierda a derecha al llegar.
  const metodologiaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const trigger = { trigger: scope, start: "top 75%", once: true }

    gsap.from(scope.querySelectorAll(".contract-block"), {
      opacity: 0,
      y: 16,
      duration: 0.75,
      ease: "expo.out",
      delay: 0.25,
      scrollTrigger: trigger,
    })

    const gradUnderline = scope.querySelector(".metodologia-grad-underline")
    if (gradUnderline) {
      gsap.set(gradUnderline, { scaleX: 0 })
      gsap.to(gradUnderline, {
        scaleX: 1,
        duration: 0.9,
        ease: "expo.out",
        delay: 0.5,
        scrollTrigger: trigger,
      })
    }

    const segWork = scope.querySelector(".contract-timeline-seg--work")
    const segIntern = scope.querySelector(".contract-timeline-seg--intern")
    if (segWork) {
      gsap.set(segWork, { scaleX: 0 })
      gsap.to(segWork, { scaleX: 1, duration: 1.1, ease: "expo.out", delay: 0.7, scrollTrigger: trigger })
    }
    if (segIntern) {
      gsap.set(segIntern, { scaleX: 0 })
      gsap.to(segIntern, { scaleX: 1, duration: 1.1, ease: "expo.out", delay: 1, scrollTrigger: trigger })
    }

    gsap.from(scope.querySelectorAll(".contract-timeline-label"), {
      opacity: 0,
      y: 10,
      stagger: 0.12,
      duration: 0.5,
      delay: 1.25,
      scrollTrigger: trigger,
    })

    gsap.from(scope.querySelectorAll(".day-row"), {
      opacity: 0,
      y: 10,
      stagger: 0.12,
      duration: 0.5,
      delay: 1.5,
      scrollTrigger: trigger,
    })
  })

  // IA — una única coreografía: las 3 capacidades entran primero, luego la
  // cabecera del toolkit, luego las 4 columnas, y por último el subrayado
  // de cada etiqueta se dibuja.
  const iaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const trigger = { trigger: scope, start: "top 75%", once: true }

    gsap.from(scope.querySelectorAll(".ai-cap"), {
      opacity: 0,
      y: 18,
      duration: 0.8,
      ease: "expo.out",
      delay: 0.2,
      stagger: 0.15,
      scrollTrigger: trigger,
    })

    gsap.from(scope.querySelector(".ai-toolkit-head"), {
      opacity: 0,
      y: 14,
      duration: 0.6,
      delay: 0.6,
      scrollTrigger: trigger,
    })

    gsap.from(scope.querySelectorAll(".ai-toolcol"), {
      opacity: 0,
      y: 18,
      duration: 0.6,
      delay: 0.7,
      stagger: 0.1,
      scrollTrigger: trigger,
    })

    const underlines = scope.querySelectorAll(".ai-toolcol-underline")
    gsap.set(underlines, { scaleX: 0 })
    gsap.to(underlines, {
      scaleX: 1,
      duration: 0.8,
      ease: "expo.out",
      delay: 1.1,
      stagger: 0.1,
      scrollTrigger: trigger,
    })
  })

  // Programa — mapa visual: el rail de fases entra primero (bloque, luego
  // su barra se dibuja), después las 9 tarjetas del grid, y por último la
  // franja de total/reparto.
  const programaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const trigger = { trigger: scope, start: "top 75%", once: true }

    gsap.from(scope.querySelectorAll(".programa-phase"), {
      opacity: 0,
      y: 12,
      duration: 0.5,
      delay: 0.15,
      stagger: 0.1,
      scrollTrigger: trigger,
    })

    const bars = scope.querySelectorAll(".programa-phase-bar")
    gsap.set(bars, { scaleX: 0 })
    gsap.to(bars, {
      scaleX: 1,
      duration: 0.8,
      ease: "expo.out",
      delay: 0.5,
      stagger: 0.12,
      scrollTrigger: trigger,
    })

    gsap.from(scope.querySelectorAll(".programa-card"), {
      opacity: 0,
      y: 12,
      duration: 0.5,
      delay: 0.6,
      stagger: 0.07,
      clearProps: "transform",
      scrollTrigger: trigger,
    })

    gsap.from(scope.querySelector(".programa-summary"), {
      opacity: 0,
      y: 12,
      duration: 0.5,
      delay: 1.25,
      scrollTrigger: trigger,
    })
  })

  // Certificación — ★ momento de bandera: las 3 credenciales se "sellan" al
  // entrar en pantalla, mismo mecanismo exacto que balance-ledger.tsx /
  // convenio-card.tsx (back.out + stagger).
  const certificacionRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".cred-card"), {
      opacity: 0,
      scale: 0.85,
      rotate: -4,
      stagger: 0.15,
      duration: 0.55,
      ease: "back.out(1.7)",
      clearProps: "transform",
      scrollTrigger: { trigger: scope.querySelector(".cred-stack"), start: "top 75%", once: true },
    })
    gsap.from(scope.querySelectorAll(".profile"), {
      opacity: 0,
      y: 14,
      stagger: 0.06,
      duration: 0.5,
      clearProps: "transform",
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
      clearProps: "transform",
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
      clearProps: "transform",
      scrollTrigger: { trigger: scope.querySelector(".outcomes"), start: "top 82%", once: true },
    })
  })

  // Testimonios: entrada editorial (fade + translateY, delays escalonados).
  const testimoniosRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".testimonial"), {
      opacity: 0,
      y: 24,
      stagger: 0.14,
      duration: 0.6,
      clearProps: "transform",
      scrollTrigger: { trigger: scope.querySelector(".testimonials"), start: "top 82%", once: true },
    })
  })

  // Admisión: entrada de los 3 pasos + el acento lateral de cada uno se
  // dibuja de arriba a abajo, escalonado.
  const admisionRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".step"), {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.6,
      clearProps: "transform",
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

  // Agenda: entrada simple de cabecera + tarjeta del formulario.
  const agendaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".section-head, .agenda-form-wrap"), {
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.6,
      clearProps: "transform",
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
    })
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

  // ---- Descarga del PDF de programa → CatalogDownloadDialog controlado.
  const [catalogOpen, setCatalogOpen] = useState(false)

  // ---- Testimonios: 3 vídeos reales, sin autoplay ni controles nativos —
  // controles propios (play centrado + mute en la esquina).
  const testimonialVideoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const [testimonialState, setTestimonialState] = useState(() => TESTIMONIALS.map(() => ({ playing: false, muted: false })))

  const toggleTestimonialPlay = (i: number) => {
    const video = testimonialVideoRefs.current[i]
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }
  const toggleTestimonialMute = (i: number) => {
    setTestimonialState((prev) => prev.map((s, idx) => (idx === i ? { ...s, muted: !s.muted } : s)))
  }
  const setTestimonialPlaying = (i: number, playing: boolean) => {
    setTestimonialState((prev) => prev.map((s, idx) => (idx === i ? { ...s, playing } : s)))
  }

  // ---- Barra flotante de CTA: aparece cuando el hero ya no está a la
  // vista y se oculta cuando la sección de agenda (o el CTA final) está en
  // pantalla.
  const [showSticky, setShowSticky] = useState(false)
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const agenda = agendaRef.current
    const finalCta = ctaRef.current

    let heroPassed = false
    const suppressors = new Set<Element>()
    const sync = () => setShowSticky(heroPassed && suppressors.size === 0)

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0
        sync()
      },
      { threshold: 0 },
    )
    heroObs.observe(hero)

    const suppressObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) suppressors.add(entry.target)
          else suppressors.delete(entry.target)
        }
        sync()
      },
      { threshold: 0 },
    )
    if (agenda) suppressObs.observe(agenda)
    if (finalCta) suppressObs.observe(finalCta)

    return () => {
      heroObs.disconnect()
      suppressObs.disconnect()
    }
  }, [heroRef, agendaRef, ctaRef])

  return (
    <div className={`mbim2-landing ${fontVariables}`}>
      <style>{LANDING_STYLES}</style>
      <MetaPixel />

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
          <a href="#agenda" className="btn btn-signal nav-cta" data-magnetic data-magnetic-strength="0.35">
            Agendar llamada
            <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="hero" ref={heroRef}>
        <div className="urgency-bar">
          <span>● Convocatoria de octubre</span>
          <span className="sep">—</span>
          <span className="amber">quedan pocas plazas</span>
          <span className="sep">·</span>
          <span>
            próximo grupo empieza en <b>6 semanas</b>
          </span>
        </div>

        <div className="hero-grid">
          {/* columna izquierda: contenido + CTA */}
          <div
            className="hero-copy-col journey-spotlight hero-spotlight-host"
            data-spotlight
          >
            <div className="hero-copy-inner hero-inner">
              <div className="hero-social-proof hero-fade">
                <span className="avatar-stack" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <p>
                  <b>+4.700 profesionales</b> del sector AEC ya formados
                </p>
              </div>

              <div className="kicker kicker-pill">
                <span className="kicker-dot" aria-hidden="true" />
                MÁSTER PROPIO · IDESIE BUSINESS &amp; TECHNOLOGY SCHOOL
              </div>
              <h1>
                <span className="hero-line" style={{ animationDelay: "0.05s" }}>
                  El máster que te paga
                </span>
                <span className="hero-line" style={{ animationDelay: "0.18s" }}>
                  mientras te convierte en el
                </span>
                <span className="accent hero-line" style={{ animationDelay: "0.32s" }}>
                  profesional que la IA no sustituye.
                  <span className="hero-cursor" aria-hidden="true" />
                </span>
              </h1>
              <p className="hero-sub hero-fade">
                BIM e Inteligencia Artificial de nivel profesional para arquitectos, ingenieros y técnicos AEC.
                Trabajas por las mañanas con contrato desde el primer día; te formamos por las tardes con las
                herramientas que ya están cambiando los estudios y las constructoras.
              </p>

              <div className="hero-chips hero-fade">
                <div className="hero-chip">
                  <StatCounter value="16" className="chip-value mono" />
                  <span className="chip-label">meses</span>
                </div>
                <div className="hero-chip">
                  <StatCounter value="6" className="chip-value mono" />
                  <span className="chip-label">ECTS de IA</span>
                </div>
                <div className="hero-chip">
                  <StatCounter value="3" className="chip-value mono" />
                  <span className="chip-label">credenciales</span>
                </div>
              </div>

              <div className="hero-actions hero-fade hero-fade-late">
                <span className="cta-pulse-wrap">
                  <a href="#agenda" className="btn hero-cta-gradient" data-magnetic>
                    Solicitar información
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
              <a href="#agenda" className="hero-trust-note">
                <CalendarCheck size={13} aria-hidden="true" />
Solicita información · llamada opcional
              </a>
            </div>
          </div>

          {/* columna derecha: panel oscuro con las 3 tarjetas reales */}
          <div className="hero-visual-col">
            <span className="hero-visual-glow hero-visual-glow--1" aria-hidden="true" />
            <span className="hero-visual-glow hero-visual-glow--2" aria-hidden="true" />

            <div className="hero-visual-stack">
              <div className="hero-float-card hero-card-seats">
                <div className="card-badge">◆ Plazas convocatoria</div>
                <div className="seat-bar-track">
                  <div className="seat-bar-fill" />
                </div>
                <p className="hero-card-caption">
                  Plazas limitadas · <b>77%</b> ocupadas
                </p>
              </div>

              <div className="hero-float-card hero-card-testimonial">
                <p className="quote">&ldquo;El BIM me abrió muchísimas puertas.&rdquo;</p>
                <div className="who">
                  <span className="who-avatar" aria-hidden="true" />
                  <span className="who-meta">Agustina M. · MBIM</span>
                </div>
              </div>

              <div className="hero-float-card hero-card-contract">
                <div className="card-badge card-badge--white">Contrato garantizado</div>
                <p>
                  <b>16 meses</b> mínimo
                </p>
                <p>Remunerado desde el primer día.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EL PROBLEMA ============ */}
      <section ref={problemaRef}>
        <div className="problema-aura" aria-hidden="true" />
        <div className="wrap">
          <div className="problema-head">
            <div className="problema-eyebrow">Por qué este máster es distinto</div>
            <h2>
              La mayoría de másteres BIM te preparan para{" "}
              <span className="problema-strike mono">
                2019
                <span className="problema-strike-line" aria-hidden="true" />
              </span>
              . Nosotros, para{" "}
              <span className="problema-grad">lo que ya está pasando</span>.
            </h2>
            <p className="problema-lede">
              El sector AEC ya no contrata solo por saber modelar. Contrata a quien sabe modelar, gestionar y usar IA
              generativa para hacerlo en la mitad de tiempo — y quiere verlo aplicado a proyectos reales, no en un
              examen.
            </p>
          </div>
          <div className="compare">
            <div className="compare-panel compare-old">
              <div className="compare-tag">
                <span className="compare-tag-sq" aria-hidden="true" />
                Formato heredado
              </div>
              <h3>El máster BIM de siempre</h3>
              <ul>
                <li className="compare-row">
                  <span className="compare-icon" aria-hidden="true">
                    ✕
                  </span>
                  <span className="compare-row-text">
                    100% presencial, 4,5 horas cada tarde, sin margen para trabajar
                  </span>
                </li>
                <li className="compare-row">
                  <span className="compare-icon" aria-hidden="true">
                    ✕
                  </span>
                  <span className="compare-row-text">La IA aparece en una sesión suelta, casi como curiosidad</span>
                </li>
                <li className="compare-row">
                  <span className="compare-icon" aria-hidden="true">
                    ✕
                  </span>
                  <span className="compare-row-text">Título propio de la escuela, sin certificación externa</span>
                </li>
                <li className="compare-row">
                  <span className="compare-icon" aria-hidden="true">
                    ✕
                  </span>
                  <span className="compare-row-text">Inserción laboral &quot;al terminar&quot;, si hay suerte</span>
                </li>
              </ul>
            </div>

            <div className="compare-divider">
              <span className="compare-divider-pill mono">El salto</span>
            </div>

            <div className="compare-panel compare-new">
              <div className="compare-panel-head">
                <div className="compare-tag">
                  <span className="compare-tag-sq" aria-hidden="true" />
                  MBIM 2.0
                </div>
                <span className="compare-new-badge mono">◆ Nuestro</span>
              </div>
              <h3>MBIM 2.0</h3>
              <ul>
                <li className="compare-row">
                  <span className="compare-row-accent" aria-hidden="true" />
                  <span className="compare-icon" aria-hidden="true">
                    ✓
                  </span>
                  <span className="compare-row-text">
                    Metodología blended: <b>80% online, 20% presencial</b> en casos reales
                  </span>
                </li>
                <li className="compare-row">
                  <span className="compare-row-accent" aria-hidden="true" />
                  <span className="compare-icon" aria-hidden="true">
                    ✓
                  </span>
                  <span className="compare-row-text">
                    <b>6 ECTS íntegros de IA</b> aplicada al AEC: agentes, MCP, copilotos en Revit
                  </span>
                </li>
                <li className="compare-row">
                  <span className="compare-row-accent" aria-hidden="true" />
                  <span className="compare-icon" aria-hidden="true">
                    ✓
                  </span>
                  <span className="compare-row-text">
                    Título + <b>certificación profesional AECOMI</b> + sello Cualificam
                  </span>
                </li>
                <li className="compare-row">
                  <span className="compare-row-accent" aria-hidden="true" />
                  <span className="compare-icon" aria-hidden="true">
                    ✓
                  </span>
                  <span className="compare-row-text">
                    <b>Contrato laboral desde el día 1</b>, mínimo 16 meses garantizados
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ METODOLOGÍA ============ */}
      <section id="metodologia" ref={metodologiaRef}>
        <div className="wrap">
          <div className="metodologia-head">
            <div className="metodologia-eyebrow">Metodología dual</div>
            <h2>
              No pagas por estudiar.{" "}
              <span className="metodologia-grad">
                Cobras mientras lo haces.
                <span className="metodologia-grad-underline" aria-hidden="true" />
              </span>
            </h2>
            <p className="metodologia-lede">
              Cada alumno firma contrato laboral con una empresa partner desde el inicio del máster.{" "}
              <b>No es una beca ni unas prácticas simbólicas</b>: es un puesto real, remunerado, con una duración
              mínima garantizada de 16 meses.
            </p>
          </div>

          <div className="contract-block">
            <div className="contract-block-inner">
              <div className="contract-block-head">
                <div>
                  <div className="contract-tag">
                    <span className="contract-tag-sq" aria-hidden="true" />
                    Contrato laboral desde el día 1
                  </div>
                  <div className="contract-block-title">
                    Firmas con una empresa partner antes de empezar el máster.
                  </div>
                </div>
                <div className="contract-figure">
                  <div className="contract-figure-num">16</div>
                  <div className="contract-figure-label">meses mínimo</div>
                </div>
              </div>

              <div className="contract-timeline">
                <div className="contract-timeline-seg contract-timeline-seg--work" />
                <div className="contract-timeline-seg contract-timeline-seg--intern" />
              </div>
              <div className="contract-timeline-labels">
                <div className="contract-timeline-label contract-timeline-label--work">
                  <span className="phase mono">Meses 1 — 10</span>
                  <p>
                    Formación + <b>trabajo a media jornada</b> en la empresa.
                  </p>
                </div>
                <div className="contract-timeline-label contract-timeline-label--intern">
                  <span className="phase mono">Meses 11 — 16</span>
                  <p>
                    <b>Prácticas remuneradas</b>, ampliables según la empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="day-rows">
            <div className="day-row">
              <div className="day-row-time mono">10:00 — 14:00</div>
              <div className="day-row-body">
                <h3>Trabajas</h3>
                <p>
                  Proyectos reales en empresas partner del sector AEC, <b>con contrato desde el primer mes</b>.
                  Aplicas cada semana lo que aprendes la tarde anterior.
                </p>
              </div>
            </div>
            <div className="day-row">
              <div className="day-row-time mono">16:00 — 20:00</div>
              <div className="day-row-body">
                <h3>Te formas</h3>
                <p>
                  <b>80% online en directo</b> — no vídeos grabados — y 20% presencial concentrado en laboratorio y
                  casos reales.
                </p>
              </div>
            </div>
          </div>

          <div className="section-cta-row">
            <p>¿Dudas sobre cómo funciona el contrato laboral? Te lo explicamos sin compromiso.</p>
            <a href="#agenda" className="programa-cta-link">
              Solicitar información
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ IA — editorial ============ */}
      <section className="ai-section" id="ia" ref={iaRef}>
        <span className="ai-blob ai-blob--1" aria-hidden="true" />
        <span className="ai-blob ai-blob--2" aria-hidden="true" />
        <span className="ai-blob ai-blob--3" aria-hidden="true" />

        <div className="wrap">
          <div className="ai-eyebrow">El módulo diferencial</div>
          <h2 className="ai-title">
            IA aplicada al AEC, <em>sin filtros de nivel principiante.</em>
          </h2>
          <p className="ai-lede">
            Aprenderás a <b>conectar agentes de IA directamente a tu modelo de Revit</b> — no es &quot;cómo usar
            ChatGPT&quot;.
          </p>
          <p className="ai-quote">
            Construido junto a un responsable de IA de un estudio de arquitectura de referencia — el mismo flujo
            que ya usan los despachos que van un paso por delante.
          </p>

          <div className="ai-capabilities">
            {AI_CAPABILITIES.map((cap) => (
              <div className="ai-cap" key={cap.num}>
                <div className="ai-cap-num">{cap.num}</div>
                <h3>{cap.title}</h3>
                <p>{cap.text}</p>
              </div>
            ))}
          </div>

          <div className="ai-toolkit-head">
            <h3>Lo que tocas en clase</h3>
            <span className="ai-toolkit-line" aria-hidden="true" />
          </div>

          <div className="ai-toolwall">
            {TOOLGROUPS.map((group) => (
              <div className="ai-toolcol" key={group.title}>
                <div className="ai-toolcol-label">
                  {group.title}
                  <span className="ai-toolcol-underline" aria-hidden="true" />
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="section-cta-row">
            <p>¿Quieres ver el módulo de IA aplicada al AEC en detalle? Pregúntanos en una llamada.</p>
            <a href="#agenda" className="programa-cta-link">
              Solicitar información
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ PROGRAMA — mapa visual, sin acordeón ============ */}
      <section id="programa" ref={programaRef}>
        <div className="wrap">
          <div className="programa-eyebrow">Programa completo · 36 ECTS</div>
          <h2 className="programa-title">
            Todo el ciclo de vida de un proyecto AEC, <span className="programa-title-accent">más IA en cada fase.</span>
          </h2>
          <p className="programa-lede">
            Diseño, construcción, project management y explotación — con la Inteligencia Artificial integrada como
            capa transversal, no como módulo aislado.
          </p>

          <div className="programa-rail">
            {PROGRAMA_PHASES.map((phase) => (
              <div className="programa-phase" key={phase}>
                <div className="programa-phase-label">{phase}</div>
                <div className="programa-phase-bar" />
              </div>
            ))}
          </div>

          <div className="programa-grid">
            {MODULES.map((mod) => (
              <div
                className={`programa-card${mod.flagship ? " programa-card--flagship" : ""}`}
                key={mod.idx}
              >
                {mod.flagship ? <span className="programa-flagship-badge">Módulo diferencial</span> : null}
                <div className="programa-card-head">
                  <span className="programa-card-idx mono">{mod.idx}</span>
                  <span className="programa-card-ects mono">{mod.ects} ECTS</span>
                </div>
                <h3>{mod.title}</h3>
                {mod.subtitle ? <p className="programa-card-subtitle">{mod.subtitle}</p> : null}
                {mod.description ? <p className="programa-card-subtitle">{mod.description}</p> : null}
                <div className="programa-card-hours mono">{mod.hours} horas</div>
                <span className="programa-card-num" aria-hidden="true">
                  {mod.idx}
                </span>
              </div>
            ))}
          </div>

          <div className="programa-summary">
            <div className="programa-summary-total">
              Total: <b>36</b> ECTS · 900 horas
            </div>
            <div className="programa-summary-breakdown">
              <div className="programa-summary-item">
                <span className="programa-summary-dot" style={{ background: "var(--blueprint)" }} />
                21 núcleo BIM
              </div>
              <div className="programa-summary-item">
                <span className="programa-summary-dot" style={{ background: "var(--amber)" }} />6 IA aplicada
              </div>
              <div className="programa-summary-item">
                <span className="programa-summary-dot" style={{ background: "var(--dim)" }} />9 Talent + TFM
              </div>
            </div>
          </div>

          <div className="programa-cta-row">
            <p>¿Prefieres que te lo expliquemos en una llamada?</p>
            <a href="#agenda" className="programa-cta-link">
              Solicitar información
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ CERTIFICACIÓN ============ */}
      <section id="certificacion" ref={certificacionRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="editorial-eyebrow">Tres credenciales, no una</div>
            <h2>Sales con algo más que un diploma.</h2>
            <p>
              Cada credencial convence a un interlocutor distinto: la universidad da validez académica, AECOMI
              certifica competencias concretas ante el sector, y Cualificam avala la calidad del programa.
            </p>
          </div>

          <div className="cred-stack">
            {CRED_STACK.map((cred) => (
              <div className="cred-card glass-card" key={cred.layer}>
                <div className="layer mono">{cred.layer}</div>
                <h3>{cred.title}</h3>
                <p>{cred.text}</p>
                <span className="cred-card-num" aria-hidden="true">
                  {cred.layer.split(" ")[0]}
                </span>
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

          <div className="section-cta-row">
            <p>¿Qué credencial pesa más para tu objetivo? Lo vemos en una llamada.</p>
            <a href="#agenda" className="programa-cta-link">
              Solicitar información
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ INNOVATION SUMMIT ============ */}
      <section ref={summitRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="editorial-eyebrow">Conexión directa con empresas</div>
            <h2>IDESIE AEC Innovation Summit</h2>
            <p>
              Cuatro veces al año, empresas líderes del sector vienen a exponer casos reales delante de tu promoción
              — y a fichar.
            </p>
          </div>
          <div className="summit-line">
            <div className="summit-progress" aria-hidden="true" />
            {SUMMIT.map((item) => (
              <div className="summit-card glass-card" key={item.month}>
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
            <div className="editorial-eyebrow">Lo que te llevas</div>
            <h2>Formación técnica y de liderazgo, no solo software.</h2>
          </div>
          <div className="outcomes">
            {OUTCOMES.map((item) => (
              <div className="outcome glass-card" key={item.text}>
                <StatCounter value={item.n} className="n" />
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIOS — 3 vídeos reales, Máster BIM Full Time ============ */}
      <section id="testimonios" ref={testimoniosRef}>
        <span className="testimonials-quote-mark" aria-hidden="true">&ldquo;</span>
        <div className="wrap">
          <div className="programa-eyebrow">Lo que dicen quienes ya lo han hecho</div>
          <h2 className="programa-title">
            No te lo contamos <span className="programa-title-accent">solo nosotros.</span>
          </h2>
          <p className="programa-lede">
            Antiguos alumnos del Máster BIM Full Time, en sus propias palabras — sin guion.
          </p>

          <div className="testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial glass-card" key={t.name}>
                <div className="testimonial-video-frame">
                  <video
                    ref={(el) => {
                      testimonialVideoRefs.current[i] = el
                    }}
                    src={t.video}
                    preload="metadata"
                    playsInline
                    muted={testimonialState[i].muted}
                    aria-label={`Vídeo testimonio de ${t.name}: «${t.quote}»`}
                    className="testimonial-video"
                    onClick={() => toggleTestimonialPlay(i)}
                    onPlay={() => setTestimonialPlaying(i, true)}
                    onPause={() => setTestimonialPlaying(i, false)}
                    onEnded={() => setTestimonialPlaying(i, false)}
                  >
                    Tu navegador no admite la reproducción de este vídeo.
                  </video>
                  {!testimonialState[i].playing && (
                    <button
                      type="button"
                      onClick={() => toggleTestimonialPlay(i)}
                      className="testimonial-play-btn"
                      aria-label={`Reproducir vídeo de ${t.name}`}
                    >
                      <Play size={22} aria-hidden="true" fill="currentColor" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTestimonialMute(i)
                    }}
                    className="testimonial-mute-btn"
                    aria-label={testimonialState[i].muted ? "Activar sonido" : "Silenciar vídeo"}
                  >
                    {testimonialState[i].muted ? (
                      <VolumeX size={15} aria-hidden="true" />
                    ) : (
                      <Volume2 size={15} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <div className="testimonial-body">
                  <span className="testimonial-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="quote">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="who">
                    <div className="name">{t.name}</div>
                    <div className="meta">{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-cta-row">
            <p>¿Quieres hablar con alguien del equipo antes de decidir?</p>
            <a href="#agenda" className="programa-cta-link">
              Solicitar información
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ ADMISIÓN ============ */}
      <section id="admision" ref={admisionRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="editorial-eyebrow">Proceso de admisión</div>
            <h2>Plazas limitadas — grupos reducidos por diseño.</h2>
            <p>
              El número reducido de alumnos por promoción es lo que permite garantizar contrato a todos desde el
              inicio. Empieza el proceso cuanto antes.
            </p>
          </div>
          <div className="steps">
            {STEPS.map((step) => (
              <div className="step glass-card" key={step.n}>
                <span className="step-accent" aria-hidden="true" />
                <div className="n mono">{step.n}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>

          <div className="admision-alt-cta">
            <p>¿No estás seguro todavía?</p>
            <a
              href="#agenda"
              className="btn btn-ghost btn-sweep"
              data-magnetic
              style={{ ["--btn-fill" as string]: "rgba(0,108,255,0.08)" }}
            >
              <CalendarCheck size={15} aria-hidden="true" />
              Solicitar información
              <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
            </a>
            <AdmisionModal origen="landing" programaPreseleccionado="MBIM">
              <button
                type="button"
                className="btn btn-ghost btn-sweep"
                data-magnetic
                style={{ ["--btn-fill" as string]: "rgba(0,108,255,0.08)" }}
              >
                Enviar mi solicitud de admisión
                <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
              </button>
            </AdmisionModal>
          </div>
        </div>
      </section>

      {/* ============ AGENDA — formulario propio, agendar llamada es opcional ============ */}
      <section id="agenda" ref={agendaRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="editorial-eyebrow">Habla con nosotros</div>
            <h2>Cuéntanos qué necesitas — sin salir de esta página.</h2>
            <p>
              Deja tus datos y te contactamos. Si prefieres que te llamemos a una hora concreta, puedes agendarlo:
              es totalmente opcional.
            </p>
          </div>
          <div className="agenda-form-wrap">
            <LeadCaptureForm origen="Landing · Agenda" />
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="cta-final" ref={ctaRef}>
        <div className="wrap">
          <div className="cta-final-card">
            <h2>
              <span className="cta-lede-muted">Empieza el </span>
              <span className="cta-date">24 de octubre de 2026</span>
              <span className="cta-lede-muted">.</span>
            </h2>
            <p>Grupo reducido, contrato desde el primer día y el módulo de IA más avanzado del mercado BIM en español.</p>
            <div className="hero-actions">
              <span className="cta-pulse-wrap">
                <a href="#agenda" className="btn btn-signal" data-magnetic>
                  Solicitar información
                  <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
                </a>
              </span>
              <button
                type="button"
                onClick={() => setCatalogOpen(true)}
                className="btn btn-ghost-light btn-sweep"
                data-magnetic
                style={{ ["--btn-fill" as string]: "rgba(255,255,255,0.16)" }}
              >
                Descargar el programa (PDF)
                <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
              </button>
            </div>
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

      {/* ============ BARRA FLOTANTE DE CTA ============ */}
      <div className={`landing-sticky-cta${showSticky ? " is-visible" : ""}`} aria-hidden={!showSticky}>
        <div className="landing-sticky-cta-inner">
          <span className="landing-sticky-cta-text">Grupo de octubre · plazas limitadas</span>
          <a
            href="#agenda"
            className="btn btn-signal"
            data-magnetic
            tabIndex={showSticky ? 0 : -1}
          >
            Solicitar información
            <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
          </a>
        </div>
      </div>

      <CatalogDownloadDialog
        catalogId="mbim-fulltime"
        catalogName="Máster BIM Full Time"
        open={catalogOpen}
        onOpenChange={setCatalogOpen}
        onSuccess={() => trackMetaPixelEvent("Lead")}
      />
    </div>
  )
}
