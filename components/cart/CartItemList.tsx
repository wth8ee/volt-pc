"use client";

import React from "react";
import { useCart } from "@/store/useCart";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItemList() {
  const { items, updateQuantity, removeItem } = useCart();

  return (
    <div className="border-t border-l border-zinc-200">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border-r border-b border-zinc-200 p-4 flex items-center gap-6 relative overflow-hidden group hover:bg-zinc-50/50 transition-colors duration-200"
        >
          <div className="relative h-20 w-20 bg-white overflow-hidden p-1 shrink-0 flex items-center justify-center mix-blend-multiply">
            <img
              src={item.image}
              alt={item.name}
              className="object-contain w-full h-full p-1 group-hover:scale-102 transition-transform duration-300"
            />
          </div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
            <div className="space-y-1 max-w-70 min-w-0">
              <h4 className="font-medium text-zinc-900 text-sm leading-snug group-hover:text-zinc-600 transition-colors truncate pr-2">
                {item.name}
              </h4>
              <span className="text-xs font-mono font-medium text-zinc-400 block">
                {item.price.toLocaleString("ru-RU")} ₽ / шт.
              </span>
            </div>

            <div className="h-9 inline-flex items-center border border-zinc-200 rounded-none bg-white overflow-hidden shrink-0 select-none">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-full w-8 hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer outline-none"
              >
                <Minus className="h-3 w-3 stroke-[1.8]" />
              </button>
              <span className="w-8 text-center text-xs font-mono font-bold text-zinc-950 bg-white">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-full w-8 hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer outline-none"
              >
                <Plus className="h-3 w-3 stroke-[1.8]" />
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 min-w-[140px]">
              <span className="text-sm font-bold text-zinc-950 font-mono tracking-tight">
                {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="h-8 w-8 rounded-none border border-zinc-200 bg-white text-zinc-400 hover:text-red-600 hover:border-zinc-300 transition-colors flex items-center justify-center cursor-pointer active:scale-[0.96]"
                title="Удалить из корзины"
              >
                <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
