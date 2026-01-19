import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Утилиты для кеширования
export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  if (!data) return null
  return JSON.parse(data) as T
}

export async function setCache<T>(key: string, data: T, ttl: number = 300): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(data))
}

export async function deleteCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

// Ключи кеша
export const CACHE_KEYS = {
  categories: 'categories:all',
  category: (slug: string) => `category:${slug}`,
  products: (params: string) => `products:${params}`,
  product: (slug: string) => `product:${slug}`,
}
