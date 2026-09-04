import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 text-gray-700">
      <Loader2 className="h-12 w-12 animate-spin text-[#006cff]" />
      <p className="mt-4 text-lg">Cargando ofertas de empleo...</p>
    </div>
  )
}
