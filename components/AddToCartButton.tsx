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
      <div className="h-9 inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 animate-in fade-in zoom-in-95 duration-200">
        {/* Кнопка минус или удалить (если осталась 1 штука) */}
        {cartItem.quantity === 1 ? (
          <button
            onClick={() => removeItem(product.id)}
            className="h-7 w-7 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer active:scale-90"
            title="Удалить из корзины"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
            className="h-7 w-7 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
          >
            <Minus className="h-3 w-3" />
          </button>
        )}

        {/* Цифра количества */}
        <span className="w-7 text-center text-xs font-black text-white font-mono selection:bg-transparent">
          {cartItem.quantity}
        </span>

        {/* Кнопка плюс */}
        <button
          onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
          className="h-7 w-7 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    );
  }

  // ЕСЛИ ТОВАРА НЕТ В КОРЗИНЕ: Показываем дефолтную кнопку «Купить»
  return (
    <button
      onClick={handleAddFirst}
      className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md shadow-purple-600/5 hover:shadow-purple-600/15"
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      <span>Купить</span>
    </button>
  );
}
