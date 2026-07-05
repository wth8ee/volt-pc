import { PrismaClient } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { generateOrderEmailHtml } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "SUCCEEDED" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(
      `🎉 Заказ №${orderId.slice(0, 8)} успешно оплачен через ЮKassa и обновлен в БД!`,
    );

    try {
      // На бесплатном тарифе шлем на ТВОЮ почту в Resend (замени на свою или оставь "onboarding@resend.dev")
      // Когда привяжешь домен, сюда можно будет подставить ультимативно: updatedOrder.customerEmail
      // const targetEmail =
      //   process.env.NODE_ENV === "production"
      //     ? updatedOrder.customerEmail || "onboarding@resend.dev"
      //     : "onboarding@resend.dev";

      const targetEmail = "wth8eeyv2@gmail.com";

      await resend.emails.send({
        from: "VoltPC <onboarding@resend.dev>", // На бесплатном тарифе отправка идет только с этого адреса
        to: targetEmail,
        subject: `Спецификация к заказу №${updatedOrder.id.slice(0, 8).toUpperCase()}`,
        html: generateOrderEmailHtml(updatedOrder), // Вставляем наш строгий HTML-шаблон
      });

      console.log(
        `✉️ Электронный чек успешно отправлен на адрес: ${targetEmail}`,
      );
    } catch (emailError) {
      // Если почта не ушла, мы не ломаем вебхук ЮKassa (ведь деньги-то списались), а просто логируем сбой
      console.error("Ошибка при отправке email-уведомления:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Критическая ошибка вебхука ЮKassa:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
