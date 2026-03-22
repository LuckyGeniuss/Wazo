import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ==========================================
// ГЛОБАЛЬНІ КАТЕГОРІЇ
// ==========================================
const globalCategories = [
  { name: "Смартфони", slug: "electronics-smartphones", emoji: "📱" },
  { name: "Ноутбуки", slug: "electronics-laptops", emoji: "💻" },
  { name: "Аудіо", slug: "electronics-audio", emoji: "🎧" },
  { name: "Розумні годинники", slug: "electronics-wearables", emoji: "⌚" },
  { name: "Взуття", slug: "fashion-shoes", emoji: "👟" },
  { name: "Одяг", slug: "fashion-clothing", emoji: "👕" },
  { name: "Ігрові консолі", slug: "electronics-gaming", emoji: "🎮" },
  { name: "Побутова техніка", slug: "home-appliances", emoji: "🏠" },
  { name: "Кухня", slug: "home-kitchen", emoji: "🍳" },
  { name: "Камери", slug: "electronics-cameras", emoji: "📷" },
  { name: "Меблі", slug: "home-furniture", emoji: "🪑" },
  { name: "Зовнішній одяг", slug: "fashion-outerwear", emoji: "🧥" },
  { name: "Планшети", slug: "electronics-tablets", emoji: "📱" },
  { name: "Розумний дім", slug: "home-smart", emoji: "💡" },
  { name: "Аксесуари", slug: "electronics-accessories", emoji: "🔌" },
  { name: "Спорт", slug: "sports-fitness", emoji: "🏋️" },
];

// ==========================================
// МАГАЗИНИ
// ==========================================
const stores = [
  {
    name: "Epicentr",
    slug: "epicentr",
    description: "Будівельні та господарські товари",
    logo: "https://epicentrk.ua/upload/epicentr_logo.png",
    banner: "https://epicentrk.ua/upload/epicentr_banner.jpg",
    color: "#f97316",
  },
  {
    name: "Rozetka",
    slug: "rozetka",
    description: "Все для дому та офісу",
    logo: "https://static.rozetka.com.ua/assets/logo.png",
    banner: "https://static.rozetka.com.ua/assets/banner.jpg",
    color: "#22c55e",
  },
  {
    name: "Allo",
    slug: "allo",
    description: "Електроніка та побутова техніка",
    logo: "https://allo.ua/images/logo.png",
    banner: "https://allo.ua/images/banner.jpg",
    color: "#ef4444",
  },
  {
    name: "Wazo Fashion",
    slug: "wazo-fashion",
    description: "Модний одяг та взуття",
    logo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    color: "#ec4899",
  },
  {
    name: "iStore",
    slug: "istore",
    description: "Офіційний реселер Apple",
    logo: "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png",
    banner: "https://www.apple.com/v/home/hero__images/overview/hero_iphone_15_pro__f8b3l3v8z2ue_large.jpg",
    color: "#3b82f6",
  },
];

// ==========================================
// ТОВАРИ (100+)
// ==========================================
const productsByStore: Record<string, Array<any>> = {
  epicentr: [
    { name: "Дриль-шурупокрут Bosch GSR 120-Li", price: 2499, compareAtPrice: 2999, stock: 25, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600", tags: ["інструмент", "bosch", "дриль"], category: "home-appliances" },
    { name: "Пилосос Bosch BGS05A220", price: 3999, compareAtPrice: 4499, stock: 15, image: "https://images.unsplash.com/photo-1558317374-a3569683368d?w=600", tags: ["пилосос", "bosch"], category: "home-appliances" },
    { name: "Лобзик електро Bosch GST 65", price: 1899, compareAtPrice: 2199, stock: 30, image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600", tags: ["лобзик", "інструмент"], category: "home-appliances" },
    { name: "Болгарка Makita 9558HNRG", price: 2299, compareAtPrice: 2599, stock: 20, image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600", tags: ["болгарка", "makita"], category: "home-appliances" },
    { name: "Перфоратор Bosch GBH 2-26", price: 4499, compareAtPrice: 4999, stock: 12, image: "https://images.unsplash.com/photo-1581147036317-731c1b93453c?w=600", tags: ["перфоратор", "bosch"], category: "home-appliances" },
    { name: "Фарба фарбувальна 10л", price: 899, compareAtPrice: 1099, stock: 50, image: "https://images.unsplash.com/photo-1562259949-e8e7689de74c?w=600", tags: ["фарба", "фарбування"], category: "home-appliances" },
    { name: "Цвяхи будівельні 1кг", price: 149, compareAtPrice: null, stock: 100, image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600", tags: ["цвяхи", "кріплення"], category: "home-appliances" },
    { name: "Шпатель універсальний", price: 199, compareAtPrice: 249, stock: 80, image: "https://images.unsplash.com/photo-1581147036317-731c1b93453c?w=600", tags: ["шпатель", "інструмент"], category: "home-appliances" },
    { name: "Відро пластикове 10л", price: 89, compareAtPrice: null, stock: 200, image: "https://images.unsplash.com/photo-1585338107529-13afc5f0258a?w=600", tags: ["відро", "господарство"], category: "home-appliances" },
    { name: "Рукавиці робочі", price: 49, compareAtPrice: null, stock: 500, image: "https://images.unsplash.com/photo-1616428753207-3e1e2e5e8a3f?w=600", tags: ["рукавиці", "захист"], category: "home-appliances" },
    { name: "Світильник стельовий LED", price: 599, compareAtPrice: 799, stock: 40, image: "https://images.unsplash.com/photo-1565814329452-e1efa11c4b1c?w=600", tags: ["світильник", "led"], category: "home-smart" },
    { name: "Розетка подовжувач 5м", price: 349, compareAtPrice: 449, stock: 60, image: "https://images.unsplash.com/photo-1558317374-a3569683368d?w=600", tags: ["подовжувач", "електрика"], category: "home-smart" },
    { name: "Котел опалення 24кВт", price: 12999, compareAtPrice: 14999, stock: 5, image: "https://images.unsplash.com/photo-1585338107529-13afc5f0258a?w=600", tags: ["котел", "опалення"], category: "home-appliances" },
    { name: "Змішувач кухонний", price: 1299, compareAtPrice: 1599, stock: 25, image: "https://images.unsplash.com/photo-1584622650111-993a427fbf3a?w=600", tags: ["змішувач", "сантехніка"], category: "home-kitchen" },
    { name: "Унітаз-компакт", price: 3499, compareAtPrice: 3999, stock: 10, image: "https://images.unsplash.com/photo-1584622650111-993a427fbf3a?w=600", tags: ["унітаз", "сантехніка"], category: "home-appliances" },
    { name: "Плитка керамічна 1м²", price: 399, compareAtPrice: 499, stock: 150, image: "https://images.unsplash.com/photo-1584622650111-993a427fbf3a?w=600", tags: ["плитка", "оздоблення"], category: "home-appliances" },
    { name: "Ламінат 1м²", price: 299, compareAtPrice: 349, stock: 200, image: "https://images.unsplash.com/photo-1581147036317-731c1b93453c?w=600", tags: ["ламінат", "підлога"], category: "home-appliances" },
    { name: "Шпаклівка 25кг", price: 349, compareAtPrice: null, stock: 80, image: "https://images.unsplash.com/photo-1581147036317-731c1b93453c?w=600", tags: ["шпаклівка", "суміші"], category: "home-appliances" },
    { name: "Ґрунтовка 10л", price: 449, compareAtPrice: 549, stock: 60, image: "https://images.unsplash.com/photo-1562259949-e8e7689de74c?w=600", tags: ["ґрунтовка", "фарбування"], category: "home-appliances" },
    { name: "Цегла червона 100шт", price: 1899, compareAtPrice: null, stock: 50, image: "https://images.unsplash.com/photo-1590059390239-92b5c0d6a5b5?w=600", tags: ["цегла", "будівництво"], category: "home-appliances" },
  ],
  rozetka: [
    { name: "Apple iPhone 15 Pro Max 256GB", price: 54999, compareAtPrice: 59999, stock: 25, image: "https://images.unsplash.com/photo-1510557880182-3d4d32131838?w=600", tags: ["smartphone", "apple", "premium"], category: "electronics-smartphones" },
    { name: "MacBook Air 15\" M3 2024", price: 62999, compareAtPrice: 65999, stock: 15, image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600", tags: ["laptop", "apple", "m3"], category: "electronics-laptops" },
    { name: "Sony WH-1000XM5", price: 14999, compareAtPrice: 17999, stock: 40, image: "https://images.unsplash.com/photo-1505740420928-5e56c9bdc80f?w=600", tags: ["headphones", "sony", "wireless"], category: "electronics-audio" },
    { name: "Samsung Galaxy Watch 6 Classic", price: 11999, compareAtPrice: null, stock: 30, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600", tags: ["smartwatch", "samsung"], category: "electronics-wearables" },
    { name: "PlayStation 5 Slim Digital", price: 19999, compareAtPrice: 21999, stock: 12, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600", tags: ["gaming", "playstation"], category: "electronics-gaming" },
    { name: "iPad Pro 12.9\" M2 256GB", price: 44999, compareAtPrice: 47999, stock: 20, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600", tags: ["tablet", "ipad", "apple"], category: "electronics-tablets" },
    { name: "Canon EOS R6 Mark II", price: 89999, compareAtPrice: 94999, stock: 5, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600", tags: ["camera", "canon"], category: "electronics-cameras" },
    { name: "Bose QuietComfort Earbuds II", price: 9999, compareAtPrice: 11999, stock: 35, image: "https://images.unsplash.com/photo-1572569023856-3c808a1e81f3?w=600", tags: ["earbuds", "bose"], category: "electronics-audio" },
    { name: "Garmin Fenix 7X Solar", price: 34999, compareAtPrice: 37999, stock: 12, image: "https://images.unsplash.com/photo-1523275335684-37898b61af30?w=600", tags: ["smartwatch", "garmin", "gps"], category: "electronics-wearables" },
    { name: "Sonos Arc Soundbar", price: 39999, compareAtPrice: 42999, stock: 10, image: "https://images.unsplash.com/photo-1543512214-318976d8a718?w=600", tags: ["audio", "sonos"], category: "electronics-audio" },
    { name: "Philips Hue Starter Kit", price: 6999, compareAtPrice: 7999, stock: 30, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600", tags: ["smart home", "philips"], category: "home-smart" },
    { name: "Samsung 55\" QLED TV", price: 29999, compareAtPrice: 34999, stock: 8, image: "https://images.unsplash.com/photo-1593784697956-ec9c07a0e922?w=600", tags: ["tv", "samsung", "qled"], category: "electronics-audio" },
    { name: "Logitech MX Master 3S", price: 3499, compareAtPrice: 3999, stock: 50, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc8c8f9?w=600", tags: ["mouse", "logitech"], category: "electronics-accessories" },
    { name: "Keychron K2 Mechanical", price: 2999, compareAtPrice: 3499, stock: 40, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600", tags: ["keyboard", "mechanical"], category: "electronics-accessories" },
    { name: "Xiaomi Mi Band 8", price: 1499, compareAtPrice: 1799, stock: 100, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600", tags: ["fitness", "xiaomi"], category: "electronics-wearables" },
    { name: "Anker PowerCore 20000", price: 1299, compareAtPrice: 1499, stock: 80, image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600", tags: ["powerbank", "anker"], category: "electronics-accessories" },
    { name: "JBL Flip 6", price: 3999, compareAtPrice: 4499, stock: 45, image: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600", tags: ["speaker", "jbl"], category: "electronics-audio" },
    { name: "GoPro HERO12 Black", price: 16999, compareAtPrice: 18999, stock: 15, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600", tags: ["camera", "gopro"], category: "electronics-cameras" },
    { name: "DJI Mini 4 Pro", price: 34999, compareAtPrice: 37999, stock: 10, image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600", tags: ["drone", "dji"], category: "electronics-cameras" },
    { name: "Kindle Paperwhite 16GB", price: 5999, compareAtPrice: 6499, stock: 25, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600", tags: ["ereader", "kindle"], category: "electronics-tablets" },
  ],
  allo: [
    { name: "Samsung Galaxy S24 Ultra", price: 49999, compareAtPrice: 54999, stock: 20, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600", tags: ["smartphone", "samsung"], category: "electronics-smartphones" },
    { name: "Xiaomi 14 Pro", price: 34999, compareAtPrice: 37999, stock: 25, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=600", tags: ["smartphone", "xiaomi"], category: "electronics-smartphones" },
    { name: "Dyson V15 Detect", price: 29999, compareAtPrice: 34999, stock: 18, image: "https://images.unsplash.com/photo-1558317374-0a4890217124?w=600", tags: ["vacuum", "dyson"], category: "home-appliances" },
    { name: "KitchenAid Artisan Mixer", price: 18999, compareAtPrice: 21999, stock: 10, image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600", tags: ["mixer", "kitchenaid"], category: "home-kitchen" },
    { name: "Breville Barista Express", price: 24999, compareAtPrice: 27999, stock: 14, image: "https://images.unsplash.com/photo-1570554827583-99e01c802462?w=600", tags: ["coffee", "breville"], category: "home-kitchen" },
    { name: "Herman Miller Aeron", price: 54999, compareAtPrice: 59999, stock: 8, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600", tags: ["chair", "herman miller"], category: "home-furniture" },
    { name: "Xiaomi Robot Vacuum X20", price: 14999, compareAtPrice: 16999, stock: 22, image: "https://images.unsplash.com/photo-1518640467707-6811f491ef03?w=600", tags: ["robot", "xiaomi"], category: "home-appliances" },
    { name: "Philips Airfryer XXL", price: 8999, compareAtPrice: 9999, stock: 30, image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=600", tags: ["airfryer", "philips"], category: "home-kitchen" },
    { name: "De'Longhi Magnifica S", price: 12999, compareAtPrice: 14999, stock: 16, image: "https://images.unsplash.com/photo-1570554868487-2a7e5678f8e9?w=600", tags: ["coffee", "delonghi"], category: "home-kitchen" },
    { name: "Tefal OptiGrill Elite", price: 6999, compareAtPrice: 7999, stock: 25, image: "https://images.unsplash.com/photo-1555126634-3232910585f3?w=600", tags: ["grill", "tefal"], category: "home-kitchen" },
    { name: "Bosch Serie 6 Washing Machine", price: 19999, compareAtPrice: 22999, stock: 10, image: "https://images.unsplash.com/photo-1582738491323-980828aa6b93?w=600", tags: ["washing", "bosch"], category: "home-appliances" },
    { name: "LG InstaView Fridge", price: 49999, compareAtPrice: 54999, stock: 5, image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600", tags: ["fridge", "lg"], category: "home-appliances" },
    { name: "Miele Dishwasher", price: 34999, compareAtPrice: 39999, stock: 8, image: "https://images.unsplash.com/photo-1584622650111-993a427fbf3a?w=600", tags: ["dishwasher", "miele"], category: "home-appliances" },
    { name: "Xiaomi Smart Air Purifier 4", price: 5999, compareAtPrice: 6999, stock: 35, image: "https://images.unsplash.com/photo-1585338107529-13afc5f0258a?w=600", tags: ["purifier", "xiaomi"], category: "home-appliances" },
    { name: "Xiaomi Smart Humidifier", price: 2499, compareAtPrice: 2999, stock: 40, image: "https://images.unsplash.com/photo-1585338107529-13afc5f0258a?w=600", tags: ["humidifier", "xiaomi"], category: "home-appliances" },
    { name: "Tefal Ingenio Set 12pcs", price: 4999, compareAtPrice: 5999, stock: 20, image: "https://images.unsplash.com/photo-1584622650111-993a427fbf3a?w=600", tags: ["cookware", "tefal"], category: "home-kitchen" },
    { name: "Ritter Eisseite 9", price: 3999, compareAtPrice: 4499, stock: 15, image: "https://images.unsplash.com/photo-1563805042-7689c9197d10?w=600", tags: ["ice cream", "ritter"], category: "home-kitchen" },
    { name: "Clatronic Microwave", price: 2999, compareAtPrice: 3499, stock: 25, image: "https://images.unsplash.com/photo-1585338107529-13afc5f0258a?w=600", tags: ["microwave", "clatronic"], category: "home-kitchen" },
    { name: "Severin Toaster", price: 1299, compareAtPrice: 1499, stock: 40, image: "https://images.unsplash.com/photo-1584622650111-993a427fbf3a?w=600", tags: ["toaster", "severin"], category: "home-kitchen" },
    { name: "Bosch Thermomix TM6", price: 54999, compareAtPrice: 59999, stock: 6, image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600", tags: ["thermomix", "bosch"], category: "home-kitchen" },
  ],
  "wazo-fashion": [
    { name: "Nike Air Max 270", price: 4999, compareAtPrice: 5999, stock: 60, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", tags: ["shoes", "nike"], category: "fashion-shoes" },
    { name: "Levi's 501 Original Jeans", price: 3499, compareAtPrice: 4299, stock: 80, image: "https://images.unsplash.com/photo-1542272617-08f08630329e?w=600", tags: ["jeans", "levis"], category: "fashion-clothing" },
    { name: "The North Face Nuptse 1996", price: 12999, compareAtPrice: 14999, stock: 25, image: "https://images.unsplash.com/photo-1551488852-080175d275dc?w=600", tags: ["jacket", "north face"], category: "fashion-outerwear" },
    { name: "Adidas Ultraboost 23", price: 6499, compareAtPrice: 7499, stock: 45, image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600", tags: ["running", "adidas"], category: "fashion-shoes" },
    { name: "Patagonia Retro-X Fleece", price: 7999, compareAtPrice: 8999, stock: 35, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600", tags: ["fleece", "patagonia"], category: "fashion-clothing" },
    { name: "Ray-Ban Aviator Classic", price: 4999, compareAtPrice: 5499, stock: 40, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600", tags: ["sunglasses", "rayban"], category: "fashion-accessories" },
    { name: "Casio G-Shock GA-2100", price: 3999, compareAtPrice: 4499, stock: 30, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600", tags: ["watch", "casio"], category: "fashion-accessories" },
    { name: "Herschel Supply Co. Backpack", price: 2499, compareAtPrice: 2999, stock: 50, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", tags: ["backpack", "herschel"], category: "fashion-accessories" },
    { name: "Vans Old Skool", price: 2999, compareAtPrice: 3499, stock: 70, image: "https://images.unsplash.com/photo-1525966222134-fcfaa9d15562?w=600", tags: ["shoes", "vans"], category: "fashion-shoes" },
    { name: "Converse Chuck 70 High Top", price: 3299, compareAtPrice: 3799, stock: 55, image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600", tags: ["shoes", "converse"], category: "fashion-shoes" },
    { name: "Champion Reverse Weave Hoodie", price: 3499, compareAtPrice: 3999, stock: 45, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600", tags: ["hoodie", "champion"], category: "fashion-clothing" },
    { name: "Carhartt WIP Cargo Pants", price: 4499, compareAtPrice: 4999, stock: 35, image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600", tags: ["pants", "carhartt"], category: "fashion-clothing" },
    { name: "Stussy 8 Ball T-Shirt", price: 1499, compareAtPrice: 1799, stock: 80, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", tags: ["tshirt", "stussy"], category: "fashion-clothing" },
    { name: "New Balance 530", price: 3999, compareAtPrice: 4499, stock: 50, image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600", tags: ["shoes", "new balance"], category: "fashion-shoes" },
    { name: "Puma Suede Classic", price: 2799, compareAtPrice: 3299, stock: 60, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600", tags: ["shoes", "puma"], category: "fashion-shoes" },
    { name: "Fila Disruptor II", price: 3199, compareAtPrice: 3699, stock: 45, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600", tags: ["shoes", "fila"], category: "fashion-shoes" },
    { name: "Tommy Hilfiger Polo Shirt", price: 2499, compareAtPrice: 2999, stock: 55, image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600", tags: ["polo", "tommy"], category: "fashion-clothing" },
    { name: "Calvin Klein Jeans Slim Fit", price: 2999, compareAtPrice: 3499, stock: 50, image: "https://images.unsplash.com/photo-1542272617-08f08630329e?w=600", tags: ["jeans", "calvin klein"], category: "fashion-clothing" },
    { name: "Lacoste Classic Polo", price: 3299, compareAtPrice: 3799, stock: 40, image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600", tags: ["polo", "lacoste"], category: "fashion-clothing" },
    { name: "Timberland 6-Inch Premium Boot", price: 6999, compareAtPrice: 7999, stock: 30, image: "https://images.unsplash.com/photo-1520639888713-78db6433a5e8?w=600", tags: ["boots", "timberland"], category: "fashion-shoes" },
  ],
  istore: [
    { name: "iPhone 15 Pro 128GB Natural Titanium", price: 44999, compareAtPrice: 47999, stock: 30, image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600", tags: ["iphone", "apple", "pro"], category: "electronics-smartphones" },
    { name: "iPhone 15 Pro Max 512GB Blue Titanium", price: 64999, compareAtPrice: 69999, stock: 20, image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600", tags: ["iphone", "apple", "pro max"], category: "electronics-smartphones" },
    { name: "MacBook Pro 14\" M3 Pro", price: 79999, compareAtPrice: 84999, stock: 12, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600", tags: ["macbook", "apple", "m3"], category: "electronics-laptops" },
    { name: "MacBook Pro 16\" M3 Max", price: 119999, compareAtPrice: 129999, stock: 8, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600", tags: ["macbook", "apple", "m3 max"], category: "electronics-laptops" },
    { name: "iMac 24\" M3 256GB", price: 54999, compareAtPrice: 57999, stock: 15, image: "https://images.unsplash.com/photo-1527443224154-c4a3925e44e7?w=600", tags: ["imac", "apple", "desktop"], category: "electronics-laptops" },
    { name: "iPad Air 11\" M2 128GB", price: 24999, compareAtPrice: 26999, stock: 25, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600", tags: ["ipad", "apple", "air"], category: "electronics-tablets" },
    { name: "iPad Pro 13\" M4 256GB", price: 54999, compareAtPrice: 59999, stock: 18, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600", tags: ["ipad", "apple", "pro"], category: "electronics-tablets" },
    { name: "Apple Watch Series 9 45mm", price: 16999, compareAtPrice: 18999, stock: 35, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600", tags: ["watch", "apple", "series 9"], category: "electronics-wearables" },
    { name: "Apple Watch Ultra 2", price: 34999, compareAtPrice: 37999, stock: 20, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600", tags: ["watch", "apple", "ultra"], category: "electronics-wearables" },
    { name: "AirPods Pro 2 USB-C", price: 9999, compareAtPrice: 10999, stock: 50, image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600", tags: ["airpods", "apple", "pro"], category: "electronics-audio" },
    { name: "AirPods Max", price: 24999, compareAtPrice: 26999, stock: 25, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600", tags: ["airpods", "apple", "max"], category: "electronics-audio" },
    { name: "AirTag 4-pack", price: 3999, compareAtPrice: 4499, stock: 60, image: "https://images.unsplash.com/photo-1629815859195-d3f79a0b5b3e?w=600", tags: ["airtag", "apple"], category: "electronics-accessories" },
    { name: "Magic Keyboard", price: 4999, compareAtPrice: 5499, stock: 40, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600", tags: ["keyboard", "apple"], category: "electronics-accessories" },
    { name: "Magic Mouse", price: 3499, compareAtPrice: 3999, stock: 45, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc8c8f9?w=600", tags: ["mouse", "apple"], category: "electronics-accessories" },
    { name: "Magic Trackpad", price: 4499, compareAtPrice: 4999, stock: 35, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc8c8f9?w=600", tags: ["trackpad", "apple"], category: "electronics-accessories" },
    { name: "Apple Pencil 2", price: 4999, compareAtPrice: 5499, stock: 40, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600", tags: ["pencil", "apple"], category: "electronics-accessories" },
    { name: "Apple Pencil Pro", price: 5499, compareAtPrice: 5999, stock: 30, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600", tags: ["pencil", "apple", "pro"], category: "electronics-accessories" },
    { name: "Studio Display", price: 54999, compareAtPrice: 59999, stock: 10, image: "https://images.unsplash.com/photo-1527443222417-140c53bb48e8?w=600", tags: ["display", "apple"], category: "electronics-laptops" },
    { name: "Pro Display XDR", price: 179999, compareAtPrice: 199999, stock: 5, image: "https://images.unsplash.com/photo-1527443222417-140c53bb48e8?w=600", tags: ["display", "apple", "pro"], category: "electronics-laptops" },
    { name: "HomePod 2nd Gen", price: 11999, compareAtPrice: 12999, stock: 30, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600", tags: ["homepod", "apple"], category: "electronics-audio" },
  ],
};

// ==========================================
// ГОЛОВНА ФУНКЦІЯ
// ==========================================
async function main() {
  console.log("🌱 Початок seed-ування...");

  // ==========================================
  // 1. SuperAdmin
  // ==========================================
  const adminEmail = process.env.ADMIN_EMAIL || "sergey.varava@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const superAdmin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "SUPERADMIN",
      },
    });
    console.log(`✅ SuperAdmin створено: ${superAdmin.email}`);
  } else {
    console.log(`✅ SuperAdmin вже існує: ${adminEmail}`);
  }

  const superAdmin = await prisma.user.findFirst({
    where: { role: "SUPERADMIN" },
  });

  if (!superAdmin) {
    console.error("❌ SuperAdmin не знайдено. Вихід.");
    return;
  }

  // ==========================================
  // 2. Глобальні категорії
  // ==========================================
  console.log("📁 Створення глобальних категорій...");
  for (const cat of globalCategories) {
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
  console.log(`✅ Створено ${globalCategories.length} глобальних категорій.`);

  // ==========================================
  // 3. Магазини
  // ==========================================
  console.log("🏪 Створення магазинів...");
  const createdStores: Record<string, any> = {};

  for (const store of stores) {
    const created = await prisma.store.upsert({
      where: { slug: store.slug },
      update: {
        name: store.name,
        themeConfig: {
          primaryColor: store.color,
          logo: store.logo,
          banner: store.banner,
        },
      },
      create: {
        name: store.name,
        slug: store.slug,
        ownerId: superAdmin.id,
        isVerified: true,
        status: "ACTIVE",
        themeConfig: {
          primaryColor: store.color,
          logo: store.logo,
          banner: store.banner,
        },
      },
    });
    createdStores[store.slug] = created;
    console.log(`✅ Магазин створено: ${store.name} (${store.slug})`);
  }

  // ==========================================
  // 4. Товари
  // ==========================================
  console.log("📦 Створення товарів...");
  let totalProducts = 0;

  for (const [storeSlug, products] of Object.entries(productsByStore)) {
    const store = createdStores[storeSlug];
    if (!store) continue;

    for (const product of products) {
      const externalId = `${storeSlug}-${product.name.substring(0, 20).replace(/\s+/g, "-").toLowerCase()}`;

      await prisma.product.upsert({
        where: {
          storeId_externalId: {
            storeId: store.id,
            externalId,
          },
        },
        update: {
          name: product.name,
          description: product.description || `Опис для ${product.name}`,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          imageUrl: product.image,
          tags: product.tags,
          isFeatured: product.price > 10000,
        },
        create: {
          externalId,
          name: product.name,
          description: product.description || `Опис для ${product.name}`,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          imageUrl: product.image,
          images: [product.image],
          tags: product.tags,
          isFeatured: product.price > 10000,
          storeId: store.id,
          categoryId: (await prisma.category.findFirst({ where: { slug: product.category } }))?.id || null,
        },
      });
      totalProducts++;
    }
  }

  console.log(`✅ Створено ${totalProducts} товарів.`);

  // ==========================================
  // Підсумки
  // ==========================================
  console.log("\n🎉 Seed-ування завершено!");
  console.log(`📊 Підсумки:`);
  console.log(`   - SuperAdmin: ${superAdmin.email}`);
  console.log(`   - Магазини: ${Object.keys(createdStores).length}`);
  console.log(`   - Товари: ${totalProducts}`);
  console.log(`   - Категорії: ${globalCategories.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Помилка seed-ування:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
