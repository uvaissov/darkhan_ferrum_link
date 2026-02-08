import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем страницу логина и auth API
  if (pathname === '/admin' || pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next()
  }

  // Проверяем сессию для всех /admin/* и /api/admin/* маршрутов
  const session = request.cookies.get('admin_session')?.value
  if (session !== 'authenticated') {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+', '/api/admin/:path+'],
}
