'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Category {
  id: string
  name: string
  parentId: string | null
}

const UNITS = ['шт', 'кг', 'т', 'м', 'лист', 'м²']

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'шт',
    inStock: true,
    categoryId: '',
    image: '',
    specifications: '',
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch('/api/admin/categories'),
        ])

        if (!productRes.ok) {
          setError('Товар не найден')
          setLoading(false)
          return
        }

        const product = await productRes.json()
        const cats = await categoriesRes.json()

        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price ? String(product.price) : '',
          unit: product.unit || 'шт',
          inStock: product.inStock ?? true,
          categoryId: product.categoryId || '',
          image: product.image || '',
          specifications: product.specifications
            ? JSON.stringify(product.specifications, null, 2)
            : '',
        })

        if (Array.isArray(cats)) setCategories(cats)
      } catch {
        setError('Ошибка при загрузке данных')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      let specs = null
      if (form.specifications.trim()) {
        try {
          specs = JSON.parse(form.specifications)
        } catch {
          setError('Характеристики должны быть в формате JSON')
          setSaving(false)
          return
        }
      }

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: form.price || null,
          unit: form.unit,
          inStock: form.inStock,
          categoryId: form.categoryId,
          image: form.image || null,
          specifications: specs,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Не удалось обновить товар')
        return
      }

      router.push('/admin/products')
    } catch {
      setError('Ошибка при обновлении товара')
    } finally {
      setSaving(false)
    }
  }

  const selectStyle =
    'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
  const textareaStyle =
    'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[100px]'

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        Загрузка товара...
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Назад к товарам
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Редактировать товар
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Арматура А500С 12мм"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Описание товара..."
              className={textareaStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена
              </label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Единица измерения
              </label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className={selectStyle}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className={selectStyle}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parentId ? '— ' : ''}
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
              В наличии
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL изображения
            </label>
            <Input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Характеристики (JSON)
            </label>
            <textarea
              name="specifications"
              value={form.specifications}
              onChange={handleChange}
              placeholder='{"Диаметр": "12мм", "Длина": "11.7м", "Марка стали": "А500С"}'
              className={textareaStyle}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
