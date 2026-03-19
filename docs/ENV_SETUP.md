# 🔑 Налаштування змінних середовища

Скопіюй `.env.example` → `.env` і заповни всі значення.

---

## Обов'язкові

### База даних
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/wazo_market?sslmode=require"
```
**Де взяти:** [console.neon.tech](https://console.neon.tech) → Project → Connection String

---

### Аутентифікація
```env
AUTH_SECRET="згенерувати: openssl rand -base64 32"
NEXTAUTH_URL="https://wazo.market"
```

---

### Stripe
```env
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```
**Де взяти:**
1. [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) → Secret key та Publishable key
2. Після деплою: Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://wazo.market/api/stripe/webhook`
   - Events: `payment_intent.succeeded`, `invoice.paid`, `customer.subscription.*`
   - Скопіювати Signing secret → `STRIPE_WEBHOOK_SECRET`

---

### Cloudinary (медіа файли)
```env
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```
**Де взяти:** [cloudinary.com/console](https://cloudinary.com/console) → Dashboard

---

### Resend (email)
```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="no-reply@wazo.market"
```
**Де взяти:** [resend.com/api-keys](https://resend.com/api-keys)

---

### Додаток
```env
NEXT_PUBLIC_APP_URL="https://wazo.market"
CRON_SECRET="будь-яка-випадкова-строка-мін-32-символи"
```

---

## Опціональні

### Google OAuth (соціальний вхід)
```env
AUTH_GOOGLE_ID="...apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="..."
```
**Де взяти:** [console.cloud.google.com](https://console.cloud.google.com) → APIs → Credentials → OAuth 2.0

---

### Upstash Redis (кешування)
```env
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
REDIS_URL="redis://default:password@host:6379"
```
**Де взяти:** [console.upstash.com](https://console.upstash.com) → Redis → REST API

---

### AI провайдери (системні ключі)
```env
OPENAI_API_KEY="sk-..."
GOOGLE_AI_API_KEY="AIza..."
```
*Якщо не вказані — користувачі використовують власні ключі (BYOK)*

---

### Telegram Bot
```env
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_BOT_USERNAME="WazoMarketBot"
TELEGRAM_WEBHOOK_SECRET="будь-яка-строка"
```
**Де взяти:** [@BotFather](https://t.me/BotFather) → /newbot

---

### Web Push (PWA сповіщення)
```env
VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_EMAIL="mailto:admin@wazo.market"
```
**Генерація:**
```bash
node -e "const wp=require('web-push');console.log(wp.generateVAPIDKeys())"
```

---

### SuperAdmin (seed)
```env
SUPERADMIN_EMAIL="admin@wazo.market"
SUPERADMIN_PASSWORD="змінити-після-першого-входу"
```
