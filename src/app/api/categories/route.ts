import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCache, setCache, CACHE_KEYS } from '@/lib/redis'

export async function GET() {
  try {
    // Пробуем получить из кеша
    const cached = await getCache(CACHE_KEYS.categories)
    if (cached) {
      return NextResponse.json(cached)
    }

    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { products: true } },
      },
      orderBy: { order: 'asc' },
    })

    // Кешируем на 10 минут (категории меняются редко)
    await setCache(CACHE_KEYS.categories, categories, 600)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении категорий' },
      { status: 500 }
    )
  }
}
