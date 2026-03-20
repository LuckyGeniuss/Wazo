import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры пагинации
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          products: {
            where: { isArchived: false },
            take: 1,
            orderBy: { createdAt: "desc" }
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip
      }),
      prisma.store.count()
    ]);

    const storesWithStats = stores.map(store => {
      const productsCount = store.products.length;
      return {
        id: store.id,
        name: store.name,
        slug: store.slug,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
        lastProductImage: store.products[0]?.imageUrl || null,
        productsCount
      };
    });

    return Response.json({
      success: true,
      data: storesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}