"use server";

import { auth } from "@/auth";
import { requireStoreAccess } from "@/lib/auth/permissions";
import { getAuditLogs, getAuditLogsCount } from "@/lib/audit/log";

export async function getStoreAuditLogs(
  storeId: string,
  options?: { limit?: number; offset?: number; entity?: string }
) {
  const session = await auth();
  if (!session?.user) return { error: "Необходима авторизация" };

  await requireStoreAccess(session.user.id, storeId, "settings:manage");

  const [logs, total] = await Promise.all([
    getAuditLogs(storeId, options),
    getAuditLogsCount(storeId, options?.entity),
  ]);

  return { logs, total };
}
