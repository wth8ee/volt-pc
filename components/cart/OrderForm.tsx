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
    <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-5 md:p-6 sticky top-24">
      <h3 className="text-base font-black text-white tracking-tight mb-4 pb-3 border-b border-zinc-900">
        Ваш чек визита
      </h3>

      <div className="space-y-2 pb-4 border-b border-zinc-900 text-xs font-semibold text-zinc-500">
        <div className="flex justify-between">
          <span>Товары в корзине</span>
          <span className="text-zinc-300 font-mono">
            {items.reduce((acc, i) => acc + i.quantity, 0)} шт.
          </span>
        </div>
        <div className="flex justify-between">
          <span>Доставка VoltExpress</span>
          <span className="text-emerald-500 uppercase font-bold tracking-wider">
            Бесплатно
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between my-5">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Итого к оплате:
        </span>
        <span className="text-lg md:text-xl font-black text-white font-mono tracking-tight">
          {getTotalPrice().toLocaleString("ru-RU")} ₽
        </span>
      </div>

      <form onSubmit={handleCheckout} className="space-y-4 mt-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
            Ваше имя
          </label>
          <input
            type="text"
            required
            placeholder="Алексей"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
            Email для чека
          </label>
          <input
            type="email"
            required
            placeholder="alex@voltpc.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-550/10 border border-red-500/20 text-red-400 text-[11px] font-bold text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Генерация шлюза...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-3.5 w-3.5" />
              <span>Оплатить картой / СБП</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
