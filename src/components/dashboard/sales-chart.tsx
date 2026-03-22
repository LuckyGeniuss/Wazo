'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { formatPrice } from '@/lib/format';
import { TrendingUp, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface ProductStat {
  name: string;
  sold: number;
  revenue: number;
  price: number;
}

interface OrderItem {
  name: string;
  quantity: number;
}

interface RecentOrder {
  id: string;
  date: Date;
  status: string;
  total: number;
  items: OrderItem[];
}

interface StatsData {
  chartData: ChartData[];
  topProducts: ProductStat[];
  recentOrders: RecentOrder[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
}

type Period = '24h' | '7d' | '30d' | '90d' | '1y';

interface SalesChartProps {
  storeId: string;
}

export function SalesChart({ storeId }: SalesChartProps) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('7d');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/stats?period=${period}&storeId=${storeId}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period, storeId]);

  const formatXAxis = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
  };

  const formatYAxis = (value: number) => {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-100 rounded w-1/3"></div>
          <div className="h-64 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  const hasData = data?.chartData?.some((d) => d.revenue > 0);

  // Демо-дані якщо немає замовлень
  const demoData: ChartData[] = !hasData
    ? data?.chartData?.map((d, i) => ({
        ...d,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 10) + 2,
      }))
    : data?.chartData || [];

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="text-violet-600" size={24} />
          Динаміка продажів
        </h2>
        <div className="flex gap-2">
          {(['24h', '7d', '30d', '90d', '1y'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                period === p
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p === '24h' ? '24 год' : p === '7d' ? '7 дн' : p === '30d' ? '30 дн' : p === '90d' ? '90 дн' : '1 рік'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        {!hasData ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Немає даних за обраний період</h3>
            <p className="text-slate-500 mt-1 mb-4">Показуємо демо-графік для прикладу</p>
          </div>
        ) : null}
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={demoData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={formatXAxis}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [formatPrice(value), 'Дохід']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              name="Дохід"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={DollarSign}
          label="Загальний дохід"
          value={formatPrice(data?.summary.totalRevenue || 0)}
          color="violet"
        />
        <SummaryCard
          icon={ShoppingBag}
          label="Замовлень"
          value={data?.summary.totalOrders?.toString() || '0'}
          color="blue"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Середній чек"
          value={formatPrice(data?.summary.avgOrderValue || 0)}
          color="emerald"
        />
      </div>

      {/* Top Products */}
      <TopProducts products={data?.topProducts || []} />

      {/* Recent Orders */}
      <RecentOrders orders={data?.recentOrders || []} storeId={storeId} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value: string;
  color: 'violet' | 'blue' | 'emerald';
}) {
  const colors = {
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', icon: 'text-violet-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-600' },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${colors[color].bg} flex items-center justify-center`}>
          <Icon className={colors[color].icon} size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-xl font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TopProducts({ products }: { products: ProductStat[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Топ товарів</h3>
        <div className="text-center py-8">
          <ShoppingBag className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-500">Немає проданих товарів</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <ShoppingBag className="text-blue-600" size={20} />
        Топ товарів
      </h3>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm line-clamp-1">{product.name}</p>
                <p className="text-xs text-slate-500">{product.sold} продано</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900 text-sm">{formatPrice(product.revenue)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentOrders({ orders, storeId }: { orders: RecentOrder[]; storeId: string }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Останні замовлення</h3>
        <div className="text-center py-8">
          <Calendar className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-500">Немає замовлень</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Calendar className="text-emerald-600" size={20} />
        Останні замовлення
      </h3>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                #{order.id.split('-')[0]}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.items.map((i) => i.name).slice(0, 1).join(', ')}
                {order.items.length > 1 && ` та ще ${order.items.length - 1}`}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900 text-sm">{formatPrice(order.total)}</p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  order.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : order.status === 'PROCESSING'
                    ? 'bg-blue-100 text-blue-700'
                    : order.status === 'CANCELLED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
