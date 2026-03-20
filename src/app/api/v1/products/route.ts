import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры фильтрации
    const storeId = searchParams.get("storeId");
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    
    // Параметры пагинации
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {
      isArchived: false
    };

    // Фильтрация по магазину
    if (storeId) {
      where.storeId = storeId;
    }

    // Фильтрация по категории
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Фильтрация по цене
    if (minPrice && maxPrice) {
      where.price = {
        gte: parseFloat(minPrice),
        lte: parseFloat(maxPrice)
      };
    } else if (minPrice) {
      where.price = {
        gte: parseFloat(minPrice)
      };
    } else if (maxPrice) {
      where.price = {
        lte: parseFloat(maxPrice)
      };
    }

    // Фильтрация по featured
    if (featured === "true") {
      where.isFeatured = true;
    }

    // Поиск по имени
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive"
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip
      }),
      prisma.product.count({ where })
    ]);

    return Response.json({
      success: true,
      data: products,
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