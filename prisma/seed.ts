import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// 20 реалістичних товарів для початкового наповнення
const products = [
  {
    name: "Apple iPhone 15 Pro Max 256GB",
    description: "Останній флагман Apple з титановим корпусом, потужним процесором A17 Pro та професійною камерою 48 МП.",
    price: 54999,
    compareAtPrice: 59999,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600&q=80",
    images: [],
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    tags: ["smartphone", "apple", "premium", "5g"],
    isFeatured: true,
    categoryId: "electronics-smartphones",
  },
  {
    name: "MacBook Air 15\" M3 2024",
    description: "Надтонкий і потужний ноутбук з новітнім чіпом M3, 15-дюймовим дисплеєм Liquid Retina та до 18 годин роботи.",
    price: 62999,
    compareAtPrice: 65999,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    images: [],
    colors: ["Midnight", "Starlight", "Silver", "Space Gray"],
    tags: ["laptop", "apple", "m3", "ultrabook"],
    isFeatured: true,
    categoryId: "electronics-laptops",
  },
  {
    name: "Sony WH-1000XM5",
    description: "Преміальні бездротові навушники з найкращим шумозаглушенням на ринку, 30 годин автономності та кришталево чистим звуком.",
    price: 14999,
    compareAtPrice: 17999,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
    images: [],
    colors: ["Black", "Silver", "Midnight Blue"],
    tags: ["headphones", "sony", "wireless", "noise-cancelling"],
    isFeatured: true,
    categoryId: "electronics-audio",
  },
  {
    name: "Samsung Galaxy Watch 6 Classic",
    description: "Розумний годинник з обертовим безелем, моніторингом здоров'я 24/7, GPS та до 40 годин роботи.",
    price: 11999,
    compareAtPrice: null,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
    images: [],
    colors: ["Black", "Silver"],
    tags: ["smartwatch", "samsung", "fitness", "wearable"],
    isFeatured: true,
    categoryId: "electronics-wearables",
  },
  {
    name: "Nike Air Max 270",
    description: "Класичні кросівки з максимальною амортизацією, дихаючим сітчастим верхом та культовим дизайном.",
    price: 4999,
    compareAtPrice: 5999,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: [],
    colors: ["Red", "Black", "White", "Blue"],
    tags: ["shoes", "nike", "sneakers", "sport"],
    isFeatured: true,
    categoryId: "fashion-shoes",
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Легендарні джинси прямого крою з класичною посадкою. Оригінальна бавовна вінтажного якості.",
    price: 3499,
    compareAtPrice: 4299,
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1542272617-08f08630329e?w=600&q=80",
    images: [],
    colors: ["Blue", "Black", "Stonewash"],
    tags: ["jeans", "levis", "denim", "classic"],
    isFeatured: false,
    categoryId: "fashion-clothing",
  },
  {
    name: "PlayStation 5 Slim Digital Edition",
    description: "Оновлена компактна версія консолі PS5 без дисководу. 825 ГБ SSD, 4K 120Hz, Ray Tracing.",
    price: 19999,
    compareAtPrice: 21999,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80",
    images: [],
    colors: ["White"],
    tags: ["gaming", "playstation", "console", "sony"],
    isFeatured: true,
    categoryId: "electronics-gaming",
  },
  {
    name: "Dyson V15 Detect Absolute",
    description: "Потужний бездротовий пилосос з лазерною технологією виявлення пилу та розумною системою очищення.",
    price: 29999,
    compareAtPrice: 34999,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1558317374-a3569683368d?w=600&q=80",
    images: [],
    colors: ["Nickel/Iron"],
    tags: ["home", "dyson", "vacuum", "cleaning"],
    isFeatured: true,
    categoryId: "home-appliances",
  },
  {
    name: "KitchenAid Artisan Stand Mixer",
    description: "Професійний планетарний міксер потужністю 300 Вт. 10 швидкостей, вінтажний дизайн.",
    price: 18999,
    compareAtPrice: 21999,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&q=80",
    images: [],
    colors: ["Empire Red", "Onyx Black", "White", "Pistachio"],
    tags: ["kitchen", "mixer", "cooking", "baking"],
    isFeatured: false,
    categoryId: "home-kitchen",
  },
  {
    name: "Canon EOS R6 Mark II Body",
    description: "Повнокадрова бездзеркальна камера 24.2 МП, 4K 60fps відео, стабілізація 8 стопів.",
    price: 89999,
    compareAtPrice: 94999,
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
    images: [],
    colors: ["Black"],
    tags: ["camera", "canon", "photography", "fullframe"],
    isFeatured: true,
    categoryId: "electronics-cameras",
  },
  {
    name: "Herman Miller Aeron Chair",
    description: "Ергономічне офісне крісло преміум-класу з сітчастою спинкою та повним налаштуванням.",
    price: 54999,
    compareAtPrice: 59999,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80",
    images: [],
    colors: ["Graphite", "Carbon"],
    tags: ["furniture", "chair", "office", "ergonomic"],
    isFeatured: true,
    categoryId: "home-furniture",
  },
  {
    name: "Bose QuietComfort Earbuds II",
    description: "Бездротові навушники-краплі з персональним шумозаглушенням та 6 годинами роботи.",
    price: 9999,
    compareAtPrice: 11999,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf07499724a?w=600&q=80",
    images: [],
    colors: ["Black", "White", "Soapstone"],
    tags: ["earbuds", "bose", "wireless", "noise-cancelling"],
    isFeatured: false,
    categoryId: "electronics-audio",
  },
  {
    name: "The North Face Nuptse 1996 Jacket",
    description: "Легендарна пуховик-куртка з водовідштовхувальним покриттям та наповнювачем 700-fill goose down.",
    price: 12999,
    compareAtPrice: 14999,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1551488852-080175d275dc?w=600&q=80",
    images: [],
    colors: ["Black", "Navy", "Red", "Yellow"],
    tags: ["jacket", "north face", "winter", "outdoor"],
    isFeatured: true,
    categoryId: "fashion-outerwear",
  },
  {
    name: "iPad Pro 12.9\" M2 256GB WiFi",
    description: "Потужний планшет з рідкісно-земельним дисплеєм Mini-LED, чіпом M2 та підтримкою Apple Pencil 2.",
    price: 44999,
    compareAtPrice: 47999,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop",
    images: [],
    colors: ["Space Gray", "Silver"],
    tags: ["tablet", "ipad", "apple", "pro"],
    isFeatured: true,
    categoryId: "electronics-tablets",
  },
  {
    name: "Adidas Ultraboost 23",
    description: "Бігові кросівки з технологією Boost для максимального повернення енергії та Primeknit+ верху.",
    price: 6499,
    compareAtPrice: 7499,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80",
    images: [],
    colors: ["Black", "White", "Blue", "Grey"],
    tags: ["running", "adidas", "sneakers", "boost"],
    isFeatured: false,
    categoryId: "fashion-shoes",
  },
  {
    name: "Philips Hue White & Color Starter Kit",
    description: "Р роз роз розумне освітлення з 4 лампами E27 та містком. 16 мільйонів кольорів, голосове керування.",
    price: 6999,
    compareAtPrice: 7999,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
    images: [],
    colors: ["Multicolor"],
    tags: ["smart home", "philips", "lighting", "hue"],
    isFeatured: false,
    categoryId: "home-smart",
  },
  {
    name: "Garmin Fenix 7X Solar",
    description: "Топографічний GPS-годинник для пригод з сонячним заряджанням, 37 днями автономності та сапфіровим склом.",
    price: 34999,
    compareAtPrice: 37999,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
    images: [],
    colors: ["Black", "Titanium"],
    tags: ["smartwatch", "garmin", "gps", "outdoor"],
    isFeatured: true,
    categoryId: "electronics-wearables",
  },
  {
    name: "Breville Barista Express Espresso Machine",
    description: "Напівпрофесійна кавова машина з вбудованою млинкою, 15 бар тиску та PID-контролем температури.",
    price: 24999,
    compareAtPrice: 27999,
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1570554827583-99e01c802462?w=600&q=80",
    images: [],
    colors: ["Stainless Steel", "Black Sesame"],
    tags: ["coffee", "espresso", "kitchen", "breville"],
    isFeatured: true,
    categoryId: "home-kitchen",
  },
  {
    name: "Sonos Arc Soundbar",
    description: "Преміальна звукова панель з Dolby Atmos, розумним еквалайзером та голосовим керуванням.",
    price: 39999,
    compareAtPrice: 42999,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80",
    images: [],
    colors: ["Black", "White"],
    tags: ["audio", "sonos", "soundbar", "dolby atmos"],
    isFeatured: true,
    categoryId: "electronics-audio",
  },
  {
    name: "Patagonia Classic Retro-X Fleece",
    description: "Вінтажна флисова кофта з 47% перероблених матеріалів. Вітрозахисна, тепла, вічно модна.",
    price: 7999,
    compareAtPrice: 8999,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
    images: [],
    colors: ["Navy", "Oatmeal", "Black", "Red"],
    tags: ["fleece", "patagonia", "outdoor", "sustainable"],
    isFeatured: false,
    categoryId: "fashion-clothing",
  },
];

// Категорії для початкового наповнення
const categories = [
  { name: "Смартфони", slug: "electronics-smartphones", isGlobal: true, emoji: "📱" },
  { name: "Ноутбуки", slug: "electronics-laptops", isGlobal: true, emoji: "💻" },
  { name: "Аудіо", slug: "electronics-audio", isGlobal: true, emoji: "🎧" },
  { name: "Розумні годинники", slug: "electronics-wearables", isGlobal: true, emoji: "⌚" },
  { name: "Взуття", slug: "fashion-shoes", isGlobal: true, emoji: "👟" },
  { name: "Одяг", slug: "fashion-clothing", isGlobal: true, emoji: "👕" },
  { name: "Ігрові консолі", slug: "electronics-gaming", isGlobal: true, emoji: "🎮" },
  { name: "Побутова техніка", slug: "home-appliances", isGlobal: true, emoji: "🏠" },
  { name: "Кухня", slug: "home-kitchen", isGlobal: true, emoji: "🍳" },
  { name: "Камери", slug: "electronics-cameras", isGlobal: true, emoji: "📷" },
  { name: "Меблі", slug: "home-furniture", isGlobal: true, emoji: "🪑" },
  { name: "Зовнішній одяг", slug: "fashion-outerwear", isGlobal: true, emoji: "🧥" },
  { name: "Планшети", slug: "electronics-tablets", isGlobal: true, emoji: "📱" },
  { name: "Розумний дім", slug: "home-smart", isGlobal: true, emoji: "💡" },
];

async function main() {
  console.log("🌱 Start seeding...");

  // SuperAdmin Seed
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn("⚠️ ADMIN_PASSWORD is not set in environment variables.");
    console.warn("Skipping SuperAdmin creation. Please set ADMIN_PASSWORD and run seed again.");
  } else {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(`✅ SuperAdmin with email ${adminEmail} already exists.`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const superAdmin = await prisma.user.create({
        data: {
          name: "Super Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "SUPERADMIN",
        },
      });
      console.log(`✅ SuperAdmin created: ${superAdmin.email}`);
    }
  }

  // Create global categories
  console.log("📁 Creating global categories...");
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, isGlobal: true },
      create: {
        name: cat.name,
        slug: cat.slug,
        isGlobal: true,
        storeId: null,
      },
    });
  }
  console.log(`✅ Created ${categories.length} global categories.`);

  // Create demo store
  console.log("🏪 Creating demo store...");
  const superAdmin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  if (!superAdmin) {
    console.warn("⚠️ No SuperAdmin found. Skipping demo store creation.");
    return;
  }
  const demoStore = await prisma.store.upsert({
    where: { slug: "demo-store" },
    update: { name: "Demo Store" },
    create: {
      name: "Demo Store",
      slug: "demo-store",
      ownerId: superAdmin.id,
      isVerified: true,
      status: "ACTIVE",
    },
  });
  console.log(`✅ Demo store created: ${demoStore.slug}`);

  // Create products
  console.log("📦 Creating products...");
  for (const product of products) {
    await prisma.product.upsert({
      where: { 
        storeId_externalId: {
          storeId: demoStore.id,
          externalId: product.name.substring(0, 20).replace(/\s+/g, '-').toLowerCase()
        }
      },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        imageUrl: product.imageUrl,
        colors: product.colors,
        tags: product.tags,
        isFeatured: product.isFeatured,
      },
      create: {
        externalId: product.name.substring(0, 20).replace(/\s+/g, '-').toLowerCase(),
        name: product.name,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        imageUrl: product.imageUrl,
        images: product.images,
        colors: product.colors,
        tags: product.tags,
        isFeatured: product.isFeatured,
        storeId: demoStore.id,
        categoryId: (await prisma.category.findFirst({ where: { slug: product.categoryId } }))?.id,
      },
    });
  }
  console.log(`✅ Created ${products.length} products.`);

  console.log("🎉 Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
