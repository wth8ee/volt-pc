"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { UserPlus, Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { mergeCartWithDb } from "@/lib/cart-actions";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (authError) {
      setError(
        authError.message || "Ошибка при регистрации. Попробуйте снова.",
      );
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
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-purple-500/20">
      {/* Кнопка назад */}
      <div className="w-full max-w-sm mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Назад в магазин
        </Link>
      </div>

      {/* Карточка формы */}
      <div className="w-full max-w-sm bg-zinc-900/30 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 shadow-lg shadow-purple-500/5">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            Создать аккаунт
          </h1>
          <p className="text-[11px] text-zinc-500 font-semibold mt-1">
            Присоединяйтесь к экосистеме VoltPC
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Имя
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
              <input
                type="text"
                required
                placeholder="Алексей"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Пароль
            </label>
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

          {error && (
            <div className="p-3 rounded-xl bg-red-550/10 border border-red-500/20 text-red-400 text-[11px] font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/10 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Регистрация...</span>
              </>
            ) : (
              <span>Зарегистрироваться</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-zinc-900 text-xs font-semibold text-zinc-500">
          Уже есть аккаунт?{" "}
          <Link
            href="/sign-up"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
}
