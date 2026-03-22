import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateStoreButton } from "@/components/dashboard/create-store-button";
import { ModalProvider } from "@/components/providers/modal-provider";
import { formatPrice } from "@/lib/format";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  });
  
  const stores = await prisma.store.findMany({
  where: user?.role === 'SUPERADMIN'
  ? undefined // SuperAdmin бачить всі магазини
  : { ownerId: session.user.id }, // SELLER бачить тільки свої
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
    orderBy: { createdAt: "desc" },
  });

  const storesWithGMV = stores.map(store => ({
    ...store,
    gmv: store.orders.reduce((sum, o) => sum + o.totalPrice, 0),
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <ModalProvider />
      
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Wazo.Market
              </span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                Seller
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-slate-600 text-sm font-medium">
                {user?.name || session.user.email}
              </span>
              <div className="h-6 w-px bg-slate-200"></div>
              <Link
                href="/api/auth/signout"
                className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
              >
                Вийти
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ваші магазини</h1>
            <p className="mt-1 text-slate-500">Керуйте своїми магазинами та відстежуйте продажі</p>
          </div>
          {stores.length > 0 && <CreateStoreButton />}
        </div>

        {stores.length === 0 ? (
          <div className="bg-white overflow-hidden shadow-sm rounded-3xl border border-slate-200">
            <div className="px-4 py-16 sm:p-20 text-center max-w-lg mx-auto">
              <div className="w-24 h-24 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Немає магазинів</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Ви ще не створили жодного магазину. Почніть продавати прямо зараз — це швидко і просто!
              </p>
              <div className="flex justify-center">
                <CreateStoreButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {storesWithGMV.map((store) => (
              <div key={store.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden
                                              hover:shadow-xl hover:shadow-violet-500/10 hover:border-violet-300
                                              transition-all duration-300 group flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600
                                      flex items-center justify-center text-white font-black text-xl
                                      shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                        {store.name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-violet-700 transition-colors">{store.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">wazo-market.vercel.app/{store.slug}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full
                                     bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">
                      Активний
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-100 flex-1">
                  {[
                    { label: 'Товарів',    value: store._count.products },
                    { label: 'Замовлень',  value: store._count.orders },
                    { label: 'GMV',        value: formatPrice(store.gmv) },
                  ].map((stat, idx) => (
                    <div key={stat.label} className="p-5 text-center flex flex-col justify-center bg-white">
                      <p className={`text-xl font-black ${idx === 2 ? 'text-violet-600' : 'text-slate-800'}`}>
                        {stat.value}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="p-5 flex gap-3 bg-slate-50/50 mt-auto">
                  <a href={`/dashboard/${store.id}`}
                     className="flex-1 text-center py-3 bg-violet-600 text-white rounded-2xl
                                text-sm font-bold shadow-md shadow-violet-500/20 
                                hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30 
                                hover:-translate-y-0.5 transition-all">
                    Керувати магазином
                  </a>
                  <a href={`/${store.slug}`} target="_blank"
                     className="px-5 py-3 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-600
                                hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900 
                                transition-all flex items-center justify-center"
                     title="Відкрити вітрину">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
