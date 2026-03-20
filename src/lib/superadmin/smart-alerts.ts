import { prisma } from "@/lib/prisma";

/**
 * Smart Admin Notifications System
 * 
 * Генерує розумні сповіщення для SuperAdmin на основі:
 * - Critical Alerts (критичні події)
 * - High Priority Disputes (термінові суперечки)
 * - Seller Milestones (досягнення продавців)
 * - Platform Anomalies (аномалії платформи)
 * - Revenue Milestones (досягнення по доходах)
 * - Health Score Drops (падіння здоров'я продавців)
 * - Verification Pending (очікують верифікації)
 * - Fraud Alerts (підозріла активність)
 */

export type NotificationType =
  | "CRITICAL_ALERT"
  | "HIGH_PRIORITY_DISPUTE"
  | "SELLER_MILESTONE"
  | "PLATFORM_ANOMALY"
  | "REVENUE_MILESTONE"
  | "SYSTEM_ALERT"
  | "HEALTH_SCORE_DROP"
  | "VERIFICATION_PENDING"
  | "FRAUD_ALERT";

export type NotificationSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * Створити сповіщення
 */
export async function createAdminNotification({
  type,
  severity,
  title,
  message,
  storeId,
  userId,
  orderId,
  disputeId,
  actionLabel,
  actionUrl,
  metadata,
  expiresAt,
}: {
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  storeId?: string;
  userId?: string;
  orderId?: string;
  disputeId?: string;
  actionLabel?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}) {
  try {
    const notification = await prisma.adminNotification.create({
      data: {
        type,
        severity,
        title,
        message,
        storeId,
        userId,
        orderId,
        disputeId,
        actionLabel,
        actionUrl,
        metadata: metadata || {},
        expiresAt,
      },
    });

    return { success: true, notification };
  } catch (error) {
    console.error("Failed to create admin notification:", error);
    return { error: "Failed to create notification" };
  }
}

/**
 * Перевірити та згенерувати сповіщення про падіння Health Score
 */
export async function checkHealthScoreDrops() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Знайти магазини з різким падінням Health Score
  const lowScores = await prisma.sellerHealthScore.findMany({
    where: {
      overallScore: { lt: 40 },
      lastCalculatedAt: { gte: sevenDaysAgo },
    },
    include: {
      store: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  for (const score of lowScores) {
    // Перевірити, чи вже є сповіщення
    const existingNotification = await prisma.adminNotification.findFirst({
      where: {
        storeId: score.storeId,
        type: "HEALTH_SCORE_DROP",
        createdAt: { gte: sevenDaysAgo },
      },
    });

    if (!existingNotification) {
      await createAdminNotification({
        type: "HEALTH_SCORE_DROP",
        severity: score.overallScore < 30 ? "CRITICAL" : "HIGH",
        title: `Low Health Score: ${score.store.name}`,
        message: `Store ${score.store.name} has a health score of ${score.overallScore}. Immediate attention required.`,
        storeId: score.storeId,
        actionLabel: "View Store",
        actionUrl: `/superadmin/stores/${score.storeId}`,
        metadata: {
          healthScore: score.overallScore,
          tier: score.tier,
        },
      });
    }
  }
}

/**
 * Перевірити pending верифікації
 */
export async function checkPendingVerifications() {
  const pendingVerifications = await prisma.sellerVerification.findMany({
    where: {
      status: "PENDING",
      createdAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Older than 24h
      },
    },
    include: {
      store: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  for (const verification of pendingVerifications) {
    const existingNotification = await prisma.adminNotification.findFirst({
      where: {
        storeId: verification.storeId,
        type: "VERIFICATION_PENDING",
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!existingNotification) {
      await createAdminNotification({
        type: "VERIFICATION_PENDING",
        severity: "MEDIUM",
        title: `Verification Pending: ${verification.store.name}`,
        message: `Store ${verification.store.name} has been waiting for verification for over 24 hours.`,
        storeId: verification.storeId,
        actionLabel: "Review Verification",
        actionUrl: `/superadmin/verifications`,
        metadata: {
          legalName: verification.legalName,
          status: verification.status,
        },
      });
    }
  }
}

/**
 * Перевірити високі пріоритетні суперечки
 */
export async function checkHighPriorityDisputes() {
  const highPriorityDisputes = await prisma.disputeCase.findMany({
    where: {
      priority: { in: ["HIGH", "CRITICAL"] },
      status: { in: ["OPEN", "IN_REVIEW"] },
    },
    include: {
      store: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  for (const dispute of highPriorityDisputes) {
    const existingNotification = await prisma.adminNotification.findFirst({
      where: {
        disputeId: dispute.id,
        type: "HIGH_PRIORITY_DISPUTE",
      },
    });

    if (!existingNotification) {
      await createAdminNotification({
        type: "HIGH_PRIORITY_DISPUTE",
        severity: dispute.priority as NotificationSeverity,
        title: `High Priority Dispute: #${dispute.id.slice(0, 8)}`,
        message: `${dispute.user.name} vs ${dispute.store.name}: ${dispute.title}`,
        disputeId: dispute.id,
        actionLabel: "Review Dispute",
        actionUrl: `/superadmin/disputes/${dispute.id}`,
        metadata: {
          type: dispute.type,
          priority: dispute.priority,
          daysOpen: dispute.daysOpen,
        },
      });
    }
  }
}

/**
 * Generate all smart alerts (Cron Job)
 */
export async function generateSmartAlerts() {
  console.log("Starting smart alerts generation...");

  try {
    await checkHealthScoreDrops();
    console.log("- Health score checks completed");

    await checkPendingVerifications();
    console.log("- Verification checks completed");

    await checkHighPriorityDisputes();
    console.log("- Dispute checks completed");

    // TODO: Додати інші перевірки
    // - Fraud detection
    // - Revenue milestones
    // - Platform anomalies

    return {
      success: true,
      message: "Smart alerts generated successfully",
    };
  } catch (error) {
    console.error("Failed to generate smart alerts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Отримати кількість непрочитаних сповіщень
 */
export async function getUnreadNotificationsCount() {
  const count = await prisma.adminNotification.count({
    where: {
      isRead: false,
      isArchived: false,
    },
  });

  return count;
}

/**
 * Отримати всі сповіщення з фільтрацією
 */
export async function getAdminNotifications({
  isRead,
  type,
  severity,
  limit = 50,
}: {
  isRead?: boolean;
  type?: NotificationType;
  severity?: NotificationSeverity;
  limit?: number;
} = {}) {
  const where: any = {};

  if (isRead !== undefined) {
    where.isRead = isRead;
  }

  if (type) {
    where.type = type;
  }

  if (severity) {
    where.severity = severity;
  }

  const notifications = await prisma.adminNotification.findMany({
    where,
    include: {
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
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return notifications;
}
