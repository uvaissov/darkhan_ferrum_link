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

    const news = await prisma.news.findUnique({ where: { id } })

    if (!news) {
      return NextResponse.json(
        { error: 'Новость не найдена' },
        { status: 404 }
      )
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error('Admin news GET [id] error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить новость' },
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
    const { title, content, excerpt, image, published } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Заголовок обязателен' },
        { status: 400 }
      )
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Содержание обязательно' },
        { status: 400 }
      )
    }

    const existing = await prisma.news.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Новость не найдена' },
        { status: 404 }
      )
    }

    const slug = slugify(title)

    const duplicate = await prisma.news.findFirst({
      where: { slug, id: { not: id } },
    })
    if (duplicate) {
      return NextResponse.json(
        { error: 'Новость с таким slug уже существует' },
        { status: 400 }
      )
    }

    let publishedAt = existing.publishedAt
    if (published && !existing.publishedAt) {
      publishedAt = new Date()
    }
    if (!published) {
      publishedAt = null
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        image: image?.trim() || null,
        published: !!published,
        publishedAt,
      },
    })

    await deleteCache('news*')

    return NextResponse.json(news)
  } catch (error) {
    console.error('Admin news PUT error:', error)
    return NextResponse.json(
      { error: 'Не удалось обновить новость' },
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

    const news = await prisma.news.findUnique({ where: { id } })
    if (!news) {
      return NextResponse.json(
        { error: 'Новость не найдена' },
        { status: 404 }
      )
    }

    await prisma.news.delete({ where: { id } })

    await deleteCache('news*')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin news DELETE error:', error)
    return NextResponse.json(
      { error: 'Не удалось удалить новость' },
      { status: 500 }
    )
  }
}
