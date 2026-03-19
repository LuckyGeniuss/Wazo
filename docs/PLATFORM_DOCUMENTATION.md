# 📚 PLATFORM_DOCUMENTATION.md
## Enterprise Multi-tenant SaaS Ecosystem — Полная Техническая Документация

> **Версия:** 1.0 | **Дата:** Март 2026 | **Статус:** Фазы 1–7 завершены ✅

---

## 📋 Содержание

1. [Обзор платформы](#1-обзор-платформы)
2. [Технический стек](#2-технический-стек)
3. [Архитектура системы](#3-архитектура-системы)
4. [Модуль: Ядро и Авторизация (Core & Auth)](#4-модуль-ядро-и-авторизация)
5. [Модуль: E-commerce Движок](#5-модуль-e-commerce-движок)
6. [Модуль: Visual Page Builder](#6-модуль-visual-page-builder)
7. [Модуль: Глобальный Маркетплейс](#7-модуль-глобальный-маркетплейс)
8. [Модуль: CRM и Аналитика](#8-модуль-crm-и-аналитика)
9. [Модуль: SuperAdmin Panel](#9-модуль-superadmin-panel)
10. [Модуль: Enterprise API v1 и Webhooks](#10-модуль-enterprise-api-v1-и-webhooks)
11. [Модуль: AI-ассистент (BYOK)](#11-модуль-ai-ассистент-byok)
12. [Модуль: Монетизация (Stripe)](#12-модуль-монетизация-stripe)
13. [Модуль: Email и Маркетинг](#13-модуль-email-и-маркетинг)
14. [База данных: Prisma Schema](#14-база-данных-prisma-schema)
15. [Инструкция по запуску](#15-инструкция-по-запуску)
16. [SEO и Производительность](#16-seo-и-производительность)
17. [Тестирование](#17-тестирование)
18. [Структура папок](#18-структура-папок)
19. [Будущие задачи: Фазы 8–10](#19-будущие-задачи-фазы-8-10)

---

## 1. Обзор платформы

### Что это?

**Enterprise Multi-tenant SaaS Ecosystem** — это B2B2C платформа полного стека, которая объединяет:

| Компонент | Аналог | Статус |
|-----------|--------|--------|
| Мультитенантный SaaS маркетплейс | Shopify / Prom.ua | ✅ Реализован |
| Визуальный конструктор сайтов | Webflow / Wix | ✅ Реализован |
| CRM с канбан-доской заказов | Bitrix24 | ✅ Реализован |
| Enterprise API + Webhooks | Shopify Admin API | ✅ Реализован |
| SuperAdmin панель управления | — | ✅ Реализован |
| AI-ассистент (BYOK модель) | — | ✅ Реализован |

### Бизнес-модель

- **B2B2C**: Платформа продаёт подписки магазинам (B2B), магазины продают товары покупателям (B2C).
- **Multi-tenant**: Одна кодовая база и одна БД обслуживают тысячи изолированных магазинов через `storeId`/`tenantId`.
- **Marketplace**: Все магазины представлены на едином глобальном маркетплейсе с лентой и поиском.
- **Монетизация**: Stripe подписки (BASIC / PRO / ENTERPRISE) + процент с продаж (планируется в Фазе 9).

### Ключевые принципы

1. **Multi-tenancy First**: каждая строка данных содержит `storeId` — полная изоляция арендаторов.
2. **JSON-driven Builder**: страницы конструктора хранятся как JSON-схемы в БД, рендер на стороне клиента.
3. **API-first**: весь функционал дашборда доступен через REST API v1 с Bearer Token.
4. **RBAC**: 8 ролей (`SUPERADMIN`, `ADMIN`, `SELLER`, `MANAGER`, `MARKETER`, `OWNER`, `SUPPORT`, `USER`).
5. **ISR + SEO**: все публичные страницы с Incremental Static Regeneration и JSON-LD разметкой.

---

## 2. Технический стек

### Основной стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Next.js** | 16.1.6 | Фреймворк (App Router, Server Actions, ISR) |
| **React** | 19.2.4 | UI библиотека |
| **TypeScript** | 5.9.3 | Строгая типизация |
| **Tailwind CSS** | 4.x | Стили (utility-first) |
| **Prisma ORM** | 6.19.2 | Работа с БД |
| **PostgreSQL** | — | Основная база данных |

### Ключевые библиотеки

| Библиотека | Версия | Назначение |
|------------|--------|------------|
| **NextAuth (Auth.js)** | 5.0.0-beta.30 | Аутентификация + RBAC |
| **@auth/prisma-adapter** | 2.11.1 | Интеграция NextAuth с Prisma |
| **Zustand** | 5.0.11 | Глобальное состояние (Builder, Cart) |
| **@dnd-kit/core** | 6.3.1 | Drag & Drop в конструкторе |
| **@dnd-kit/sortable** | 10.0.0 | Сортировка блоков |
| **framer-motion** | 12.35.2 | Анимации |
| **Recharts** | 3.8.0 | Графики в аналитике |
| **Stripe** | 20.4.1 | Платёжная система |
| **Resend** | 6.9.3 | Email транзакций |
| **React Email** | 5.2.9 | Шаблоны писем |
| **Cloudinary** | 2.9.0 | Хранение и трансформация медиа |
| **Zod** | 4.3.6 | Валидация данных (runtime + types) |
| **React Hook Form** | 7.71.2 | Управление формами |
| **AI SDK (Google)** | 3.0.43 | Интеграция Gemini AI |
| **@google/generative-ai** | 0.24.1 | Google AI клиент |
| **bcryptjs** | 3.0.3 | Хэширование паролей |
| **date-fns** | 4.1.0 | Работа с датами |
| **Sonner** | 2.0.7 | Toast уведомления |
| **Lucide React** | 0.577.0 | Иконки |
| **Playwright** | 1.58.2 | E2E тестирование |
| **PapaParse** | 5.5.3 | CSV парсинг/генерация |

### Инфраструктура

| Сервис | Назначение |
|--------|------------|
| **Neon / Supabase** | Managed PostgreSQL |
| **Vercel** | Деплой + Edge Functions + Cron Jobs |
| **Cloudinary** | CDN для изображений и видео |
| **Stripe** | Платежи + Webhooks |
| **Resend** | Транзакционная почта |
| **OpenAI / Gemini** | AI генерация (BYOK) |

---

## 3. Архитектура системы

### Структура URL-пространства

```
/                          → Глобальный маркетплейс (публичный)
/search                    → Поиск по маркетплейсу
/feed                      → Алгоритмическая лента
/cart                      → Корзина покупателя
/account                   → Личный кабинет покупателя
/[storeSlug]               → Витрина конкретного магазина
/[storeSlug]/[pageSlug]    → Кастомная страница магазина (Builder)
/[storeSlug]/product/[id]  → Страница товара
/dashboard/[storeId]       → Дашборд продавца
/superadmin                → Панель SuperAdmin
/api/v1/...                → Public REST API
/api/public/v1/...         → Protected API (Bearer Token)
/api/feeds/[slug]          → XML/YML Feed Export
/api/stripe/...            → Stripe Webhooks
/api/cron/...              → Cron Jobs (Vercel)
```

### Multi-tenancy: изоляция данных

```
Tenant A (storeId: "abc") ──┐
                             ├── PostgreSQL (единая БД)
Tenant B (storeId: "def") ──┘   WHERE storeId = $tenantId
```

Все запросы к данным магазина выполняются через `verifyStoreOwnership(storeId, userId)` в Server Actions, что обеспечивает изоляцию на уровне приложения.

### Middleware и RBAC

[`src/middleware.ts`](src/middleware.ts) обрабатывает все входящие запросы:
- Проверка авторизации (NextAuth session)
- Редирект на `/login` для неавторизованных
- Проверка роли для `/dashboard`, `/superadmin`
- Блокировка забаненных (`/banned`)
- Maintenance mode (`/maintenance`)

---

## 4. Модуль: Ядро и Авторизация

### Файлы

| Файл | Назначение |
|------|------------|
| [`src/auth.ts`](src/auth.ts) | Конфигурация Auth.js v5 |
| [`src/middleware.ts`](src/middleware.ts) | Edge Middleware: RBAC + защита роутов |
| [`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx) | Страница входа |
| [`src/app/(auth)/register/page.tsx`](src/app/(auth)/register/page.tsx) | Регистрация |
| [`src/actions/auth.ts`](src/actions/auth.ts) | Server Actions авторизации |
| [`src/app/banned/page.tsx`](src/app/banned/page.tsx) | Страница для забаненных |
| [`src/app/maintenance/page.tsx`](src/app/maintenance/page.tsx) | Режим обслуживания |

### Роли RBAC

```
SUPERADMIN  → полный доступ ко всему, включая /superadmin
ADMIN       → управление платформой
SELLER      → владелец магазина (полный дашборд)
OWNER       → совладелец магазина
MANAGER     → менеджер магазина (заказы, товары)
MARKETER    → маркетолог (страницы, баннеры)
SUPPORT     → поддержка (только заказы и клиенты)
USER        → покупатель
```

### Система команд магазина

- [`src/actions/team.ts`](src/actions/team.ts) — приглашение участников, управление ролями
- [`src/app/dashboard/[storeId]/settings/team/`](src/app/dashboard/[storeId]/settings/team/) — UI управления командой
- [`src/app/invite/[token]/page.tsx`](src/app/invite/[token]/page.tsx) — страница принятия приглашения по токену
- Таблица `StoreTeamMember` + `StoreInvite` в БД

### Impersonation (SuperAdmin)

[`src/components/dashboard/role-switcher.tsx`](src/components/dashboard/role-switcher.tsx) — SuperAdmin может временно работать от имени любого пользователя для отладки.

---

## 5. Модуль: E-commerce Движок

### Товары

| Файл | Назначение |
|------|------------|
| [`src/actions/product.ts`](src/actions/product.ts) | CRUD товаров + Webhook dispatch |
| [`src/app/dashboard/[storeId]/products/`](src/app/dashboard/[storeId]/products/) | UI каталога товаров |
| [`src/lib/validations/product.ts`](src/lib/validations/product.ts) | Zod-схема товара |
| [`src/lib/integrations/opencart/sync.ts`](src/lib/integrations/opencart/sync.ts) | Синхронизация с OpenCart |

**Возможности:**
- Grid/List view с inline редактированием
- Варианты товаров (`ProductVariant`) с SKU, ценой, остатком
- Атрибуты `Json` (цвет, размер, материал)
- Архивирование (`isArchived`) и черновики (`isDraft`)
- Upsell / Order Bump (`upsellProductId`)
- Флаг `allowRFQ` для B2B запросов цены
- Интеграция Cloudinary для медиа
- Автодиспетч Webhook при CRUD операциях

### Заказы

| Файл | Назначение |
|------|------------|
| [`src/actions/order.ts`](src/actions/order.ts) | CRUD заказов + статусы |
| [`src/app/dashboard/[storeId]/orders/`](src/app/dashboard/[storeId]/orders/) | UI управления заказами |
| [`src/app/dashboard/[storeId]/orders/kanban-board.tsx`](src/app/dashboard/[storeId]/orders/kanban-board.tsx) | Kanban-доска заказов |

**Статусы заказов:** `PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED` → `CANCELLED` → `REFUNDED`

### Логистика

[`src/app/dashboard/[storeId]/logistics/`](src/app/dashboard/[storeId]/logistics/) — управление:
- `DeliveryMethod` (название, описание, цена, срок)
- `PaymentMethod` (наличные, карта, наложенный платёж)
- `TaxRate` (процент налога по категории)

### Система скидок

| Файл | Назначение |
|------|------------|
| [`src/lib/price-calculator.ts`](src/lib/price-calculator.ts) | Калькулятор цены с учётом скидок |
| [`src/modules/crm/actions/customer-group.ts`](src/modules/crm/actions/customer-group.ts) | Группы покупателей |

**Уровни цен (приоритет по убыванию):**
1. `PriceList.price` (персональный B2B прайс, Фаза 8)
2. `CustomerGroup.discountPercentage` (групповая скидка)
3. `Coupon` (купон: PERCENTAGE / FIXED, stackable)
4. `Product.compareAtPrice` (базовая цена без скидки)

### Корзина

| Файл | Назначение |
|------|------------|
| [`src/hooks/use-cart.ts`](src/hooks/use-cart.ts) | Zustand store корзины |
| [`src/app/cart/page.tsx`](src/app/cart/page.tsx) | Страница корзины с upsell |
| [`src/hooks/use-cart-sync.ts`](src/hooks/use-cart-sync.ts) | Синхронизация при логине |

**Особенности Multi-Store Cart:**
- Корзина группируется по магазинам (`getItemsByStore()`)
- `getStoreTotals()` — итоги по каждому магазину
- `applyCoupon()` — применение купонов
- Персистентность в `localStorage` через Zustand persist

---

## 6. Модуль: Visual Page Builder

### Концепция

Конструктор работает на основе **JSON-схем**: страница хранится как массив блоков в поле `Page.content: Json`, а фронтенд рендерит их динамически без генерации кода.

```json
{
  "blocks": [
    { "id": "block-1", "type": "hero", "props": { "title": "Заголовок", "backgroundImage": "..." } },
    { "id": "block-2", "type": "productGrid", "props": { "categoryId": "...", "columns": 4 } }
  ]
}
```

### Файлы

| Файл | Назначение |
|------|------------|
| [`src/hooks/use-builder.ts`](src/hooks/use-builder.ts) | Zustand store: блоки, undo/redo, мультиселект |
| [`src/app/dashboard/[storeId]/builder/[pageId]/client-builder.tsx`](src/app/dashboard/[storeId]/builder/[pageId]/client-builder.tsx) | Canvas редактора |
| [`src/actions/page.ts`](src/actions/page.ts) | Server Actions для страниц |
| [`src/types/builder.ts`](src/types/builder.ts) | TypeScript типы блоков |

### Доступные блоки

| Блок | Файл | Описание |
|------|------|----------|
| `hero` | — | Hero секция с фоном, заголовком, CTA |
| `heroBanner` | [`hero-banner-block.tsx`](src/modules/builder/components/hero-banner-block.tsx) | Карусель баннеров из БД |
| `button` | [`button-block.tsx`](src/modules/builder/components/button-block.tsx) | CTA кнопка с настройками |
| `divider` | [`divider-block.tsx`](src/modules/builder/components/divider-block.tsx) | Разделитель с SVG shape |
| `testimonials` | [`testimonials-block.tsx`](src/modules/builder/components/testimonials-block.tsx) | Отзывы клиентов |
| `video` | [`video-block.tsx`](src/modules/builder/components/video-block.tsx) | Embed видео (YouTube/Vimeo) |
| `countdown` | [`countdown-timer-block.tsx`](src/modules/builder/components/countdown-timer-block.tsx) | Таймер обратного отсчёта |
| `newsletter` | [`newsletter-form-block.tsx`](src/modules/builder/components/newsletter-form-block.tsx) | Форма подписки |
| `productGrid` | — | Сетка товаров из каталога |
| `columns` | — | Вложенный контейнер колонок |
| `gridContainer` | — | 12-колонная сетка (autoFit, gap) |
| `adSlot` | — | Рекламный слот (HTML/Script) |
| `heroCarousel` | — | Карусель секций (embla-carousel) |
| `accordion` | — | Аккордеон (FAQ) |
| `popup` | — | Попап баннер (trigg: onLoad/exitIntent) |
| `shapeDivider` | — | SVG разделители (wave/slant/triangle) |

### Возможности редактора

- **Drag & Drop** via `@dnd-kit` — перетаскивание блоков, перенос между колонками
- **Undo / Redo** — история изменений в Zustand
- **Multi-select** — выбор нескольких блоков через Ctrl+Click
- **Zoom** — 10% до 200%, горячие клавиши `+`/`-`
- **Preview mode** — рендер как на витрине
- **Responsive settings** — `hideOnMobile` / `hideOnDesktop` для блоков
- **Анимации** — framer-motion (fade, slide, scale) в настройках блока

### Блок-рендерер

[`src/components/renderers/block-renderer.tsx`](src/components/renderers/block-renderer.tsx) — универсальный компонент витрины, который принимает массив блоков из JSON и рендерит их рекурсивно.

### Темы и Branding

| Файл | Назначение |
|------|------------|
| [`src/app/dashboard/[storeId]/settings/theme/`](src/app/dashboard/[storeId]/settings/theme/) | UI настройки темы |

**`Store.themeConfig` (JSON):**
```json
{
  "primaryColor": "#3B82F6",
  "fontFamily": "Inter",
  "headingFont": "Playfair Display",
  "borderRadius": "0.5rem",
  "buttonStyle": "filled",
  "darkMode": false,
  "logoUrl": "https://...",
  "gradient": { "from": "#...", "to": "#...", "direction": "to-r" },
  "glassmorphism": false
}
```

**Пресеты тем:** Ocean, Sunset, Forest, Minimal Dark.
**Экспорт/Импорт** темы в JSON через дашборд.

---

## 7. Модуль: Глобальный Маркетплейс

### Публичные страницы

| Маршрут | Файл | Описание |
|---------|------|----------|
| `/` | [`src/app/(marketplace)/page.tsx`](src/app/(marketplace)/page.tsx) | Главная маркетплейса |
| `/search` | [`src/app/(marketplace)/search/page.tsx`](src/app/(marketplace)/search/page.tsx) | Поиск с фильтрами |
| `/feed` | [`src/app/(marketplace)/feed/page.tsx`](src/app/(marketplace)/feed/page.tsx) | Алгоритмическая лента |
| `/[storeSlug]` | [`src/app/(storefront)/[storeSlug]/page.tsx`](src/app/(storefront)/[storeSlug]/page.tsx) | Витрина магазина |
| `/[storeSlug]/product/[id]` | [`src/app/(storefront)/[storeSlug]/product/[productId]/page.tsx`](src/app/(storefront)/[storeSlug]/product/[productId]/page.tsx) | Страница товара |

### Feed Score Engine

[`src/lib/marketplace/feed-algorithm.ts`](src/lib/marketplace/feed-algorithm.ts) — алгоритм ранжирования товаров в ленте:

```
feedScore = featured(+40) + discount(+20) + rating(×2) + recentSales + views
```

### Навигация

| Компонент | Файл | Описание |
|-----------|------|----------|
| `MarketplaceHeader` | [`marketplace-header.tsx`](src/components/navigation/marketplace-header.tsx) | Шапка маркетплейса |
| `MegaMenu` | [`mega-menu.tsx`](src/components/navigation/mega-menu.tsx) | Категории с предпросмотром |
| `LiveSearch` | [`live-search.tsx`](src/components/navigation/live-search.tsx) | Поиск с debounce + история |
| `FloatingAiChat` | [`floating-ai-chat.tsx`](src/components/navigation/floating-ai-chat.tsx) | AI чат-ассистент |

### Компоненты витрины

| Компонент | Файл | Описание |
|-----------|------|----------|
| `ProductCard` | [`product-card.tsx`](src/components/renderers/product-card.tsx) | Карточка с Quick View, Gallery Hover, Swatches |
| `ProductGrid` | [`product-grid.tsx`](src/components/renderers/product-grid.tsx) | Сетка товаров |
| `CategoryFilterSidebar` | [`category-filter-sidebar.tsx`](src/components/renderers/category-filter-sidebar.tsx) | Сайдбар фильтров + ползунок цены |
| `ReviewForm` | [`review-form.tsx`](src/components/renderers/review-form.tsx) | Форма отзыва |
| `OrderButton` | [`order-button.tsx`](src/components/renderers/order-button.tsx) | Кнопка заказа |

### Социальные фичи

- **Wishlist**: [`src/actions/wishlist.ts`](src/actions/wishlist.ts) — добавление/удаление из избранного
- **Reviews**: система отзывов с `Verified Purchase` проверкой, `avgRating`, `reviewsCount`
- **Loyalty Points**: `User.loyaltyPoints` — начисляются через Stripe Webhook при оплате
- **ShoppableVideo**: модель `ShoppableVideo` со связями на `Product` и `Store`

---

## 8. Модуль: CRM и Аналитика

### Дашборд продавца

[`src/app/dashboard/[storeId]/`](src/app/dashboard/[storeId]/) — центральный раздел управления магазином.

**Секции:**
- 📊 **Analytics** — Revenue, GMV, Orders, AOV карточки + Recharts AreaChart
- 🛒 **Orders** — таблица + Kanban-доска со сменой статусов
- 📦 **Products** — каталог (Grid/List, Quick Edit, Bulk Actions)
- 👥 **Customers** — список покупателей с историей заказов
- 🏗️ **Builder** — конструктор страниц
- 📝 **Pages** — список страниц конструктора
- 🖼️ **Banners** — CRUD рекламных баннеров
- 🚚 **Logistics** — методы доставки/оплаты, налоги
- ⚙️ **Settings** — настройки магазина, тема, команда, API, Webhooks, Feeds

### Аналитика

[`src/app/dashboard/[storeId]/analytics-client.tsx`](src/app/dashboard/[storeId]/analytics-client.tsx):
- **Bento-grid layout** с каскадными анимациями
- `AreaChart` — выручка по дням
- `BarChart` — заказы по дням
- `PieChart` — топ категории
- Top Products по продажам
- Метрики: GMV, AOV, Conversion Rate

### Группы покупателей CRM

[`src/modules/crm/`](src/modules/crm/) — расширенная CRM:
- `CustomerGroup` с `discountPercentage`
- Назначение покупателей в группы
- Интеграция с `PriceCalculator` для автоматических скидок

---

## 9. Модуль: SuperAdmin Panel

### Назначение

Изолированный раздел `/superadmin` с доступом только для роли `SUPERADMIN`. Управление всей платформой.

### Разделы

| Раздел | Файл | Функционал |
|--------|------|------------|
| Дашборд | [`src/app/superadmin/page.tsx`](src/app/superadmin/page.tsx) | Global GMV, KPI, Recharts |
| Магазины | [`src/app/superadmin/stores/`](src/app/superadmin/stores/) | Поиск, фильтр, бан/активация |
| Пользователи | [`src/app/superadmin/users/`](src/app/superadmin/users/) | Управление, бан/разбан, смена роли |
| Категории | [`src/app/superadmin/categories/`](src/app/superadmin/categories/) | Дерево категорий + DnD сортировка |
| Подписки | [`src/app/superadmin/subscriptions/`](src/app/superadmin/subscriptions/) | MRR, ARR, Churn Rate |
| Настройки | [`src/app/superadmin/settings/`](src/app/superadmin/settings/) | Лимиты тарифов, Maintenance mode |

### Server Actions SuperAdmin

[`src/actions/superadmin.ts`](src/actions/superadmin.ts) — все операции SuperAdmin с проверкой роли.

### Platform Settings

Модель `PlatformSettings` (singleton) хранит:
- Лимиты тарифов (products, pages, teammates per plan)
- Maintenance mode on/off
- Глобальные настройки комиссии (планируется Фаза 9)

---

## 10. Модуль: Enterprise API v1 и Webhooks

### Public REST API

**Base URL:** `/api/v1/`

| Эндпоинт | Метод | Описание |
|----------|-------|----------|
| `/api/v1/products` | GET | Список товаров с пагинацией и фильтрами |
| `/api/v1/stores` | GET | Список магазинов |
| `/api/v1/search` | GET | Полнотекстовый поиск |

### Protected API (Bearer Token)

**Base URL:** `/api/public/v1/`

**Аутентификация:** `Authorization: Bearer <token>`

| Эндпоинт | Метод | Описание |
|----------|-------|----------|
| `/api/public/v1/inventory` | POST | Bulk обновление цен и остатков |

**Модель `ApiToken`:**
- `scopes: String[]` — права токена (read:products, write:orders, etc.)
- `sha256` — хранится хэш, не сам токен
- `tokenPrefix` — отображается в UI для идентификации
- `expiresAt` — TTL токена
- `lastUsedAt` — трекинг использования

**Rate Limiting:** [`src/lib/api/auth-middleware.ts`](src/lib/api/auth-middleware.ts) — 100 req/min per token.

### YML / XML Feed Export

[`src/lib/feeds/yml-generator.ts`](src/lib/feeds/yml-generator.ts) — генератор прайс-фидов.

**Форматы:**
- **YML** — Prom.ua / Яндекс.Маркет
- **Google Shopping XML** — Google Merchant Center
- **CSV** — универсальный

**Публичный эндпоинт:** `/api/feeds/[slug]` с `Cache-Control: max-age=3600`.

### Webhooks System

| Компонент | Файл | Описание |
|-----------|------|----------|
| Dispatcher | `src/lib/webhooks/dispatcher.ts` | Отправка + retry логика |
| Retry Cron | `src/app/api/cron/webhooks/route.ts` | Повтор каждые 5 минут |
| UI | `src/app/dashboard/[storeId]/settings/webhooks/` | Управление + логи |

**События Webhooks:**
```
ORDER_CREATED | ORDER_STATUS_CHANGED | ORDER_PAID
PRODUCT_CREATED | PRODUCT_UPDATED | PRODUCT_DELETED | LOW_STOCK_ALERT
```

**Retry расписание:** 1мин → 5мин → 30мин → 2ч → 24ч → деактивация.

**Безопасность:** HMAC-SHA256 подпись в заголовке `X-Platform-Signature`.

---

## 11. Модуль: AI-ассистент (BYOK)

### Концепция BYOK

**Bring Your Own Key**: пользователь может добавить свои API ключи OpenAI/Gemini в настройках магазина (`Integration` модель). Если ключей нет — используются системные ключи платформы с лимитом 20 генераций (`User.aiGenerationsCount`).

### Файлы

| Файл | Описание |
|------|----------|
| [`src/lib/ai/ai-service.ts`](src/lib/ai/ai-service.ts) | Единый AI-сервис (Gemini + OpenAI) |
| [`src/app/api/ai/generate/route.ts`](src/app/api/ai/generate/route.ts) | Генерация контента |
| [`src/app/api/ai/chat/route.ts`](src/app/api/ai/chat/route.ts) | Чат-режим с streaming |
| [`src/components/navigation/floating-ai-chat.tsx`](src/components/navigation/floating-ai-chat.tsx) | Floating AI виджет |

### Возможности AI

- Генерация описаний товаров (мультиязычная)
- SEO-рерайт мета-тегов
- Кнопка "AI Write" в конструкторе страниц
- AI Chat на витрине магазина (ответы на вопросы покупателей)
- Парсинг и структурирование данных

---

## 12. Модуль: Монетизация (Stripe)

### Подписки

| Файл | Описание |
|------|----------|
| [`src/app/api/stripe/checkout/route.ts`](src/app/api/stripe/checkout/route.ts) | Создание Checkout Session |
| [`src/app/api/stripe/webhook/route.ts`](src/app/api/stripe/webhook/route.ts) | Обработка Stripe Events |
| [`src/lib/stripe.ts`](src/lib/stripe.ts) | Stripe клиент |

**Модель `Subscription`:** `plan`, `status`, `stripeCustomerId`, `stripeSubscriptionId`, `currentPeriodEnd`.

**Обрабатываемые события:**
- `payment_intent.succeeded` — фиксируем оплату заказа
- `invoice.paid` — обновляем подписку, начисляем Loyalty Points
- `customer.subscription.deleted` — деактивируем подписку

### Checkout

[`src/app/(marketplace)/checkout/`](src/app/(marketplace)/checkout/) — Guest Checkout в 3 шага:
1. Контакты (email, имя)
2. Доставка (выбор метода из `DeliveryMethod`)
3. Оплата (Stripe Elements)

[`src/app/(marketplace)/checkout/success/`](src/app/(marketplace)/checkout/success/) — страница успеха с confetti + детали заказа.

---

## 13. Модуль: Email и Маркетинг

### Email шаблоны (React Email)

| Шаблон | Файл | Триггер |
|--------|------|---------|
| Подтверждение заказа | [`src/emails/order-confirmation.tsx`](src/emails/order-confirmation.tsx) | `order.status = PROCESSING` |
| Брошенная корзина | [`src/emails/abandoned-cart.tsx`](src/emails/abandoned-cart.tsx) | Cron каждые 15мин |

### Abandoned Cart Recovery

| Файл | Описание |
|------|----------|
| [`src/app/api/cron/abandoned-carts/route.ts`](src/app/api/cron/abandoned-carts/route.ts) | Cron задача (каждые 15 мин) |
| [`src/components/providers/cart-sync-provider.tsx`](src/components/providers/cart-sync-provider.tsx) | Синхронизация корзины при авторизации |

**Логика:** Cron находит корзины старше 1 часа без заказа → отправляет email через Resend с CTA кнопкой.

### Баннеры

[`src/app/dashboard/[storeId]/banners/`](src/app/dashboard/[storeId]/banners/) — CRUD рекламных баннеров.

**Модель `Banner`:**
```
storeId, title, imageUrl, linkUrl, isActive, isGlobal, location, sortOrder
```

**Локации:** главная маркетплейса, витрина магазина, страница категории.

---

## 14. База данных: Prisma Schema

**Файл:** [`prisma/schema.prisma`](prisma/schema.prisma)

### Ключевые модели

| Модель | Поля | Связи |
|--------|------|-------|
| `User` | id, name, email, role, isBanned, loyaltyPoints, aiGenerationsCount | stores, reviews, carts, wishlists, storeTeamMembers |
| `Store` | id, name, slug, domain, ownerId, themeConfig, isSuspended | products, orders, pages, banners, team |
| `Product` | id, storeId, name, price, compareAtPrice, stock, sku, categoryId, allowRFQ | variants, images, reviews, orderItems |
| `ProductVariant` | id, productId, sku, price, stock, attributes | — |
| `Category` | id, storeId, name, slug, parentId, seoTitle, isFeatured | children, products |
| `Order` | id, storeId, status, total, customerEmail, deliveryMethodId | items, review |
| `OrderItem` | id, orderId, productId, quantity, price | — |
| `Page` | id, storeId, title, slug, content (Json), isPublished | — |
| `Banner` | id, storeId, title, imageUrl, linkUrl, isActive, isGlobal, location | — |
| `Coupon` | id, storeId, code, type, value, isStackable, expiresAt | — |
| `Review` | id, productId, storeId, userId, rating, comment, isVerifiedPurchase | — |
| `Wishlist` | id, userId, productId, storeId | — |
| `Cart` | id, userId, sessionId, items (Json) | — |
| `Webhook` | id, storeId, url, events, secret, isActive | deliveries |
| `WebhookDelivery` | id, webhookId, event, status, responseCode, retryCount, nextRetryAt | — |
| `ApiToken` | id, storeId, name, tokenPrefix, hashedToken, scopes, expiresAt, lastUsedAt | — |
| `ExportFeed` | id, storeId, name, slug, format (YML/XML/CSV), isActive | — |
| `Subscription` | id, storeId, plan, status, stripeCustomerId, stripeSubscriptionId | — |
| `Integration` | id, storeId, type (OPENAI/GEMINI/OPENCART), apiKey, isActive | — |
| `StoreTeamMember` | id, storeId, userId, role | — |
| `StoreInvite` | id, storeId, email, token, role, expiresAt, isAccepted | — |
| `CustomerGroup` | id, storeId, name, discountPercentage | users |
| `DeliveryMethod` | id, storeId, name, price, estimatedDays | — |
| `PaymentMethod` | id, storeId, name, description | — |
| `TaxRate` | id, storeId, name, rate, categoryId | — |
| `PlatformSettings` | id (singleton), maintenanceMode, planLimits (Json) | — |
| `ShoppableVideo` | id, storeId, title, videoUrl, productIds | — |

### Enum типы

```prisma
enum Role { SUPERADMIN ADMIN SELLER MANAGER MARKETER OWNER SUPPORT USER }
enum OrderStatus { PENDING PROCESSING SHIPPED DELIVERED CANCELLED REFUNDED }
enum CouponType { PERCENTAGE FIXED }
enum FeedFormat { YML ROZETKA_XML GOOGLE_XML CSV }
enum WebhookEvent { ORDER_CREATED ORDER_STATUS_CHANGED PRODUCT_CREATED PRODUCT_UPDATED PRODUCT_DELETED LOW_STOCK_ALERT }
```

---

## 15. Инструкция по запуску

### Требования

- **Node.js** >= 20.x
- **PostgreSQL** >= 15 (локально или через Neon/Supabase)
- **pnpm** / **npm** / **yarn**

### Шаг 1: Клонирование и зависимости

```bash
git clone <repo-url>
cd <project-dir>
npm install
```

### Шаг 2: Переменные окружения

Создайте файл `.env` (смотрите [`env.txt`](env.txt) как образец):

```env
# База данных
DATABASE_URL="postgresql://user:password@localhost:5432/platform_db"

# Auth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Resend (Email)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="no-reply@yourdomain.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# AI (опционально — системные ключи)
OPENAI_API_KEY="sk-..."
GOOGLE_AI_API_KEY="AIza..."

# Cron безопасность
CRON_SECRET="your-cron-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Шаг 3: База данных

```bash
# Применить миграции
npx prisma migrate deploy

# ИЛИ для разработки (создаёт миграцию при изменениях схемы)
npx prisma migrate dev --name init

# Генерация Prisma Client
npx prisma generate

# Заполнение начальными данными (SuperAdmin + категории)
npm run seed
```

### Шаг 4: Запуск

```bash
# Режим разработки
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start
```

### Шаг 5: Начальные данные после seed

После `npm run seed` создаётся:
- SuperAdmin: `admin@platform.com` / `Admin123!`
- Глобальные категории (Electronics, Fashion, Home, etc.)
- Тестовый магазин с продуктами

### Настройка Vercel Cron Jobs

Создайте [`vercel.json`](vercel.json):

```json
{
  "crons": [
    {
      "path": "/api/cron/webhooks",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/abandoned-carts",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

### Настройка Stripe Webhooks (локально)

```bash
# Установить Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Prisma Studio (визуальный просмотр БД)

```bash
npx prisma studio
# → http://localhost:5555
```

### Запуск E2E тестов

```bash
# Установить браузеры
npx playwright install

# Запустить тесты
npx playwright test

# С UI режимом
npx playwright test --ui
```

---

## 16. SEO и Производительность

### SEO

| Файл | Описание |
|------|----------|
| [`src/app/sitemap.ts`](src/app/sitemap.ts) | Динамический sitemap (статические + магазины + товары + категории) |
| [`src/app/robots.ts`](src/app/robots.ts) | Запрет индексации `/dashboard/*`, `/superadmin/*`, `/api/*` |

**`generateMetadata`** реализован на всех публичных страницах с:
- Динамическими OG-изображениями (`opengraph-image.tsx`)
- JSON-LD разметкой (Product, BreadcrumbList, Organization, Store)

### Производительность

| Стратегия | Применение |
|-----------|------------|
| **ISR 3600s** | Витрина магазина |
| **ISR 1800s** | Страница товара |
| **ISR 900s** | Главная маркетплейса |
| **next/image** | Все изображения с `sizes` и `priority` |
| **Cloudinary transformations** | WebP, ресайз, качество |
| **unstable_cache** | Тяжёлые DB запросы |

---

## 17. Тестирование

### E2E Playwright

| Файл | Описание |
|------|----------|
| [`playwright.config.ts`](playwright.config.ts) | Конфигурация Playwright |
| [`tests/critical-path.spec.ts`](tests/) | Критический путь пользователя |

**Покрытые сценарии:**
- Регистрация / Логин
- Создание магазина
- Добавление товара
- Оформление заказа
- Работа корзины

---

## 18. Структура папок

```
src/
├── actions/              # Server Actions (бизнес-логика)
│   ├── auth.ts           # Авторизация
│   ├── product.ts        # Товары + Webhooks
│   ├── order.ts          # Заказы
│   ├── store.ts          # Магазины
│   ├── banner.ts         # Баннеры
│   ├── team.ts           # Команда магазина
│   ├── superadmin.ts     # SuperAdmin операции
│   ├── analytics.ts      # Аналитика
│   ├── api-token.ts      # API токены
│   ├── feed.ts           # Feed export
│   ├── logistics.ts      # Логистика
│   ├── marketplace.ts    # Маркетплейс данные
│   ├── page.ts           # Builder страницы
│   └── wishlist.ts       # Вишлист
├── app/                  # Next.js App Router
│   ├── (auth)/           # Логин / Регистрация
│   ├── (marketplace)/    # Публичный маркетплейс
│   ├── (storefront)/     # Витрины магазинов
│   ├── dashboard/        # Дашборд продавца
│   ├── superadmin/       # SuperAdmin панель
│   ├── account/          # Личный кабинет
│   ├── api/              # API маршруты
│   └── cart/             # Корзина
├── components/
│   ├── dashboard/        # UI дашборда
│   ├── modals/           # Модальные окна
│   ├── navigation/       # Навигация маркетплейса
│   ├── providers/        # Context провайдеры
│   ├── renderers/        # Рендереры витрины
│   ├── superadmin/       # UI SuperAdmin
│   └── ui/               # Shadcn/ui компоненты
├── emails/               # React Email шаблоны
├── hooks/                # Кастомные React хуки
├── lib/
│   ├── ai/               # AI сервис (BYOK)
│   ├── api/              # API middleware
│   ├── feeds/            # Feed генераторы
│   ├── integrations/     # OpenCart sync
│   ├── marketplace/      # Feed algorithm
│   ├── validations/      # Zod схемы
│   ├── email.ts          # Resend клиент
│   ├── price-calculator.ts
│   ├── prisma.ts         # Prisma singleton
│   ├── stripe.ts         # Stripe клиент
│   └── utils.ts          # cn() и утилиты
├── modules/
│   ├── builder/          # Visual Page Builder компоненты
│   └── crm/              # CRM модуль
└── types/                # TypeScript типы
    ├── builder.ts        # Типы блоков
    └── next-auth.d.ts    # Расширение NextAuth session
```

---

## 19. Будущие задачи: Фазы 8–10

### 🟠 ФАЗА 8 — B2B & Analytics (2–3 месяца)

> **Цель:** Инструменты для оптовой торговли и углублённая аналитика.

#### 8.1 B2B Price Lists (Персональные прайс-листы) — 🔴 Высокий приоритет

**Новые модели Prisma:**
```prisma
model PriceList {
  id        String           @id @default(uuid())
  storeId   String
  name      String
  currency  String           @default("UAH")
  validFrom DateTime?
  validTo   DateTime?
  entries   PriceListEntry[]
  groups    CustomerGroup[]
  store     Store            @relation(...)
}

model PriceListEntry {
  id          String    @id @default(uuid())
  priceListId String
  productId   String
  variantSku  String?
  price       Float
  minQty      Int       @default(1)
}
```

**Файлы для создания:**
- `src/actions/price-list.ts` — CRUD + bulk import CSV
- `src/lib/validations/price-list.ts` — Zod схемы
- `src/app/dashboard/[storeId]/price-lists/page.tsx` — UI управления
- Обновить `src/lib/price-calculator.ts` — 3-й уровень приоритета

---

#### 8.2 RFQ System (Запрос коммерческого предложения) — 🔴 Высокий приоритет

**Новые модели Prisma:**
```prisma
model RFQ {
  id         String    @id @default(uuid())
  storeId    String
  userId     String?
  status     RFQStatus @default(PENDING)
  notes      String?
  validUntil DateTime?
  items      RFQItem[]
}

model RFQItem {
  id             String  @id @default(uuid())
  rfqId          String
  productId      String
  quantity       Int
  requestedPrice Float?
  offeredPrice   Float?
}

enum RFQStatus { PENDING RESPONDED ACCEPTED REJECTED CONVERTED }
```

**Файлы для создания:**
- `src/actions/rfq.ts` — createRFQ, getRFQs, updateRFQStatus, convertRFQToOrder
- `src/components/renderers/rfq-modal.tsx` — модальная форма запроса КП
- `src/app/dashboard/[storeId]/rfq/page.tsx` — CRM раздел RFQ
- `src/emails/rfq-received.tsx` + `src/emails/rfq-quote.tsx`

---

#### 8.3 Мультивалютность — 🟠 Средний приоритет

**Новые модели Prisma:**
```prisma
model Currency {
  id           String  @id @default(uuid())
  storeId      String
  code         String  // UAH, USD, EUR
  name         String
  symbol       String
  exchangeRate Float   @default(1)
  isBase       Boolean @default(false)
  isActive     Boolean @default(true)
}
```

**Файлы для создания:**
- `src/lib/currency/converter.ts` — конвертация + форматирование
- `src/lib/currency/exchange-rates.ts` — NBU API / exchangerate-api.com
- `src/app/api/cron/exchange-rates/route.ts` — ежедневное обновление
- `src/hooks/use-currency.ts` — Zustand store
- `src/components/navigation/currency-switcher.tsx` — выпадающий список

---

#### 8.4 Redis / Upstash Caching — 🟠 Производительность

```typescript
// src/lib/cache/redis.ts
import { Redis } from "@upstash/redis";
export const redis = new Redis({ url, token });
export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl = 3600): Promise<T>
```

**Применить к:** Feed Score, главная маркетплейса, инвалидация при изменении товаров.

---

#### 8.5 Analytics 2.0 (Funnel, LTV, Cohort) — 🟠 Средний приоритет

**Новые модели Prisma:**
```prisma
model PageView {
  id        String   @id @default(uuid())
  storeId   String
  sessionId String
  path      String
  referrer  String?
  utmSource String?
  createdAt DateTime @default(now())
}
// + добавить в Order: utmSource, utmMedium, utmCampaign
```

**Функционал:**
- Воронка: просмотр → корзина → заказ (конверсия)
- LTV клиента
- Cohort analysis по месяцам регистрации
- RFM сегментация

---

#### 8.6 Seller Verification (KYC) — 🟠 Средний приоритет

```prisma
model SellerVerification {
  id            String  @id @default(uuid())
  storeId       String  @unique
  status        String  @default("PENDING")
  legalName     String?
  taxId         String? // ЕГРПОУ / ИНН
  documentsUrls String[]
  reviewedBy    String?
}
```

---

### 🟡 ФАЗА 9 — AI 2.0 & Performance (3–4 месяца)

| # | Задача | Сложность |
|---|--------|-----------|
| **9.1** | **AI Recommendations Engine** (Collaborative Filtering) | ⭐⭐⭐⭐ |
| **9.2** | **RAG Chatbot** (pgvector embeddings, семантический поиск) | ⭐⭐⭐⭐ |
| **9.3** | **Background Jobs** (BullMQ + Redis queue) | ⭐⭐⭐ |
| **9.4** | **Real-time Notifications** (SSE / Pusher) | ⭐⭐ |
| **9.5** | **Inventory Management 2.0** (Warehouses, StockMovement) | ⭐⭐⭐ |
| **9.6** | **Commission & Payout System** (Stripe Connect) | ⭐⭐⭐⭐ |
| **9.7** | **Returns & Refunds** (ReturnRequest модель + Stripe Refund API) | ⭐⭐ |
| **9.8** | **Advanced Coupon Engine** (minOrderAmount, usageLimit, BXGY) | ⭐⭐ |

#### Ключевые модели Фазы 9

```prisma
// AI Recommendations
model UserBehavior {
  id        String   @id @default(uuid())
  userId    String?
  sessionId String
  productId String
  action    String   // VIEW | ADD_TO_CART | PURCHASE | WISHLIST
  duration  Int?
}

model ProductSimilarity {
  productId        String
  similarProductId String
  score            Float
  @@unique([productId, similarProductId])
}

// Warehouses
model Warehouse { id, storeId, name, address, isDefault }
model WarehouseStock { warehouseId, productId, quantity, reserved, available }
model StockMovement { id, productId, type, quantity, reason, orderId }

// Payouts
model CommissionRule { id, categoryId, percentage, fixedAmount }
model SellerPayout { id, storeId, amount, status, stripeTransferId, netAmount }

// Returns
model ReturnRequest { id, orderId, storeId, status, reason, refundAmount, stripeRefundId }
```

---

### 🟢 ФАЗА 10 — Platform Ecosystem (4–6 месяцев)

| # | Задача | Бизнес-ценность | Сложность |
|---|--------|-----------------|-----------|
| **10.1** | **Email Marketing Campaigns** (сегментация, A/B тест, drag&drop builder) | 💰💰💰 | ⭐⭐⭐ |
| **10.2** | **App Store / Plugin API** (изолированные плагины через Webhook API, как Shopify) | 💰💰💰 | ⭐⭐⭐⭐⭐ |
| **10.3** | **AI Dynamic Pricing** (анализ конкурентов, оптимальная цена) | 💰💰💰 | ⭐⭐⭐⭐ |
| **10.4** | **Product Q&A System** (вопросы покупателей, ответы продавца) | 💰 | ⭐⭐ |
| **10.5** | **Compare Products** (сравнение до 4 товаров по атрибутам) | 💰 | ⭐⭐ |
| **10.6** | **AI Fraud Detection** (скоринг риска заказов, паттерны мошенничества) | 💰💰💰 | ⭐⭐⭐⭐ |
| **10.7** | **Push Notifications** (Web Push VAPID, триггеры: цена снизилась, статус заказа) | 💰💰 | ⭐⭐⭐ |
| **10.8** | **Product Bundles** (наборы товаров со скидкой) | 💰💰 | ⭐⭐ |
| **10.9** | **Gift Cards** | 💰💰 | ⭐⭐ |
| **10.10** | **AI SEO Autopilot** (Google Search Console API, авто-генерация мета для новых товаров) | 💰💰 | ⭐⭐⭐ |

#### App Store архитектура (10.2)

```prisma
model Plugin {
  id          String         @id @default(uuid())
  slug        String         @unique
  name        String
  category    String         // SEO | PAYMENTS | SHIPPING | MARKETING
  webhookUrl  String?
  oauthScopes String[]
  price       Float          @default(0)
  isApproved  Boolean        @default(false)
  installs    PluginInstall[]
}

model PluginInstall {
  pluginId  String
  storeId   String
  settings  Json   @default("{}")
  isActive  Boolean
  @@unique([pluginId, storeId])
}
```

---

## 📊 Сводная таблица готовности

| Модуль | Статус | Фаза |
|--------|--------|------|
| Core & Auth (RBAC, NextAuth) | ✅ Готов | 1 |
| E-commerce (Products, Orders, Cart) | ✅ Готов | 1 |
| Visual Page Builder (JSON, DnD) | ✅ Готов | 2 |
| Themes & Branding | ✅ Готов | 2 |
| Global Marketplace (Storefront) | ✅ Готов | 2 |
| Social (Reviews, Wishlist, Loyalty) | ✅ Готов | 3 |
| Enterprise RBAC + Team Invites | ✅ Готов | 3 |
| SuperAdmin Panel | ✅ Готов | 3 |
| Analytics Dashboard (Recharts) | ✅ Готов | 3 |
| SEO (Sitemap, OG, JSON-LD, ISR) | ✅ Готов | 3 |
| AI Assistant (BYOK, Gemini) | ✅ Готов | 4 |
| Stripe Monetization (Checkout, Subs) | ✅ Готов | 4 |
| Storefront 2.0 (Guest Checkout) | ✅ Готов | 5 |
| Feed Export (YML/XML/CSV) | ✅ Готов | 6 |
| Public API v1 + Bearer Token | ✅ Готов | 6 |
| Webhooks System | ✅ Готов | 6 |
| Abandoned Cart Recovery | ✅ Готов | 7 |
| Banner CRUD | ✅ Готов | 7 |
| E2E Tests (Playwright) | ✅ Готов | 3 |
| **B2B Price Lists** | 🔜 Планируется | 8 |
| **RFQ System** | 🔜 Планируется | 8 |
| **Multi-currency** | 🔜 Планируется | 8 |
| **Redis Caching** | 🔜 Планируется | 8 |
| **Analytics 2.0** | 🔜 Планируется | 8 |
| **AI Recommendations** | 🔜 Планируется | 9 |
| **RAG Chatbot** | 🔜 Планируется | 9 |
| **Background Jobs (BullMQ)** | 🔜 Планируется | 9 |
| **Inventory 2.0 (Warehouses)** | 🔜 Планируется | 9 |
| **Commission & Payouts** | 🔜 Планируется | 9 |
| **Email Campaigns** | 🔜 Планируется | 10 |
| **App Store / Plugin API** | 🔜 Планируется | 10 |

---

*Документ создан: Март 2026 | Следующее обновление: при завершении Фазы 8*
