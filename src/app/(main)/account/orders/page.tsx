import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { Package, ChevronRight, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    store: true;
    orderItems: {
      include: {
        product: true;
      };
    };
  };
}>;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const session = await auth();
  const sp = await searchParams;

  if (!session?.user) {
    redirect("/login");
  }

  const isSuccess = sp?.success === "true";

  const orders: OrderWithDetails[] = await prisma.order.findMany({
    where: {
      customerEmail: session.user.email!,
    },
    include: {
      store: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container max-w-5xl py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
      </div>

      {isSuccess && (
        <div className="mb-8 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-3">
          <Package className="h-5 w-5 text-emerald-600" />
          <p className="font-medium">Замовлення успішно оформлено! Дякуємо за покупку.</p>
        </div>
      )}

      {orders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order: OrderWithDetails) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="bg-muted/50 px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                    <Badge variant={
                      order.status === "COMPLETED" ? "default" :
                      order.status === "CANCELLED" ? "destructive" : "secondary"
                    }>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg">{Math.round(order.totalPrice).toLocaleString('uk-UA')} ₴</p>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.orderItems.map((item: NonNullable<OrderWithDetails>["orderItems"][number]) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-16 w-16 bg-muted rounded-md overflow-hidden relative shrink-0">
                          {item.product.images && Array.isArray(item.product.images) && item.product.images[0] ? (
                            <Image 
                              src={item.product.images[0] as string} 
                              alt={item.product.name} 
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link href={`/${order.store.slug}/product/${item.productId}`} className="font-medium hover:underline line-clamp-2">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">Sold by {order.store.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {Math.round(Number(item.price)).toLocaleString('uk-UA')} ₴ × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                        <p className="font-medium">{Math.round((Number(item.price) * item.quantity)).toLocaleString('uk-UA')} ₴</p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/${order.store.slug}/product/${item.productId}`}>
                            View Product
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
