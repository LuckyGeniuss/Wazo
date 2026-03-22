/**
 * Script to check Telegram bot configuration and find Epicentr store
 * Run: npx tsx scripts/check-telegram.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Перевірка Telegram налаштувань...\n');

  // 1. Перевірка змінних оточення
  console.log('1. Змінні оточення:');
  console.log(`   TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Встановлено' : '❌ Не встановлено'}`);
  console.log(`   TELEGRAM_BOT_USERNAME: ${process.env.TELEGRAM_BOT_USERNAME || '❌ Не встановлено'}`);
  console.log(`   TELEGRAM_WEBHOOK_SECRET: ${process.env.TELEGRAM_WEBHOOK_SECRET ? '✅ Встановлено' : '❌ Не встановлено'}\n`);

  // 2. Знайти магазин Epicentr
  console.log('2. Пошук магазину Epicentr...');
  const epicentrStore = await prisma.store.findFirst({
    where: {
      name: {
        contains: 'Epicentr',
        mode: 'insensitive',
      },
    },
  });

  if (epicentrStore) {
    console.log(`   ✅ Знайдено: ${epicentrStore.name}`);
    console.log(`   ID: ${epicentrStore.id}`);
    console.log(`   Slug: ${epicentrStore.slug}`);
    console.log(`   Telegram Chat ID: ${epicentrStore.telegramChatId || '❌ Не підключено'}`);
    console.log(`   Telegram Bot Enabled: ${epicentrStore.telegramBotEnabled ? '✅ Так' : '❌ Ні'}`);
  } else {
    console.log('   ❌ Магазин Epicentr не знайдено');
  }

  // 3. Показати всі магазини з увімкненим Telegram
  console.log('\n3. Магазини з підключеним Telegram:');
  const telegramStores = await prisma.store.findMany({
    where: {
      telegramBotEnabled: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      telegramChatId: true,
    },
  });

  if (telegramStores.length === 0) {
    console.log('   ❌ Немає магазинів з підключеним Telegram');
  } else {
    telegramStores.forEach(store => {
      console.log(`   - ${store.name} (${store.slug}): ${store.telegramChatId}`);
    });
  }

  // 4. Перевірка webhook
  console.log('\n4. Перевірка webhook...');
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (token) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
      const data = await response.json();
      if (data.ok) {
        console.log(`   Webhook URL: ${data.result.url || '❌ Не встановлено'}`);
        console.log(`   Pending updates: ${data.result.pending_update_count || 0}`);
      } else {
        console.log('   ❌ Помилка отримання інформації про webhook');
      }
    } catch (error) {
      console.log(`   ❌ Помилка: ${error}`);
    }
  } else {
    console.log('   ❌ TELEGRAM_BOT_TOKEN не встановлено');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
