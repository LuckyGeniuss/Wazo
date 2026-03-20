import { prisma } from "@/lib/prisma";
import { ProductCard } from "./product-card";

// Расширяем тип Product для включения связанных данных
type ProductWithDetails = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

interface ProductGridProps {
  storeId?: string;
  limit: number;
  title?: string;
}

export async function ProductGrid({ storeId, limit, title = "Наши товары" }: ProductGridProps) {
  const where: any = {
    isArchived: false,
  };

  if (storeId) {
    where.storeId = storeId;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      store: {
        select: {
          slug: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit || 4,
  });

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-center">
        {title}
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          В этом магазине пока нет активных товаров.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product: ProductWithDetails) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

