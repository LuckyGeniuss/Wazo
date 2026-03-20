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
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ModalProvider />
      
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Wazo.CRM</span>
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
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="px-6 py-5 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{store.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">slug: /{store.slug}</p>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Создан {new Date(store.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                  <Link
                    href={`/dashboard/${store.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Управление →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
