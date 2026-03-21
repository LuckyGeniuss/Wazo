import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Продукти для Epicentr (будівельні товари) - 10 одиниць
const epicentrProducts = [
  {
    name: "Перфоратор Bosch Professional GBH 2-26",
    description: "Потужний перфоратор з продуктивністю 2.7 Дж, швидкістю 900 об/хв та системою віброзахисту.",
    price: 4299,
    compareAtPrice: 4999,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600&auto=format&fit=crop",
    colors: ["Blue", "Black"],
    tags: ["інструменти", "перфоратор", "bosch", "будівництво"],
    isFeatured: true,
    categorySlug: "tools-perforators",
  },
  {
    name: "Цегла повнотіла червона М100",
    description: "Міцна будівельна цегла для зовнішніх та внутрішніх робіт. Розмір 250x120x65 мм.",
    price: 12,
    compareAtPrice: 15,
    stock: 5000,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop",
    colors: ["Red"],
    tags: ["будматеріали", "цегла", "будівництво"],
    isFeatured: true,
    categorySlug: "building-materials",
  },
  {
    name: "Диван кутовий Modern Comfort",
    description: "Затишний кутовий диван з м'якою оббивкою, розкладним механізмом та ящиком для білизни.",
    price: 18999,
    compareAtPrice: 22999,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
    colors: ["Gray", "Beige", "Blue"],
    tags: ["меблі", "диван", "вітальня"],
    isFeatured: true,
    categorySlug: "home-furniture",
  },
  {
    name: "Ванна акрилова Luxe 170x75",
    description: "Сучасна акрилова ванна з ергономічним дизайном, гідромасажною системою та антибактеріальним покриттям.",
    price: 8999,
    compareAtPrice: 10999,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop",
    colors: ["White"],
    tags: ["сантехніка", "ванна", "акрилова"],
    isFeatured: true,
    categorySlug: "plumbing-bathtubs",
  },
  {
    name: "Лампа світлодіодна розумна Philips Hue",
    description: "Розумна LED лампа з можливістю зміни кольору, віддаленим керуванням та голосовим управлінням.",
    price: 1299,
    compareAtPrice: 1599,
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=600&auto=format&fit=crop",
    colors: ["White"],
    tags: ["електрика", "лампи", "розумний дім"],
    isFeatured: false,
    categorySlug: "electrical-lighting",
  },
  {
    name: "Двері вхідні металеві Guardian",
    description: "Міцні вхідні двері з потрійним замком, шумоізоляцією та порошковим покриттям.",
    price: 12999,
    compareAtPrice: 14999,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c5fbad23313?q=80&w=600&auto=format&fit=crop",
    colors: ["Brown", "Black", "Gray"],
    tags: ["двері", "вхідні", "металеві"],
    isFeatured: true,
    categorySlug: "doors-entrance",
  },
  {
    name: "Вікно пластикове Rehau 1200x1400",
    description: "Енергозберігаюче вікно з 5-камерним профілем, потрійним склом та мікропровітрюванням.",
    price: 6499,
    compareAtPrice: 7499,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1464082354059-27db6ce50048?q=80&w=600&auto=format&fit=crop",
    colors: ["White"],
    tags: ["вікна", "пластикові", "rehau"],
    isFeatured: true,
    categorySlug: "windows-plastic",
  },
  {
    name: "Плитка керамічна Marble Style 60x60",
    description: "Підлогова плитка з імітацією мармуру, стійкістю до зношування та ковзання.",
    price: 549,
    compareAtPrice: 649,
    stock: 500,
    imageUrl: "https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?q=80&w=600&auto=format&fit=crop",
    colors: ["White", "Gray", "Beige"],
    tags: ["плитка", "кераміка", "підлогова"],
    isFeatured: false,
    categorySlug: "tiles-floor",
  },
  {
    name: "Фарба інтер'єрна Tikkurila Harmony 9л",
    description: "Матова фарба для внутрішніх робіт, стійка до миття, з низьким вмістом ЛОС.",
    price: 1899,
    compareAtPrice: 2199,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    colors: ["White", "Gray", "Beige", "Blue"],
    tags: ["фарба", "інтер'єр", "tikkurila"],
    isFeatured: false,
    categorySlug: "paint-interior",
  },
  {
    name: "Дриль-шурупокрут Bosch GSR 18V-55",
    description: "Акумуляторний дриль з крутним моментом 55 Нм, 2 швидкостями та LED-підсвіткою.",
    price: 3499,
    compareAtPrice: 3999,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600&auto=format&fit=crop",
    colors: ["Blue", "Black"],
    tags: ["інструменти", "дриль", "шурупокрут", "bosch"],
    isFeatured: true,
    categorySlug: "tools-drills",
  },
];

// 20 реалістичних продуктів для інших магазинів
const productTemplates = [
  {
    name: "Apple iPhone 15 Pro Max 256GB",
    description: "Останній флагман Apple з титановим корпусом, потужним процесором A17 Pro та професійною камерою 48 МП.",
    price: 54999,
    compareAtPrice: 59999,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop",
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    tags: ["smartphone", "apple", "premium", "5g"],
    isFeatured: true,
    categorySlug: "electronics-smartphones",
  },
  {
    name: "MacBook Air 15\" M3 2024",
    description: "Надтонкий і потужний ноутбук з новітнім чіпом M3, 15-дюймовим дисплеєм Liquid Retina та до 18 годин роботи.",
    price: 62999,
    compareAtPrice: 65999,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    colors: ["Midnight", "Starlight", "Silver", "Space Gray"],
    tags: ["laptop", "apple", "m3", "ultrabook"],
    isFeatured: true,
    categorySlug: "electronics-laptops",
  },
  {
    name: "Sony WH-1000XM5",
    description: "Преміальні бездротові навушники з найкращим шумозаглушенням на ринку, 30 годин автономності та кришталево чистим звуком.",
    price: 14999,
    compareAtPrice: 17999,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop",
    colors: ["Black", "Silver", "Midnight Blue"],
    tags: ["headphones", "sony", "wireless", "noise-cancelling"],
    isFeatured: true,
    categorySlug: "electronics-audio",
  },
  {
    name: "Samsung Galaxy Watch 6 Classic",
    description: "Розумний годинник з обертовим безелем, моніторингом здоров'я 24/7, GPS та до 40 годин роботи.",
    price: 11999,
    compareAtPrice: null,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop",
    colors: ["Black", "Silver"],
    tags: ["smartwatch", "samsung", "fitness", "wearable"],
    isFeatured: true,
    categorySlug: "electronics-wearables",
  },
  {
    name: "Nike Air Max 270",
    description: "Класичні кросівки з максимальною амортизацією, дихаючим сітчастим верхом та культовим дизайном.",
    price: 4999,
    compareAtPrice: 5999,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    colors: ["Red", "Black", "White", "Blue"],
    tags: ["shoes", "nike", "sneakers", "sport"],
    isFeatured: true,
    categorySlug: "fashion-shoes",
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Легендарні джинси прямого крою з класичною посадкою. Оригінальна бавовна вінтажного якості.",
    price: 3499,
    compareAtPrice: 4299,
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1542272617-08f08630329e?q=80&w=600&auto=format&fit=crop",
    colors: ["Blue", "Black", "Stonewash"],
    tags: ["jeans", "levis", "denim", "classic"],
    isFeatured: false,
    categorySlug: "fashion-clothing",
  },
  {
    name: "PlayStation 5 Slim Digital Edition",
    description: "Оновлена компактна версія консолі PS5 без дисководу. 825 ГБ SSD, 4K 120Hz, Ray Tracing.",
    price: 19999,
    compareAtPrice: 21999,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1606144042616-b2a46e5b5663?q=80&w=600&auto=format&fit=crop",
    colors: ["White"],
    tags: ["gaming", "playstation", "console", "sony"],
    isFeatured: true,
    categorySlug: "electronics-gaming",
  },
  {
    name: "Dyson V15 Detect Absolute",
    description: "Потужний бездротовий пилосос з лазерною технологією виявлення пилу та розумною системою очищення.",
    price: 29999,
    compareAtPrice: 34999,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1558317374-a3569683368d?q=80&w=600&auto=format&fit=crop",
    colors: ["Nickel/Iron"],
    tags: ["home", "dyson", "vacuum", "cleaning"],
    isFeatured: true,
    categorySlug: "home-appliances",
  },
  {
    name: "KitchenAid Artisan Stand Mixer",
    description: "Професійний планетарний міксер потужністю 300 Вт. 10 швидкостей, вінтажний дизайн.",
    price: 18999,
    compareAtPrice: 21999,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?q=80&w=600&auto=format&fit=crop",
    colors: ["Empire Red", "Onyx Black", "White", "Pistachio"],
    tags: ["kitchen", "mixer", "cooking", "baking"],
    isFeatured: false,
    categorySlug: "home-kitchen",
  },
  {
    name: "Canon EOS R6 Mark II Body",
    description: "Повнокадрова бездзеркальна камера 24.2 МП, 4K 60fps відео, стабілізація 8 стопів.",
    price: 89999,
    compareAtPrice: 94999,
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    colors: ["Black"],
    tags: ["camera", "canon", "photography", "fullframe"],
    isFeatured: true,
    categorySlug: "electronics-cameras",
  },
  {
    name: "Herman Miller Aeron Chair",
    description: "Ергономічне офісне крісло преміум-класу з сітчастою спинкою та повним налаштуванням.",
    price: 54999,
    compareAtPrice: 59999,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600&auto=format&fit=crop",
    colors: ["Graphite", "Carbon"],
    tags: ["furniture", "chair", "office", "ergonomic"],
    isFeatured: true,
    categorySlug: "home-furniture",
  },
  {
    name: "Bose QuietComfort Earbuds II",
    description: "Бездротові навушники-краплі з персональним шумозаглушенням та 6 годинами роботи.",
    price: 9999,
    compareAtPrice: 11999,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf07499724a?q=80&w=600&auto=format&fit=crop",
    colors: ["Black", "White", "Soapstone"],
    tags: ["earbuds", "bose", "wireless", "noise-cancelling"],
    isFeatured: false,
    categorySlug: "electronics-audio",
  },
  {
    name: "The North Face Nuptse 1996 Jacket",
    description: "Легендарна пуховик-куртка з водовідштовхувальним покриттям та наповнювачем 700-fill goose down.",
    price: 12999,
    compareAtPrice: 14999,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1551488852-080175d275dc?q=80&w=600&auto=format&fit=crop",
    colors: ["Black", "Navy", "Red", "Yellow"],
    tags: ["jacket", "north face", "winter", "outdoor"],
    isFeatured: true,
    categorySlug: "fashion-outerwear",
  },
  {
    name: "iPad Pro 12.9\" M2 256GB WiFi",
    description: "Потужний планшет з рідкісно-земельним дисплеєм Mini-LED, чіпом M2 та підтримкою Apple Pencil 2.",
    price: 44999,
    compareAtPrice: 47999,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop",
    colors: ["Space Gray", "Silver"],
    tags: ["tablet", "ipad", "apple", "pro"],
    isFeatured: true,
    categorySlug: "electronics-tablets",
  },
  {
    name: "Adidas Ultraboost 23",
    description: "Бігові кросівки з технологією Boost для максимального повернення енергії та Primeknit+ верху.",
    price: 6499,
    compareAtPrice: 7499,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop",
    colors: ["Black", "White", "Blue", "Grey"],
    tags: ["running", "adidas", "sneakers", "boost"],
    isFeatured: false,
    categorySlug: "fashion-shoes",
  },
  {
    name: "Philips Hue White & Color Starter Kit",
    description: "Розумне освітлення з 4 лампами E27 та містком. 16 мільйонів кольорів, голосове керування.",
    price: 6999,
    compareAtPrice: 7999,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    colors: ["Multicolor"],
    tags: ["smart home", "philips", "lighting", "hue"],
    isFeatured: false,
    categorySlug: "home-smart",
  },
  {
    name: "Garmin Fenix 7X Solar",
    description: "Топографічний GPS-годинник для пригод з сонячним заряджанням, 37 днями автономності та сапфіровим склом.",
    price: 34999,
    compareAtPrice: 37999,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop",
    colors: ["Black", "Titanium"],
    tags: ["smartwatch", "garmin", "gps", "outdoor"],
    isFeatured: true,
    categorySlug: "electronics-wearables",
  },
  {
    name: "Breville Barista Express Espresso Machine",
    description: "Напівпрофесійна кавова машина з вбудованою млинкою, 15 бар тиску та PID-контролем температури.",
    price: 24999,
    compareAtPrice: 27999,
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1570554827583-99e01c802462?q=80&w=600&auto=format&fit=crop",
    colors: ["Stainless Steel", "Black Sesame"],
    tags: ["coffee", "espresso", "kitchen", "breville"],
    isFeatured: true,
    categorySlug: "home-kitchen",
  },
  {
    name: "Sonos Arc Soundbar",
    description: "Преміальна звукова панель з Dolby Atmos, розумним еквалайзером та голосовим керуванням.",
    price: 39999,
    compareAtPrice: 42999,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=600&auto=format&fit=crop",
    colors: ["Black", "White"],
    tags: ["audio", "sonos", "soundbar", "dolby atmos"],
    isFeatured: true,
    categorySlug: "electronics-audio",
  },
  {
    name: "Patagonia Classic Retro-X Fleece",
    description: "Вінтажна флисова кофта з 47% перероблених матеріалів. Вітрозахисна, тепла, вічно модна.",
    price: 7999,
    compareAtPrice: 8999,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
    colors: ["Navy", "Oatmeal", "Black", "Red"],
    tags: ["fleece", "patagonia", "outdoor", "sustainable"],
    isFeatured: false,
    categorySlug: "fashion-clothing",
  },
];

// Конфігурація магазинів
const storesConfig = [
  {
    name: "Rozetka",
    slug: "rozetka",
    description: "Провідний онлайн-магазин електроніки та побутової техніки в Україні",
    themeConfig: {
      primaryColor: "#00a651",
      secondaryColor: "#ffc107",
      fontFamily: "Inter",
      borderRadius: "md",
    },
  },
  {
    name: "Epicentr",
    slug: "epicentr",
    description: "Гіпермаркет для дому, саду та будівництва",
    themeConfig: {
      primaryColor: "#ff6600",
      secondaryColor: "#0066cc",
      fontFamily: "Inter",
      borderRadius: "md",
    },
  },
  {
    name: "Allo",
    slug: "allo",
    description: "Сучасна техніка та електроніка для вашого життя",
    themeConfig: {
      primaryColor: "#ff3366",
      secondaryColor: "#333333",
      fontFamily: "Inter",
      borderRadius: "lg",
    },
  },
  {
    name: "Wazo Fashion",
    slug: "wazo-fashion",
    description: "Модний одяг та взуття від провідних брендів",
    themeConfig: {
      primaryColor: "#ec4899",
      secondaryColor: "#8b5cf6",
      fontFamily: "Inter",
      borderRadius: "full",
    },
  },
  {
    name: "TechnoStore",
    slug: "technostore",
    description: "Ваш надійний партнер у світі технологій",
    themeConfig: {
      primaryColor: "#2563eb",
      secondaryColor: "#64748b",
      fontFamily: "Inter",
      borderRadius: "md",
    },
  },
];

async function main() {
  console.log("🌱 Start seeding stores with products...");

  // Отримуємо або створюємо SuperAdmin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  let superAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    superAdmin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "SUPERADMIN",
      },
    });
    console.log(`✅ SuperAdmin created: ${superAdmin.email}`);
  }

  // Отримуємо категорії
  const categories = await prisma.category.findMany({
    where: { isGlobal: true },
  });

  const categoryMap = new Map(categories.map((cat) => [cat.slug || "", cat.id]));

  // Створюємо магазини
  for (const storeConfig of storesConfig) {
    console.log(`🏪 Створення магазину: ${storeConfig.name}`);

    // Створюємо або отримуємо магазин
    const store = await prisma.store.upsert({
      where: { slug: storeConfig.slug },
      update: {
        name: storeConfig.name,
        themeConfig: storeConfig.themeConfig,
      },
      create: {
        name: storeConfig.name,
        slug: storeConfig.slug,
        ownerId: superAdmin.id,
        isVerified: true,
        status: "ACTIVE",
        themeConfig: storeConfig.themeConfig as any,
        rating: 4.5 + Math.random() * 0.5,
        reviewsCount: Math.floor(Math.random() * 1000),
      },
    });

    console.log(`✅ Магазин створено: ${store.slug} (ID: ${store.id})`);

    // Вибір продуктів для магазину
    const productsForStore = storeConfig.slug === "epicentr" ? epicentrProducts : productTemplates;

    // Створюємо продукти для магазину
    console.log(`📦 Створення продуктів для ${store.name}...`);
    for (const template of productsForStore) {
      const externalId = `${store.slug}-${template.name.substring(0, 20).replace(/\s+/g, "-").toLowerCase()}`;

      // Отримуємо categoryId за slug
      const categoryId = categoryMap.get(template.categorySlug);

      await prisma.product.upsert({
        where: {
          storeId_externalId: {
            storeId: store.id,
            externalId,
          },
        },
        update: {
          name: template.name,
          description: template.description,
          price: template.price,
          compareAtPrice: template.compareAtPrice,
          stock: template.stock,
          imageUrl: template.imageUrl,
          colors: template.colors,
          tags: template.tags,
          isFeatured: template.isFeatured,
          categoryId: categoryId || undefined,
        },
        create: {
          externalId,
          name: template.name,
          description: template.description,
          price: template.price,
          compareAtPrice: template.compareAtPrice || undefined,
          stock: template.stock,
          imageUrl: template.imageUrl,
          images: [],
          colors: template.colors,
          tags: template.tags,
          isFeatured: template.isFeatured,
          storeId: store.id,
          categoryId: categoryId || undefined,
        },
      });
    }

    console.log(`✅ Створено ${productsForStore.length} продуктів для ${store.name}`);
  }

  console.log("🎉 Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
