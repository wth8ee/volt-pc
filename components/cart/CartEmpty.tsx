"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getOrderDetails } from "@/lib/cart-actions";
import {
  ShoppingBag,
  CheckCircle2,
  Cpu,
  Calendar,
  Mail,
  Loader2,
} from "lucide-react";

export default function CartEmpty() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("status") === "success";
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(isSuccess && !!orderId);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (isSuccess && orderId) {
      const fetchOrder = async () => {
        const res = await getOrderDetails(orderId);
        if (res.success) {
          setOrderData(res.order);
        }
        setLoading(false);
      };
      fetchOrder();
    }
  }, [isSuccess, orderId]);

  // СЦЕНАРИЙ 1: Идет загрузка деталей заказа из БД
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center text-center p-4">
        <Loader2 className="h-6 w-6 text-purple-500 animate-spin mb-2" />
        <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
          Подтверждение платежа шлюзом...
        </p>
      </div>
    );
  }

  // СЦЕНАРИЙ 2: ЭКРАН УСПЕШНОЙ ОПЛАТЫ (Premium Кибер-Чек)
  // СЦЕНАРИЙ 2: ЭКРАН УСПЕШНОЙ ОПЛАТЫ (Понятный пользовательский чек)
  if (isSuccess && orderData) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 selection:bg-purple-500/20">
        {/* Анимация индикатора успеха */}
        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-xl shadow-emerald-500/5 animate-in zoom-in duration-300">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <h2 className="text-2xl font-black text-white mb-1 tracking-tight text-center">
          Заказ успешно оплачен!
        </h2>
        <p className="text-xs text-zinc-500 max-w-sm mb-8 text-center leading-relaxed font-semibold">
          Деньги получены, конфигурация принята в работу. Специалисты VoltPC уже
          приступили к сборке и подготовке вашего железа к отправке.
        </p>

        {/* Чистый бланк деталей заказа */}
        <div className="w-full max-w-xl bg-zinc-900/30 border border-zinc-900 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-2xl space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-400">
          {/* Понятные параметры заказа для обычного человека */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-900 text-xs font-semibold text-zinc-400">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest block">
                Номер заказа
              </span>
              <span className="text-zinc-200 font-mono font-bold">
                #{orderData.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest block">
                Статус заказа
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                Оплачен
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest block">
                Получатель
              </span>
              <span className="text-zinc-300">{orderData.customerName}</span>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest block">
                Почта для уведомлений
              </span>
              <span className="text-zinc-300 truncate block max-w-[180px] md:max-w-none">
                {orderData.customerEmail}
              </span>
            </div>
          </div>

          {/* Список купленного железа */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
              Состав заказа
            </span>
            {orderData.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-900/60 p-3 rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 bg-white rounded-lg p-0.5 shrink-0 flex items-center justify-center border border-zinc-900">
                    <img
                      src={item.product.images[0] || item.product.images}
                      alt={item.product.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-zinc-200 truncate pr-2">
                      {item.product.name}
                    </h5>
                    <span className="text-[11px] text-zinc-500 font-mono font-medium">
                      {item.quantity} шт. × {item.price.toLocaleString("ru-RU")}{" "}
                      ₽
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-zinc-300 font-mono shrink-0">
                  {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            ))}
          </div>

          {/* Итоговый футер чека */}
          <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Сумма заказа:
            </span>
            <span className="text-lg font-black text-white font-mono tracking-tight">
              {orderData.totalAmount.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </div>

        {/* Кнопка на главную */}
        <Link
          href="/"
          className="mt-8 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-98 cursor-pointer"
        >
          Вернуться в каталог
        </Link>
      </main>
    );
  }

  // СЦЕНАРИЙ 3: ДЕФОЛТНАЯ ПУСТАЯ КОРЗИНА (Если параметров в URL нет)
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center text-center p-4">
      <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-xl">
        <ShoppingBag className="h-5 w-5" />
      </div>
      <h2 className="text-xl font-black text-white mb-1">Ваша корзина пуста</h2>
      <p className="text-xs text-zinc-500 max-w-xs mb-6 font-semibold">
        Добавьте процессоры, видеокарты или материнские платы из каталога, чтобы
        оформить заказ.
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
