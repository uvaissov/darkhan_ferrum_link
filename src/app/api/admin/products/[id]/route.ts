import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteCache } from '@/lib/redis'
import { slugify } from '@/lib/utils'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Admin product GET error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить товар' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, price, unit, inStock, categoryId, image, specifications } = body

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Название и категория обязательны' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    // Check for duplicate slug (excluding current product)
    const existing = await prisma.product.findFirst({
      where: { slug, id: { not: id } },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Товар с таким названием уже существует' },
        { status: 409 }
      )
    }

    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(product)
  } catch (error) {
    console.error('Admin product PUT error:', error)
    return NextResponse.json(
      { error: 'Не удалось обновить товар' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.product.delete({ where: { id } })

    await deleteCache('products:*')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin product DELETE error:', error)
    return NextResponse.json(
      { error: 'Не удалось удалить товар' },
      { status: 500 }
    )
  }
}
