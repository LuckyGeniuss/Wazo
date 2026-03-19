# 🚀 Чеклист деплою Wazo.Market на Vercel

## 1. Підготовка

- [ ] `npm run build` — збірка без помилок
- [ ] `npx playwright test` — всі E2E тести зелені
- [ ] Заповнений `.env` з реальними ключами
- [ ] `git add . && git commit && git push origin main`

## 2. Vercel Project

- [ ] [vercel.com](https://vercel.com) → New Project → Import з GitHub
- [ ] Вибрати репозиторій `wazo-market`
- [ ] Framework: Next.js (визначається автоматично)
- [ ] Root Directory: `.` (корінь)
- [ ] Node.js Version: 20.x

## 3. Environment Variables (Vercel Dashboard → Settings → Env)

Скопіювати з `.env` (всі значення):

**Обов'язкові:**
- [ ] `DATABASE_URL`
- [ ] `AUTH_SECRET`
- [ ] `NEXTAUTH_URL` = `https://ваш-домен.vercel.app`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`
- [ ] `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- [ ] `CRON_SECRET`
- [ ] `NEXT_PUBLIC_APP_URL`

**Опціональні (але бажані):**
- [ ] `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- [ ] `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- [ ] `OPENAI_API_KEY`
- [ ] `TELEGRAM_BOT_TOKEN`

## 4. Перший деплой

- [ ] Натиснути "Deploy"
- [ ] Дочекатися завершення (~3-5 хв)
- [ ] Перевірити: `https://ваш-домен.vercel.app` відкривається

## 5. Ініціалізація бази даних

```bash
# Варіант A: через curl (після деплою)
curl -X POST https://ваш-домен.vercel.app/api/seed \
  -H "Content-Type: application/json" \
  -d '{"secret": "ТВІЙ_CRON_SECRET"}'

# Варіант B: через Prisma Studio (локально з prod DATABASE_URL)
DATABASE_URL="prod_url" npx prisma db seed
```

- [ ] SuperAdmin створений (email з `SUPERADMIN_EMAIL`)
- [ ] Глобальні категорії створені (9 шт)
- [ ] PlatformSettings ініціалізовані

## 6. Stripe Webhook

- [ ] [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) → Add endpoint
- [ ] URL: `https://ваш-домен.vercel.app/api/stripe/webhook`
- [ ] Events (вибрати всі):
  - `payment_intent.succeeded`
  - `invoice.paid`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Скопіювати Signing secret → додати `STRIPE_WEBHOOK_SECRET` у Vercel
- [ ] Vercel → Redeploy

## 7. Кастомний домен (опціонально)

- [ ] Vercel → Settings → Domains → Add
- [ ] Додати DNS запис у реєстратора: `CNAME` → `cname.vercel-dns.com`
- [ ] Дочекатися SSL (~5-10 хв)
- [ ] Оновити `NEXTAUTH_URL` та `NEXT_PUBLIC_APP_URL` на реальний домен
- [ ] Redeploy

## 8. Telegram Bot (опціонально)

- [ ] Після деплою відкрити: `https://ваш-домен.vercel.app/dashboard/[storeId]/settings/telegram`
- [ ] Натиснути "Зареєструвати Webhook"

## 9. Фінальна перевірка

- [ ] `https://wazo.market/` — головна відкривається
- [ ] `https://wazo.market/login` — вхід SuperAdmin працює
- [ ] `https://wazo.market/dashboard` — редирект на /login (middleware)
- [ ] `https://wazo.market/superadmin` — SuperAdmin панель
- [ ] Створити тестовий магазин → додати товар → тестове замовлення
- [ ] Перевірити email підтвердження замовлення
- [ ] Stripe test payment: картка `4242 4242 4242 4242`
