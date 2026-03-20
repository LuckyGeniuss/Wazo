import { prisma } from "@/lib/prisma";
import { CreatePageButton } from "./create-page-button";
import Link from "next/link";
import { auth } from "@/auth";

export default async function PagesManager({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const session = await auth();

  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  const pages = await prisma.page.findMany({
    where: {
      storeId,
      store: { ownerId: session?.user?.id }, // Дополнительная защита
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Страницы</h1>
          <p className="text-gray-500 mt-2">
            Управляйте страницами вашего магазина и открывайте их в конструкторе.
          </p>
        </div>
        <CreatePageButton storeId={storeId} />
      </div>

      {pages.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500 shadow-sm">
          У вас пока нет созданных страниц.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {pages.map((page) => (
              <li key={page.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{page.name}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                    <span>Slug: /{page.slug}</span>
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${page.isPublished ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {page.isPublished ? "Опубликовано" : "Черновик"}
                    </span>
                    <span>Обновлено: {new Date(page.updatedAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link
                    href={`/${store?.slug}/${page.slug}`}
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Сайт
                  </Link>
                  <Link
                    href={`/dashboard/${storeId}/builder/${page.id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Редактировать
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
