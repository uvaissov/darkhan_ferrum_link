import { Category, Product, Order, OrderItem } from '@prisma/client'

export type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[]
  products?: Product[]
}

export type ProductWithCategory = Product & {
  category: Category
}

export type OrderWithItems = Order & {
  items: OrderItem[]
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  unit: string
  image?: string
}

export interface FilterParams {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  page?: number
  limit?: number
}
