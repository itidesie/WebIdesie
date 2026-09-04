/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- CONFIGURACIONES DE V0 ---
  // Next 16 eliminó la clave `eslint` (y `next lint`): el build ya no ejecuta
  // ESLint, así que `ignoreDuringBuilds` no tenía efecto y solo generaba un warning.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Optimización nativa de Next: sirve AVIF/WebP redimensionado según el
    // dispositivo. Antes estaba en unoptimized:true y el móvil descargaba los
    // JPEG originales (el hero pesaba 927 KB y era el elemento LCP).
    formats: ["image/avif", "image/webp"],
  },
  
  // --- ESTO ARREGLA LOS PROBLEMAS DE LAS BARRAS / ---
  trailingSlash: false,

  // --- FUERZA REBUILD LIMPIO: Ignora módulos faltantes en archivos deletados ---
  experimental: {},

  async redirects() {
    return [
      // --- PROGRAMAS ACADÉMICOS (Sin barra final en source) ---
      { source: '/master-bim-building-information-modeling', destination: '/mbim-page', permanent: true },
      { source: '/master-bim-manager-online', destination: '/mbim-online-page', permanent: true },
      { source: '/executive-master-building-information-modeling', destination: '/embim-page', permanent: true },
      { source: '/executive-master-building-information-engineering', destination: '/embim-page', permanent: true },
      { source: '/mbbe-master-bim-building-engineering', destination: '/mbbe-page', permanent: true },
      { source: '/executive-master-direccion-estrategica-energia', destination: '/mbbe-page', permanent: true },
      { source: '/master-direccion-estrategica-energia', destination: '/mbbe-page', permanent: true },

      // --- FORMACIÓN Y SERVICIOS ---
      { source: '/cursos-cortos', destination: '/short-courses-page', permanent: true },
      { source: '/formacion-in-company', destination: '/in-company-page', permanent: true },
      { source: '/consultoria-bim', destination: '/bim-consulting-page', permanent: true },

      // --- SOBRE IDESIE ---
      { source: '/sobre-idesie', destination: '/sobre-idesie-page', permanent: true },
      { source: '/claustro', destination: '/profesores-page', permanent: true },
      { source: '/partners', destination: '/alianzas-page', permanent: true },
      { source: '/opiniones-master-bim-arquitectura-ingenieria', destination: '/opiniones-page', permanent: true },

      // --- RECURSOS Y EMPLEO ---
      { source: '/financiacion-becas', destination: '/financiacion-y-becas-page', permanent: true },
      { source: '/financiacion-con-metodologia-isa', destination: '/financiacion-y-becas-page', permanent: true },
      { source: '/bolsa-de-empleo-idesie', destination: '/bolsa-de-empleo-page', permanent: true },
      { source: '/comparativa-master-bim', destination: '/comparativa-masters-page', permanent: true },
      { source: '/jobs', destination: '/bolsa-de-empleo-page', permanent: true },

      // --- TIENDA Y PRODUCTOS ---
      { source: '/categoria-producto/:path*', destination: '/tienda', permanent: true },
      { source: '/masters-executive', destination: '/tienda', permanent: true },
      { source: '/masters-full-time', destination: '/tienda', permanent: true },
      // Quitado 2026-09-03: `{ source: '/producto/:path*', destination: '/tienda' }`
      // dejaba la ruta dinámica real `/producto/[slug]` inalcanzable — el
      // comodín `:path*` también atrapaba las fichas de producto de verdad,
      // no solo URLs antiguas. Detectado al verificar la migración a
      // Supabase (CLAUDE.md §2). Si en el futuro hace falta redirigir alguna
      // URL vieja de /producto/, usa un `source` con el slug exacto, nunca
      // un comodín que cubra toda la ruta.

      // --- CONTACTO Y LEGAL ---
      { source: '/contacto-idesie', destination: '/contact-page', permanent: true },
      { source: '/peticion-informacion', destination: '/contact-page', permanent: true },
      { source: '/aviso-legal', destination: '/aviso-legal-page', permanent: true },
      { source: '/politica-de-cookies', destination: '/politica-cookies-page', permanent: true },

      // --- COMODINES ---
      // `:slug+` (2026-09-01) atrapaba también las rutas reales de varios
      // segmentos: `/blog/[year]/[month]/[day]/[slug]` (el post real) y
      // `/blog/tag/[tag]`, dejándolas inalcanzables — mismo fallo que el de
      // `/producto/:path*` (ver CLAUDE.md §2). `app/blog/[slug]/` es una
      // carpeta vacía (solo `.gitkeep`) heredada de una estructura de URL
      // plana anterior a year/month/day: el único caso real que esta regla
      // debe cubrir es exactamente un segmento (`/blog/mi-post-antiguo`).
      { source: '/blog/:slug', destination: '/blog', permanent: true },
      { source: '/wp-content/uploads/:path*', destination: '/contact-page', permanent: true },
    ];
  },
};

export default nextConfig;
