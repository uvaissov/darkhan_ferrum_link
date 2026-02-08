# SEO Meta-теги для Ferrum Link

## Контекст
Сайт ferrumlink.kz не имеет SEO-оптимизации: нет Open Graph тегов, robots.txt, sitemap, structured data. Поисковые системы (Google, Yandex) не смогут корректно индексировать и отображать сайт. Нужно добавить полный набор meta-тегов.

## План реализации

### 1. Корневой layout — расширить metadata
**Файл:** `src/app/layout.tsx`
- Добавить `metadataBase: new URL('https://ferrumlink.kz')`
- Добавить Open Graph теги (og:title, og:description, og:type, og:locale, og:site_name)
- Добавить Twitter Card теги (twitter:card, twitter:title, twitter:description)
- Добавить `alternates: { canonical: '/' }`
- Добавить `robots: { index: true, follow: true }`

### 2. robots.txt
**Создать:** `src/app/robots.ts`
- Разрешить всем ботам сканировать сайт
- Запретить `/admin/`, `/api/`, `/cart`
- Указать ссылку на sitemap: `https://ferrumlink.kz/sitemap.xml`

### 3. Динамический sitemap
**Создать:** `src/app/sitemap.ts`
- Статичные страницы: `/`, `/catalog`, `/about`, `/contacts`, `/delivery`, `/services`, `/calculator`, `/news`
- Динамические: все категории из БД
- Динамические: все товары из БД (через категорию)
- Динамические: все опубликованные новости из БД

### 4. Structured Data (JSON-LD)
**Создать:** `src/components/seo/json-ld.tsx`
- Компонент `OrganizationJsonLd` — данные о компании (ТОО Ferrum Link, адрес, email)
- Встроить в корневой layout

### 5. Админ-страницы — закрыть от индексации
**Файл:** `src/app/admin/layout.tsx`
- Добавить `robots: { index: false, follow: false }`

### 6. Динамические страницы — добавить OG-теги
**Файлы:**
- `src/app/catalog/[category]/page.tsx` — OG для категорий
- `src/app/catalog/[category]/[product]/page.tsx` — OG для товаров (+ изображение если есть)
- `src/app/news/[slug]/page.tsx` — OG для новостей (+ изображение если есть)

## Проверка
1. `npm run build` — убедиться что билд проходит
2. Открыть http://localhost:3000 — проверить meta-теги через DevTools
3. Проверить http://localhost:3000/robots.txt
4. Проверить http://localhost:3000/sitemap.xml
