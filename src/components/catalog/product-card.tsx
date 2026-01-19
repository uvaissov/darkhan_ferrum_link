'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { Product } from '@prisma/client'
import Link from 'next/link'

interface ProductCardProps {
  product: Product & { category: { slug: string } }
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price ? Number(product.price) : 0,
      quantity: 1,
      unit: product.unit,
      image: product.image || undefined,
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <Link href={`/catalog/${product.category.slug}/${product.slug}`}>
        <div className="aspect-square bg-gray-100 relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Нет фото
            </div>
          )}
          {!product.inStock && (
            <Badge variant="error" className="absolute top-2 right-2">
              Нет в наличии
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Link href={`/catalog/${product.category.slug}/${product.slug}`}>
          <h3 className="font-medium mb-2 hover:text-orange-500 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto">
          <p className="text-lg font-bold text-orange-500 mb-3">
            {formatPrice(product.price ? Number(product.price) : null)}
            {product.price && <span className="text-sm text-gray-500 font-normal">/{product.unit}</span>}
          </p>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || !product.price}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            В корзину
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
