"use client"

import { ArrowRight, CalendarCheck } from "lucide-react"
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
 * 2026-09-09 — La sección "Programa" (antes un acordeón de 9 módulos, con
 * `useState` para abrir/cerrar uno cada vez) se rediseñó como mapa visual:
 * las 9 tarjetas están todas a la vista de golpe, sin apertura/cierre, así
 * que ya no queda ningún estado de React en este componente.
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
  /* Gris apagado — pedido explícito como "--dim" en el rediseño de "El
     Problema" (2026-09-08). Mismo gris ya usado sin token en
     .compare .old li::before (#9AA1A9); se sube a variable para no
     repetir el hex y para que el resto de la sección lo reutilice. */
  --dim:#9AA1A9;
  --dark-2:color-mix(in oklab, var(--ink) 88%, var(--blueprint) 12%);
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
/* Bug real encontrado en la auditoría de responsive (2026-09-09): con el
   corte en 720px, cualquier ancho de tablet (720-999px aprox.) mostraba
   LOS DOS a la vez — los 6 enlaces + el botón — sin espacio suficiente:
   el nombre de marca partía en dos líneas, "Admisión" quedaba pegado al
   botón sin aire, y "Reservar plaza" partía en dos líneas también.
   Medido con los enlaces reales: a 900px el hueco entre el último enlace
   y el botón era de 4px; no hay aire real hasta ~1000px. Se sube el corte
   de 720 a 1000 para los dos a la vez (nunca se muestra uno sin el otro) —
   por debajo de 1000px la cabecera vuelve al mismo tratamiento mínimo
   (solo marca) que ya usaba el móvil, en vez de dejar una franja de
   "tablet" a medio romper. */
.mbim2-landing .nav-cta{display:none;}
@media(min-width:1000px){.mbim2-landing .nav-cta{display:inline-flex;}}
@media(max-width:999px){.mbim2-landing .nav-links{display:none;}}

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

/* ---------- kicker con píldora + punto de pulso (solo hero, 2026-09-08) ----
   Modificador de .kicker — la clase base se deja intacta, se sigue usando
   sin píldora ni pulso en el resto de secciones. Mismo mecanismo de pulso
   que .cta-pulse-wrap (anillo que crece y se desvanece), aplicado aquí a
   un punto de 6px en vez de a un botón entero. */
.mbim2-landing .kicker-pill{
  display:inline-flex;
  align-items:center;
  gap:9px;
  padding:7px 14px 7px 11px;
  border:1px solid var(--line);
  border-radius:999px;
  background:var(--white);
  margin-bottom:0;
}
.mbim2-landing .kicker-pill::before{content:none;}
.mbim2-landing .kicker-dot{
  position:relative;
  width:7px;
  height:7px;
  border-radius:50%;
  background:var(--blueprint);
  flex-shrink:0;
  box-shadow:0 0 0 0 rgba(0,108,255,0.55);
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .kicker-dot{
    animation:mbim2-dot-pulse 2.2s var(--ease-in-out-quint, cubic-bezier(0.83,0,0.17,1)) infinite;
  }
}
@keyframes mbim2-dot-pulse{
  0%{box-shadow:0 0 0 0 rgba(0,108,255,0.55);}
  70%{box-shadow:0 0 0 8px rgba(0,108,255,0);}
  100%{box-shadow:0 0 0 8px rgba(0,108,255,0);}
}

/* ---------- barra de urgencia (2026-09-08, 3ª pasada) ----------
   Franja sobre las dos columnas del hero, dentro del flujo normal (no
   position:fixed sobre el viewport) — la barra de navegación ya es
   sticky; dos elementos fijos apilados uno sobre otro sería confuso al
   hacer scroll. Fondo degradado (antes sólido) + "quedan pocas plazas"
   en ámbar, pedido explícito del cliente. */
.mbim2-landing .urgency-bar{
  background:linear-gradient(90deg, var(--ink), color-mix(in oklab, var(--ink) 82%, var(--blueprint) 18%));
  color:rgba(255,255,255,0.92);
  text-align:center;
  padding:7px 20px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12px;
  letter-spacing:0.02em;
}
.mbim2-landing .urgency-bar b{color:var(--white);font-weight:600;}
.mbim2-landing .urgency-bar .amber{color:var(--secondary, #ffba08);font-weight:600;}
.mbim2-landing .urgency-bar .sep{margin:0 10px;opacity:0.4;}

/* ---------- hero: dos columnas ---------- */
.mbim2-landing .hero{
  position:relative;
  overflow:hidden;
  border-bottom:1px solid var(--line);
  /* Anula el padding:88px 0 genérico de ".mbim2-landing section" — el hero
     no es una sección de contenido más, controla su propio espaciado (la
     barra de urgencia debe quedar pegada al nav, sin hueco). Sin esto,
     medido con Puppeteer: ~88px de hueco vacío entre nav y barra. */
  padding:0;
}
.mbim2-landing .hero-inner{
  position:relative;
  z-index:2;
}
/* Bug real encontrado en auditoría (2026-09-09): el hero era full-bleed
   SIN ningún tope de ancho — en monitores anchos (1920px+) el contenido
   de la columna izquierda (limitado a 600px por .hero-copy-inner) se
   quedaba apilado en una esquina con cientos de píxeles de hueco vacío a
   su lado, y las tarjetas flotantes de la derecha (ancladas a los bordes
   de una columna cada vez más ancha) se alejaban del edificio 3D en vez
   de acompañarlo. Medido con Puppeteer: a 1440px la composición ya
   funciona bien (validada en sesiones anteriores) — se limita el ancho
   máximo del grid a partir de ahí, en vez de dejarlo crecer sin freno.
   Fuera de ese límite, el fondo papel de la sección asoma en los márgenes
   — funde bien con el degradado cálido de la columna izquierda y deja el
   panel oscuro de la derecha como un panel "enmarcado", no una barra
   oscura infinita. */
.mbim2-landing .hero-grid{
  position:relative;
  display:grid;
  grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr);
  align-items:stretch;
  min-height:680px;
  max-width:1600px;
  margin:0 auto;
}
@media(max-width:960px){
  .mbim2-landing .hero-grid{grid-template-columns:1fr;min-height:0;}
}

/* columna izquierda: mesh gradient + retícula técnica
   Padding compactado (2026-09-08, 2ª pasada): con la barra de urgencia +
   todo el contenido, la versión anterior (72/56px) empujaba el CTA fuera
   de la primera pantalla en portátiles de 900px de alto — medido con
   Puppeteer, no a ojo (chips a top:977px, CTA a top:1060px). */
.mbim2-landing .hero-copy-col{
  position:relative;
  overflow:hidden;
  padding:14px 32px 12px;
  display:flex;
  flex-direction:column;
  justify-content:center;
}
.mbim2-landing .hero-copy-col::before{
  content:"";
  position:absolute;
  inset:-20%;
  background:
    radial-gradient(42% 48% at 15% 15%, color-mix(in oklab, var(--blueprint) 14%, transparent) 0%, transparent 70%),
    radial-gradient(38% 44% at 85% 80%, color-mix(in oklab, var(--secondary, #ffba08) 12%, transparent) 0%, transparent 70%);
  pointer-events:none;
}
/* retícula con máscara radial — se desvanece hacia los bordes en vez de
   cortar en seco, pedido explícito del mockup ("grid-bg con máscara"). */
.mbim2-landing .hero-copy-col .grid-bg{
  opacity:0.4;
  -webkit-mask-image:radial-gradient(ellipse 70% 70% at 30% 35%, black 0%, transparent 75%);
  mask-image:radial-gradient(ellipse 70% 70% at 30% 35%, black 0%, transparent 75%);
}
.mbim2-landing .hero-copy-inner{
  position:relative;
  z-index:2;
  max-width:660px;
}

/* prueba social: 3 avatares apilados, gradiente azul→violeta consistente
   (2026-09-08, 3ª pasada) — sin cifra en el texto per el mockup nuevo, pero
   el cliente pidió mantener "+4.700" ya confirmado en la ronda anterior. */
.mbim2-landing .hero-social-proof{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:14px;
}
.mbim2-landing .avatar-stack{display:flex;}
.mbim2-landing .avatar-stack span{
  width:28px;height:28px;
  border-radius:50%;
  border:2px solid var(--paper);
  margin-left:-8px;
  background:linear-gradient(135deg, var(--blueprint), #7c3aed);
}
.mbim2-landing .avatar-stack span:first-child{margin-left:0;}
.mbim2-landing .hero-social-proof p{font-size:13.5px;color:#3A424B;}
.mbim2-landing .hero-social-proof p b{color:var(--ink);font-weight:600;}

.mbim2-landing .hero h1{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;
  font-weight:700;
  font-size:clamp(30px, 3.2vw, 42px);
  line-height:1.05;
  letter-spacing:-0.035em;
  max-width:none;
}
.mbim2-landing .hero h1 .accent{
  background:linear-gradient(100deg, var(--blueprint) 15%, #7c3aed 90%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.mbim2-landing .hero-cursor{
  display:inline-block;
  width:3px;
  height:0.78em;
  margin-left:4px;
  background:var(--blueprint);
  vertical-align:-0.1em;
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .hero-cursor{animation:mbim2-cursor-blink 1.05s steps(1) infinite;}
}
@keyframes mbim2-cursor-blink{0%,50%{opacity:1;}50.01%,100%{opacity:0;}}

/* Bug real encontrado en auditoría (2026-09-09): .hero-line/.hero-line-2/
   .hero-fade/.hero-fade-late se usaban en el JSX de abajo sin definirlos
   nunca dentro de LANDING_STYLES — como esta hoja no tiene la protección
   de .mbim2-landing en estos 4 nombres, el navegador aplicaba sin querer
   la regla GLOBAL del mismo nombre en app/globals.css (el mecanismo de
   revelado de titular que ya usan las páginas de máster). Esa regla pone
   .hero-line en display:block — y como el <h1> de aquí ADEMÁS separaba
   cada línea con un <br/> manual, el salto de línea se duplicaba: bloque
   + <br/> = casi el doble de alto entre líneas del titular. Se elimina la
   dependencia del mecanismo global (nunca fue una reutilización a
   propósito, a diferencia de .journey-spotlight/.btn-sweep/.site-cursor,
   sí documentadas como tales más abajo) y se define aquí, scoped, el
   mismo efecto que sí parecía buscarse (los delays por línea ya estaban
   escritos a mano en el JSX: 0.05s/0.18s/0.32s). */
.mbim2-landing .hero-line{
  display:block;
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .hero-line{
    animation:mbim2-hero-line-in 1.1s var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)) both;
  }
  .mbim2-landing .hero-fade{
    animation:mbim2-hero-fade-in 1s var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)) both;
    animation-delay:0.3s;
  }
  .mbim2-landing .hero-fade-late{animation-delay:0.45s;}
}
@keyframes mbim2-hero-line-in{
  from{opacity:0;transform:translate3d(0, 0.55em, 0);}
  to{opacity:1;transform:none;}
}
@keyframes mbim2-hero-fade-in{
  from{opacity:0;transform:translate3d(0, 1.5rem, 0);}
  to{opacity:1;transform:none;}
}

.mbim2-landing .hero-sub{
  max-width:520px;
  margin-top:16px;
  font-size:15px;
  color:#3A424B;
}

/* chips de datos: fondo blanco translúcido con blur, número grande arriba
   + etiqueta pequeña debajo (apilado, no en fila — 2026-09-08, 3ª pasada),
   con hover que eleva la tarjeta. */
.mbim2-landing .hero-chips{
  display:flex;
  flex-wrap:wrap;
  gap:12px;
  margin-top:22px;
}
.mbim2-landing .hero-chip{
  display:flex;
  flex-direction:column;
  gap:2px;
  padding:10px 14px;
  border:1px solid rgba(0,108,255,0.16);
  border-radius:10px;
  background:rgba(255,255,255,0.55);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  transition:transform .18s var(--ease-out-quart, ease), border-color .18s, box-shadow .18s;
}
.mbim2-landing .hero-chip:hover{
  transform:translateY(-3px);
  border-color:var(--blueprint-light);
  box-shadow:0 10px 24px -14px rgba(0,108,255,0.35);
}
.mbim2-landing .hero-chip .chip-value{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-weight:600;
  font-size:19px;
  color:var(--blueprint);
  line-height:1;
}
.mbim2-landing .hero-chip .chip-label{font-size:11.5px;color:#5B6470;}
@media(prefers-reduced-motion:reduce){
  .mbim2-landing .hero-chip{transition:none;}
}

.mbim2-landing .hero-actions{
  display:flex;
  gap:16px;
  margin-top:22px;
  flex-wrap:wrap;
  align-items:center;
}
/* Antes un <p> sin interacción — ahora un enlace real a la reserva de
   Calendly (/contact-page?motivo=asesoria, mismo destino que el resto de
   los nuevos CTA de "sesión informativa" de esta página, 2026-09-09). El
   texto ya hablaba de una llamada gratuita de 15 min: solo hacía falta
   dejarla pulsable. Voz mono, coherente con el resto de "notas de
   confianza" de la página — no es un botón, es un enlace discreto. */
.mbim2-landing .hero-trust-note{
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:12px;
  color:#5B6470;
  margin-top:14px;
  text-decoration:none;
  border-bottom:1px solid transparent;
  padding-bottom:1px;
  transition:color .2s var(--ease-out-quart, ease), border-color .2s var(--ease-out-quart, ease);
}
.mbim2-landing .hero-trust-note:hover{
  color:var(--blueprint);
  border-color:currentColor;
}
.mbim2-landing .hero-trust-note svg{flex-shrink:0;}

/* CTA primario: gradiente azul→violeta + sombra azul difusa + brillo
   diagonal en bucle continuo (no solo al hover — 2026-09-08, 3ª pasada).
   Sustituye a .btn-signal solo en este botón (no se toca la clase
   compartida): un fondo sólido definido después en la cascada pisaría el
   degradado, así que este botón usa .btn + .hero-cta-gradient, sin
   .btn-signal. */
.mbim2-landing .hero-cta-gradient{
  position:relative;
  overflow:hidden;
  background:linear-gradient(100deg, var(--blueprint), #7c3aed);
  color:var(--white);
  box-shadow:0 16px 32px -14px rgba(0,108,255,0.5);
}
.mbim2-landing .hero-cta-gradient::after{
  content:"";
  position:absolute;
  top:0;left:-60%;
  width:35%;height:100%;
  background:linear-gradient(115deg, transparent, rgba(255,255,255,0.4), transparent);
  pointer-events:none;
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .hero-cta-gradient::after{
    animation:mbim2-cta-sweep 2.6s linear infinite;
  }
}
@keyframes mbim2-cta-sweep{
  0%{left:-60%;}
  100%{left:140%;}
}

/* columna derecha: panel oscuro con retícula + edificio 3D real
   Rehecho por completo (2026-09-08, 3ª pasada) — sustituye al cubo de la
   2ª pasada por un edificio de oficinas compuesto de 4 volúmenes reales
   (transform-style:preserve-3d), pedido explícito y detallado del
   cliente. Las 3 tarjetas vuelven a flotar sobre el edificio (posición
   absoluta, no en columna propia) — es un diseño distinto al del cubo,
   no una regresión del ajuste anterior. */
.mbim2-landing .hero-visual-col{
  position:relative;
  overflow:hidden;
  background:radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, var(--blueprint) 12%, var(--ink)) 0%, var(--ink) 62%);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:40px 28px;
}
.mbim2-landing .hero-visual-col .grid-bg{
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  opacity:1;
}

/* --- escenario 3D --- */
.mbim2-landing .hero-building-stage{
  position:relative;
  width:100%;
  max-width:380px;
  height:400px;
  perspective:1500px;
  z-index:1;
}
.mbim2-landing .hero-building{
  position:absolute;
  left:50%;bottom:22%;
  width:1px;height:1px;
  transform-style:preserve-3d;
  transform-origin:center bottom;
  transform:rotateX(-6deg) rotateY(0deg);
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .hero-building{animation:mbim2-building-spin 30s linear infinite;}
}
@keyframes mbim2-building-spin{
  from{transform:rotateX(-6deg) rotateY(0deg);}
  to{transform:rotateX(-6deg) rotateY(360deg);}
}

/* --- volúmenes: caja genérica reutilizable (--bw/--bh/--bd por instancia,
   inline) — evita duplicar 4 juegos de caras a mano. */
.mbim2-landing .b3d-box{
  position:absolute;
  width:var(--bw);
  height:var(--bh);
  transform-style:preserve-3d;
}
.mbim2-landing .b3d-face{
  position:absolute;
  inset:0;
  border:1px solid rgba(255,255,255,0.14);
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 15px),
    linear-gradient(180deg, color-mix(in oklab, var(--blueprint) 38%, var(--ink)) 0%, var(--ink) 100%);
}
.mbim2-landing .b3d-face--front{transform:translateZ(calc(var(--bd) / 2));}
.mbim2-landing .b3d-face--back{transform:translateZ(calc(var(--bd) / -2)) rotateY(180deg);}
.mbim2-landing .b3d-face--left{
  width:var(--bd);height:var(--bh);
  left:calc((var(--bw) - var(--bd)) / 2);
  transform:rotateY(-90deg) translateZ(calc(var(--bd) / 2));
}
.mbim2-landing .b3d-face--right{
  width:var(--bd);height:var(--bh);
  left:calc((var(--bw) - var(--bd)) / 2);
  transform:rotateY(90deg) translateZ(calc(var(--bd) / 2));
}
.mbim2-landing .b3d-face--top{
  width:var(--bw);height:var(--bd);
  top:calc((var(--bh) - var(--bd)) / 2);
  background:color-mix(in oklab, var(--blueprint) 22%, var(--ink));
  transform:rotateX(90deg) translateZ(calc(var(--bh) / 2));
}
/* ala y podio: mismo tratamiento de fachada, más tenues (pedido explícito) */
.mbim2-landing .b3d-box--dim .b3d-face{opacity:0.72;}

/* mástil + baliza ámbar con pulso continuo */
.mbim2-landing .hero-mast{
  position:absolute;
  left:-1px;
  width:2px;
  background:linear-gradient(180deg, rgba(255,255,255,0.55), transparent);
}
.mbim2-landing .hero-beacon{
  position:absolute;
  left:-3px;
  width:7px;height:7px;
  border-radius:50%;
  background:var(--secondary, #ffba08);
  box-shadow:0 0 0 0 rgba(255,186,8,0.7);
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .hero-beacon{animation:mbim2-beacon-pulse 1.8s ease-out infinite;}
}
@keyframes mbim2-beacon-pulse{
  0%{box-shadow:0 0 0 0 rgba(255,186,8,0.7);}
  70%{box-shadow:0 0 0 10px rgba(255,186,8,0);}
  100%{box-shadow:0 0 0 10px rgba(255,186,8,0);}
}

/* ventanas iluminadas — se encienden progresivamente al cargar */
.mbim2-landing .hero-window{
  position:absolute;
  width:6px;height:6px;
  border-radius:1px;
  background:var(--secondary, #ffba08);
  box-shadow:0 0 6px 2px rgba(255,186,8,0.75);
  opacity:0;
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .hero-window{animation:mbim2-window-glow 0.6s ease-out forwards;}
}
@media(prefers-reduced-motion:reduce){
  .mbim2-landing .hero-window{opacity:0.85;}
}
@keyframes mbim2-window-glow{to{opacity:0.85;}}

/* suelo: plano rotado 90°, retícula azul con máscara radial */
.mbim2-landing .hero-building-floor{
  position:absolute;
  left:0;top:0;
  width:520px;height:520px;
  margin-left:-260px;
  transform-origin:top center;
  transform:rotateX(90deg);
  background-image:
    linear-gradient(rgba(0,108,255,0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,108,255,0.14) 1px, transparent 1px);
  background-size:26px 26px;
  -webkit-mask-image:radial-gradient(circle at center, black 0%, transparent 68%);
  mask-image:radial-gradient(circle at center, black 0%, transparent 68%);
  pointer-events:none;
}

/* --- tarjetas flotantes sobre el edificio ---
   Inclinación 3D constante (perspective+rotateX/rotateY) + flotación
   vertical continua; al hover se paran y enderezan. La animación CSS
   siempre gana sobre un transform inline normal (incluido uno puesto
   por GSAP), así que la entrada de las tarjetas se anima solo en
   opacity por GSAP — nunca en transform, para no pelearse con este
   bucle. animation-fill-mode:backwards hace que, durante el delay
   inicial, la tarjeta ya muestre la pose de reposo del 0% del keyframe. */
.mbim2-landing .hero-float-card{
  position:absolute;
  width:228px;
  padding:16px 18px;
  border-radius:14px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.16);
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
  color:var(--white);
  box-shadow:0 20px 44px -20px rgba(0,0,0,0.6);
  z-index:3;
  transform:perspective(700px) rotateX(4deg) rotateY(-4deg);
  transition:transform .35s var(--ease-out-quart, ease);
}
@keyframes mbim2-card-float{
  0%,100%{transform:perspective(700px) rotateX(4deg) rotateY(-4deg) translateY(0);}
  50%{transform:perspective(700px) rotateX(4deg) rotateY(-4deg) translateY(-8px);}
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .hero-float-card{
    animation-name:mbim2-card-float;
    animation-duration:5.5s;
    animation-timing-function:ease-in-out;
    animation-iteration-count:infinite;
    animation-fill-mode:backwards;
  }
}
.mbim2-landing .hero-float-card:hover{
  animation-name:none;
  transform:perspective(700px) rotateX(0deg) rotateY(0deg) translateY(-6px);
}
@media(prefers-reduced-motion:reduce){
  .mbim2-landing .hero-float-card{transition:none;}
}
.mbim2-landing .hero-card-seats{top:6%;left:0%;}
.mbim2-landing .hero-card-testimonial{bottom:5%;right:0%;}
.mbim2-landing .hero-card-contract{bottom:20%;left:0%;}
@media(max-width:1180px){
  .mbim2-landing .hero-card-testimonial{right:-2%;}
}
@media(max-width:960px){
  .mbim2-landing .hero-visual-col{padding:88px 20px 40px;flex-direction:column;}
  .mbim2-landing .hero-building-stage{height:280px;max-width:280px;}
  .mbim2-landing .hero-float-card{
    position:relative;
    width:100%;
    max-width:340px;
    margin:0 auto 14px;
    top:auto;left:auto;right:auto;bottom:auto;
    transform:none;
    animation:none;
  }
  .mbim2-landing .hero-float-card:hover{transform:none;}
}

.mbim2-landing .card-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:10.5px;
  letter-spacing:0.05em;
  text-transform:uppercase;
  color:var(--secondary, #ffba08);
  margin-bottom:10px;
}
.mbim2-landing .card-badge--white{color:rgba(255,255,255,0.75);}

.mbim2-landing .seat-bar-track{
  position:relative;
  height:5px;
  border-radius:999px;
  background:rgba(255,255,255,0.16);
  overflow:hidden;
  margin-bottom:10px;
}
/* Por defecto ya dibujada hasta el ratio real (23/30 → 77%, confirmado
   por el cliente) — si GSAP no llega a cargar, la barra se ve en su
   estado final desde el primer render, mismo criterio que
   .summit-progress más abajo en la página. */
.mbim2-landing .seat-bar-fill{
  position:absolute;inset:0;
  border-radius:999px;
  background:linear-gradient(90deg, var(--secondary, #ffba08), #e11d48);
  transform-origin:left center;
  transform:scaleX(0.7667);
}
.mbim2-landing .hero-card-caption{font-size:12.5px;color:rgba(255,255,255,0.72);}
.mbim2-landing .hero-card-caption b{color:var(--white);font-weight:600;}

.mbim2-landing .hero-card-testimonial .quote{
  font-size:13.5px;
  line-height:1.42;
  color:rgba(255,255,255,0.92);
  margin-bottom:10px;
}
.mbim2-landing .hero-card-testimonial .who{display:flex;align-items:center;gap:9px;}
.mbim2-landing .hero-card-testimonial .who-avatar{
  width:26px;height:26px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg, var(--blueprint), #7c3aed);
}
.mbim2-landing .hero-card-testimonial .who-meta{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11.5px;
  color:rgba(255,255,255,0.7);
}

.mbim2-landing .hero-card-contract p{font-size:13px;line-height:1.4;color:rgba(255,255,255,0.85);margin:2px 0 0;}
.mbim2-landing .hero-card-contract b{color:var(--white);}

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

/* ---------- "El Problema" — cabecera + fondo (2026-09-08, rediseño) ---- */
.mbim2-landing .problema-head{
  max-width:900px;
  margin:0 auto 52px;
  text-align:center;
}
.mbim2-landing .problema-eyebrow{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11.5px;
  letter-spacing:0.1em;
  text-transform:uppercase;
  color:var(--blueprint);
  margin-bottom:18px;
}
.mbim2-landing .problema-eyebrow::before,
.mbim2-landing .problema-eyebrow::after{
  content:"";
  width:26px;
  height:1px;
  background:var(--blueprint);
  opacity:0.5;
}
.mbim2-landing .problema-head h2{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;
  font-weight:800;
  font-size:clamp(30px, 4vw, 46px);
  line-height:1.08;
  letter-spacing:-0.02em;
}
/* "2019" en gris apagado con línea de tachado que se dibuja al entrar en
   pantalla (por defecto ya trazada — scaleX:1 — para que se vea completa
   si ScrollTrigger no llega a correr, mismo criterio que .summit-progress
   más abajo en la página). */
.mbim2-landing .problema-strike{
  position:relative;
  color:var(--dim);
  display:inline-block;
}
/* Elemento real, no ::after — GSAP no puede seleccionar ni animar
   pseudo-elementos, mismo motivo por el que .summit-progress (más abajo
   en la página) tampoco lo es. */
.mbim2-landing .problema-strike-line{
  position:absolute;
  left:0;right:0;
  top:52%;
  height:3px;
  background:var(--dim);
  transform-origin:left center;
  transform:scaleX(1);
  pointer-events:none;
}
.mbim2-landing .problema-grad{
  background:linear-gradient(100deg, var(--blueprint) 15%, #7c3aed 90%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.mbim2-landing .problema-lede{
  margin:16px auto 0;
  max-width:620px;
  font-size:16.5px;
  line-height:1.65;
  color:#3A424B;
  text-align:center;
}

/* fondo de la sección: retícula con máscara desde arriba + aura difusa */
.mbim2-landing .problema-bg-grid{
  opacity:0.32;
  -webkit-mask-image:linear-gradient(180deg, black 0%, transparent 85%);
  mask-image:linear-gradient(180deg, black 0%, transparent 85%);
}
.mbim2-landing .problema-aura{
  position:absolute;
  top:-120px;right:-120px;
  width:620px;height:620px;
  border-radius:50%;
  background:radial-gradient(circle, color-mix(in oklab, var(--blueprint) 13%, transparent) 0%, transparent 70%);
  filter:blur(50px);
  pointer-events:none;
}

/* ---------- comparativa: grid de 3 columnas, divisor central ---------- */
.mbim2-landing .compare{
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:stretch;
  gap:0;
}
.mbim2-landing .compare-divider{
  position:relative;
  width:1px;
  margin:0 34px;
  background:linear-gradient(180deg, transparent 0%, var(--line) 15%, var(--line) 85%, transparent 100%);
}
.mbim2-landing .compare-divider-pill{
  position:absolute;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  white-space:nowrap;
  background:var(--paper);
  border:1px solid var(--line);
  border-radius:100px;
  padding:6px 14px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:10px;
  letter-spacing:0.1em;
  text-transform:uppercase;
  color:#5B6470;
  box-shadow:0 6px 16px -8px rgba(0,0,0,0.18);
}

.mbim2-landing .compare-panel{border-radius:18px;padding:32px;}
.mbim2-landing .compare-tag{
  display:flex;
  align-items:center;
  gap:8px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  margin-bottom:10px;
}
.mbim2-landing .compare-tag-sq{width:7px;height:7px;border-radius:2px;flex-shrink:0;}
.mbim2-landing .compare-panel h3{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;
  font-size:21px;
  font-weight:700;
  margin-bottom:22px;
}
.mbim2-landing .compare-row{
  position:relative;
  display:flex;
  align-items:flex-start;
  gap:12px;
  padding:12px 0;
  font-size:14.4px;
  transition:transform .25s var(--ease-out-quart, ease);
}
.mbim2-landing .compare-row:hover{transform:translateX(4px);}
/* envuelve el texto de cada fila en un único nodo — un <b> como hijo
   directo de .compare-row (flex) se convertiría en su propio flex-item y
   partiría el texto en "columnas" en vez de fluir como un párrafo. */
.mbim2-landing .compare-row-text{flex:1;min-width:0;}
.mbim2-landing .compare-icon{
  width:20px;height:20px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:11px;
  line-height:1;
  flex-shrink:0;
  margin-top:1px;
}

/* --- panel izquierdo: formato heredado, retrocede visualmente --- */
.mbim2-landing .compare-old{
  background:rgba(3,7,18,0.025);
  border:1px solid rgba(3,7,18,0.07);
  transform:scale(0.97);
  filter:saturate(0.5);
}
.mbim2-landing .compare-old .compare-tag{color:var(--dim);}
.mbim2-landing .compare-old .compare-tag-sq{background:#B7BCC2;}
.mbim2-landing .compare-old h3{color:var(--dim);}
.mbim2-landing .compare-old .compare-row{
  color:var(--dim);
  border-bottom:1px solid rgba(3,7,18,0.07);
}
.mbim2-landing .compare-old .compare-row:last-child{border-bottom:none;}
.mbim2-landing .compare-old .compare-icon{background:rgba(3,7,18,0.055);color:var(--dim);}

/* --- panel derecho: MBIM 2.0, protagonista --- */
.mbim2-landing .compare-new{
  position:relative;
  overflow:hidden;
  background:linear-gradient(150deg, var(--dark-2), var(--ink));
  border:1px solid rgba(0,108,255,0.22);
  box-shadow:0 24px 60px rgba(0,108,255,0.22), inset 0 0 0 1px rgba(0,108,255,0.08);
  color:rgba(255,255,255,0.82);
}
.mbim2-landing .compare-new::before{
  content:"";
  position:absolute;
  inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
  background-size:26px 26px;
  pointer-events:none;
}
.mbim2-landing .compare-new::after{
  content:"";
  position:absolute;
  top:0;left:0;right:0;
  height:2px;
  background:linear-gradient(90deg, var(--blueprint), #7c3aed, var(--secondary, #ffba08), var(--blueprint));
  background-size:200% 100%;
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .compare-new::after{animation:mbim2-accent-shift 4.5s linear infinite;}
}
@keyframes mbim2-accent-shift{
  from{background-position:0% 0;}
  to{background-position:200% 0;}
}
.mbim2-landing .compare-new .compare-tag{color:var(--blueprint-light);}
.mbim2-landing .compare-new .compare-tag-sq{
  background:var(--blueprint);
  box-shadow:0 0 10px var(--blueprint);
}
.mbim2-landing .compare-new .compare-panel-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:22px;
}
.mbim2-landing .compare-new h3{color:var(--white);margin-bottom:0;}
.mbim2-landing .compare-new-badge{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:9.5px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:var(--white);
  background:linear-gradient(100deg, var(--blueprint), #7c3aed);
  border-radius:100px;
  padding:5px 11px;
}
.mbim2-landing .compare-new .compare-row{
  border-bottom:1px solid rgba(255,255,255,0.07);
}
.mbim2-landing .compare-new .compare-row:last-child{border-bottom:none;}
.mbim2-landing .compare-new .compare-row b{color:var(--white);font-weight:600;}
.mbim2-landing .compare-new .compare-icon{
  background:linear-gradient(135deg, color-mix(in oklab, var(--blueprint) 35%, transparent), color-mix(in oklab, #7c3aed 30%, transparent));
  border:1px solid rgba(0,108,255,0.4);
  color:var(--white);
}
/* barra de acento vertical por fila, se dibuja con scaleY 0→1 (GSAP) —
   por defecto ya trazada, mismo criterio de siempre. */
.mbim2-landing .compare-row-accent{
  position:absolute;
  left:-30px;top:2px;bottom:2px;
  width:2px;
  background:linear-gradient(180deg, var(--blueprint), #7c3aed);
  transform-origin:top center;
  transform:scaleY(1);
}

@media(max-width:900px){
  .mbim2-landing .compare{grid-template-columns:1fr;}
  .mbim2-landing .compare-divider{display:none;}
  .mbim2-landing .compare-old{transform:none;margin-bottom:20px;}
  .mbim2-landing .problema-head h2{font-size:32px;}
}

/* ---------- Metodología (2026-09-08, rediseño) ----------
   Sustituye por completo el bloque anterior (2 .day-card con borde +
   .contract-bar con segmentos etiquetados dentro de la barra) — pedido
   explícito: un único bloque con caja (el contrato), el resto es texto
   suelto sobre el fondo, sin tarjetas ni iconos decorativos. */
.mbim2-landing .metodologia-head{
  max-width:980px;
  margin-bottom:44px;
}
.mbim2-landing .metodologia-eyebrow{
  display:flex;
  align-items:center;
  gap:14px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11.5px;
  letter-spacing:0.1em;
  text-transform:uppercase;
  color:var(--blueprint);
  margin-bottom:18px;
}
.mbim2-landing .metodologia-eyebrow::before{
  content:"";
  width:26px;
  height:1px;
  background:var(--blueprint);
  opacity:0.6;
}
.mbim2-landing .metodologia-head h2{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;
  font-weight:800;
  font-size:clamp(28px, 3.6vw, 43px);
  line-height:1.08;
  letter-spacing:-0.02em;
  max-width:680px;
}
.mbim2-landing .metodologia-grad{
  position:relative;
  display:inline-block;
  background:linear-gradient(100deg, var(--blueprint) 15%, #7c3aed 90%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
/* subrayado real (no ::after) — GSAP no puede animar pseudo-elementos,
   mismo motivo que .problema-strike-line más arriba en la página. Por
   defecto ya trazado (scaleX:1) para que se vea completo si ScrollTrigger
   no llega a correr. */
.mbim2-landing .metodologia-grad-underline{
  position:absolute;
  left:0;right:0;
  bottom:-4px;
  height:2px;
  background:linear-gradient(100deg, var(--blueprint) 15%, #7c3aed 90%);
  transform-origin:left center;
  transform:scaleX(1);
  pointer-events:none;
}
.mbim2-landing .metodologia-lede{
  margin-top:16px;
  max-width:620px;
  font-size:16.5px;
  line-height:1.68;
  color:#3A424B;
}
.mbim2-landing .metodologia-lede b{color:var(--ink);font-weight:600;}

.mbim2-landing .metodologia-bg-grid{
  opacity:0.28;
  -webkit-mask-image:linear-gradient(180deg, black 0%, transparent 85%);
  mask-image:linear-gradient(180deg, black 0%, transparent 85%);
}

/* --- bloque único destacado: el contrato --- */
.mbim2-landing .contract-block{
  position:relative;
  overflow:hidden;
  border-radius:14px;
  background:linear-gradient(150deg, var(--dark-2), var(--ink));
  color:var(--white);
  padding:38px 40px 34px;
}
.mbim2-landing .contract-block::before{
  content:"";
  position:absolute;
  inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size:30px 30px;
  pointer-events:none;
}
.mbim2-landing .contract-block::after{
  content:"";
  position:absolute;
  top:-140px;right:-140px;
  width:420px;height:420px;
  border-radius:50%;
  background:radial-gradient(circle, color-mix(in oklab, var(--blueprint) 20%, transparent) 0%, transparent 62%);
  pointer-events:none;
}
.mbim2-landing .contract-block-inner{position:relative;z-index:1;}

.mbim2-landing .contract-block-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  flex-wrap:wrap;
  gap:20px;
  margin-bottom:36px;
}
.mbim2-landing .contract-tag{
  display:flex;
  align-items:center;
  gap:8px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:10.5px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:var(--blueprint-light);
  margin-bottom:12px;
}
.mbim2-landing .contract-tag-sq{
  width:7px;height:7px;
  border-radius:2px;
  background:var(--blueprint);
  box-shadow:0 0 10px var(--blueprint);
  flex-shrink:0;
}
.mbim2-landing .contract-block-title{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;
  font-weight:700;
  font-size:26px;
  line-height:1.2;
  max-width:480px;
  color:var(--white);
}
.mbim2-landing .contract-figure{text-align:right;flex-shrink:0;}
.mbim2-landing .contract-figure-num{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;
  font-weight:800;
  font-size:56px;
  line-height:1;
  background:linear-gradient(140deg, #fff, #a9b4ff);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.mbim2-landing .contract-figure-label{
  margin-top:6px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:10.5px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:rgba(255,255,255,0.55);
}

/* línea temporal fina, sin etiquetas dentro de la barra */
.mbim2-landing .contract-timeline{
  display:flex;
  height:6px;
  border-radius:3px;
  background:rgba(255,255,255,0.07);
  overflow:hidden;
}
.mbim2-landing .contract-timeline-seg{
  transform-origin:left center;
  transform:scaleX(1);
}
.mbim2-landing .contract-timeline-seg--work{
  flex:10;
  background:linear-gradient(100deg, var(--blueprint), #5470ff);
}
.mbim2-landing .contract-timeline-seg--intern{
  flex:6;
  background:linear-gradient(100deg, #7c3aed, #9a7bff);
}
.mbim2-landing .contract-timeline-labels{
  display:flex;
  justify-content:space-between;
  gap:24px;
  margin-top:18px;
  flex-wrap:wrap;
}
.mbim2-landing .contract-timeline-label{max-width:340px;}
.mbim2-landing .contract-timeline-label .phase{
  display:block;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11px;
  letter-spacing:0.06em;
  margin-bottom:6px;
}
.mbim2-landing .contract-timeline-label--work .phase{color:var(--blueprint-light);}
.mbim2-landing .contract-timeline-label--intern .phase{color:#c3b3ff;}
.mbim2-landing .contract-timeline-label p{
  font-size:14px;
  line-height:1.5;
  color:rgba(255,255,255,0.78);
}
.mbim2-landing .contract-timeline-label p b{color:var(--white);font-weight:600;}

/* --- el día partido: filas, no tarjetas --- */
.mbim2-landing .day-rows{
  margin-top:44px;
  border-top:1px solid rgba(3,7,18,0.09);
}
.mbim2-landing .day-row{
  display:grid;
  grid-template-columns:120px 1fr;
  gap:28px;
  padding:26px 0;
  border-bottom:1px solid rgba(3,7,18,0.09);
  transition:padding-left .3s ease;
}
.mbim2-landing .day-row:hover{padding-left:8px;}
.mbim2-landing .day-row-time{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:13px;
  color:var(--blueprint);
}
.mbim2-landing .day-row-body h3{
  font-family:var(--font-bricolage, var(--font-space-grotesk)), sans-serif;
  font-weight:700;
  font-size:21px;
}
.mbim2-landing .day-row-body p{
  margin-top:8px;
  max-width:600px;
  font-size:14.6px;
  line-height:1.6;
  color:#3A424B;
}
.mbim2-landing .day-row-body p b{color:var(--ink);font-weight:600;}

@media(max-width:820px){
  .mbim2-landing .metodologia-head h2{font-size:31px;}
  .mbim2-landing .contract-block-head{flex-direction:column;}
  .mbim2-landing .contract-figure{text-align:left;}
  .mbim2-landing .day-row{grid-template-columns:1fr;gap:8px;}
}

/* ---------- IA — sección editorial clara (rediseño 2026-09-09) ----------
   Antes era un bloque .ai-section --ink (negro) con vocabulario mono y
   retícula técnica — el cliente lo pidió explícitamente "editorial y
   elegante, NO técnica ni robotizada", y fuera del fondo negro: es la
   única sección "fría" del sitio (degradado azulado-violeta), no oscura.
   Reutiliza los tokens de marca ya existentes (--blueprint/--signal/
   --paper) y el mismo truco de manchas radiales con color-mix() que ya usa
   .problema-aura, solo que con blur(2px) — mucho más sutil — y en grupo de
   tres, cada una animada con su propio ritmo. */
.mbim2-landing .ai-section{
  position:relative;
  overflow:hidden;
  padding:86px 64px 78px;
  background:linear-gradient(175deg, #fbfaf7 0%, #f2f2f8 48%, #eaeaf6 100%);
  color:var(--ink);
  border-bottom:1px solid var(--line);
}
.mbim2-landing .ai-section .wrap{padding:0;position:relative;z-index:1;}

/* manchas orgánicas de fondo — decorativas, nunca capturan el puntero */
.mbim2-landing .ai-blob{
  position:absolute;
  border-radius:50%;
  filter:blur(2px);
  pointer-events:none;
  z-index:0;
}
.mbim2-landing .ai-blob--1{
  width:560px;height:560px;
  right:-170px;top:-210px;
  /* violeta: mismo #7c3aed ya usado en esta página como acento de IA/
     prácticas (contract-timeline-seg--intern, problema-grad) */
  background:radial-gradient(circle, color-mix(in oklab, #7c3aed 16%, transparent) 0%, transparent 70%);
}
.mbim2-landing .ai-blob--2{
  width:460px;height:460px;
  left:-180px;bottom:-190px;
  background:radial-gradient(circle, color-mix(in oklab, var(--blueprint) 13%, transparent) 0%, transparent 70%);
}
.mbim2-landing .ai-blob--3{
  width:300px;height:300px;
  left:44%;top:24%;
  background:radial-gradient(circle, color-mix(in oklab, var(--paper) 70%, transparent) 0%, transparent 70%);
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .ai-blob--1{animation:mbim2-ai-float-a 19s ease-in-out infinite alternate;}
  .mbim2-landing .ai-blob--2{animation:mbim2-ai-float-b 22s ease-in-out infinite alternate;}
  .mbim2-landing .ai-blob--3{animation:mbim2-ai-float-a 27s ease-in-out infinite alternate;}
}
@keyframes mbim2-ai-float-a{
  0%{transform:translate(0,0) scale(1);}
  100%{transform:translate(-24px,20px) scale(1.07);}
}
@keyframes mbim2-ai-float-b{
  0%{transform:translate(0,0) scale(1);}
  100%{transform:translate(24px,-20px) scale(1.07);}
}

/* ---------- cabecera ---------- */
.mbim2-landing .ai-eyebrow{
  display:flex;
  align-items:center;
  gap:12px;
  font-size:12.5px;
  letter-spacing:0.14em;
  text-transform:uppercase;
  font-weight:500;
  color:color-mix(in oklab, var(--signal) 75%, transparent);
  margin-bottom:18px;
}
.mbim2-landing .ai-eyebrow::before{
  content:"";
  width:30px;height:1px;
  background:color-mix(in oklab, var(--signal) 50%, transparent);
}
.mbim2-landing .ai-title{
  font-weight:700;
  font-size:50px;
  line-height:1.06;
  letter-spacing:-0.025em;
  max-width:740px;
  color:var(--ink);
}
.mbim2-landing .ai-title em{
  font-style:italic;
  font-weight:600;
  background:linear-gradient(100deg, var(--signal), #7c3aed);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.mbim2-landing .ai-lede{
  margin-top:20px;
  max-width:620px;
  font-size:18px;
  line-height:1.7;
  color:#3A424B;
}
.mbim2-landing .ai-lede b{color:var(--ink);font-weight:600;}
.mbim2-landing .ai-quote{
  margin-top:20px;
  margin-bottom:64px;
  max-width:560px;
  padding-left:16px;
  border-left:2px solid color-mix(in oklab, var(--blueprint) 28%, transparent);
  font-size:13.5px;
  font-style:italic;
  color:var(--dim);
}

/* ---------- las 3 capacidades — columnas editoriales, sin tarjetas ---------- */
.mbim2-landing .ai-capabilities{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:0;
  margin-bottom:76px;
}
.mbim2-landing .ai-cap{
  position:relative;
  padding:0 34px;
}
.mbim2-landing .ai-cap:first-child{padding-left:0;}
.mbim2-landing .ai-cap:last-child{padding-right:0;}
.mbim2-landing .ai-cap:not(:first-child)::before{
  content:"";
  position:absolute;
  left:0;top:8px;bottom:8px;
  width:1px;
  background:linear-gradient(180deg,
    transparent,
    color-mix(in oklab, var(--blueprint) 20%, transparent) 22%,
    color-mix(in oklab, var(--blueprint) 20%, transparent) 78%,
    transparent);
}
.mbim2-landing .ai-cap-num{
  font-family:var(--font-space-grotesk), sans-serif;
  font-size:46px;
  font-weight:700;
  line-height:1;
  margin-bottom:14px;
  background:linear-gradient(160deg,
    color-mix(in oklab, var(--blueprint) 90%, transparent),
    color-mix(in oklab, #7c3aed 35%, transparent));
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.mbim2-landing .ai-cap h3{
  font-size:20px;
  font-weight:700;
  line-height:1.3;
  margin-bottom:10px;
  color:var(--ink);
}
.mbim2-landing .ai-cap p{
  font-size:14.6px;
  line-height:1.65;
  color:#3A424B;
}

/* ---------- cabecera del toolkit ---------- */
.mbim2-landing .ai-toolkit-head{
  display:flex;
  align-items:baseline;
  gap:16px;
  margin-bottom:34px;
}
.mbim2-landing .ai-toolkit-head h3{
  font-size:24px;
  font-weight:700;
  white-space:nowrap;
  color:var(--ink);
}
.mbim2-landing .ai-toolkit-line{
  flex:1;
  height:1px;
  background:linear-gradient(90deg, color-mix(in oklab, var(--blueprint) 28%, transparent), transparent);
}

/* ---------- el toolkit — 4 columnas, sin cajas ---------- */
.mbim2-landing .ai-toolwall{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:40px 34px;
}
.mbim2-landing .ai-toolcol-label{
  position:relative;
  display:block;
  padding-bottom:12px;
  margin-bottom:16px;
  font-size:11.5px;
  letter-spacing:0.12em;
  text-transform:uppercase;
  font-weight:500;
  color:color-mix(in oklab, var(--signal) 70%, transparent);
}
.mbim2-landing .ai-toolcol-underline{
  position:absolute;
  left:0;bottom:0;
  width:100%;height:2px;
  background:linear-gradient(90deg, var(--blueprint), color-mix(in oklab, #7c3aed 15%, transparent));
  /* ya trazado por defecto (scaleX:1) — si GSAP no llega a cargar
     (movimiento reducido), el subrayado se ve completo desde el primer
     render, mismo criterio que .summit-progress/.step-accent. */
  transform:scaleX(1);
  transform-origin:left center;
}
.mbim2-landing .ai-toolcol ul{list-style:none;margin:0;padding:0;}
.mbim2-landing .ai-toolcol li{
  font-size:14.4px;
  line-height:1.55;
  padding:11px 0;
  border-bottom:1px solid color-mix(in oklab, var(--blueprint) 9%, transparent);
  color:#3A424B;
  transition:color .25s ease, padding-left .25s ease;
}
.mbim2-landing .ai-toolcol li:last-child{border-bottom:none;}
.mbim2-landing .ai-toolcol li:hover{
  color:var(--signal);
  padding-left:6px;
}
.mbim2-landing .ai-toolcol li b{color:var(--ink);font-weight:600;}

@media(max-width:980px){
  .mbim2-landing .ai-capabilities{grid-template-columns:1fr;gap:38px;}
  .mbim2-landing .ai-cap{padding:0;}
  .mbim2-landing .ai-cap::before{display:none;}
  .mbim2-landing .ai-toolwall{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:640px){
  .mbim2-landing .ai-section{padding:60px 28px 56px;}
  .mbim2-landing .ai-title{font-size:33px;}
  .mbim2-landing .ai-toolwall{grid-template-columns:1fr;}
}

/* ---------- Programa — mapa visual, sin acordeón (rediseño 2026-09-09) ----
   Antes era una lista de 9 filas plegables (acordeón + botón "+" + caja
   blanca contenedora) — el cliente lo pidió explícitamente fuera: todo el
   temario a la vista de golpe, como un mapa, con el módulo de IA (07)
   destacado como pieza diferencial en vez de ser una fila más. */
.mbim2-landing .programa-bg-grid{
  opacity:0.28;
  -webkit-mask-image:radial-gradient(ellipse 75% 60% at 50% 0%, black 0%, transparent 78%);
  mask-image:radial-gradient(ellipse 75% 60% at 50% 0%, black 0%, transparent 78%);
}

.mbim2-landing .programa-eyebrow{
  display:flex;
  align-items:center;
  gap:12px;
  font-size:12.5px;
  letter-spacing:0.14em;
  text-transform:uppercase;
  font-weight:500;
  color:color-mix(in oklab, var(--signal) 78%, transparent);
  margin-bottom:18px;
}
.mbim2-landing .programa-eyebrow::before{
  content:"";
  width:30px;height:1px;
  background:color-mix(in oklab, var(--signal) 50%, transparent);
}
.mbim2-landing .programa-title{
  font-weight:700;
  font-size:44px;
  line-height:1.07;
  letter-spacing:-0.022em;
  max-width:720px;
  color:var(--ink);
}
.mbim2-landing .programa-title-accent{
  background:linear-gradient(100deg, var(--signal), #7c3aed);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.mbim2-landing .programa-lede{
  margin-top:20px;
  margin-bottom:46px;
  max-width:600px;
  font-size:16.5px;
  line-height:1.68;
  color:#3A424B;
}

/* ---------- rail de 4 fases ---------- */
.mbim2-landing .programa-rail{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:0;
  margin-bottom:16px;
}
.mbim2-landing .programa-phase{padding-right:20px;}
.mbim2-landing .programa-phase-label{
  font-size:11px;
  letter-spacing:0.11em;
  text-transform:uppercase;
  font-weight:500;
  color:var(--dim);
  margin-bottom:10px;
}
.mbim2-landing .programa-phase-bar{
  height:3px;
  border-radius:2px;
  /* ya trazada por defecto (scaleX:1) — si GSAP no llega a cargar
     (movimiento reducido), se ve completa desde el primer render, mismo
     criterio que .summit-progress/.step-accent. */
  transform:scaleX(1);
  transform-origin:left center;
}
.mbim2-landing .programa-rail .programa-phase:nth-child(1) .programa-phase-bar{background:linear-gradient(90deg, #7fa0ff, #5470ff);}
.mbim2-landing .programa-rail .programa-phase:nth-child(2) .programa-phase-bar{background:linear-gradient(90deg, #5470ff, var(--blueprint));}
.mbim2-landing .programa-rail .programa-phase:nth-child(3) .programa-phase-bar{background:linear-gradient(90deg, var(--blueprint), #7c3aed);}
.mbim2-landing .programa-rail .programa-phase:nth-child(4) .programa-phase-bar{background:linear-gradient(90deg, #7c3aed, #b9a4ff);}

/* ---------- grid de 9 módulos ---------- */
.mbim2-landing .programa-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;
}
.mbim2-landing .programa-card{
  position:relative;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  min-height:150px;
  padding:20px 20px 18px;
  border-radius:14px;
  background:color-mix(in oklab, var(--white) 62%, transparent);
  backdrop-filter:blur(8px);
  border:1px solid rgba(3,7,18,0.08);
  transition:
    transform .3s var(--ease-out-quart, ease),
    box-shadow .3s var(--ease-out-quart, ease),
    border-color .3s var(--ease-out-quart, ease);
}
.mbim2-landing .programa-card-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:12px;
}
.mbim2-landing .programa-card-idx{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11px;
  color:var(--blueprint);
}
.mbim2-landing .programa-card-ects{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:10.5px;
  color:var(--blueprint);
  background:color-mix(in oklab, var(--blueprint) 10%, transparent);
  border:1px solid color-mix(in oklab, var(--blueprint) 18%, transparent);
  padding:3px 8px;
  border-radius:5px;
}
.mbim2-landing .programa-card h3{
  font-family:var(--font-space-grotesk), sans-serif;
  font-weight:700;
  font-size:16px;
  line-height:1.32;
}
.mbim2-landing .programa-card-subtitle{
  margin-top:4px;
  font-size:12.5px;
  color:var(--dim);
}
.mbim2-landing .programa-card-hours{
  margin-top:auto;
  padding-top:12px;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:11px;
  color:#B7BEC7;
}
.mbim2-landing .programa-card-num{
  position:absolute;
  right:12px;bottom:2px;
  font-family:var(--font-space-grotesk), sans-serif;
  font-size:62px;
  font-weight:800;
  line-height:1;
  color:color-mix(in oklab, var(--blueprint) 7%, transparent);
  pointer-events:none;
  transition:color .3s var(--ease-out-quart, ease), transform .3s var(--ease-out-quart, ease);
}
.mbim2-landing .programa-card:hover{
  transform:translateY(-5px);
  /* rgba(0,108,255,…) = var(--color-brand) en rgb — mismo patrón ya usado
     en .kicker-dot para un box-shadow con color de marca. */
  box-shadow:0 16px 38px rgba(0,108,255,0.14);
  border-color:color-mix(in oklab, var(--blueprint) 30%, transparent);
}
.mbim2-landing .programa-card:hover .programa-card-num{
  color:color-mix(in oklab, var(--blueprint) 13%, transparent);
  transform:translateY(-3px);
}

/* --- tarjeta destacada: módulo 07, IA Aplicada al Sector AEC --- */
.mbim2-landing .programa-card--flagship{
  grid-column:span 2;
  background:linear-gradient(150deg, #151822, #0c0e14);
  color:var(--white);
  border-color:rgba(0,108,255,0.28);
  box-shadow:0 20px 50px rgba(0,108,255,0.2);
}
.mbim2-landing .programa-card--flagship::before{
  content:"";
  position:absolute;
  top:0;left:0;right:0;
  height:2px;
  /* mismo degradado + keyframe que .compare-new::after (bloque de la
     comparativa MBIM 2.0) — no se redefine el keyframe, se reutiliza
     mbim2-accent-shift tal cual. */
  background:linear-gradient(90deg, var(--blueprint), #7c3aed, var(--secondary, #ffba08), var(--blueprint));
  background-size:200% 100%;
}
@media(prefers-reduced-motion:no-preference){
  .mbim2-landing .programa-card--flagship::before{animation:mbim2-accent-shift 4.5s linear infinite;}
}
.mbim2-landing .programa-card--flagship::after{
  content:"";
  position:absolute;
  top:-60px;right:-60px;
  width:280px;height:280px;
  border-radius:50%;
  background:radial-gradient(circle, color-mix(in oklab, #7c3aed 30%, transparent) 0%, transparent 70%);
  pointer-events:none;
}
.mbim2-landing .programa-flagship-badge{
  align-self:flex-start;
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:9px;
  letter-spacing:0.09em;
  text-transform:uppercase;
  padding:4px 9px;
  border-radius:5px;
  background:linear-gradient(100deg, var(--blueprint), #7c3aed);
  color:var(--white);
  margin-bottom:12px;
}
.mbim2-landing .programa-card--flagship .programa-card-idx,
.mbim2-landing .programa-card--flagship .programa-card-hours{color:rgba(255,255,255,0.55);}
.mbim2-landing .programa-card--flagship .programa-card-ects{
  color:var(--blueprint-light);
  background:rgba(255,255,255,0.08);
  border-color:rgba(255,255,255,0.22);
}
.mbim2-landing .programa-card--flagship h3{font-size:20px;color:var(--white);}
.mbim2-landing .programa-card--flagship .programa-card-subtitle{color:rgba(255,255,255,0.68);}
.mbim2-landing .programa-card--flagship .programa-card-num{color:rgba(255,255,255,0.06);}
.mbim2-landing .programa-card--flagship:hover{
  box-shadow:0 26px 60px rgba(0,108,255,0.28);
  border-color:rgba(0,108,255,0.4);
}
.mbim2-landing .programa-card--flagship:hover .programa-card-num{color:rgba(255,255,255,0.1);}

/* ---------- franja inferior: total + reparto ---------- */
.mbim2-landing .programa-summary{
  margin-top:22px;
  padding-top:20px;
  border-top:1px solid rgba(3,7,18,0.09);
  display:flex;
  align-items:center;
  justify-content:space-between;
  flex-wrap:wrap;
  gap:16px;
}
.mbim2-landing .programa-summary-total{
  font-family:var(--font-space-grotesk), sans-serif;
  font-size:15px;
  color:var(--ink);
}
.mbim2-landing .programa-summary-total b{
  font-size:26px;
  font-weight:700;
}
.mbim2-landing .programa-summary-breakdown{
  display:flex;
  flex-wrap:wrap;
  gap:22px;
}
.mbim2-landing .programa-summary-item{
  display:flex;
  align-items:center;
  gap:8px;
  font-size:12.5px;
  color:#3A424B;
}
.mbim2-landing .programa-summary-dot{
  width:9px;height:9px;
  border-radius:3px;
  flex-shrink:0;
}

/* CTA secundario tras el mapa de módulos — enlace real a Calendly
   (/contact-page?motivo=asesoria), no un botón pesado: aquí el visitante
   ya ha visto el temario completo, así que basta una salida discreta para
   quien prefiere que se lo expliquen antes de decidir. 2026-09-09. */
.mbim2-landing .programa-cta-row{
  margin-top:28px;
  padding-top:22px;
  border-top:1px solid rgba(3,7,18,0.09);
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  flex-wrap:wrap;
  text-align:center;
}
.mbim2-landing .programa-cta-row p{
  font-size:14px;
  color:#3A424B;
}
.mbim2-landing .programa-cta-link{
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-size:14px;
  font-weight:600;
  color:var(--blueprint);
  text-decoration:none;
  border-bottom:1px solid color-mix(in oklab, var(--blueprint) 30%, transparent);
  padding-bottom:2px;
  transition:color .2s var(--ease-out-quart, ease), border-color .2s var(--ease-out-quart, ease), gap .2s var(--ease-out-quart, ease);
}
.mbim2-landing .programa-cta-link:hover{
  color:var(--signal);
  border-color:var(--signal);
  gap:10px;
}

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

/* ---------- Secciones 6-11 — puestas al día de estética (2026-09-09) ----
   Antes eran rejillas planas con divisores en línea fina (borde + fondo de
   1px imitando líneas) — el mismo lenguaje "documento técnico" con el que
   arrancó esta página, pero ya superado por el tratamiento de las
   secciones más recientes (Programa, IA): tarjeta de cristal con blur,
   radio de 14px, elevación al hover y números decorativos de fondo.
   .glass-card y .editorial-eyebrow son la base compartida que ponen estas
   6 secciones al mismo nivel, sin reescribir .programa-card (que ya tenía
   exactamente esta receta) ni las tres secciones anteriores (que ya
   tienen su propio eyebrow — .kicker-pill, .problema-eyebrow,
   .metodologia-eyebrow, con la misma altura visual). */
.mbim2-landing .editorial-eyebrow{
  display:flex;
  align-items:center;
  gap:12px;
  font-size:12.5px;
  letter-spacing:0.14em;
  text-transform:uppercase;
  font-weight:500;
  color:color-mix(in oklab, var(--signal) 76%, transparent);
  margin-bottom:18px;
}
.mbim2-landing .editorial-eyebrow::before{
  content:"";
  width:30px;height:1px;
  background:color-mix(in oklab, var(--signal) 50%, transparent);
}

.mbim2-landing .glass-card{
  position:relative;
  overflow:hidden;
  border-radius:14px;
  background:color-mix(in oklab, var(--white) 62%, transparent);
  backdrop-filter:blur(8px);
  border:1px solid rgba(3,7,18,0.08);
  transition:
    transform .3s var(--ease-out-quart, ease),
    box-shadow .3s var(--ease-out-quart, ease),
    border-color .3s var(--ease-out-quart, ease);
}
.mbim2-landing .glass-card:hover{
  transform:translateY(-5px);
  /* rgba(0,108,255,…) = var(--color-brand) en rgb, mismo patrón que
     .programa-card:hover y .kicker-dot. */
  box-shadow:0 16px 38px rgba(0,108,255,0.14);
  border-color:color-mix(in oklab, var(--blueprint) 30%, transparent);
}

/* ---------- credentials ---------- */
.mbim2-landing .cred-stack{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
}
.mbim2-landing .cred-card{
  padding:28px 26px 26px;
}
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
.mbim2-landing .cred-card-num{
  position:absolute;
  right:14px;bottom:4px;
  font-family:var(--font-space-grotesk), sans-serif;
  font-size:56px;
  font-weight:800;
  line-height:1;
  color:color-mix(in oklab, var(--blueprint) 7%, transparent);
  pointer-events:none;
}
@media(max-width:820px){
  .mbim2-landing .cred-stack{grid-template-columns:1fr;}
}

.mbim2-landing .profiles{
  margin-top:36px;
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}
.mbim2-landing .profile{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:9px 16px;
  border-radius:999px;
  background:color-mix(in oklab, var(--white) 70%, transparent);
  backdrop-filter:blur(6px);
  border:1px solid rgba(3,7,18,0.08);
  font-size:13px;
  color:var(--ink);
  transition:border-color .25s var(--ease-out-quart, ease), background .25s var(--ease-out-quart, ease), transform .25s var(--ease-out-quart, ease);
}
.mbim2-landing .profile:hover{
  border-color:color-mix(in oklab, var(--blueprint) 30%, transparent);
  background:color-mix(in oklab, var(--blueprint) 6%, var(--white));
  transform:translateY(-2px);
}
.mbim2-landing .profile .tag{
  font-family:var(--font-ibm-plex-mono), monospace;
  font-size:10px;
  color:var(--signal);
  letter-spacing:0.03em;
}

/* ---------- innovation summit timeline ---------- */
.mbim2-landing .summit-line{
  position:relative;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;
}
.mbim2-landing .summit-line::before{
  content:"";
  position:absolute;
  top:11px;left:0;right:0;
  height:1px;
  background:var(--line);
}
.mbim2-landing .summit-card{position:relative;padding:36px 20px 24px;}
.mbim2-landing .summit-card .dot{
  position:absolute;top:6px;left:20px;
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
  .mbim2-landing .summit-line{grid-template-columns:1fr;gap:16px;}
  .mbim2-landing .summit-line::before{display:none;}
}

/* ---------- talent / outcomes ---------- */
.mbim2-landing .outcomes{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;
}
.mbim2-landing .outcome{
  padding:24px 22px 22px;
}
.mbim2-landing .outcome .n{
  font-family:var(--font-space-grotesk), sans-serif;
  font-size:32px;
  font-weight:700;
  /* mismo degradado azul→violeta que .programa-title-accent/.ai-cap-num —
     eco deliberado, no un tercer degradado inventado. */
  background:linear-gradient(160deg, color-mix(in oklab, var(--blueprint) 90%, transparent), color-mix(in oklab, #7c3aed 35%, transparent));
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.mbim2-landing .outcome p{font-size:14px;color:#3A424B;margin-top:8px;}
@media(max-width:760px){.mbim2-landing .outcomes{grid-template-columns:repeat(2,1fr);}}

/* ---------- testimonials ---------- */
.mbim2-landing .testimonials{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
}
.mbim2-landing .testimonial{
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
  gap:14px;
  margin-bottom:48px;
}
.mbim2-landing .step{
  padding:28px 24px;
}
.mbim2-landing .step .n{
  font-family:var(--font-ibm-plex-mono), monospace;
  color:var(--blueprint);
  font-size:13px;
}
.mbim2-landing .step h4{font-size:17px;margin-top:10px;margin-bottom:8px;}
.mbim2-landing .step p{font-size:14px;color:#3A424B;}
@media(max-width:760px){
  .mbim2-landing .steps{grid-template-columns:1fr;}
}

/* CTA alternativo bajo los 3 pasos: para quien no quiere reservar plaza
   todavía sin hablar antes con alguien — mismo destino de Calendly que el
   resto de "sesión informativa" de la página, 2026-09-09. */
.mbim2-landing .admision-alt-cta{
  margin-top:28px;
  padding-top:24px;
  border-top:1px solid var(--line);
  display:flex;
  align-items:center;
  justify-content:center;
  gap:18px;
  flex-wrap:wrap;
  text-align:center;
}
.mbim2-landing .admision-alt-cta p{
  font-size:14.5px;
  color:#3A424B;
}

/* ---------- agenda: Calendly embebido, nunca un enlace de salida ----------
   Pedido explícito del cliente (2026-09-09): el enlace a Calendly que ya
   funciona en /contact-page se trae aquí embebido de verdad (mismo src),
   y los 3 CTA de "sesión informativa" de esta página (hero, programa,
   admisión) dejan de abrir /contact-page en pestaña nueva — ahora anclan a
   esta sección con #agenda, igual que el resto de CTAs internos de la
   página. Nadie sale de /landing por ningún botón. */
.mbim2-landing .agenda-embed{
  position:relative;
  width:100%;
  height:650px;
  border-radius:16px;
  overflow:hidden;
  border:1px solid var(--line);
  background:var(--white);
  box-shadow:0 24px 60px -30px rgba(3,7,18,0.25);
}
.mbim2-landing .agenda-embed iframe{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  border:0;
}
@media(max-width:640px){
  .mbim2-landing .agenda-embed{height:720px;border-radius:12px;}
}

/* ---------- CTA final ---------- */
.mbim2-landing .cta-final{
  position:relative;
  overflow:hidden;
  background:var(--blueprint);
  color:var(--white);
  padding:80px 0;
  text-align:left;
}
.mbim2-landing .cta-final::before{
  content:"";
  position:absolute;
  inset:0;
  /* misma retícula técnica en blanco translúcido que ya usa .compare-new,
     reutilizada como textura de fondo — no un motivo nuevo. */
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size:32px 32px;
  pointer-events:none;
}
.mbim2-landing .cta-final::after{
  content:"";
  position:absolute;
  top:-140px;right:-100px;
  width:440px;height:440px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%);
  pointer-events:none;
}
.mbim2-landing .cta-final .wrap{position:relative;z-index:1;}
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

@media(prefers-reduced-motion:reduce){
  .mbim2-landing .btn-arrow-icon{
    transition:none !important;
    transform:none !important;
  }
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
    // Descripción real, reutilizada tal cual de la propia sección de IA
    // de esta landing (asistentes documentales propios / imagen y vídeo
    // fotorrealista / agentes sobre el modelo BIM) — sustituye a la nota
    // de redacción sin terminar que había antes ("Ver sección dedicada
    // arriba ↑…", con nombres de herramienta no confirmados y una
    // atribución a L35 que ya se retiró de la sección de IA).
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

// Ventanas iluminadas de la torre principal del edificio 3D del hero —
// posiciones relativas a la cara frontal (90×300px), encendido escalonado
// 1.1s-2s tal como pide el mockup.
const HERO_WINDOWS = [
  { top: 30, left: 14, delay: "1.1s" },
  { top: 30, left: 56, delay: "1.25s" },
  { top: 78, left: 14, delay: "1.4s" },
  { top: 78, left: 56, delay: "1.55s" },
  { top: 126, left: 14, delay: "1.7s" },
  { top: 126, left: 56, delay: "1.85s" },
  { top: 174, left: 35, delay: "2s" },
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
  // Hero: foco que sigue al cursor sobre el fondo de retícula técnica, más
  // un parallax sutil de esa misma retícula. El <h1> no se toca aquí — su
  // revelado sigue siendo 100% CSS (.hero-line/.hero-fade), fuera de este
  // hook, para no comprometer el LCP.
  const heroRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    // El foco vive solo en la columna izquierda (data-spotlight) desde el
    // rediseño a dos columnas (2026-09-08) — el listener y el cálculo de
    // posición se atan al propio elemento, no a `scope` (el hero entero,
    // que ahora incluye el panel oscuro de la derecha), para que el %
    // se calcule sobre el ancho real de la columna, no del hero completo.
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

    const grids = scope.querySelectorAll(".grid-bg")
    if (grids.length) {
      gsap.to(grids, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
      })
    }

    gsap.from(scope.querySelectorAll(".hero-chip"), {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.6,
      delay: 0.6,
    })

    // Edificio 3D: los 4 volúmenes + el mástil entran escalonados
    // (delays ~0.1s-0.58s, el mockup pide 0.1s-0.55s). Nunca se anima
    // `transform`/`rotate` aquí: cada .b3d-box ya usa `left/bottom` para
    // su posición (no `transform`), así que animar opacity/y en GSAP no
    // pelea con nada — a diferencia de las tarjetas, más abajo.
    gsap.from(scope.querySelectorAll(".b3d-box, .hero-mast"), {
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.6,
      delay: 0.1,
    })

    // Tarjetas flotantes: SOLO se anima `opacity` en GSAP, nunca
    // `transform` — cada tarjeta ya tiene una animación CSS continua
    // (flotación + inclinación 3D) sobre `transform`, y una animación CSS
    // activa siempre gana a cualquier valor de `transform` normal
    // (incluido uno puesto por GSAP), así que intentar animar y/scale/
    // rotate aquí quedaría invisible. `animation-fill-mode:backwards` (CSS)
    // ya deja la tarjeta en su pose de reposo durante el delay inicial.
    gsap.from(scope.querySelectorAll(".hero-float-card"), {
      opacity: 0,
      stagger: 0.2,
      duration: 0.5,
      delay: 1.3,
    })

    // Barra de plazas: por defecto ya dibujada hasta el ratio real
    // (23/30 → 77%, confirmado por el cliente) para que se vea completa si
    // GSAP no llega a correr; aquí se reinicia a 0 y se redibuja al
    // montar, mismo mecanismo que .summit-progress más abajo en la página.
    const seatFill = scope.querySelector(".seat-bar-fill")
    if (seatFill) {
      gsap.set(seatFill, { scaleX: 0 })
      gsap.to(seatFill, {
        scaleX: 23 / 30,
        duration: 1,
        ease: "power2.out",
        delay: 1.6,
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

    // Rediseño de la comparativa (2026-09-08): toda la coreografía se
    // dispara al entrar la sección en pantalla (ScrollTrigger, once),
    // nunca al cargar la página — pedido explícito. El filtro
    // saturate(.5)/scale(.97) del panel izquierdo ya es una propiedad CSS
    // estática (no un scrub de scroll como en la versión anterior).
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

    // Línea de tachado sobre "2019": por defecto ya trazada (CSS), aquí se
    // reinicia a 0 y se redibuja, mismo mecanismo que .summit-progress.
    const strikeLine = scope.querySelector(".problema-strike-line")
    if (strikeLine) {
      gsap.set(strikeLine, { scaleX: 0 })
      gsap.to(strikeLine, {
        scaleX: 1,
        duration: 1,
        ease: "expo.out", // --ease-out-expo, cubic-bezier(.16,1,.3,1)
        delay: 0.5,
        scrollTrigger: compareTrigger,
      })
    }

    // Filas del panel izquierdo: fade + translateY, delays .35/.45/.55/.65.
    // clearProps:"transform" al terminar — si no, el transform inline que
    // deja GSAP le ganaría para siempre al `:hover{transform:translateX()}`
    // de .compare-row.
    gsap.from(scope.querySelectorAll(".compare-old .compare-row"), {
      opacity: 0,
      y: 10,
      stagger: 0.1,
      duration: 0.5,
      delay: 0.35,
      clearProps: "transform",
      scrollTrigger: compareTrigger,
    })

    // Filas del panel derecho: delays .5/.62/.74/.86.
    gsap.from(scope.querySelectorAll(".compare-new .compare-row"), {
      opacity: 0,
      y: 10,
      stagger: 0.12,
      duration: 0.5,
      delay: 0.5,
      clearProps: "transform",
      scrollTrigger: compareTrigger,
    })

    // Barras de acento verticales de cada fila del panel derecho: se
    // dibujan con scaleY 0→1, delays .7/.82/.94/1.06 — por defecto ya
    // trazadas (CSS, scaleY:1), aquí se reinician a 0 y se redibujan.
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
    // Rediseño (2026-09-08): toda la coreografía comparte un único
    // ScrollTrigger (la sección completa, "once"), con los delays exactos
    // pedidos — dispara al entrar en pantalla, no al cargar la página.
    const trigger = { trigger: scope, start: "top 75%", once: true }

    // Bloque del contrato: fade + translateY(16px).
    gsap.from(scope.querySelectorAll(".contract-block"), {
      opacity: 0,
      y: 16,
      duration: 0.75,
      ease: "expo.out", // --ease-out-expo, cubic-bezier(.16,1,.3,1)
      delay: 0.25,
      scrollTrigger: trigger,
    })

    // Subrayado degradado bajo "Cobras mientras lo haces.": por defecto ya
    // trazado (CSS, scaleX:1); aquí se reinicia a 0 y se redibuja, mismo
    // mecanismo que .problema-strike-line más arriba en la página.
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

    // Los 2 segmentos de la línea temporal: por defecto ya trazados (CSS,
    // scaleX:1); se reinician a 0 y se redibujan en secuencia.
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

    // Los 2 bloques de texto bajo la línea temporal: fade + translateY,
    // delays 1.25s / 1.37s.
    gsap.from(scope.querySelectorAll(".contract-timeline-label"), {
      opacity: 0,
      y: 10,
      stagger: 0.12,
      duration: 0.5,
      delay: 1.25,
      scrollTrigger: trigger,
    })

    // Las 2 filas del día partido: fade + translateY, delays 1.5s / 1.62s.
    // clearProps:"transform" al terminar — si no, el transform inline que
    // deja GSAP le ganaría para siempre al hover (padding-left, no
    // transform, en este caso — pero se mantiene el mismo criterio de
    // limpieza que en el resto de la página por consistencia).
    gsap.from(scope.querySelectorAll(".day-row"), {
      opacity: 0,
      y: 10,
      stagger: 0.12,
      duration: 0.5,
      delay: 1.5,
      scrollTrigger: trigger,
    })
  })

  // IA — rediseño editorial (2026-09-09): ya no hay revelado carácter a
  // carácter (era parte del vocabulario "técnico" que se pidió retirar).
  // Una única coreografía con los delays exactos pedidos: las 3
  // capacidades entran primero, luego la cabecera del toolkit, luego las
  // 4 columnas, y por último el subrayado de cada etiqueta se dibuja.
  const iaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const trigger = { trigger: scope, start: "top 75%", once: true }

    gsap.from(scope.querySelectorAll(".ai-cap"), {
      opacity: 0,
      y: 18,
      duration: 0.8,
      ease: "expo.out", // --ease-out-expo, cubic-bezier(.16,1,.3,1)
      delay: 0.2,
      stagger: 0.15, // delays reales: .2 / .35 / .5
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
      stagger: 0.1, // delays reales: .7 / .8 / .9 / 1
      scrollTrigger: trigger,
    })

    const underlines = scope.querySelectorAll(".ai-toolcol-underline")
    gsap.set(underlines, { scaleX: 0 })
    gsap.to(underlines, {
      scaleX: 1,
      duration: 0.8,
      ease: "expo.out",
      delay: 1.1,
      stagger: 0.1, // delays reales: 1.1 / 1.2 / 1.3 / 1.4
      scrollTrigger: trigger,
    })
  })

  // Programa — mapa visual (2026-09-09): una única coreografía con los
  // delays exactos pedidos — el rail de fases entra primero (bloque, luego
  // su barra se dibuja), después las 9 tarjetas del grid, y por último la
  // franja de total/reparto.
  const programaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    const trigger = { trigger: scope, start: "top 75%", once: true }

    gsap.from(scope.querySelectorAll(".programa-phase"), {
      opacity: 0,
      y: 12,
      duration: 0.5,
      delay: 0.15,
      stagger: 0.1, // delays reales: .15 / .25 / .35 / .45
      scrollTrigger: trigger,
    })

    const bars = scope.querySelectorAll(".programa-phase-bar")
    gsap.set(bars, { scaleX: 0 })
    gsap.to(bars, {
      scaleX: 1,
      duration: 0.8,
      ease: "expo.out", // --ease-out-expo, cubic-bezier(.16,1,.3,1)
      delay: 0.5,
      stagger: 0.12, // delays reales: .5 / .62 / .74 / .86
      scrollTrigger: trigger,
    })

    gsap.from(scope.querySelectorAll(".programa-card"), {
      opacity: 0,
      y: 12,
      duration: 0.5,
      delay: 0.6,
      stagger: 0.07, // delays reales: .6 → 1.16 en pasos de .07
      // .programa-card tiene su propio transition:transform para el
      // hover — sin limpiar el inline transform que deja GSAP, se queda
      // congelada a mitad de camino (mismo bug que .cred-card, ver
      // certificacionRef).
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
  // convenio-card.tsx (back.out + stagger) — encaja de forma literal porque
  // el contenido son certificaciones reales.
  const certificacionRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    // clearProps:"transform" es obligatorio aquí: .cred-card es .glass-card,
    // que ya trae su propio `transition:transform` para el hover. Sin
    // limpiar el inline que deja GSAP al terminar, esa transición CSS se
    // pelea con cada frame que GSAP escribe durante el tween — no es solo
    // un jank visual, la tarjeta se queda literalmente congelada a mitad
    // de camino (verificado leyendo el transform computado tras el tween:
    // se quedaba en rotate(-4deg) scale(0.85), el estado de partida, nunca
    // llegaba a rotate(0) scale(1)). Mismo fix aplicado a cualquier tarjeta
    // de esta sesión que sea .glass-card/.programa-card Y además reciba
    // una animación de entrada por GSAP sobre su propio transform.
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
      // .summit-card es .glass-card (transition:transform en :hover) — sin
      // esto, la propia transición CSS se pelea con cada frame que escribe
      // GSAP y la tarjeta se queda a medio animar (visto y corregido en
      // .cred-card/.programa-card, mismo motivo).
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
        clearProps: "transform",
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

  // Agenda: entrada simple de cabecera + marco del iframe — el propio
  // Calendly ya tiene su carga y transiciones internas, no se anima nada
  // dentro del embed.
  const agendaRef = useGsapEffect<HTMLElement>(({ gsap }, scope) => {
    gsap.from(scope.querySelectorAll(".section-head, .agenda-embed"), {
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
            <div className="grid-bg" />
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
                  <a href="#admision" className="btn hero-cta-gradient" data-magnetic>
                    Reservar mi plaza ahora
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
                Agenda una sesión informativa gratuita de 15 min · sin compromiso
              </a>
            </div>
          </div>

          {/* columna derecha: panel oscuro con edificio 3D + tarjetas flotantes */}
          <div className="hero-visual-col">
            <div className="grid-bg" />

            <div className="hero-building-stage" aria-hidden="true">
              <div className="hero-building">
                <div className="hero-building-floor" />

                {/* ala izquierda, altura media, más tenue */}
                <div
                  className="b3d-box b3d-box--dim"
                  style={{
                    ["--bw" as string]: "74px",
                    ["--bh" as string]: "170px",
                    ["--bd" as string]: "60px",
                    left: "-133px",
                    bottom: "0px",
                  }}
                >
                  <div className="b3d-face b3d-face--front" />
                  <div className="b3d-face b3d-face--back" />
                  <div className="b3d-face b3d-face--left" />
                  <div className="b3d-face b3d-face--right" />
                  <div className="b3d-face b3d-face--top" />
                </div>

                {/* podio bajo a la derecha, más tenue */}
                <div
                  className="b3d-box b3d-box--dim"
                  style={{
                    ["--bw" as string]: "82px",
                    ["--bh" as string]: "112px",
                    ["--bd" as string]: "64px",
                    left: "59px",
                    bottom: "0px",
                  }}
                >
                  <div className="b3d-face b3d-face--front" />
                  <div className="b3d-face b3d-face--back" />
                  <div className="b3d-face b3d-face--left" />
                  <div className="b3d-face b3d-face--right" />
                  <div className="b3d-face b3d-face--top" />
                </div>

                {/* torre principal, con ventanas iluminadas en la fachada frontal */}
                <div
                  className="b3d-box"
                  style={{
                    ["--bw" as string]: "90px",
                    ["--bh" as string]: "300px",
                    ["--bd" as string]: "70px",
                    left: "-45px",
                    bottom: "0px",
                  }}
                >
                  <div className="b3d-face b3d-face--front">
                    {HERO_WINDOWS.map((w, i) => (
                      <span
                        key={i}
                        className="hero-window"
                        style={{ top: w.top, left: w.left, animationDelay: w.delay }}
                      />
                    ))}
                  </div>
                  <div className="b3d-face b3d-face--back" />
                  <div className="b3d-face b3d-face--left" />
                  <div className="b3d-face b3d-face--right" />
                  <div className="b3d-face b3d-face--top" />
                </div>

                {/* coronación: retranqueo sobre la torre */}
                <div
                  className="b3d-box"
                  style={{
                    ["--bw" as string]: "60px",
                    ["--bh" as string]: "70px",
                    ["--bd" as string]: "50px",
                    left: "-30px",
                    bottom: "300px",
                  }}
                >
                  <div className="b3d-face b3d-face--front" />
                  <div className="b3d-face b3d-face--back" />
                  <div className="b3d-face b3d-face--left" />
                  <div className="b3d-face b3d-face--right" />
                  <div className="b3d-face b3d-face--top" />
                </div>

                {/* mástil + baliza ámbar */}
                <div className="hero-mast" style={{ bottom: "370px", height: "38px" }} />
                <div className="hero-beacon" style={{ bottom: "406px" }} />
              </div>
            </div>

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
      </section>

      {/* ============ EL PROBLEMA ============ */}
      <section ref={problemaRef}>
        <div className="grid-bg problema-bg-grid" />
        <div className="problema-aura" aria-hidden="true" />
        <div className="corner-mark" />
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
        <div className="grid-bg metodologia-bg-grid" />
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
        </div>
      </section>

      {/* ============ IA — rediseño editorial, fuera del fondo negro ============ */}
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
        </div>
      </section>

      {/* ============ PROGRAMA — mapa visual, sin acordeón ============ */}
      <section id="programa" ref={programaRef}>
        <div className="grid-bg programa-bg-grid" />
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
                <span className="programa-summary-dot" style={{ background: "#7c3aed" }} />6 IA aplicada
              </div>
              <div className="programa-summary-item">
                <span className="programa-summary-dot" style={{ background: "#c4b3ff" }} />9 Talent + TFM
              </div>
            </div>
          </div>

          <div className="programa-cta-row">
            <p>¿Prefieres que te lo expliquemos en una llamada?</p>
            <a href="#agenda" className="programa-cta-link">
              Agendar sesión informativa
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

      {/* ============ TESTIMONIOS ============ */}
      {/* NOTA IDESIE: textos de ejemplo — sustituir por citas reales de antiguos alumnos, con su consentimiento, antes de publicar. */}
      <section id="testimonios" ref={testimoniosRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="editorial-eyebrow">Lo que dicen quienes ya lo han hecho</div>
            <h2>No te lo contamos solo nosotros.</h2>
            <p>Testimonios de ejemplo — a sustituir por citas reales de antiguos alumnos antes de publicar la página.</p>
          </div>
          <div className="testimonials">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial glass-card" key={t.name + t.meta}>
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
              Agendar sesión informativa
              <ArrowRight className="btn-arrow-icon" size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ AGENDA — Calendly embebido, nunca se sale de /landing ============ */}
      <section id="agenda" ref={agendaRef}>
        <div className="wrap">
          <div className="section-head">
            <div className="editorial-eyebrow">Habla con nosotros</div>
            <h2>Agenda tu sesión informativa aquí mismo.</h2>
            <p>
              15 minutos, sin compromiso. Elige el hueco que mejor te venga — el calendario es real, sin salir de
              esta página.
            </p>
          </div>
          <div className="agenda-embed">
            <iframe
              src="https://calendly.com/idesie-info/30min"
              title="Agenda una sesión informativa con IDESIE"
              loading="lazy"
            />
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
