import { Truck, Shield, Clock, Headphones } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Доставка по Казахстану',
    description: 'Доставляем продукцию во все регионы страны',
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Вся продукция сертифицирована',
  },
  {
    icon: Clock,
    title: 'Быстрая обработка',
    description: 'Обработка заявок в течение 1 часа',
  },
  {
    icon: Headphones,
    title: 'Поддержка 24/7',
    description: 'Консультации по любым вопросам',
  },
]

export function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
