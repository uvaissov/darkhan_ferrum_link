'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Phone, Check } from 'lucide-react'

interface CallbackRequest {
  id: string
  name: string
  phone: string
  message: string | null
  status: string
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'success' }> = {
  new: { label: 'Новая', variant: 'warning' },
  processed: { label: 'Обработана', variant: 'success' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CallbacksPage() {
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCallbacks()
  }, [])

  async function fetchCallbacks() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/callbacks')
      const data = await res.json()
      setCallbacks(data)
    } catch {
      setCallbacks([])
    } finally {
      setLoading(false)
    }
  }

  async function markAsProcessed(id: string) {
    setProcessingId(id)
    try {
      const res = await fetch('/api/admin/callbacks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'processed' }),
      })

      if (res.ok) {
        const updated = await res.json()
        setCallbacks((prev) =>
          prev.map((cb) => (cb.id === updated.id ? updated : cb))
        )
      }
    } catch {
      // silently fail
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Заявки на звонок</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : callbacks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Phone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Заявок пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Имя</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Телефон</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Сообщение</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Статус</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Дата</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Действие</th>
                </tr>
              </thead>
              <tbody>
                {callbacks.map((cb) => {
                  const config = STATUS_CONFIG[cb.status] || STATUS_CONFIG.new
                  return (
                    <tr
                      key={cb.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{cb.name}</td>
                      <td className="px-4 py-3 text-gray-900">{cb.phone}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                        {cb.message || <span className="text-gray-400">&mdash;</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(cb.createdAt)}</td>
                      <td className="px-4 py-3">
                        {cb.status === 'new' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsProcessed(cb.id)}
                            disabled={processingId === cb.id}
                          >
                            {processingId === cb.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <span className="inline-flex items-center gap-1.5">
                                <Check className="w-4 h-4" />
                                Обработана
                              </span>
                            )}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-xs">Готово</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
