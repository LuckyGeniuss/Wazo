import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/dashboard/orders/[orderId]/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const body = await request.json();
    const { status, trackingNumber } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Отримуємо замовлення
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { store: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Перевіряємо, що магазин належить користувачу
    if (order.store.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Оновлюємо статус
    const updateData: { status: typeof status; trackingNumber?: string } = {
      status: status as typeof status,
    };
  
    // Додаємо ТТН, якщо статус SHIPPED і вказано trackingNumber
    if (status === "SHIPPED" && trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
  
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as any, // Cast to any to bypass Prisma enum type issue
        ...(status === "SHIPPED" && trackingNumber && { trackingNumber }),
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: "Status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
