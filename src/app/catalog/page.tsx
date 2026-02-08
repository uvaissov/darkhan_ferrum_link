import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/product-card'
import { CategorySidebar } from '@/components/catalog/category-sidebar'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Каталог',
  description: 'Каталог металлопроката и промышленных материалов',
}

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { order: 'asc' },
    }),
    prisma.product.findMany({
      include: { category: true },
      take: 20,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Каталог продукции</h1>

      <div className="flex gap-8">
        <CategorySidebar categories={categories} />

        <div className="flex-grow">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Товары не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
