"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/store/useCart";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const [mounted, setMounted] = useState(false);

  // Избегаем ошибок гидратации Next.js при чтении LocalStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-24 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
    );
  }

  // Ищем, добавлен ли этот конкретный девайс в корзину
  const cartItem = items.find((item) => item.id === product.id);

  const handleAddFirst = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/gpu1.jpg",
    });
  };

  // ЕСЛИ ТОВАР УЖЕ В КОРЗИНЕ: Показываем продвинутый счётчик
  if (cartItem) {
    return (
      <div className="h-9 inline-flex items-center border border-zinc-950 rounded-none bg-white overflow-hidden text-zinc-950 select-none animate-in fade-in duration-100">
        {/* Кнопка минус или удалить */}
        {cartItem.quantity === 1 ? (
          <button
            onClick={() => removeItem(product.id)}
            className="h-full w-9 hover:bg-zinc-50 flex items-center justify-center border-r border-zinc-200 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer outline-none"
            title="Удалить"
          >
            <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
          </button>
        ) : (
          <button
            onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
            className="h-full w-9 hover:bg-zinc-50 flex items-center justify-center border-r border-zinc-200 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer outline-none"
          >
            <Minus className="h-3 w-3 stroke-[2]" />
          </button>
        )}

        {/* Цифра количества */}
        <span className="w-8 text-center text-xs font-mono font-bold tracking-tight text-zinc-950 bg-white">
          {cartItem.quantity}
        </span>

        {/* Кнопка плюс */}
        <button
          onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
          className="h-full w-9 hover:bg-zinc-50 flex items-center justify-center border-l border-zinc-200 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer outline-none"
        >
          <Plus className="h-3 w-3 stroke-[2]" />
        </button>
      </div>
    );
  }

  // ЕСЛИ ТОВАРА НЕТ В КОРЗИНЕ: Показываем дефолтную кнопку «Купить»
  return (
    <button
      onClick={handleAddFirst}
      className="h-9 px-4 rounded-none bg-zinc-950 hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
    >
      <ShoppingCart className="h-3.5 w-3.5 stroke-[1.8]" />
      <span>Купить</span>
    </button>
  );
}
