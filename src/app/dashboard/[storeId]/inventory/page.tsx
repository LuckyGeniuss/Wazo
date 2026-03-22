import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

export default async function InventoryPage({
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
      variants: true,
    },
  });

  // Розрахунок залишків
  const inventoryStats = products.reduce(
    (acc, product) => {
      const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      acc.totalStock += totalStock;
      if (totalStock === 0) {
        acc.outOfStock++;
      } else if (totalStock < 10) {
        acc.lowStock++;
      } else {
        acc.inStock++;
      }
      return acc;
    },
    { totalStock: 0, outOfStock: 0, lowStock: 0, inStock: 0 }
  );

  const lowStockProducts = products.filter((product) => {
    const stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    return stock > 0 && stock < 10;
  });

  const outOfStockProducts = products.filter((product) => {
    const stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    return stock === 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Склад</h1>
        <p className="text-muted-foreground mt-1">
          Управління залишками та попередження
        </p>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Усього товарів</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {inventoryStats.totalStock} од. на складі
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В наявності</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.inStock}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((inventoryStats.inStock / (products.length || 1)) * 100)}% асортименту
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Закінчується</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.lowStock}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Менше 10 од.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Немає в наявності</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.outOfStock}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Потребують уваги
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Попередження */}
      {outOfStockProducts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Увага!</strong> {outOfStockProducts.length} товар(ів) закінчилися:{" "}
            {outOfStockProducts.slice(0, 3).map((p) => p.name).join(", ")}
            {outOfStockProducts.length > 3 && ` та ще ${outOfStockProducts.length - 3}`}
          </AlertDescription>
        </Alert>
      )}

      {lowStockProducts.length > 0 && (
        <Alert>
          <TrendingDown className="h-4 w-4" />
          <AlertDescription>
            <strong>Поповнення:</strong> {lowStockProducts.length} товар(ів) із залишком менше 10 од.
          </AlertDescription>
        </Alert>
      )}

      {/* Таблиця залишків */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Залишки товарів
          </CardTitle>
          <CardDescription>
            {products.length} товарів в асортименті
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Немає товарів</h3>
              <p className="text-muted-foreground mt-1">
                Додайте перший товар для початку роботи
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => {
                const stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
                const isLowStock = stock > 0 && stock < 10;
                const isOutOfStock = stock === 0;

                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.variants.length} варіант(ів)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOutOfStock ? (
                        <Badge variant="destructive">Немає</Badge>
                      ) : isLowStock ? (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {stock} од.
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {stock} од.
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
