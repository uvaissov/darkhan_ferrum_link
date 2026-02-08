import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('Public news GET error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить новости' },
      { status: 500 }
    )
  }
}
