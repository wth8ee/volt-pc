import React from "react";
import Link from "next/link";
import { getDbOrders } from "@/lib/cart-actions";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  ShoppingBag,
} from "lucide-react";
import DeleteOrderButton from "@/components/order/DeleteOrderButton";

export default async function OrdersPage() {
  const res = await getDbOrders();

  if (!res.success) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-white text-zinc-950 flex flex-col items-center justify-center text-center p-4 selection:bg-zinc-950 selection:text-white">
        <div className="h-12 w-12 rounded-none bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-950 mb-4">
          <ShieldAlert className="h-5 w-5 stroke-[1.5]" />
        </div>
        <h2 className="text-base font-bold uppercase tracking-tight mb-1">
          Доступ ограничен
        </h2>
        <p className="text-xs text-zinc-400 max-w-xs mb-8 font-normal leading-relaxed">
          Пожалуйста, авторизуйтесь в вашем профиле для просмотра истории
          документов и оплаченных спецификаций.
        </p>
        <Link
          href="/sign-in"
          className="px-5 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-none text-[10px] font-black uppercase tracking-widest transition-colors active:scale-[0.98]"
        >
          Войти в профиль
        </Link>
      </main>
    );
  }

  const orders = res.orders || [];

  if (orders.length === 0) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-white text-zinc-950 flex flex-col items-center justify-center text-center p-4 selection:bg-zinc-950 selection:text-white">
        <div className="h-12 w-12 rounded-none bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4">
          <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
        </div>
        <h2 className="text-base font-bold uppercase tracking-tight mb-1">
          Архив документов пуст
        </h2>
        <p className="text-xs text-zinc-400 max-w-xs mb-8 font-normal leading-relaxed">
          Все ваши сформированные спецификации и подтвержденные платежи будут
          аккуратно каталогизированы на этой странице.
        </p>
        <Link
          href="/"
          className="px-5 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-none text-[10px] font-black uppercase tracking-widest transition-colors active:scale-[0.98]"
        >
          Перейти в каталог
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-50 py-12 px-4 sm:px-6 selection:bg-zinc-950 selection:text-white">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3 stroke-[1.8]" />
          <span>Назад в каталог</span>
        </Link>

        <h1 className="text-xl font-normal text-zinc-950 tracking-tight uppercase mb-2">
          Профиль /{" "}
          <span className="text-zinc-400 font-light lowercase">
            история заказов
          </span>
        </h1>
        <p className="text-xs text-zinc-400 font-normal mb-10">
          Просмотр спецификаций, отслеживание этапов сборки и статусов
          документов.
        </p>

        <div className="space-y-8">
          {orders.map((order: any) => {
            const isPaid = order.status === "SUCCEEDED";
            return (
              <div
                key={order.id}
                className="bg-white border border-zinc-200 p-6 md:p-8 space-y-6 hover:shadow-sm transition-all duration-200 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${
                    isPaid ? "bg-zinc-950" : "bg-zinc-300"
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 text-xs font-medium text-zinc-500">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-black text-zinc-400 tracking-widest block">
                      Номер документа
                    </span>
                    <span className="text-zinc-950 font-mono font-bold text-sm">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2 sm:text-right">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-black text-zinc-400 tracking-widest block">
                        Оформлен
                      </span>
                      <span className="text-zinc-900 font-mono">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1 sm:text-right">
                      <span className="text-[9px] uppercase font-black text-zinc-400 tracking-widest block">
                        Текущий статус
                      </span>
                      {isPaid ? (
                        <span className="inline-flex items-center text-white font-black text-[9px] uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-none">
                          Оплачен
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-zinc-500 font-bold text-[9px] uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-none border border-zinc-200/60">
                          Ожидает оплаты
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 py-1">
                  <div className="border-t border-l border-zinc-200">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 bg-white border-r border-b border-zinc-200 p-3.5"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-9 w-9 bg-white rounded-none p-0.5 shrink-0 flex items-center justify-center border border-zinc-100 mix-blend-multiply">
                            <img
                              src={
                                item.product.images[0] || item.product.images
                              }
                              alt={item.product.name}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-medium text-zinc-900 truncate pr-4">
                              {item.product.name}
                            </h4>
                            <span className="text-[10px] text-zinc-400 font-mono font-normal">
                              {item.quantity} шт. ×{" "}
                              {item.price.toLocaleString("ru-RU")} ₽
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-zinc-950 font-mono shrink-0">
                          {(item.price * item.quantity).toLocaleString("ru-RU")}{" "}
                          ₽
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                    Итоговая стоимость спецификации:
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-zinc-950 font-mono tracking-tight">
                      {order.totalAmount.toLocaleString("ru-RU")} ₽
                    </span>

                    {!isPaid && (
                      <>
                        <DeleteOrderButton orderId={order.id} />
                        <Link
                          href={`/cart?status=success&orderId=${order.id}`}
                          className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-[9px] uppercase tracking-widest rounded-none transition-colors active:scale-[0.98]"
                        >
                          Оплатить заказ
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
