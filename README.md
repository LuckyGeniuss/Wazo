# 🏪 Wazo.Market

> Enterprise Multi-tenant SaaS Marketplace — платформа для створення інтернет-магазинів
> та глобального маркетплейсу нового покоління.

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-teal)](https://prisma.io)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://vercel.com)

## 🚀 Швидкий старт

```bash
# 1. Клонувати та встановити залежності
git clone <repo-url>
cd wazo-market
npm install

# 2. Налаштувати змінні середовища
cp .env.example .env
# Заповнити значення згідно docs/ENV_SETUP.md

# 3. Ініціалізувати базу даних
npx prisma migrate deploy
npx prisma db seed

# 4. Запустити локально
npm run dev
# → http://localhost:3000
```

## 📦 Стек технологій

| Технологія | Призначення |
|-----------|-------------|
| **Next.js 16** | App Router, Server Actions, ISR |
| **TypeScript 5** | Строга типізація |
| **Prisma 6 + PostgreSQL** | ORM + база даних (Neon) |
| **Auth.js v5** | Аутентифікація, RBAC, OAuth |
| **Stripe** | Платежі, підписки, Connect |
| **Upstash Redis** | Кешування, rate limiting |
| **BullMQ** | Фонові задачі, черги |
| **Cloudinary** | CDN для зображень |
| **Resend** | Транзакційна пошта |
| **pgvector** | Семантичний пошук (RAG) |

## 📁 Структура проекту

```
wazo-market/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Логін / Реєстрація
│   │   ├── (marketplace)/     # Публічний маркетплейс
│   │   ├── (storefront)/      # Вітрини магазинів
│   │   ├── account/           # Особистий кабінет покупця
│   │   ├── dashboard/         # Дашборд продавця
│   │   ├── superadmin/        # Панель SuperAdmin
│   │   └── api/               # API маршрути
│   ├── actions/               # Server Actions
│   ├── components/            # React компоненти
│   ├── hooks/                 # React хуки (Zustand stores)
│   ├── lib/                   # Утиліти та сервіси
│   │   ├── ai/               # AI сервіс (BYOK)
│   │   ├── cache/            # Redis кешування
│   │   ├── commission/       # Розрахунок комісій
│   │   ├── currency/         # Мультивалютність
│   │   ├── feeds/            # YML/XML/CSV фіди
│   │   ├── integrations/     # Маркетплейси (Prom.ua, Kaspi, Allegro)
│   │   ├── loyalty/          # Програма лояльності
│   │   ├── marketplace/      # Feed алгоритм
│   │   ├── notifications/    # SSE сповіщення
│   │   ├── pdf/              # Генерація PDF
│   │   ├── queue/            # BullMQ черги
│   │   ├── recommendations/  # AI рекомендації
│   │   ├── telegram/         # Telegram Bot
│   │   └── webhooks/         # Webhook dispatcher
│   ├── emails/                # React Email шаблони
│   ├── modules/               # Feature модулі (builder, crm)
│   └── types/                 # TypeScript типи
├── prisma/
│   ├── schema.prisma          # Схема бази даних
│   └── seed.ts                # Початкові дані
├── tests/                     # Playwright E2E тести
├── public/                    # Статичні файли + PWA
│   ├── manifest.json         # Web App Manifest
│   ├── sw.js                 # Service Worker
│   └── icons/                # PWA іконки
├── messages/                  # i18n переклади (uk/en/pl)
├── docs/                      # Документація проекту
└── vercel.json                # Vercel Cron Jobs
```

## 📚 Документація

- [Налаштування середовища](docs/ENV_SETUP.md)
- [Чеклист деплою](docs/DEPLOY_CHECKLIST.md)
- [План проекту](docs/PROJECT_PLAN.md)

## 🔧 Корисні команди

```bash
npm run dev          # Режим розробки
npm run build        # Production збірка
npm run test         # E2E тести (Playwright)
npx prisma studio    # Візуальний редактор БД
npx prisma migrate dev --name <name>  # Нова міграція
```

## 🌐 Посилання

- **Продакшн:** https://wazo.market
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Neon Database:** https://console.neon.tech
