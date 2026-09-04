import { NextResponse } from "next/server"
import { getPublicProductos } from "@/app/tienda/actions"

export async function GET() {
  const productos = await getPublicProductos()
  return NextResponse.json(productos)
}
