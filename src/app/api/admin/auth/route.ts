import { NextRequest, NextResponse } from 'next/server'
import { setSession, clearSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      )
    }

    await setSession()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Ошибка авторизации' },
      { status: 400 }
    )
  }
}

export async function DELETE() {
  await clearSession()
  return NextResponse.json({ success: true })
}
