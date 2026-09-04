"use client"

import { Input } from "@/components/ui/input"

export interface BuyerFormData {
  firstName: string
  lastName: string
  email: string
}

export interface BuyerFormErrors {
  firstName?: string
  lastName?: string
  email?: string
}

interface PedidoBuyerFormProps {
  data: BuyerFormData
  errors: BuyerFormErrors
  onChange: (field: keyof BuyerFormData, value: string) => void
}

export function PedidoBuyerForm({ data, errors, onChange }: PedidoBuyerFormProps) {
  return (
    <div className="pedido-card p-6">
      <p className="pedido-eyebrow text-brand-strong">Paso 2</p>
      <h2 className="mt-1 text-lg font-bold text-foreground">Tus datos</h2>
      <p className="mt-1 text-sm text-muted-foreground">Los usaremos para identificarte en la pasarela de pago.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre <span className="text-destructive">*</span>
          </label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Tu nombre"
            className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-foreground">
            Apellidos <span className="text-destructive">*</span>
          </label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Tus apellidos"
            className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="tu@email.com"
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>
    </div>
  )
}
