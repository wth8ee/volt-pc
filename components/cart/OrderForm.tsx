"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/context/AuthProvider";
import { CreditCard, Loader2 } from "lucide-react";

export default function OrderForm() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { session } = useAuth() as any;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !name || !email) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          items: items.map((i) => ({
            id: i.id,
            price: i.price,
            quantity: i.quantity,
          })),
          totalAmount: getTotalPrice(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.error || "Ошибка создания шлюза");

      clearCart();
      window.location.href = data.confirmationUrl;
    } catch (err: any) {
      setError(err.message || "Ошибка перехода к оплате.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-none p-6 sticky top-24 select-none">
      <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider mb-4 pb-3 border-b border-zinc-200">
        Ваш чек визита
      </h3>

      <div className="space-y-2.5 pb-4 border-b border-zinc-200 text-xs font-medium text-zinc-500">
        <div className="flex justify-between">
          <span>Товары в корзине</span>
          <span className="text-zinc-950 font-mono font-bold">
            {items.reduce((acc, i) => acc + i.quantity, 0)} шт.
          </span>
        </div>
        <div className="flex justify-between">
          <span>Доставка VoltExpress</span>
          <span className="text-zinc-950 uppercase font-black tracking-widest text-[10px]">
            Бесплатно
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between my-5">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Сумма заказа:
        </span>
        <span className="text-base sm:text-lg font-bold text-zinc-950 font-mono tracking-tight">
          {getTotalPrice().toLocaleString("ru-RU")} ₽
        </span>
      </div>

      <form onSubmit={handleCheckout} className="space-y-4 mt-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
            Ваше имя
          </label>
          <input
            type="text"
            required
            placeholder="Алексей"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-950 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
            Email для чека
          </label>
          <input
            type="email"
            required
            placeholder="alex@voltpc.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-950 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 transition-colors"
          />
        </div>

        {error && (
          <div className="p-3 rounded-none bg-zinc-50 border border-zinc-200 text-red-600 text-[11px] font-bold text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-none text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
              <span>Генерация шлюза...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-3.5 w-3.5 stroke-[1.8]" />
              <span>Оплатить заказ</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
