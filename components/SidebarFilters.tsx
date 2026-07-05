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

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand") ? searchParams.get("brand")!.split(",") : [],
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [inStock, setInStock] = useState(
    searchParams.get("inStock") === "true",
  );

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setSelectedBrands(
      searchParams.get("brand") ? searchParams.get("brand")!.split(",") : [],
    );
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setInStock(searchParams.get("inStock") === "true");
  }, [searchParams]);

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
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName],
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
    <Sidebar className="border-r border-zinc-200 bg-white text-zinc-900 pt-16">
      <SidebarHeader className="border-b border-zinc-200 bg-white p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 font-medium text-xs uppercase tracking-wider text-zinc-950">
          <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-950 stroke-[1.5]" />
          <span>Фильтры</span>
        </div>
        <button
          onClick={handleReset}
          className="text-zinc-400 hover:text-zinc-950 py-1 px-2 rounded-none transition-colors cursor-pointer flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
          title="Сбросить фильтры"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Сбросить</span>
        </button>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6 flex flex-col justify-between h-full bg-white">
        <div className="space-y-6">
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
              Категория
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setCategory(isSelected ? "" : cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-none text-xs font-medium transition-colors cursor-pointer block border ${
                      isSelected
                        ? "bg-zinc-950 border-zinc-950 text-white font-bold"
                        : "bg-white border-transparent hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
              Цена, ₽
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex items-center gap-2">
              <input
                type="number"
                placeholder="От"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-none px-3 py-2 text-xs text-zinc-950 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-zinc-300 text-xs">—</span>
              <input
                type="number"
                placeholder="До"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-none px-3 py-2 text-xs text-zinc-950 placeholder-zinc-300 focus:outline-none focus:border-zinc-950 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
              Бренд
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2.5">
              {BRENDS.map((b) => {
                const isChecked = selectedBrands.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => handleBrandChange(b)}
                    className="flex items-center gap-3 w-full text-left cursor-pointer group text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    <div
                      className={`h-3.5 w-3.5 rounded-none border flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-zinc-950 border-zinc-950 text-white"
                          : "border-zinc-200 bg-white group-hover:border-zinc-400"
                      }`}
                    >
                      {isChecked && (
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      )}
                    </div>
                    <span
                      className={isChecked ? "text-zinc-950 font-bold" : ""}
                    >
                      {b}
                    </span>
                  </button>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="p-0 pt-2">
            <SidebarGroupContentPrefix>
              <button
                onClick={() => setInStock(!inStock)}
                className="flex items-center gap-3 w-full text-left cursor-pointer group text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
              >
                <div
                  className={`h-3.5 w-3.5 rounded-none border flex items-center justify-center transition-colors ${
                    inStock
                      ? "bg-zinc-950 border-zinc-950 text-white"
                      : "border-zinc-200 bg-white group-hover:border-zinc-400"
                  }`}
                >
                  {inStock && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
                <span className={inStock ? "text-zinc-950 font-bold" : ""}>
                  Только в наличии
                </span>
              </button>
            </SidebarGroupContentPrefix>
          </SidebarGroup>
        </div>

        <div className="pt-4 border-t border-zinc-200 mt-auto flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2.5 rounded-none border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            title="Очистить все параметры"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-none bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer text-center"
          >
            Применить
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarGroupContentPrefix({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-2">{children}</div>;
}
