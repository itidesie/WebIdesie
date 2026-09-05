import type { ReactNode } from "react"
import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Tailwind, Text } from "react-email"
import { emailAssets, emailFonts, emailTailwindTheme } from "./brand"

interface EmailLayoutProps {
  /** Texto que Gmail/Outlook muestran junto al asunto en la bandeja de entrada. */
  previewText: string
  children: ReactNode
}

/**
 * Cabecera con logo + cuerpo + pie legal, compartida por todos los emails
 * transaccionales del sitio. Deliberadamente sin webfonts ni CSS avanzado
 * (grid/flexbox) — Outlook de escritorio renderiza con el motor de Word y
 * los ignora; todo aquí son Section/Container (tablas por debajo) y estilos
 * en línea, que es el subconjunto que react-email garantiza soportado.
 *
 * No incluye teléfono de contacto: el sitio tiene varios números de teléfono
 * distintos según la página (contacto, política de privacidad, footer
 * muerto...) sin ninguna fuente única de verdad — se evita propagar uno
 * potencialmente incorrecto. Solo info@idesie.com, que sí es consistente en
 * todo el proyecto.
 */
export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Tailwind config={emailTailwindTheme}>
      <Html lang="es">
        <Head />
        <Preview>{previewText}</Preview>
        <Body
          style={{ fontFamily: emailFonts.sans }}
          className="m-0 bg-paper py-10"
        >
          <Container className="mx-auto max-w-[560px] overflow-hidden rounded-xl bg-white">
            <Section className="border-b-[3px] border-brand bg-white px-10 py-7">
              <Img
                src={emailAssets.logo}
                alt="IDESIE Business & Technology School"
                width={emailAssets.logoWidth}
                height={emailAssets.logoHeight}
                className="block"
              />
            </Section>

            <Section className="px-10 pt-8 pb-2">{children}</Section>

            <Hr className="mx-10 mt-2 border-line" />

            <Section className="px-10 pt-5 pb-8">
              <Text className="m-0 mb-1 text-xs leading-[18px] text-muted">
                IDESIE Business &amp; Technology School ·{" "}
                <Link href="mailto:info@idesie.com" className="text-muted underline">
                  info@idesie.com
                </Link>
              </Text>
              <Text className="m-0 text-xs leading-[18px] text-muted">
                Recibes este correo porque enviaste una solicitud en{" "}
                <Link href={emailAssets.siteUrl} className="text-muted underline">
                  idesie.com
                </Link>
                . {" "}
                <Link href={`${emailAssets.siteUrl}/politica-privacidad-page`} className="text-muted underline">
                  Política de privacidad
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
