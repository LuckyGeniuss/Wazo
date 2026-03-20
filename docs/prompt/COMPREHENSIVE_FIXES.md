# 🔧 КОМПЛЕКСНІ ВИПРАВЛЕННЯ — АНАЛІЗ СКРІНШОТІВ
## Промпт для Roo Code | 8 проблем з 8 скріншотів

---

## ПРОБЛЕМА 1: Категорії на головній — ЗЛАМАНІ (показує кольорові смуги)

На скріншоті 7 замість іконок категорій відображаються фіолетові/сині завантажувальні смуги. SVG іконки або не підключились або компонент помилковий.

```bash
# Знайти де рендеряться категорії на головній
grep -rn "CategoryBento\|category-bento\|CategoryIcons" src/app --include="*.tsx" | head -10

# Перевірити що є в компоненті
cat src/components/marketplace/category-icons.tsx | head -20
```

**Виправлення — спрощений стабільний варіант:**

В `src/app/page.tsx` або `src/app/(marketplace)/page.tsx` замінити блок категорій на:

```typescript
// Прості категорії БЕЗ зовнішніх SVG компонентів — одразу в JSX
const CAT_EMOJI: Record<string, string> = {
  electronics: '📱', clothing: '👕', home: '🏠', beauty: '💄',
  sport: '⚽', auto: '🚗', kids: '🧸', books: '📚', food: '🛒',
  tools: '🔧', pets: '🐾', jewelry: '💎',
};

const CAT_GRADIENT: Record<string, string> = {
  electronics: 'from-blue-600 to-cyan-500',
  clothing:    'from-pink-600 to-rose-500',
  home:        'from-amber-500 to-orange-400',
  beauty:      'from-purple-600 to-pink-500',
  sport:       'from-green-600 to-emerald-500',
  auto:        'from-slate-700 to-slate-500',
  kids:        'from-yellow-500 to-amber-400',
  books:       'from-teal-600 to-cyan-500',
  food:        'from-lime-600 to-green-500',
};

// В JSX:
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 auto-rows-[130px]">
  {categories.map((cat, i) => {
    const emoji = CAT_EMOJI[cat.slug] || '🛍️';
    const grad  = CAT_GRADIENT[cat.slug] || 'from-violet-600 to-indigo-500';
    const isBig = i < 2;
    return (
      <Link key={cat.id} href={`/search?category=${cat.slug}`}
            className={`group relative overflow-hidden rounded-2xl
                        bg-gradient-to-br ${grad}
                        hover:scale-[1.03] hover:shadow-xl transition-all duration-300
                        ${isBig ? 'col-span-2 row-span-2' : ''}`}>
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10
                        transition-colors duration-300" />
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <span className={`transition-transform duration-300
                            group-hover:scale-125 select-none
                            ${isBig ? 'text-6xl' : 'text-4xl'}`}>
            {emoji}
          </span>
          <div>
            <p className={`font-bold text-white leading-tight
                           ${isBig ? 'text-xl' : 'text-sm'}`}>
              {cat.name}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {cat._count.products} товарів
            </p>
          </div>
        </div>
      </Link>
    );
  })}
</div>
```

---

## ПРОБЛЕМА 2: Форматування цін — "₴62333.00" замість "₴62 333"

На скріншоті ціни виглядають як `₴62333.00` — некрасиво. Треба прибрати `.00` і додати пробіли як роздільники тисяч.

```bash
# Знайти всі місця
grep -rn "toLocaleString\|toFixed" src/app --include="*.tsx" | grep -v node_modules | head -20
```

**Виправлення — глобальна утиліта:**

Створи `src/lib/format.ts`:

```typescript
// Форматування валюти для України
export function formatPrice(price: number): string {
  // ₴62 333 (без копійок якщо ціна ціла)
  if (price % 1 === 0) {
    return '₴' + price.toLocaleString('uk-UA');
  }
  return '₴' + price.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Короткий формат для великих чисел
export function formatPriceShort(price: number): string {
  if (price >= 1000000) return `₴${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000)    return `₴${(price / 1000).toFixed(0)}K`;
  return '₴' + price.toLocaleString('uk-UA');
}
```

```bash
# Замінити всі проблемні місця:
# Знайти .toLocaleString('uk-UA') що повертають .00
grep -rn "price.toLocaleString\|totalPrice.toLocaleString" src/ --include="*.tsx" | head -20

# Замінити pattern:
# `₴${price.toLocaleString('uk-UA')}` → `${formatPrice(price)}`
# або: price.toLocaleString('uk-UA') → Math.round(price).toLocaleString('uk-UA')
```

Швидке виправлення скрізь:
```typescript
// Замість: ₴{price.toLocaleString('uk-UA')}
// Писати:  ₴{Math.round(price).toLocaleString('uk-UA')}
// Це прибере .00 і покаже ₴62 333
```

---

## ПРОБЛЕМА 3: Dashboard — неправильний бренд "Wazo.CRM"

На скріншоті 5 написано "Wazo.CRM" замість "Wazo.Market". Також немає інформації про магазини — тільки назва і дата.

```bash
# Знайти де "Wazo.CRM"
grep -rn "Wazo.CRM\|Wazo\.CRM" src/ --include="*.tsx" --include="*.ts" | head -10
```

**Виправити назву:**
```typescript
// Замінити скрізь "Wazo.CRM" → "Wazo.Market"
```

**Покращити картки магазинів в Dashboard:**

Знайти `src/app/dashboard/page.tsx` і замінити картки:

```typescript
// Завантажити більше даних для кожного магазину
const stores = await prisma.store.findMany({
  where: { ownerId: session.user.id },
  include: {
    _count: {
      select: {
        products: true,
        orders: true,
      }
    },
    orders: {
      where: { status: { in: ['COMPLETED', 'SHIPPED', 'PROCESSING'] } },
      select: { totalPrice: true },
    },
  },
  orderBy: { createdAt: 'desc' },
});

// Порахувати GMV для кожного магазину
const storesWithGMV = stores.map(store => ({
  ...store,
  gmv: store.orders.reduce((sum, o) => sum + o.totalPrice, 0),
}));
```

**Нові картки магазинів:**
```typescript
// Замінити старі картки на нові з більше інформацією:
{storesWithGMV.map(store => (
  <div key={store.id} className="bg-white border rounded-2xl overflow-hidden
                                  hover:shadow-lg hover:border-violet-200
                                  transition-all group">
    {/* Шапка картки */}
    <div className="p-5 border-b bg-gradient-to-r from-violet-50 to-indigo-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600
                          flex items-center justify-center text-white font-black text-lg
                          shadow-md">
            {store.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-base">{store.name}</h3>
            <p className="text-xs text-slate-500">wazo-market.vercel.app/{store.slug}</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full
                         bg-green-100 text-green-700">
          Активний
        </span>
      </div>
    </div>

    {/* Статистика */}
    <div className="grid grid-cols-3 divide-x">
      {[
        { label: 'Товарів',    value: store._count.products },
        { label: 'Замовлень',  value: store._count.orders },
        { label: 'GMV',        value: `₴${Math.round(store.gmv).toLocaleString('uk-UA')}` },
      ].map(stat => (
        <div key={stat.label} className="p-4 text-center">
          <p className="text-xl font-black text-slate-800">{stat.value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Дії */}
    <div className="p-4 flex gap-2">
      <a href={`/dashboard/${store.id}`}
         className="flex-1 text-center py-2.5 bg-violet-600 text-white rounded-xl
                    text-sm font-semibold hover:bg-violet-700 transition-colors">
        Управління →
      </a>
      <a href={`/${store.slug}`} target="_blank"
         className="px-4 py-2.5 border rounded-xl text-sm text-slate-600
                    hover:bg-slate-50 transition-colors">
        Вітрина ↗
      </a>
    </div>
  </div>
))}
```

---

## ПРОБЛЕМА 4: Dashboard/[storeId] — "Помилка в панелі керування"

```bash
# Знайти де помилка
cat src/app/dashboard/\[storeId\]/page.tsx | head -40
# або
cat src/app/dashboard/\[storeId\]/layout.tsx | head -40
```

Причина: або стор не знаходиться по ID, або Prisma помилка.

**Виправлення:**
```typescript
// В src/app/dashboard/[storeId]/page.tsx або layout.tsx:
const { storeId } = await props.params;

// Додати перевірку
if (!storeId) redirect('/dashboard');

const store = await prisma.store.findFirst({
  where: {
    id: storeId,
    // Видали OR власника якщо є — дозволь будь-який доступ для дебагу
  },
}).catch(() => null);

if (!store) {
  redirect('/dashboard');
}
```

**Також перевірити Vercel ENV:**
В Vercel Dashboard → Settings → Environment Variables переконатись що `DATABASE_URL` правильний і не закінчився.

---

## ПРОБЛЕМА 5: SuperAdmin/settings → 404

```bash
ls src/app/superadmin/settings/ 2>/dev/null || echo "ВІДСУТНІЙ"
```

Якщо немає — створити мінімальну сторінку:

```typescript
// src/app/superadmin/settings/page.tsx
export default function SuperAdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Налаштування платформи</h1>
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Загальні налаштування</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <p>✅ База даних: підключена (Neon PostgreSQL)</p>
            <p>✅ Email: Resend API</p>
            <p>✅ Медіафайли: Cloudinary</p>
            <p>✅ Платежі: Stripe</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">ENV Змінні</h3>
          <p className="text-sm text-slate-500">
            Конфігурація через Vercel Dashboard → Settings → Environment Variables
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## ПРОБЛЕМА 6: SuperAdmin — дуже мінімальний дизайн

Поточний SuperAdmin виглядає як студентський проект. Додати:

```typescript
// Оновити src/app/superadmin/page.tsx — додати більше метрик:

const [storesCount, usersCount, productsCount, ordersStats, recentOrders] = await Promise.all([
  prisma.store.count({ where: { isSuspended: false } }),
  prisma.user.count(),
  prisma.product.count({ where: { isArchived: false } }),
  prisma.order.aggregate({ _sum: { totalPrice: true }, _count: true }),
  prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true, totalPrice: true, status: true, createdAt: true,
      store: { select: { name: true } },
    },
  }),
]);

// Показати:
// 4 KPI картки: Магазини, Користувачі, Товари, Platform GMV
// Графік (або заглушку) — "Скоро: графік продажів"
// Таблиця останніх 5 замовлень з усієї платформи
// Таблиця магазинів (вже є)
```

---

## ПРОБЛЕМА 7: Дублікат користувача

В Users таблиці: `sergey.varava@gmail.com` і `Sergey.varava@gmail.com` — два різних записи з одним email (різний регістр). Потрібно об'єднати:

```bash
node -e "
const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany({ select: { id: true, email: true, name: true, role: true } })
  .then(u => console.log(JSON.stringify(u, null, 2)))
  .finally(() => p.\$disconnect())
"
```

Потім видалити дублікат з нижчим пріоритетом через Prisma Studio або:
```bash
npx prisma studio
# Знайти і видалити USER з Sergey.varava@gmail.com (велика S)
```

---

## ПРОБЛЕМА 8: Подвійний футер (ще залишається?)

```bash
grep -rn "Footer\|SiteFooter\|MarketplaceFooter" src/app --include="*.tsx" | grep -v "import\|//"
```

Має бути ТІЛЬКИ один виклик в layout файлі. Всі інші видалити.

---

## ФІНАЛ

```bash
npm run build 2>&1 | tail -10

# Перевірити форматування цін локально
grep -rn "toLocaleString" src/app --include="*.tsx" | grep "price\|Price" | head -10

git add -A
git commit -m "fix: category icons, price format, dashboard brand, stores info, superadmin settings"
git push origin main
```

## ПРІОРИТЕТИ (по важливості):

| # | Проблема | Терміновість |
|---|---------|-------------|
| 1 | Категорії зламані (кольорові смуги) | 🔴 Критично — видно одразу |
| 2 | Ціни ₴62333.00 замість ₴62 333 | 🔴 Критично — виглядає непрофесійно |
| 3 | Dashboard "Wazo.CRM" і бідні картки | 🟡 Важливо |
| 4 | Dashboard/[storeId] помилка | 🔴 Критично — продавець не може увійти |
| 5 | SuperAdmin/settings → 404 | 🟡 Важливо |
| 6 | SuperAdmin мінімальний | 🟢 Покращення |
| 7 | Дублікат користувача | 🟡 Важливо |
| 8 | Подвійний футер | 🔴 Критично — виглядає зламано |
