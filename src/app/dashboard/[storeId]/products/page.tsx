import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProductModal } from "@/components/modals/product-modal";
import { ProductsClient } from "./client";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    where: {
      storeId,
      store: { ownerId: session.user.id },
    },
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log('[Products] storeId:', storeId, 'found:', products.length);

  return (
    <div>
      <ProductsClient data={products} storeId={storeId} />
    </div>
  );
}
