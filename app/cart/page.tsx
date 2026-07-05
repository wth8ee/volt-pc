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

  if (items.length === 0) return <CartEmpty />;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white py-12 px-4 sm:px-6 selection:bg-zinc-950 selection:text-white">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3 stroke-[2]" />
          <span>Назад в каталог</span>
        </Link>

        <h1 className="text-xl font-normal text-zinc-950 tracking-tight uppercase mb-10">
          Спецификация /{" "}
          <span className="text-zinc-400 font-light lowercase">
            оформление заказа
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <CartItemList />
          </div>

          <OrderForm />
        </div>
      </div>
    </main>
  );
}
