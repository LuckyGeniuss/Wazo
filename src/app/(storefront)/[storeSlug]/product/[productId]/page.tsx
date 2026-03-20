import { prisma } from "@/lib/prisma";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewForm } from "@/components/renderers/review-form";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { OrderButton } from "@/components/renderers/order-button";
import { WishlistButton } from "@/components/ui/wishlist-button";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{
    storeSlug: string;
    productId: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      name: true,
      description: true,
      imageUrl: true,
      store: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!product) {
    return {
      title: "Товар не найден",
      description: "Страница товара не найдена.",
    };
  }

  const title = `₴{product.name} | ${product.store?.name || "Маркетплейс"}`;
  const description = product.description || `Купите ${product.name} в магазине ${product.store?.name || "Маркетплейс"}.`;
  const imageUrl = product.imageUrl || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

type ProductPagePayload = Prisma.ProductGetPayload<{
  include: {
    store: true;
    reviews: {
      include: {
        user: {
          select: {
            name: true;
            image: true;
          };
        };
      };
      orderBy: {
        createdAt: "desc";
      };
    };
    wishlists: true;
  };
}>;

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const { storeSlug, productId } = params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      store: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      wishlists: session?.user?.id
        ? {
            where: { userId: session.user.id },
            select: { id: true },
          }
        : false, // Don't include wishlists if user is not logged in
    },
  }) as ProductPagePayload | null;

  if (!product || product.store.slug !== storeSlug) {
    return notFound();
  }

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc: number, r: NonNullable<ProductPagePayload>["reviews"][number]) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const isWished = product.wishlists && product.wishlists.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-center object-cover"
                width={500}
                height={500}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">₴{product.price.toFixed(2)}</p>
          </div>

          {/* Reviews */}
          <div className="mt-3 flex items-center">
            <StarRating rating={averageRating} />
            <p className="ml-3 text-sm text-gray-500">{product.reviews.length} отзывов</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              {product.description || "Нет описания."}
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <OrderButton storeId={product.storeId} productId={product.id} />
            <WishlistButton productId={product.id} isWished={isWished} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 lg:mt-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Отзывы покупателей</h2>

            <div className="mt-3 flex items-center">
              <StarRating rating={averageRating} size={20} />
              <p className="ml-2 text-sm text-gray-900">Средняя оценка {averageRating.toFixed(1)} из 5</p>
            </div>

            <div className="mt-10">
              {session ? (
                <ReviewForm productId={product.id} />
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-dashed text-center">
                  <p className="text-gray-600">Войдите, чтобы оставить отзыв</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 lg:mt-0 lg:col-span-8">
            <div className="flow-root">
              <div className="-my-12 divide-y divide-gray-200">
                {product.reviews.length === 0 ? (
                  <p className="py-12 text-gray-500 italic">Пока нет отзывов об этом товаре.</p>
                ) : (
                  product.reviews.map((review: NonNullable<ProductPagePayload>["reviews"][number]) => (
                    <div key={review.id} className="py-12">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h4 className="text-sm font-bold text-gray-900">
                            {review.user?.name || "Анонимный покупатель"}
                          </h4>
                          <div className="mt-1 flex items-center">
                            <StarRating rating={review.rating} size={14} />
                            {review.isVerified && (
                              <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Подтвержденная покупка
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-6 text-base italic text-gray-600">
                        <p>{review.comment}</p>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
