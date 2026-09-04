import { DirectPaymentForm } from '@/components/direct-payment-form';

export const metadata = {
  title: 'Pago Directo - IDESIE',
  description: 'Formulario de pago directo para IDESIE',
};

export default function DirectPaymentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pago Directo
          </h1>
          <p className="text-lg text-gray-600">
            Completa el formulario para proceder al pago de tu programa
          </p>
        </div>

        <DirectPaymentForm />

        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información sobre el pago
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-[#006cff] font-bold mr-3">✓</span>
              <span>Los datos se envían de forma segura a Flywire</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#006cff] font-bold mr-3">✓</span>
              <span>Soportamos múltiples métodos de pago internacionales</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#006cff] font-bold mr-3">✓</span>
              <span>Recibirás confirmación por email inmediatamente</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
