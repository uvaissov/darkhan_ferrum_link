import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrderSuccessPageProps {
  searchParams: Promise<{ number?: string }>
}

export const metadata = {
  title: 'Заказ оформлен',
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Заказ оформлен!</h1>

        {params.number && (
          <p className="text-gray-600 mb-2">
            Номер вашего заказа: <strong>{params.number}</strong>
          </p>
        )}

        <p className="text-gray-600 mb-8">
          Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog">
            <Button>Продолжить покупки</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">На главную</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
