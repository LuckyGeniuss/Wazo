import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function BannersPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: { id: storeId, ownerId: session.user.id },
  });

  if (!store) {
    redirect("/dashboard");
  }

  const banners = await prisma.banner.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Баннеры</h1>
          <p className="text-gray-500 mt-2">
            Управление рекламными баннерами вашего магазина
          </p>
        </div>
        <Link
          href={`/dashboard/${storeId}/banners/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Добавить баннер
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500 shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          У вас пока нет баннеров.
          <Link href={`/dashboard/${storeId}/banners/new`} className="text-blue-600 hover:text-blue-700 ml-2">
            Создайте первый!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold truncate">{banner.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    banner.location === 'HOME' ? 'bg-blue-100 text-blue-800' : 
                    banner.location === 'SIDEBAR' ? 'bg-purple-100 text-purple-800' : 
                    'bg-gray-100 text-gray-800'
                  }">
                    {banner.location === 'HOME' ? 'Главная' : 
                     banner.location === 'SIDEBAR' ? 'Боковая панель' : 'Каталог'}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {banner.isGlobal ? 'Глобальный' : 'Локальный'}
                  </span>
                </div>
                {banner.link && (
                  <p className="text-sm text-gray-600 truncate mb-3">
                    Ссылка: {banner.link}
                  </p>
                )}
                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/dashboard/${storeId}/banners/${banner.id}/edit`}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Редактировать
                  </Link>
                  <button className="text-red-600 hover:text-red-700 text-sm" aria-label={`Удалить баннер ${banner.title}`}>
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
