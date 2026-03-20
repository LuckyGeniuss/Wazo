"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Схемы валидации ──────────────────────────────────────────────────────────

const createWarehouseSchema = z.object({
  storeId: z.string().min(1),
  name: z.string().min(1, "Название обязательно"),
  address: z.string().optional(),
  isDefault: z.boolean().default(false),
});

const updateStockSchema = z.object({
  warehouseId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int().min(0),
  variantSku: z.string().optional(),
});

const addStockMovementSchema = z.object({
  warehouseId: z.string().min(1),
  productId: z.string().min(1),
  type: z.enum(["RECEIPT", "SALE", "RETURN", "ADJUSTMENT", "TRANSFER"]),
  quantity: z.number().int().min(1),
  reason: z.string().optional(),
  orderId: z.string().optional(),
});

// ─── Создание склада ───────────────────────────────────────────────────────────

export async function createWarehouse(input: z.infer<typeof createWarehouseSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Не авторизован" };

  const parsed = createWarehouseSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { storeId, name, address, isDefault } = parsed.data;

  // Если устанавливаем как дефолтный — сначала убираем у остальных
  if (isDefault) {
    await (prisma as any).warehouse.updateMany({
      where: { storeId },
      data: { isDefault: false },
    });
  }

  const warehouse = await (prisma as any).warehouse.create({
    data: { storeId, name, address, isDefault },
  });

  revalidatePath(`/dashboard/${storeId}/inventory`);
  return { success: true, warehouse };
}

// ─── Получение складов магазина ───────────────────────────────────────────────

export async function getWarehouses(storeId: string) {
  return (prisma as any).warehouse.findMany({
    where: { storeId },
    include: {
      _count: { select: { stock: true } },
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
}

// ─── Обновление остатков ───────────────────────────────────────────────────────

export async function updateWarehouseStock(input: z.infer<typeof updateStockSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Не авторизован" };

  const parsed = updateStockSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { warehouseId, productId, quantity, variantSku } = parsed.data;

  const stock = await (prisma as any).warehouseStock.upsert({
    where: {
      warehouseId_productId_variantSku: {
        warehouseId,
        productId,
        variantSku: variantSku ?? null,
      },
    },
    update: {
      quantity,
      available: Math.max(0, quantity),
    },
    create: {
      warehouseId,
      productId,
      quantity,
      available: Math.max(0, quantity),
      variantSku: variantSku ?? null,
    },
  });

  // Получаем storeId из warehouse для revalidatePath
  const warehouse = await (prisma as any).warehouse.findUnique({
    where: { id: warehouseId },
    select: { storeId: true },
  });

  if (warehouse) {
    revalidatePath(`/dashboard/${warehouse.storeId}/inventory`);
  }

  return { success: true, stock };
}

// ─── Добавление движения товара ────────────────────────────────────────────────

export async function addStockMovement(input: z.infer<typeof addStockMovementSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Не авторизован" };

  const parsed = addStockMovementSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { warehouseId, productId, type, quantity, reason, orderId } = parsed.data;

  // Создаём движение
  const movement = await (prisma as any).stockMovement.create({
    data: { warehouseId, productId, type, quantity, reason, orderId },
  });

  // Обновляем WarehouseStock
  const delta =
    type === "RECEIPT" || type === "RETURN" ? quantity
    : type === "SALE" || type === "TRANSFER" ? -quantity
    : type === "ADJUSTMENT" ? quantity
    : 0;

  await (prisma as any).warehouseStock.upsert({
    where: {
      warehouseId_productId_variantSku: {
        warehouseId,
        productId,
        variantSku: null,
      },
    },
    update: {
      quantity: { increment: delta },
      available: { increment: delta },
    },
    create: {
      warehouseId,
      productId,
      quantity: Math.max(0, delta),
      available: Math.max(0, delta),
      variantSku: null,
    },
  });

  // Синхронизируем Product.stock с суммой по всем складам
  const totalStock = await (prisma as any).warehouseStock.aggregate({
    where: { productId },
    _sum: { available: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { stock: totalStock._sum.available ?? 0 },
  });

  const warehouse = await (prisma as any).warehouse.findUnique({
    where: { id: warehouseId },
    select: { storeId: true },
  });

  if (warehouse) {
    revalidatePath(`/dashboard/${warehouse.storeId}/inventory`);
  }

  return { success: true, movement };
}

// ─── Получение стока склада с продуктами ──────────────────────────────────────

export async function getWarehouseStock(warehouseId: string) {
  return (prisma as any).warehouseStock.findMany({
    where: { warehouseId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          stock: true,
          price: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

// ─── История движений ─────────────────────────────────────────────────────────

export async function getStockMovements(
  warehouseId: string,
  limit = 50
) {
  return (prisma as any).stockMovement.findMany({
    where: { warehouseId },
    include: {
      product: { select: { id: true, name: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// ─── Статистика склада ────────────────────────────────────────────────────────

export async function getInventoryStats(storeId: string) {
  const warehouses = await (prisma as any).warehouse.findMany({
    where: { storeId },
    select: { id: true },
  });

  const warehouseIds = warehouses.map((w: { id: string }) => w.id);

  const [totalProducts, totalItems, lowStockCount] = await Promise.all([
    (prisma as any).warehouseStock.count({ where: { warehouseId: { in: warehouseIds } } }),
    (prisma as any).warehouseStock.aggregate({
      where: { warehouseId: { in: warehouseIds } },
      _sum: { quantity: true, available: true, reserved: true },
    }),
    (prisma as any).warehouseStock.count({
      where: { warehouseId: { in: warehouseIds }, available: { lte: 5 } },
    }),
  ]);

  return {
    warehousesCount: warehouses.length,
    totalProducts,
    totalQuantity: totalItems._sum.quantity ?? 0,
    totalAvailable: totalItems._sum.available ?? 0,
    totalReserved: totalItems._sum.reserved ?? 0,
    lowStockCount,
  };
}
