import { Card, CardContent } from '@/components/ui/card'
import { Scissors, Shield, FlaskConical, Truck } from 'lucide-react'

export const metadata = {
  title: 'Услуги',
  description: 'Услуги по обработке металла',
}

const services = [
  {
    icon: Scissors,
    title: 'Резка металла',
    description: 'Плазменная и газовая резка металла любой сложности. Раскрой листового металла по вашим чертежам.',
  },
  {
    icon: Shield,
    title: 'Цинкование',
    description: 'Горячее и холодное цинкование металлоизделий для защиты от коррозии.',
  },
  {
    icon: FlaskConical,
    title: 'Анализ металла',
    description: 'Спектральный анализ химического состава металла. Определение марки стали.',
  },
  {
    icon: Truck,
    title: 'Доставка',
    description: 'Доставка продукции собственным транспортом по Астане и транспортными компаниями по Казахстану.',
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Услуги</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.title}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
