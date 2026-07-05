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

    for (const localItem of localItems) {
      const existingDbItem = dbCart.items.find(
        (item) => item.productId === localItem.id,
      );

      if (existingDbItem) {
        await prisma.dbCartItem.update({
          where: { id: existingDbItem.id },
          data: { quantity: existingDbItem.quantity + localItem.quantity },
        });
      } else {
        await prisma.dbCartItem.create({
          data: {
            cartId: dbCart.id,
            productId: localItem.id,
            quantity: localItem.quantity,
          },
        });
      }
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

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

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: false };

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

export async function dbDeleteOrder(orderId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "Пользователь не авторизован" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: "Заказ не найден" };
    }

    if (order.userId !== userId) {
      return { success: false, error: "Нет прав на удаление этого заказа" };
    }

    if (order.status !== "PENDING") {
      return { success: false, error: "Нельзя удалить уже оплаченный заказ" };
    }

    await prisma.order.delete({
      where: { id: orderId },
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка при удалении заказа из БД:", error);
    return { success: false, error: "Ошибка сервера при удалении" };
  }
}
