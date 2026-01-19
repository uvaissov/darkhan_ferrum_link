import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCache, setCache, CACHE_KEYS } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Создаём ключ кеша из параметров
    const cacheKey = CACHE_KEYS.products(`${category}-${search}-${page}-${limit}`)

    // Пробуем получить из кеша
    const cached = await getCache(cacheKey)
    if (cached && !search) {
      return NextResponse.json(cached)
    }

    const where: any = {}

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    const result = {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }

    // Кешируем на 5 минут (не кешируем поиск)
    if (!search) {
      await setCache(cacheKey, result, 300)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Products error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении товаров' },
      { status: 500 }
    )
  }
}
