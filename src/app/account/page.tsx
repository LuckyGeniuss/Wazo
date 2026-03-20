import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";
import { WishlistButton } from "@/components/ui/wishlist-button";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { Heart, RotateCcw } from "lucide-react";

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
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Личный кабинет</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                {session.user.name?.[0] || session.user.email?.[0].toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{session.user.name || "Покупатель"}</h2>
                <p className="text-sm text-gray-500">{session.user.email}</p>
              </div>
            </div>
            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Заказов:</span> {orders.length}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">В списке желаемого:</span> {wishlist.length}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Orders Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Мои заказы</h2>
            {orders.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg border border-dashed text-center">
                <p className="text-gray-500">Вы еще не совершили ни одной покупки.</p>
                <Link href="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium" aria-label="Перейти к покупкам на главную страницу">
                  Перейти к покупкам &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: OrderWithDetails) => (
                  <div key={order.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Заказ #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{Math.round(order.totalPrice).toLocaleString('uk-UA')} ₴</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                          order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-4">Магазин: <span className="font-medium text-gray-900">{order.store.name}</span></p>
                      <div className="space-y-3">
                        {order.orderItems.map((item: NonNullable<OrderWithDetails>["orderItems"][number]) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
                                {item.product.imageUrl && (
                                  <Image 
                                    src={item.product.imageUrl} 
                                    alt={item.product.name} 
                                    className="h-full w-full object-cover" 
                                    width={40}
                                    height={40}
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                  />
                                )}
                              </div>
                              <Link href={`/${order.store.slug}/product/${item.productId}`} className="text-sm text-indigo-600 hover:underline" aria-label={`Перейти к товару ${item.product.name}`}>
                                {item.product.name} x {item.quantity}
                              </Link>
                            </div>
                            <p className="text-sm text-gray-900">{Math.round((item.price * item.quantity)).toLocaleString('uk-UA')} ₴</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Кнопка возврата */}
                    {(order.status === "COMPLETED" || order.status === "SHIPPED") &&
                      (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 14 && (
                        <div className="px-6 pb-4">
                          <Link
                            href={`/account/orders/${order.id}/return`}
                            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Оформить возврат
                          </Link>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Wishlist Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                Список желаемого
                {wishlist.length > 0 && (
                  <span className="bg-rose-100 text-rose-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </h2>
              {wishlist.length > 0 && (
                <Link
                  href="/account/wishlist"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Смотреть всё &rarr;
                </Link>
              )}
            </div>
            {wishlist.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg border border-dashed text-center">
                <p className="text-gray-500">Ваш список желаемого пуст.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlist.map((item: WishlistItemWithDetails) => {
                  const avgRating = item.product.reviews.length > 0
                    ? item.product.reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / item.product.reviews.length
                    : 0;
                  
                  return (
                    <div key={item.id} className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200 h-48">
                        {item.product.imageUrl && (
                          <Image 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover" 
                            width={200}
                            height={200}
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                          />
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                        <div className="flex items-center mb-2">
                          <StarRating rating={avgRating} size={12} />
                          <span className="ml-1 text-xs text-gray-500">({item.product.reviews.length})</span>
                        </div>
                        <p className="text-indigo-600 font-bold mb-4">{Math.round(item.product.price).toLocaleString('uk-UA')} ₴</p>
                        <div className="mt-auto pt-4 border-t flex justify-between items-center">
                          <Link
                            href={`/${item.product.store.slug}/product/${item.productId}`}
                            className="text-sm text-indigo-600 font-medium hover:text-indigo-500"
                            aria-label={`Перейти к товару ${item.product.name}`}
                          >
                            Подробнее
                          </Link>
                          <WishlistButton
                            productId={item.productId}
                            isWished={true}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                    </div>
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
