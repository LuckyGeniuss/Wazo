import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const storeSettingsSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  heroBannerUrl: z.string().optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  showCategories: z.boolean().optional(),
  showFeaturedProducts: z.boolean().optional(),
  productsLayout: z.enum(["grid", "list"]).optional(),
  productsPerRow: z.number().int().min(2).max(5).optional(),
  headerLogo: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
});

// GET - Отримати налаштування вітрини
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storeId } = await params;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        storeSettings: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Check if user has access to this store
    const userStores = await prisma.store.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          {
            teamMembers: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
    });

    const hasAccess = userStores.some((s) => s.id === storeId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      settings: store.storeSettings || null,
    });
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Створити або оновити налаштування вітрини
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storeId } = await params;
    const body = await request.json();

    const validatedData = storeSettingsSchema.parse(body);

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Check if user has access to this store
    const userStores = await prisma.store.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          {
            teamMembers: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
    });

    const hasAccess = userStores.some((s) => s.id === storeId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Upsert store settings
    const settings = await prisma.storeSettings.upsert({
      where: { storeId },
      create: {
        storeId,
        ...validatedData,
      },
      update: validatedData,
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error saving store settings:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Видалити налаштування вітрини
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storeId } = await params;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Check if user has access to this store
    const userStores = await prisma.store.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          {
            teamMembers: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
    });

    const hasAccess = userStores.some((s) => s.id === storeId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.storeSettings.delete({
      where: { storeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting store settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
