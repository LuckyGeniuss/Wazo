import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sendTelegramMessage } from '@/lib/telegram';
import { NextResponse } from 'next/server';

/**
 * Надсилає тестове сповіщення в Telegram
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { storeId } = await params;

    // Отримуємо магазин
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { 
        id: true, 
        name: true, 
        telegramChatId: true, 
        telegramBotEnabled: true 
      },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    if (!store.telegramBotEnabled || !store.telegramChatId) {
      return NextResponse.json(
        { error: 'Telegram bot is not connected' }, 
        { status: 400 }
      );
    }

    // Надсилаємо тестове повідомлення
    const testMessage = `✅ <b>Тестове сповіщення</b>\n\n` +
      `Магазин: ${store.name}\n` +
      `Час: ${new Date().toLocaleString('uk-UA')}\n\n` +
      `Якщо ви бачите це повідомлення, то налаштування правильні! 🎉`;

    const success = await sendTelegramMessage(store.telegramChatId, testMessage);

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Тестове сповіщення надіслано успішно!' 
      });
    } else {
      return NextResponse.json(
        { error: 'Помилка надсилання повідомлення' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error testing Telegram notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
