import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/renderers/product-grid";

export async function Marketplace() {
  const banners = await prisma.banner.findMany({
    where: {
      isGlobal: true,
      location: "HOME",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      {/* TODO: Add Banner Slider */}
      <h2 className="text-3xl font-bold text-center my-8">Все товары</h2>
      <ProductGrid storeId="" limit={20} title="" />
    </div>
  );
}
