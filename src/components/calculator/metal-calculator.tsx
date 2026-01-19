'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

type ProductType = 'sheet' | 'pipe' | 'rebar' | 'channel'

const products: Record<ProductType, { name: string; density: number; pricePerKg: number }> = {
  sheet: { name: 'Лист стальной', density: 7850, pricePerKg: 450 },
  pipe: { name: 'Труба круглая', density: 7850, pricePerKg: 520 },
  rebar: { name: 'Арматура', density: 7850, pricePerKg: 380 },
  channel: { name: 'Швеллер', density: 7850, pricePerKg: 480 },
}

export function MetalCalculator() {
  const [productType, setProductType] = useState<ProductType>('sheet')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    thickness: '',
    diameter: '',
    quantity: '1',
  })
  const [result, setResult] = useState<{ weight: number; price: number } | null>(null)

  const calculate = () => {
    const product = products[productType]
    let volume = 0

    if (productType === 'sheet') {
      const l = parseFloat(dimensions.length) / 1000
      const w = parseFloat(dimensions.width) / 1000
      const t = parseFloat(dimensions.thickness) / 1000
      volume = l * w * t
    } else if (productType === 'pipe') {
      const l = parseFloat(dimensions.length) / 1000
      const d = parseFloat(dimensions.diameter) / 1000
      const t = parseFloat(dimensions.thickness) / 1000
      const innerD = d - 2 * t
      volume = Math.PI * l * (Math.pow(d, 2) - Math.pow(innerD, 2)) / 4
    } else if (productType === 'rebar') {
      const l = parseFloat(dimensions.length) / 1000
      const d = parseFloat(dimensions.diameter) / 1000
      volume = Math.PI * Math.pow(d / 2, 2) * l
    }

    const quantity = parseInt(dimensions.quantity) || 1
    const weight = volume * product.density * quantity
    const price = weight * product.pricePerKg

    setResult({ weight, price })
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Калькулятор веса металла</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Тип продукции</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value as ProductType)}
            className="w-full p-2 border rounded-md"
          >
            {Object.entries(products).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Длина (мм)</label>
            <Input
              type="number"
              value={dimensions.length}
              onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
              placeholder="1000"
            />
          </div>

          {productType === 'sheet' && (
            <div>
              <label className="block text-sm font-medium mb-2">Ширина (мм)</label>
              <Input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                placeholder="500"
              />
            </div>
          )}

          {(productType === 'pipe' || productType === 'rebar') && (
            <div>
              <label className="block text-sm font-medium mb-2">Диаметр (мм)</label>
              <Input
                type="number"
                value={dimensions.diameter}
                onChange={(e) => setDimensions({ ...dimensions, diameter: e.target.value })}
                placeholder="50"
              />
            </div>
          )}

          {(productType === 'sheet' || productType === 'pipe') && (
            <div>
              <label className="block text-sm font-medium mb-2">Толщина (мм)</label>
              <Input
                type="number"
                value={dimensions.thickness}
                onChange={(e) => setDimensions({ ...dimensions, thickness: e.target.value })}
                placeholder="2"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Количество</label>
            <Input
              type="number"
              value={dimensions.quantity}
              onChange={(e) => setDimensions({ ...dimensions, quantity: e.target.value })}
              placeholder="1"
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Рассчитать
        </Button>

        {result && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Вес</p>
                <p className="text-2xl font-bold">{result.weight.toFixed(2)} кг</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Примерная стоимость</p>
                <p className="text-2xl font-bold text-orange-500">{formatPrice(result.price)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
