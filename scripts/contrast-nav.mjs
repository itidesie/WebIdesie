/**
 * Contraste del texto del header sobre el cristal.
 *
 * NOTA sobre el :hover — el menu NO cambia de color al pasar por encima. Sobre
 * el cristal en reposo, ni #006cff (2,3:1) ni #0052cc (3,4:1) llegan a AA:
 * mantener el azul obligaria a subir el tinte a 0,84 y perder casi toda la
 * transparencia. El hover se expresa con un lavado `bg-brand/10`, que sube el
 * fondo sin tocar el texto — de ahi la tercera columna.
 *
 * El header flota, asi que por detras le pasan tanto secciones blancas como las
 * bandas gray-950 del M3/M6. Este script dice, para cada opacidad del tinte,
 * que contraste queda en el PEOR caso. Ejecutalo antes de tocar
 * --nav-glass-bg / --nav-glass-bg-scrolled en globals.css.
 *
 *   node scripts/contrast-nav.mjs
 *
 * Minimo exigible: 4,5:1 (WCAG AA para texto normal). El menu es de 14px,
 * incluso en negrita, asi que NO se acoge al umbral de 3:1 de texto grande.
 */
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (a, b) => { const [hi, lo] = [L(a), L(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05) }
const sobre = (tinte, alpha, fondo) => tinte.map((c, i) => alpha * c + (1 - alpha) * fondo[i])

const BLANCO = [255, 255, 255], NEGRO = [0, 0, 0]
const GRAY950 = [3, 7, 18]          // el negro del M3 y el M6
const PAPEL = [242, 237, 228]       // --color-paper, el M4
const FG_CLARO = [55, 65, 81]       // --foreground en tema claro
const FG_OSCURO = [250, 250, 250]   // --foreground en tema oscuro
const BRAND = [0, 108, 255]         // --color-brand, el lavado del :hover
const TINTE_OSCURO = [11, 15, 25]

const ok = v => (v >= 4.5 ? "✓" : "✗")
const f = v => v.toFixed(2).padStart(5)

console.log("\nTEMA CLARO — tinte blanco. Peor caso: seccion oscura por detras.")
console.log("tinte │ texto/negro │ texto/gray-950 │ texto sobre lavado bg-brand/10")
for (const a of [0.55, 0.6, 0.65, 0.7, 0.72, 0.75, 0.8, 0.85, 0.9]) {
  const bg = sobre(BLANCO, a, NEGRO), bg950 = sobre(BLANCO, a, GRAY950)
  const lavado = sobre(BRAND, 0.10, bg)   // el fondo del enlace en :hover
  console.log(` ${a.toFixed(2)} │ ${f(ratio(FG_CLARO, bg))} ${ok(ratio(FG_CLARO, bg))}   │ ${f(ratio(FG_CLARO, bg950))} ${ok(ratio(FG_CLARO, bg950))}      │ ${f(ratio(FG_CLARO, lavado))} ${ok(ratio(FG_CLARO, lavado))}`)
}

console.log("\nTEMA OSCURO — tinte #0b0f19. Peor caso: seccion clara por detras.")
console.log("tinte │ texto/blanco │ texto/papel")
for (const a of [0.5, 0.55, 0.62, 0.7, 0.78, 0.85]) {
  const bgW = sobre(TINTE_OSCURO, a, BLANCO), bgP = sobre(TINTE_OSCURO, a, PAPEL)
  console.log(` ${a.toFixed(2)} │ ${f(ratio(FG_OSCURO, bgW))} ${ok(ratio(FG_OSCURO, bgW))}    │ ${f(ratio(FG_OSCURO, bgP))} ${ok(ratio(FG_OSCURO, bgP))}`)
}

console.log("\nEn uso: claro 0,72 en reposo y 0,85 con scroll · oscuro 0,62 y 0,80.\n")
