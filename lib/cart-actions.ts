"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";

interface LocalItem {
  id: string;
  quantity: number;
}

export async function mergeCartWithDb(localItems: LocalItem[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Пользователь не авторизован" };
    }
    // 1. Ищем или создаем корзину пользователя в БД
    let dbCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!dbCart) {
      dbCart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // 2. Логика слияния
    for (const localItem of localItems) {
      const existingDbItem = dbCart.items.find(
        (item) => item.productId === localItem.id,
      );

      if (existingDbItem) {
        // Если товар есть и в БД, и на клиенте — берем максимальное количество или складываем (выберем сложение)
        await prisma.dbCartItem.update({
          where: { id: existingDbItem.id },
          data: { quantity: existingDbItem.quantity + localItem.quantity },
        });
      } else {
        // Если товара в БД не было — создаем запись
        await prisma.dbCartItem.create({
          data: {
            cartId: dbCart.id,
            productId: localItem.id,
            quantity: localItem.quantity,
          },
        });
      }
    }

    // 3. Вытаскиваем финальную объединенную корзину со всеми данными продуктов
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Форматируем под структуру нашего фронтенд-Zustand стора
    const formattedItems =
      updatedCart?.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images[0] || "",
        quantity: item.quantity,
      })) || [];

    return { success: true, items: formattedItems };
  } catch (error) {
    console.error("Ошибка слияния корзины:", error);
    return { success: false, error: "Не удалось синхронизировать корзину" };
  }
}

export async function dbUpdateCartItem(productId: string, quantity: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) return { success: false };

    // Ищем корзину
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: false };

    // Обновляем количество или создаем запись, если её не было (метод upsert)
    await prisma.dbCartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      update: { quantity },
      create: { cartId: cart.id, productId, quantity },
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка обновления товара в БД:", error);
    return { success: false };
  }
}

export async function dbRemoveCartItem(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) return { success: false };

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: false };

    // Удаляем конкретный товар из корзины юзера
    await prisma.dbCartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка удаления товара из БД:", error);
    return { success: false };
  }
}

export async function dbClearCart() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) return { success: false };

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: false };

    // Жестко сносим все товары, привязанные к этой корзине в БД
    await prisma.dbCartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка очистки корзины в БД:", error);
    return { success: false };
  }
}

export async function getDbCart() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) return { success: false, items: [] };

    const dbCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    const formattedItems =
      dbCart?.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images[0] || "/gpu1.jpg",
        quantity: item.quantity,
      })) || [];

    return { success: true, items: formattedItems };
  } catch (error) {
    console.error("Ошибка получения корзины из БД:", error);
    return { success: false, items: [] };
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) return { success: false, error: "Заказ не найден" };

    return { success: true, order };
  } catch (error) {
    console.error("Ошибка получения деталей заказа:", error);
    return { success: false, error: "Ошибка сервера" };
  }
}

export async function getDbOrders() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Пользователь не авторизован",
        orders: [],
      };
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, orders };
  } catch (error) {
    console.error("Ошибка получения списка заказов:", error);
    return { success: false, error: "Ошибка сервера", orders: [] };
  }
}
