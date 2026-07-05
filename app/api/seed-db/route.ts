import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    const gpus = await prisma.category.create({
      data: { name: "Видеокарты", slug: "gpus" },
    });

    const cpus = await prisma.category.create({
      data: { name: "Процессоры", slug: "cpus" },
    });

    const ram = await prisma.category.create({
      data: { name: "Оперативная память", slug: "ram" },
    });

    const motherboards = await prisma.category.create({
      data: { name: "Материнские платы", slug: "motherboards" },
    });

    await prisma.product.createMany({
      data: [
        {
          name: "ASUS ROG Strix GeForce RTX 4070 Ti SUPER",
          description:
            "Флагманское охлаждение, экстремальный заводской разгон и RGB подсветка для 2K/4K гейминга.",
          price: 114990,
          brand: "ASUS",
          images: ["/gpu1.jpg"],
          categoryId: gpus.id,
          inStock: true,
          features: { chip: "NVIDIA", vram: "16 ГБ", type: "GDDR6X" },
        },
        {
          name: "GIGABYTE AMD Radeon RX 7800 XT Gaming OC",
          description:
            "Отличная производительность в играх на архитектуре RDNA 3, массивный радиатор Windforce.",
          price: 68990,
          brand: "GIGABYTE",
          images: ["/gpu2.png"],
          categoryId: gpus.id,
          inStock: true,
          features: { chip: "AMD", vram: "16 ГБ", type: "GDDR6" },
        },
        {
          name: "MSI GeForce RTX 4060 Ti GAMING X",
          description:
            "Тихая и энергоэффективная видеокарта для комфортного гейминга в Full HD на ультра-настройках.",
          price: 52490,
          brand: "MSI",
          images: ["/gpu3.jpg"],
          categoryId: gpus.id,
          inStock: true,
          features: { chip: "NVIDIA", vram: "8 ГБ", type: "GDDR6X" },
        },
        {
          name: "ASUS Dual GeForce RTX 4070 SUPER EVO",
          description:
            "Компактная двухвентиляторная видеокарта, идеально подходящая для сборки в небольших корпусах.",
          price: 79990,
          brand: "ASUS",
          images: ["/gpu4.jpg"],
          categoryId: gpus.id,
          inStock: true,
          features: { chip: "NVIDIA", vram: "12 ГБ", type: "GDDR6X" },
        },
        {
          name: "GIGABYTE GeForce RTX 4090 GAMING OC",
          description:
            "Бескомпромиссная мощность для игр в 4K и работы с нейросетями. Самый мощный чип на рынке.",
          price: 249990,
          brand: "GIGABYTE",
          images: ["/gpu5.jpg"],
          categoryId: gpus.id,
          inStock: false,
          features: { chip: "NVIDIA", vram: "24 ГБ", type: "GDDR6X" },
        },

        {
          name: "Intel Core i7-14700K OEM",
          description:
            "Мощный 20-ядерный гибридный процессор для тяжелого рендеринга, стриминга и игр.",
          price: 49990,
          brand: "Intel",
          images: ["/cpu1.jpg"],
          categoryId: cpus.id,
          inStock: true,
          features: { socket: "LGA1700", cores: "20", threads: "28" },
        },
        {
          name: "AMD Ryzen 7 7800X3D BOX",
          description:
            "Абсолютный лидер в играх благодаря революционному увеличенному кэшу 3D V-Cache.",
          price: 46500,
          brand: "AMD",
          images: ["/cpu2.jpg"],
          categoryId: cpus.id,
          inStock: true,
          features: { socket: "AM5", cores: "8", threads: "16" },
        },
        {
          name: "Intel Core i5-14400F BOX",
          description:
            "Народный 10-ядерный процессор, идеальная сбалансированная база для игровой сборки среднего уровня.",
          price: 21490,
          brand: "Intel",
          images: ["/cpu3.jpg"],
          categoryId: cpus.id,
          inStock: true,
          features: { socket: "LGA1700", cores: "10", threads: "16" },
        },
        {
          name: "AMD Ryzen 5 7600X OEM",
          description:
            "Шестиядерный чип на новой архитектуре Zen 4 с высокой частотой на одно ядро.",
          price: 23990,
          brand: "AMD",
          images: ["/cpu4.jpg"],
          categoryId: cpus.id,
          inStock: true,
          features: { socket: "AM5", cores: "6", threads: "12" },
        },
        {
          name: "Intel Core i9-14900K BOX",
          description:
            "Экстремальный флагман десктопной линейки Intel. 24 ядра для ультимативных задач.",
          price: 69990,
          brand: "Intel",
          images: ["/cpu5.jpg"],
          categoryId: cpus.id,
          inStock: false,
          features: { socket: "LGA1700", cores: "24", threads: "32" },
        },

        {
          name: "Kingston FURY Beast DDR5 32GB (2x16GB) 6000MHz",
          description:
            "Высокоскоростной комплект памяти с поддержкой профилей Intel XMP и AMD Expo.",
          price: 15490,
          brand: "Kingston",
          images: ["/ram1.jpg"],
          categoryId: ram.id,
          inStock: true,
          features: { type: "DDR5", capacity: "32 ГБ", speed: "6000 МГц" },
        },
        {
          name: "Corsair Vengeance RGB DDR5 32GB (2x16GB) 6400MHz",
          description:
            "Отборные чипы памяти с премиальной настраиваемой RGB подсветкой через iCUE.",
          price: 18990,
          brand: "Corsair",
          images: ["/ram2.jpg"],
          categoryId: ram.id,
          inStock: true,
          features: { type: "DDR5", capacity: "32 ГБ", speed: "6400 МГц" },
        },
        {
          name: "Kingston FURY Renegade DDR4 16GB (2x8GB) 3600MHz",
          description:
            "Низкие тайминги и максимальная стабильность для систем на базе памяти прошлых поколений.",
          price: 6490,
          brand: "Kingston",
          images: ["/ram3.jpg"],
          categoryId: ram.id,
          inStock: true,
          features: { type: "DDR4", capacity: "16 ГБ", speed: "3600 МГц" },
        },
        {
          name: "G.Skill TRIDENT Z5 RGB DDR5 64GB (2x32GB) 6000MHz",
          description:
            "Огромный объем высокоскоростной памяти для тяжелого видеомонтажа и 3D моделирования.",
          price: 29990,
          brand: "G.Skill",
          images: ["/ram4.jpg"],
          categoryId: ram.id,
          inStock: true,
          features: { type: "DDR5", capacity: "64 ГБ", speed: "6000 МГц" },
        },
        {
          name: "Corsair Dominator Titanium DDR5 32GB (2x16GB) 7200MHz",
          description:
            "Лимитированная оверклокерская память со сменными верхними элементами радиатора.",
          price: 26990,
          brand: "Corsair",
          images: ["/ram5.jpg"],
          categoryId: ram.id,
          inStock: false,
          features: { type: "DDR5", capacity: "32 ГБ", speed: "7200 МГц" },
        },

        {
          name: "ASUS ROG STRIX Z790-E GAMING WIFI",
          description:
            "Премиальная плата для процессоров Intel с мощнейшей подсистемой питания и поддержкой PCIe 5.0.",
          price: 48990,
          brand: "ASUS",
          images: ["/mobo1.jpg"],
          categoryId: motherboards.id,
          inStock: true,
          features: { socket: "LGA1700", chipset: "Intel Z790", form: "ATX" },
        },
        {
          name: "GIGABYTE B650 AORUS ELITE AX",
          description:
            "Отличная сбалансированная плата для сокета AM5 с радиаторами на M.2 слотах и встроенным Wi-Fi.",
          price: 24490,
          brand: "GIGABYTE",
          images: ["/mobo2.jpg"],
          categoryId: motherboards.id,
          inStock: true,
          features: { socket: "AM5", chipset: "AMD B650", form: "ATX" },
        },
        {
          name: "MSI MAG B760 TOMAHAWK WIFI",
          description:
            "Надежная и строгая материнская плата без лишней подсветки, выбор миллионов геймеров.",
          price: 19990,
          brand: "MSI",
          images: ["/mobo3.jpg"],
          categoryId: motherboards.id,
          inStock: true,
          features: { socket: "LGA1700", chipset: "Intel B760", form: "ATX" },
        },
        {
          name: "ASUS TUF GAMING B650-PLUS",
          description:
            "Плата повышенной надежности по военным стандартам TUF для долговременной стабильной работы.",
          price: 21890,
          brand: "ASUS",
          images: ["/mobo4.jpg"],
          categoryId: motherboards.id,
          inStock: true,
          features: { socket: "AM5", chipset: "AMD B650", form: "ATX" },
        },
        {
          name: "MSI MPG X670E CARBON WIFI",
          description:
            "Экстремальный чипсет для разгона старших процессоров Ryzen 9, усиленные стальные слоты.",
          price: 39990,
          brand: "MSI",
          images: ["/mobo5.jpg"],
          categoryId: motherboards.id,
          inStock: true,
          features: { socket: "AM5", chipset: "AMD X670E", form: "ATX" },
        },
        {
          name: "ASUS ROG MAXIMUS Z790 HERO",
          description:
            "Ультимативное оверклокерское решение для топовых кастомных сборок с водяным охлаждением.",
          price: 74990,
          brand: "ASUS",
          images: ["/mobo6.jpg"],
          categoryId: motherboards.id,
          inStock: false,
          features: { socket: "LGA1700", chipset: "Intel Z790", form: "ATX" },
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "База данных VoltPC успешно наполнена товарами!",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 550 },
    );
  }
}
