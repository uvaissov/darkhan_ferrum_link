import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const news = await prisma.news.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, image: true },
  })

  if (!news) {
    return { title: 'Новость не найдена' }
  }

  const description = news.excerpt || news.title

  return {
    title: `${news.title} — Ferrum Link`,
    description,
    openGraph: {
      title: news.title,
      description,
      type: 'article',
      url: `/news/${slug}`,
      ...(news.image && { images: [{ url: news.image }] }),
    },
    alternates: {
      canonical: `/news/${slug}`,
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params

  const news = await prisma.news.findUnique({
    where: { slug },
  })

  if (!news || !news.published) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к новостям
        </Link>

        {news.image && (
          <div className="aspect-video rounded-lg overflow-hidden mb-6">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {news.title}
        </h1>

        {news.publishedAt && (
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
            <Calendar className="w-4 h-4" />
            {new Date(news.publishedAt).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        )}

        <div className="prose prose-gray max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {news.content}
          </div>
        </div>
      </div>
    </div>
  )
}
