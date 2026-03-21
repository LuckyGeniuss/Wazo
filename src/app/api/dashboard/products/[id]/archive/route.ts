import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
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

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        isArchived: !existingProduct.isArchived,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_ARCHIVE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
