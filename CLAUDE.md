# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

B2B металлопрокат каталог — e-commerce сайт для оптовой продажи металлопроката. Минимальная сумма заказа 30,000 тг.

## Commands

```bash
# Start infrastructure (PostgreSQL + Redis)
docker-compose up -d db redis

# Run development server
npm run dev

# Database operations
npx prisma migrate dev          # Create/apply migrations
npx prisma db seed              # Seed test data
npx prisma studio               # Database GUI

# Build for production
npm run build
npm start

# Lint
npm run lint
```

## Architecture

### Tech Stack
- **Next.js 16** (App Router, SSR/SSG)
- **Prisma 7** with PostgreSQL (requires `@prisma/adapter-pg`)
- **Redis** (ioredis) for API caching
- **Zustand** for cart state (persisted to localStorage)
- **Tailwind CSS v4**
- **Zod + react-hook-form** for validation

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (categories, products, orders, callback)
│   ├── catalog/[category]/[product]/  # Dynamic product pages
│   └── ...
├── components/
│   ├── ui/                # Reusable UI (Button, Input, Card, Badge, Modal)
│   ├── layout/            # Header, Footer, MobileMenu
│   ├── catalog/           # ProductCard, CategorySidebar, AddToCartButton
│   ├── cart/              # CartItems, OrderForm
│   ├── home/              # Hero, Features, CategoriesGrid
│   ├── forms/             # CallbackForm
│   └── calculator/        # MetalCalculator
├── lib/
│   ├── prisma.ts          # Prisma client singleton with PrismaPg adapter
│   ├── redis.ts           # Redis client + cache utilities (getCache, setCache)
│   ├── utils.ts           # cn() helper, formatPrice()
│   └── validations.ts     # Zod schemas
├── store/
│   └── cart.ts            # Zustand cart store with persist middleware
└── types/
    └── index.ts           # TypeScript interfaces
```

### Key Patterns

**Prisma 7 Configuration**: Uses `@prisma/adapter-pg` driver adapter. Database URL configured in `prisma.config.ts`, not in schema.prisma.

**Redis Caching**: API routes cache responses using `CACHE_KEYS` from `src/lib/redis.ts`. Default TTL 300s.

**Cart State**: Client-side Zustand store with localStorage persistence. Cart survives page reloads.

**Category Hierarchy**: Self-referential `Category` model with `parentId`. Root categories have `parentId: null`.

### Database Models
- `Category` — hierarchical (parent/children), has products
- `Product` — belongs to category, has JSON specifications
- `Order` / `OrderItem` — order with line items
- `CallbackRequest` — contact form submissions
- `News`, `Page` — content management

## Environment Variables

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/metalloprokat
REDIS_URL=redis://localhost:6379
```
