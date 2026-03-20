import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export default async function StoreDashboardPage(
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  try {
    const store = await prisma.store.findFirst({
      where: { id: storeId },
      select: { id: true, name: true, slug: true },
    });

    if (!store) redirect('/dashboard');

    const [productsCount, ordersCount, revenue] = await Promise.all([
      prisma.product.count({ where: { storeId } }).catch(() => 0),
      prisma.order.count({ where: { storeId } }).catch(() => 0),
      prisma.order.aggregate({
        where: { storeId, status: { in: ['COMPLETED', 'SHIPPED'] } },
        _sum: { totalPrice: true },
      }).catch(() => ({ _sum: { totalPrice: 0 } })),
    ]);

    const gmv = revenue._sum.totalPrice || 0;

    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <p className="text-slate-500 text-sm mt-1">
            wazo-market.vercel.app/{store.slug}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border rounded-2xl p-5">
            <p className="text-3xl font-black">{productsCount}</p>
            <p className="text-sm text-slate-500 mt-1">Товарів</p>
          </div>
          <div className="bg-white border rounded-2xl p-5">
            <p className="text-3xl font-black">{ordersCount}</p>
            <p className="text-sm text-slate-500 mt-1">Замовлень</p>
          </div>
          <div className="bg-white border rounded-2xl p-5">
            <p className="text-2xl font-black text-violet-700">
              ₴{Math.round(gmv).toLocaleString('uk-UA')}
            </p>
            <p className="text-sm text-slate-500 mt-1">GMV</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a href={`/dashboard/${storeId}/products`}
             className="p-4 bg-violet-50 border border-violet-200 rounded-2xl
                        hover:bg-violet-100 transition-colors">
            <p className="font-bold">📦 Товари</p>
            <p className="text-sm text-slate-500">Управління каталогом</p>
          </a>
          <a href={`/dashboard/${storeId}/orders`}
             className="p-4 bg-blue-50 border border-blue-200 rounded-2xl
                        hover:bg-blue-100 transition-colors">
            <p className="font-bold">🛒 Замовлення</p>
            <p className="text-sm text-slate-500">Обробка замовлень</p>
          </a>
          <a href={`/dashboard/${storeId}/settings`}
             className="p-4 bg-slate-50 border rounded-2xl hover:bg-slate-100 transition-colors">
            <p className="font-bold">⚙️ Налаштування</p>
            <p className="text-sm text-slate-500">Профіль магазину</p>
          </a>
          <a href={`/${store.slug}`} target="_blank"
             className="p-4 bg-green-50 border border-green-200 rounded-2xl
                        hover:bg-green-100 transition-colors">
            <p className="font-bold">🌐 Вітрина ↗</p>
            <p className="text-sm text-slate-500">Відкрити магазин</p>
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error('[Dashboard Error]', error);
    redirect('/dashboard');
  }
}
