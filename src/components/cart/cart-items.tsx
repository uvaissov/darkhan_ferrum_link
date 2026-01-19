'use client'

import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Trash2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CartItems() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Корзина пуста</p>
        <Button variant="outline" onClick={() => window.location.href = '/catalog'}>
          Перейти в каталог
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.productId}
          className="flex items-center gap-4 p-4 border rounded-lg"
        >
          <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                Нет фото
              </div>
            )}
          </div>

          <div className="flex-grow">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-orange-500 font-semibold">
              {formatPrice(item.price)} / {item.unit}
            </p>
          </div>

          <div className="flex items-center border rounded">
            <button
              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
              className="p-2 hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 min-w-[50px] text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="p-2 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right min-w-[100px]">
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </div>

          <button
            onClick={() => removeItem(item.productId)}
            className="p-2 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Итого:</span>
          <span className="text-orange-500">{formatPrice(getTotalPrice())}</span>
        </div>
        {getTotalPrice() < 30000 && (
          <p className="text-red-500 text-sm mt-2">
            Минимальная сумма заказа 30 000 тг. Добавьте товаров на {formatPrice(30000 - getTotalPrice())}
          </p>
        )}
      </div>
    </div>
  )
}
