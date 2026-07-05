"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Zap,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/store/useCart";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Импорты shadcn dropdown (если используешь, иначе закомментируй и сделаем кастомный)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDbCart } from "@/lib/cart-actions";

export default function Navbar() {
  const router = useRouter();
  const { session } = useAuth() as any; // вытаскиваем сессию из твоего провайдера
  // const getTotalItems = useCart((state) => state.getTotalItems);
  const [totalItems, setTotalItems] = useState(0);
  const cartItems = useCart((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setTotalItems(count);

    const syncCartOnLoad = async () => {
      const res = await getDbCart();
      if (res.success && res.items.length > 0) {
        useCart.setState({ items: res.items });
      }
    };

    if (!mounted) {
      syncCartOnLoad();
    }
  }, [cartItems, session]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  // Вытаскиваем первую букву имени для дефолтной аватарки
  const userInitials = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950 backdrop-blur-md selection:bg-purple-500/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Логотип бренда */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center text-purple-500 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300">
            <Zap className="h-5 w-5 fill-purple-500/10" />
          </div>
          <span className="text-lg font-black tracking-tight text-white group-hover:text-purple-400 transition-colors">
            Volt<span className="text-zinc-500 font-medium">PC</span>
          </span>
        </Link>

        {/* Навигационные ссылки */}
        <nav className="hidden md:flex items-center gap-6 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
          <Link
            href="/"
            className="text-white hover:text-purple-400 transition-colors"
          >
            Каталог
          </Link>
          <Link href="#" className="hover:text-purple-400 transition-colors">
            Сборщик ПК
          </Link>
          <Link href="#" className="hover:text-purple-400 transition-colors">
            Гарантия
          </Link>
          <Link href="#" className="hover:text-purple-400 transition-colors">
            Доставка
          </Link>
        </nav>

        {/* Правый блок */}
        <div className="flex items-center gap-4">
          {/* ================= ЛОГИКА АВТОРИЗАЦИИ В НАВБАРЕ ================= */}
          {mounted && session?.user ? (
            // ЕСЛИ ЮЗЕР ВОШЕЛ: Показываем премиальный выпадающий список профиля
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none cursor-pointer group">
                <div className="h-8 w-8 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-black shadow-inner shadow-purple-500/5 group-hover:border-purple-400 transition-colors">
                  {<span>{userInitials}</span>}
                </div>
                <ChevronDown className="h-3 w-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-zinc-950 border border-zinc-900 rounded-2xl p-2 text-zinc-300 shadow-xl mt-1">
                <DropdownMenuLabel className="px-2.5 py-2">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-xs font-black text-white truncate">
                      {session.user.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium truncate">
                      {session.user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-900 my-1" />

                <Link href="/orders" className="block w-full">
                  <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold rounded-xl hover:bg-zinc-900 hover:text-white cursor-pointer transition-colors">
                    <Package className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Мои заказы</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold rounded-xl hover:bg-zinc-900 hover:text-white cursor-pointer">
                  <Shield className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Личный кабинет</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-zinc-900 my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-red-400 rounded-xl hover:bg-red-550/10 hover:text-red-400 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Выйти из аккаунта</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // ЕСЛИ ЮЗЕР ГОСТЬ: Показываем красивую пустую иконку, ведущую на логин
            <Link
              href="/sign-in" // Поменяли /sign-up на /login, оттуда он сможет и зарегистрироваться
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
              title="Войти в личный кабинет"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/10 hover:bg-purple-500 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-zinc-950 font-mono ring-2 ring-zinc-950 animate-in zoom-in duration-200">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
