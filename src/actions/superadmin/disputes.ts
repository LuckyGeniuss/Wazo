"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Schema для валідації
const createDisputeSchema = z.object({
  orderId: z.string(),
  type: z.enum([
    "PRODUCT_NOT_RECEIVED",
    "PRODUCT_DAMAGED",
    "PRODUCT_NOT_AS_DESCRIBED",
    "WRONG_ITEM",
    "REFUND_ISSUE",
    "SHIPPING_ISSUE",
    "OTHER",
  ]),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requestedResolution: z.enum(["REFUND", "REPLACEMENT", "PARTIAL_REFUND"]),
  refundAmount: z.number().optional(),
});

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;

/**
 * Створити нову суперечку
 */
export async function createDispute(input: CreateDisputeInput) {
  try {
    const validated = createDisputeSchema.parse(input);

    // Отримуємо замовлення
    const order = await prisma.order.findUnique({
      where: { id: validated.orderId },
      include: { user: true, store: true },
    });

    if (!order) {
      return { error: "Order not found" };
    }

    // Створюємо суперечку
    const dispute = await prisma.disputeCase.create({
      data: {
        orderId: validated.orderId,
        storeId: order.storeId,
        userId: order.userId || "",
        type: validated.type,
        title: validated.title,
        description: validated.description,
        requestedResolution: validated.requestedResolution,
        refundAmount: validated.refundAmount,
        status: "OPEN",
      },
    });

    // Створюємо системне повідомлення
    await prisma.disputeMessage.create({
      data: {
        disputeCaseId: dispute.id,
        senderType: "SYSTEM",
        message: `Dispute case #${dispute.id} created for order #${order.id}`,
      },
    });

    revalidatePath("/superadmin/disputes");
    revalidatePath("/dashboard");

    return { success: true, dispute };
  } catch (error) {
    console.error("Failed to create dispute:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Отримати всі суперечки з фільтрацією
 */
export async function getDisputes({
  status,
  storeId,
  limit = 50,
}: {
  status?: string;
  storeId?: string;
  limit?: number;
} = {}) {
  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (storeId) {
    where.storeId = storeId;
  }

  const disputes = await prisma.disputeCase.findMany({
    where,
    include: {
      order: {
        select: {
          id: true,
          status: true,
          totalPrice: true,
          customerName: true,
          customerEmail: true,
        },
      },
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return disputes;
}

/**
 * Отримати одну суперечку з деталями
 */
export async function getDisputeById(disputeId: string) {
  const dispute = await prisma.disputeCase.findUnique({
    where: { id: disputeId },
    include: {
      order: {
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      },
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          isSuspended: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return dispute;
}

/**
 * Додати повідомлення до суперечки
 */
export async function addDisputeMessage(
  disputeId: string,
  senderType: "CUSTOMER" | "SELLER" | "ADMIN",
  message: string,
  attachments: string[] = []
) {
  try {
    const disputeMessage = await prisma.disputeMessage.create({
      data: {
        disputeCaseId: disputeId,
        senderType,
        message,
        attachments,
      },
    });

    // Оновлюємо статус суперечки якщо потрібно
    if (senderType === "CUSTOMER") {
      await prisma.disputeCase.update({
        where: { id: disputeId },
        data: { status: "CUSTOMER_RESPONDED" },
      });
    } else if (senderType === "SELLER") {
      await prisma.disputeCase.update({
        where: { id: disputeId },
        data: { status: "SELLER_RESPONDED" },
      });
    }

    revalidatePath(`/superadmin/disputes/${disputeId}`);

    return { success: true, message: disputeMessage };
  } catch (error) {
    console.error("Failed to add dispute message:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Оновити статус суперечки
 */
export async function updateDisputeStatus(
  disputeId: string,
  status: string,
  adminNote?: string
) {
  try {
    const updateData: any = { status };

    if (adminNote) {
      updateData.adminNote = adminNote;
    }

    const updated = await prisma.disputeCase.update({
      where: { id: disputeId },
      data: updateData,
    });

    revalidatePath("/superadmin/disputes");
    revalidatePath(`/superadmin/disputes/${disputeId}`);

    return { success: true, dispute: updated };
  } catch (error) {
    console.error("Failed to update dispute status:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Вирішити суперечку (Final Decision)
 */
export async function resolveDispute(
  disputeId: string,
  decision: "CUSTOMER" | "SELLER" | "COMPROMISE",
  decisionReason: string,
  refundAmount?: number
) {
  try {
    const dispute = await prisma.disputeCase.findUnique({
      where: { id: disputeId },
      include: { order: true },
    });

    if (!dispute) {
      return { error: "Dispute not found" };
    }

    // Оновлюємо суперечку
    await prisma.disputeCase.update({
      where: { id: disputeId },
      data: {
        status:
          decision === "CUSTOMER"
            ? "RESOLVED_CUSTOMER"
            : decision === "SELLER"
            ? "RESOLVED_SELLER"
            : "RESOLVED_CUSTOMER",
        finalDecision: decision,
        decisionReason,
        refundAmount: refundAmount || dispute.refundAmount,
        resolvedAt: new Date(),
      },
    });

    // Додаємо системне повідомлення
    await prisma.disputeMessage.create({
      data: {
        disputeCaseId: disputeId,
        senderType: "SYSTEM",
        message: `Dispute resolved: ${decision}. Reason: ${decisionReason}`,
      },
    });

    revalidatePath("/superadmin/disputes");
    revalidatePath(`/superadmin/disputes/${disputeId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to resolve dispute:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Отримати статистику суперечок
 */
export async function getDisputeStats() {
  const stats = await prisma.disputeCase.groupBy({
    by: ["status"],
    _count: true,
  });

  const totalStats = await prisma.disputeCase.aggregate({
    _count: true,
    _avg: {
      refundAmount: true,
    },
  });

  return {
    byStatus: stats.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      },
      {} as Record<string, number>
    ),
    total: totalStats._count,
    avgRefundAmount: totalStats._avg.refundAmount || 0,
  };
}
