/**
 * Script to find products with broken images (Unsplash URLs)
 * Run: npx tsx scripts/find-broken-images.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Unsplash URL patterns that might be broken
const UNSPLASH_PATTERNS = [
  'images.unsplash.com',
  'unsplash.com',
];

function isUnsplashUrl(url: string | null): boolean {
  if (!url) return false;
  return UNSPLASH_PATTERNS.some(pattern => url.includes(pattern));
}

async function main() {
  console.log('🔍 Пошук товарів з битими посиланнями на зображення...\n');

  // Отримати всі товари
  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      images: true,
      storeId: true,
    },
  });

  console.log(`Усього товарів: ${allProducts.length}\n`);

  // Знайти товари з Unsplash URL
  const unsplashProducts = allProducts.filter(p => 
    isUnsplashUrl(p.imageUrl) || p.images?.some(img => isUnsplashUrl(img))
  );

  console.log(`Товари з Unsplash URL: ${unsplashProducts.length}\n`);

  if (unsplashProducts.length > 0) {
    console.log('Список товарів з Unsplash зобраеннями:');
    console.log('─'.repeat(80));
    
    unsplashProducts.slice(0, 50).forEach(product => {
      const hasMainImage = product.imageUrl ? '✅' : '❌';
      const hasExtraImages = product.images?.length ? `+${product.images.length}` : '';
      console.log(`${hasMainImage} ${product.id.substring(0, 8)}... | ${product.name.substring(0, 40)}... ${hasExtraImages}`);
      if (product.imageUrl) {
        console.log(`   Main: ${product.imageUrl?.substring(0, 80)}...`);
      }
      if (product.images?.length > 0) {
        product.images.slice(0, 3).forEach((img, i) => {
          console.log(`   [${i}]: ${img?.substring(0, 80)}...`);
        });
      }
      console.log('');
    });

    if (unsplashProducts.length > 50) {
      console.log(`... ще ${unsplashProducts.length - 50} товарів`);
    }
  }

  // Знайти товари без жодного зображення
  const noImageProducts = allProducts.filter(p => 
    !p.imageUrl && (!p.images || p.images.length === 0)
  );

  console.log(`\nТовари без жодного зобраення: ${noImageProducts.length}`);
  
  if (noImageProducts.length > 0 && noImageProducts.length <= 20) {
    noImageProducts.forEach(product => {
      console.log(`   - ${product.id.substring(0, 8)}... | ${product.name.substring(0, 40)}`);
    });
  }

  // Статистика
  console.log('\n📊 Статистика:');
  console.log(`   Усього товарів: ${allProducts.length}`);
  console.log(`   З Unsplash URL: ${unsplashProducts.length} (${Math.round(unsplashProducts.length / allProducts.length * 100)}%)`);
  console.log(`   Без зображень: ${noImageProducts.length} (${Math.round(noImageProducts.length / allProducts.length * 100)}%)`);
  console.log(`   Зі зобраеннями: ${allProducts.filter(p => p.imageUrl || p.images?.length).length}`);

  await prisma.$disconnect();
}

main().catch(console.error);
