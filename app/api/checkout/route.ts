import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClient } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, items, totalAmount } = await req.json();

    // Валидация: теперь проверяем имя, почту и наличие товаров
    if (!items || items.length === 0 || !name || !email) {
      return NextResponse.json(
        { error: "Данные заказа неполные" },
        { status: 400 },
      );
    }

    // 1. Пытаемся вытащить ID юзера из серверной сессии
    let userId: string | null = null;
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      userId = session?.user?.id || null;
    } catch (e) {
      userId = null;
    }

    // 2. Создаем черновик заказа в базе данных Prisma
    const order = await prisma.order.create({
      data: {
        totalAmount: totalAmount,
        customerName: name,
        customerEmail: email, // Обязательная почта
        status: "PENDING", // Ожидает оплаты
        userId: userId, // Привяжется к аккаунту или останется null для гостей
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 3. Берем тестовые ключи ЮKassa из .env
    const SHOP_ID = process.env.YOOKASSA_SHOP_ID;
    const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;

    if (!SHOP_ID || !SECRET_KEY) {
      console.error(
        "ОШИБКА: Не настроены YOOKASSA_SHOP_ID или YOOKASSA_SECRET_KEY в .env!",
      );
      return NextResponse.json(
        { error: "Ошибка конфигурации платежного шлюза" },
        { status: 500 },
      );
    }

    // 4. Формируем тело запроса к ЮKassa
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const paymentData = {
      amount: {
        value: `${totalAmount}.00`,
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `${origin}/cart?status=success&orderId=${order.id}`,
      },
      description: `Оплата заказа №${order.id.slice(0, 8)} в VoltPC`,
      metadata: {
        orderId: order.id, // Зашиваем ID заказа для вебхука
      },
    };

    const authBuffer = Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString(
      "base64",
    );

    // Отправляем запрос на сервера ЮKassa с ключом идемпотентности
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authBuffer}`,
        "Idempotence-Key": order.id,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errLog = await response.text();
      console.error("ЮKassa API вернул ошибку:", errLog);
      return NextResponse.json(
        { error: "Не удалось зарегистрировать платеж" },
        { status: 500 },
      );
    }

    const payment = await response.json();

    // 5. Записываем в заказ уникальный paymentId, который выдала ЮKassa
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: payment.id },
    });

    // 6. Возвращаем фронтенду готовую ссылку на оплату
    return NextResponse.json({
      success: true,
      confirmationUrl: payment.confirmation.confirmation_url,
    });
  } catch (error) {
    console.error("Критическая ошибка бэкенда оплаты:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
