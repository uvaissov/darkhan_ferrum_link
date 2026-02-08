'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Package,
  FolderTree,
  ShoppingCart,
  Phone,
  Newspaper,
  ExternalLink,
  Loader2,
} from 'lucide-react'

interface Stats {
  productsCount: number
  categoriesCount: number
  ordersCount: number
  newOrdersCount: number
  callbacksCount: number
  newCallbacksCount: number
  newsCount: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        Не удалось загрузить статистику
      </div>
    )
  }

  const cards = [
    {
      label: 'Товары',
      count: stats.productsCount,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Категории',
      count: stats.categoriesCount,
      icon: FolderTree,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Заказы',
      count: stats.ordersCount,
      sub: stats.newOrdersCount > 0 ? `${stats.newOrdersCount} новых` : undefined,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Заявки',
      count: stats.callbacksCount,
      sub: stats.newCallbacksCount > 0 ? `${stats.newCallbacksCount} новых` : undefined,
      icon: Phone,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Новости',
      count: stats.newsCount,
      icon: Newspaper,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 transition-colors"
        >
          Перейти на сайт
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="p-5">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                  {card.sub && (
                    <p className="text-xs text-orange-500 mt-0.5">{card.sub}</p>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
