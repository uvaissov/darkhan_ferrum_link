import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: {
    default: 'Металлопрокат - Поставщик металлопроката в Казахстане',
    template: '%s | Металлопрокат',
  },
  description: 'Поставщик металлопроката и промышленных материалов в Казахстане. Более 2000 наименований продукции. Доставка по всему Казахстану.',
  keywords: ['металлопрокат', 'металл', 'сталь', 'арматура', 'труба', 'Астана', 'Казахстан'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
