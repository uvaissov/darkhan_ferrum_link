import { Truck, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Доставка',
  description: 'Условия доставки металлопроката',
}

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Доставка</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Truck className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="font-bold mb-2">По городу</h3>
            <p className="text-gray-600">Бесплатно при заказе от 100 000 тг</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="font-bold mb-2">По Казахстану</h3>
            <p className="text-gray-600">Доставка транспортными компаниями</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Сроки</h3>
            <p className="text-gray-600">1-3 дня по городу, 3-7 дней по стране</p>
          </CardContent>
        </Card>
      </div>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold mb-4">Условия доставки</h2>
        <ul className="space-y-2 text-gray-600">
          <li>Минимальная сумма заказа для доставки — 30 000 тг</li>
          <li>Доставка по Астане осуществляется собственным транспортом</li>
          <li>Доставка в регионы — через транспортные компании</li>
          <li>Возможен самовывоз со склада</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Самовывоз</h2>
        <p className="text-gray-600">
          Вы можете забрать заказ самостоятельно со склада по адресу:
          г. Астана, ул. Циолковского 11, офис 305. Время работы склада: Пн-Пт 9:00-18:00.
        </p>
      </div>
    </div>
  )
}
