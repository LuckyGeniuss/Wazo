import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";
import {
  TrendingUp,
  Store,
  Users,
  ShoppingBag,
  DollarSign,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function SuperAdminAnalyticsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERADMIN") {
    redirect("/login");
  }

  const [
    storesCount,
    usersCount,
    productsCount,
    ordersStats,
    totalRevenue,
    recentStores,
    topProducts,
  ] = await Promise.all([
    prisma.store.count({ where: { isSuspended: false } }),
    prisma.user.count(),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.order.aggregate({
      where: { status: { in: ["COMPLETED", "SHIPPED", "PROCESSING"] } },
      _sum: { totalPrice: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { status: { in: ["COMPLETED", "SHIPPED"] } },
      _sum: { totalPrice: true },
    }),
    prisma.store.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: { select: { products: true, orders: true } },
        owner: { select: { name: true, email: true } },
      },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        store: { select: { name: true, slug: true } },
      },
    }),
  ]);

  const gmv = totalRevenue._sum.totalPrice || 0;
  const totalOrders = ordersStats._count || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Аналітика платформи
          </h1>
          <p className="text-slate-500 mt-1">
            Детальний огляд показників платформи Wazo.Market
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Останні 30 днів
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-5">
            <DollarSign size={80} className="text-indigo-600" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
              Platform GMV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">
              {formatPrice(gmv)}
            </p>
            <div className="mt-4 flex items-center text-emerald-600 text-xs font-semibold">
              <ArrowUpRight size={14} className="mr-1" />
              <span>+12.5% до минулого тижня</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-5">
            <Store size={80} className="text-amber-600" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Store size={16} />
              </div>
              Магазини
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">{storesCount}</p>
            <div className="mt-4 flex items-center text-emerald-600 text-xs font-semibold">
              <ArrowUpRight size={14} className="mr-1" />
              <span>+3 нових цього тижня</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-5">
            <Users size={80} className="text-emerald-600" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users size={16} />
              </div>
              Користувачі
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">{usersCount}</p>
            <div className="mt-4 flex items-center text-slate-400 text-xs font-semibold">
              <span>Зареєстрованих акаунтів</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-5">
            <ShoppingBag size={80} className="text-blue-600" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
              Товари
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">{productsCount}</p>
            <div className="mt-4 flex items-center text-slate-400 text-xs font-semibold">
              <span>Активних в каталозі</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Stores */}
        <Card>
          <CardHeader>
            <CardTitle>Останні магазини</CardTitle>
            <CardDescription>
              Нещодавно створені магазини на платформі
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-xs text-gray-500">
                      {store.owner?.name || "Власник"} •{" "}
                      {store.owner?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">
                      {store._count.products} товарів
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Нові надходження</CardTitle>
            <CardDescription>
              Останні додані товари на платформі
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium truncate max-w-[200px]">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.store.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Замовлення</CardTitle>
          <CardDescription>
            Статистика замовлень по платформі
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
              <p className="text-xs text-slate-500 mt-1">Всього</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">
                {
                  (
                    await prisma.order.count({
                      where: { status: "PROCESSING" },
                    })
                  ).toString()
                }
              </p>
              <p className="text-xs text-blue-600 mt-1">В обробці</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-700">
                {
                  (
                    await prisma.order.count({
                      where: { status: "SHIPPED" },
                    })
                  ).toString()
                }
              </p>
              <p className="text-xs text-indigo-600 mt-1">Відправлено</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-700">
                {
                  (
                    await prisma.order.count({
                      where: { status: "COMPLETED" },
                    })
                  ).toString()
                }
              </p>
              <p className="text-xs text-emerald-600 mt-1">Виконано</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
