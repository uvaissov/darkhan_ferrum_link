import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { OrganizationJsonLd } from '@/components/seo/json-ld'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ferrumlink.kz'),
  title: {
    default: 'Ferrum Link - Поставщик металлопроката в Казахстане',
    template: '%s | Ferrum Link',
  },
  description: 'ТОО Ferrum Link — поставщик металлопроката и промышленных материалов в Казахстане. Более 2000 наименований продукции. Доставка по всему Казахстану.',
  keywords: ['металлопрокат', 'металл', 'сталь', 'арматура', 'труба', 'Астана', 'Казахстан', 'Ferrum Link'],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Ferrum Link',
    title: 'Ferrum Link - Поставщик металлопроката в Казахстане',
    description: 'ТОО Ferrum Link — поставщик металлопроката и промышленных материалов в Казахстане. Более 2000 наименований продукции.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ferrum Link - Поставщик металлопроката в Казахстане',
    description: 'ТОО Ferrum Link — поставщик металлопроката и промышленных материалов в Казахстане.',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <OrganizationJsonLd />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
