import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/renderers/product-card";
import { CategoryFilterSidebar } from "@/components/renderers/category-filter-sidebar";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const categoryId = typeof params.category === "string" ? params.category : undefined;
  
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const limit = 24;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    store: { isActive: true }, // only active stores
  };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Fetch products and total count
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        store: { select: { slug: true, name: true } },
        reviews: { select: { rating: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar with categories & filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <CategoryFilterSidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `Результаты поиска по "${query}"` : "Все товары"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Найдено товаров: {totalCount}
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const searchUrl = new URLSearchParams();
                  if (query) searchUrl.set("q", query);
                  if (categoryId) searchUrl.set("category", categoryId);
                  searchUrl.set("page", p.toString());
                  
                  return (
                    <a
                      key={p}
                      href={`/search?${searchUrl.toString()}`}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        p === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </a>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
            <p className="text-gray-500">
              Попробуйте изменить запрос или выбрать другую категорию.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
