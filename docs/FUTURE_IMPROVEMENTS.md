# 🚀 FUTURE_IMPROVEMENTS.md — Roadmap Фазы 7+
## Enterprise Multi-tenant SaaS: Следующий уровень (2026–2027)

> **Контекст:** Все 6 базовых фаз завершены. Платформа имеет работающий Multi-tenant движок,
> Visual Page Builder, Marketplace, базовую CRM, Stripe-монетизацию, Public API v1 и Webhooks.
> Данный документ описывает **узкие горлышки** и **недостающие бизнес-фичи** по сравнению с
> топ-игроками: Shopify, Amazon, Prom.ua, Bitrix24, Magento.

---

## 📊 Матрица GAP-анализа (Текущее состояние vs Конкуренты)

| Функция | Наша платформа | Shopify | Amazon | Prom.ua | Bitrix24 |
|---------|---------------|---------|--------|---------|---------|
| Multi-tenant | ✅ | ✅ | ✅ | ✅ | ✅ |
| Visual Builder | ✅ | ✅ | ❌ | ❌ | ❌ |
| Feed Export | ✅ | ✅ | ✅ | ✅ | ❌ |
| Abandoned Cart | ❌ | ✅ | ✅ | ✅ | ✅ |
| Multi-currency | ❌ | ✅ | ✅ | ✅ | ✅ |
| Product Bundles | ❌ | ✅ | ✅ | ❌ | ❌ |
| Gift Cards | ❌ | ✅ | ✅ | ❌ | ❌ |
| Returns/Refunds | ❌ | ✅ | ✅ | ✅ | ❌ |
| Sales Pipeline CRM | ❌ | ❌ | ❌ | ❌ | ✅ |
| Email Campaigns | ❌ | ✅ | ✅ | ✅ | ✅ |
| AI Recommendations | ❌ | ✅ | ✅ | ❌ | ❌ |
| Bulk Operations | ❌ | ✅ | ✅ | ✅ | ✅ |
| B2B Price Lists | ❌ | ✅ | ✅ | ❌ | ✅ |
| Real-time Notifications | ❌ | ✅ | ✅ | ✅ | ✅ |
| App Store / Plugins | ❌ | ✅ | ✅ | ❌ | ✅ |

---

## 🔥 Направление 1: МАРКЕТИНГ & AUTOMATION

### 1.1 Abandoned Cart Recovery (Приоритет: CRITICAL)

**Почему критично:** Shopify сообщает, что 70% корзин брошены. Автоматические email-цепочки
возвращают 5–15% клиентов. Это самая быстрая «денежная» фича.

**Что нужно сделать:**

**Схема БД (новые модели):**
```prisma
model AbandonedCart {
  id             String   @id @default(uuid())
  storeId        String
  sessionId      String   @unique
  customerEmail  String?
  customerName   String?
  cartData       Json     // снимок корзины (items, total)
  isRecovered    Boolean  @default(false)
  emailSentAt    DateTime?
  recoveredAt    DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  store          Store    @relation(...)
}

model EmailCampaign {
  id           String   @id @default(uuid())
  storeId      String
  name         String
  trigger      String   // ABANDONED_CART | ORDER_FOLLOW_UP | REENGAGEMENT
  delayMinutes Int      @default(60)
  subject      String
  htmlBody     String   @db.Text
  isActive     Boolean  @default(true)
  sentCount    Int      @default(0)
  openRate     Float    @default(0)
  clickRate    Float    @default(0)
  store        Store    @relation(...)
}
```

**Файлы для создания:**
- `src/modules/marketing/actions/abandoned-cart.ts` — логика сохранения/восстановления
- `src/modules/marketing/services/email-automation.ts` — отправка серии писем (час, 24ч, 72ч)
- `src/app/api/cron/abandoned-carts/route.ts` — Vercel Cron каждые 15 минут
- `src/emails/abandoned-cart.tsx` — шаблон письма с кнопкой "Вернуться к покупкам"
- `src/app/dashboard/[storeId]/marketing/abandoned-carts/page.tsx` — дашборд статистики

---

### 1.2 Email Marketing Campaigns

**Почему критично:** Mailchimp зарабатывает миллиарды на том, что встроено в нашу же платформу.

**Функционал:**
- Сегментация по: группе клиентов, истории покупок, LTV, дате регистрации
- Drag & Drop шаблоны писем (через Page Builder JSON — переиспользуем движок!)
- A/B тесты subject line
- Метрики: open rate, CTR, unsubscribes
- Интеграция с Resend (уже подключён) — bulk emails через `resend.batch.send()`

**Файлы:**
- `src/modules/marketing/` — новый модуль
- `src/modules/marketing/components/email-builder.tsx`
- `src/modules/marketing/actions/campaign.ts`

---

### 1.3 Advanced Coupon Engine (Расширение текущего) — ✅ ВЫПОЛНЕНО

**Текущее состояние:** Модель `Coupon` есть (`PERCENTAGE`/`FIXED`, `isStackable`, `expiresAt`).
**Что ОТСУТСТВУЕТ:**
- Минимальная сумма заказа (`minOrderAmount`)
- Лимит использований (`usageLimit`, `usedCount`)
- Купоны для конкретных категорий/товаров (`applicableProductIds[]`)
- Реферальные купоны (генерация уникального кода для каждого пользователя)
- Buy X Get Y (BXGY) промо-механика

**Миграция БД:**
```prisma
// Добавить в модель Coupon:
minOrderAmount    Float?
usageLimit        Int?
usedCount         Int      @default(0)
applicableProducts String[] @default([])
applicableCategories String[] @default([])
referralUserId    String?  // связь с реферером
```

---

### 1.4 Push Notifications (Web Push + FCM)

- Web Push уведомления (через Notification API / VAPID ключи)
- Триггеры: снижение цены на товар из Wishlist, новый товар в категории, статус заказа
- `src/modules/marketing/services/push.ts`

---

## 🏢 Направление 2: B2B & ENTERPRISE

### 2.1 B2B Price Lists & Wholesale (Приоритет: HIGH)

**Почему критично:** B2B клиенты (оптовики) — это 30–40% GMV большинства платформ.
Сейчас `CustomerGroup` с `discountPercentage` слишком упрощён.

**Что нужно:**

```prisma
model PriceList {
  id          String          @id @default(uuid())
  storeId     String
  name        String          // "Оптовый прайс A", "VIP клиенты"
  currency    String          @default("UAH")
  isDefault   Boolean         @default(false)
  validFrom   DateTime?
  validTo     DateTime?
  entries     PriceListEntry[]
  groups      CustomerGroup[] // какие группы видят этот прайс
  store       Store           @relation(...)
}

model PriceListEntry {
  id          String    @id @default(uuid())
  priceListId String
  productId   String
  variantSku  String?
  price       Float     // фиксированная цена
  minQty      Int       @default(1) // минимальное количество для этой цены
  priceList   PriceList @relation(...)
  product     Product   @relation(...)
}
```

**Логика:** При рендере карточки товара и в `PriceCalculator` добавить 3-й уровень цен:
1. `compareAtPrice` (старая цена/распродажа)
2. `basePrice` (обычная цена)
3. `PriceListEntry.price` (персональная B2B цена)

---

### 2.2 B2B Quote / Request for Quote (RFQ)

**Функционал:**
- Покупатель добавляет товары в "Запрос коммерческого предложения" (вместо корзины)
- Продавец видит запрос в дашборде, может ответить с кастомной ценой и сроком
- После подтверждения — автоматически создаётся заказ

```prisma
model Quote {
  id           String      @id @default(uuid())
  storeId      String
  userId       String?
  status       String      @default("PENDING") // PENDING|RESPONDED|ACCEPTED|REJECTED
  notes        String?
  validUntil   DateTime?
  items        QuoteItem[]
  store        Store       @relation(...)
}

model QuoteItem {
  id          String  @id @default(uuid())
  quoteId     String
  productId   String
  quantity    Int
  requestedPrice Float?
  offeredPrice   Float?
  quote       Quote   @relation(...)
  product     Product @relation(...)
}
```

---

### 2.3 Returns & Refunds Management (Приоритет: HIGH)

**Текущее состояние:** `Order.status` enum не включает возвраты.
**Что нужно:**

```prisma
model ReturnRequest {
  id            String          @id @default(uuid())
  orderId       String
  storeId       String
  status        String          @default("PENDING") // PENDING|APPROVED|REJECTED|REFUNDED
  reason        String
  items         ReturnItem[]
  refundAmount  Float?
  refundMethod  String?         // ORIGINAL|STORE_CREDIT|BANK
  stripeRefundId String?
  createdAt     DateTime        @default(now())
  order         Order           @relation(...)
  store         Store           @relation(...)
}
```

**UI:**
- `src/app/dashboard/[storeId]/returns/page.tsx` — стол возвратов
- `src/app/account/orders/[orderId]/return/page.tsx` — форма возврата для клиента
- `src/app/api/stripe/refund/route.ts` — Stripe API refund

---

### 2.4 Multi-currency Support

**Архитектура:**
- Хранить цены в базовой валюте (`UAH` по умолчанию, через `Store.baseCurrency`)
- Конвертация на лету через Exchange Rate API (кешировать в Redis/KV на 1 час)
- Поле `Store.supportedCurrencies String[]`
- На витрине — Currency Switcher в header

---

### 2.5 Inventory Management 2.0

**Текущее состояние:** `Product.stock` — просто число.
**Что нужно:**

```prisma
model Warehouse {
  id        String              @id @default(uuid())
  storeId   String
  name      String
  address   String?
  isDefault Boolean             @default(false)
  stock     WarehouseStock[]
  store     Store               @relation(...)
}

model WarehouseStock {
  id          String    @id @default(uuid())
  warehouseId String
  productId   String
  variantSku  String?
  quantity    Int       @default(0)
  reserved    Int       @default(0) // в обработке
  available   Int       @default(0) // quantity - reserved
  warehouse   Warehouse @relation(...)
  product     Product   @relation(...)

  @@unique([warehouseId, productId, variantSku])
}

model StockMovement {
  id          String   @id @default(uuid())
  productId   String
  warehouseId String
  type        String   // RECEIPT | SALE | RETURN | ADJUSTMENT | TRANSFER
  quantity    Int
  reason      String?
  orderId     String?
  createdAt   DateTime @default(now())
}
```

---

## 🤖 Направление 3: AI 2.0 — Интеллектуальная Платформа

### 3.1 AI Product Recommendations Engine (Приоритет: HIGH)

**Текущее состояние:** `feedScore` — статический алгоритм.
**Что нужно — Collaborative Filtering:**

```prisma
model UserBehavior {
  id        String   @id @default(uuid())
  userId    String?
  sessionId String
  productId String
  action    String   // VIEW | ADD_TO_CART | PURCHASE | WISHLIST
  duration  Int?     // секунды просмотра
  createdAt DateTime @default(now())

  @@index([userId, action])
  @@index([productId, action])
}

model ProductSimilarity {
  productId       String
  similarProductId String
  score           Float
  updatedAt       DateTime @updatedAt

  @@unique([productId, similarProductId])
}
```

**Алгоритм (Item-Based Collaborative Filtering):**
- Ночной Cron job вычисляет матрицу схожести товаров
- "Покупают вместе" основан на реальных данных
- "Вам может понравиться" — на истории сессии

**Файлы:**
- `src/modules/ai/services/recommendation-engine.ts`
- `src/app/api/cron/recommendations/route.ts`

---

### 3.2 AI Dynamic Pricing

- Анализ конкурентов через product feeds (YML/XML входящий парсинг)
- Предложение оптимальной цены с учётом остатков, сезонности, конкурентов
- `src/modules/ai/services/dynamic-pricing.ts`
- UI в дашборде: "AI рекомендует снизить цену на -15%"

---

### 3.3 AI-powered Customer Service Chatbot

**Текущее состояние:** Floating AI Chat есть, но это просто генеративный чат.
**Что нужно — RAG (Retrieval Augmented Generation):**

```typescript
// src/modules/ai/services/store-rag.ts
// 1. Индексировать товары, FAQ, страницы магазина в vector store
// 2. При вопросе клиента — найти релевантные товары/FAQ (vector search)
// 3. Сформировать ответ с реальными ссылками на товары
```

**Стек:** pgvector (уже на PostgreSQL), Gemini embeddings API

**Новые поля в схеме:**
```prisma
// Добавить в Product:
embedding   Unsupported("vector(768)")?

// Добавить в Article:
embedding   Unsupported("vector(768)")?
```

---

### 3.4 AI Fraud Detection

- Анализ паттернов заказов: подозрительная активность (много заказов с одного IP, тест карт)
- Скоринг риска для каждого заказа (`Order.riskScore Float`)
- Автоматическое уведомление менеджера при высоком риске

---

### 3.5 AI SEO Autopilot

- Автоматический мониторинг позиций по ключевым словам (интеграция с Google Search Console API)
- AI-генерация мета-тегов для новых товаров при создании
- Выявление "тонкого" контента (Products без описаний) и очередь задач для AI

---

## ⚡ Направление 4: ПРОИЗВОДИТЕЛЬНОСТЬ & МАСШТАБИРУЕМОСТЬ

### 4.1 Redis / Upstash KV Caching Layer (Приоритет: HIGH)

**Текущее состояние:** Кеширование через `unstable_cache` (Next.js in-memory).
**Проблема:** При масштабировании на несколько серверов кеш не синхронизирован.

**Что нужно:**
```typescript
// src/lib/cache/redis.ts
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Паттерн: cache-aside
export async function getCached<T>(
  key: string, 
  fetcher: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;
  
  const data = await fetcher();
  await redis.set(key, data, { ex: ttl });
  return data;
}
```

**Применить к:**
- Feed Score (пересчитывать раз в час, не при каждом запросе)
- Главная маркетплейса (TTL 5 минут вместо ISR 900с)
- Инвалидация кеша при изменении товара через `redis.del(pattern)`

---

### 4.2 Background Job Queue (BullMQ + Redis)

**Текущее состояние:** Email отправляется синхронно в Server Action, webhook retry через Vercel Cron.
**Проблема:** Тяжёлые операции блокируют UI response.

**Архитектура:**
```
┌─────────────────┐    ┌──────────────┐    ┌──────────────────┐
│  Server Action  │───▶│  BullMQ      │───▶│  Worker Process  │
│  (enqueue job)  │    │  Queue       │    │  (email, AI, etc)│
└─────────────────┘    └──────────────┘    └──────────────────┘
```

**Очереди:**
- `email-queue` — отправка писем (abandoned cart, campaigns)
- `webhook-queue` — заменить текущий Cron retry
- `ai-queue` — тяжёлые AI операции (генерация embeddings, пересчёт recommendations)
- `feed-queue` — пересчёт feedScore для всех товаров

**Файлы:**
- `src/lib/queue/index.ts` — инициализация очередей
- `src/lib/queue/workers/*.ts` — воркеры для каждого типа задачи

---

### 4.3 Real-time Notifications (SSE / WebSockets)

**Текущее состояние:** Нет real-time уведомлений.
**Что нужно:**

```typescript
// src/app/api/sse/notifications/route.ts
// Server-Sent Events для дашборда продавца:
// - Новый заказ → ding! 🛒
// - Низкий остаток товара → предупреждение
// - Новый отзыв → звонок
// - Webhook failure → алерт
```

**Альтернатива:** Pusher / Ably (managed) для минимальной сложности инфраструктуры.

---

### 4.4 Database Performance Optimization

**Анализ текущих индексов в `schema.prisma`:**

Отсутствующие критические индексы:
```prisma
// Product — добавить:
@@index([storeId, categoryId])
@@index([storeId, isArchived, isDraft])
@@index([storeId, createdAt(sort: Desc)])

// Order — добавить:
@@index([storeId, status])
@@index([storeId, createdAt(sort: Desc)])
@@index([customerEmail])

// Review — добавить:
@@index([productId, createdAt(sort: Desc)])

// Wishlist — добавить:
@@index([userId])
```

**Оптимизация запросов:**
- Заменить N+1 запросы в `getTopProducts` на один агрегирующий SQL через `prisma.$queryRaw`
- Пагинация курсором вместо offset для больших таблиц (>100k строк)
- Connection pooling через PgBouncer (Supabase / Neon встроенный)

---

### 4.5 CDN & Media Optimization

**Текущее состояние:** Cloudinary используется, но URL трансформации не везде оптимальны.

**Что улучшить:**
- Авто-генерация WebP + AVIF вариантов через Cloudinary transformations
- Responsive images для всех блоков Page Builder
- Lazy loading всех изображений ниже fold
- `<Image>` `blurDataURL` placeholder через `/_next/image?...` для мгновенного LCP
- Video: автоматическое сжатие через Cloudinary video transformation pipeline

---

## 🛒 Направление 5: МАРКЕТПЛЕЙС 2.0

### 5.1 Seller Onboarding & Verification (KYC)

**Текущее состояние:** Любой может создать магазин.
**Что нужно для доверия покупателей:**

```prisma
model SellerVerification {
  id           String   @id @default(uuid())
  storeId      String   @unique
  status       String   @default("PENDING") // PENDING|IN_REVIEW|APPROVED|REJECTED
  legalName    String?
  taxId        String?  // ЕГРПОУ / ИНН
  bankAccount  String?
  documentsUrls String[] @default([])
  reviewedBy   String?  // SuperAdmin userId
  reviewedAt   DateTime?
  notes        String?
  createdAt    DateTime @default(now())
  store        Store    @relation(...)
}
```

**UI:**
- `src/app/superadmin/verifications/page.tsx` — очередь верификации для SuperAdmin
- `src/app/dashboard/[storeId]/settings/verification/page.tsx` — форма подачи документов
- Бейдж ✅ "Верифицированный продавец" на карточках товаров

---

### 5.2 Commission & Payout System

**Архитектура монетизации маркетплейса:**

```prisma
model CommissionRule {
  id             String   @id @default(uuid())
  categoryId     String?  // null = глобальное правило
  subscriptionPlan String?
  percentage     Float    @default(5.0)
  fixedAmount    Float    @default(0)
  isActive       Boolean  @default(true)
}

model SellerPayout {
  id              String   @id @default(uuid())
  storeId         String
  amount          Float
  currency        String   @default("UAH")
  status          String   @default("PENDING") // PENDING|PROCESSING|PAID|FAILED
  stripeTransferId String?
  periodFrom      DateTime
  periodTo        DateTime
  ordersCount     Int
  grossRevenue    Float
  commissionAmount Float
  netAmount       Float    // grossRevenue - commissionAmount
  store           Store    @relation(...)
}
```

**Логика:**
- При `order.status = COMPLETED` → вычисляем комиссию → создаём `SellerPayout`
- Ежемесячный Cron → Stripe Connect Transfer продавцу
- Дашборд продавца: "Ожидается выплата: $1,240 (через 3 дня)"

---

### 5.3 Product Q&A System

```prisma
model ProductQuestion {
  id         String           @id @default(uuid())
  productId  String
  storeId    String
  userId     String?
  question   String
  answers    ProductAnswer[]
  isPublic   Boolean          @default(true)
  createdAt  DateTime         @default(now())
  product    Product          @relation(...)
}

model ProductAnswer {
  id         String          @id @default(uuid())
  questionId String
  userId     String
  isSeller   Boolean         @default(false)
  answer     String
  createdAt  DateTime        @default(now())
  question   ProductQuestion @relation(...)
}
```

---

### 5.4 Compare Products Feature

- Выбор до 4 товаров для сравнения
- Таблица сравнения атрибутов (из `Product.attributes Json`)
- `/compare?ids=id1,id2,id3` — статическая страница с SSR
- Floating Compare Bar (появляется при добавлении 1-го товара в сравнение)

---

### 5.5 Seller Analytics Dashboard 2.0

**Текущее состояние:** Базовые метрики (Revenue, Sales, Products, Recharts AreaChart).
**Что отсутствует:**

- **Cohort Analysis**: удержание покупателей по месяцам
- **Customer LTV**: пожизненная ценность клиента
- **Funnel Analytics**: просмотр → корзина → заказ (конверсия на каждом шаге)
- **UTM Attribution**: откуда пришли покупатели (Google, Facebook, прямой)
- **RFM Segmentation**: Recency/Frequency/Monetary анализ базы клиентов

```prisma
// Добавить в Order:
utmSource    String?
utmMedium    String?
utmCampaign  String?

// Новая модель:
model PageView {
  id        String   @id @default(uuid())
  storeId   String
  sessionId String
  path      String
  referrer  String?
  utmSource String?
  duration  Int?
  createdAt DateTime @default(now())

  @@index([storeId, createdAt(sort: Desc)])
}
```

---

## 🔌 Направление 6: APP STORE & EXTENSIBILITY (Фаза 10+)

### 6.1 Plugin / App Store Architecture

**Цель:** Превратить платформу в экосистему (как Shopify App Store).

**Концепция:**
```prisma
model Plugin {
  id          String   @id @default(uuid())
  slug        String   @unique
  name        String
  description String
  logoUrl     String?
  authorId    String
  category    String   // SEO | PAYMENTS | SHIPPING | MARKETING | ANALYTICS
  webhookUrl  String?  // Plugin получает события через вебхук
  oauthScopes String[]
  price       Float    @default(0) // 0 = бесплатный
  isApproved  Boolean  @default(false)
  installs    PluginInstall[]
}

model PluginInstall {
  id        String   @id @default(uuid())
  pluginId  String
  storeId   String
  settings  Json     @default("{}")
  isActive  Boolean  @default(true)
  plugin    Plugin   @relation(...)
  store     Store    @relation(...)

  @@unique([pluginId, storeId])
}
```

**Sandbox:** Плагины работают через изолированный webhook API, без прямого доступа к БД.

---

## 📋 Приоритизированный Roadmap

### 🔴 ФАЗА 7 — Quick Wins & Critical Gaps (1–2 месяца)
| # | Задача | Бизнес-ценность | Сложность |
|---|--------|-----------------|-----------|
| 7.1 | Abandoned Cart Recovery | 💰💰💰 | ⭐⭐ |
| 7.2 | Returns & Refunds UI | 💰💰💰 | ⭐⭐ |
| 7.3 | Missing DB Indexes | ⚡⚡⚡ | ⭐ |
| 7.4 | Wishlist → Product Card подключение | 💰💰 | ⭐ |
| 7.5 | Advanced Coupon (minOrder, usageLimit) | 💰💰 | ⭐⭐ |
| 7.6 | Email-подтверждение заказа (раскомментировать) | 💰💰 | ⭐ |

### 🟠 ФАЗА 8 — B2B & Analytics (2–3 месяца)
| # | Задача | Бизнес-ценность | Сложность |
|---|--------|-----------------|-----------|
| 8.1 | B2B Price Lists | 💰💰💰 | ⭐⭐⭐ |
| 8.2 | Multi-currency Support | 💰💰💰 | ⭐⭐⭐ |
| 8.3 | Analytics 2.0 (Funnel, LTV, Cohort) | 💰💰 | ⭐⭐⭐ |
| 8.4 | Redis/Upstash Caching | ⚡⚡⚡ | ⭐⭐ |
| 8.5 | Seller Verification (KYC) | 💰💰 | ⭐⭐ |
| 8.6 | RFQ (Request for Quote) | 💰💰💰 | ⭐⭐⭐ |

### 🟡 ФАЗА 9 — AI 2.0 & Performance (3–4 месяца)
| # | Задача | Бизнес-ценность | Сложность |
|---|--------|-----------------|-----------|
| 9.1 | AI Recommendations Engine | 💰💰💰 | ⭐⭐⭐⭐ |
| 9.2 | RAG Chatbot (pgvector) | 💰💰💰 | ⭐⭐⭐⭐ |
| 9.3 | Background Jobs (BullMQ) | ⚡⚡⚡ | ⭐⭐⭐ |
| 9.4 | Real-time Notifications (SSE) | 💰💰 | ⭐⭐ |
| 9.5 | Inventory Management 2.0 (Warehouses) | 💰💰💰 | ⭐⭐⭐ |
| 9.6 | Commission & Payout System | 💰💰💰 | ⭐⭐⭐⭐ |

### 🟢 ФАЗА 10 — Platform Ecosystem (4–6 месяцев)
| # | Задача | Бизнес-ценность | Сложность |
|---|--------|-----------------|-----------|
| 10.1 | Email Marketing Campaigns | 💰💰💰 | ⭐⭐⭐ |
| 10.2 | App Store / Plugin API | 💰💰💰 | ⭐⭐⭐⭐⭐ |
| 10.3 | AI Dynamic Pricing | 💰💰💰 | ⭐⭐⭐⭐ |
| 10.4 | Product Q&A System | 💰 | ⭐⭐ |
| 10.5 | Compare Products | 💰 | ⭐⭐ |
| 10.6 | AI Fraud Detection | 💰💰💰 | ⭐⭐⭐⭐ |

---

## 🏗️ Следующий Немедленный Шаг: ФАЗА 7

Рекомендуемый порядок реализации Фазы 7:

```
1. [DB] Добавить индексы в schema.prisma → prisma migrate
2. [Fix] Подключить Wishlist кнопку к product-card.tsx (TODO уже помечен)
3. [Fix] Раскомментировать email отправку в actions/order.ts
4. [Feature] Advanced Coupon: добавить minOrderAmount, usageLimit в схему
5. [Feature] Returns/Refunds: новые модели + UI в дашборде
6. [Feature] Abandoned Cart: модель + Cron + email шаблон
```

---

## 📐 Архитектурные Принципы для Фаз 7+

1. **Module-first**: Каждое направление — отдельный `src/modules/[name]/`
2. **Event-driven**: Все бизнес-события идут через систему Webhooks (уже готова)
3. **API-first**: Каждая новая фича сначала через API v1, потом UI
4. **Test-driven**: Новые критические пути добавляются в Playwright tests
5. **Cache-aside**: Все тяжёлые запросы через Redis с инвалидацией
6. **AI-augmented**: Каждый модуль имеет AI-ассистента (не замену человека)

---

*Документ создан: Март 2026 | Версия: 1.0*
*Последнее обновление: автоматически при завершении каждой фазы*
