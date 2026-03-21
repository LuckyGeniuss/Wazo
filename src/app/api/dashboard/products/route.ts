import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const {
      name,
      description,
      price,
      compareAtPrice,
      stock,
      imageUrl,
      categoryId,
      externalId,
      isFeatured,
      isDraft,
      isArchived,
      storeId,
    } = body;

    if (!name || !price || !storeId) {
      return new NextResponse("Name, price, and storeId are required", { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: session.user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        compareAtPrice,
        stock,
        imageUrl,
        categoryId: categoryId || null,
        externalId: externalId || null,
        isFeatured,
        isDraft,
        isArchived,
        storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
