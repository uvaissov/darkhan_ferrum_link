import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      productsCount,
      categoriesCount,
      ordersCount,
      newOrdersCount,
      callbacksCount,
      newCallbacksCount,
      newsCount,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'NEW' } }),
      prisma.callbackRequest.count(),
      prisma.callbackRequest.count({ where: { status: 'new' } }),
      prisma.news.count(),
    ])

    return NextResponse.json({
      productsCount,
      categoriesCount,
      ordersCount,
      newOrdersCount,
      callbacksCount,
      newCallbacksCount,
      newsCount,
    })
  } catch {
    return NextResponse.json(
      { error: 'Не удалось загрузить статистику' },
      { status: 500 }
    )
  }
}
