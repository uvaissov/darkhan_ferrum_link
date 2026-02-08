import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/product-card'
import { CategorySidebar } from '@/components/catalog/category-sidebar'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (!category) return { title: 'Категория не найдена' }

  const description = category.description || `${category.name} - каталог продукции Ferrum Link`

  return {
    title: category.name,
    description,
    openGraph: {
      title: category.name,
      description,
      type: 'website',
      url: `/catalog/${categorySlug}`,
    },
    alternates: {
      canonical: `/catalog/${categorySlug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params

  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        products: {
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        },
        children: {
          include: {
            products: {
              include: { category: true },
            },
          },
        },
      },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { order: 'asc' },
    }),
  ])

  if (!category) {
    notFound()
  }

  // Собираем товары из категории и подкатегорий
  const products = [
    ...category.products,
    ...category.children.flatMap((child) => child.products),
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}

      <div className="flex gap-8">
        <CategorySidebar categories={allCategories} activeSlug={categorySlug} />

        <div className="flex-grow">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              В этой категории пока нет товаров
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
