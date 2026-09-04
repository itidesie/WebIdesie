"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

/**
 * Meta Pixel — solo `/landing`, la única página del sitio pensada para
 * tráfico de campañas de pago (noindex/nofollow, sin header compartido,
 * cero enlaces internos — ver CLAUDE.md). Deliberadamente NO se añade al
 * layout raíz: el resto del sitio es orgánico/SEO, y trackearlo sería un
 * cambio de alcance/privacidad aparte, no decidido aquí.
 *
 * Doble guardia contra ensuciar los datos reales de Meta con pruebas:
 * 1. `NODE_ENV !== "production"` — nunca en `pnpm dev`.
 * 2. Host `localhost`/`127.0.0.1` — nunca en `next start` local, que sí
 *    corre en modo producción (es como se verificó este mismo fix de
 *    sanitización horas antes). Solo se comprueba en cliente (tras montar),
 *    nunca en servidor, así que no hay nada que renderizar hasta entonces.
 */
export function MetaPixel() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    const host = window.location.hostname
    if (host === "localhost" || host === "127.0.0.1") return
    setShouldLoad(true)
  }, [])

  if (!PIXEL_ID || !shouldLoad) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}

/**
 * Dispara un evento estándar del píxel desde cualquier Client Component
 * (p. ej. al completar `InfoRequestModal`). No lanza si el píxel no llegó
 * a cargar (localhost, desarrollo, o sin `NEXT_PUBLIC_META_PIXEL_ID`) — el
 * propio `window.fbq` no existiría en ese caso.
 */
export function trackMetaPixelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  if (typeof fbq !== "function") return
  fbq("track", eventName, params)
}
