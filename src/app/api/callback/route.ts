import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { callbackSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = callbackSchema.parse(body)

    const callback = await prisma.callbackRequest.create({
      data: validated,
    })

    return NextResponse.json({ success: true, id: callback.id })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json(
      { error: 'Ошибка при отправке заявки' },
      { status: 400 }
    )
  }
}
