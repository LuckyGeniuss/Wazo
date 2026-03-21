import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree, Edit, Trash2 } from "lucide-react";
import { CreateCategoryModal } from "@/components/dashboard/categories/create-category-modal";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const session = await auth();
  const { storeId } = await params;

  if (!session?.user) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    where: { storeId },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Категорії</h1>
          <p className="text-muted-foreground mt-1">
            Керування категоріями товарів
          </p>
        </div>
        <CreateCategoryModal storeId={storeId}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Додати категорію
          </Button>
        </CreateCategoryModal>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Список категорій
          </CardTitle>
          <CardDescription>
            {categories.length} категорій у магазині
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Немає категорій</h3>
              <p className="text-muted-foreground mt-1">
                Створіть першу категорію для початку
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderTree className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{category.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {category._count.products} товарів
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
