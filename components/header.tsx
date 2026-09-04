"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { CartIcon } from "@/components/cart-icon"
import { CartDrawer } from "@/components/cart-drawer"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProgramsOpen, setIsProgramsOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [isConoceIdesieOpen, setIsConoceIdesieOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  // Los tres <DropdownMenu> de escritorio son independientes por defecto en
  // Radix: sin este estado compartido, abrir uno no cierra el anterior y se
  // ven dos paneles de cristal superpuestos a la vez. Cada uno se controla
  // (`open`/`onOpenChange`) contra este único valor.
  const [openDesktopMenu, setOpenDesktopMenu] = useState<"programas" | "recursos" | "conoce" | null>(null)

  useEffect(() => {
    // Umbral corto: el cambio de estado del cristal debe leerse en cuanto el
    // contenido empieza a pasar por debajo, no 100px despues.
    const handleScroll = () => setIsScrolled(window.scrollY > 12)

    // Pasivo: el manejador no llama a preventDefault, y sin la pista el
    // navegador bloquea el hilo de composicion esperando a ver si lo hace.
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (isMobileMenuOpen) {
      setIsProgramsOpen(false)
      setIsResourcesOpen(false)
      setIsConoceIdesieOpen(false)
    }
  }

  return (
    <>
      {/* ── Header flotante de cristal ──────────────────────────────────
          Fila 1 dejó de ser una barra de utilidades de escritorio: Empresas,
          Tienda y Contacto se movieron a los desplegables de Fila 2
          ("RECURSOS Y SERVICIOS" y "CONOCE IDESIE"). Fila 1 se reduce a lo
          que un móvil/tablet necesita para abrir la navegación (logo +
          carrito + botón de hamburguesa) y desaparece por completo a partir
          de `lg` (`lg:hidden` en el propio <header id="top-nav-bar">), que
          es donde Fila 2 ya muestra la navegación completa con
          desplegables — en escritorio grande solo queda esa fila, ninguna
          barra secundaria por encima.

          El `data-menu-open` oculta la pastilla mientras el cajon movil esta
          abierto. No es cosmetico: el cajon la tapa entera, y dejarla
          pintando su `backdrop-filter` debajo significaria desenfocar dos
          capas a pantalla completa en el peor dispositivo posible.

          El porque de cada valor esta en el bloque "HEADER FLOTANTE DE
          CRISTAL" de globals.css. */}
      <div className="glass-nav-shell" data-menu-open={isMobileMenuOpen}>
        <div className="glass-nav" data-scrolled={isScrolled}>
          {/* Fila 1 · solo móvil/tablet (oculta desde `lg`, ver arriba). */}
          <header
            id="top-nav-bar"
            className="flex items-center justify-between px-3 py-1.5 text-foreground md:px-5 md:py-2 lg:hidden"
          >
            {/* OCULTO: selector de idioma ES/EN. No hay i18n en el proyecto todavia,
                los enlaces apuntaban a "#". Restaurar cuando exista la version en ingles.
                Se mantiene el div vacio como espaciador para que justify-between siga
                empujando la nav a la derecha en desktop. */}
            <div className="hidden md:flex space-x-6 text-sm" aria-hidden="true" />

            {/* Logo. Usa `logo_idesie_azul_trim.png`, no el original: ese es un
                lienzo de 464x315 donde la marca solo ocupa 337x117 — el 63% es
                relleno vacio. Al acotar la altura para una barra compacta, ese
                relleno se comia el logo y lo dejaba en 53px de ancho. El
                recortado (343x123) se declara con su tamano real y se dimensiona
                por CSS, asi que el hueco reservado coincide con lo pintado.
                El original sigue en uso en el footer y otras paginas. */}
            <div className="flex items-center text-foreground md:hidden">
              <Link href="/" className="flex items-center rounded-lg px-1 py-1 transition-colors duration-200 hover:bg-foreground/5">
                <Image
                  src="/images/logo_idesie_azul_trim.png"
                  alt="IDESIE Business & Technology School Logo"
                  width={343}
                  height={123}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>

            <div className="flex items-center space-x-2 lg:hidden">
              <CartIcon onClick={() => setIsCartOpen(true)} />
              <Button
                variant="ghost"
                size="icon"
                magnetic
                className="text-foreground hover:bg-foreground/5 rounded-lg transition-all duration-200 hover:scale-105"
                aria-label="Toggle navigation"
                onClick={toggleMobileMenu}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </header>

          {/* Fila 2 · navegacion principal (desktop). La separa de la fila de
              utilidades una linea de pelo y no un borde solido: sobre cristal un
              borde opaco parte la pastilla en dos en vez de articularla. */}
          <div
            id="main-nav-bar"
            className="glass-nav-hairline hidden md:flex items-center justify-between px-4 py-2 md:px-5"
          >
            {/* Logo Section - Fixed smaller size */}
            <Link href="/" className="flex items-center text-foreground">
              <Image
                src="/images/logo_idesie_azul_trim.png"
                alt="IDESIE Business & Technology School Logo"
                width={343}
                height={123}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Navigation - Fixed text size */}
            <nav className="hidden lg:flex space-x-5 font-sans font-bold leading-7 tracking-normal text-foreground text-sm">
              <DropdownMenu open={openDesktopMenu === "programas"} onOpenChange={(isOpen) => setOpenDesktopMenu(isOpen ? "programas" : null)}>
                <DropdownMenuTrigger
                  data-magnetic
                  data-magnetic-strength="0.22"
                  className="flex items-center focus:outline-none rounded-lg px-2.5 py-1.5 transition-colors duration-300 hover:bg-brand/10"
                >
                  PROGRAMAS
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="nav-dropdown glass-panel p-8 z-[9999] my-2.5 text-muted-foreground mx-5 rounded-2xl px-16 py-12 min-w-[700px]"
                  align="center"
                >
                  <div className="grid grid-cols-2 gap-14">
                    {/* Masters & PhD Column */}
                    <div className="mx-4">
                      <h3 className="text-primary text-xl font-bold mb-5 border-b border-border pb-3">Master Full Time</h3>

                      <p className="nav-dropdown-eyebrow mb-2">Presencial</p>
                      <ul className="space-y-1 text-base mb-5">
                        <li className="nav-dropdown-item">
                          <Link href="/mbim-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">MBIM</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/mbbe-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">MBBE</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/embim-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">EMBIM</span>
                          </Link>
                        </li>
                      </ul>

                      <p className="nav-dropdown-eyebrow mb-2">Online</p>
                      <ul className="space-y-1 text-base mb-5">
                        <li className="nav-dropdown-item">
                          <Link href="/mbim-online-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">MBIM</span>
                          </Link>
                        </li>
                      </ul>

                      <p className="nav-dropdown-eyebrow mb-2">¿Qué máster es para mí?</p>
                      <ul className="space-y-1 text-base">
                        <li className="nav-dropdown-item">
                          <Link href="/comparativa-masters-page" className="nav-dropdown-link group/item text-primary font-semibold">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Comparativa de Masters</span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Executive Education Column — tarjeta propia: son
                        cursos cortos y formación in company, no másteres de
                        postgrado, y aquí se ven distintos a propósito. */}
                    <div className="px-4">
                      <h3 className="text-primary text-xl font-bold mb-5 border-b border-border pb-3">
                        Executive Education
                      </h3>

                      <div className="nav-dropdown-subcard">
                        <p className="nav-dropdown-eyebrow mb-3">Formación corta</p>
                        <ul className="space-y-1 text-base">
                          <li className="nav-dropdown-item">
                            <Link href="/short-courses-page" className="nav-dropdown-link group/item">
                              <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                              <span className="link-draw">Cursos cortos</span>
                            </Link>
                          </li>
                          <li className="nav-dropdown-item">
                            <Link href="/in-company-page" className="nav-dropdown-link group/item">
                              <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                              <span className="link-draw">In Company</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* CONSULTORIA BIM */}
              <Link
                href="/bim-consulting-page"
                data-magnetic
                data-magnetic-strength="0.22"
                className="flex items-center rounded-lg px-2.5 py-1.5 transition-colors duration-300 hover:bg-brand/10"
              >
                CONSULTORIA BIM
              </Link>

              {/* RECURSOS Y SERVICIOS */}
              <DropdownMenu open={openDesktopMenu === "recursos"} onOpenChange={(isOpen) => setOpenDesktopMenu(isOpen ? "recursos" : null)}>
                <DropdownMenuTrigger
                  data-magnetic
                  data-magnetic-strength="0.22"
                  className="flex items-center focus:outline-none rounded-lg px-2.5 py-1.5 transition-colors duration-300 hover:bg-brand/10"
                >
                  RECURSOS Y SERVICIOS
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="nav-dropdown glass-panel text-foreground rounded-2xl p-8 z-[9999] my-2.5 mx-5 px-16 py-12 min-w-[650px]"
                  align="center"
                >
                  {/* Dos columnas, no una lista de 6: Tienda y Empresas se
                      sumaron aquí al quitar la barra secundaria del header
                      (ver CLAUDE.md), y en una sola columna el desplegable
                      se alargaba demasiado. Campus virtual salió de aquí:
                      ahora vive como elemento propio del menú principal. */}
                  <div className="grid grid-cols-2 gap-14">
                    <div className="mx-4">
                      <h3 className="text-primary text-xl font-bold mb-5 border-b border-border pb-3">Recursos</h3>
                      <ul className="space-y-1 text-base">
                        <li className="nav-dropdown-item">
                          <Link href="/blog" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Blog</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/bolsa-de-empleo-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Bolsa de empleo</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/financiacion-y-becas-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Financiación y becas</span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="px-4">
                      <h3 className="text-primary text-xl font-bold mb-5 border-b border-border pb-3">Servicios</h3>
                      <ul className="space-y-1 text-base">
                        <li className="nav-dropdown-item">
                          <Link href="/tienda" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Tienda</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/empresas-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Empresas</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* CONOCE IDESIE */}
              <DropdownMenu open={openDesktopMenu === "conoce"} onOpenChange={(isOpen) => setOpenDesktopMenu(isOpen ? "conoce" : null)}>
                <DropdownMenuTrigger
                  data-magnetic
                  data-magnetic-strength="0.22"
                  className="flex items-center focus:outline-none rounded-lg px-2.5 py-1.5 transition-colors duration-300 hover:bg-brand/10"
                >
                  CONOCE IDESIE
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="nav-dropdown glass-panel p-8 z-[9999] my-2.5 text-muted-foreground mx-5 rounded-2xl px-16 py-12 min-w-[650px]"
                  align="center"
                >
                  <div className="grid grid-cols-2 gap-14">
                    {/* Columna 1 */}
                    <div className="mx-4">
                      <h3 className="text-primary text-xl font-bold mb-5 border-b border-border pb-3">
                        Nuestra Institución
                      </h3>
                      <ul className="space-y-1 text-base">
                        <li className="nav-dropdown-item">
                          <Link href="/sobre-idesie-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Sobre IDESIE</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/nuestra-metodologia-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Nuestra Metodología</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/profesores-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Profesores</span>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Columna 2 */}
                    <div className="px-4">
                      <h3 className="text-primary text-xl font-bold mb-5 border-b border-border pb-3">Comunidad</h3>
                      <ul className="space-y-1 text-base">
                        <li className="nav-dropdown-item">
                          <Link href="/alianzas-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Alianzas Académicas</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/alumni-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Alumnos</span>
                          </Link>
                        </li>
                        <li className="nav-dropdown-item">
                          <Link href="/opiniones-page" className="nav-dropdown-link group/item">
                            <ArrowRight className="nav-dropdown-icon w-3 h-3 text-primary rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                            <span className="link-draw">Opiniones</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Contacto se sumó aquí al quitar la barra secundaria del
                      header (ver CLAUDE.md) — como fila propia, no metido a
                      la fuerza en "Nuestra Institución" o "Comunidad", que
                      son ambas de contenido informativo y no de acción. */}
                  <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-6">
                    <span className="text-primary font-semibold">¿Tienes alguna pregunta?</span>
                    <Link
                      href="/contact-page"
                      className="nav-dropdown-link group/item text-sm font-semibold text-primary"
                    >
                      <span className="link-draw">Contacto</span>
                      <ArrowRight className="nav-dropdown-icon w-3 h-3 rotate-180 shrink-0 group-hover/item:-translate-x-1" />
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* CAMPUS VIRTUAL. Enlace externo (aula.idesie.com, cambiado
                  desde campusvirtual.idesie.com el 2026-09-03 (13) — ver
                  CLAUDE.md), al mismo nivel que el resto — antes vivía
                  escondido dentro de RECURSOS Y SERVICIOS. El icono de
                  salida deja claro que abandona el sitio antes de que el
                  clic lo haga. */}
              <Link
                href="https://aula.idesie.com/"
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                data-magnetic-strength="0.22"
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors duration-300 hover:bg-brand/10"
              >
                CAMPUS VIRTUAL
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center">
                <CartIcon onClick={() => setIsCartOpen(true)} className="text-foreground" />
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Cajon movil. Comparte material con la pastilla (`.glass-panel`:
          mismo tinte, mismo desenfoque, mismo borde), pero con mucha mas
          opacidad porque encima va texto denso. Sigue ocupando la pantalla
          completa: convertirlo en hoja flotante obligaria a anadir un velo
          detras, y un velo que no cierra al tocarlo es una trampa — eso ya
          seria cambiar el comportamiento, no el aspecto. */}
      <div
        className={`glass-panel fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden flex flex-col overflow-hidden`}
      >
        <div className="flex justify-between items-center border-b border-[color:var(--nav-glass-hairline)] p-4">
          <Link href="/" onClick={toggleMobileMenu}>
            <Image
              src="/images/logo_idesie_azul_trim.png"
              alt="IDESIE"
              width={343}
              height={123}
              className="h-8 w-auto"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            magnetic
            className="text-foreground hover:bg-foreground/5"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <nav className="flex flex-col text-foreground text-base font-medium space-y-1 py-4 overflow-y-auto flex-1 relative">
          {/* Quick Links */}
          <div className="w-full px-4 mb-4">
            <div className="grid grid-cols-4 gap-2">
              <Link
                href="/empresas-page"
                data-magnetic
                data-magnetic-strength="0.2"
                className="flex flex-col items-center justify-center py-3 px-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                onClick={toggleMobileMenu}
              >
                <span className="text-xs font-medium text-center text-foreground">Empresas</span>
              </Link>
              <Link
                href="/tienda"
                data-magnetic
                data-magnetic-strength="0.2"
                className="flex flex-col items-center justify-center py-3 px-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                onClick={toggleMobileMenu}
              >
                <span className="text-xs font-medium text-center text-foreground">Tienda</span>
              </Link>
              <Link
                href="/blog"
                data-magnetic
                data-magnetic-strength="0.2"
                className="flex flex-col items-center justify-center py-3 px-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                onClick={toggleMobileMenu}
              >
                <span className="text-xs font-medium text-center text-foreground">Blog</span>
              </Link>
              <Link
                href="/contact-page"
                data-magnetic
                data-magnetic-strength="0.2"
                className="flex flex-col items-center justify-center py-3 px-2 rounded-lg bg-[#006cff] hover:bg-[#0052cc] transition-colors"
                onClick={toggleMobileMenu}
              >
                <span className="text-xs font-medium text-center text-white">Contacto</span>
              </Link>
            </div>
          </div>

          {/* Main Navigation Links */}
          <div className="w-full px-4 space-y-2">
            {/* PROGRAMAS */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                magnetic
                data-magnetic-strength="0.15"
                className="w-full justify-between text-foreground text-sm font-bold hover:bg-muted py-4 px-4 rounded-none"
                onClick={() => setIsProgramsOpen(!isProgramsOpen)}
              >
                <span>PROGRAMAS</span>
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-200 text-primary ${isProgramsOpen ? "rotate-90" : ""}`}
                />
              </Button>
              {isProgramsOpen && (
                <div className="bg-muted/50 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Master Full Time</p>
                  <Link href="/mbim-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>MBIM</Link>
                  <Link href="/mbbe-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>MBBE</Link>
                  <Link href="/embim-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>EMBIM</Link>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mt-3 mb-2">Master Online</p>
                  <Link href="/mbim-online-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>MBIM Online</Link>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mt-3 mb-2">Executive Education</p>
                  <Link href="/short-courses-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Cursos cortos</Link>
                  <Link href="/in-company-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>In Company</Link>
                  <Link href="/comparativa-masters-page" className="block py-2 px-3 text-sm text-primary rounded hover:bg-muted" onClick={toggleMobileMenu}>Comparativa de Masters</Link>
                </div>
              )}
            </div>

            {/* CONSULTORIA BIM */}
            <Link
              href="/bim-consulting-page"
              data-magnetic
              data-magnetic-strength="0.15"
              className="flex items-center justify-between border border-border rounded-lg py-4 px-4 text-sm font-bold hover:bg-muted transition-colors"
              onClick={toggleMobileMenu}
            >
              <span>CONSULTORIA BIM</span>
              <ArrowRight className="w-5 h-5 text-primary" />
            </Link>

            {/* RECURSOS Y SERVICIOS */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                magnetic
                data-magnetic-strength="0.15"
                className="w-full justify-between text-foreground text-sm font-bold hover:bg-muted py-4 px-4 rounded-none"
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              >
                <span>RECURSOS Y SERVICIOS</span>
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-200 text-primary ${isResourcesOpen ? "rotate-90" : ""}`}
                />
              </Button>
              {isResourcesOpen && (
                <div className="bg-muted/50 px-4 py-3 space-y-1">
                  <Link href="/blog" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Blog</Link>
                  <Link href="/bolsa-de-empleo-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Bolsa de empleo</Link>
                  <Link href="/financiacion-y-becas-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Financiacion y becas</Link>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mt-3 mb-2">Servicios</p>
                  <Link href="/tienda" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Tienda</Link>
                  <Link href="/empresas-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Empresas</Link>
                </div>
              )}
            </div>

            {/* CONOCE IDESIE */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                magnetic
                data-magnetic-strength="0.15"
                className="w-full justify-between text-foreground text-sm font-bold hover:bg-muted py-4 px-4 rounded-none"
                onClick={() => setIsConoceIdesieOpen(!isConoceIdesieOpen)}
              >
                <span>CONOCE IDESIE</span>
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-200 text-primary ${isConoceIdesieOpen ? "rotate-90" : ""}`}
                />
              </Button>
              {isConoceIdesieOpen && (
                <div className="bg-muted/50 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Nuestra Institucion</p>
                  <Link href="/sobre-idesie-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Sobre IDESIE</Link>
                  <Link href="/nuestra-metodologia-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Nuestra Metodologia</Link>
                  <Link href="/profesores-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Profesores</Link>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mt-3 mb-2">Comunidad</p>
                  <Link href="/alianzas-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Alianzas Academicas</Link>
                  <Link href="/alumni-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Alumnos</Link>
                  <Link href="/opiniones-page" className="block py-2 px-3 text-sm rounded hover:bg-muted" onClick={toggleMobileMenu}>Opiniones</Link>
                  <Link href="/contact-page" className="block py-2 px-3 text-sm text-primary font-semibold rounded hover:bg-muted" onClick={toggleMobileMenu}>Contacto</Link>
                </div>
              )}
            </div>

            {/* CAMPUS VIRTUAL. Enlace externo (aula.idesie.com), elemento
                propio al mismo nivel que CONSULTORIA BIM — no escondido
                dentro de un acordeón. */}
            <Link
              href="https://aula.idesie.com/"
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              data-magnetic-strength="0.15"
              className="flex items-center justify-between border border-border rounded-lg py-4 px-4 text-sm font-bold hover:bg-muted transition-colors"
              onClick={toggleMobileMenu}
            >
              <span>CAMPUS VIRTUAL</span>
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </Link>
          </div>

          {/* OCULTO: selector de idioma ES/EN en movil. Mismo motivo que en desktop:
              no hay i18n y los enlaces apuntaban a "#". Se deja el padding inferior
              para que el menu no termine pegado al borde. */}
          <div className="w-full px-4 mt-4 pb-6" aria-hidden="true" />
        </nav>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
