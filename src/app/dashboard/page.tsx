import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateStoreButton } from "@/components/dashboard/create-store-button";
import { ModalProvider } from "@/components/providers/modal-provider";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Получаем актуальные данные пользователя
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Получаем магазины пользователя
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
        select: { totalPrice: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ModalProvider />
      
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Wazo.Market</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">
                Привет, {user?.name || session.user.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Выйти
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Ваши магазины</h1>
          {stores.length > 0 && <CreateStoreButton />}
        </div>

        {stores.length === 0 ? (
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-12 sm:p-16 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 className="mt-2 text-lg font-medium text-gray-900">Нет магазинов</h2>
              <p className="mt-1 text-sm text-gray-500 mb-6">
                Вы еще не создали ни одного магазина. Самое время начать!
              </p>
              <CreateStoreButton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => {
              const gmv = store.orders.reduce((sum, order) => sum + order.totalPrice, 0);
              
              return (
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
                      { label: 'GMV',        value: `₴${Math.round(gmv).toLocaleString('uk-UA')}` },
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
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
