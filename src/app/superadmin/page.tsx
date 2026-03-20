import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import {
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  Activity,
  AlertTriangle,
  ShoppingCart,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const [
    storesCount, 
    usersCount, 
    productsCount, 
    ordersStats, 
    recentOrders,
    pendingDisputes
  ] = await Promise.all([
    prisma.store.count({ where: { isSuspended: false } }),
    prisma.user.count(),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.order.aggregate({ 
      where: { status: { in: ['COMPLETED', 'SHIPPED', 'PROCESSING'] } },
      _sum: { totalPrice: true }, 
      _count: true 
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true, totalPrice: true, status: true, createdAt: true, customerName: true,
        store: { select: { name: true, slug: true } },
      },
    }),
    // Mocking pending disputes as we don't have this model yet
    Promise.resolve(0) 
  ]);

  const totalRevenue = ordersStats._sum.totalPrice || 0;
  const totalOrders = ordersStats._count || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SuperAdmin Дашборд</h1>
          <p className="text-slate-500 mt-1">Глобальний огляд показників платформи</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-sm font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Всі системи працюють
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={80} className="text-indigo-600" />
          </div>
          <p className="text-slate-500 font-medium text-sm mb-2 relative z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            Platform GMV
          </p>
          <p className="text-3xl font-black text-slate-900 relative z-10">{formatPrice(totalRevenue)}</p>
          <div className="mt-4 flex items-center text-emerald-600 text-xs font-semibold relative z-10">
            <span>Загальний обіг коштів</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Store size={80} className="text-amber-600" />
          </div>
          <p className="text-slate-500 font-medium text-sm mb-2 relative z-10 flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Store size={16} />
            </div>
            Активні магазини
          </p>
          <p className="text-3xl font-black text-slate-900 relative z-10">{storesCount}</p>
          <div className="mt-4 flex items-center text-slate-400 text-xs font-semibold relative z-10">
            <span>Всього на платформі</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Users size={80} className="text-emerald-600" />
          </div>
          <p className="text-slate-500 font-medium text-sm mb-2 relative z-10 flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={16} />
            </div>
            Користувачі
          </p>
          <p className="text-3xl font-black text-slate-900 relative z-10">{usersCount}</p>
          <div className="mt-4 flex items-center text-slate-400 text-xs font-semibold relative z-10">
            <span>Зареєстрованих акаунтів</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <ShoppingBag size={80} className="text-blue-600" />
          </div>
          <p className="text-slate-500 font-medium text-sm mb-2 relative z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
            Активні товари
          </p>
          <p className="text-3xl font-black text-slate-900 relative z-10">{productsCount}</p>
          <div className="mt-4 flex items-center text-slate-400 text-xs font-semibold relative z-10">
            <span>Опубліковано в каталозі</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area (Placeholder) */}
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-[400px] flex flex-col relative overflow-hidden">
             <div className="flex items-center justify-between mb-6 relative z-10">
               <h2 className="text-lg font-bold text-slate-900">Динаміка продажів (GMV)</h2>
               <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                  <option>Останні 30 днів</option>
                  <option>Останні 7 днів</option>
                  <option>Цей рік</option>
               </select>
             </div>
             
             <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50 relative z-10">
               <div className="text-center">
                 <Activity size={48} className="mx-auto text-slate-300 mb-3" />
                 <p className="text-slate-500 font-medium">Графік продажів у розробці</p>
                 <p className="text-slate-400 text-sm mt-1">Тут буде відображатись динаміка по днях</p>
               </div>
             </div>
             
             {/* Decorative background for chart area */}
             <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-indigo-50/50 to-transparent pointer-events-none"></div>
           </div>
        </div>

        {/* System Alerts & Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              Увага потребують
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div>
                  <p className="font-semibold text-amber-900 text-sm">Відкриті суперечки</p>
                  <p className="text-amber-700 text-xs">Покупці vs Продавці</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center">
                  {pendingDisputes}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <div>
                  <p className="font-semibold text-rose-900 text-sm">Скарги на магазини</p>
                  <p className="text-rose-700 text-xs">Необхідна модерація</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center">
                  0
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-indigo-500/30">
              <ShoppingCart size={120} />
            </div>
            <div className="relative z-10">
              <p className="text-indigo-200 text-sm font-medium mb-1">Успішних транзакцій</p>
              <p className="text-4xl font-black mb-4">{totalOrders}</p>
              <Link href="/superadmin/analytics" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-indigo-200 transition-colors">
                Детальний звіт <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Останні транзакції платформи</h2>
          <Link href="/superadmin/analytics" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Дивитись всі →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4 border-b border-slate-100">ID</th>
                <th className="px-6 py-4 border-b border-slate-100">Магазин</th>
                <th className="px-6 py-4 border-b border-slate-100">Покупець</th>
                <th className="px-6 py-4 border-b border-slate-100">Статус</th>
                <th className="px-6 py-4 border-b border-slate-100">Дата</th>
                <th className="px-6 py-4 border-b border-slate-100 text-right">Сума</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-500">{order.id.split('-')[0]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/${order.store.slug}`} target="_blank" className="font-medium text-slate-900 hover:text-indigo-600 hover:underline">
                      {order.store.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {order.customerName || 'Гість'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wide
                      ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-700' :
                        order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatPrice(order.totalPrice)}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Немає транзакцій
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
