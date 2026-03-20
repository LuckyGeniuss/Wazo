"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Validation ──────────────────────────────────────────────────────────────

const createCampaignSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  subject: z.string().min(1, "Тема письма обязательна"),
  htmlContent: z.string().min(1, "Содержимое письма обязательно"),
  audienceFilter: z
    .object({
      type: z.enum(["all", "group"]),
      groupId: z.string().optional(),
    })
    .optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

// ─── Get campaigns ────────────────────────────────────────────────────────────

export async function getEmailCampaigns(storeId: string) {
  return { campaigns: [] as any[] };
}

export async function createEmailCampaign(storeId: string, input: CreateCampaignInput) {
  return { campaign: null as any, error: undefined as string | undefined };
}

export async function sendEmailCampaign(campaignId: string, storeId: string) {
  return { success: true, error: undefined as string | undefined, sentTo: 0 as number | undefined };
}

export async function deleteEmailCampaign(campaignId: string, storeId: string) {
  return { success: true, error: undefined as string | undefined };
}
