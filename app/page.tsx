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
  // 1. Дожидаемся разбора параметров из URL-строки браузера
  const resolvedParams = await searchParams;

  // 2. Вызываем наш Server Action напрямую на стороне сервера
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
    // Оборачиваем страницу в обязательный провайдер от shadcn
    <SidebarProvider>
      <div className="flex min-h-[calc(screen-16rem)] w-full bg-zinc-950">
        {/* Боковая панель фильтрации */}
        <SidebarFilters />

        {/* Главная контентная зона каталога */}
        <main className="flex-1 p-6 md:p-8">
          {/* Верхняя плашка управления каталогом */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
            <div className="flex items-center gap-3">
              {/* Кнопка триггера, которая умеет прятать сайдбар на мобилках */}
              <SidebarTrigger className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl h-9 w-9 p-0 cursor-pointer" />
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Железо и комплектующие
                </h1>
                <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                  Найдено позиций в базе: {products.length}
                </p>
              </div>
            </div>
          </div>

          {/* Условие: Если по фильтрам ничего не найдено в базе */}
          {products.length === 0 ? (
            <div className="h-[400px] border border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-zinc-900/10 backdrop-blur-sm">
              <PackageX className="w-10 h-10 text-zinc-700 mb-4" />
              <h3 className="text-base font-bold text-zinc-400 mb-1">
                Ничего не найдено
              </h3>
              <p className="text-xs text-zinc-600 max-w-xs leading-relaxed font-medium">
                Сбросьте параметры фильтрации или выберите другой бренд
                комплектующих.
              </p>
            </div>
          ) : (
            // Сетка карточек товаров (3 колонки на десктопе)
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-zinc-900/20 border border-zinc-900/80 rounded-3xl p-5 flex flex-col justify-between hover:border-zinc-800 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-600/30 group-hover:bg-purple-500 transition-colors" />

                  {/* Изображение товара (для отсутствующих товаров добавляется легкая прозрачность) */}
                  <div className="relative aspect-square w-full bg-white rounded-2xl p-4 overflow-hidden mb-5 flex items-center justify-center border border-zinc-900 shadow-inner">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className={`object-contain p-2 group-hover:scale-103 transition-transform duration-500 ${
                        !product.inStock ? "opacity-35" : ""
                      }`}
                    />
                  </div>

                  {/* Инфо-блок товара */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold text-purple-400 bg-purple-500/5 border border-purple-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          {product.category.name}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-zinc-100 text-sm leading-snug group-hover:text-purple-400 transition-colors min-h-[44px] line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {product.description}
                      </p>
                    </div>

                    {/* Зона цены и кнопки (меняется в зависимости от наличия товара) */}
                    <div className="pt-4 border-t border-zinc-900/60 min-h-[54px] flex items-center justify-between">
                      {product.inStock ? (
                        <>
                          <span className="text-base md:text-lg font-black text-white tracking-tight">
                            {product.price.toLocaleString("ru-RU")} ₽
                          </span>
                          {/* <button className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-98 shadow-md">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Купить</span>
                          </button> */}
                          <AddToCartButton product={product} />
                        </>
                      ) : (
                        <div className="w-full py-2 rounded-xl bg-zinc-900/50 border border-zinc-900 text-center text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                          Нет в наличии
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
