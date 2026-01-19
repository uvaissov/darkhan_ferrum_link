import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { orderSchema } from '@/lib/validations'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, ...customerData } = body

    const validated = orderSchema.parse(customerData)

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Корзина пуста' },
        { status: 400 }
      )
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    if (totalAmount < 30000) {
      return NextResponse.json(
        { error: 'Минимальная сумма заказа 30 000 тг' },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        number: generateOrderNumber(),
        ...validated,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании заказа' },
      { status: 400 }
    )
  }
}
