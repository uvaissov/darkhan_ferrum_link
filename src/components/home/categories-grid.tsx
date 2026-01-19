import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  { name: 'Чёрный металлопрокат', slug: 'cherniy-metalloprokat', count: 150 },
  { name: 'Нержавеющая сталь', slug: 'nerzhaveyka', count: 120 },
  { name: 'Цветной металлопрокат', slug: 'tsvetnoy-metalloprokat', count: 80 },
  { name: 'Трубопроводная арматура', slug: 'truboprovodnaya-armatura', count: 200 },
  { name: 'Сварочные материалы', slug: 'svarochnye-materialy', count: 60 },
  { name: 'Кабельная продукция', slug: 'kabelnaya-produktsiya', count: 90 },
]

export function CategoriesGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Категории продукции</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/catalog/${category.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-6 h-6 bg-orange-500 rounded" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-500 text-sm">{category.count} товаров</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
