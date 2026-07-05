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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center text-center p-4">
        <Loader2 className="h-5 w-5 text-zinc-950 animate-spin mb-3 stroke-[1.5]" />
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
          Проверка транзакции...
        </p>
      </div>
    );
  }

  if (isSuccess && orderData) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center py-16 px-4 selection:bg-zinc-950 selection:text-white">
        <div className="h-12 w-12 rounded-none bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-950 mb-4">
          <CheckCircle2 className="h-5 w-5 stroke-[1.5]" />
        </div>

        <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-950 mb-1 text-center">
          Заказ успешно оплачен
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mb-10 text-center leading-relaxed font-normal">
          Транзакция подтверждена. Конфигурация принята в производство.
          Специалисты VoltPC приступили к сборке и тестированию компонентов.
        </p>

        <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-none p-6 space-y-6 text-left">
          {/* Параметры спецификации */}
          <div className="grid grid-cols-2 gap-4 pb-5 border-b border-zinc-200 text-xs font-medium text-zinc-500">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-black text-zinc-400 tracking-widest block">
                Номер документа
              </span>
              <span className="text-zinc-950 font-mono font-bold">
                #{orderData.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[9px] uppercase font-black text-zinc-400 tracking-widest block">
                Статус
              </span>
              <span className="inline-flex items-center text-zinc-950 font-bold text-[9px] uppercase tracking-widest border border-zinc-950 px-2 py-0.5 rounded-none bg-white">
                Подтвержден
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-black text-zinc-400 tracking-widest block">
                Клиент
              </span>
              <span className="text-zinc-900">{orderData.customerName}</span>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[9px] uppercase font-black text-zinc-400 tracking-widest block">
                Адрес уведомлений
              </span>
              <span className="text-zinc-900 truncate block max-w-[180px] md:max-w-none">
                {orderData.customerEmail}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2">
              Спецификация компонентов
            </span>
            <div className="border-t border-l border-zinc-200">
              {orderData.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 bg-white border-r border-b border-zinc-200 p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 bg-white rounded-none p-0.5 shrink-0 flex items-center justify-center border border-zinc-100 mix-blend-multiply">
                      <img
                        src={item.product.images[0] || item.product.images}
                        alt={item.product.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-medium text-zinc-900 truncate pr-2">
                        {item.product.name}
                      </h5>
                      <span className="text-[11px] text-zinc-400 font-mono font-normal">
                        {item.quantity} шт. ×{" "}
                        {item.price.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-950 font-mono shrink-0">
                    {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Итоговая стоимость:
            </span>
            <span className="text-base font-bold text-zinc-950 font-mono tracking-tight">
              {orderData.totalAmount.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-none text-[10px] font-black uppercase tracking-widest transition-colors active:scale-[0.98] cursor-pointer"
        >
          Вернуться в каталог
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center text-center p-4">
      <div className="h-12 w-12 rounded-none bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4">
        <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
      </div>
      <h2 className="text-base font-bold uppercase tracking-tight text-zinc-950 mb-1">
        Ваша корзина пуста
      </h2>
      <p className="text-xs text-zinc-400 max-w-xs mb-8 font-normal leading-relaxed">
        Вы еще не добавили ни одного компонента. Перейдите в каталог для подбора
        процессоров, видеокарт или материнских плат.
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
