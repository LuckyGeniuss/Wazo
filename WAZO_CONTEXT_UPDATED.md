# WAZO.Market — Контекст Проекту

## Статус Проекту
**Останнє оновлення:** 2026-03-22  
**Версія:** 0.1.0  
**GitHub:** https://github.com/LuckyGeniuss/Wazo  
**Deploy:** https://wazo-market.vercel.app

## Технічний Стек
- **Framework:** Next.js 16 (App Router) + React + TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **Database:** PostgreSQL (Neon) + Prisma ORM
- **Auth:** Auth.js v5
- **State:** Zustand (для Visual Builder)
- **Multi-tenant:** Так, кожна таблиця з даними має `storeId`

## Архітектура
```
src/
├── app/
│   ├── (marketplace)/        # Головна і пошук
│   ├── (storefront)/[storeSlug]/  # Вітрини магазинів
│   ├── dashboard/[storeId]/  # Панель продавця
│   └── superadmin/           # Панель адміна
├── components/
│   ├── dashboard/            # Dashboard компоненти
│   └── providers/            # PostHog, Cart Sync, тощо
├── lib/                      # Утиліти, Prisma, Auth
└── prisma/
    ├── schema.prisma         # Схема БД
    └── seed.ts               # Seed data
```

## Що Працює
- ✅ Multi-tenant архітектура (кожен магазин ізольований)
- ✅ Dashboard для продавців (`/dashboard/[storeId]`)
- ✅ Управління товарами (CRUD)
- ✅ StoreSwitcher — перемикання між магазинами
- ✅ Sidebar з навігацією по розділах
- ✅ Auth.js v5 — автентифікація
- ✅ Prisma ORM — робота з БД
- ✅ TypeScript — типізація
- ✅ Build без помилок

## Виправлені Проблеми
1. **ProductId у URL:** Виправлено відображення товарів у Dashboard
2. **StoreSwitcher:** Отримує `storeId` як `string` через props
3. **ProductModal:** Прибрано зайвий імпорт з `products/page.tsx`
4. **Multi-tenant:** Усі API routes перевіряють tenant isolation

## Поточні Сторінки Dashboard
- `/dashboard/[storeId]` — огляд CRM
- `/dashboard/[storeId]/products` — товари
- `/dashboard/[storeId]/products/new` — створення товару
- `/dashboard/[storeId]/products/[productId]/edit` — редагування товару
- `/dashboard/[storeId]/categories` — категорії
- `/dashboard/[storeId]/inventory` — склад
- `/dashboard/[storeId]/orders` — замовлення
- `/dashboard/[storeId]/customers` — клієнти
- `/dashboard/[storeId]/analytics/funnel` — аналітика
- `/dashboard/[storeId]/settings` — налаштування

## Multi-Tenant Правила
1. Кожна таблиця з даними має `storeId`
2. Усі API routes перевіряють `storeId` + `ownerId`
3. Запити до БД фільтрують по `storeId`
4. `StoreSwitcher` отримує `storeId` як `string`

## SuperAdmin
- **Email:** sergey.varava@gmail.com
- **Роль:** Власник платформи

## Останні Зміни
- **fix:** Прибрано невикористаний імпорт `ProductModal` з `products/page.tsx`
- **fix:** `storeId` передається через props у `ProductsClient`
- **fix:** `StoreSwitcher` правильно знаходить `currentStore`

## Контакти
- **GitHub:** https://github.com/LuckyGeniuss/Wazo
- **Deploy:** https://wazo-market.vercel.app
