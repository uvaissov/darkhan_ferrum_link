'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cart'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number | null
    unit: string
    image?: string | null
    inStock: boolean
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (!product.price) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      unit: product.unit,
      image: product.image || undefined,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Количество:</span>
        <div className="flex items-center border rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-gray-500">{product.unit}</span>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={!product.inStock || !product.price}
        size="lg"
        className="w-full sm:w-auto"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
      </Button>
    </div>
  )
}
