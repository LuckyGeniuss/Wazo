"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";

// ─── UTM & Funnel Analytics ─────────────────────────────────────────────────

export type FunnelStep = {
  label: string;
  count: number;
  percent: number;
};

export type UtmBreakdownItem = {
  source: string;
  pageviews: number;
  orders: number;
  conversionRate: number;
};

export type ConversionFunnelResult = {
  funnel: FunnelStep[];
  utmBreakdown: UtmBreakdownItem[];
  dateFrom: string;
  dateTo: string;
};

export async function getConversionFunnel(
  storeId: string,
  dateFrom: Date,
  dateTo: Date
): Promise<ConversionFunnelResult> {
  const where = { gte: dateFrom, lte: dateTo };

  // 1. Уникальных сессий (PageView)
  const pageViewSessions = await (prisma as any).pageView.findMany({
    where: { storeId, createdAt: where },
    select: { sessionId: true },
    distinct: ["sessionId"],
  }) as { sessionId: string }[];
  const uniquePageViews = pageViewSessions.length;

  // 2. Корзин с товарами (Cart.items != '[]')
  const cartsWithItems = await prisma.cart.count({
    where: {
      storeId,
      updatedAt: where,
      NOT: { items: { equals: [] } },
    },
  });

  // 3. Начатых заказов (любой статус, кроме отменённых)
  const startedOrders = await prisma.order.count({
    where: {
      storeId,
      createdAt: where,
      status: { not: "CANCELLED" },
    },
  });

  // 4. Завершённых заказов
  const completedOrders = await prisma.order.count({
    where: {
      storeId,
      createdAt: where,
      status: "COMPLETED",
    },
  });

  const top = uniquePageViews || 1;

  const funnel: FunnelStep[] = [
    {
      label: "Просмотры страниц",
      count: uniquePageViews,
      percent: 100,
    },
    {
      label: "Добавили в корзину",
      count: cartsWithItems,
      percent: Math.round((cartsWithItems / top) * 100),
    },
    {
      label: "Начали оформление",
      count: startedOrders,
      percent: Math.round((startedOrders / top) * 100),
    },
    {
      label: "Завершили заказ",
      count: completedOrders,
      percent: Math.round((completedOrders / top) * 100),
    },
  ];

  // UTM breakdown по источникам
  const utmPageViews = await (prisma as any).pageView.groupBy({
    by: ["utmSource"],
    where: {
      storeId,
      createdAt: where,
      utmSource: { not: null },
    },
    _count: { sessionId: true },
  }) as { utmSource: string; _count: { sessionId: number } }[];

  const utmOrders = await prisma.order.groupBy({
    by: ["utmSource"],
    where: {
      storeId,
      createdAt: where,
      utmSource: { not: null },
      status: "COMPLETED",
    },
    _count: { id: true },
  });

  const orderBySource = Object.fromEntries(
    utmOrders.map((o) => [o.utmSource ?? "unknown", o._count.id])
  );

  const utmBreakdown: UtmBreakdownItem[] = utmPageViews.map((row) => {
    const source = row.utmSource ?? "unknown";
    const views = row._count.sessionId;
    const orders = orderBySource[source] ?? 0;
    return {
      source,
      pageviews: views,
      orders,
      conversionRate: views > 0 ? Math.round((orders / views) * 100 * 10) / 10 : 0,
    };
  }).sort((a, b) => b.pageviews - a.pageviews);

  return {
    funnel,
    utmBreakdown,
    dateFrom: dateFrom.toISOString().split("T")[0],
    dateTo: dateTo.toISOString().split("T")[0],
  };
}

export const getTotalRevenue = cache(
  async (storeId: string) => {
    const paidOrders = await prisma.order.findMany({
      where: {
        storeId,
        status: "COMPLETED",
      },
      select: {
        totalPrice: true,
      },
    });

    const totalRevenue = paidOrders.reduce((total: number, order: { totalPrice: number }) => {
      return total + order.totalPrice;
    }, 0);

    return totalRevenue;
  },
  ["total_revenue"],
  { revalidate: 3600 }
);

export const getSalesCount = cache(
  async (storeId: string) => {
    const salesCount = await prisma.order.count({
      where: {
        storeId,
        status: "COMPLETED",
      },
    });

    return salesCount;
  },
  ["sales_count"],
  { revalidate: 3600 }
);

export const getProductsCount = cache(
  async (storeId: string) => {
    const productsCount = await prisma.product.count({
      where: {
        storeId,
        isArchived: false,
      },
    });

    return productsCount;
  },
  ["products_count"],
  { revalidate: 3600 }
);

export const getGraphRevenue = cache(
  async (storeId: string) => {
    const paidOrders = await prisma.order.findMany({
      where: {
        storeId,
        status: "COMPLETED",
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders) {
      const month = order.createdAt.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalPrice;
    }

    const graphData = [
      { name: "Янв", total: 0 },
      { name: "Фев", total: 0 },
      { name: "Мар", total: 0 },
      { name: "Апр", total: 0 },
      { name: "Май", total: 0 },
      { name: "Июн", total: 0 },
      { name: "Июл", total: 0 },
      { name: "Авг", total: 0 },
      { name: "Сен", total: 0 },
      { name: "Окт", total: 0 },
      { name: "Ноя", total: 0 },
      { name: "Дек", total: 0 },
    ];

    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
  },
  ["graph_revenue"],
  { revalidate: 3600 }
);

export type DailyRevenueItem = {
  date: string;
  total: number;
};

export const getDailyRevenue = cache(
  async (storeId: string): Promise<DailyRevenueItem[]> => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        storeId,
        status: "COMPLETED",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Генерируем массив последних 30 дней с нулевыми значениями
    const dailyMap: { [key: string]: number } = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
      dailyMap[key] = 0;
    }

    // Заполняем реальными данными
    for (const order of orders) {
      const key = order.createdAt.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
      if (key in dailyMap) {
        dailyMap[key] = (dailyMap[key] || 0) + order.totalPrice;
      }
    }

    return Object.entries(dailyMap).map(([date, total]) => ({ date, total }));
  },
  ["daily_revenue"],
  { revalidate: 3600 }
);

export type TopProductItem = {
  productId: string;
  productName: string;
  sold: number;
  revenue: number;
};

export const getTopProducts = cache(
  async (storeId: string): Promise<TopProductItem[]> => {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          storeId,
          status: "COMPLETED",
        },
      },
      select: {
        productId: true,
        quantity: true,
        price: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const productMap: {
      [productId: string]: { productName: string; sold: number; revenue: number };
    } = {};

    for (const item of orderItems) {
      if (!productMap[item.productId]) {
        productMap[item.productId] = {
          productName: item.product.name,
          sold: 0,
          revenue: 0,
        };
      }
      productMap[item.productId].sold += item.quantity;
      productMap[item.productId].revenue += item.price * item.quantity;
    }

    return Object.entries(productMap)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  },
  ["top_products"],
  { revalidate: 3600 }
);

// ─── LTV (Lifetime Value) Analytics ───────────────────────────────────────

/**
 * LTV по магазину - середня сума всіх покупок клієнта за весь час
 */
export type StoreLTVResult = {
  ltv: number; // середній LTV
  totalCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
  averageOrdersPerCustomer: number;
};

export const getStoreLTV = cache(
  async (storeId: string): Promise<StoreLTVResult> => {
    const orders = await prisma.order.findMany({
      where: {
        storeId,
        status: 'COMPLETED',
      },
      select: {
        totalPrice: true,
        customerEmail: true,
      },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = orders.length;

    // Групуємо по клієнтах
    const customerOrders = new Map<string, number>();
    for (const order of orders) {
      if (!order.customerEmail) continue;
      const current = customerOrders.get(order.customerEmail) || 0;
      customerOrders.set(order.customerEmail, current + order.totalPrice);
    }

    const totalCustomers = customerOrders.size;
    const ltv = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const averageOrdersPerCustomer =
      totalCustomers > 0 ? totalOrders / totalCustomers : 0;

    return {
      ltv: Math.round(ltv * 100) / 100,
      totalCustomers,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      averageOrdersPerCustomer: Math.round(averageOrdersPerCustomer * 100) / 100,
    };
  },
  ['store_ltv'],
  { revalidate: 3600 },
);

/**
 * LTV по місяцях - для побудови графіку
 */
export type LTVByMonthItem = {
  month: string; // "YYYY-MM"
  ltv: number;
  customers: number;
  revenue: number;
  orders: number;
};

export const getLTVByMonth = cache(
  async (storeId: string): Promise<LTVByMonthItem[]> => {
    const orders = await prisma.order.findMany({
      where: {
        storeId,
        status: 'COMPLETED',
      },
      select: {
        totalPrice: true,
        customerEmail: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Групуємо по місяцях
    const monthData = new Map<
      string,
      {
        revenue: number;
        orders: number;
        customers: Set<string>;
        customerRevenue: Map<string, number>;
      }
    >();

    for (const order of orders) {
      const month = `₴{order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;

      if (!monthData.has(month)) {
        monthData.set(month, {
          revenue: 0,
          orders: 0,
          customers: new Set(),
          customerRevenue: new Map(),
        });
      }

      const data = monthData.get(month)!;
      data.revenue += order.totalPrice;
      data.orders += 1;

      if (order.customerEmail) {
        data.customers.add(order.customerEmail);
        const custRev = data.customerRevenue.get(order.customerEmail) || 0;
        data.customerRevenue.set(order.customerEmail, custRev + order.totalPrice);
      }
    }

    // Рахуємо LTV для кожного місяця
    const result: LTVByMonthItem[] = [];
    for (const [month, data] of monthData.entries()) {
      const customers = data.customers.size;
      const ltv = customers > 0 ? data.revenue / customers : 0;
      result.push({
        month,
        ltv: Math.round(ltv * 100) / 100,
        customers,
        revenue: Math.round(data.revenue * 100) / 100,
        orders: data.orders,
      });
    }

    return result.sort((a, b) => a.month.localeCompare(b.month));
  },
  ['ltv_by_month'],
  { revalidate: 3600 },
);

// ─── Advanced Analytics & Cohort Data ───────────────────────────────────────

export type AdvancedMetrics = {
  ltv: number;
  aov: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
};

export const getAdvancedMetrics = cache(
  async (storeId: string): Promise<AdvancedMetrics> => {
    const orders = await prisma.order.findMany({
      where: {
        storeId,
        status: "COMPLETED",
      },
      select: {
        id: true,
        totalPrice: true,
        customerEmail: true,
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    const uniqueCustomers = new Set(orders.map((o) => o.customerEmail).filter(Boolean));
    const totalCustomers = uniqueCustomers.size;

    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const ltv = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    return {
      ltv,
      aov,
      totalCustomers,
      totalOrders,
      totalRevenue,
    };
  },
  ["advanced_metrics"],
  { revalidate: 3600 }
);

export type CohortItem = {
  cohortMonth: string; // "YYYY-MM"
  newCustomers: number;
  repeatPurchases: number;
};

export const getCohortData = cache(
  async (storeId: string): Promise<CohortItem[]> => {
    // Получаем все завершенные заказы пользователей
    const orders = await prisma.order.findMany({
      where: {
        storeId,
        status: "COMPLETED",
        customerEmail: { not: "" }, // Только авторизованные пользователи
      },
      select: {
        id: true,
        customerEmail: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Определяем когорту для каждого пользователя (месяц первой покупки)
    const userCohorts = new Map<string, string>(); // customerEmail -> "YYYY-MM"
    const repeatPurchasesByCohort = new Map<string, number>();
    const customersByCohort = new Map<string, Set<string>>();

    for (const order of orders) {
      if (!order.customerEmail) continue;

      const orderMonth = `₴{order.createdAt.getFullYear()}-${String(
        order.createdAt.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!userCohorts.has(order.customerEmail)) {
        // Первая покупка -> определяем когорту
        userCohorts.set(order.customerEmail, orderMonth);
        
        if (!customersByCohort.has(orderMonth)) {
          customersByCohort.set(orderMonth, new Set());
        }
        customersByCohort.get(orderMonth)!.add(order.customerEmail);
        
        if (!repeatPurchasesByCohort.has(orderMonth)) {
          repeatPurchasesByCohort.set(orderMonth, 0);
        }
      } else {
        // Повторная покупка -> плюсуем в когорту пользователя
        const cohortMonth = userCohorts.get(order.customerEmail)!;
        repeatPurchasesByCohort.set(
          cohortMonth,
          (repeatPurchasesByCohort.get(cohortMonth) || 0) + 1
        );
      }
    }

    const cohortData: CohortItem[] = [];

    // Формируем результирующий массив и сортируем по месяцу (старые -> новые)
    for (const [cohortMonth, customers] of customersByCohort.entries()) {
      cohortData.push({
        cohortMonth,
        newCustomers: customers.size,
        repeatPurchases: repeatPurchasesByCohort.get(cohortMonth) || 0,
      });
    }

    return cohortData.sort((a, b) => a.cohortMonth.localeCompare(b.cohortMonth));
  },
  ["cohort_data"],
  { revalidate: 3600 }
);

// Аліас для узгодженості іменування
export const getCohortAnalysis = getCohortData;

// ─── Abandoned Cart Analytics ──────────────────────────────────────────────────

export type AbandonedCartMetrics = {
  totalCarts: number;
  recoveredCarts: number;
  recoveryRate: number;
};

export const getAbandonedCartMetrics = cache(
  async (storeId: string): Promise<AbandonedCartMetrics> => {
    // Получаем кампании для магазина
    const campaigns = await prisma.abandonedCartCampaign.findMany({
      where: {
        cart: {
          storeId,
        },
      },
      select: {
        status: true,
      },
    });

    const totalCarts = campaigns.length;
    let recoveredCarts = 0;

    for (const campaign of campaigns) {
      if (campaign.status === "RECOVERED") {
        recoveredCarts++;
      }
    }

    const recoveryRate = totalCarts > 0 ? (recoveredCarts / totalCarts) * 100 : 0;

    return {
      totalCarts,
      recoveredCarts,
      recoveryRate: Math.round(recoveryRate * 10) / 10, // Округляем до 1 знака
    };
  },
  ["abandoned_cart_metrics"],
  { revalidate: 3600 }
  );
  
  // Аліас для узгодженості іменування
  export const getAbandonedCartAnalytics = getAbandonedCartMetrics;
  
  // ─── ABC Analysis ──────────────────────────────────────────────────────────

export type AbcItem = {
  id: string;
  name: string;
  revenue: number;
  category: "A" | "B" | "C";
};

export const getAbcAnalysis = cache(
  async (storeId: string): Promise<AbcItem[]> => {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          storeId,
          status: "COMPLETED",
        },
      },
      select: {
        productId: true,
        quantity: true,
        price: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const productMap = new Map<string, { name: string; revenue: number }>();

    for (const item of orderItems) {
      const current = productMap.get(item.productId) || {
        name: item.product.name,
        revenue: 0,
      };
      current.revenue += item.price * item.quantity;
      productMap.set(item.productId, current);
    }

    const products = Array.from(productMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      revenue: data.revenue,
    }));

    products.sort((a, b) => b.revenue - a.revenue);

    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);

    let cumulativeRevenue = 0;

    return products.map((p) => {
      cumulativeRevenue += p.revenue;
      const percentage = totalRevenue > 0 ? cumulativeRevenue / totalRevenue : 0;

      let category: "A" | "B" | "C" = "C";
      if (percentage <= 0.8) {
        category = "A";
      } else if (percentage <= 0.95) {
        category = "B";
      }

      return {
        id: p.id,
        name: p.name,
        revenue: p.revenue,
        category,
      };
    });
  },
  ["abc_analysis"],
  { revalidate: 3600 }
);
