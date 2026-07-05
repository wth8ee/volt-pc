"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { useEffect, useState } from "react";

const BRENDS = [
  "ASUS",
  "GIGABYTE",
  "MSI",
  "Intel",
  "AMD",
  "Kingston",
  "Corsair",
  "G.Skill",
];
const CATEGORIES = [
  { name: "Видеокарты", slug: "gpus" },
  { name: "Процессоры", slug: "cpus" },
  { name: "Оперативная память", slug: "ram" },
  { name: "Материнские платы", slug: "motherboards" },
];

export default function SidebarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Храним выбранные фильтры в локальном стейте, чтобы не менять URL раньше времени
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand") ? searchParams.get("brand")!.split(",") : [],
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [inStock, setInStock] = useState(
    searchParams.get("inStock") === "true",
  );

  // Синхронизируем локальный стейт, если URL сбросили снаружи
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setSelectedBrands(
      searchParams.get("brand") ? searchParams.get("brand")!.split(",") : [],
    );
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setInStock(searchParams.get("inStock") === "true");
  }, [searchParams]);

  // Сборка всех фильтров в URL по клику на кнопку
  const handleApply = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", "true");
    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","));
    }

    router.push(`/?${params.toString()}`);
  };

  const handleBrandChange = (brandName: string) => {
    setSelectedBrands(
      (prev) =>
        prev.includes(brandName)
          ? prev.filter((b) => b !== brandName) // Удаляем, если галочка уже стояла
          : [...prev, brandName], // Добавляем, если галочки не было
    );
  };

  const handleReset = () => {
    setCategory("");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    router.push("/");
  };

  return (
    <Sidebar className="border-r border-zinc-900 bg-zinc-950 text-zinc-200 pt-16">
      <SidebarHeader className="border-b border-zinc-900 bg-zinc-950 p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-4 font-bold text-sm text-white">
          <SlidersHorizontal className="h-4 w-4 text-purple-500" />
          <span>Фильтры железа</span>
        </div>
        <button
          onClick={handleReset}
          className="text-zinc-500 hover:text-red-400 p-1 rounded-lg hover:bg-zinc-900 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
          title="Сбросить фильтры"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Сбросить</span>
        </button>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6 flex flex-col justify-between h-full bg-zinc-950">
        <div className="space-y-6">
          {/* Группа 1: Категории */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Категория
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() =>
                    setCategory(category === cat.slug ? "" : cat.slug)
                  }
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer block border ${
                    category === cat.slug
                      ? "bg-purple-600/10 border-purple-500/40 text-purple-400"
                      : "bg-zinc-900/30 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Группа 2: Цена (Скрыли стрелочки через [appearance:textfield]) */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Цена, ₽
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex items-center gap-2">
              <input
                type="number"
                placeholder="От"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-zinc-700 text-xs">—</span>
              <input
                type="number"
                placeholder="До"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Группа 3: Бренды (Кастомные стильные чекбоксы) */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Бренд
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3">
              {BRENDS.map((b) => {
                const isChecked = selectedBrands.includes(b); // 🔥 Проверяем вхождение в массив
                return (
                  <button
                    key={b}
                    onClick={() => handleBrandChange(b)}
                    className="flex items-center gap-3 w-full text-left cursor-pointer group text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <div
                      className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "border-zinc-800 bg-zinc-900 group-hover:border-zinc-700"
                      }`}
                    >
                      {isChecked && <Check className="h-2.5 w-2.5" />}
                    </div>
                    <span>{b}</span>
                  </button>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Группа 4: Статус */}
          <SidebarGroup className="p-0 pt-2">
            <SidebarGroupContentPrefix>
              <button
                onClick={() => setInStock(!inStock)}
                className="flex items-center gap-3 w-full text-left cursor-pointer group text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <div
                  className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all ${
                    inStock
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "border-zinc-800 bg-zinc-900 group-hover:border-zinc-700"
                  }`}
                >
                  {inStock && <Check className="h-2.5 w-2.5 stroke-[4]" />}
                </div>
                <span>Только в наличии</span>
              </button>
            </SidebarGroupContentPrefix>
          </SidebarGroup>
        </div>

        <div className="pt-4 border-t border-zinc-900 mt-auto flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2.5 rounded-xl border border-zinc-900 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            title="Очистить все параметры"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/10 active:scale-98 cursor-pointer text-center"
          >
            Применить
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

// Заглушка, чтобы не ломать типы shadcn, если структура строгая
function SidebarGroupContentPrefix({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-2">{children}</div>;
}
