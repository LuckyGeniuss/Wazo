import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/format";

export default async function SuperAdminDashboard() {
  const [storesCount, usersCount, productsCount, ordersStats, recentOrders] = await Promise.all([
    prisma.store.count({ where: { isSuspended: false } }),
    prisma.user.count(),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.order.aggregate({ _sum: { totalPrice: true }, _count: true }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true, totalPrice: true, status: true, createdAt: true, customerName: true,
        store: { select: { name: true } },
      },
    }),
  ]);

  const totalRevenue = ordersStats._sum.totalPrice || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Огляд платформи</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Активні магазини</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{storesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Користувачі</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{usersCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Активні товари</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{productsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform GMV</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Останні 5 замовлень</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.store.name}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell className="text-right">{formatPrice(order.totalPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
