import { PrismaClient } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Проверяем тип события от ЮKassa
    // Нас интересует только успешный платеж
    if (body.event !== "payment.succeeded") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const paymentObject = body.object;

    // 2. Вытаскиваем ID заказа из метаданных, которые мы зашили на этапе checkout
    const orderId = paymentObject.metadata?.orderId;

    if (!orderId) {
      console.error("Вебхук ЮKassa: В метаданных платежа не найден orderId!");
      return NextResponse.json(
        { error: "Missing orderId in metadata" },
        { status: 400 },
      );
    }

    // 3. Ищем заказ в нашей базе данных Prisma
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.error(`Вебхук ЮKassa: Заказ с ID ${orderId} не найден в БД!`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Безопасность: Проверяем, совпадает ли сумма платежа с суммой заказа в нашей БД
    const paymentAmount = Math.round(parseFloat(paymentObject.amount.value));
    if (paymentAmount !== order.totalAmount) {
      console.error(
        `ВНИМАНИЕ: Сумма платежа (${paymentAmount}₽) не совпадает с суммой заказа (${order.totalAmount}₽)!`,
      );
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // 5. ЖЕЛЕЗНЫЙ АПДЕЙТ: Меняем статус заказа на Успешно Оплачен
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "SUCCEEDED" },
    });

    console.log(
      `🎉 Заказ №${orderId.slice(0, 8)} успешно оплачен через ЮKassa и обновлен в БД!`,
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Критическая ошибка вебхука ЮKassa:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
