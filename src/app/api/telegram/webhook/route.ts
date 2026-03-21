import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.message?.text?.startsWith('/start')) {
      const code = body.message.text.split(' ')[1];
      const chatId = body.message.chat.id.toString();

      if (code) {
        const linkCode = await prisma.telegramLinkCode.findUnique({
          where: { code },
          include: { store: true },
        });

        if (!linkCode || linkCode.usedAt || linkCode.expiresAt < new Date()) {
          await sendTelegramMessage(chatId, '❌ Код недійсний або його термін дії закінчився.');
          return NextResponse.json({ ok: true });
        }

        await prisma.store.update({
          where: { id: linkCode.storeId },
          data: {
            telegramChatId: chatId,
            telegramBotEnabled: true,
          },
        });

        await prisma.telegramLinkCode.update({
          where: { id: linkCode.id },
          data: { usedAt: new Date() },
        });

        await sendTelegramMessage(
          chatId,
          `✅ <b>Успішно підключено!</b>\n\nМагазин: ${linkCode.store.name}\n\nТепер ви будете отримувати сюди сповіщення про нові замовлення.`
        );
      } else {
        await sendTelegramMessage(chatId, '👋 Вітаю! Я бот для сповіщень. Перейдіть в налаштування магазину, щоб підключити мене.');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[TELEGRAM_WEBHOOK]', error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
