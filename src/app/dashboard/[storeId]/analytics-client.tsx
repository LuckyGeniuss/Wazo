"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { DailyRevenueItem, TopProductItem } from "@/actions/analytics";

interface RecentOrder {
  id: string;
  customerName: string;
  createdAt: Date;
  status: string;
  totalPrice: number;
}

interface AnalyticsClientProps {
  totalRevenue: number;
  salesCount: number;
  productsCount: number;
  dailyRevenue: DailyRevenueItem[];
  topProducts: TopProductItem[];
  recentOrders: RecentOrder[];
  storeName: string;
  storeId: string;
  storeSlug: string;
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 text-white text-xs py-2 px-3 rounded-xl shadow-xl border border-neutral-700">
        <p className="font-medium text-neutral-300 mb-1">{label}</p>
        <p className="text-indigo-300 font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function AnalyticsClient({
  totalRevenue,
  salesCount,
  productsCount,
  dailyRevenue,
  topProducts,
  recentOrders,
  storeId,
  storeSlug,
}: AnalyticsClientProps) {
  const maxSold = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.sold)) : 1;

  const statCards = [
    {
      title: "Доход (всего)",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      trend: "+12%",
    },
    {
      title: "Заказы (выполнено)",
      value: salesCount.toString(),
      icon: ShoppingCart,
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      trend: "+8%",
    },
    {
      title: "Товары (активных)",
      value: productsCount.toString(),
      icon: Package,
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
      trend: null,
    },
    {
      title: "Посетители (mock)",
      value: "1,247",
      icon: Users,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      trend: "+23%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Карточки статистики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              {card.trend && (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {card.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{card.title}</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-0.5">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* График продаж — AreaChart (30 дней) */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Выручка за последние 30 дней
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              На основе завершённых заказов
            </p>
          </div>
          <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full font-medium">
            Последние 30 дней
          </span>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.1)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v}`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#colorRevenue)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Топ-5 товаров + Последние заказы */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Топ-5 товаров */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-5">
            Топ-5 товаров
          </h3>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-neutral-400 dark:text-neutral-600">
              <Package className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">Нет данных о продажах</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const barWidth = maxSold > 0 ? (product.sold / maxSold) * 100 : 0;
                return (
                  <div key={product.productId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-neutral-400 dark:text-neutral-600 w-4 text-right flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                          {product.productName}
                        </span>
                      </div>
                      <div className="flex-shrink-0 text-right ml-4">
                        <span className="text-xs text-neutral-500">{product.sold} шт.</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Последние заказы */}
        <div className="lg:col-span-3 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Последние заказы
            </h3>
            <Link
              href={`/dashboard/${storeId}/orders`}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Все заказы
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                  <th className="pb-3 font-medium">Клиент</th>
                  <th className="pb-3 font-medium">Дата</th>
                  <th className="pb-3 font-medium">Статус</th>
                  <th className="pb-3 font-medium text-right">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-neutral-900 dark:text-neutral-100">
                      {order.customerName}
                    </td>
                    <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[order.status] ?? "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-neutral-900 dark:text-neutral-100">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-neutral-400 dark:text-neutral-600"
                    >
                      Заказов пока нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ссылка на витрину */}
      <div className="text-center">
        <Link
          href={`/${storeSlug}`}
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          Открыть витрину магазина
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
