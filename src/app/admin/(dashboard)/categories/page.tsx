'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  order: number
  parent: { id: string; name: string } | null
  _count: { children: number; products: number }
}

interface FormData {
  name: string
  description: string
  parentId: string
  order: number
}

const emptyForm: FormData = {
  name: '',
  description: '',
  parentId: '',
  order: 0,
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/categories')
      if (!res.ok) throw new Error('Ошибка загрузки')
      const data = await res.json()
      setCategories(data)
    } catch {
      setError('Не удалось загрузить категории')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const rootCategories = categories.filter((c) => c.parentId === null)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setIsModalOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditingId(category.id)
    setForm({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
      order: category.order,
    })
    setError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Введите название')
      return
    }

    setSaving(true)
    setError('')

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          parentId: form.parentId || null,
          order: form.order,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка сохранения')
        return
      }

      closeModal()
      fetchCategories()
    } catch {
      setError('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    if (category._count.products > 0) {
      alert(`Невозможно удалить: в категории ${category._count.products} товар(ов)`)
      return
    }

    if (!window.confirm(`Удалить категорию "${category.name}"?`)) return

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Ошибка удаления')
        return
      }

      fetchCategories()
    } catch {
      alert('Ошибка удаления')
    }
  }

  // Build display list: root categories first, then their children indented
  const displayCategories: (Category & { indent: boolean })[] = []
  for (const root of categories.filter((c) => !c.parentId)) {
    displayCategories.push({ ...root, indent: false })
    const children = categories
      .filter((c) => c.parentId === root.id)
      .sort((a, b) => a.order - b.order)
    for (const child of children) {
      displayCategories.push({ ...child, indent: true })
    }
  }
  // Categories that are children but whose parent isn't root (orphans edge case)
  const displayedIds = new Set(displayCategories.map((c) => c.id))
  for (const cat of categories) {
    if (!displayedIds.has(cat.id)) {
      displayCategories.push({ ...cat, indent: true })
    }
  }

  // Filter parent options: exclude the editing category itself and its children
  const parentOptions = rootCategories.filter((c) => c.id !== editingId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить категорию
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Категорий пока нет
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b text-left text-sm font-medium text-gray-500">
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Родитель</th>
                <th className="px-4 py-3 text-center">Товаров</th>
                <th className="px-4 py-3 text-center">Порядок</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {displayCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={category.indent ? 'pl-6 text-gray-600' : 'font-medium'}>
                      {category.indent && '-- '}
                      {category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {category.parent?.name || '--'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {category._count.products}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {category.order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category)}
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
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Редактировать категорию' : 'Новая категория'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Название категории"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Описание категории"
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Родительская категория
            </label>
            <select
              value={form.parentId}
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Без родителя (корневая)</option>
              {parentOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Порядок сортировки
            </label>
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={closeModal}>
              Отмена
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
