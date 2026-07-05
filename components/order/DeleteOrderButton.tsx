"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { dbDeleteOrder } from "@/lib/cart-actions";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

// Импортируем компоненты Dialog из shadcn
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteOrderButtonProps {
  orderId: string;
}

export default function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setIsOpen] = useState(false); // Стейт открытия окна

  const handleDelete = async () => {
    setLoading(true);
    const res = await dbDeleteOrder(orderId);

    if (res.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      alert(res.error || "Не удалось аннулировать документ");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      {/* Триггер — наша строгая прямоугольная кнопка корзины */}
      <DialogTrigger asChild>
        <button
          className="h-8 px-3 border border-zinc-200 bg-white text-zinc-400 hover:text-red-600 hover:border-zinc-300 transition-colors flex items-center justify-center rounded-none cursor-pointer active:scale-[0.96]"
          title="Аннулировать неоплаченный документ"
        >
          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
        </button>
      </DialogTrigger>

      {/* Контент всплывающего окна в строгом швейцарском стиле */}
      <DialogContent className="bg-white border border-zinc-200 rounded-none max-w-sm p-6 gap-0 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-zinc-950">
            <AlertTriangle className="h-4 w-4 text-zinc-950 stroke-[2]" />
            <DialogTitle className="text-xs uppercase font-black tracking-widest">
              Аннулирование
            </DialogTitle>
          </div>

          <DialogDescription className="text-xs text-zinc-400 font-normal leading-relaxed pt-2">
            Вы собираетесь полностью удалить неоплаченный заказ из базы данных
            VoltPC. Данное действие является необратимым, спецификация
            компонентов будет стёрта.
          </DialogDescription>
        </DialogHeader>

        {/* Прямоугольные кнопки управления встык */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-100">
          <button
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="flex-1 py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950 text-[10px] font-bold uppercase tracking-widest rounded-none border border-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            Отмена
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest rounded-none transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-white" />
                <span>Удаление...</span>
              </>
            ) : (
              <span>Удалить заказ</span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
