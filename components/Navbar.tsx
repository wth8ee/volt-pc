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
  const { session } = useAuth() as any;
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

  const userInitials = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-250 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center text-zinc-950 transition-colors">
            <Zap className="h-4.5 w-4.5 fill-zinc-950/5 stroke-[1.8]" />
          </div>
          <span className="text-base font-black uppercase tracking-widest text-zinc-950 group-hover:text-zinc-600 transition-colors">
            Volt
            <span className="text-zinc-400 font-light font-sans lowercase">
              pc
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <Link
            href="/"
            className="text-zinc-950 hover:text-zinc-500 transition-colors"
          >
            Каталог
          </Link>
          <Link href="#" className="hover:text-zinc-500 transition-colors">
            Сборщик ПК
          </Link>
          <Link href="#" className="hover:text-zinc-500 transition-colors">
            Гарантия
          </Link>
          <Link href="#" className="hover:text-zinc-500 transition-colors">
            Доставка
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {mounted && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 outline-none cursor-pointer group">
                <div className="h-8 w-8 rounded-none border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-950 text-xs font-black group-hover:border-zinc-950 transition-colors">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-full w-full object-cover rounded-none"
                    />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>
                <ChevronDown className="h-3 w-3 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-white border border-zinc-200 rounded-none p-0 text-zinc-800 shadow-xl mt-1 animate-in fade-in duration-100 z-50">
                <div className="px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-xs font-bold text-zinc-950 tracking-tight">
                      {session.user.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium font-mono">
                      {session.user.email}
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <Link href="/orders" className="block w-full">
                    <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-none text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 cursor-pointer transition-colors outline-none data-[disabled]:pointer-events-none">
                      <Package className="h-3.5 w-3.5 text-zinc-400 stroke-[1.5]" />
                      <span>Мои заказы</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-none text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 cursor-pointer transition-colors outline-none data-[disabled]:pointer-events-none">
                    <Shield className="h-3.5 w-3.5 text-zinc-400 stroke-[1.5]" />
                    <span>Личный кабинет</span>
                  </DropdownMenuItem>
                </div>

                <div className="h-[1px] bg-zinc-100" />

                <div className="p-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-none text-red-600 hover:bg-red-50/50 cursor-pointer transition-colors outline-none data-[disabled]:pointer-events-none"
                  >
                    <LogOut className="h-3.5 w-3.5 stroke-[1.8]" />
                    <span className="font-bold">Выйти из аккаунта</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/sign-in"
              className="flex h-8 w-8 items-center justify-center rounded-none border border-zinc-200 text-zinc-400 hover:text-zinc-950 hover:border-zinc-950 transition-colors cursor-pointer"
              title="Войти в личный кабинет"
            >
              <User className="h-3.5 w-3.5 stroke-[1.8]" />
            </Link>
          )}
          <Link
            href="/cart"
            className="relative flex h-8 w-8 items-center justify-center rounded-none bg-zinc-950 text-white hover:bg-zinc-800 transition-colors"
          >
            <ShoppingCart className="h-3.5 w-3.5 stroke-[1.8]" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-none bg-zinc-950 text-[8px] font-black text-white font-mono ring-1 ring-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
