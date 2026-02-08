import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/catalog/add-to-cart-button'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface ProductPageProps {
  params: Promise<{ category: string; product: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { product: productSlug } = await params
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
  })

  if (!product) return { title: 'Товар не найден' }

  const { category: categorySlug } = await params
  const description = product.description || product.name

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      url: `/catalog/${categorySlug}/${productSlug}`,
      ...(product.image && { images: [{ url: product.image }] }),
    },
    alternates: {
      canonical: `/catalog/${categorySlug}/${productSlug}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product: productSlug } = await params

  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: { category: true },
  })

  if (!product) {
    notFound()
  }

  const specifications = product.specifications as Record<string, string> | null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/catalog" className="text-gray-500 hover:text-orange-500">Каталог</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/catalog/${product.category.slug}`} className="text-gray-500 hover:text-orange-500">{product.category.name}</Link></li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Нет фото
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <Badge variant={product.inStock ? 'success' : 'error'}>
              {product.inStock ? 'В наличии' : 'Нет в наличии'}
            </Badge>
          </div>

          <p className="text-3xl font-bold text-orange-500 mb-6">
            {formatPrice(product.price ? Number(product.price) : null)}
            {product.price && <span className="text-lg text-gray-500 font-normal"> / {product.unit}</span>}
          </p>

          {product.description && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Описание</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {specifications && Object.keys(specifications).length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Характеристики</h2>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="text-gray-500">{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price ? Number(product.price) : null,
              unit: product.unit,
              image: product.image,
              inStock: product.inStock,
            }}
          />
        </div>
      </div>
    </div>
  )
}
