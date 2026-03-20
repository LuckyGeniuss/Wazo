import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/currency/converter";

export default async function SuperAdminDashboard() {
  const [storeCount, userCount, ordersCount, recentOrders, aggregations] = await Promise.all([
    prisma.store.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { store: { select: { name: true } } },
    }),
    prisma.order.aggregate({
      _sum: { totalPrice: true }
    })
  ]);

  const totalRevenue = aggregations._sum.totalPrice || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{storeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{ordersCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total GMV</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatPrice(totalRevenue, "UAH", "₴")}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Orders</h2>
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
                <TableCell className="text-right">{formatPrice(order.totalPrice, "UAH", "₴")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
