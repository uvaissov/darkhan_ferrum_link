import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteCache } from '@/lib/redis'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true, products: true } },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Admin categories GET error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить категории' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, parentId, order } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Название обязательно' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'Категория с таким slug уже существует' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        parentId: parentId || null,
        order: order ?? 0,
      },
    })

    await deleteCache('categor*')

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Admin categories POST error:', error)
    return NextResponse.json(
      { error: 'Не удалось создать категорию' },
      { status: 500 }
    )
  }
}
