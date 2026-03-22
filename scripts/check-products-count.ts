import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Перевірка кількості товарів по магазинах ===\n");

  // Отримуємо всі магазини
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
  });

  console.log(`Всього магазинів: ${stores.length}\n`);

  // Для кожного магазину рахуємо товари
  for (const store of stores) {
    const productsCount = await prisma.product.count({
      where: { storeId: store.id },
    });

    const categoryCount = await prisma.category.count({
      where: { storeId: store.id },
    });

    console.log(`Магазин: ${store.name} (${store.slug})`);
    console.log(`  ID: ${store.id}`);
    console.log(`  Товарів: ${productsCount}`);
    console.log(`  Категорій: ${categoryCount}`);
    console.log("");
  }

  // Додатково: перевіримо товари для конкретного storeId
  const testStoreId = stores[0]?.id;
  if (testStoreId) {
    console.log(`\n=== Деталі для магазину ${testStoreId} ===`);
    const products = await prisma.product.findMany({
      where: { storeId: testStoreId },
      include: { category: true },
      take: 5,
    });
    console.log(`Перші 5 товарів:`, products.map(p => ({ id: p.id, name: p.name, categoryId: p.categoryId })));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
