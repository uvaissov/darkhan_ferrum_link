import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Металлопрокат и промышленные материалы от Ferrum Link
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Более 2000 наименований продукции. Доставка по всему Казахстану. Работаем с 2010 года.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/catalog">
              <Button size="lg">Перейти в каталог</Button>
            </Link>
            <Link href="/contacts">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Связаться с нами
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
