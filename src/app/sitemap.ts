import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://ferrumlink.kz'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contacts`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/delivery`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/services`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/calculator`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  })

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/catalog/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
  })

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/catalog/${product.category.slug}/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const news = await prisma.news.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${BASE_URL}/news/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticPages, ...categoryPages, ...productPages, ...newsPages]
}
