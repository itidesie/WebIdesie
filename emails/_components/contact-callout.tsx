import { Link, Section, Text } from "react-email"

interface ContactCalloutProps {
  nombre: string
  telefono: string
  email: string
}

/**
 * Bloque "llama ya" para los avisos internos a info@idesie.com — a
 * diferencia de los emails de cara al cliente (cálidos, con el dato en una
 * tarjeta discreta), aquí el teléfono y el email van primero, grandes y
 * pulsables, para que el equipo pueda actuar sin leer el resto del correo.
 */
export function ContactCallout({ nombre, telefono, email }: ContactCalloutProps) {
  return (
    <Section className="mb-6 rounded-lg border-2 border-solid border-brand bg-white px-5 py-4">
      <Text className="m-0 text-lg font-bold text-ink">{nombre}</Text>
      <Text className="m-0 mt-2 text-xl font-bold leading-[26px]">
        <Link href={`tel:${telefono.replace(/\s+/g, "")}`} className="text-brand no-underline">
          {telefono}
        </Link>
      </Text>
      <Text className="m-0 mt-1 text-[15px] leading-[22px]">
        <Link href={`mailto:${email}`} className="text-brand no-underline">
          {email}
        </Link>
      </Text>
    </Section>
  )
}
