"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

const APP_URL = (process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL) || "https://wazo-market.vercel.app";

/**
 * Генерирует одноразовый код привязки Telegram (10 минут)
 */
export async function generateTelegramLinkCode(storeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const code = crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A1B2C3D4"
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

   
  await (prisma as any).telegramLinkCode.create({
    data: { storeId, code, expiresAt },
  });

  return { code };
}

/**
 * Генерирует ссылку (deeplink) для подключения Telegram бота
 */
export async function getTelegramBotLink(storeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

   
  const store = await (prisma as any).store.findUnique({
    where: { id: storeId },
    select: { telegramBotEnabled: true },
  });

  if (!store) return { error: "Store not found" };

  if (store.telegramBotEnabled) {
    return { error: "Telegram bot is already connected" };
  }

  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    return { error: "TELEGRAM_BOT_USERNAME is not set in environment variables" };
  }

  // Generate deep link for /start command
  const link = `https://t.me/${botUsername}?start=store_${storeId}`;
  
  return { link };
}

/**
 * Отключает Telegram бота для магазина
 */
export async function disconnectTelegramBot(storeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

   
  await (prisma as any).store.update({
    where: { id: storeId },
    data: { telegramChatId: null, telegramBotEnabled: false },
  });

  revalidatePath(`/dashboard/${storeId}/settings/telegram`);
  return { success: true };
}

/**
 * Получает статус Telegram бота для магазина
 */
export async function getTelegramSettings(storeId: string) {
   
  const store = await (prisma as any).store.findUnique({
    where: { id: storeId },
    select: { telegramChatId: true, telegramBotEnabled: true },
  });

  if (!store) return null;

  return {
    chatId: store.telegramChatId as string | null,
    enabled: store.telegramBotEnabled as boolean,
    botUsername: process.env.TELEGRAM_BOT_USERNAME ?? null,
  };
}

/**
 * Устанавливает webhook для Telegram бота (вызывается один раз при деплое)
 */
export async function setTelegramWebhook() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { error: "TELEGRAM_BOT_TOKEN not set" };

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET ?? "";
  const webhookUrl = `₴{APP_URL}/api/telegram/webhook`;

  const res = await fetch(
    `https://api.telegram.org/bot${token}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: secret,
        allowed_updates: ["message", "callback_query"],
      }),
    }
  );

  const data = await res.json();
  if (!data.ok) return { error: data.description ?? "Failed to set webhook" };

  return { success: true, webhookUrl };
}
