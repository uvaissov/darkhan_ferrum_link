import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const callbacks = await prisma.callbackRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(callbacks)
  } catch (error) {
    console.error('Admin callbacks GET error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить заявки' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID и статус обязательны' },
        { status: 400 }
      )
    }

    const callback = await prisma.callbackRequest.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(callback)
  } catch (error) {
    console.error('Admin callbacks PATCH error:', error)
    return NextResponse.json(
      { error: 'Не удалось обновить статус заявки' },
      { status: 500 }
    )
  }
}
