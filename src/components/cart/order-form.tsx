'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { orderSchema, OrderFormData } from '@/lib/validations'
import { useCartStore } from '@/store/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function OrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  })

  const onSubmit = async (data: OrderFormData) => {
    if (getTotalPrice() < 30000) {
      setError('Минимальная сумма заказа 30 000 тг')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, items }),
      })

      const result = await response.json()

      if (response.ok) {
        clearCart()
        router.push(`/order-success?number=${result.order.number}`)
      } else {
        setError(result.error || 'Ошибка при оформлении заказа')
      }
    } catch (err) {
      setError('Ошибка при отправке заказа')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Оформление заказа</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Ваше имя *"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          placeholder="Телефон *"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Input
          placeholder="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          placeholder="Компания"
          {...register('company')}
        />
        <textarea
          placeholder="Комментарий к заказу"
          {...register('comment')}
          className="w-full p-3 border rounded-md resize-none h-24"
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || getTotalPrice() < 30000}
        >
          {isSubmitting ? 'Отправка...' : 'Оформить заказ'}
        </Button>
      </form>
    </div>
  )
}
