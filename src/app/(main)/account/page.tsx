import type { Metadata } from 'next';
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Особистий кабінет | Wazo.Market',
  description: 'Керуйте своїм акаунтом, замовленнями та вподобаннями на Wazo.Market.',
};
import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";
import { WishlistButton } from "@/components/ui/wishlist-button";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { Heart, RotateCcw, Package, Clock, Settings, CreditCard, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type WishlistItemWithDetails = Prisma.WishlistGetPayload<{
  include: {
    product: {
      include: {
        store: true;
        reviews: {
          select: {
            rating: true;
          };
        };
      };
    };
  };
}>;

export default async function BuyerAccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const recentOrders: OrderWithDetails[] = await prisma.order.findMany({
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
    take: 3,
  });

  const ordersCount = await prisma.order.count({
    where: {
      customerEmail: session.user.email!,
    }
  });

  const wishlist: WishlistItemWithDetails[] = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: {
          store: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
    take: 4,
  });

  const wishlistCount = await prisma.wishlist.count({
    where: {
      userId: session.user.id,
    }
  });

  return (
    <div className="container max-w-7xl py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="text-2xl">
                    {session.user.name?.[0] || session.user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="font-semibold text-lg">{session.user.name || "Customer"}</h2>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <nav className="flex flex-col space-y-1">
            <Button variant="secondary" className="justify-start" asChild>
              <Link href="/account">
                <Clock className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/account/orders">
                <Package className="mr-2 h-4 w-4" />
                Orders
                <Badge variant="secondary" className="ml-auto">{ordersCount}</Badge>
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/account/wishlist">
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
                <Badge variant="secondary" className="ml-auto">{wishlistCount}</Badge>
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/account/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ordersCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wishlistCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              {ordersCount > 0 && (
                <Button variant="link" asChild>
                  <Link href="/account/orders">
                    View all <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
            
            {recentOrders.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                  <Button asChild className="mt-4" variant="outline">
                    <Link href="/">Start Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: OrderWithDetails) => (
                  <Card key={order.id} className="overflow-hidden">
                    <div className="bg-muted/50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <Badge variant={
                          order.status === "COMPLETED" ? "default" :
                          order.status === "CANCELLED" ? "destructive" : "secondary"
                        }>
                          {order.status}
                        </Badge>
                        <p className="font-bold">{Math.round(order.totalPrice).toLocaleString('uk-UA')} ₴</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-4">Store: <span className="font-medium text-foreground">{order.store.name}</span></p>
                      <div className="space-y-4">
                        {order.orderItems.map((item: NonNullable<OrderWithDetails>["orderItems"][number]) => {
                          const productImages = item.product.images as string[] | null;
                          const imageUrl = productImages?.[0] || item.product.imageUrl;

                          return (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 bg-muted rounded-md overflow-hidden relative">
                                  {imageUrl ? (
                                    <Image 
                                      src={imageUrl} 
                                      alt={item.product.name} 
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                      <Package className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <Link href={`/${order.store.slug}/product/${item.productId}`} className="text-sm font-medium hover:underline">
                                    {item.product.name}
                                  </Link>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="text-sm font-medium">{Math.round((Number(item.price) * item.quantity)).toLocaleString('uk-UA')} ₴</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Wishlist Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Wishlist</h2>
              {wishlistCount > 0 && (
                <Button variant="link" asChild>
                  <Link href="/account/wishlist">
                    View all <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
            
            {wishlist.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your wishlist is empty.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {wishlist.map((item: WishlistItemWithDetails) => {
                  const productImages = item.product.images as string[] | null;
                  const imageUrl = productImages?.[0] || item.product.imageUrl;
                  
                  return (
                    <Card key={item.id} className="overflow-hidden flex flex-col">
                      <div className="aspect-square relative bg-muted">
                        {imageUrl ? (
                          <Image 
                            src={imageUrl} 
                            alt={item.product.name} 
                            fill
                            className="object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <WishlistButton
                            productId={item.productId}
                            isWished={true}
                            className="h-8 w-8 rounded-full shadow-sm"
                          />
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <Link href={`/${item.product.store.slug}/product/${item.productId}`} className="font-medium text-sm line-clamp-2 hover:underline mb-2 flex-1">
                          {item.product.name}
                        </Link>
                        <p className="font-bold">{Math.round(Number(item.product.price)).toLocaleString('uk-UA')} ₴</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
