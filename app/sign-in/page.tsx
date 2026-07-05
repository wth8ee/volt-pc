"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogIn, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { mergeCartWithDb } from "@/lib/cart-actions";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (authError) {
      setError(authError.message || "Неверный email или пароль.");
      setLoading(false);
    } else {
      const localItems = useCart
        .getState()
        .items.map((item) => ({ id: item.id, quantity: item.quantity }));
      const res = await mergeCartWithDb(localItems);

      if (res.success && res.items) {
        useCart.setState({ items: res.items });
      }

      router.push("/");
      router.refresh();
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center p-4 selection:bg-zinc-950 selection:text-white relative">
      <div className="w-full max-w-sm mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 stroke-[1.8]" />
          <span>Назад в каталог</span>
        </Link>
      </div>

      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-none p-6 md:p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-10 w-10 rounded-none bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-950 mb-3">
            <LogIn className="h-4 w-4 stroke-[1.5]" />
          </div>
          <h1 className="text-base font-bold uppercase tracking-wider text-zinc-950">
            Авторизация
          </h1>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">
            Синхронизация профиля и корзины
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
              Email адрес
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-300 stroke-[1.8]" />
              <input
                type="email"
                required
                placeholder="example@voltpc.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-none pl-10 pr-4 py-2.5 text-xs text-zinc-950 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                Пароль
              </label>
              <Link
                href="#"
                className="text-[10px] font-bold text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-wider"
              >
                Забыли?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-300 stroke-[1.8]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-none pl-10 pr-4 py-2.5 text-xs text-zinc-950 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-none bg-zinc-50 border border-zinc-200 text-red-600 text-[11px] font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-none text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                <span>Вход в систему...</span>
              </>
            ) : (
              <span>Войти в аккаунт</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-zinc-200 text-xs font-semibold text-zinc-400">
          Впервые у нас?{" "}
          <Link
            href="/sign-up"
            className="text-zinc-950 hover:text-zinc-600 font-bold transition-colors underline underline-offset-2"
          >
            Создать аккаунт
          </Link>
        </div>
      </div>
    </main>
  );
}
