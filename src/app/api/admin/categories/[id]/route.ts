import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteCache } from '@/lib/redis'
import { slugify } from '@/lib/utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, parentId, order } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Название обязательно' },
        { status: 400 }
      )
    }

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    const slug = slugify(name)

    const duplicate = await prisma.category.findFirst({
      where: { slug, id: { not: id } },
    })
    if (duplicate) {
      return NextResponse.json(
        { error: 'Категория с таким slug уже существует' },
        { status: 400 }
      )
    }

    if (parentId === id) {
      return NextResponse.json(
        { error: 'Категория не может быть родителем самой себя' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        parentId: parentId || null,
        order: order ?? 0,
      },
    })

    await deleteCache('categor*')

    return NextResponse.json(category)
  } catch (error) {
    console.error('Admin categories PUT error:', error)
    return NextResponse.json(
      { error: 'Не удалось обновить категорию' },
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

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `Невозможно удалить: в категории ${category._count.products} товар(ов)` },
        { status: 400 }
      )
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: `Невозможно удалить: у категории ${category._count.children} подкатегори(й)` },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })

    await deleteCache('categor*')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin categories DELETE error:', error)
    return NextResponse.json(
      { error: 'Не удалось удалить категорию' },
      { status: 500 }
    )
  }
}
