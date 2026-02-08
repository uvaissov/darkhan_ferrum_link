import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteCache } from '@/lib/redis'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('Admin news GET error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить новости' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const slug = slugify(title)

    const existing = await prisma.news.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'Новость с таким slug уже существует' },
        { status: 400 }
      )
    }

    const news = await prisma.news.create({
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        image: image?.trim() || null,
        published: !!published,
        publishedAt: published ? new Date() : null,
      },
    })

    await deleteCache('news*')

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Admin news POST error:', error)
    return NextResponse.json(
      { error: 'Не удалось создать новость' },
      { status: 500 }
    )
  }
}
