'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CatalogDownloadDialogProps {
  catalogId: string;
  catalogName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CatalogDownloadDialog({
  catalogId,
  catalogName,
  open: controlledOpen,
  onOpenChange,
}: CatalogDownloadDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setIsOpen =
    onOpenChange !== undefined ? onOpenChange : setUncontrolledOpen;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const telefono = formData.get('telefono') as string;
    const rgpdAceptado = formData.get('rgpdAceptado') === 'on';

    if (!rgpdAceptado) {
      setError('Debes aceptar la política de privacidad para continuar');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/send-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          telefono,
          catalogId,
          catalogName,
          rgpdAceptado,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el catálogo');
      }

      setSuccessMessage('¡Catálogo enviado exitosamente!');
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error('[v0] Error en el cliente:', err);
      setError(
        err instanceof Error ? err.message : 'Error al enviar el catálogo'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Descargar {catalogName}</DialogTitle>
          <DialogDescription>
            Ingresa tu información para recibir el catálogo por email
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Tu nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              required
              placeholder="+34 600 000 000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="rgpdAceptado"
              name="rgpdAceptado"
              required
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="rgpdAceptado" className="text-sm text-gray-600">
              Acepto la{' '}
              <a
                href="/politica-privacidad-page"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                política de privacidad
              </a>{' '}
              de IDESIE
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {loading ? 'Enviando...' : 'Descargar catálogo'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
