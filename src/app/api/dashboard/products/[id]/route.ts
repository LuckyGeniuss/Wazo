import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    } = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { store: true },
    });

    if (!existingProduct) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (existingProduct.store.ownerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
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
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { store: true },
    });

    if (!existingProduct) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (existingProduct.store.ownerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
