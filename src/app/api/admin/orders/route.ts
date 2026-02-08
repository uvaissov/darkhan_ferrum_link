import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status: status as 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' } : {}

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Admin orders GET error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить заказы' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID и статус обязательны' },
        { status: 400 }
      )
    }

    const validStatuses = ['NEW', 'PROCESSING', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Некорректный статус' },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Admin orders PATCH error:', error)
    return NextResponse.json(
      { error: 'Не удалось обновить статус заказа' },
      { status: 500 }
    )
  }
}
