"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { ArrowLeft } from "lucide-react";
import CartEmpty from "@/components/cart/CartEmpty";
import CartItemList from "@/components/cart/CartItemList";
import OrderForm from "@/components/cart/OrderForm";

export default function CartPage() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Если пустая — отдаем первый изолированный компонент
  if (items.length === 0) return <CartEmpty />;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 py-10 px-4 sm:px-6 selection:bg-purple-500/20">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Вернуться в каталог железа
        </Link>

        <h1 className="text-2xl font-black text-white tracking-tight mb-8">
          Оформление заказа
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Левая часть: список товаров */}
          <div className="lg:col-span-2">
            <CartItemList />
          </div>

          {/* Правая часть: форма и чек */}
          <OrderForm />
        </div>
      </div>
    </main>
  );
}
