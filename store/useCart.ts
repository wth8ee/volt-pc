import { authClient } from "@/lib/auth-client";
import {
  dbClearCart,
  dbRemoveCartItem,
  dbUpdateCartItem,
} from "@/lib/cart-actions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        let newQuantity = 1;

        if (existingItem) {
          newQuantity = existingItem.quantity + 1;
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: newQuantity } : i,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] });
        }

        const session = await authClient.getSession();
        if (session?.data?.user) {
          await dbUpdateCartItem(item.id, newQuantity);
        }
      },

      removeItem: async (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));

        const session = await authClient.getSession();
        if (session?.data?.user) {
          await dbRemoveCartItem(id);
        }
      },

      updateQuantity: async (id, quantity) => {
        const targetQuantity = Math.max(1, quantity);

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: targetQuantity } : i,
          ),
        }));

        const session = await authClient.getSession();
        if (session?.data?.user) {
          await dbUpdateCartItem(id, targetQuantity);
        }
      },

      clearCart: async () => {
        set({ items: [] });

        const session = await authClient.getSession();
        if (session?.data?.user) {
          await dbClearCart();
        }
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    { name: "voltpc-cart-storage" },
  ),
);
