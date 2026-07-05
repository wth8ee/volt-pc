import React from "react";
import Image from "next/image";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarFilters from "@/components/SidebarFilters";
import { getFilteredProducts } from "@/lib/actions";
import { ShoppingCart, PackageX, Cpu } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const result = await getFilteredProducts({
    category: resolvedParams.category,
    brand: resolvedParams.brand,
    minPrice: resolvedParams.minPrice
      ? Number(resolvedParams.minPrice)
      : undefined,
    maxPrice: resolvedParams.maxPrice
      ? Number(resolvedParams.maxPrice)
      : undefined,
    inStock: resolvedParams.inStock === "true",
  });

  const products = result.success && result.data ? result.data : [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white text-zinc-950 selection:bg-zinc-900 selection:text-white">
        <SidebarFilters />

        <main className="flex-1 p-6 md:p-10 border-l border-zinc-200">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 rounded-none h-10 w-10 p-0 cursor-pointer transition-colors" />
              <div>
                <h1 className="text-2xl font-normal text-zinc-950 tracking-tight uppercase">
                  Компоненты /{" "}
                  <span className="text-zinc-400 font-light">Каталог</span>
                </h1>
                <p className="text-xs text-zinc-400 font-mono mt-1 uppercase tracking-wider">
                  Всего позиций в базе: {products.length}
                </p>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="h-[400px] border border-zinc-200 rounded-none flex flex-col items-center justify-center text-center p-8 bg-zinc-50">
              <PackageX className="w-8 h-8 text-zinc-300 mb-3 stroke-1" />
              <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-400 mb-1">
                Архив пуст
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed font-medium">
                Попробуйте изменить параметры фильтрации или сбросить настройки
                бренда.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-zinc-200">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border-r border-b border-zinc-200 p-6 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors duration-200 group relative"
                >
                  <div className="relative aspect-square w-full bg-white overflow-hidden mb-6 flex items-center justify-center mix-blend-multiply">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className={`object-contain p-4 group-hover:scale-102 transition-transform duration-300 ${
                        !product.inStock ? "opacity-25 grayscale" : ""
                      }`}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold text-zinc-950 border border-zinc-950 px-1.5 py-0.5 rounded-none uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">
                          {product.category.name}
                        </span>
                      </div>

                      <h4 className="font-medium text-zinc-900 text-sm leading-snug group-hover:text-zinc-600 transition-colors min-h-[40px] line-clamp-2">
                        {product.name}
                      </h4>

                      <p className="text-xs text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-200/60 min-h-[48px] flex items-center justify-between">
                      {product.inStock ? (
                        <>
                          <span className="text-base font-bold text-zinc-950 tracking-tight font-mono">
                            {product.price.toLocaleString("ru-RU")} ₽
                          </span>
                          <AddToCartButton product={product} />
                        </>
                      ) : (
                        <div className="w-full py-2 bg-zinc-100 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest rounded-none">
                          Архив / Нет в наличии
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
