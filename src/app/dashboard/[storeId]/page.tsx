import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import {
  PackageSearch,
  ShoppingCart,
  Settings,
  Globe,
  TrendingUp,
  Users,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';

export default async function StoreDashboardPage(
  props: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  try {
    const store = await prisma.store.findFirst({
      where: { id: storeId },
      select: { id: true, name: true, slug: true, createdAt: true },
    });

    if (!store) redirect('/dashboard');

    const [productsCount, ordersCount, revenue, recentOrders] = await Promise.all([
      prisma.product.count({ where: { storeId } }).catch(() => 0),
      prisma.order.count({ where: { storeId } }).catch(() => 0),
      prisma.order.aggregate({
        where: { storeId, status: { in: ['COMPLETED', 'SHIPPED', 'PROCESSING'] } },
        _sum: { totalPrice: true },
      }).catch(() => ({ _sum: { totalPrice: 0 } })),
      prisma.order.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          orderItems: { include: { product: { select: { name: true } } } },
        }
      }).catch(() => []),
    ]);

    const gmv = revenue._sum.totalPrice || 0;

    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{store.name}</h1>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                Онлайн
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
              <Globe size={14} />
              <a href={`https://wazo-market.vercel.app/${store.slug}`} target="_blank" className="hover:text-violet-600 hover:underline transition-all">
                wazo-market.vercel.app/{store.slug}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/${store.slug}`} target="_blank"
               className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold shadow-sm">
              <Globe size={16} />
              Перейти на сайт
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={64} className="text-violet-600" />
            </div>
            <p className="text-slate-500 font-medium text-sm mb-1 relative z-10">Загальний дохід (GMV)</p>
            <p className="text-3xl font-black text-slate-900 relative z-10">{formatPrice(gmv)}</p>
            <div className="mt-4 flex items-center text-emerald-600 text-xs font-semibold relative z-10">
              <ArrowUpRight size={14} className="mr-1" />
              <span>За весь час</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <PackageSearch size={64} className="text-blue-600" />
            </div>
            <p className="text-slate-500 font-medium text-sm mb-1 relative z-10">Активних товарів</p>
            <p className="text-3xl font-black text-slate-900 relative z-10">{productsCount}</p>
            <div className="mt-4 flex items-center text-slate-400 text-xs font-semibold relative z-10">
              <span>В каталозі магазину</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <ShoppingCart size={64} className="text-orange-600" />
            </div>
            <p className="text-slate-500 font-medium text-sm mb-1 relative z-10">Всього замовлень</p>
            <p className="text-3xl font-black text-slate-900 relative z-10">{ordersCount}</p>
            <div className="mt-4 flex items-center text-emerald-600 text-xs font-semibold relative z-10">
              <ArrowUpRight size={14} className="mr-1" />
              <span>Отримано через маркетплейс</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Users size={64} className="text-emerald-600" />
            </div>
            <p className="text-slate-500 font-medium text-sm mb-1 relative z-10">Дата створення</p>
            <p className="text-xl font-bold text-slate-900 relative z-10 mt-2">
              {new Date(store.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="mt-4 flex items-center text-slate-400 text-xs font-semibold relative z-10">
              <span>Працюєте з нами</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Швидкий доступ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <Link href={`/dashboard/${storeId}/products`}
                 className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-violet-300 hover:shadow-md hover:shadow-violet-500/5 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PackageSearch size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">Товари</p>
                  <p className="text-xs text-slate-500 mt-0.5">Управління каталогом</p>
                </div>
              </Link>

              <Link href={`/dashboard/${storeId}/orders`}
                 className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Замовлення</p>
                  <p className="text-xs text-slate-500 mt-0.5">Обробка продажів</p>
                </div>
              </Link>
              
              <Link href={`/dashboard/${storeId}/settings`}
                 className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Налаштування</p>
                  <p className="text-xs text-slate-500 mt-0.5">Профіль магазину</p>
                </div>
              </Link>
              
               <Link href={`/dashboard/${storeId}/finance`}
                 className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Фінанси</p>
                  <p className="text-xs text-slate-500 mt-0.5">Виплати та баланс</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Останні замовлення</h2>
              <Link href={`/dashboard/${storeId}/orders`} className="text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline">
                Всі замовлення →
              </Link>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              {recentOrders.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Поки немає замовлень</h3>
                  <p className="text-slate-500 mt-1 mb-6 max-w-sm">
                    Ваші товари ще не купували. Додайте більше товарів або запустіть рекламу.
                  </p>
                  <Link href={`/dashboard/${storeId}/products`} className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                    Додати товари
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                        <th className="px-6 py-4">ID / Товари</th>
                        <th className="px-6 py-4">Дата</th>
                        <th className="px-6 py-4">Статус</th>
                        <th className="px-6 py-4 text-right">Сума</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <Link href={`/dashboard/${storeId}/orders/${order.id}`} className="block">
                              <p className="text-xs font-mono text-slate-400 mb-1">#{order.id.split('-')[0]}</p>
                              <p className="font-semibold text-slate-900 text-sm line-clamp-1">
                                {order.orderItems[0]?.product?.name || 'Товар видалено'}
                                {order.orderItems.length > 1 && <span className="text-slate-400 font-normal ml-1">та ще {order.orderItems.length - 1}</span>}
                              </p>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(order.createdAt).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wide
                              ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                'bg-slate-100 text-slate-700'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">
                            {formatPrice(order.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('[Dashboard Error]', error);
    redirect('/dashboard');
  }
}
