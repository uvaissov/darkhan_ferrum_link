'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

interface News {
  id: string
  title: string
  slug: string
  published: boolean
  publishedAt: string | null
  createdAt: string
}

export default function AdminNewsPage() {
  const router = useRouter()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/admin/news')
      const data = await res.json()
      setNews(data)
    } catch {
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/news/${deleteId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setNews((prev) => prev.filter((n) => n.id !== deleteId))
        setDeleteId(null)
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Новости</h1>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить новость
          </Button>
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Новостей пока нет
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Заголовок
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Статус
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Дата
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {item.title}
                  </td>
                  <td className="px-4 py-3">
                    {item.published ? (
                      <Badge variant="success">Опубликовано</Badge>
                    ) : (
                      <Badge variant="warning">Черновик</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/news/${item.id}/edit`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Удалить новость?"
      >
        <p className="text-sm text-gray-500 mb-4">
          Это действие нельзя отменить. Новость будет удалена навсегда.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Отмена
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Удалить'
            )}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
