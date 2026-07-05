"use client";

import React from "react";
import { useCart } from "@/store/useCart";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItemList() {
  const { items, updateQuantity, removeItem } = useCart();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-4 flex items-center gap-4 relative overflow-hidden group hover:border-zinc-800/80 transition-colors duration-300"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-600/30 group-hover:bg-purple-500 transition-colors" />

          <div className="relative h-20 w-20 bg-white rounded-xl overflow-hidden p-1 shrink-0 border border-zinc-900">
            <img
              src={item.image}
              alt={item.name}
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-70">
              <h4 className="font-extrabold text-zinc-100 text-sm leading-tight line-clamp-1 group-hover:text-purple-400 transition-colors">
                {item.name}
              </h4>
              <span className="text-xs font-mono font-bold text-zinc-500 block">
                {item.price.toLocaleString("ru-RU")} ₽ / шт.
              </span>
            </div>

            {/* Счётчик */}
            <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-1 shrink-0">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-7 w-7 rounded-lg hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-xs font-black text-white font-mono">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-7 w-7 rounded-lg hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Цена позиции и удаление */}
            <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-900/60">
              <span className="text-sm sm:text-base font-black text-white font-mono">
                {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="h-8 w-8 rounded-xl border border-zinc-900 bg-zinc-900/20 text-zinc-500 hover:text-red-400 hover:border-red-900/30 hover:bg-red-500/5 transition-all flex items-center justify-center cursor-pointer active:scale-95"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
