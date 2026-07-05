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

export default async function OrdersPage() {
  // Вызываем Server Action напрямую при рендере страницы на сервере
  const res = await getDbOrders();

  if (!res.success) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center text-center p-4">
        <ShieldAlert className="h-10 w-10 text-red-500 mb-4" />
        <h2 className="text-xl font-black text-white mb-1">Доступ ограничен</h2>
        <p className="text-xs text-zinc-500 max-w-xs mb-6 font-semibold">
          Войдите в свой аккаунт VoltPC, чтобы просматривать историю ваших
          заказов.
        </p>
        <Link
          href="/login"
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          Войти в аккаунт
        </Link>
      </main>
    );
  }

  const orders = res.orders || [];

  if (orders.length === 0) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center text-center p-4">
        <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-xl">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-black text-white mb-1">
          У вас пока нет заказов
        </h2>
        <p className="text-xs text-zinc-500 max-w-xs mb-6 font-semibold">
          Все собранные комплектующие и оплаченные заказы будут отображаться на
          этой странице.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          Перейти в каталог
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 py-10 px-4 sm:px-6 selection:bg-purple-500/20">
      <div className="max-w-4xl mx-auto">
        {/* Верхний возврат */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Вернуться в каталог железа
        </Link>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          История ваших заказов
        </h1>
        <p className="text-xs text-zinc-500 font-semibold mb-8">
          Управляйте покупками, отслеживайте статус сборки и чеки ЮKassa.
        </p>

        {/* Список бланков заказов */}
        <div className="space-y-6">
          {orders.map((order: any) => {
            const isPaid = order.status === "SUCCEEDED";
            return (
              <div
                key={order.id}
                className="bg-zinc-900/10 border border-zinc-900 rounded-3xl p-5 md:p-6 space-y-4 hover:border-zinc-800/80 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Индикатор статуса сбоку */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full transition-colors ${
                    isPaid
                      ? "bg-emerald-500/40 group-hover:bg-emerald-500"
                      : "bg-amber-500/40 group-hover:bg-amber-500"
                  }`}
                />

                {/* Шапка заказа: номер, дата, статус */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900/60 text-xs font-semibold text-zinc-400">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest block">
                      Номер заказа
                    </span>
                    <span className="text-zinc-200 font-mono font-bold">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:text-right">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest block">
                        Дата оформления
                      </span>
                      <span className="text-zinc-300 font-mono">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="space-y-0.5 sm:text-right">
                      <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest block">
                        Статус
                      </span>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                          <CheckCircle2 className="h-3 'w-3" /> Оплачен
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider bg-amber-500/5 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                          <Clock className="h-3 w-3" /> Ожидает оплаты
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Содержимое комплектующих внутри заказа */}
                <div className="space-y-2.5 py-1">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 bg-zinc-900/30 border border-zinc-900/40 p-3 rounded-2xl"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 bg-white rounded-xl p-0.5 shrink-0 flex items-center justify-center border border-zinc-900 shadow-inner">
                          <img
                            src={item.product.images || "/gpu1.jpg"}
                            alt={item.product.name}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-zinc-200 truncate pr-4">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-mono font-bold">
                            {item.quantity} шт. ×{" "}
                            {item.price.toLocaleString("ru-RU")} ₽
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-zinc-400 font-mono shrink-0">
                        {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  ))}
                </div>

                {/* Нижняя часть: Итог */}
                <div className="pt-3 border-t border-zinc-900/60 flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Сумма заказа:
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm sm:text-base font-black text-white font-mono tracking-tight">
                      {order.totalAmount.toLocaleString("ru-RU")} ₽
                    </span>

                    {/* Если заказ завис в PENDING, даем быструю кнопку доплатить шлюзом */}
                    {!isPaid && (
                      <Link
                        href={`/cart?status=success&orderId=${order.id}`}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                      >
                        Оплатить сейчас
                      </Link>
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
