import { prisma } from "@/lib/prisma";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  id?: string;
}

/**
 * Рекурсивно будує ланцюжок категорій до кореня (max 5 рівнів)
 */
export async function getCategoryBreadcrumb(
  categoryId: string,
  storeSlug: string
): Promise<BreadcrumbItem[]> {
  const breadcrumbs: BreadcrumbItem[] = [];
  const maxDepth = 5;

  let currentCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { parent: true },
  });

  let depth = 0;
  while (currentCategory && depth < maxDepth) {
    breadcrumbs.unshift({
      label: currentCategory.name,
      href: currentCategory.slug
        ? `/c/${currentCategory.slug}`
        : undefined,
      id: currentCategory.id,
    });
    // Отримуємо parent category separately to avoid type issues
    const parentId = currentCategory.parentId;
    if (parentId) {
      currentCategory = await prisma.category.findUnique({
        where: { id: parentId },
        include: { parent: true },
      });
    } else {
      currentCategory = null;
    }
    depth++;
  }

  return breadcrumbs;
}

/**
 * Повертає breadcrumb для товару: [Головна, ...категорії, назва товару]
 */
export async function getProductBreadcrumb(
  productId: string,
  storeSlug: string
): Promise<BreadcrumbItem[]> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
    },
  });

  if (!product) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];

  // Додаємо категорії (рекурсивно до кореня)
  if (product.category) {
    const categoryBreadcrumbs = await getCategoryBreadcrumb(
      product.category.id,
      storeSlug
    );
    breadcrumbs.push(...categoryBreadcrumbs);
  }

  // Додаємо сам товар
  breadcrumbs.push({
    label: product.name,
    id: product.id,
  });

  return breadcrumbs;
}

/**
 * Отримує breadcrumb для категорії з урахуванням storeSlug
 */
export async function buildCategoryBreadcrumbList(
  categoryId: string,
  storeSlug: string
): Promise<BreadcrumbItem[]> {
  const categoryBreadcrumbs = await getCategoryBreadcrumb(categoryId, storeSlug);
  return categoryBreadcrumbs;
}
