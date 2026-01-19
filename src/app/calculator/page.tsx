import { MetalCalculator } from '@/components/calculator/metal-calculator'

export const metadata = {
  title: 'Калькулятор',
  description: 'Калькулятор веса и стоимости металла',
}

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Калькулятор металла</h1>

      <div className="max-w-xl mx-auto">
        <MetalCalculator />

        <div className="mt-8 text-sm text-gray-500">
          <p>* Расчёт является приблизительным и может отличаться от фактического веса.</p>
          <p>* Цены указаны ориентировочно. Для получения точной стоимости свяжитесь с нами.</p>
        </div>
      </div>
    </div>
  )
}
