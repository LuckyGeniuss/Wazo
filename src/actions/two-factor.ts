"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { randomBytes, createHash } from "crypto";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Wazo.Market";

// ─── Генерация секрета и QR-кода ──────────────────────────────────────────────

export async function generateTwoFactorSecret(): Promise<{
  success: boolean;
  secret?: string;
  qrCodeUrl?: string;
  otpauthUrl?: string;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Не авторизован" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, twoFactorEnabled: true },
  });

  if (!user) {
    return { success: false, error: "Пользователь не найден" };
  }

  if (user.twoFactorEnabled) {
    return { success: false, error: "2FA уже активирована" };
  }

  // Генерируем новый секрет
  const totp = new OTPAuth.TOTP({
    issuer: APP_NAME,
    label: user.email ?? "user",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });

  const secret = totp.secret.base32;

  // Временно сохраняем секрет (до подтверждения)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorSecret: secret },
  });

  const otpauthUrl = totp.toString();
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

  return { success: true, secret, qrCodeUrl, otpauthUrl };
}

// ─── Включение 2FA (после подтверждения первого кода) ────────────────────────

export async function enableTwoFactor(code: string): Promise<{
  success: boolean;
  backupCodes?: string[];
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Не авторизован" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorSecret) {
    return { success: false, error: "Сначала сгенерируйте QR-код" };
  }

  if (user.twoFactorEnabled) {
    return { success: false, error: "2FA уже активирована" };
  }

  // Проверяем TOTP-код
  const totp = new OTPAuth.TOTP({
    issuer: APP_NAME,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
  });

  const delta = totp.validate({ token: code, window: 1 });
  if (delta === null) {
    return { success: false, error: "Неверный код. Попробуйте ещё раз." };
  }

  // Генерируем резервные коды
  const backupCodes = Array.from({ length: 10 }, () =>
    randomBytes(4).toString("hex").toUpperCase()
  );

  // Хешируем резервные коды для хранения
  const hashedBackupCodes = backupCodes.map((code) =>
    createHash("sha256").update(code).digest("hex")
  );

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: true,
      twoFactorBackupCodes: hashedBackupCodes,
    },
  });

  return { success: true, backupCodes };
}

// ─── Отключение 2FA ───────────────────────────────────────────────────────────

export async function disableTwoFactor(code: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Не авторизован" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      twoFactorSecret: true,
      twoFactorEnabled: true,
      twoFactorBackupCodes: true,
    },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return { success: false, error: "2FA не активирована" };
  }

  // Проверяем TOTP-код или резервный код
  const totp = new OTPAuth.TOTP({
    issuer: APP_NAME,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
  });

  const delta = totp.validate({ token: code, window: 1 });
  
  if (delta === null) {
    // Проверяем резервный код
    const hashedInput = createHash("sha256").update(code.toUpperCase()).digest("hex");
    const isValidBackup = user.twoFactorBackupCodes.includes(hashedInput);
    
    if (!isValidBackup) {
      return { success: false, error: "Неверный код" };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: [],
    },
  });

  return { success: true };
}

// ─── Проверка TOTP-кода (при входе) ──────────────────────────────────────────

export async function verifyTwoFactorCode(
  userId: string,
  code: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      twoFactorSecret: true,
      twoFactorEnabled: true,
      twoFactorBackupCodes: true,
    },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return false;
  }

  // Проверяем TOTP
  const totp = new OTPAuth.TOTP({
    issuer: APP_NAME,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
  });

  const delta = totp.validate({ token: code, window: 1 });
  if (delta !== null) return true;

  // Проверяем резервный код
  const hashedInput = createHash("sha256").update(code.toUpperCase()).digest("hex");
  const backupIndex = user.twoFactorBackupCodes.indexOf(hashedInput);
  
  if (backupIndex !== -1) {
    // Удаляем использованный резервный код
    const updatedCodes = [...user.twoFactorBackupCodes];
    updatedCodes.splice(backupIndex, 1);
    
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorBackupCodes: updatedCodes },
    });
    
    return true;
  }

  return false;
}

// ─── Получение статуса 2FA ────────────────────────────────────────────────────

export async function getTwoFactorStatus(): Promise<{
  enabled: boolean;
  backupCodesCount: number;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { enabled: false, backupCodesCount: 0 };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true, twoFactorBackupCodes: true },
  });

  return {
    enabled: user?.twoFactorEnabled ?? false,
    backupCodesCount: user?.twoFactorBackupCodes.length ?? 0,
  };
}
