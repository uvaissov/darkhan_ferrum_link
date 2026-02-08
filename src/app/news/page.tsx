import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Новости — Ferrum Link',
  description: 'Последние новости компании',
}

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Новости</h1>

      {news.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Новостей пока нет
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group block rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {item.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {item.title}
                </h2>
                {item.excerpt && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {item.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {item.publishedAt && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.publishedAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                  <span className="text-sm font-medium text-orange-500 group-hover:text-orange-600">
                    Читать далее
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
