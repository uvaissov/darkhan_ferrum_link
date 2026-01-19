import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CategoryWithChildren } from '@/types'

interface CategorySidebarProps {
  categories: CategoryWithChildren[]
  activeSlug?: string
}

export function CategorySidebar({ categories, activeSlug }: CategorySidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0">
      <h2 className="font-bold text-lg mb-4">Категории</h2>
      <nav className="space-y-1">
        <Link
          href="/catalog"
          className={cn(
            'block py-2 px-3 rounded hover:bg-gray-100',
            !activeSlug && 'bg-orange-100 text-orange-600'
          )}
        >
          Все товары
        </Link>
        {categories.map((category) => (
          <div key={category.id}>
            <Link
              href={`/catalog/${category.slug}`}
              className={cn(
                'block py-2 px-3 rounded hover:bg-gray-100',
                activeSlug === category.slug && 'bg-orange-100 text-orange-600'
              )}
            >
              {category.name}
            </Link>
            {category.children && category.children.length > 0 && (
              <div className="ml-4 space-y-1">
                {category.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/catalog/${child.slug}`}
                    className={cn(
                      'block py-1.5 px-3 text-sm text-gray-600 rounded hover:bg-gray-100',
                      activeSlug === child.slug && 'bg-orange-100 text-orange-600'
                    )}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
