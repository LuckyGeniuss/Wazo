import { prisma } from "@/lib/prisma";
import {
  getTotalRevenue,
  getSalesCount,
  getProductsCount,
  getDailyRevenue,
  getTopProducts,
} from "@/actions/analytics";
import { AnalyticsClient } from "./analytics-client";
import { Store as StoreIcon } from "lucide-react";
import Link from "next/link";

export default async function StoreDashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  let store, totalRevenue, salesCount, productsCount, dailyRevenue, topProducts;

  try {
    [store, totalRevenue, salesCount, productsCount, dailyRevenue, topProducts] =
      await Promise.all([
        prisma.store.findUnique({
          where: { id: storeId },
          include: {
            orders: {
              take: 10,
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                customerName: true,
                createdAt: true,
                status: true,
                totalPrice: true,
              },
            },
          },
        }),
        getTotalRevenue(storeId),
        getSalesCount(storeId),
        getProductsCount(storeId),
        getDailyRevenue(storeId),
        getTopProducts(storeId),
      ]);
  } catch (error) {
    console.error("[DASHBOARD_PAGE_ERROR]", error);
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Произошла ошибка при загрузке данных дашборда.
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Магазин не найден
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
            Dashboard
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Добро пожаловать в обзор магазина{" "}
            <strong className="text-neutral-700 dark:text-neutral-300">{store.name}</strong>
          </p>
        </div>
        <Link
          href={`/${store.slug}`}
          target="_blank"
          className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <StoreIcon className="w-4 h-4 mr-2" />
          Витрина
        </Link>
      </div>

      {/* Аналитический дашборд */}
      <AnalyticsClient
        totalRevenue={totalRevenue}
        salesCount={salesCount}
        productsCount={productsCount}
        dailyRevenue={dailyRevenue}
        topProducts={topProducts}
        recentOrders={store.orders}
        storeName={store.name}
        storeId={storeId}
        storeSlug={store.slug}
      />
    </div>
  );
}
