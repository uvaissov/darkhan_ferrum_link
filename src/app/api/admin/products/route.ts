import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteCache } from '@/lib/redis'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Admin products GET error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить товары' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, unit, inStock, categoryId, image, specifications } = body

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Название и категория обязательны' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    // Check for duplicate slug
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'Товар с таким названием уже существует' },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: price ? parseFloat(price) : null,
        unit: unit || 'шт',
        inStock: inStock ?? true,
        categoryId,
        image: image?.trim() || null,
        specifications: specifications || null,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    await deleteCache('products:*')

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Admin products POST error:', error)
    return NextResponse.json(
      { error: 'Не удалось создать товар' },
      { status: 500 }
    )
  }
}
