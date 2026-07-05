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

    // Вызываем метод авторизации Better Auth по связке email + password
    const { error: authError } = await authClient.signIn.email({
      email,
      password,
      // Автоматически перенаправляем на главную после успешного входа
      callbackURL: "/",
    });

    if (authError) {
      // Если пароль не подошел или юзера нет, Better Auth вернет понятную ошибку
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
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-purple-500/20 relative overflow-hidden">
      {/* Декоративное фоновое неоновое свечение (кибер-бэкграунд) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Верхняя кнопка возврата */}
      <div className="w-full max-w-sm mb-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Назад в каталог
        </Link>
      </div>

      {/* Контейнер глянцевой формы */}
      <div className="w-full max-w-sm bg-zinc-900/30 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 shadow-lg shadow-purple-500/5">
            <LogIn className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            Авторизация
          </h1>
          <p className="text-[11px] text-zinc-500 font-semibold mt-1">
            Войдите, чтобы синхронизировать корзину и заказы
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Поле Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Email адрес
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
              <input
                type="email"
                required
                placeholder="example@voltpc.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Поле Пароля */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
                Пароль
              </label>
              <Link
                href="#"
                className="text-[10px] font-bold text-purple-500 hover:text-purple-400 transition-colors"
              >
                Забыли?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Блок вывода ошибок валидации Better Auth */}
          {error && (
            <div className="p-3 rounded-xl bg-red-550/10 border border-red-500/20 text-red-400 text-[11px] font-bold text-center animate-in fade-in zoom-in-95 duration-150">
              {error}
            </div>
          )}

          {/* Кнопка отправки формы */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/10 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Вход в систему...</span>
              </>
            ) : (
              <span>Войти в аккаунт</span>
            )}
          </button>
        </form>

        {/* Пересылка на регистрацию */}
        <div className="text-center mt-6 pt-4 border-t border-zinc-900 text-xs font-semibold text-zinc-500">
          Впервые у нас?{" "}
          <Link
            href="/sign-up"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Создать аккаунт
          </Link>
        </div>
      </div>
    </main>
  );
}
