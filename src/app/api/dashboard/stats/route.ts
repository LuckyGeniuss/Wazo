import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subDays, subWeeks, subMonths, subYears } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const period = searchParams.get('period') || '7d';
    
    if (!storeId) {
      return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
    }

    // Отримуємо дату початку періоду
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '24h':
        startDate = subDays(now, 1);
        break;
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subDays(now, 7);
    }

    // Отримуємо замовлення за період
    const orders = await prisma.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: startDate,
        },
        status: {
          in: ['COMPLETED', 'SHIPPED', 'PROCESSING'],
        },
      },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
        status: true,
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // Рахуємо дохід по днях
    const daysData = Array.from({ length: getDaysCount(period) }, (_, i) => {
      const date = subDays(now, getDaysCount(period) - 1 - i);
      return {
        date: date.toISOString().split('T')[0],
        revenue: 0,
        orders: 0,
      };
    });

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const dayData = daysData.find((d) => d.date === date);
      if (dayData) {
        dayData.revenue += order.totalPrice || 0;
        dayData.orders += 1;
      }
    });

    // Топ товари
    const productStats = new Map<
      string,
      { name: string; sold: number; revenue: number; price: number }
    >();

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const key = item.product?.name || 'Інший товар';
        const existing = productStats.get(key);
        if (existing) {
          existing.sold += item.quantity || 1;
          existing.revenue += (item.product?.price || 0) * (item.quantity || 1);
        } else {
          productStats.set(key, {
            name: item.product?.name || 'Інший товар',
            sold: item.quantity || 1,
            revenue: (item.product?.price || 0) * (item.quantity || 1),
            price: item.product?.price || 0,
          });
        }
      });
    });

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Останні замовлення
    const recentOrders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        date: order.createdAt,
        status: order.status,
        total: order.totalPrice || 0,
        items: order.orderItems.map((item) => ({
          name: item.product?.name || 'Товар',
          quantity: item.quantity || 1,
        })),
      }));

    return NextResponse.json({
      chartData: daysData,
      topProducts,
      recentOrders,
      summary: {
        totalRevenue: orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0),
        totalOrders: orders.length,
        avgOrderValue:
          orders.length > 0
            ? orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0) / orders.length
            : 0,
      },
    });
  } catch (error) {
    console.error('[Stats API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getDaysCount(period: string): number {
  switch (period) {
    case '24h':
      return 1;
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
    case '1y':
      return 365;
    default:
      return 7;
  }
}
