import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";

export default async function NewProductPage({
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
    where: {
      id: storeId,
      ownerId: session.user.id,
    },
  });

  if (!store) {
    redirect("/dashboard");
  }

  const categories = await prisma.category.findMany({
    where: {
      storeId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Створити товар</h1>
        <p className="text-gray-500 mt-2">
          Додайте новий товар до вашого магазину.
        </p>
      </div>

      <ProductForm 
        storeId={storeId} 
        categories={categories} 
      />
    </div>
  );
}
