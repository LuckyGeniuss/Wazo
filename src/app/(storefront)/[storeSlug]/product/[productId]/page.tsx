import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw,
  ChevronRight, Check, Package, ZoomIn, ChevronLeft
} from 'lucide-react';
import { AddToCartButton } from '@/components/ui/add-to-cart-button';

export default async function ProductPage(
  props: { params: Promise<{ storeSlug: string; productId: string }> }
) {
  const { storeSlug, productId } = await props.params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      store: { select: { id: true, name: true, slug: true, rating: true, reviewsCount: true } },
      category: { select: { name: true, slug: true } },
      variants: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true },
  });
  if (!store || product.storeId !== store.id) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      storeId: product.storeId,
      categoryId: product.categoryId,
      id: { not: productId },
      isArchived: false,
    },
    include: { store: { select: { name: true, slug: true } } },
    take: 6,
  });

  const allImages = product.images && product.images.length > 0
    ? product.images
    : product.imageUrl ? [product.imageUrl] : [];

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  const avgRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
    : product.avgRating || 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Головна</Link>
            <ChevronRight size={12} />
            {product.categoryId && product.category && (
              <>
                <Link href={`/search?category=${product.category.slug}`}
                      className="hover:text-foreground transition-colors">
                  {product.category.name}
                </Link>
                <ChevronRight size={12} />
              </>
            )}
            <Link href={`/${storeSlug}`} className="hover:text-foreground transition-colors">
              {product.store?.name}
            </Link>
            <ChevronRight size={12} />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── ГАЛЕРЕЯ ──────────────────────────────────── */}
          <div className="space-y-3">
            {/* Головне зображення */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
              {allImages[0] ? (
                <img src={allImages[0]} alt={product.name}
                     className="w-full h-full object-cover group-hover:scale-105
                                transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
              )}
              {discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white
                                text-sm font-black px-3 py-1.5 rounded-xl shadow-lg">
                  -{discount}%
                </div>
              )}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm
                                  rounded-xl flex items-center justify-center shadow
                                  hover:bg-white transition-colors">
                <ZoomIn size={18} className="text-slate-600" />
              </button>
            </div>
            {/* Мініатюри */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <div key={i}
                       className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden
                                  border-2 border-transparent hover:border-violet-500
                                  cursor-pointer transition-all bg-muted">
                    <img src={img} alt={`₴{product.name} ${i + 1}`}
                         className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── ІНФОРМАЦІЯ ───────────────────────────────── */}
          <div className="space-y-5">
            {/* Назва і рейтинг */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isFeatured && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700
                                   border border-amber-200 px-2 py-0.5 rounded-full">
                    ТОП ПРОДАЖ
                  </span>
                )}
                {product.stock > 0
                  ? <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <Check size={12} /> В наявності ({product.stock} шт)
                    </span>
                  : <span className="text-xs font-medium text-red-500">Немає в наявності</span>
                }
              </div>
              <h1 className="text-2xl md:text-3xl font-black leading-tight">{product.name}</h1>
              {/* @ts-ignore - sku might not exist on product */}
              {(product as any).sku && (
                <p className="text-xs text-muted-foreground mt-1">Артикул: {(product as any).sku}</p>
              )}
            </div>

            {/* Рейтинг */}
            {(avgRating > 0 || (product.reviews && product.reviews.length > 0)) && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={16}
                          className={star <= Math.round(avgRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 fill-slate-200'} />
                  ))}
                </div>
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">
                  {product.reviews?.length || 0} відгуків
                </span>
              </div>
            )}

            {/* Ціна */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-violet-700">
                ₴{Math.round(product.price).toLocaleString('uk-UA')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ₴{product.compareAtPrice.toLocaleString('uk-UA')}
                </span>
              )}
              {discount && (
                <span className="text-sm font-bold text-red-500 bg-red-50 border border-red-100
                                 px-2.5 py-1 rounded-full">
                  Ви економите ₴{(product.compareAtPrice! - product.price).toLocaleString('uk-UA')}
                </span>
              )}
            </div>

            {/* Варіанти якщо є */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Оберіть варіант:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <button key={variant.id}
                            className="px-4 py-2 border-2 rounded-xl text-sm font-medium
                                       hover:border-violet-500 hover:bg-violet-50
                                       transition-all">
                      {variant.name || 'Варіант'}
                      {variant.price && variant.price !== product.price && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ₴{Math.round(variant.price).toLocaleString('uk-UA')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопки дій */}
            <div className="flex gap-3">
              <div className="flex-1">
                <AddToCartButton 
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={allImages[0] || ""}
                  storeId={product.storeId}
                  storeName={product.store?.name}
                  fullWidth 
                  size="lg" 
                />
              </div>
              <button className="w-14 h-14 flex items-center justify-center border-2 rounded-2xl
                                  hover:border-red-300 hover:bg-red-50 hover:text-red-500
                                  transition-all">
                <Heart size={20} />
              </button>
              <button className="w-14 h-14 flex items-center justify-center border-2 rounded-2xl
                                  hover:border-slate-300 hover:bg-slate-50 transition-all">
                <Share2 size={20} />
              </button>
            </div>

            {/* Купити зараз */}
            <Link href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl
                             font-bold text-base border-2 border-violet-600 text-violet-700
                             hover:bg-violet-50 transition-all">
              Купити зараз
            </Link>

            {/* Гарантії */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-b">
              {[
                { icon: Shield,   title: 'Захист покупця', desc: '14 днів повернення' },
                { icon: Truck,    title: 'Доставка', desc: 'Нова Пошта · Укрпошта' },
                { icon: RotateCcw,title: 'Повернення', desc: 'Без зайвих питань' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Icon size={16} className="text-violet-600" />
                  </div>
                  <p className="text-xs font-semibold">{title}</p>
                  <p className="text-[10px] text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            {/* Продавець */}
            <Link href={`/${storeSlug}`}
                  className="flex items-center gap-3 p-4 border rounded-2xl
                             hover:border-violet-200 hover:bg-violet-50/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100
                              flex items-center justify-center overflow-hidden flex-shrink-0">
                {/* @ts-ignore - logoUrl might not be queried but it could exist */}
                {(product.store as any).logoUrl ? (
                  <img src={(product.store as any).logoUrl} alt={product.store?.name}
                       className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-violet-600">
                    {product.store?.name[0]}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{product.store?.name}</p>
                {product.store && product.store.rating > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs text-muted-foreground">
                      {product.store.rating} · Перевірений продавець
                    </span>
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* ── ОПИС ТОВАРУ ────────────────────────────────── */}
        {product.description && (
          <div className="mt-12 border-t pt-10">
            <h2 className="text-xl font-black mb-5">Опис товару</h2>
            <div className="prose prose-slate max-w-none text-base leading-relaxed
                            dark:prose-invert">
              <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* ── ВІДГУКИ ─────────────────────────────────────── */}
        <div className="mt-12 border-t pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black">
              Відгуки покупців
              {product.reviews.length > 0 && (
                <span className="text-muted-foreground font-normal text-base ml-2">
                  ({product.reviews.length})
                </span>
              )}
            </h2>
            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black">{avgRating.toFixed(1)}</span>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14}
                            className={s <= Math.round(avgRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 fill-slate-200'} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.reviews.length} відгуків
                  </p>
                </div>
              </div>
            )}
          </div>

          {(!product.reviews || product.reviews.length === 0) ? (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground mb-2">Поки немає відгуків про цей товар</p>
              <p className="text-sm text-muted-foreground">Будьте першим хто залишить відгук!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="p-5 border rounded-2xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400
                                    flex items-center justify-center text-white font-bold text-sm
                                    flex-shrink-0 overflow-hidden">
                      {review.user?.image ? (
                        <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        review.user?.name?.[0]?.toUpperCase() || 'A'
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.user?.name || 'Анонім'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12}
                                  className={s <= review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200 fill-slate-200'} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── ПОВ'ЯЗАНІ ТОВАРИ ────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Схожі товари</h2>
              <Link href={`/${storeSlug}`}
                    className="text-sm text-violet-600 font-medium hover:text-violet-700">
                Всі товари магазину →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {relatedProducts.map(p => {
                const img = (p as any).images?.[0]?.url || p.imageUrl;
                return (
                  <Link key={p.id}
                        href={`/${storeSlug}/product/${p.id}`}
                        className="group bg-white dark:bg-slate-800 border rounded-2xl
                                   overflow-hidden hover:shadow-lg hover:border-violet-200
                                   hover:-translate-y-0.5 transition-all">
                    <div className="aspect-square bg-muted overflow-hidden">
                      {img && (
                        <img src={img} alt={p.name}
                             className="w-full h-full object-cover group-hover:scale-110
                                        transition-transform duration-300" />
                      )}
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-xs font-medium line-clamp-2 leading-snug mb-1.5">
                        {p.name}
                      </h3>
                      <p className="text-sm font-black text-violet-700">
                        ₴{Math.round(p.price).toLocaleString('uk-UA')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
